
import React from 'react'
import { auth } from '../firebase'
import { GoogleAuthProvider, signInWithPopup} from "firebase/auth"

export default function Login() {
    
    // function to signInWithGoogle (using Firebase authentication)
    const signInWithGoogle = () => {
		// initialize provider
		const provider = new GoogleAuthProvider()

		// use Firebase sign in function
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