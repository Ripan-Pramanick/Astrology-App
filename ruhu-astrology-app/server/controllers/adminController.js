// server/controllers/adminController.js
import { supabase } from '../utils/supabase.js';

/**
 * Get dashboard stats
 * GET /api/admin/stats
 */
export const getStats = async (req, res) => {
  try {
    // Count users
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // Count payments
    const { count: totalPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true });

    if (paymentsError) throw paymentsError;

    // Sum revenue (from completed payments)
    const { data: revenueData, error: revenueError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed');

    if (revenueError) throw revenueError;
    const totalRevenue = revenueData.reduce((sum, p) => sum + (p.amount || 0), 0) / 100; // assuming amount in paise

    // Count pending kundali requests
    const { count: pendingRequests, error: pendingError } = await supabase
      .from('kundali_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingError) throw pendingError;

    return res.status(200).json({
      totalUsers: totalUsers || 0,
      totalPayments: totalPayments || 0,
      totalRevenue: Math.round(totalRevenue),
      pendingRequests: pendingRequests || 0,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ message: 'Failed to fetch stats.' });
  }
};

/**
 * Get recent payments
 * GET /api/admin/recent-payments
 */
export const getRecentPayments = async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        id,
        payment_id,
        amount,
        status,
        created_at,
        user_id,
        users ( name )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const formatted = payments.map(p => ({
      id: p.id,
      payment_id: p.payment_id,
      amount: p.amount / 100,
      status: p.status,
      created_at: p.created_at,
      user_id: p.user_id,
      user_name: p.users?.name || p.user_id,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Recent payments error:', error);
    return res.status(500).json({ message: 'Failed to fetch recent payments.' });
  }
};

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

/**
 * Delete a user
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally, also delete the Firebase user (requires Firebase Admin)
    // For now, just delete from Supabase.

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Failed to delete user.' });
  }
};