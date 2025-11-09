// app/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (paste your values here)
const firebaseConfig = {
  apiKey: "AIzaSyDhntiLlJ5LAaxVI6ZCF2vqleYsM8AMYjU",
  authDomain: "crud-with-authentication-8bd35.firebaseapp.com",
  projectId: "crud-with-authentication-8bd35",
  storageBucket: "crud-with-authentication-8bd35.firebasestorage.app",
  messagingSenderId: "479677949075",
  appId: "1:479677949075:web:3338f6031fe77647bc9966",
  measurementId: "G-9Z7Z8GHR9D"
};

// Initialize Firebase app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);    // For authentication
export const db = getFirestore(app); // For Firestore database
