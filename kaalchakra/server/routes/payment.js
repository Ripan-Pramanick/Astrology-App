// server/routes/payment.js
import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create order (protected route)
router.post('/create-order', protect, createOrder);

// Verify payment (public, but can be protected if needed)
router.post('/verify', verifyPayment);

export default router;