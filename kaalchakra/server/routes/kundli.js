// server/routes/kundli.js
import express from 'express';
import { generateKundli } from '../controllers/kundliController.js';

const router = express.Router();

// POST: http://localhost:5000/api/kundli/generate
router.post('/generate', generateKundli);

export default router;