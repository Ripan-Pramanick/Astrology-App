// server/routes/admin.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
  getStats,
  getRecentPayments,
  getAllUsers,
  deleteUser,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/recent-payments', getRecentPayments);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;