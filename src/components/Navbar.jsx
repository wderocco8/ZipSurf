import React from 'react'

export default function Navbar({ isAuthenticated, user, handleSignOut }) {

    return (
        <div className='welcome-msg'>
            {isAuthenticated && (
                <div className='welcome-msg-content'>
                    <span>
                        Hello, {user.displayName}!
                        <button className='dropdown-button'>
                            <img src={user.photoURL} alt={user.displayName[0]} />
                        </button>
                    </span>
                </div> 
            )}
        </div>
    )
}
