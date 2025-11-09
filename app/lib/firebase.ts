// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhntiLlJ5LAaxVI6ZCF2vqleYsM8AMYjU",              
  authDomain: "crud-with-authentication-8bd35.firebaseapp.com",  
  projectId: "crud-with-authentication-8bd35",                   
  storageBucket: "crud-with-authentication-8bd35.appspot.com",   
  messagingSenderId: "479677949075",                             
  appId: "1:479677949075:web:3338f6031fe77647bc9966",            
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
