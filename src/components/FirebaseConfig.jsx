import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0buo6AXjX23zkvsbFRw4c6eJphMdDZqE",
  authDomain: "timetrack-a8db2.firebaseapp.com",
  projectId: "timetrack-a8db2",
  storageBucket: "timetrack-a8db2.appspot.com",
  messagingSenderId: "1048536443673",
  appId: "1:1048536443673:web:3e8598c7bbc4e50653f388",
  measurementId: "G-D2BSCC4HWE",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
