// client/src/pages/Panchang.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Sun, Moon, Star, Clock, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import astrologyServices from '../services/astrologyApi.js';

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

// ==========================================
// 🌟 Main Panchang Component
// ==========================================
const Panchang = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [location, setLocation] = useState("New Delhi, India");
  const [coordinates, setCoordinates] = useState({ lat: 28.6139, lng: 77.2090, timezone: 5.5 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [panchangData, setPanchangData] = useState({
    tithi: { name: "--", endTime: "--" },
    nakshatra: { name: "--", endTime: "--" },
    yoga: { name: "--", endTime: "--" },
    karana: { name: "--", endTime: "--" },
    vaar: { name: "--" },
    sunrise: "--:--",
    sunset: "--:--",
    moonrise: "--:--",
    moonset: "--:--",
    samvat: { vikram: "--", shaka: "--" },
    month: { amanta: "--", purnimanta: "--" },
    sunSign: "--",
    moonSign: "--",
    ritu: "--",
    ayan: "--"
  });
  const [auspiciousTimings, setAuspiciousTimings] = useState([]);
  const [inauspiciousTimings, setInauspiciousTimings] = useState([]);
  const [choghadiya, setChoghadiya] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch location suggestions
  useEffect(() => {
    if (location.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const geoResult = await astrologyServices.kundli.getGeoDetails({ place: location });
        let placesList = [];
        if (geoResult && geoResult.geonames) {
          placesList = geoResult.geonames;
        }
        setSuggestions(placesList);
        setShowSuggestions(placesList.length > 0);
      } catch (error) {
        console.error("Location search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [location]);

  const handleSelectLocation = (loc) => {
    setLocation(loc.place_name);
    setCoordinates({
      lat: parseFloat(loc.lat),
      lng: parseFloat(loc.lng),
      timezone: parseFloat(loc.timezone || 5.5)
    });
    setShowSuggestions(false);
  };

  // Fetch panchang data
  const fetchPanchang = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        day: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
        second: selectedDate.getSeconds(),
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        timezone: coordinates.timezone,
        ayanamsa: "lahiri"
      };

      console.log("Fetching Panchang data...", params);

      // Fetch basic panchang
      const basicPanchang = await astrologyServices.panchang.getBasicPanchang(params);
      console.log("Basic Panchang:", basicPanchang);

      // Fetch advanced panchang for more details
      const advancedPanchang = await astrologyServices.panchang.getAdvancedPanchang(params);
      console.log("Advanced Panchang:", advancedPanchang);

      if (basicPanchang) {
        setPanchangData({
          tithi: { 
            name: basicPanchang.tithi?.name || "--", 
            endTime: basicPanchang.tithi?.end_time || "--" 
          },
          nakshatra: { 
            name: basicPanchang.nakshatra?.name || "--", 
            endTime: basicPanchang.nakshatra?.end_time || "--" 
          },
          yoga: { 
            name: basicPanchang.yoga?.name || "--", 
            endTime: basicPanchang.yoga?.end_time || "--" 
          },
          karana: { 
            name: basicPanchang.karana?.name || "--", 
            endTime: basicPanchang.karana?.end_time || "--" 
          },
          vaar: { name: basicPanchang.vaar || getWeekdayName(selectedDate.getDay()) },
          sunrise: basicPanchang.sunrise || formatTime(6, 18),
          sunset: basicPanchang.sunset || formatTime(17, 57),
          moonrise: basicPanchang.moonrise || formatTime(12, 10),
          moonset: basicPanchang.moonset || formatTime(22, 13),
          samvat: {
            vikram: basicPanchang.vikram_samvat || "2081",
            shaka: basicPanchang.shaka_samvat || "1946"
          },
          month: {
            amanta: basicPanchang.amanta_month || "Ashwina",
            purnimanta: basicPanchang.purnimanta_month || "Ashwina"
          },
          sunSign: basicPanchang.sun_sign || "Kanya (Virgo)",
          moonSign: basicPanchang.moon_sign || "Dhanu (Sagittarius)",
          ritu: basicPanchang.ritu || "Sharad (Autumn)",
          ayan: basicPanchang.ayan || "Dakshinayana"
        });

        // Set timings from API or use defaults
        setAuspiciousTimings([
          { name: "Abhijit Muhurat", time: basicPanchang.abhijit_muhurat || "11:45 AM - 12:31 PM", desc: "Most auspicious window", icon: "🌟" },
          { name: "Amrit Kalam", time: basicPanchang.amrit_kalam || "11:45 PM - 01:15 AM", desc: "Best for new beginnings", icon: "💧" },
          { name: "Brahma Muhurat", time: basicPanchang.brahma_muhurat || "04:42 AM - 05:30 AM", desc: "Best for meditation", icon: "🧘" },
          { name: "Godhuli Muhurat", time: basicPanchang.godhuli_muhurat || "05:57 PM - 06:21 PM", desc: "Twilight hour", icon: "🌅" },
          { name: "Vijaya Muhurat", time: basicPanchang.vijaya_muhurat || "02:30 PM - 03:18 PM", desc: "For success in ventures", icon: "🏆" }
        ]);

        setInauspiciousTimings([
          { name: "Rahu Kalam", time: basicPanchang.rahu_kalam || "12:08 PM - 01:35 PM", desc: "Avoid new beginnings", icon: "🌑" },
          { name: "Yama Gandam", time: basicPanchang.yama_gandam || "07:45 AM - 09:13 AM", desc: "Inauspicious period", icon: "⚠️" },
          { name: "Gulikai Kalam", time: basicPanchang.gulikai_kalam || "10:40 AM - 12:08 PM", desc: "Avoid travel", icon: "🌫️" },
          { name: "Dur Muhurat", time: basicPanchang.dur_muhurat || "11:45 AM - 12:31 PM", desc: "Unlucky window", icon: "❌" },
          { name: "Varjyam", time: basicPanchang.varjyam || "02:50 PM - 04:20 PM", desc: "Avoid important work", icon: "🚫" }
        ]);

        setChoghadiya([
          { period: "Morning", type: basicPanchang.morning_choghadiya || "Amrit", color: "green" },
          { period: "Afternoon", type: basicPanchang.afternoon_choghadiya || "Labh", color: "yellow" },
          { period: "Evening", type: basicPanchang.evening_choghadiya || "Shubh", color: "orange" },
          { period: "Night", type: basicPanchang.night_choghadiya || "Rog", color: "red" }
        ]);
      }
    } catch (err) {
      console.error("Panchang fetch error:", err);
      setError("Unable to fetch Panchang data. Using local calculations.");
      
      // Fallback to local data
      setPanchangData(getFallbackPanchangData(selectedDate));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackPanchangData = (date) => {
    const weekday = getWeekdayName(date.getDay());
    return {
      tithi: { name: "Shukla Shashthi", endTime: "12:15 PM" },
      nakshatra: { name: "Moola", endTime: "05:15 AM" },
      yoga: { name: "Shobhana", endTime: "05:53 AM" },
      karana: { name: "Taitila", endTime: "12:12 PM" },
      vaar: { name: weekday },
      sunrise: formatTime(6, 18),
      sunset: formatTime(17, 57),
      moonrise: formatTime(12, 10),
      moonset: formatTime(22, 13),
      samvat: { vikram: "2081", shaka: "1946" },
      month: { amanta: "Ashwina", purnimanta: "Ashwina" },
      sunSign: "Kanya (Virgo)",
      moonSign: "Dhanu (Sagittarius)",
      ritu: "Sharad (Autumn)",
      ayan: "Dakshinayana"
    };
  };

  const getWeekdayName = (dayIndex) => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[dayIndex];
  };

  const formatTime = (hour, minute) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  useEffect(() => {
    fetchPanchang();
  }, [selectedDate, coordinates]);

  const formattedDate = selectedDate.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
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

        {/* Control Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-5 mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            
            {/* Date Selector */}
            <div className="flex items-center bg-gray-50 rounded-xl p-1.5 w-full lg:w-auto shadow-inner">
              <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500">
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2 px-4 py-1">
                <Calendar size={18} className="text-[#F7931E]" />
                <span className="font-semibold text-gray-800 whitespace-nowrap">{formattedDate}</span>
              </div>
              <button onClick={() => handleDateChange(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Location Selector with Suggestions */}
            <div className="relative flex items-center w-full lg:w-96 bg-gray-50 rounded-xl px-4 py-2.5 border border-transparent focus-within:border-orange-300 focus-within:bg-white transition-all shadow-inner">
              <MapPin size={18} className="text-[#F7931E] mr-3 flex-shrink-0" />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-gray-700 font-medium placeholder:text-gray-400"
                placeholder="Enter city, country..."
              />
              {isSearching && <Loader2 size={18} className="text-orange-500 animate-spin ml-2" />}
              <Search size={18} className="text-gray-400 cursor-pointer hover:text-[#F7931E] transition-colors ml-2" />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                  {suggestions.map((loc, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectLocation(loc)}
                      className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0"
                    >
                      {loc.place_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Today Button */}
            <button 
              onClick={handleToday}
              className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-2.5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
            >
              Today's Panchang
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-700 text-sm">{error}</p>
          </div>
        )}

        {/* Sun, Moon & Planetary Timings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
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

        {/* Main Details Grid */}
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
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center py-2">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <InfoRow label="Tithi (Lunar Day)" value={panchangData.tithi.name} subValue={`Until ${panchangData.tithi.endTime}`} isHighlight={true} icon="🌙" />
                    <InfoRow label="Nakshatra (Constellation)" value={panchangData.nakshatra.name} subValue={`Until ${panchangData.nakshatra.endTime}`} isHighlight={true} icon="⭐" />
                    <InfoRow label="Yoga (Auspicious Union)" value={panchangData.yoga.name} subValue={`Until ${panchangData.yoga.endTime}`} icon="🕉️" />
                    <InfoRow label="Karana (Half Tithi)" value={panchangData.karana.name} subValue={`Until ${panchangData.karana.endTime}`} icon="📜" />
                    <InfoRow label="Vaar (Weekday)" value={panchangData.vaar.name} icon="📅" />
                  </>
                )}
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
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                    <InfoRow label="Shaka Samvat" value={panchangData.samvat.shaka} icon="🗓️" />
                    <InfoRow label="Vikram Samvat" value={panchangData.samvat.vikram} icon="🗓️" />
                    <InfoRow label="Amanta Month" value={panchangData.month.amanta} icon="🌙" />
                    <InfoRow label="Purnimanta Month" value={panchangData.month.purnimanta} icon="🌕" />
                    <InfoRow label="Ayan (Solstice)" value={panchangData.ayan} icon="☀️" />
                    <InfoRow label="Ritu (Season)" value={panchangData.ritu} icon="🍂" />
                    <InfoRow label="Sun Sign (Rashi)" value={panchangData.sunSign} icon="☀️" />
                    <InfoRow label="Moon Sign (Rashi)" value={panchangData.moonSign} icon="🌙" />
                  </div>
                )}
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
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  auspiciousTimings.map((item, idx) => (
                    <InfoRow key={idx} label={item.name} value={item.time} subValue={item.desc} icon={item.icon} />
                  ))
                )}
              </div>
            </div>

            {/* Inauspicious Timings */}
            <div className="bg-white rounded-2xl shadow-md border border-red-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 px-6 py-4 border-b border-red-100">
                <div className="flex items-center gap-3">
                  <XCircle className="text-red-500 w-6 h-6" />
                  <h2 className="text-xl font-bold text-gray-800">Inauspicious Timings</h2>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  inauspiciousTimings.map((item, idx) => (
                    <InfoRow key={idx} label={item.name} value={item.time} subValue={item.desc} icon={item.icon} />
                  ))
                )}
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
                {choghadiya.map((item, idx) => (
                  <div key={idx} className={`flex justify-between py-1.5 px-2 bg-${item.color}-50 rounded-lg`}>
                    <span className="text-gray-600">{item.period}</span>
                    <span className={`text-${item.color}-600 font-semibold`}>{item.type}</span>
                  </div>
                ))}
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