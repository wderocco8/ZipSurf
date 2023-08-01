import React from 'react'
import { usersCollection } from '../firebase'
import { collection, getDocs, deleteDoc } from 'firebase/firestore'
import Export from '../icons/Export.svg'
import DeleteSweep from '../icons/DeleteSweep.svg'
import LogoutIcon from '../icons/LogoutIcon.svg'
import { gapi } from 'gapi-script'


export default function Navbar({ user, handleSignOut, allURLs }) {

    const userID = user.uid
    const currentUserCollection = collection(usersCollection, `${userID}/urls`)

    const deleteAllURLs = async () => {
        console.log("clicked")
        try {
            // obtain all docs from user's collection (code from: https://firebase.google.com/docs/firestore/query-data/get-data)
            const querySnapshot = await getDocs(currentUserCollection)
            // iterate over each doc, and delete turn into reference
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref)
            })
            console.log("Successfully deleted all urls")
        } catch (error) {
            console.log("Failed deleting all urls, with error: ", error)
        }
    }

    return (
        <nav className='navbar'>
            <ul className='navbar-nav'>
                Hello, {user.displayName}! 
                <NavItem icon={<img src={user.photoURL} alt={user.displayName[0]} className='icon--img' />} >
                    {/* NOTE: dropdown acts as props (later referred to as props.children) */}
                    <DropdownMenu
                        deleteAllURLs={deleteAllURLs} 
                        handleSignOut={handleSignOut}
                        allURLs={allURLs}
                    />
                </NavItem>
            </ul>
        </nav>
    )
}

function NavItem(props) {

    const [open, setOpen] = React.useState(false)
    // **PRACTICE MORE WITH useRef**
    const ref = React.useRef(null)

    function toggleOpen() {
        setOpen(!open)
    }

    // useEffect to add mousedown event listener on entire document
    React.useEffect(() => {
        function handleClickOutside(event) {
            // console.log("testing...", ref.current, "....", event.target)
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    })

    return (
        <li ref={ref} className='nav-item'>
            <a href='#' className='icon-button' onClick={toggleOpen}>
                {props.icon}
            </a>
            
            {/* render dropdown menu */}
            {open && props.children}
        </li>
    )
}

function DropdownMenu({ handleSignOut, deleteAllURLs, allURLs }) {
    // NESTED component O___O
    function DropdownItem(props) {
        // conditionally add red-text to class (for deleteAllURLs)
        let className = "menu-item"
        if (props.redText) {
            className += " red-text"
        } else if (props.boldText) {
            className += " bold-text"
        }

        return(
            <a href='#' className={className} onClick={props.onClick}>
                {props.children}
            </a>
        )
    }

    return (
        <div className='dropdown'>
            <DropdownItem onClick={() => handleExportURLs(allURLs)}>
                <img src={Export} alt="" />
                Export All URLs
            </DropdownItem>
            <DropdownItem redText onClick={deleteAllURLs} >
                <img className='delete-all' src={DeleteSweep} alt="" />
                Delete All URLs
            </DropdownItem>
            <DropdownItem boldText onClick={handleSignOut}>
                <img src={LogoutIcon} alt="" />
                Sign out
            </DropdownItem>
        </div>
    )
}








/* EXPORTING URLS USING GOOGLE DOCS API  */
const handleExportURLs = async (allURLs) => {
    // check if user is signed in
    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get()
    if (!isSignedIn) {
        try {
            await handleSignIn()
        } catch (error) {
            console.log("Error authenticating with google:", error)
        }
    }
    exportURLs(allURLs)
}

const handleSignIn = async () => {
    try {
        await gapi.auth2.getAuthInstance().signIn() 
    } catch (error) {
        console.log("Error signing in", error)
    }
}


function zerofill(i) {
    return (i < 10 ? '0' : '') + i
}

function getDateString() {
    const date = new Date
    const year = date.getFullYear()
    const month = zerofill(date.getMonth() + 1)
    const day = zerofill(date.getDate())
    return month + '/' + day + '/' + year
}

function getTimeString() {
    const date = new Date()
    return date.toLocaleTimeString()
}

// google docs API functions
const exportURLs = async (allURLs) => {
    // map urls to a list of their tinyURLs
    const tinyURLs = allURLs.map(url => url.tiny_url)
    console.log(tinyURLs)

    try {
        console.log(allURLs)
        // get current date
        const date = getDateString()
        const time = getTimeString()

        // define filename
        const filename = `ZipSurf URL Collection -- ${date} ${time}`
        const requestBody = {
            title: filename, // Replace 'filename' with the desired title for your Google Doc
        }

        // obtain user's access token (2 methods -- both work)
        // const accessToken = userResult.getAuthResponse().access_token // this requires getting user first
        const accessToken = gapi.auth.getToken().access_token
        console.log(accessToken)

        // API 1: use user accessToken to createDoc
        const response = await fetch('https://docs.googleapis.com/v1/documents', {
            method: 'POST',
            headers: new Headers({ 
                'Authorization': `Bearer ${accessToken}`, 
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(requestBody)
        })

        const data = await response.json()
        console.log('Google doc created:', data)

        // extract document id
        const documentId = data.documentId

        // API 2 insert content into new doc
        const contentrequestBody = {
            // map each url to a new line using `insertText`
            requests: tinyURLs.reverse().map((tinyURL, index) => {
              return [
                {insertText: {
                    text: `${tinyURL.trim()}\n\n`,
                    location: {
                    index: 1,
                    },
                }},
                { updateTextStyle: {
                    textStyle: {
                        link: {
                            url: tinyURL,
                        }
                    },
                    range: {
                        startIndex: 1,
                        endIndex: tinyURL.length + 1,
                    },
                    fields: 'link',
                }}
                ]
            })
          }
                 
        const insertResponse = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
            method: 'POST',
            headers: new Headers({ 
                'Authorization': `Bearer ${accessToken}`, 
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(contentrequestBody)
        })

        const insertData = await insertResponse.json()
        console.log("Content inserted into the document:", insertData)

        window.open("https://docs.google.com/document/d/" + data.documentId + "/edit", "_blank")
    }
    catch (error) {
        console.log('Error creating Google doc', error)
    }
}