
import React from 'react'
import { useState } from 'react'
import { auth } from '../firebase'
import { GoogleAuthProvider, signInWithPopup} from "firebase/auth"

export default function Login() {
    
    
    const signInWithGoogle = () => {

        const provider = new GoogleAuthProvider()

        signInWithPopup(auth, provider)
          .then((result) => {
            const name = result.user.displayName
            const email = result.user.email
            const profilePic = result.user.photoURL
      
            // localStorage.setItem("name", name);
            // localStorage.setItem("email", email);
            // localStorage.setItem("profilePic", profilePic);
            console.log(result)
          })
          .catch((error) => {
            console.log(error);
          })
      }
    
    return (
        <div className='login'>
            <button 
                className='google-btn'
                onClick={signInWithGoogle}
            >
                Sign In With Google
            </button>
        </div>
    )
}