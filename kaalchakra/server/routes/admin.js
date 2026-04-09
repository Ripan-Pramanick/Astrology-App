import express from 'express';
import { 
  getStats, 
  getRecentPayments, 
  getAllUsers, 
  deleteUser, 
  getAllOrders, 
  updateUserRole 
} from '../controllers/adminController.js';

const router = express.Router();

// ড্যাশবোর্ডের স্ট্যাটস ও পেমেন্ট
router.get('/stats', getStats);
router.get('/recent-payments', getRecentPayments);
router.get('/orders', getAllOrders);

// ইউজার ম্যানেজমেন্ট
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole); // 👈 অ্যাডমিন বানানোর ম্যাজিক রুট

export default router;