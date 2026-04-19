// server/routes/admin.js
import express from 'express';
import { supabase } from '../utils/supabase.js';
import admin from 'firebase-admin';

const router = express.Router();

// Middleware to verify admin access
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('firebase_uid', decodedToken.uid)
      .single();
    
    if (error || user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, users: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all payments/reports
router.get('/payments', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('saved_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, payments: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all reports
router.get('/reports', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('saved_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, reports: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const [usersRes, reportsRes] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: false }),
      supabase.from('saved_reports').select('*', { count: 'exact', head: false })
    ]);
    
    const users = usersRes.data || [];
    const reports = reportsRes.data || [];
    
    const totalRevenue = reports.reduce((sum, r) => sum + (r.amount || 1100), 0);
    const completedReports = reports.filter(r => r.ai_insights).length;
    
    res.json({
      success: true,
      totalUsers: users.length,
      totalPayments: reports.length,
      totalRevenue: totalRevenue,
      pendingRequests: reports.length - completedReports,
      completedConsultations: completedReports,
      premiumUsers: users.filter(u => u.role === 'premium').length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add this to server/routes/admin.js

// Get all orders (payments)
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('saved_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform data to match frontend expectations
    const orders = data.map(report => ({
      id: report.id,
      order_id: `ORD_${report.id}`,
      user_name: report.name,
      amount: report.amount || 1100,
      status: report.ai_insights ? 'success' : 'pending',
      service: report.basic_info?.service || 'Kundli Analysis',
      created_at: report.created_at
    }));
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order statistics
router.get('/orders/stats', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('saved_reports')
      .select('*');
    
    if (error) throw error;
    
    const successfulOrders = data.filter(r => r.ai_insights);
    const totalRevenue = successfulOrders.reduce((sum, r) => sum + (r.amount || 1100), 0);
    
    res.json({
      totalOrders: data.length,
      totalRevenue: totalRevenue,
      successRate: data.length > 0 ? (successfulOrders.length / data.length) * 100 : 0,
      pendingOrders: data.length - successfulOrders.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to server/routes/admin.js

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, users: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user role
router.put('/users/:userId/role', verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    const { data, error } = await supabase
      .from('users')
      .update({ role: role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ success: true, user: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user
router.delete('/users/:userId', verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;