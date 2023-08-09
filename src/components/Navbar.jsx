import React from 'react'
import { usersCollection } from '../firebase'
import { collection, getDocs, deleteDoc } from 'firebase/firestore'
import Export from '../icons/Export.svg'
import DeleteSweep from '../icons/DeleteSweep.svg'
import LogoutIcon from '../icons/LogoutIcon.svg'
import handleExportURLs from '../functions/googleDocs'


export default function Navbar({ user, handleSignOut, allURLs, toggleTheme }) {

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
                <button className='theme' onClick={toggleTheme}>theme</button>
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
                <p>Export All URLs</p>
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