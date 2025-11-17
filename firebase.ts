import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJ7LMWHkcL1W23OgQlBV0ficQkdljAyrk",
  authDomain: "neuro-5edf2.firebaseapp.com",
  projectId: "neuro-5edf2",
  storageBucket: "neuro-5edf2.firebasestorage.app",
  messagingSenderId: "370736241678",
  appId: "1:370736241678:web:41cfcd5fd5809d10b9705f",
  measurementId: "G-5MZC0E00YZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
