// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration (copied from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyB2MBiV2U6tupXyMxGhYvswYBnRScyxQ3c",
  authDomain: "urlshortener-8937b.firebaseapp.com",
  projectId: "urlshortener-8937b",
  storageBucket: "urlshortener-8937b.appspot.com",
  messagingSenderId: "144070036014",
  appId: "1:144070036014:web:cddf8d71bc4ef9ab212dbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export firestore
export const firestore = getFirestore(app)

// initialize 'users' collection
export const usersCollection = collection(firestore, "users")

// Initialize Firebase authentication (code from PedroTech: https://www.youtube.com/watch?v=vDT7EnUpEoo&ab_channel=PedroTech)
export const auth = getAuth(app)
