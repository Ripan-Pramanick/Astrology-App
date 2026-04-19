// server/routes/auth.js
import express from 'express';
import {
  registerUser,
  verifyPhoneAuth,
  sendOTP,
  getUserProfile,
  updateUserProfile
} from '../controllers/authController.js';

const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/verify-phone', verifyPhoneAuth);  // 👈 Make sure this exists
router.post('/send-otp', sendOTP);

// Profile routes
router.get('/profile/:phone', getUserProfile);
router.put('/profile/:phone', updateUserProfile);

export default router;