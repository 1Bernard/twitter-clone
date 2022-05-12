// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyD5vbZXxlZ3YeV0wmbC3K7My-ZY51FfNo8",
    authDomain: "twitter-clone-1e363.firebaseapp.com",
    projectId: "twitter-clone-1e363",
    storageBucket: "twitter-clone-1e363.appspot.com",
    messagingSenderId: "986286707616",
    appId: "1:986286707616:web:688122489abac0e5730ac5"
  };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const storage = getStorage(app);

export {app, firestore, storage};