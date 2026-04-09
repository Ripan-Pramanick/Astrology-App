// server/routes/ai.js
import express from 'express';
import { getPrediction } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route (requires authentication)
router.post('/predict', protect, getPrediction);

export default router;