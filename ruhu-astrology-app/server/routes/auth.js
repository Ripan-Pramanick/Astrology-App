// server/routes/auth.js
import express from 'express';
import { verifyPhoneAuth } from '../controllers/authController.js';

const router = express.Router();

// Route: POST /api/auth/verify-phone
router.post('/verify-phone', verifyPhoneAuth);

export default router;