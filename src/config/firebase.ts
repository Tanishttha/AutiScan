// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your Firebase configuration (autiscan-e3cff project)
const firebaseConfig = {
  apiKey: "AIzaSyAgw1eC4hmV4ZdmrsBA9xR7CP5KgkyiwfU",
  authDomain: "autiscan-e3cff.firebaseapp.com",
  projectId: "autiscan-e3cff",
  storageBucket: "autiscan-e3cff.firebasestorage.app",
  messagingSenderId: "79337828773",
  appId: "1:79337828773:web:1ba5efbf7ca5b50234384c",
  measurementId: "G-KHPYTZ4165"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
