import React from 'react'
import Header from './components/Header'
import URL from './components/URL'
import Login from './components/Login'
import Navbar from './components/Navbar'
// import { Route, Routes } from "react-router-dom"
import { auth } from "./firebase"
 
export default function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    
    const user = auth.currentUser

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(user !== null) // update isAuthenticated based on if user signed in
        })

        return unsubscribe
    }, [])


    const handleSignOut = async () => {
        try {
            await auth.signOut()
        } catch (error) {
            console.log(error)
        }
    }
    
    // console.log("user is", user !== null && user.photoURL)
    return (
        <main>
            {isAuthenticated &&
                <Navbar 
                    user={user}
                    handleSignOut={handleSignOut}
                />
            }

            <Header />
            {isAuthenticated ? <URL user={user} /> : <Login />}
        </main>
    )
}