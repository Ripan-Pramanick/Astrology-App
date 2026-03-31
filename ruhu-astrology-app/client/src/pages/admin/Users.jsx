// client/src/pages/admin/Users.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users as UsersIcon, Trash2, ShieldCheck, ShieldAlert, Mail, Phone } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // delete বা update এর লোডিং স্টেট

  const API_URL = 'http://localhost:5000/api/admin/users';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load cosmic seekers.');
    } finally {
      setLoading(false);
    }
  };

  // ইউজার ডিলিট করার লজিক
  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to banish ${userName || 'this user'} from the universe?`)) return;
    
    setActionLoading(`delete-${userId}`);
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user.');
    } finally {
      setActionLoading(null);
    }
  };

  // অ্যাডমিন বানানোর লজিক
  const handleMakeAdmin = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const actionText = newRole === 'admin' ? 'promote to Admin' : 'demote to User';
    
    if (!window.confirm(`Are you sure you want to ${actionText}?`)) return;

    setActionLoading(`role-${userId}`);
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_URL}/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // UI তে রোল আপডেট করা
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error(err);
      alert('Failed to update role.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f3efe6] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#cf9f4a] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#f3efe6] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <UsersIcon className="text-[#d4af37] w-8 h-8" /> User Management
            </h1>
            <p className="text-slate-500 font-medium mt-1">Total {users.length} seekers registered.</p>
          </div>
        </div>

        {error && <div className="text-red-500 bg-red-50 p-4 rounded-xl mb-6 font-bold">{error}</div>}

        {/* User Table */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-[#cf9f4a]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-[#fdfbfb] border-b border-[#cf9f4a]/20 text-[#b8860b] text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-5">Seeker Info</th>
                  <th className="px-6 py-5">Contact</th>
                  <th className="px-6 py-5">Status / Role</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600 text-sm">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#f3efe6]/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-base">{user.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-semibold text-slate-700">
                        <Phone size={14} className="text-[#d4af37]" /> {user.phone}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Mail size={14} className="text-[#d4af37]" /> {user.email || 'No Email'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-max ${
                        user.role === 'admin' ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white shadow-md' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role === 'admin' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        {/* Make Admin / Remove Admin Button */}
                        <button
                          onClick={() => handleMakeAdmin(user.id, user.role)}
                          disabled={actionLoading === `role-${user.id}`}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            user.role === 'admin' 
                            ? 'text-orange-600 border-orange-200 hover:bg-orange-50' 
                            : 'text-[#b8860b] border-[#d4af37]/40 hover:bg-[#f3efe6]'
                          } disabled:opacity-50`}
                        >
                          {actionLoading === `role-${user.id}` ? 'Updating...' : user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={actionLoading === `delete-${user.id}`}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="p-8 text-center text-slate-400 font-medium">No cosmic seekers found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;