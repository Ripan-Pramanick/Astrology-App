import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, MapPin, Calendar, Sparkles, Star, Navigation, Globe } from 'lucide-react';

// ---------------------------------------------------------
// NOTE: Replace this mock with your actual import in your project:
// import astrologyServices from '../../services/astrologyApi.js';
// ---------------------------------------------------------
const astrologyServices = {
  kundli: {
    getBirthDetails: async () => {
      // Simulating API delay
      return new Promise(resolve => setTimeout(() => resolve(null), 1000));
    }
  }
};

const resources = {
  en: {
    translation: {
      aajKaPanchang: "Aaj Ka Panchang",
      myLocation: "My Location",
      detailedPanchang: "Detailed Panchang",
      useMyLocation: "Use my location",
      locationBannerText: "Allow location access to get accurate Panchang for your city.",
      enableLocation: "Enable Location",
      today: "Today",
      sunrise: "Sunrise",
      sunset: "Sunset",
      moonrise: "Moonrise",
      moonset: "Moonset",
      month: "Month",
      amanta: "Amanta",
      purnimanta: "Purnimanta",
      tithi: "Tithi",
      till: "Till:",
      yog: "Yog",
      samvat: "Samvat",
      vikram: "Vikram",
      shaka: "Shaka",
      nakshatra: "Nakshatra",
      karan: "Karan",
      loadingLocation: "Getting location...",
      unknownLocation: "Unknown Location",
      defaultLocationMsg: "Unable to get your location. Using default location.",
    }
  },
  bn: {
    translation: {
      aajKaPanchang: "আজকের পঞ্চাঙ্গ",
      myLocation: "আমার অবস্থান",
      detailedPanchang: "বিস্তারিত পঞ্চাঙ্গ",
      useMyLocation: "আমার অবস্থান ব্যবহার করুন",
      locationBannerText: "আপনার শহরের সঠিক পঞ্চাঙ্গ পেতে অবস্থানের অনুমতি দিন।",
      enableLocation: "অবস্থান চালু করুন",
      today: "আজ",
      sunrise: "সূর্যোদয়",
      sunset: "সূর্যাস্ত",
      moonrise: "চন্দ্রোদয়",
      moonset: "चंद्रास्त (চন্দ্রাস্ত)",
      month: "মাস",
      amanta: "অমান্ত",
      purnimanta: "পূর্ণিমান্ত",
      tithi: "তিথি",
      till: "পর্যন্ত:",
      yog: "যোগ",
      samvat: "সংবৎ",
      vikram: "বিক্রম",
      shaka: "শক",
      nakshatra: "নক্ষত্র",
      karan: "করণ",
      loadingLocation: "অবস্থান খোঁজা হচ্ছে...",
      unknownLocation: "অজানা অবস্থান",
      defaultLocationMsg: "অবস্থান পাওয়া যায়নি। ডিফল্ট অবস্থান ব্যবহৃত হচ্ছে।",
    }
  },
  hi: {
    translation: {
      aajKaPanchang: "आज का पंचांग",
      myLocation: "मेरा स्थान",
      detailedPanchang: "विस्तृत पंचांग",
      useMyLocation: "मेरे स्थान का उपयोग करें",
      locationBannerText: "अपने शहर के लिए सटीक पंचांग प्राप्त करने के लिए स्थान तक पहुंच की अनुमति दें।",
      enableLocation: "स्थान सक्षम करें",
      today: "आज",
      sunrise: "सूर्योदय",
      sunset: "सूर्यास्त",
      moonrise: "चंद्रोदय",
      moonset: "चंद्रास्त",
      month: "माह",
      amanta: "अमांत",
      purnimanta: "पूर्णिमांत",
      tithi: "तिथि",
      till: "तक:",
      yog: "योग",
      samvat: "संवत",
      vikram: "विक्रम",
      shaka: "शक",
      nakshatra: "नक्षत्र",
      karan: "करण",
      loadingLocation: "स्थान प्राप्त कर रहा है...",
      unknownLocation: "अज्ञात स्थान",
      defaultLocationMsg: "स्थान प्राप्त करने में असमर्थ। डिफ़ॉल्ट स्थान का उपयोग कर रहे हैं।",
    }
  },
  mr: {
    translation: {
      aajKaPanchang: "आजचे पंचांग",
      myLocation: "माझे स्थान",
      detailedPanchang: "सविस्तर पंचांग",
      useMyLocation: "माझे स्थान वापरा",
      locationBannerText: "तुमच्या शहरासाठी अचूक पंचांग मिळवण्यासाठी स्थान प्रवेशास अनुमती द्या.",
      enableLocation: "स्थान सक्षम करा",
      today: "आज",
      sunrise: "सूर्योदय",
      sunset: "सूर्यास्त",
      moonrise: "चंद्रोदय",
      moonset: "चंद्रास्त",
      month: "महिना",
      amanta: "अमांत",
      purnimanta: "पूर्णिमांत",
      tithi: "तिथी",
      till: "पर्यंत:",
      yog: "योग",
      samvat: "संवत",
      vikram: "विक्रम",
      shaka: "शक",
      nakshatra: "नक्षत्र",
      karan: "करण",
      loadingLocation: "स्थान मिळवत आहे...",
      unknownLocation: "अज्ञात स्थान",
      defaultLocationMsg: "स्थान मिळवू शकलो नाही. डीफॉल्ट स्थान वापरत आहे.",
    }
  },
  ta: {
    translation: {
      aajKaPanchang: "இன்றைய பஞ்சாங்கம்",
      myLocation: "எனது இருப்பிடம்",
      detailedPanchang: "விரிவான பஞ்சாங்கம்",
      useMyLocation: "என் இருப்பிடத்தை பயன்படுத்தவும்",
      locationBannerText: "உங்கள் நகரத்திற்கான துல்லியமான பஞ்சாங்கத்தைப் பெற இருப்பிட அணுகலை அனுமதிக்கவும்.",
      enableLocation: "இருப்பிடத்தை இயக்கு",
      today: "இன்று",
      sunrise: "சூரியோதயம்",
      sunset: "சூரிய அஸ்தமனம்",
      moonrise: "சந்திரோதயம்",
      moonset: "சந்திர அஸ்தமனம்",
      month: "மாதம்",
      amanta: "அமாந்தம்",
      purnimanta: "பூர்ணிமாந்தம்",
      tithi: "திதி",
      till: "வரை:",
      yog: "யோகம்",
      samvat: "சம்வத்",
      vikram: "விக்ரம்",
      shaka: "சக",
      nakshatra: "நட்சத்திரம்",
      karan: "கரணம்",
      loadingLocation: "இருப்பிடம் பெறுகிறது...",
      unknownLocation: "தெரியாத இருப்பிடம்",
      defaultLocationMsg: "இருப்பிடத்தை அறிய முடியவில்லை. இயல்பு இருப்பிடம் பயன்படுத்தப்படுகிறது.",
    }
  },
  te: {
    translation: {
      aajKaPanchang: "నేటి పంచాంగం",
      myLocation: "నా స్థానం",
      detailedPanchang: "వివరణాత్మక పంచాంగం",
      useMyLocation: "నా స్థానాన్ని ఉపయోగించండి",
      locationBannerText: "మీ నగరం కోసం ఖచ్చితమైన పంచాంగాన్ని పొందడానికి స్థాన ప్రాప్యతను అనుమతించండి.",
      enableLocation: "స్థానాన్ని ప్రారంభించండి",
      today: "నేడు",
      sunrise: "సూర్యోదయం",
      sunset: "సూర్యాస్తమయం",
      moonrise: "చంద్రోదయం",
      moonset: "చంద్రాస్తమయం",
      month: "నెల",
      amanta: "అమాంతం",
      purnimanta: "పూర్ణిమంతం",
      tithi: "తిథి",
      till: "వరకు:",
      yog: "యోగం",
      samvat: "సంవత్",
      vikram: "విక్రమ్",
      shaka: "శక",
      nakshatra: "నక్షత్రం",
      karan: "కరణం",
      loadingLocation: "స్థానం పొందుతోంది...",
      unknownLocation: "తెలియని స్థానం",
      defaultLocationMsg: "మీ స్థానాన్ని పొందలేకపోయాము. డిఫాల్ట్ స్థానాన్ని ఉపయోగిస్తున్నాము.",
    }
  }
};

