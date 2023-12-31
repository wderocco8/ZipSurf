import React from 'react'
import URLCollection from './URLCollection'
import Navbar from './Navbar'
import Header from './Header'
import { usersCollection } from '../firebase'
import { addDoc, doc, onSnapshot, collection, deleteDoc } from 'firebase/firestore'
// Import the environment variables from the `.env` file using Vite's `import.meta.env`
const API_TOKEN = import.meta.env.VITE_TINYURL_API_TOKEN


export default function URL(props) {

    // state to keep track of text within input fields
    const [url, setURL] = React.useState({
        longURL: "",
        alias: "",
        tiny_url: "",
        createdAt: ""
    })

    const [charLeft, setCharLeft] = React.useState(30)
    const charColor = charLeft === 0 && '#ff6363'

    // state to maintain all urls (displayed through URLCollection)
    const [allURLs, setAllURLs] = React.useState([])

    // sort notes array (to pass into URLCollection component)
    const sortedURLs = allURLs.sort((a, b) => b.createdAt - a.createdAt)

    
    // use onSnapshot to update allURLs `state`
    React.useEffect(() => {
        const userID = props.user.uid
        // create new collection to store urls for each user (OR return ref to existing collection)
        const currentUserCollection = collection(usersCollection, `${userID}/urls`)
        // user clean-up function to avoid memory leak
        const unsubscribe = onSnapshot(
            currentUserCollection, function (snapshot) {
                const updatedURLs = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }))
                setAllURLs(updatedURLs)
            }
        )
        return unsubscribe // return clean-up function
    }, [props.user.uid]) // re-run every time user changes

    // save URL to firestore database 
    async function saveURL() {
        // error empty url attempt
        if (url.longURL === "") {
            alert("Must enter valid URL")
            return
        }
        // error invalid alias (too short)
        if (url.alias.length > 0 && url.alias.length < 5) {
            alert("Alias must be at least 5 characters")
            return
        }
        // error duplicate url (already stored in database)
        const longURLs = allURLs.map(url => url.longURL)
        if (longURLs.includes(url.longURL)) {
            alert("URL already saved below")
            return
        }

        // obtain new url object
        const tempURL = await fetchTinyURL()

        // get user uid from auth.currentUser
        const userID = props.user.uid

        // only try to update collection if found valid tinyUrl
        try {
            // update firestore collection
            const currentUserCollection = collection(usersCollection, `${userID}/urls`)
            const docRef = await addDoc(currentUserCollection, tempURL)

            // reset URL to empty string
            setURL({
                longURL: "",
                alias: "",
                tiny_url: ""
            })
            setCharLeft(30)
            console.log("URL document written with ID: ", docRef.id)
        } catch (error) {
            console.log(`Error adding URL doc to user ${userID}`)
        }
        
    }

    // obtian tiny URL from API
    async function fetchTinyURL() {
        try {
            // information for API call
            let body = {
                url: url.longURL,
                alias: url.alias
            }
        
            const response = await fetch('https://api.tinyurl.com/create', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
                })
            
            const data = await response.json()
            console.log(data)

            // error checking
            if (data.errors[0] === "Alias is not available.") {
                alert(`Alias "${body.alias}" is not available.`)
                return false
            } else if (data.errors[0] === "Invalid URL.") {
                alert("Invalid URL.")
                return false
            }
            // console.log(data.errors[0]==="Alias is not available.") // IMPORTANT

            const newURL = {
                ...url,
                alias: data.data.alias,
                tiny_url: data.data.tiny_url,
                createdAt: Date.now()
            }

            return newURL
        } catch(error) {
            console.error(error)
            console.log("wassup bot")
            // Handle any errors here
        }
    }

    async function deleteURL(urlID) {
        const userID = props.user.uid
        const currentUserCollection = collection(usersCollection, `${userID}/urls`)
        const docRef = doc(currentUserCollection, urlID)

        try {
            await deleteDoc(docRef)
            console.log(`URL with ID ${urlID} deleted successfully.`);
        } catch (error) {
          console.error(`Error deleting URL with ID ${urlID}:`, error);
        }
    }  

    function handleChange(event) {
        const {name, value} = event.target
        setURL(prevState => ({
            ...prevState,
            [name]: value
        }))

        // update character limit if this is alias
        if (name == "alias") {
            const leftover = 30 - value.length
            setCharLeft(leftover)
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            fetchTinyURL(event)
        }
    }

    return (
        <div>
            <Navbar 
                user={props.user}
                handleSignOut={props.handleSignOut}
                allURLs={allURLs}
                toggleTheme={props.toggleTheme}
                theme={props.theme}
            />
            <Header isAuthenticated={true} />
            <div className="form">
                <div className="form--alias">
                    <input 
                        type="text"
                        placeholder="enter an alias (optional)"
                        className="form--inputAlias"
                        name="alias"
                        value={url.alias}
                        onChange={handleChange}
                        maxLength="30"
                   />
                   {
                    charLeft < 30 &&
                    <p style={{color: charColor}} className='form-charCount'>{charLeft} characters left</p>
                   }
                </div>

                <div className="form--searchbox">
                    <input 
                        type="text"
                        placeholder="www.reallyLongURL/NeedsShortening.com"
                        className="form--inputURL"
                        name="longURL"
                        value={url.longURL}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className='form--button'
                        onClick={saveURL}

                    >
                        Shorten  
                    </button>
                </div>
            </div>

            <URLCollection deleteURL={deleteURL} allURLs={sortedURLs} />
        </div>
    )
}