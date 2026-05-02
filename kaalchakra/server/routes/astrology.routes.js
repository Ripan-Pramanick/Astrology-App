import express from 'express';
import { callAstrologyAPI } from '../controllers/astrologyController.js';

const router = express.Router();

// মাত্র এই একটি লাইন আপনার ১৫০+ API হ্যান্ডেল করবে! 🚀
router.post('/:endpoint', callAstrologyAPI);

export default router;