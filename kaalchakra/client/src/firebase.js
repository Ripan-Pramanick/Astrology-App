// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuadfMrvSyqYjMeUisKnW8IQ1ON-VNtjI",
  authDomain: "ruhu-astrology.firebaseapp.com",
  projectId: "ruhu-astrology",
  storageBucket: "ruhu-astrology.firebasestorage.app",
  messagingSenderId: "939403470495",
  appId: "1:939403470495:web:8ab685ed60a397f318e4aa",
  measurementId: "G-S0484WRW77"
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