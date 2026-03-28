// server/routes/payment.js
import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js'; // Middleware to verify Firebase token (to be created)

const router = express.Router();

// Create order (protected route)
router.post('/create-order', protect, createOrder);

// Verify payment (public, but we can also protect)
router.post('/verify', verifyPayment);

export default router;