import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Star, Moon } from 'lucide-react';

const SmartKundliModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // চেক করা হচ্ছে ইউজার এই সেশনে আগে মোডালটি দেখেছে কি না
    const hasSeenModal = sessionStorage.getItem('kundliModalSeen');

    if (!hasSeenModal) {
      const handleScroll = () => {
        // স্ক্রল পার্সেন্টেজ বের করার লজিক
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollY / documentHeight) * 100;

        // যদি ইউজার ৩৫% এর বেশি স্ক্রল করে, তবে মোডালটি ওপেন হবে
        if (scrollPercentage > 35) {
          setIsOpen(true);
          sessionStorage.setItem('kundliModalSeen', 'true'); // একবার দেখালে সেভ করে রাখবো
          window.removeEventListener('scroll', handleScroll); // ইভেন্ট রিমুভ করে দেবো
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!isOpen) return null;

  return (
    // পেছনের ব্লার হওয়া ব্যাকগ্রাউন্ড
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e2545]/60 backdrop-blur-sm p-4 animate-in fade-in duration-500">
      
      {/* মোডাল বা ছোট পেজটি */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* ক্রস (X) বাটন */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* ওপরের ডিজাইন অংশ */}
        <div className="h-32 relative flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e2545 0%, #2a355c 100%)' }}>
          <div className="absolute inset-0 opacity-20">
             <div className="absolute top-4 left-6 text-[#d4af37]"><Star size={24} /></div>
             <div className="absolute bottom-6 right-8 text-[#d4af37]"><Moon size={32} /></div>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#e4b363] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.5)] border-4 border-white z-10">
            <Sparkles className="text-white w-8 h-8" />
          </div>
        </div>

        {/* নিচের টেক্সট ও বাটন অংশ */}
        <div className="p-8 text-center bg-[url('/path/to/subtle-pattern.png')] bg-cover">
          <h3 className="text-2xl font-bold text-[#1e2545] mb-2 font-serif">
            Discover Your Destiny
          </h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Generate your detailed Vedic Kundli instantly. Find out what the stars have planned for your career, wealth, and relationships.
          </p>

          <button
            onClick={() => {
              setIsOpen(false);
              navigate('/auth'); // বা আপনার লগইন পেজের লিংক
            }}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-[0_8px_20px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all"
            style={{ backgroundImage: 'linear-gradient(to right, #d4af37, #e4b363)' }}
          >
            Create Free Kundli Now
          </button>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="mt-4 text-xs font-bold text-slate-400 hover:text-[#1e2545] uppercase tracking-wider transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartKundliModal;