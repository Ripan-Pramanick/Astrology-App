// client/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    totalRevenue: 0,
    pendingRequests: 0,
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [statsRes, paymentsRes] = await Promise.all([
          axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/admin/recent-payments', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats(statsRes.data);
        setRecentPayments(paymentsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading admin dashboard...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-gray-500 text-sm">Total Payments</h3>
          <p className="text-3xl font-bold">{stats.totalPayments}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-gray-500 text-sm">Revenue (₹)</h3>
          <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-gray-500 text-sm">Pending Requests</h3>
          <p className="text-3xl font-bold">{stats.pendingRequests}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
        {recentPayments.length === 0 ? (
          <p className="text-gray-500">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Payment ID</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-2">{payment.payment_id || '—'}</td>
                    <td className="px-4 py-2">{payment.user_name || payment.user_id}</td>
                    <td className="px-4 py-2">₹{payment.amount}</td>
                    <td className="px-4 py-2 capitalize">{payment.status}</td>
                    <td className="px-4 py-2">{new Date(payment.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4">
          <Link to="/admin/users" className="text-indigo-600 hover:underline">Manage Users →</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;