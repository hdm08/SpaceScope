// src/firebase.js (or firebase.jsx)

// Import the functions you need from the Firebase SDKs
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // For Authentication
import { getFirestore } from "firebase/firestore";         // For Firestore Database
import { getStorage } from "firebase/storage";             // For Cloud Storage
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);         // Get the Auth service instance
const db = getFirestore(app);      // Get the Firestore service instance
const storage = getStorage(app);   // Get the Cloud Storage service instance

// Initialize Auth Providers (e.g., for Google Sign-In)
const googleProvider = new GoogleAuthProvider(); // For Google Sign-In popups

// Export the initialized services and providers for use throughout your app
export { app, auth, db, storage, googleProvider };