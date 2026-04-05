import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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
                // আমরা ইউজারের ফোন নাম্বার দিয়ে তার সেভ করা রিপোর্টগুলো আনবো
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
        // ডেটাবেসের ডেটা লোকাল স্টোরেজে রেখে রেজাল্ট পেজে নিয়ে যাওয়া
        localStorage.setItem('kundliData', JSON.stringify({
            basic: report.basic_info,
            planets: report.planets_data,
        }));
        navigate('/result');
    };

    if (!user) return null;
    const displayName = (user.name || user.phone || "Seeker").split(' ')[0];

    return (
        <div className="min-h-screen relative text-slate-700 font-sans">
            <div className="starfield-bg"></div>

            {/* --- TOP NAV --- */}
            <header className="glass-nav sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f4a460] flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                        <span className="text-white font-bold text-xl">☉</span>
                    </div>
                    <h1 className="text-xl font-bold gold-gradient-text tracking-wide">JyotishAI</h1>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-amber-50/50 px-4 py-1.5 rounded-full border border-[#cf9f4a]/30 shadow-sm">
                        <span>👤</span>
                        <span className="text-sm font-bold text-[#b8860b]">Hi, {displayName}</span>
                    </div>
                    <button onClick={logout} className="p-2 rounded-full hover:bg-amber-50 border border-transparent hover:border-[#cf9f4a]/50 transition-all text-[#b8860b]" title="Logout">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    </button>
                </div>
            </header>

            <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">

                    {/* --- 1. COSMIC PROFILE (Dynamic) --- */}
                    <div className="glass-card rounded-2xl p-5 lg:col-span-1">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <span className="text-[#cf9f4a]">⭐</span> Cosmic Profile
                            </h3>
                            {!editMode && (
                                <button onClick={() => setEditMode(true)} className="text-[#b8860b] hover:text-[#d4af37] text-sm font-semibold hover:underline">Edit</button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/60 rounded-xl p-3 border border-[#cf9f4a]/20">
                                <label className="text-xs uppercase tracking-wider text-[#b8860b] font-semibold block mb-1">Full Name</label>
                                {editMode ? (
                                    <input type="text" name="name" value={editForm.name} onChange={handleInputChange} className="w-full bg-white border border-[#cf9f4a]/50 rounded-lg px-3 py-1.5 text-slate-800 outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]" />
                                ) : (
                                    <p className="text-slate-800 font-bold">{user.name || <span className="text-slate-400 italic font-normal">Not set</span>}</p>
                                )}
                            </div>
                            <div className="bg-white/60 rounded-xl p-3 border border-[#cf9f4a]/20">
                                <label className="text-xs uppercase tracking-wider text-[#b8860b] font-semibold block mb-1">Email</label>
                                {editMode ? (
                                    <input type="email" name="email" value={editForm.email} onChange={handleInputChange} className="w-full bg-white border border-[#cf9f4a]/50 rounded-lg px-3 py-1.5 text-slate-800 outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]" />
                                ) : (
                                    <p className="text-slate-700 font-medium">{user.email || <span className="text-slate-400 italic font-normal">Not set</span>}</p>
                                )}
                            </div>
                            <div className="bg-white/60 rounded-xl p-3 border border-[#cf9f4a]/20">
                                <label className="text-xs uppercase tracking-wider text-[#b8860b] font-semibold block mb-1">Mobile</label>
                                <p className="text-slate-700 font-medium">{user.phone}</p>
                            </div>
                        </div>

                        {editMode && (
                            <div className="flex gap-2 mt-4">
                                <button onClick={saveProfile} className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#e4b363] text-white font-bold py-2 rounded-lg text-sm transition shadow-[0_0_10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">Save</button>
                                <button onClick={() => setEditMode(false)} className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 rounded-lg text-sm transition border border-[#cf9f4a]/30">Cancel</button>
                            </div>
                        )}
                    </div>

                    {/* --- 2. KUNDALI REQUESTS (Dynamic Real Data) --- */}
                    <div className="glass-card rounded-2xl p-5 lg:col-span-2 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <span className="text-[#cf9f4a]">📜</span> Your Kundali Reports
                            </h3>
                            <button onClick={() => navigate('/kundli')} className="bg-amber-50 hover:bg-amber-100 text-[#b8860b] border border-[#cf9f4a]/40 px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-sm">
                                + Request New
                            </button>
                        </div>

                        <div className="flex-1">
                            {loading ? (
                                <p className="text-[#b8860b] font-medium text-center py-8 animate-pulse">Consulting the cosmic records...</p>
                            ) : requests.length === 0 ? (
                                <div className="text-center py-10 bg-white/40 rounded-xl border border-dashed border-[#cf9f4a]/40">
                                    <p className="text-slate-500 font-medium text-sm">No premium reports found. Begin your cosmic journey.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-[#b8860b] uppercase border-b border-[#cf9f4a]/20">
                                            <tr>
                                                <th className="pb-3 font-bold">Name / Date</th>
                                                <th className="pb-3 font-bold">Status</th>
                                                <th className="pb-3 font-bold text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#cf9f4a]/10">
                                            {requests.map((req) => (
                                                <tr key={req.id} className="hover:bg-amber-50/50 transition-colors">
                                                    <td className="py-4 text-slate-700 font-medium">
                                                        <div className="font-bold text-[#b8860b]">{req.name}</div>
                                                        <div className="text-xs text-slate-500">Created: {new Date(req.created_at).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold border bg-emerald-100 text-emerald-700 border-emerald-200">
                                                            Completed
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        {/* 🟢 Real View Result Button */}
                                                        <button
                                                            onClick={() => navigate(`/report/${req.id}`)}
                                                            className="text-[#b8860b] hover:text-[#d4af37] font-bold text-sm underline transition-colors cursor-pointer"
                                                        >
                                                            View Report
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- 3. DAILY HOROSCOPE (Static UI) --- */}
                    <div className="glass-card rounded-2xl p-5">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    <span className="text-[#cf9f4a]">✨</span> Daily Horoscope
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl">♈</span>
                                    <span className="text-xs text-slate-500 font-semibold">Aries</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/60 rounded-xl p-3 border border-[#cf9f4a]/20">
                            <p className="text-sm leading-relaxed text-slate-700 font-medium">The Moon in your 10th house brings career recognition. Trust your intuition but stay grounded in practical matters today.</p>
                        </div>
                        <div className="flex justify-between text-xs font-bold bg-amber-50 p-2.5 rounded-lg mt-3 border border-[#cf9f4a]/10 text-[#b8860b]">
                            <span>🍀 #7</span>
                            <span>🎨 Gold</span>
                            <span>😊 Focused</span>
                        </div>
                    </div>

                    {/* --- 4. PANCHANG (Static UI) --- */}
                    <div className="glass-card rounded-2xl p-5">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">
                            <span className="text-[#cf9f4a]">📆</span> Today's Panchang
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 font-medium">
                            <div className="bg-white/60 rounded-lg p-2.5 border border-[#cf9f4a]/10"><span className="text-[#b8860b] font-bold block text-xs uppercase">Tithi</span> Shukla Ekadashi</div>
                            <div className="bg-white/60 rounded-lg p-2.5 border border-[#cf9f4a]/10"><span className="text-[#b8860b] font-bold block text-xs uppercase">Nakshatra</span> Rohini</div>
                            <div className="bg-white/60 rounded-lg p-2.5 border border-[#cf9f4a]/10"><span className="text-[#b8860b] font-bold block text-xs uppercase">Yoga</span> Vishkumbha</div>
                            <div className="bg-white/60 rounded-lg p-2.5 border border-[#cf9f4a]/10"><span className="text-[#b8860b] font-bold block text-xs uppercase">Moon</span> Taurus</div>
                        </div>
                    </div>

                    {/* --- 5. AI INSIGHT (Static UI) --- */}
                    <div className="glass-card rounded-2xl p-5">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">
                            <span className="text-[#cf9f4a]">🤖</span> AI Insight
                        </h3>
                        <div className="text-sm leading-relaxed bg-amber-50 p-4 rounded-xl border-l-4 border-[#d4af37]">
                            <p className="italic text-slate-700 font-medium">"Mercury retrograde ends next week, boosting communication. Jupiter in the 9th house signals travel and higher learning. Embrace spiritual practices."</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;