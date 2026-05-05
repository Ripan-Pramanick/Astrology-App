// server/routes/payment.js
import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Create order - public (guests can also pay for kundli)
router.post('/create-order', createOrder);

// Verify payment
router.post('/verify', verifyPayment);

// Keep the premium subscription verify endpoint
router.post('/verify-payment', verifyPayment);

export default router;
