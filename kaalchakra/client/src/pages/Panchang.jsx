// client/src/pages/Panchang.jsx
import React, { useState } from 'react';
import { Calendar, MapPin, Search, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Sun, Moon, Star, Clock, Sparkles } from 'lucide-react';

// ==========================================
// 🌙 Premium Icons for Sun & Moon
// ==========================================
const SunriseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 14L12 8L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 4V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4.5 12.5L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19.5 12.5L18 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 21V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 18H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SunsetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 10L12 16L18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4.5 8.5L6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19.5 8.5L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 21V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 18H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MoonriseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12 3V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 9V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 15L12 21L19 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 18L18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 18L6 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 15C4 11.6863 6.68629 9 10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 15C20 11.6863 17.3137 9 14 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoonsetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12 21V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 15V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 9L12 3L19 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 6L18 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 6L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 9C4 12.3137 6.68629 15 10 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 9C20 12.3137 17.3137 15 14 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ==========================================
// 🕒 Premium Info Row Component
// ==========================================
const InfoRow = ({ label, value, subValue, isHighlight = false, icon }) => (
  <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0 group hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent px-3 rounded-lg transition-all duration-200">
    <div className="flex items-center gap-2">
      {icon && <span className="text-gray-400 text-sm">{icon}</span>}
      <span className="text-gray-600 font-medium text-sm md:text-base">{label}</span>
    </div>
    <div className="text-right">
      <span className={`font-semibold text-sm md:text-base ${isHighlight ? 'text-[#F7931E]' : 'text-gray-800'}`}>{value}</span>
      {subValue && <p className="text-gray-400 text-xs md:text-sm mt-0.5">{subValue}</p>}
    </div>
  </div>
);

// ==========================================
// 🎴 Time Card Component
// ==========================================
const TimeCard = ({ title, time, icon, bgGradient, iconColor }) => (
  <div className={`${bgGradient} rounded-2xl p-5 flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-white/20`}>
    <div className={`w-12 h-12 ${iconColor} mb-3`}>{icon}</div>
    <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
    <p className="text-gray-800 text-xl md:text-2xl font-black">{time}</p>
  </div>
);

