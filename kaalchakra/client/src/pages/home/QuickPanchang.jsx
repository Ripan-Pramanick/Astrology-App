// client/src/pages/home/QuickPanchang.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, MapPin, Calendar, Sparkles, Star } from 'lucide-react';

// Remove the imports that are causing issues - we'll use mock data for now
// import api from "../services/api.js";
// import astrologyServices from "../services/astrologyApi.js";

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
const TimeCard = ({ title, time, icon, bgGradient, iconColor, isLoading }) => (
  <div className={`${bgGradient} rounded-2xl p-5 flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-white/20`}>
    <div className={`w-12 h-12 ${iconColor} mb-3`}>{icon}</div>
    <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
    {isLoading ? (
      <div className="w-20 h-7 bg-white/30 rounded animate-pulse"></div>
    ) : (
      <p className="text-gray-800 text-xl md:text-2xl font-black">{time}</p>
    )}
  </div>
);

const QuickPanchang = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [location, setLocation] = useState("New Delhi, India");
  const [loading, setLoading] = useState(false);
  const [panchangData, setPanchangData] = useState({
    tithi: { name: "Shukla Shashthi", endTime: "12:15 PM, Oct 09" },
    nakshatra: { name: "Moola", endTime: "05:15 AM, Oct 10" },
    yoga: { name: "Shobhana", endTime: "05:53 AM, Oct 10" },
    karana: { name: "Taitila", endTime: "12:12 PM, Oct 09" },
    vaar: { name: "Wednesday" },
    sunrise: "06:18 AM",
    sunset: "05:57 PM",
    moonrise: "12:10 PM",
    moonset: "10:13 PM",
    samvat: { vikram: "2081", shaka: "1946" },
    month: { amanta: "Ashwina", purnimanta: "Ashwina" }
  });

  const formattedDate = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Aaj Ka Panchang</h1>
            <div className="flex items-center gap-2 text-gray-500 text-base mt-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
          <Link to="/panchang">
            <button className="bg-[#F7931E] hover:bg-[#e6840c] transition-colors text-white font-semibold px-6 py-2.5 rounded-full shadow-md text-sm tracking-wide">
              Detailed Panchang
            </button>
          </Link>
        </div>

        <div className="flex items-center justify-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <div className="px-6">
            <p className="text-gray-700 font-medium text-base">{formattedDate}</p>
          </div>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <TimeCard 
            title="Sunrise" 
            time={panchangData.sunrise} 
            icon={<SunriseIcon />} 
            bgGradient="bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50"
            iconColor="text-orange-600"
            isLoading={loading}
          />
          <TimeCard 
            title="Sunset" 
            time={panchangData.sunset} 
            icon={<SunsetIcon />} 
            bgGradient="bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50"
            iconColor="text-orange-600"
            isLoading={loading}
          />
          <TimeCard 
            title="Moonrise" 
            time={panchangData.moonrise} 
            icon={<MoonriseIcon />} 
            bgGradient="bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-50"
            iconColor="text-indigo-600"
            isLoading={loading}
          />
          <TimeCard 
            title="Moonset" 
            time={panchangData.moonset} 
            icon={<MoonsetIcon />} 
            bgGradient="bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-50"
            iconColor="text-indigo-600"
            isLoading={loading}
          />
        </div>

        <div className="w-full h-px bg-[#F7931E] opacity-60 my-4"></div>

        <div className="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Month</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Amanta</span>
                    <span className="text-gray-800 font-medium">{panchangData.month.amanta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Purnimanta</span>
                    <span className="text-gray-800 font-medium">{panchangData.month.purnimanta}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tithi</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-gray-800 font-semibold">{panchangData.tithi.name}</span>
                    <span className="text-gray-500 text-sm">Till: {panchangData.tithi.endTime}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Yog</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-gray-800 font-semibold">{panchangData.yoga.name}</span>
                    <span className="text-gray-500 text-sm">Till: {panchangData.yoga.endTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Samvat</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Vikram</span>
                    <span className="text-gray-800 font-medium">{panchangData.samvat.vikram}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Shaka</span>
                    <span className="text-gray-800 font-medium">{panchangData.samvat.shaka}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nakshatra</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-gray-800 font-semibold">{panchangData.nakshatra.name}</span>
                    <span className="text-gray-500 text-sm">Till: {panchangData.nakshatra.endTime}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Karan</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-gray-800 font-semibold">{panchangData.karana.name}</span>
                    <span className="text-gray-500 text-sm">Till: {panchangData.karana.endTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPanchang;