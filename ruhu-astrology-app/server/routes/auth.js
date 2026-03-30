import express from 'express';
// দুটো ফাংশনই ইমপোর্ট করতে হবে
import { verifyPhoneAuth, registerUser } from '../controllers/authController.js'; 

const router = express.Router();

router.post('/verify-phone', verifyPhoneAuth);
router.post('/register', registerUser); // 👈 এই লাইনটা যেন থাকে

export default router;