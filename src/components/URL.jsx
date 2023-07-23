import React from 'react'
import URLCollection from './URLCollection'
import { usersCollection } from '../firebase'
import { addDoc, doc, onSnapshot, collection, deleteDoc } from 'firebase/firestore'

// Import the environment variables from the `.env` file using Vite's `import.meta.env`
const API_TOKEN = import.meta.env.VITE_API_TOKEN

export default function URL(props) {

    const [url, setURL] = React.useState({
        longURL: "",
        alias: "",
        tiny_url: ""
    })

    const [allURLs, setAllURLs] = React.useState([])

    console.log(allURLs)

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
        }

        // obtain new url object
        const tempURL = await fetchTinyURL()

        // get user uid from auth.currentUser
        const userID = props.user.uid

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
            console.log(data) // IMPORTANT

            const newURL = {
                ...url,
                alias: data.data.alias,
                tiny_url: data.data.tiny_url
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
        setURL(prevURL => ({
            ...prevURL,
            [name]: value
        }))
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            fetchTinyURL(event)
        }
    }

    return (
        <div>
            <div className="form">
                <div className="form--alias">
                    <input 
                        type="text"
                        placeholder="enter an alias (optional)"
                        className="form--inputAlias"
                        name="alias"
                        value={url.alias}
                        onChange={handleChange}
                   />
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

            <URLCollection deleteURL={deleteURL} allURLs={allURLs} />
        </div>
    )
}