// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2MBiV2U6tupXyMxGhYvswYBnRScyxQ3c",
  authDomain: "urlshortener-8937b.firebaseapp.com",
  projectId: "urlshortener-8937b",
  storageBucket: "urlshortener-8937b.appspot.com",
  messagingSenderId: "144070036014",
  appId: "1:144070036014:web:cddf8d71bc4ef9ab212dbf"
};

// Initi alize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

// export default app