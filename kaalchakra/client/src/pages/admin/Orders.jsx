// client/src/pages/admin/Orders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, Search, CheckCircle, Clock, XCircle, IndianRupee, 
  Calendar, Sparkles, Download, Filter, Eye, TrendingUp, 
  Users, CreditCard, DollarSign, ArrowUpDown, Loader2
} from 'lucide-react';
import { SparkleButton, BackgroundSparkles } from '../../components/ui/Sparkle.jsx';
import api from '../../services/api.js';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    successRate: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      // Fetch orders from your backend
      const response = await api.get('/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const ordersData = response.data?.orders || response.data || [];
      setOrders(ordersData);
      
      // Calculate stats
      const successfulOrders = ordersData.filter(o => 
        o.status === 'success' || o.status === 'paid' || o.status === 'completed'
      );
      const totalRevenue = successfulOrders.reduce((sum, o) => {
        const amount = o.amount > 1000 ? o.amount / 100 : o.amount;
        return sum + (amount || 0);
      }, 0);
      
      setStats({
        totalOrders: ordersData.length,
        totalRevenue: totalRevenue,
        successRate: ordersData.length > 0 ? (successfulOrders.length / ordersData.length) * 100 : 0,
        pendingOrders: ordersData.filter(o => o.status === 'pending' || o.status === 'created').length
      });
      
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError('Failed to load cosmic transactions.');
      
      // Fallback demo data
      const demoOrders = [
        { id: 1, order_id: 'ORD_001', user_name: 'Priya Sharma', amount: 1100, status: 'success', service: 'Kundali Analysis', created_at: new Date().toISOString() },
        { id: 2, order_id: 'ORD_002', user_name: 'Rajesh Kumar', amount: 1100, status: 'success', service: 'Matchmaking', created_at: new Date().toISOString() },
        { id: 3, order_id: 'ORD_003', user_name: 'Anjali Singh', amount: 1100, status: 'pending', service: 'Career Consultation', created_at: new Date().toISOString() },
        { id: 4, order_id: 'ORD_004', user_name: 'Vikram Mehta', amount: 1100, status: 'success', service: 'Muhurata', created_at: new Date().toISOString() },
        { id: 5, order_id: 'ORD_005', user_name: 'Neha Gupta', amount: 1100, status: 'pending', service: 'Name Correction', created_at: new Date().toISOString() }
      ];
      setOrders(demoOrders);
      setStats({
        totalOrders: demoOrders.length,
        totalRevenue: demoOrders.filter(o => o.status === 'success').length * 1100,
        successRate: (demoOrders.filter(o => o.status === 'success').length / demoOrders.length) * 100,
        pendingOrders: demoOrders.filter(o => o.status === 'pending').length
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      if (filter === 'all') return true;
      if (filter === 'success') return order.status === 'success' || order.status === 'paid' || order.status === 'completed';
      if (filter === 'pending') return order.status === 'pending' || order.status === 'created';
      return true;
    })
    .filter(order => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        order.user_name?.toLowerCase().includes(searchLower) ||
        order.order_id?.toLowerCase().includes(searchLower) ||
        order.service?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'date') {
        aVal = new Date(a.created_at);
        bVal = new Date(b.created_at);
      } else if (sortBy === 'amount') {
        aVal = a.amount > 1000 ? a.amount / 100 : a.amount;
        bVal = b.amount > 1000 ? b.amount / 100 : b.amount;
      } else if (sortBy === 'name') {
        aVal = a.user_name || '';
        bVal = b.user_name || '';
      } else {
        aVal = a.status || '';
        bVal = b.status || '';
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'success' || status === 'paid' || status === 'completed') {
      return <CheckCircle size={14} className="text-green-500" />;
    }
    if (status === 'pending' || status === 'created') {
      return <Clock size={14} className="text-orange-500" />;
    }
    return <XCircle size={14} className="text-red-500" />;
  };

  const getStatusColor = (status) => {
    if (status === 'success' || status === 'paid' || status === 'completed') {
      return 'bg-green-100 text-green-700 border-green-200';
    }
    if (status === 'pending' || status === 'created') {
      return 'bg-orange-100 text-orange-700 border-orange-200';
    }
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Service', 'Amount', 'Status', 'Date'];
    const rows = filteredOrders.map(order => [
      order.order_id || order.id,
      order.user_name || 'Guest',
      order.service || 'Astrology Service',
      order.amount > 1000 ? order.amount / 100 : order.amount,
      order.status,
      new Date(order.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3efe6] to-[#e8e3d8] flex flex-col items-center justify-center relative overflow-hidden">
      <BackgroundSparkles count={30} />
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#d4af37] border-t-[#b8860b] rounded-full animate-spin"></div>
        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#d4af37] animate-pulse" size={24} />
      </div>
      <p className="mt-4 text-[#b8860b] font-bold tracking-widest uppercase text-sm animate-pulse">Loading Cosmic Orders...</p>
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
              <Sparkles size={20} className="text-[#d4af37]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#d4af37] to-[#b8860b] rounded-2xl shadow-lg">
                <ShoppingBag className="text-white w-7 h-7" />
              </div>
              <span className="bg-gradient-to-r from-[#b8860b] to-[#d4af37] bg-clip-text text-transparent">
                Cosmic Orders & Payments
              </span>
              <Sparkles className="text-[#d4af37] animate-pulse" size={20} />
            </h1>
            <p className="text-slate-500 font-medium mt-1 ml-2">Track all consultations and astrological services.</p>
          </div>
          
          <div className="flex gap-3">
            {/* Export Button */}
            <SparkleButton
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#b8860b] rounded-xl shadow-md border border-[#d4af37]/20 hover:shadow-lg"
              sparkleColor="#d4af37"
            >
              <Download size={16} /> Export CSV
            </SparkleButton>
            
            {/* Refresh Button */}
            <SparkleButton
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-xl shadow-md hover:shadow-lg"
              sparkleColor="#FFD700"
            >
              <RefreshCw size={16} /> Refresh
            </SparkleButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={20} />, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign size={20} />, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Success Rate', value: `${Math.round(stats.successRate)}%`, icon: <TrendingUp size={20} />, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Pending Orders', value: stats.pendingOrders, icon: <Clock size={20} />, gradient: 'from-orange-500 to-red-500' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#d4af37]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800 mt-1">{stat.value}</p>
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
              placeholder="Search by customer name, order ID, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-[#d4af37]/20 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="flex bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-[#d4af37]/20 p-1">
              {['all', 'success', 'pending'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                    filter === type 
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white shadow-md' 
                      : 'text-slate-500 hover:text-[#b8860b] hover:bg-[#f3efe6]'
                  }`}
                >
                  {type === 'all' ? 'All Orders' : type}
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

        {/* Orders Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-[#d4af37]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-[#fdfbfb] to-[#f3efe6] border-b border-[#d4af37]/20">
                <tr>
                  <th className="px-6 py-4 text-[#b8860b] text-xs uppercase tracking-wider font-bold cursor-pointer hover:text-[#d4af37] transition-colors" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Seeker <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-[#b8860b] text-xs uppercase tracking-wider font-bold">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-[#b8860b] text-xs uppercase tracking-wider font-bold cursor-pointer hover:text-[#d4af37] transition-colors" onClick={() => handleSort('amount')}>
                    <div className="flex items-center gap-1">
                      Amount <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-[#b8860b] text-xs uppercase tracking-wider font-bold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[#b8860b] text-xs uppercase tracking-wider font-bold cursor-pointer hover:text-[#d4af37] transition-colors" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-1">
                      Date <ArrowUpDown size={12} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order, idx) => {
                  const displayAmount = order.amount > 1000 ? order.amount / 100 : order.amount;
                  
                  return (
                    <tr key={order.id} className="hover:bg-[#f3efe6]/30 transition-all duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#b8860b]/10 flex items-center justify-center text-[#b8860b] font-bold">
                            {order.user_name?.charAt(0) || 'G'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{order.user_name || 'Guest User'}</div>
                            <div className="text-xs text-slate-400">ID: {order.order_id || order.id?.substring(0, 8)}</div>
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{order.service || 'Astrology Service'}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{order.order_id || `ORD_${order.id}`}</div>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-black text-slate-800">
                          <IndianRupee size={14} className="text-[#d4af37]" /> {displayAmount}
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar size={12} /> 
                          {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                       </td>
                     </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#d4af37]/10 to-[#b8860b]/5 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-[#d4af37]/40" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">No Orders Found</h3>
                <p className="text-sm text-slate-400 mt-1">There are no transactions matching your criteria.</p>
                <SparkleButton
                  onClick={() => { setFilter('all'); setSearchTerm(''); }}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-lg text-sm"
                  sparkleColor="#FFD700"
                >
                  Clear Filters
                </SparkleButton>
              </div>
            )}
          </div>
          
          {/* Table Footer */}
          {filteredOrders.length > 0 && (
            <div className="px-6 py-4 border-t border-[#d4af37]/10 bg-[#fdfbfb] flex justify-between items-center text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-[#d4af37]" />
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={12} />
                Total Revenue: ₹{filteredOrders.reduce((sum, o) => {
                  const amount = o.amount > 1000 ? o.amount / 100 : o.amount;
                  return sum + (o.status === 'success' ? amount : 0);
                }, 0).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add RefreshCw icon if not imported
const RefreshCw = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
  </svg>
);

// Add AlertCircle icon if not imported
const AlertCircle = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default Orders;