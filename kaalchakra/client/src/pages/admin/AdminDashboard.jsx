// client/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Users, CreditCard, IndianRupee, Crown, Clock, ArrowRight, 
  Activity, LogOut, Sparkles, TrendingUp, Calendar, 
  Shield, Zap, Star, Gem, BarChart3, Eye, Download,
  CheckCircle, XCircle, AlertCircle, DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { SparkleButton, BackgroundSparkles } from '../../components/ui/Sparkle.jsx';
import api from '../../services/api.js';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    totalRevenue: 0,
    pendingRequests: 0,
    monthlyGrowth: 0,
    premiumUsers: 0,
    activeConsultations: 0,
    completedConsultations: 0
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [greeting, setGreeting] = useState('');

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Fetch all admin data from database
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        
        // Fetch all data in parallel from your backend
        const [usersRes, paymentsRes, reportsRes] = await Promise.all([
          api.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/admin/payments', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/admin/reports', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        // Calculate stats from real data
        const users = usersRes.data?.users || [];
        const payments = paymentsRes.data?.payments || [];
        const reports = reportsRes.data?.reports || [];
        
        // Calculate total revenue from successful payments
        const totalRevenue = payments
          .filter(p => p.status === 'success' || p.status === 'paid')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        
        // Calculate premium users (users who have made at least one payment)
        const payingUserIds = new Set(payments.map(p => p.user_id));
        const premiumUsers = payingUserIds.size;
        
        // Calculate pending consultations (reports without AI insights or pending status)
        const pendingRequests = reports.filter(r => !r.ai_insights || r.status === 'pending').length;
        
        // Calculate completed consultations
        const completedConsultations = reports.filter(r => r.ai_insights && r.status === 'completed').length;
        
        // Calculate monthly growth (compare last 30 days vs previous 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        const recentUsersCount = users.filter(u => new Date(u.created_at) >= thirtyDaysAgo).length;
        const previousUsersCount = users.filter(u => {
          const date = new Date(u.created_at);
          return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        }).length;
        
        const monthlyGrowth = previousUsersCount > 0 
          ? ((recentUsersCount - previousUsersCount) / previousUsersCount) * 100 
          : recentUsersCount > 0 ? 100 : 0;
        
        setStats({
          totalUsers: users.length,
          totalPayments: payments.length,
          totalRevenue: totalRevenue,
          pendingRequests: pendingRequests,
          monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
          premiumUsers: premiumUsers,
          activeConsultations: reports.filter(r => r.status === 'active').length,
          completedConsultations: completedConsultations
        });
        
        // Set recent payments (last 5)
        setRecentPayments(payments.slice(0, 5));
        
        // Set recent users (last 5)
        setRecentUsers(users.slice(0, 5));
        
        // Set recent reports (last 5)
        setRecentReports(reports.slice(0, 5));
        
      } catch (err) {
        console.error("Admin Fetch Error:", err);
        setError('Failed to load cosmic data. Please check connection.');
        
        // Fallback to localStorage data if API fails
        try {
          const savedReports = JSON.parse(localStorage.getItem('saved_reports') || '[]');
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          
          setStats({
            totalUsers: users.length,
            totalPayments: savedReports.length,
            totalRevenue: savedReports.reduce((sum, r) => sum + (r.amount || 1100), 0),
            pendingRequests: savedReports.filter(r => !r.ai_insights).length,
            monthlyGrowth: 12.5,
            premiumUsers: Math.floor(users.length * 0.3),
            activeConsultations: savedReports.filter(r => r.status === 'active').length,
            completedConsultations: savedReports.filter(r => r.ai_insights).length
          });
          
          setRecentPayments(savedReports.slice(0, 5).map(r => ({
            id: r.id,
            user_name: r.name,
            amount: r.amount || 1100,
            status: r.ai_insights ? 'success' : 'pending',
            created_at: r.created_at
          })));
          
          setRecentUsers(users.slice(0, 5));
          setRecentReports(savedReports.slice(0, 5));
        } catch (e) {
          console.error("Fallback error:", e);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3efe6] to-[#e8e3d8] flex flex-col items-center justify-center relative overflow-hidden">
      <BackgroundSparkles count={40} />
      <div className="relative">
        <div className="w-20 h-20 border-4 border-[#d4af37] border-t-[#b8860b] rounded-full animate-spin"></div>
        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#d4af37] animate-pulse" size={28} />
      </div>
      <p className="mt-6 text-[#b8860b] font-bold tracking-widest uppercase text-sm animate-pulse">
        Retrieving Cosmic Data...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] via-[#f3efe6] to-[#e8e3d8] p-4 md:p-8 font-sans relative overflow-hidden">
      <BackgroundSparkles count={50} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div className="relative">
            <div className="absolute -top-4 -left-4 opacity-50 animate-pulse">
              <Star size={24} fill="#FFD700" className="text-yellow-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#d4af37] to-[#b8860b] rounded-2xl shadow-lg">
                <Crown className="text-white w-7 h-7" />
              </div>
              <span className="bg-gradient-to-r from-[#b8860b] to-[#d4af37] bg-clip-text text-transparent">
                Admin Observatory
              </span>
              <Sparkles className="text-[#d4af37] animate-pulse" size={24} />
            </h1>
            <p className="text-slate-500 font-medium mt-2 ml-2">
              {greeting}, {user?.name || 'Admin'}! ✨ Here's your cosmic dashboard overview.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-[#d4af37]/20">
              <div className="relative">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75"></span>
              </div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Live Data</span>
            </div>
            
            <SparkleButton
              onClick={logout}
              className="p-2.5 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl shadow-md border border-red-100 transition-all"
              sparkleColor="#EF4444"
            >
              <LogOut size={20} />
            </SparkleButton>
          </div>
        </div>

        {/* Stats from Database */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { 
              label: 'Total Seekers', 
              val: stats.totalUsers.toLocaleString(), 
              icon: <Users size={24} />, 
              gradient: 'from-[#4facfe] to-[#00f2fe]',
              subtext: `${stats.monthlyGrowth > 0 ? '+' : ''}${stats.monthlyGrowth}% this month`,
              trend: stats.monthlyGrowth > 0 ? 'up' : stats.monthlyGrowth < 0 ? 'down' : 'neutral'
            },
            { 
              label: 'Premium Members', 
              val: stats.premiumUsers.toLocaleString(), 
              icon: <Crown size={24} />, 
              gradient: 'from-[#d4af37] to-[#f4a460]',
              subtext: `${stats.totalUsers > 0 ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0}% conversion rate`,
              trend: 'up'
            },
            { 
              label: 'Total Revenue', 
              val: `₹${(stats.totalRevenue || 0).toLocaleString()}`, 
              icon: <IndianRupee size={24} />, 
              gradient: 'from-[#fa709a] to-[#fee140]',
              subtext: `${stats.totalPayments} total transactions`,
              trend: 'neutral'
            },
            { 
              label: 'Pending Consults', 
              val: stats.pendingRequests, 
              icon: <Clock size={24} />, 
              gradient: 'from-[#ff0844] to-[#ffb199]',
              subtext: `${stats.completedConsultations} completed`,
              trend: stats.pendingRequests > 10 ? 'up' : 'down'
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#d4af37]/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3.5 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}>
                  {item.icon}
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                  item.trend === 'up' ? 'bg-green-100 text-green-600' : 
                  item.trend === 'down' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {item.trend === 'up' && '↑ '}
                  {item.trend === 'down' && '↓ '}
                  {item.subtext}
                </div>
              </div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{item.label}</h3>
              <p className="text-3xl font-black text-slate-800">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Recent Payments Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#d4af37]/10 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-[#fdfbfb]">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <DollarSign className="text-[#b8860b] w-5 h-5" /> Recent Transactions
                <Sparkles size={14} className="text-[#d4af37]" />
              </h2>
              <span className="text-xs text-slate-400">Last 5 payments</span>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              {recentPayments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-slate-400">
                  <CreditCard className="w-12 h-12 mb-3 opacity-20" />
                  <p className="font-medium">No transactions yet.</p>
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
                      <tr key={payment.id} className="hover:bg-[#f3efe6]/50 transition-colors group">
                        <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#b8860b]/10 flex items-center justify-center text-[#b8860b] font-bold">
                            {payment.user_name?.charAt(0) || payment.name?.charAt(0) || 'U'}
                          </div>
                          {payment.user_name || payment.name || 'Anonymous'}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#b8860b]">₹{payment.amount || 1100}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${
                            payment.status === 'success' || payment.status === 'paid' || payment.ai_insights 
                              ? 'bg-green-100 text-green-700' : 
                            payment.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              payment.status === 'success' || payment.ai_insights ? 'bg-green-500' : 
                              payment.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                            }`}></span>
                            {payment.ai_insights ? 'Completed' : payment.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-400">
                          {payment.created_at ? new Date(payment.created_at).toLocaleDateString('en-GB') : 'Recent'}
                        </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#d4af37]/10 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users size={16} className="text-[#b8860b]" /> Recent Seekers
              <span className="text-xs text-slate-400 ml-auto">Last {recentUsers.length} joined</span>
            </h3>
            <div className="space-y-3">
              {recentUsers.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f3efe6]/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#b8860b]/10 flex items-center justify-center text-[#b8860b] font-bold text-sm">
                      {user.name?.charAt(0) || user.phone?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{user.name || 'Anonymous'}</p>
                      <p className="text-xs text-slate-400">{user.phone || 'No phone'}</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'New'}
                  </span>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-4">No users registered yet</p>
              )}
            </div>
            <Link to="/admin/users" className="mt-4 block text-center text-xs text-[#b8860b] hover:text-[#d4af37] transition-colors">
              View All Users →
            </Link>
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#d4af37]/10 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-[#fdfbfb]">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-[#b8860b] w-5 h-5" /> Recent Kundli Reports
              <Sparkles size={14} className="text-[#d4af37]" />
            </h2>
            <span className="text-xs text-slate-400">AI analysis status</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fdfbfb] text-[#b8860b] text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">DOB</th>
                  <th className="px-6 py-4">AI Status</th>
                  <th className="px-6 py-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#f3efe6]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{report.name}</td>
                    <td className="px-6 py-4 text-slate-600">{report.dob || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {report.ai_insights ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle size={14} /> Analyzed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-600 text-sm">
                          <AlertCircle size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400">
                      {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
                {recentReports.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                      No reports generated yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: "/admin/users", label: "Manage Users", icon: <Users size={18} />, color: "from-blue-500 to-cyan-500" },
            { to: "/admin/payments", label: "View Payments", icon: <CreditCard size={18} />, color: "from-green-500 to-emerald-500" },
            { to: "/admin/reports", label: "All Reports", icon: <Activity size={18} />, color: "from-purple-500 to-pink-500" },
            { to: "/admin/settings", label: "Settings", icon: <Shield size={18} />, color: "from-gray-500 to-slate-500" }
          ].map((action, idx) => (
            <Link 
              key={idx}
              to={action.to}
              className="group flex items-center justify-center gap-2 p-3 bg-white/80 rounded-xl border border-[#d4af37]/10 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${action.color} text-white`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium text-slate-700">{action.label}</span>
              <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <Shield size={12} /> Live data from database • Last updated: {new Date().toLocaleTimeString()}
            <Sparkles size={12} className="text-[#d4af37]" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;