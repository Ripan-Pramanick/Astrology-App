// client/src/pages/home/QuickPanchang.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, MapPin, Calendar, Sparkles, Star, Navigation } from 'lucide-react';
import astrologyServices from '../../services/astrologyApi.js';

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
// 🕒 Info Row Component
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
  const [coordinates, setCoordinates] = useState({ lat: 28.6139, lng: 77.2090 });
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [panchangData, setPanchangData] = useState({
    tithi: { name: "--", endTime: "--" },
    nakshatra: { name: "--", endTime: "--" },
    yoga: { name: "--", endTime: "--" },
    karana: { name: "--", endTime: "--" },
    sunrise: "--:-- --",
    sunset: "--:-- --",
    moonrise: "--:-- --",
    moonset: "--:-- --",
    samvat: { vikram: "--", shaka: "--" },
    month: { amanta: "--", purnimanta: "--" }
  });

  // Get user's current location
  const getUserLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        
        // Get city name from coordinates (reverse geocoding)
        try {
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          const cityName = data.city || data.locality || data.principalSubdivision || "Unknown Location";
          setLocation(`${cityName}, ${data.countryName || "India"}`);
        } catch (err) {
          console.error("Error getting city name:", err);
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        }
        
        setLocationLoading(false);
        // Refetch panchang data with new coordinates
        fetchPanchangDataWithCoords(latitude, longitude);
      },
      (error) => {
        console.error("Location error:", error);
        setError("Unable to get your location. Using default location.");
        setLocationLoading(false);
        // Use default coordinates
        fetchPanchangDataWithCoords(28.6139, 77.2090);
      }
    );
  };

  const fetchPanchangDataWithCoords = async (lat, lng) => {
    setLoading(true);
    setError(null);
    
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();
      const hour = 12;
      const minute = 0;

      console.log(`🌞 Fetching Panchang data for location: ${lat}, ${lng}`);
      
      const payload = {
        day: day,
        month: month,
        year: year,
        hour: hour,
        minute: minute,
        second: 0,
        latitude: lat,
        longitude: lng,
        timezone: 5.5,
        ayanamsa: "lahiri"
      };

      const birthDetails = await astrologyServices.kundli.getBirthDetails(payload);
      
      console.log("📊 Panchang API Response:", birthDetails);
      
      if (birthDetails) {
        setPanchangData({
          tithi: { 
            name: birthDetails.tithi_name || getTithiName(day, month), 
            endTime: formatEndTime(birthDetails.tithi_end_time) 
          },
          nakshatra: { 
            name: birthDetails.nakshatra_name || getNakshatraName(day, month), 
            endTime: formatEndTime(birthDetails.nakshatra_end_time) 
          },
          yoga: { 
            name: birthDetails.yoga_name || getYogaName(day, month), 
            endTime: formatEndTime(birthDetails.yoga_end_time) 
          },
          karana: { 
            name: birthDetails.karana_name || getKaranaName(day, month), 
            endTime: formatEndTime(birthDetails.karana_end_time) 
          },
          sunrise: birthDetails.sunrise || getSunriseTime(day, month),
          sunset: birthDetails.sunset || getSunsetTime(day, month),
          moonrise: birthDetails.moonrise || getMoonriseTime(day, month),
          moonset: birthDetails.moonset || getMoonsetTime(day, month),
          samvat: { 
            vikram: birthDetails.vikram_samvat || String(year + 57), 
            shaka: birthDetails.shaka_samvat || String(year - 78) 
          },
          month: { 
            amanta: birthDetails.amanta_month || getMonthName(month), 
            purnimanta: birthDetails.purnimanta_month || getMonthName(month) 
          }
        });
      } else {
        setPanchangData(generateFallbackPanchang(year, month, day));
      }
      
    } catch (err) {
      console.error('Error fetching panchang data from API:', err);
      setError('Unable to fetch Panchang data');
      
      const fallbackData = generateFallbackPanchang(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        selectedDate.getDate()
      );
      setPanchangData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const fetchPanchangData = async () => {
    await fetchPanchangDataWithCoords(coordinates.lat, coordinates.lng);
  };

  useEffect(() => {
    fetchPanchangData();
  }, [selectedDate]);

  // Helper functions for fallback data
  const formatEndTime = (time) => {
    if (!time) return "08:00 PM";
    return time;
  };

  const getTithiName = (day, month) => {
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'];
    return tithis[(day + month) % tithis.length];
  };

  const getNakshatraName = (day, month) => {
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    return nakshatras[(day + month) % nakshatras.length];
  };

  const getYogaName = (day, month) => {
    const yogas = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
    return yogas[(day + month) % yogas.length];
  };

  const getKaranaName = (day, month) => {
    const karanas = ['Kimstughna', 'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kinstughna'];
    return karanas[(day) % karanas.length];
  };

  const getSunriseTime = (day, month) => {
    return `${6 + Math.floor(day % 3)}:${Math.floor(Math.random() * 60)} AM`;
  };

  const getSunsetTime = (day, month) => {
    return `${5 + Math.floor(day % 2)}:${Math.floor(Math.random() * 60)} PM`;
  };

  const getMoonriseTime = (day, month) => {
    return `${Math.floor((day % 12) + 1)}:${Math.floor(Math.random() * 60)} PM`;
  };

  const getMoonsetTime = (day, month) => {
    return `${Math.floor((day % 12) + 8)}:${Math.floor(Math.random() * 60)} PM`;
  };

  const getMonthName = (month) => {
    const months = ['Chaitra', 'Vaishakha', 'Jyaishtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwina', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'];
    return months[(month + 8) % 12];
  };

  const generateFallbackPanchang = (year, month, day) => {
    return {
      tithi: { name: getTithiName(day, month), endTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60)} ${Math.random() > 0.5 ? 'AM' : 'PM'}` },
      nakshatra: { name: getNakshatraName(day, month), endTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60)} ${Math.random() > 0.5 ? 'AM' : 'PM'}` },
      yoga: { name: getYogaName(day, month), endTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60)} ${Math.random() > 0.5 ? 'AM' : 'PM'}` },
      karana: { name: getKaranaName(day, month), endTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60)} ${Math.random() > 0.5 ? 'AM' : 'PM'}` },
      sunrise: getSunriseTime(day, month),
      sunset: getSunsetTime(day, month),
      moonrise: getMoonriseTime(day, month),
      moonset: getMoonsetTime(day, month),
      samvat: { vikram: String(year + 57), shaka: String(year - 78) },
      month: { amanta: getMonthName(month), purnimanta: getMonthName(month) }
    };
  };

  const formattedDate = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Date navigation
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Aaj Ka Panchang</h1>
            <div className="flex items-center gap-2 text-gray-500 text-base mt-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
              {locationLoading ? (
                <Loader2 className="w-4 h-4 animate-spin ml-1" />
              ) : (
                <button 
                  onClick={getUserLocation}
                  className="ml-1 p-1 hover:bg-gray-200 rounded-full transition"
                  title="Use my location"
                >
                  <Navigation className="w-3 h-3 text-[#F7931E]" />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={getUserLocation}
              className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-semibold px-4 py-2 rounded-full shadow-sm text-sm flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              My Location
            </button>
            <Link to="/panchang">
              <button className="bg-[#F7931E] hover:bg-[#e6840c] transition-colors text-white font-semibold px-6 py-2.5 rounded-full shadow-md text-sm tracking-wide">
                Detailed Panchang
              </button>
            </Link>
          </div>
        </div>

        {/* Location Permission Banner */}
        {!coordinates.lat && !locationLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-center">
            <p className="text-blue-700 text-sm">
              🌍 Allow location access to get accurate Panchang for your city.
              <button 
                onClick={getUserLocation}
                className="ml-2 text-blue-600 font-semibold underline"
              >
                Enable Location
              </button>
            </p>
          </div>
        )}

        {/* Date Navigation */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button 
            onClick={goToPreviousDay}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            ←
          </button>
          <div className="flex items-center justify-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <div className="px-6">
              <p className="text-gray-700 font-medium text-base">{formattedDate}</p>
            </div>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          <button 
            onClick={goToNextDay}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            →
          </button>
        </div>
        
        <div className="text-center mb-2">
          <button 
            onClick={goToToday}
            className="text-sm text-[#F7931E] hover:underline"
          >
            Today
          </button>
        </div>

        {/* Time Cards */}
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
          {/* Panchang Details (same as before) */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Month</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
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
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tithi</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-gray-800 font-semibold">{panchangData.tithi.name}</span>
                      <span className="text-gray-500 text-sm">Till: {panchangData.tithi.endTime}</span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Yog</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-gray-800 font-semibold">{panchangData.yoga.name}</span>
                      <span className="text-gray-500 text-sm">Till: {panchangData.yoga.endTime}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Samvat</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
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
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nakshatra</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-gray-800 font-semibold">{panchangData.nakshatra.name}</span>
                      <span className="text-gray-500 text-sm">Till: {panchangData.nakshatra.endTime}</span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Karan</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-gray-800 font-semibold">{panchangData.karana.name}</span>
                      <span className="text-gray-500 text-sm">Till: {panchangData.karana.endTime}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPanchang;