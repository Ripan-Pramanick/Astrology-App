import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  User, Mail, Phone, Star, Calendar, Moon, Sun, Sparkles, 
  LogOut, Edit2, Save, X, Eye, Plus, TrendingUp, 
  Shield, Award, Clock, ChevronRight, Zap, Compass
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // API States
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Profile Edit States
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    // 🟢 Fetch Real Data from Backend (Supabase)
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.phone) return;
            try {
                const response = await api.get(`/reports/${user.phone}`);
                if (response.data.success) {
                    setRequests(response.data.reports || []);
                }
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    // Handlers
    const handleInputChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

    const saveProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/user/profile', {
                name: editForm.name, email: editForm.email, phone: user.phone
            });
            if (response.data.success) {
                Object.assign(user, { name: editForm.name, email: editForm.email });
                localStorage.setItem('user', JSON.stringify(user));
                setEditMode(false);
            }
        } catch (error) {
            alert('Failed to update profile.');
        }
    };

    // 🟢 View Saved Report Handler
    const handleViewResult = (report) => {
        localStorage.setItem('kundliData', JSON.stringify({
            basic: report.basic_info,
            planets: report.planets_data,
        }));
        navigate('/result');
    };

    if (!user) return null;
    const displayName = (user.name || user.phone || "Seeker").split(' ')[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            
            {/* --- TOP NAV --- */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">☉</span>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent tracking-wide">
                        Kaal Chakra
                    </h1>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 shadow-sm">
                        <User className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-semibold text-orange-700">Hi, {displayName}</span>
                    </div>
                    <button 
                        onClick={logout} 
                        className="p-2 rounded-full hover:bg-orange-50 border border-gray-200 hover:border-orange-200 transition-all text-orange-600"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 mb-8 text-white shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Welcome back, {displayName}! 🌟</h2>
                            <p className="text-orange-100">The stars are aligned in your favor today</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="bg-white/20 rounded-full px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                                Premium Member
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">

                    {/* --- 1. COSMIC PROFILE (Dynamic) --- */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 lg:col-span-1 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-5">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-orange-500" />
                                Cosmic Profile
                            </h3>
                            {!editMode && (
                                <button 
                                    onClick={() => setEditMode(true)} 
                                    className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1"
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <label className="text-xs uppercase tracking-wider text-orange-600 font-semibold block mb-1 flex items-center gap-1">
                                    <User className="w-3 h-3" /> Full Name
                                </label>
                                {editMode ? (
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={editForm.name} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-semibold">{user.name || <span className="text-gray-400 italic font-normal">Not set</span>}</p>
                                )}
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <label className="text-xs uppercase tracking-wider text-orange-600 font-semibold block mb-1 flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                {editMode ? (
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={editForm.email} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                                    />
                                ) : (
                                    <p className="text-gray-700 font-medium">{user.email || <span className="text-gray-400 italic font-normal">Not set</span>}</p>
                                )}
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <label className="text-xs uppercase tracking-wider text-orange-600 font-semibold block mb-1 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Mobile
                                </label>
                                <p className="text-gray-700 font-medium">{user.phone}</p>
                            </div>
                        </div>

                        {editMode && (
                            <div className="flex gap-3 mt-5">
                                <button 
                                    onClick={saveProfile} 
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-2 rounded-xl text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Save Changes
                                </button>
                                <button 
                                    onClick={() => setEditMode(false)} 
                                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-xl text-sm transition border border-gray-200 flex items-center justify-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- 2. KUNDALI REQUESTS (Dynamic Real Data) --- */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 lg:col-span-2 flex flex-col hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-orange-500" />
                                Your Kundali Reports
                            </h3>
                            <button 
                                onClick={() => navigate('/kundli')} 
                                className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> New Request
                            </button>
                        </div>

                        <div className="flex-1">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-orange-500 border-t-transparent"></div>
                                    <p className="text-orange-600 font-medium mt-3">Consulting the cosmic records...</p>
                                </div>
                            ) : requests.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No premium reports found.</p>
                                    <p className="text-gray-400 text-sm mt-1">Begin your cosmic journey by requesting a Kundali.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {requests.map((req) => (
                                        <div 
                                            key={req.id} 
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-orange-500 text-lg">📜</span>
                                                    <span className="font-bold text-gray-800">{req.name}</span>
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                        Completed
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-400 ml-8">
                                                    Created: {new Date(req.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/report/${req.id}`)}
                                                className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center gap-1 transition-colors"
                                            >
                                                View Report <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- 3. DAILY HOROSCOPE (Static UI) --- */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                    <Sun className="w-5 h-5 text-orange-500" />
                                    Daily Horoscope
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-2xl">♈</span>
                                    <span className="text-sm text-gray-500 font-semibold">Aries • March 21 - April 19</span>
                                </div>
                            </div>
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                            <p className="text-sm leading-relaxed text-gray-700 font-medium">
                                The Moon in your 10th house brings career recognition. Trust your intuition but stay grounded in practical matters today.
                            </p>
                        </div>
                        <div className="flex justify-between text-xs font-semibold bg-gray-50 p-3 rounded-lg mt-4 text-gray-600">
                            <span>🍀 Lucky #: 7</span>
                            <span>🎨 Color: Gold</span>
                            <span>😊 Mood: Focused</span>
                        </div>
                    </div>

                    {/* --- 4. PANCHANG (Static UI) --- */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
                            <Moon className="w-5 h-5 text-orange-500" />
                            Today's Panchang
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <span className="text-orange-600 font-bold block text-xs uppercase mb-1">Tithi</span>
                                <span className="text-gray-700 font-medium text-sm">Shukla Ekadashi</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <span className="text-orange-600 font-bold block text-xs uppercase mb-1">Nakshatra</span>
                                <span className="text-gray-700 font-medium text-sm">Rohini</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <span className="text-orange-600 font-bold block text-xs uppercase mb-1">Yoga</span>
                                <span className="text-gray-700 font-medium text-sm">Vishkumbha</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <span className="text-orange-600 font-bold block text-xs uppercase mb-1">Moon Sign</span>
                                <span className="text-gray-700 font-medium text-sm">Taurus</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                            <span>🌅 Sunrise: 6:18 AM</span>
                            <span>🌇 Sunset: 5:57 PM</span>
                        </div>
                    </div>

                    {/* --- 5. AI INSIGHT (Static UI) --- */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5 text-orange-500" />
                            AI Insight
                        </h3>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-l-4 border-orange-400">
                            <p className="italic text-gray-700 text-sm leading-relaxed">
                                "Mercury retrograde ends next week, boosting communication. Jupiter in the 9th house signals travel and higher learning. Embrace spiritual practices."
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                            <Shield className="w-3 h-3" />
                            <span>AI-generated insight • Updated daily</span>
                        </div>
                    </div>

                    {/* --- 6. QUICK ACTIONS (New Section) --- */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
                            <Compass className="w-5 h-5 text-orange-500" />
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button 
                                onClick={() => navigate('/kundli')}
                                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group"
                            >
                                <span className="text-gray-700 font-medium">Generate New Kundali</span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                            </button>
                            <button 
                                onClick={() => navigate('/matchmaking')}
                                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group"
                            >
                                <span className="text-gray-700 font-medium">Matchmaking Compatibility</span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                            </button>
                            <button 
                                onClick={() => navigate('/horoscope')}
                                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group"
                            >
                                <span className="text-gray-700 font-medium">Daily Horoscope</span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-xs flex items-center justify-center gap-2">
                        <Award className="w-3 h-3" />
                        Trusted Vedic Astrology Platform
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        24/7 Support Available
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;