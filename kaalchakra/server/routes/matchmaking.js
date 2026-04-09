// server/routes/matchmaking.js
import express from 'express';
import { matchmaking } from '../controllers/matchmakingController.js';

const router = express.Router();

// POST /api/matchmaking
router.post('/', matchmaking);

export default router;