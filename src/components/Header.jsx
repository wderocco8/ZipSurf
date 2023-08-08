import React from "react"

export default function Header(props) {
    return(
        <div className='header'>
            <h1 className='title'>
                <span className='blue-text'>Zip</span>Surf
                <img width={50} src="../src/icons/favicon.ico" />
            </h1>
            {props.isAuthenticated ?
                <p className='description'>Enter any valid link that is too longggggggg!!</p>
                :
                <div className='description-signIn'>
                    <p>Sign in below to start <i>zipping</i> your long urls:</p>
                </div>

            }
            
        </div>
    )
}