import React from 'react'
import Header from './components/Header'
import URL from './components/URL'
import Login from './components/Login'
import NavbarClean from './components/NavbarClean'
import { usersCollection } from './firebase'
import { addDoc, getDocs, updateDoc, onSnapshot, collection } from 'firebase/firestore'
import { auth } from "./firebase"
import { gapi } from 'gapi-script'
const API_KEY = import.meta.env.VITE_GAPI_KEY
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const SCOPES = import.meta.env.VITE_SCOPES



export default function App() {
    // used to decide which components to render (login/URL...)
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    
    const user = auth.currentUser

    React.useEffect(() => {
        // firebase function (check if authentication changes...)
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(user !== null) // update isAuthenticated based on if user signed in
        })
        return unsubscribe
    }, [])

    // load + initialize google docs API library (API_KEY, CLIENT_ID, SCOEPS retrieved from Google Cloud Console...)
    React.useEffect(() => {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES,
            })
        })
    }, [])

    // function to sign out (with firebase authentication)
    const handleSignOut = async () => {
        try {
            // IMPORTANT: if authenticated with google DOCS api --> sign out (prevents altering somebody else's google docs)
            if (gapi.auth2) {
                await gapi.auth2.getAuthInstance().signOut()
            }
            // additionally, sign out with FIREBASE
            await auth.signOut()
            console.log("Successfully signed out")
        } catch (error) {
            console.log("Error signing out:", error)
        }
    }

    // set dark/light mode theme
    const [theme, setTheme] = React.useState("dark")
    // use flag to determine if theme is toggled (avoids infinite recursion in useEffect)
    // const [toggled, setToggled] = React.useState(true)

    // maintain `theme` with firebase
    React.useEffect(() => {
        // only store theme if firebase authenticated
        if (isAuthenticated) {
            // find user and theme collection
            const userID = user.uid
            const currentUserCollection = collection(usersCollection, `${userID}/theme`)
            // run `setTheme` anytime `theme` collection changes
            const unsubscribe = onSnapshot(currentUserCollection, async function (snapshot) {
                    // obtain doc (if exists) containing theme
                    if (!snapshot.empty) {
                        const themeDoc = snapshot.docs[0].data()
                        console.log("snapshot:", themeDoc)
                        setTheme(themeDoc.theme)
                    } else {
                        console.log("no data yet")
                        try {
                            await addDoc(currentUserCollection, {theme: theme})
                        } catch (error) {
                            console.log("Error initializing theme with firestore:", error)
                        }
                    }
                }
            )
            return unsubscribe // return clean-up function
        }
    }, [isAuthenticated]) // re-run every time authentication changes (or component mounts --> page refresh)


    const toggleTheme = async () => {
        // if user is authenticated, save new theme to firebase
        if (isAuthenticated) {
            try {
                const userID = user.uid
                const newTheme = theme === "light" ? "dark" : "light"
                const currentUserCollection = collection(usersCollection, `${userID}/theme`)
                // fetch documents in currentUserCollection
                const querySnapshot = await getDocs(currentUserCollection)
                // ensure that documents exists
                if (!querySnapshot.empty) {
                    // obtain theme doc
                    const themeDoc = querySnapshot.docs[0]
                    console.log("theme", themeDoc)

                    // update theme document
                    updateDoc(themeDoc.ref, {theme: newTheme})
                }

            } catch (error) {
                console.log("error saving theme:", error)
            }
        // otherwise, simply change theme state (don't save to firebase)
        } else {
            setTheme(currTheme => (currTheme === "light" ? "dark" : "light"))
        }
    }
    // IMPORTANT: allows use to reference "body.dark" in style.css file
    document.body.className = theme;
    
    return (
        // IMPORTANT: `id={theme}` allows use to reference theme for `*` in style.css
        <main id={theme}>
            {isAuthenticated ? 
                <URL 
                    user={user} 
                    handleSignOut={handleSignOut}
                    toggleTheme={toggleTheme}
                    theme={theme}
                /> 
                : 
                <div>
                    <NavbarClean
                        toggleTheme={toggleTheme}
                        theme={theme}
                    />
                    <Header isAuthenticated={isAuthenticated} />
                    <Login />
                </div>
            }
        </main>
    )
}
