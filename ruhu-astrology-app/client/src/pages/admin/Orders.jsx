// client/src/pages/admin/Orders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Search, CheckCircle, Clock, XCircle, IndianRupee, Calendar } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, success, pending

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      // ব্যাকএন্ডের getAllOrders API কল করা হচ্ছে
      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load cosmic transactions.');
    } finally {
      setLoading(false);
    }
  };

  // ফিল্টার করার লজিক
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'success') return order.status === 'success' || order.status === 'paid' || order.status === 'completed';
    if (filter === 'pending') return order.status === 'pending' || order.status === 'created';
    return true;
  });

  if (loading) return (
    <div className="min-h-screen bg-[#f3efe6] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#cf9f4a] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#f3efe6] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <ShoppingBag className="text-[#d4af37] w-8 h-8" /> Cosmic Orders & Payments
            </h1>
            <p className="text-slate-500 font-medium mt-1">Track all consultations and astrological services.</p>
          </div>
          
          {/* Status Filters */}
          <div className="flex bg-white rounded-xl shadow-sm border border-[#cf9f4a]/20 p-1">
            {['all', 'success', 'pending'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  filter === type 
                    ? 'bg-[#d4af37] text-white shadow-md' 
                    : 'text-slate-500 hover:text-[#b8860b] hover:bg-[#f3efe6]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-red-500 bg-red-50 p-4 rounded-xl mb-6 font-bold">{error}</div>}

        {/* Orders Table */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-[#cf9f4a]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-[#fdfbfb] border-b border-[#cf9f4a]/20 text-[#b8860b] text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-5">Order Details</th>
                  <th className="px-6 py-5">Seeker (User)</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600 text-sm">
                {filteredOrders.map((order) => {
                  // অ্যামাউন্ট পয়সায় থাকলে টাকায় কনভার্ট করা (Razorpay logic)
                  const displayAmount = order.amount > 1000 ? order.amount / 100 : order.amount;
                  
                  return (
                    <tr key={order.id} className="hover:bg-[#f3efe6]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 text-sm">{order.service || 'Astrology Service'}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">ID: {order.order_id || order.id?.substring(0,10)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-700">{order.user_name || 'Guest User'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-black text-slate-800 text-base">
                          <IndianRupee size={14} className="text-[#d4af37]" /> {displayAmount}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-max ${
                          (order.status === 'success' || order.status === 'paid' || order.status === 'completed') 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : (order.status === 'pending' || order.status === 'created')
                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {(order.status === 'success' || order.status === 'paid' || order.status === 'completed') && <CheckCircle size={12} />}
                          {(order.status === 'pending' || order.status === 'created') && <Clock size={12} />}
                          {(order.status === 'failed') && <XCircle size={12} />}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500 font-medium">
                          <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <ShoppingBag className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No Orders Found</h3>
                <p className="text-sm text-slate-400 mt-1">There are no transactions matching this filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;