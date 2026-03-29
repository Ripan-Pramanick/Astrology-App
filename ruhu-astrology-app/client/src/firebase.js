// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 👈 Auth এর জন্য এটা লাগবে
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBuadfMrvSyqYjMeUisKnW8IQ1ON-VNtjI",
  authDomain: "ruhu-astrology.firebaseapp.com",
  projectId: "ruhu-astrology",
  storageBucket: "ruhu-astrology.firebasestorage.app",
  messagingSenderId: "939403470495",
  appId: "1:939403470495:web:8ab685ed60a397f318e4aa",
  measurementId: "G-S0484WRW77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app); // 👈 এটাকে এক্সপোর্ট করছি যাতে Login পেজে ব্যবহার করা যায়
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;