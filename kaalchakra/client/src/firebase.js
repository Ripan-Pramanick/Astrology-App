// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBuadfMrvSyqYjMeUisKnW8IQ1ON-VNtjI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ruhu-astrology.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ruhu-astrology",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ruhu-astrology.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "939403470495",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:939403470495:web:8ab685ed60a397f318e4aa",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-S0484WRW77"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
  auth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail 
};

export default app;