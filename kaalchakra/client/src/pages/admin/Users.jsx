// client/src/pages/admin/Users.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users as UsersIcon, Trash2, ShieldCheck, ShieldAlert, Mail, Phone, 
  Sparkles, Search, Filter, Crown, Star, Calendar, Eye, 
  UserCheck, UserX, RefreshCw, Loader2, AlertCircle
} from 'lucide-react';
import { SparkleButton, BackgroundSparkles } from '../../components/ui/Sparkle.jsx';
import api from '../../services/api.js';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    premiumCount: 0,
    newThisMonth: 0
  });

  const API_URL = 'http://localhost:5000/api/admin/users';

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search or filter changes
  useEffect(() => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const usersData = response.data?.users || response.data || [];
      setUsers(usersData);
      
      // Calculate stats
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      setStats({
        totalUsers: usersData.length,
        adminCount: usersData.filter(u => u.role === 'admin').length,
        premiumCount: usersData.filter(u => u.role === 'premium').length,
        newThisMonth: usersData.filter(u => new Date(u.created_at) >= firstDayOfMonth).length
      });
      
    } catch (err) {
      console.error("Users fetch error:", err);
      setError('Failed to load cosmic seekers.');
      
      // Fallback demo data
      const demoUsers = [
        { id: 1, name: 'Priya Sharma', phone: '+91 98765 43210', email: 'priya@example.com', role: 'user', created_at: new Date().toISOString() },
        { id: 2, name: 'Rajesh Kumar', phone: '+91 87654 32109', email: 'rajesh@example.com', role: 'premium', created_at: new Date().toISOString() },
        { id: 3, name: 'Anjali Singh', phone: '+91 76543 21098', email: 'anjali@example.com', role: 'user', created_at: new Date().toISOString() },
        { id: 4, name: 'Dr. Suresh Rao', phone: '+91 65432 10987', email: 'suresh@example.com', role: 'admin', created_at: new Date().toISOString() },
      ];
      setUsers(demoUsers);
      setStats({
        totalUsers: demoUsers.length,
        adminCount: demoUsers.filter(u => u.role === 'admin').length,
        premiumCount: demoUsers.filter(u => u.role === 'premium').length,
        newThisMonth: demoUsers.length
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to banish ${userName || 'this user'} from the universe?`)) return;
    
    setActionLoading(`delete-${userId}`);
    try {
      const token = localStorage.getItem('authToken');
      await api.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMakeAdmin = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const actionText = newRole === 'admin' ? 'promote to Admin' : 'demote to User';
    
    if (!window.confirm(`Are you sure you want to ${actionText}?`)) return;

    setActionLoading(`role-${userId}`);
    try {
      const token = localStorage.getItem('authToken');
      await api.put(`/admin/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        adminCount: prev.adminCount + (newRole === 'admin' ? 1 : -1)
      }));
      
    } catch (err) {
      console.error(err);
      alert('Failed to update role.');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return {
        icon: <ShieldCheck size={14} />,
        text: 'Admin',
        className: 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white shadow-md'
      };
    }
    if (role === 'premium') {
      return {
        icon: <Crown size={14} />,
        text: 'Premium',
        className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
      };
    }
    return {
      icon: <ShieldAlert size={14} />,
      text: 'User',
      className: 'bg-slate-100 text-slate-600'
    };
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3efe6] to-[#e8e3d8] flex flex-col items-center justify-center relative overflow-hidden">
      <BackgroundSparkles count={40} />
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#d4af37] border-t-[#b8860b] rounded-full animate-spin"></div>
        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#d4af37] animate-pulse" size={24} />
      </div>
      <p className="mt-4 text-[#b8860b] font-bold tracking-widest uppercase text-sm animate-pulse">Gathering Cosmic Seekers...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] via-[#f3efe6] to-[#e8e3d8] p-4 md:p-8 font-sans relative overflow-hidden">
      <BackgroundSparkles count={50} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="relative">
            <div className="absolute -top-3 -left-3 opacity-50 animate-pulse">
              <Star size={20} fill="#FFD700" className="text-yellow-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#d4af37] to-[#b8860b] rounded-2xl shadow-lg">
                <UsersIcon className="text-white w-7 h-7" />
              </div>
              <span className="bg-gradient-to-r from-[#b8860b] to-[#d4af37] bg-clip-text text-transparent">
                User Management
              </span>
              <Sparkles className="text-[#d4af37] animate-pulse" size={20} />
            </h1>
            <p className="text-slate-500 font-medium mt-1 ml-2">Manage cosmic seekers and their celestial roles.</p>
          </div>
          
          <SparkleButton
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-xl shadow-md hover:shadow-lg"
            sparkleColor="#FFD700"
          >
            <RefreshCw size={16} /> Refresh Users
          </SparkleButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Seekers', value: stats.totalUsers, icon: <UsersIcon size={20} />, gradient: 'from-blue-500 to-cyan-500', change: `+${stats.newThisMonth} this month` },
            { label: 'Admin Users', value: stats.adminCount, icon: <ShieldCheck size={20} />, gradient: 'from-[#d4af37] to-[#b8860b]', change: 'Administrators' },
            { label: 'Premium Members', value: stats.premiumCount, icon: <Crown size={20} />, gradient: 'from-purple-500 to-pink-500', change: 'VIP access' },
            { label: 'Regular Users', value: stats.totalUsers - stats.adminCount - stats.premiumCount, icon: <UserCheck size={20} />, gradient: 'from-green-500 to-emerald-500', change: 'Standard access' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#d4af37]/10 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800 mt-1">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-[#d4af37]/20 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="flex bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-[#d4af37]/20 p-1">
              {['all', 'admin', 'premium', 'user'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                    roleFilter === role 
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white shadow-md' 
                      : 'text-slate-500 hover:text-[#b8860b] hover:bg-[#f3efe6]'
                  }`}
                >
                  {role === 'all' ? 'All Roles' : role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-[#d4af37]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-[#fdfbfb] to-[#f3efe6] border-b border-[#d4af37]/20">
                <tr>
                  <th className="px-6 py-4 text-[#b8860b] text-xs uppercase tracking-wider font-bold">Seeker Info</th>
                  <th className="px-6 py-4 text-[#b8860b] text-xs uppercase tracking-wider font-bold">Contact</th>
                  <th className="px-6 py-4 text-[#b8860b] text-xs uppercase tracking-wider font-bold">Status / Role</th>
                  <th className="px-6 py-4 text-[#b8860b] text-xs uppercase tracking-wider font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const isAdmin = user.role === 'admin';
                  
                  return (
                    <tr key={user.id} className="hover:bg-[#f3efe6]/30 transition-all duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#b8860b]/10 flex items-center justify-center text-[#b8860b] font-bold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{user.name || 'Unknown Seeker'}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <Calendar size={10} />
                              Joined: {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-semibold text-slate-700">
                          <Phone size={14} className="text-[#d4af37]" /> {user.phone || 'No phone'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <Mail size={14} className="text-[#d4af37]" /> {user.email || 'No email'}
                        </div>
                        </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit ${roleBadge.className}`}>
                          {roleBadge.icon}
                          {roleBadge.text}
                        </span>
                        </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Make Admin / Remove Admin Button */}
                          <SparkleButton
                            onClick={() => handleMakeAdmin(user.id, user.role)}
                            disabled={actionLoading === `role-${user.id}`}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                              isAdmin 
                                ? 'text-orange-600 border-orange-200 hover:bg-orange-50' 
                                : 'text-[#b8860b] border-[#d4af37]/40 hover:bg-[#f3efe6]'
                            } disabled:opacity-50`}
                            sparkleColor={isAdmin ? '#F97316' : '#d4af37'}
                          >
                            {actionLoading === `role-${user.id}` ? (
                              <Loader2 className="animate-spin inline" size={14} />
                            ) : isAdmin ? (
                              'Remove Admin'
                            ) : (
                              'Make Admin'
                            )}
                          </SparkleButton>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            disabled={actionLoading === `delete-${user.id}`}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete User"
                          >
                            {actionLoading === `delete-${user.id}` ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                        </td>
                      </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#d4af37]/10 to-[#b8860b]/5 rounded-full flex items-center justify-center mb-4">
                  <UsersIcon className="w-10 h-10 text-[#d4af37]/40" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">No Seekers Found</h3>
                <p className="text-sm text-slate-400 mt-1">No users match your search criteria.</p>
                <SparkleButton
                  onClick={() => { setSearchTerm(''); setRoleFilter('all'); }}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-lg text-sm"
                  sparkleColor="#FFD700"
                >
                  Clear Filters
                </SparkleButton>
              </div>
            )}
          </div>
          
          {/* Table Footer */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-[#d4af37]/10 bg-[#fdfbfb] flex justify-between items-center text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-[#d4af37]" />
                Showing {filteredUsers.length} of {users.length} seekers
              </div>
              <div className="flex items-center gap-2">
                <Eye size={12} />
                {stats.adminCount} Admins • {stats.premiumCount} Premium • {stats.totalUsers - stats.adminCount - stats.premiumCount} Users
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;