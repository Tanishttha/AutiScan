import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRIIRnUVPMhMRQOk-_Vlshee0N1235frI",
  authDomain: "autiscan-f5f4c.firebaseapp.com",
  projectId: "autiscan-f5f4c",
  storageBucket: "autiscan-f5f4c.firebasestorage.app",
  messagingSenderId: "354165945561",
  appId: "1:354165945561:web:220b5ade27b4dd9e9a3ac8",
  measurementId: "G-8WKN5Y4ZMB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
