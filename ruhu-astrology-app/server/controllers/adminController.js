// server/controllers/adminController.js
import { supabase } from '../utils/supabase.js';

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

    // Sum revenue from completed payments
    const { data: revenueData, error: revenueError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed');
    if (revenueError) throw revenueError;
    const totalRevenue = revenueData.reduce((sum, p) => sum + (p.amount || 0), 0) / 100; // amount in paise

    // Count pending kundali requests
    const { count: pendingRequests, error: pendingError } = await supabase
      .from('kundali_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    if (pendingError) throw pendingError;

    res.json({
      totalUsers: totalUsers || 0,
      totalPayments: totalPayments || 0,
      totalRevenue: Math.round(totalRevenue),
      pendingRequests: pendingRequests || 0,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats.' });
  }
};

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

    res.json(formatted);
  } catch (error) {
    console.error('Recent payments error:', error);
    res.status(500).json({ message: 'Failed to fetch recent payments.' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('payments')
      .select(`
        id,
        order_id,
        amount,
        status,
        service,
        created_at,
        user_id,
        users ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = orders.map(o => ({
      id: o.id,
      order_id: o.order_id,
      amount: o.amount,
      status: o.status,
      service: o.service,
      created_at: o.created_at,
      user_id: o.user_id,
      user_name: o.users?.name || o.user_id,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};