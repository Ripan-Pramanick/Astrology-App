// client/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Users, CreditCard, IndianRupee, Crown, Clock, ArrowRight, Activity, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx'; // লগআউটের জন্য

const AdminDashboard = () => {
  const { logout } = useAuth(); // AuthContext থেকে লগআউট আনছি
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
        // api.js ব্যবহার করলে আরও ভালো, তবে axios দিয়েও চলবে
        const [statsRes, paymentsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/admin/recent-payments', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        
        // যদি ব্যাকএন্ড ডেটা না পাঠায়, তবে ডিফল্ট ভ্যালু সেট করুন
        setStats(statsRes.data || { totalUsers: 0, totalPayments: 0, totalRevenue: 0, pendingRequests: 0 });
        setRecentPayments(paymentsRes.data || []);
      } catch (err) {
        console.error("Admin Fetch Error:", err);
        setError('Failed to load cosmic data. Please check connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#f3efe6] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#cf9f4a] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[#b8860b] font-bold tracking-widest uppercase text-sm">Aligning Stars...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#f3efe6] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
               <Crown className="text-[#d4af37] w-8 h-8" /> 
               <span className="bg-gradient-to-r from-[#b8860b] to-[#d4af37] bg-clip-text text-transparent">
                 Admin Observatory
               </span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage users, payments, and cosmic requests.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-[#cf9f4a]/20">
               <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">System Online</span>
            </div>
            {/* Optional Logout Button */}
            <button onClick={logout} className="p-2.5 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl shadow-sm border border-red-100 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 font-semibold shadow-sm">
            <Activity className="w-5 h-5" /> {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Seekers', val: stats.totalUsers, icon: <Users size={24} />, color: 'from-[#4facfe] to-[#00f2fe]', shadow: 'shadow-blue-200' },
            { label: 'Total Payments', val: stats.totalPayments, icon: <CreditCard size={24} />, color: 'from-[#fa709a] to-[#fee140]', shadow: 'shadow-pink-200' },
            { label: 'Total Revenue', val: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: <IndianRupee size={24} />, color: 'from-[#d4af37] to-[#f4a460]', shadow: 'shadow-yellow-200' },
            { label: 'Pending Consults', val: stats.pendingRequests, icon: <Clock size={24} />, color: 'from-[#ff0844] to-[#ffb199]', shadow: 'shadow-red-200' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgba(212,175,55,0.08)] border border-[#cf9f4a]/10 hover:-translate-y-1 transition-transform duration-300">
               <div className="flex justify-between items-start mb-4">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg ${item.shadow}`}>
                    {item.icon}
                  </div>
               </div>
               <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{item.label}</h3>
               <p className="text-3xl font-black text-slate-800">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Main Content Area: Recent Payments & Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Payments Table (Takes 2 columns on large screens) */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgba(212,175,55,0.08)] border border-[#cf9f4a]/20 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Activity className="text-[#b8860b] w-5 h-5" /> Recent Transactions
              </h2>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              {recentPayments.length === 0 && !error ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-slate-400">
                  <CreditCard className="w-12 h-12 mb-3 opacity-20" />
                  <p className="font-medium">No cosmic transactions yet.</p>
                </div>
              ) : (
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-[#fdfbfb] text-[#b8860b] text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Seeker</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-600 text-sm">
                    {recentPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-[#f3efe6]/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {payment.user_name || payment.user_id?.substring(0,8) + '...'}
                        </td>
                        <td className="px-6 py-4 font-bold">₹{payment.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            payment.status === 'success' || payment.status === 'paid' ? 'bg-green-100 text-green-700' : 
                            payment.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-400">
                          {new Date(payment.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-gray-50/50 text-center">
               <Link to="/admin/payments" className="text-sm font-bold text-[#b8860b] hover:text-[#d4af37] transition-colors">
                 View Full Ledger
               </Link>
            </div>
          </div>

          {/* Action Center (Side Panel) */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(212,175,55,0.08)] border border-[#cf9f4a]/20 p-6">
             <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
             
             <div className="space-y-4">
                <Link to="/admin/users" className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#fdfbfb] to-[#f3efe6] border border-[#cf9f4a]/20 hover:border-[#cf9f4a]/60 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-[#b8860b]">
                       <Users size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Manage Users</h4>
                      <p className="text-xs text-slate-500">View & edit user profiles</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#b8860b] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link to="/admin/content" className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#fdfbfb] to-[#f3efe6] border border-[#cf9f4a]/20 hover:border-[#cf9f4a]/60 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-[#b8860b]">
                       <Crown size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Astrology Content</h4>
                      <p className="text-xs text-slate-500">Update daily horoscopes</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#b8860b] group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;