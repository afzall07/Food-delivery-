// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "khaopio-food-delivery.firebaseapp.com",
    projectId: "khaopio-food-delivery",
    storageBucket: "khaopio-food-delivery.firebasestorage.app",
    messagingSenderId: "963717522207",
    appId: "1:963717522207:web:3ef5f39b33b2622689062a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export { app, auth }