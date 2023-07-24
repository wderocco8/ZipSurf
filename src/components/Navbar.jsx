import React from 'react'
import { usersCollection } from '../firebase'
import { collection, getDocs, deleteDoc } from 'firebase/firestore'
import Export from '../icons/Export.svg'
import DeleteSweep from '../icons/DeleteSweep.svg'
import LogoutIcon from '../icons/LogoutIcon.svg'


export default function Navbar({ user, handleSignOut }) {
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
                    <DropdownMenu handleSignOut={handleSignOut} deleteAllURLs={deleteAllURLs} />
                </NavItem>
            </ul>
        </nav>
    )
}

function NavItem(props) {

    const [open, setOpen] = React.useState(false)

    function toggleOpen() {
        setOpen(!open)
    }

    return (
        <li className='nav-item'>
            <a href='#' className='icon-button' onClick={toggleOpen}>
                {props.icon}
            </a>

            {/* render dropdown menu */}
            {open && props.children}
        </li>
    )
}

function DropdownMenu({ deleteAllURLs, handleSignOut }) {
    
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
            <DropdownItem>
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