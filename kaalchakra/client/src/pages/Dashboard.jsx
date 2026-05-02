// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import astrologyServices from '../services/astrologyApi.js';
import {
    User, Mail, Phone, Star, Calendar, Moon, Sun, Sparkles,
    LogOut, Edit2, Save, X, Eye, Plus, TrendingUp,
    Shield, Award, Clock, ChevronRight, Zap, Compass, Loader2,
    Heart
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // API States
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Live Data States
    const [horoscope, setHoroscope] = useState(null);
    const [panchang, setPanchang] = useState(null);
    const [aiInsight, setAiInsight] = useState(null);
    const [liveDataLoading, setLiveDataLoading] = useState(true);

    // Profile Edit States
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    // Redirect if no user
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Get user's zodiac sign from birth date or profile
    const getUserZodiacSign = () => {
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
        return 'Pisces';
    };

    const userZodiac = getUserZodiacSign();
    const zodiacSymbols = {
        'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
        'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
        'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
    };

    // Fetch Dashboard Data - Fixed to work with email users
    useEffect(() => {
        const fetchDashboardData = async () => {
            // Use email or id instead of phone for email users
            const userIdentifier = user?.email || user?.phone || user?.id;
            if (!userIdentifier) return;

            try {
                // Try to fetch reports by email
                const response = await api.get(`/reports/by-email/${encodeURIComponent(user.email)}`);
                if (response.data.success) {
                    setRequests(response.data.reports || []);
                }
            } catch (err) {
                console.error("Failed to load dashboard data", err);
                // If email fails, try phone
                if (user?.phone) {
                    try {
                        const phoneResponse = await api.get(`/reports/${user.phone}`);
                        if (phoneResponse.data.success) {
                            setRequests(phoneResponse.data.reports || []);
                        }
                    } catch (phoneErr) {
                        console.error("Phone fetch also failed:", phoneErr);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
            fetchLiveData();
        }
    }, [user]);

    // Fetch Live Data (Horoscope, Panchang, AI Insights)
    const fetchLiveData = async () => {
        setLiveDataLoading(true);
        try {
            const today = new Date();
            const params = {
                day: today.getDate(),
                month: today.getMonth() + 1,
                year: today.getFullYear(),
                hour: today.getHours(),
                minute: today.getMinutes(),
                second: today.getSeconds(),
                latitude: 28.6139,
                longitude: 77.2090,
                timezone: 5.5
            };

            // Fetch Daily Horoscope
            try {
                const horoscopeData = await astrologyServices.predictions.getDailyHoroscope(userZodiac.toLowerCase(), 'today');
                setHoroscope(horoscopeData);
            } catch (err) {
                console.error("Horoscope fetch error:", err);
                setHoroscope({ prediction: "The Moon in your 10th house brings career recognition. Trust your intuition but stay grounded in practical matters today." });
            }

            // Fetch Panchang
            try {
                const panchangData = await astrologyServices.panchang.getBasicPanchang(params);
                setPanchang(panchangData);
            } catch (err) {
                console.error("Panchang fetch error:", err);
                setPanchang({
                    tithi: { name: "Shukla Ekadashi" },
                    nakshatra: { name: "Rohini" },
                    yoga: { name: "Vishkumbha" },
                    moon_sign: "Taurus",
                    sunrise: "06:18 AM",
                    sunset: "05:57 PM"
                });
            }

            // Fetch AI Insight
            try {
                const aiResponse = await api.post('/ai/quick-insight', {
                    zodiac: userZodiac,
                    userId: user?.id
                });
                if (aiResponse.data.success) {
                    setAiInsight(aiResponse.data.insight);
                }
            } catch (err) {
                console.error("AI insight fetch error:", err);
                setAiInsight("Mercury retrograde ends next week, boosting communication. Jupiter in the 9th house signals travel and higher learning. Embrace spiritual practices.");
            }

        } catch (err) {
            console.error("Live data fetch error:", err);
        } finally {
            setLiveDataLoading(false);
        }
    };

    // Handlers
    const handleInputChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

    const saveProfile = async (e) => {
        e.preventDefault();
        try {
            // Use email as identifier for email users
            const identifier = user?.email || user?.phone;
            const response = await api.put(`/user/profile/${encodeURIComponent(identifier)}`, {
                name: editForm.name,
                email: editForm.email,
                phone: editForm.phone
            });
            if (response.data.success) {
                // Update local user object
                const updatedUser = { ...user, name: editForm.name, email: editForm.email };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // Update auth context if possible
                if (window.updateAuthUser) window.updateAuthUser(updatedUser);
                setEditMode(false);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            alert('Failed to update profile.');
        }
    };

    const handleViewResult = (report) => {
        localStorage.setItem('kundliData', JSON.stringify({
            basic: report.basic_info,
            planets: report.planets_data,
        }));
        navigate('/result');
    };

    if (!user) return null;

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const displayName = (user.name || user.email?.split('@')[0] || "Seeker").split(' ')[0];

    return (
        <div className="min-h-screen" style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'linear-gradient(to bottom right, #fffbeb, #fff7ed, #fff1f2)' }}>

            {/* TOP NAV */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: 'linear-gradient(to bottom right, #f97316, #f59e0b)' }}>
                        <span className="text-orange-500 font-bold text-xl">☉</span>
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent tracking-wide" style={{ backgroundImage: 'linear-gradient(to right, #ea580c, #d97706)' }}>
                        Kaal Chakra
                    </h1>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 shadow-sm">
                        <User className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-semibold text-orange-700">Hi, {capitalizeFirstLetter(displayName)}</span>
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

                {/* Welcome Banner - FIXED GRADIENT */}
                <div className=" rounded-2xl p-6 mb-8 text-white shadow-lg" style={{ backgroundImage: 'linear-gradient(to bottom right, #f97316, #f59e0b)' }}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Welcome back, {capitalizeFirstLetter(displayName)}! 🌟</h2>
                            <p className="text-orange-100">The stars are aligned in your favor today</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="bg-white/20 rounded-full px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                                {user.role === 'premium' ? 'Premium Member' : 'Free Member'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">

                    {/* 1. COSMIC PROFILE */}
                    <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-6 lg:col-span-1 hover:shadow-lg transition-shadow">
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
                            <div className=" rounded-xl p-3 border border-amber-100" style={{ backgroundImage: 'linear-gradient(to right, #f9fafb, #fff7ed)' }}>
                                <label className="text-xs uppercase tracking-wider text-orange-600 font-semibold block mb-1 flex items-center gap-1">
                                    <User className="w-3 h-3" /> Full Name
                                </label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-semibold">{capitalizeFirstLetter(user.name) || <span className="text-gray-400 italic font-normal">Not set</span>}</p>
                                )}
                            </div>
                            <div className=" rounded-xl p-3 border border-amber-100" style={{ backgroundImage: 'linear-gradient(to right, #f9fafb, #fff7ed)' }}>
                                <label className="text-xs uppercase tracking-wider text-orange-600 font-semibold block mb-1 flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                {editMode ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                                    />
                                ) : (
                                    <p className="text-gray-700 font-medium">{user.email || <span className="text-gray-400 italic font-normal">Not set</span>}</p>
                                )}
                            </div>
                            <div className=" rounded-xl p-3 border border-amber-100" style={{ backgroundImage: 'linear-gradient(to right, #f9fafb, #fff7ed)' }}>
                                <label className="text-xs uppercase tracking-wider text-orange-600 font-semibold block mb-1 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Mobile
                                </label>
                                <p className="text-gray-700 font-medium">{user.phone || 'Not provided'}</p>
                            </div>
                        </div>

                        {editMode && (
                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={saveProfile}
                                    className="flex-1  text-white font-semibold py-2 rounded-xl text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2" style={{ backgroundImage: 'linear-gradient(to right, #f97316, #f59e0b)' }}
                                >
                                    <Save className="w-4 h-4" /> Save Changes
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-xl text-sm transition border border-amber-200 flex items-center justify-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 2. KUNDALI REQUESTS - REST OF YOUR CODE */}
                    <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-6 lg:col-span-2 flex flex-col hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Star className="w-5 h-5 text-orange-500" />
                                Recent Kundali Requests
                            </h3>
                            <Link to="/kundli" className="text-orange-500 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                                New Report <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Star className="w-8 h-8 text-amber-400" />
                                </div>
                                <p className="text-gray-500">No Kundali reports yet</p>
                                <Link to="/kundli" className="inline-block mt-3 text-orange-500 font-semibold text-sm hover:underline">
                                    Generate your first report →
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {requests.slice(0, 3).map((req, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3  rounded-xl border border-amber-100 hover:shadow-md transition-all" style={{ backgroundImage: 'linear-gradient(to right, #f9fafb, #fff7ed)' }}>
                                        <div>
                                            <p className="font-semibold text-gray-800">{capitalizeFirstLetter(req.name) || 'Kundali Report'}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(req.created_at).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {req.status || 'Completed'}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleViewResult(req)} className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-orange-600 text-sm font-medium hover:bg-orange-50 transition flex items-center gap-1">
                                            <Eye className="w-3.5 h-3.5" /> View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 3. DAILY HOROSCOPE */}
                    <div className=" rounded-2xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition-shadow" style={{ backgroundImage: 'linear-gradient(to bottom right, #faf5ff, #eef2ff)' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Moon className="w-4 h-4 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-gray-800">Daily Horoscope</h3>
                        </div>
                        <div className="text-center mb-3">
                            <span className="text-3xl">{zodiacSymbols[userZodiac]}</span>
                            <p className="text-sm text-purple-600 font-semibold">{userZodiac}</p>
                        </div>
                        {liveDataLoading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                            </div>
                        ) : (
                            <p className="text-gray-700 text-sm leading-relaxed">{horoscope?.prediction || "The stars are aligning in your favor today."}</p>
                        )}
                        <Link to="/horoscope" className="mt-3 inline-block text-purple-500 text-xs font-semibold hover:underline">Full Horoscope →</Link>
                    </div>

                    {/* 4. TODAY'S PANCHANG */}
                    <div className=" rounded-2xl shadow-md border border-amber-100 p-6 hover:shadow-lg transition-shadow" style={{ backgroundImage: 'linear-gradient(to bottom right, #fffbeb, #fefce8)' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                <Sun className="w-4 h-4 text-amber-600" />
                            </div>
                            <h3 className="font-bold text-gray-800">Today's Panchang</h3>
                        </div>
                        {liveDataLoading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Sunrise:</span><span className="font-medium">{panchang?.sunrise || '06:18 AM'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Sunset:</span><span className="font-medium">{panchang?.sunset || '05:57 PM'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Tithi:</span><span className="font-medium">{panchang?.tithi?.name || 'Shukla Ekadashi'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Nakshatra:</span><span className="font-medium">{panchang?.nakshatra?.name || 'Rohini'}</span></div>
                            </div>
                        )}
                        <Link to="/panchang" className="mt-3 inline-block text-amber-500 text-xs font-semibold hover:underline">Detailed Panchang →</Link>
                    </div>

                    {/* 5. AI INSIGHT */}
                    <div className=" rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundImage: 'linear-gradient(to bottom right, #9333ea, #4f46e5)' }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold">AI Cosmic Insight</h3>
                                <p className="text-purple-200 text-xs">Powered by Gemini AI</p>
                            </div>
                        </div>
                        {liveDataLoading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                            </div>
                        ) : (
                            <p className="text-purple-100 text-sm leading-relaxed">{aiInsight || "Your cosmic energy is strong today. Trust your intuition."}</p>
                        )}
                    </div>

                    {/* 6. QUICK ACTIONS */}
                    <div className=" rounded-2xl shadow-md border border-emerald-100 p-6 hover:shadow-lg transition-shadow" style={{ backgroundImage: 'linear-gradient(to bottom right, #ecfdf5, #f0fdfa)' }}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-gray-800">Quick Actions</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/kundli" className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-emerald-100 hover:shadow-md transition">
                                <Star className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs font-medium">New Kundli</span>
                            </Link>
                            <Link to="/matchmaking" className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-emerald-100 hover:shadow-md transition">
                                <Heart className="w-5 h-5 text-rose-500" />
                                <span className="text-xs font-medium">Matchmaking</span>
                            </Link>
                            <Link to="/horoscope" className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-emerald-100 hover:shadow-md transition">
                                <Moon className="w-5 h-5 text-purple-500" />
                                <span className="text-xs font-medium">Horoscope</span>
                            </Link>
                            <Link to="/panchang" className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-emerald-100 hover:shadow-md transition">
                                <Calendar className="w-5 h-5 text-amber-500" />
                                <span className="text-xs font-medium">Panchang</span>
                            </Link>
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