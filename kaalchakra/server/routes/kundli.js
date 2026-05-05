// server/routes/kundli.js
import express from 'express';
import { generateKundli, getKundliResult } from '../controllers/kundliController.js';

const router = express.Router();

router.post('/generate', generateKundli);
router.get('/result/:id', getKundliResult);

export default router;
