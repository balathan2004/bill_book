// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBde1_fSvuqacsRkHa59xEfnit9Gghst6c",
  authDomain: "budget-a6a36.firebaseapp.com",
  databaseURL: "https://budget-a6a36-default-rtdb.firebaseio.com",
  projectId: "budget-a6a36",
  storageBucket: "budget-a6a36.firebasestorage.app",
  messagingSenderId: "174656153917",
  appId: "1:174656153917:web:b67c029f5255635acc3d54",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const firestore=getFirestore(app)

export {auth,firestore}
