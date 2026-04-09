import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import api from '../services/api.js';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '' // এখানে কান্ট্রি কোডসহ ফুল নম্বর থাকবে
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ফোনের জন্য আলাদা হ্যান্ডলার (যেহেতু এটি সরাসরি ভ্যালু দেয়)
    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phone: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.phone.length < 10) {
            setError('Please enter a valid phone number with country code.');
            return;
        }

        setLoading(true);

        try {
            // Firebase ও ব্যাকএন্ডের জন্য নম্বরের আগে '+' থাকা জরুরি
            const formattedPhone = formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`;

            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                phone: formattedPhone
            });

            if (response.data.success) {
                // সাকসেস হলে OTP পেজে পাঠিয়ে দিন
                navigate('/verify-otp', { state: { phone: formattedPhone, isRegistering: true } });
            } else {
                setError(response.data.message || 'Account creation failed.');
            }
        } catch (error) {
            console.error("Registration Error:", error);
            setError(error.response?.data?.message || 'Server error! Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-gradient-to-br from-[#fdfbfb] to-[#f3efe6]">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10" style={{
                backgroundImage: `radial-gradient(2px 2px at 20px 30px, #d4af37, rgba(0,0,0,0)), radial-gradient(1px 1px at 80px 140px, #b8860b, rgba(0,0,0,0))`,
                backgroundSize: '200px 200px, 300px 300px'
            }}></div>

            <div className="relative z-10 w-full max-w-md px-6 py-12">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f4a460] shadow-[0_0_15px_rgba(212,175,55,0.4)] mb-4">
                        <ShieldCheck className="text-white w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#b8860b] to-[#d4af37] bg-clip-text text-transparent tracking-wide">
                        Begin Your Journey
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">Create your cosmic profile with JyotishAI</p>
                </div>

                {/* Registration Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(212,175,55,0.1)] border border-[#cf9f4a]/30">
                    <form onSubmit={handleRegister} className="space-y-5">

                        {/* Name Input */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-[#b8860b] font-bold mb-1.5 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#cf9f4a] z-10">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-[#cf9f4a]/40 rounded-xl leading-5 bg-white/50 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-[#b8860b] font-bold mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#cf9f4a] z-10">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-[#cf9f4a]/40 rounded-xl leading-5 bg-white/50 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        {/* International Phone Input */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-[#b8860b] font-bold mb-1.5 ml-1">Mobile Number</label>
                            <PhoneInput
                                country={'in'}
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                inputStyle={{
                                    width: '100%',
                                    height: '50px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(207, 159, 74, 0.4)',
                                    fontSize: '16px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                    paddingLeft: '50px'
                                }}
                                buttonStyle={{
                                    borderRadius: '12px 0 0 12px',
                                    border: '1px solid rgba(207, 159, 74, 0.4)',
                                    backgroundColor: 'transparent'
                                }}
                                containerClass="focus-within:ring-2 focus-within:ring-[#d4af37]/50 rounded-xl"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg border border-red-100">
                                {error}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.3)] text-sm font-bold text-white bg-gradient-to-r from-[#d4af37] to-[#e4b363] hover:from-[#b8860b] hover:to-[#d4af37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] transition-all disabled:opacity-70 mt-6"
                        >
                            {loading ? (
                                <span className="animate-pulse">Aligning Stars...</span>
                            ) : (
                                <>Create Account <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-600 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-[#b8860b] hover:text-[#d4af37] transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-[#cf9f4a]/70 font-medium uppercase tracking-widest">
                    Secure Cosmic Authentication
                </div>
            </div>
        </div>
    );
};

export default Register;