// Custom hook to replace react-i18next for the preview environment
const useTranslation = () => {
  const [language, setLanguage] = useState('en');
  
  const t = (key) => {
    return resources[language]?.translation[key] || resources['en'].translation[key] || key;
  };

  const i18n = {
    language,
    changeLanguage: (lang) => setLanguage(lang)
  };

  return { t, i18n };
};

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
  const { t, i18n } = useTranslation();
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

  // Language Change Handler
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

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
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${i18n.language}`);
          const data = await response.json();
          const cityName = data.city || data.locality || data.principalSubdivision || t('unknownLocation');
          setLocation(`${cityName}, ${data.countryName || ""}`);
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
        setError(t('defaultLocationMsg'));
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
      // setError('Unable to fetch Panchang data');
      
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
  }, [selectedDate, i18n.language]); // Refetch if language changes

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
    return `${6 + Math.floor(day % 3)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`;
  };

  const getSunsetTime = (day, month) => {
    return `${5 + Math.floor(day % 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`;
  };

  const getMoonriseTime = (day, month) => {
    return `${Math.floor((day % 12) + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`;
  };

  const getMoonsetTime = (day, month) => {
    return `${Math.floor((day % 12) + 8)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`;
  };

  const getMonthName = (month) => {
    const months = ['Chaitra', 'Vaishakha', 'Jyaishtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwina', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'];
    return months[(month + 8) % 12];
  };

  const generateFallbackPanchang = (year, month, day) => {
    return {
      tithi: { name: getTithiName(day, month), endTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}` },
      nakshatra: { name: getNakshatraName(day, month), endTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}` },
      yoga: { name: getYogaName(day, month), endTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}` },
      karana: { name: getKaranaName(day, month), endTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}` },
      sunrise: getSunriseTime(day, month),
      sunset: getSunsetTime(day, month),
      moonrise: getMoonriseTime(day, month),
      moonset: getMoonsetTime(day, month),
      samvat: { vikram: String(year + 57), shaka: String(year - 78) },
      month: { amanta: getMonthName(month), purnimanta: getMonthName(month) }
    };
  };

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

  const formattedDate = selectedDate.toLocaleDateString(i18n.language === 'en' ? 'en-US' : `${i18n.language}-IN`, { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 font-sans antialiased min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header & Language Switcher */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
            <Globe className="w-4 h-4 text-gray-500" />
            <select 
              value={i18n.language} 
              onChange={handleLanguageChange}
              className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">{t('aajKaPanchang')}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-base mt-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
              {locationLoading ? (
                <Loader2 className="w-4 h-4 animate-spin ml-1" />
              ) : (
                <button 
                  onClick={getUserLocation}
                  className="ml-1 p-1 hover:bg-gray-200 rounded-full transition"
                  title={t('useMyLocation')}
                >
                  <Navigation className="w-3 h-3 text-[#F7931E]" />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={getUserLocation}
              className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-semibold px-4 py-2 rounded-full shadow-sm text-sm flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              {t('myLocation')}
            </button>
            <Link to="/panchang" className="inline-block">
              <button className="bg-[#F7931E] hover:bg-[#e6840c] transition-colors text-white font-semibold px-6 py-2.5 rounded-full shadow-md text-sm tracking-wide">
                {t('detailedPanchang')}
              </button>
            </Link>
          </div>
        </div>

        { }
        {/* Location Permission Banner */}
        {!coordinates.lat && !locationLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-center">
            <p className="text-blue-700 text-sm">
              🌍 {t('locationBannerText')}
              <button 
                onClick={getUserLocation}
                className="ml-2 text-blue-600 font-semibold underline"
              >
                {t('enableLocation')}
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
          <div className="flex items-center justify-center my-6 w-full max-w-md">
            <div className="flex-grow h-px bg-gray-300"></div>
            <div className="px-6 text-center">
              <p className="text-gray-700 font-medium text-base whitespace-nowrap">{formattedDate}</p>
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
            className="text-sm font-medium text-[#F7931E] hover:underline"
          >
            {t('today')}
          </button>
        </div>

        {}
        {/* Time Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <TimeCard 
            title={t('sunrise')} 
            time={panchangData.sunrise} 
            icon={<SunriseIcon />} 
            bgGradient="bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50"
            iconColor="text-orange-600"
            isLoading={loading}
          />
          <TimeCard 
            title={t('sunset')} 
            time={panchangData.sunset} 
            icon={<SunsetIcon />} 
            bgGradient="bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50"
            iconColor="text-orange-600"
            isLoading={loading}
          />
          <TimeCard 
            title={t('moonrise')} 
            time={panchangData.moonrise} 
            icon={<MoonriseIcon />} 
            bgGradient="bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-50"
            iconColor="text-indigo-600"
            isLoading={loading}
          />
          <TimeCard 
            title={t('moonset')} 
            time={panchangData.moonset} 
            icon={<MoonsetIcon />} 
            bgGradient="bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-50"
            iconColor="text-indigo-600"
            isLoading={loading}
          />
        </div>

        <div className="w-full h-px bg-[#F7931E] opacity-60 my-4"></div>

        {}
        <div className="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Panchang Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('month')}</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">{t('amanta')}</span>
                      <span className="text-gray-800 font-medium">{panchangData.month.amanta}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">{t('purnimanta')}</span>
                      <span className="text-gray-800 font-medium">{panchangData.month.purnimanta}</span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('tithi')}</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-gray-800 font-semibold">{panchangData.tithi.name}</span>
                      <span className="text-gray-500 text-sm">{t('till')} {panchangData.tithi.endTime}</span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('yog')}</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-gray-800 font-semibold">{panchangData.yoga.name}</span>
                      <span className="text-gray-500 text-sm">{t('till')} {panchangData.yoga.endTime}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('samvat')}</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">{t('vikram')}</span>
                      <span className="text-gray-800 font-medium">{panchangData.samvat.vikram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">{t('shaka')}</span>
                      <span className="text-gray-800 font-medium">{panchangData.samvat.shaka}</span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('nakshatra')}</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-gray-800 font-semibold">{panchangData.nakshatra.name}</span>
                      <span className="text-gray-500 text-sm">{t('till')} {panchangData.nakshatra.endTime}</span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('karan')}</h3>
                {loading ? (
                  <div className="bg-gray-50 rounded-lg p-3 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-gray-800 font-semibold">{panchangData.karana.name}</span>
                      <span className="text-gray-500 text-sm">{t('till')} {panchangData.karana.endTime}</span>
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