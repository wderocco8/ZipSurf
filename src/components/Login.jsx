
import React from 'react'
import { useState } from 'react'
import { auth } from '../firebase'
import { GoogleAuthProvider, signInWithPopup} from "firebase/auth"

export default function Login() {
    
    
    const signInWithGoogle = () => {

        const provider = new GoogleAuthProvider()

        signInWithPopup(auth, provider)
          .then((result) => {
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