// ==========================================
// 🌟 Main Panchang Component
// ==========================================
const Panchang = () => {
  const [selectedDate, setSelectedDate] = useState("09 October 2024");
  const [location, setLocation] = useState("New Delhi, India");

  // Sample data for the current date
  const panchangData = {
    tithi: { name: "Shukla Shashthi", endTime: "12:15 PM, Oct 09" },
    nakshatra: { name: "Moola", endTime: "05:15 AM, Oct 10" },
    yoga: { name: "Shobhana", endTime: "05:53 AM, Oct 10" },
    karana: { name: "Taitila", endTime: "12:12 PM, Oct 09" },
    vaar: { name: "Wednesday (Budhavara)" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section with Decorative Elements */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-3 tracking-tight">
            Detailed Panchang
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Daily Hindu Calendar & Muhurat — Celestial timings for auspicious beginnings
          </p>
        </div>

        {/* 🎛️ Premium Control Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-5 mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            
            {/* Date Selector */}
            <div className="flex items-center bg-gray-50 rounded-xl p-1.5 w-full lg:w-auto shadow-inner">
              <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500">
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2 px-4 py-1">
                <Calendar size={18} className="text-[#F7931E]" />
                <span className="font-semibold text-gray-800 whitespace-nowrap">{selectedDate}</span>
              </div>
              <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Location Selector */}
            <div className="flex items-center w-full lg:w-96 bg-gray-50 rounded-xl px-4 py-2.5 border border-transparent focus-within:border-orange-300 focus-within:bg-white transition-all shadow-inner">
              <MapPin size={18} className="text-[#F7931E] mr-3 flex-shrink-0" />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-gray-700 font-medium placeholder:text-gray-400"
                placeholder="Enter city, country..."
              />
              <Search size={18} className="text-gray-400 cursor-pointer hover:text-[#F7931E] transition-colors" />
            </div>
            
            {/* Today Button */}
            <button className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-2.5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
              Today's Panchang
            </button>
          </div>
        </div>

        {/* 🌞 Sun, Moon & Planetary Timings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          <TimeCard 
            title="Sunrise" 
            time="06:18 AM" 
            icon={<SunriseIcon />} 
            bgGradient="bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50"
            iconColor="text-orange-600"
          />
          <TimeCard 
            title="Sunset" 
            time="05:57 PM" 
            icon={<SunsetIcon />} 
            bgGradient="bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50"
            iconColor="text-orange-600"
          />
          <TimeCard 
            title="Moonrise" 
            time="12:10 PM" 
            icon={<MoonriseIcon />} 
            bgGradient="bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-50"
            iconColor="text-indigo-600"
          />
          <TimeCard 
            title="Moonset" 
            time="10:13 PM" 
            icon={<MoonsetIcon />} 
            bgGradient="bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-50"
            iconColor="text-indigo-600"
          />
        </div>

        {/* 📖 Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Core Panchang Elements */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* The 5 Angas - Panchang Limbs */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                    <span className="text-white text-lg">🕉️</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Panchang Elements (5 Limbs)</h2>
                </div>
              </div>
              
              <div className="p-6">
                <InfoRow label="Tithi (Lunar Day)" value={panchangData.tithi.name} subValue={`Until ${panchangData.tithi.endTime}`} isHighlight={true} icon="🌙" />
                <InfoRow label="Nakshatra (Constellation)" value={panchangData.nakshatra.name} subValue={`Until ${panchangData.nakshatra.endTime}`} isHighlight={true} icon="⭐" />
                <InfoRow label="Yoga (Auspicious Union)" value={panchangData.yoga.name} subValue={`Until ${panchangData.yoga.endTime}`} icon="🕉️" />
                <InfoRow label="Karana (Half Tithi)" value={panchangData.karana.name} subValue={`Until ${panchangData.karana.endTime}`} icon="📜" />
                <InfoRow label="Vaar (Weekday)" value={panchangData.vaar.name} icon="📅" />
              </div>
            </div>

            {/* Hindu Calendar & Samvat Details */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-md">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Hindu Lunar Calendar</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                  <InfoRow label="Shaka Samvat" value="1946 Krodhi" icon="🗓️" />
                  <InfoRow label="Vikram Samvat" value="2081 Pingala" icon="🗓️" />
                  <InfoRow label="Gujarati Samvat" value="2080 Rakshasa" icon="🗓️" />
                  <InfoRow label="Amanta Month" value="Ashwina" icon="🌙" />
                  <InfoRow label="Purnimanta Month" value="Ashwina" icon="🌕" />
                  <InfoRow label="Ayan (Solstice)" value="Dakshinayana" icon="☀️" />
                  <InfoRow label="Ritu (Season)" value="Sharad (Autumn)" icon="🍂" />
                  <InfoRow label="Sun Sign (Rashi)" value="Kanya (Virgo)" icon="☀️" />
                  <InfoRow label="Moon Sign (Rashi)" value="Dhanu (Sagittarius)" icon="🌙" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Muhurat Timings */}
          <div className="space-y-8">
            
            {/* Auspicious Timings */}
            <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-600 w-6 h-6" />
                  <h2 className="text-xl font-bold text-gray-800">Auspicious Timings</h2>
                </div>
              </div>
              <div className="p-6">
                <InfoRow label="Abhijit Muhurat" value="11:45 AM - 12:31 PM" subValue="Most auspicious window" icon="🌟" />
                <InfoRow label="Amrit Kalam" value="11:45 PM - 01:15 AM" subValue="Oct 09 → Oct 10" icon="💧" />
                <InfoRow label="Brahma Muhurat" value="04:42 AM - 05:30 AM" subValue="Best for meditation" icon="🧘" />
                <InfoRow label="Godhuli Muhurat" value="05:57 PM - 06:21 PM" subValue="Twilight hour" icon="🌅" />
                <InfoRow label="Vijaya Muhurat" value="02:30 PM - 03:18 PM" subValue="For success in ventures" icon="🏆" />
              </div>
            </div>

            {/* Inauspicious Timings - Rahu Kalam etc */}
            <div className="bg-white rounded-2xl shadow-md border border-red-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 px-6 py-4 border-b border-red-100">
                <div className="flex items-center gap-3">
                  <XCircle className="text-red-500 w-6 h-6" />
                  <h2 className="text-xl font-bold text-gray-800">Inauspicious Timings</h2>
                </div>
              </div>
              <div className="p-6">
                <InfoRow label="Rahu Kalam" value="12:08 PM - 01:35 PM" subValue="Avoid new beginnings" icon="🌑" />
                <InfoRow label="Yama Gandam" value="07:45 AM - 09:13 AM" subValue="Inauspicious period" icon="⚠️" />
                <InfoRow label="Gulikai Kalam" value="10:40 AM - 12:08 PM" subValue="Avoid travel" icon="🌫️" />
                <InfoRow label="Dur Muhurat" value="11:45 AM - 12:31 PM" subValue="Unlucky window" icon="❌" />
                <InfoRow label="Varjyam" value="02:50 PM - 04:20 PM" subValue="Avoid important work" icon="🚫" />
              </div>
            </div>

            {/* Helpful Note Box */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-700 text-sm">ℹ️</span>
                </div>
                <div>
                  <p className="text-amber-800 text-sm leading-relaxed font-medium">
                    Timings are calculated based on your selected location <strong className="text-amber-900">({location})</strong>
                  </p>
                  <p className="text-amber-700 text-xs mt-2">
                    Adjusting the location will automatically recalculate all muhurats and panchang elements for accurate results.
                  </p>
                </div>
              </div>
            </div>

            {/* Choghadiya Preview */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#F7931E]" />
                <h3 className="font-bold text-gray-800">Today's Choghadiya</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between py-1.5 px-2 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Morning</span>
                  <span className="text-green-600 font-semibold">Amrit</span>
                </div>
                <div className="flex justify-between py-1.5 px-2 bg-yellow-50 rounded-lg">
                  <span className="text-gray-600">Afternoon</span>
                  <span className="text-yellow-600 font-semibold">Labh</span>
                </div>
                <div className="flex justify-between py-1.5 px-2 bg-orange-50 rounded-lg">
                  <span className="text-gray-600">Evening</span>
                  <span className="text-orange-600 font-semibold">Shubh</span>
                </div>
                <div className="flex justify-between py-1.5 px-2 bg-red-50 rounded-lg">
                  <span className="text-gray-600">Night</span>
                  <span className="text-red-600 font-semibold">Rog</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-xs">
            🌟 Panchang calculations are based on geographic location and astronomical positions. Results may vary slightly based on local custom. 🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default Panchang;