// client/src/pages/KundliForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import astrologyServices from '../services/astrologyApi.js';
import { Sparkles, MapPin, User, Stars, Loader2, AlertCircle, Mail } from 'lucide-react';

const KundliForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    gender: 'male',
    birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', ampm: 'AM' },
    place: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [selectedExactLocation, setSelectedExactLocation] = useState(null);

  const handleChange = (e, section, field) => {
    const value = e.target.value;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Location auto-suggestion
  useEffect(() => {
    if (formData.place.length < 3 || selectedExactLocation?.place_name === formData.place) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchingCity(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.place)}&format=json&limit=5`,
          { headers: { 'User-Agent': 'KaalChakra-App/1.0' } }
        );

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const formattedSuggestions = data.map(item => ({
            place_name: item.display_name,
            lat: item.lat,
            lng: item.lon,
            name: item.name
          }));
          setSuggestions(formattedSuggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error('Location search error:', err);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearchingCity(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.place]);

  const handleSelectSuggestion = (loc) => {
    setFormData(prev => ({ ...prev, place: loc.place_name }));
    setSelectedExactLocation(loc);
    setShowSuggestions(false);
  };

  // Transform planet data
  const transformPlanetData = (apiData) => {
    if (!apiData) throw new Error('No planet data received from API');

    let planetsArray = [];
    if (Array.isArray(apiData)) planetsArray = apiData;
    else if (apiData.data && Array.isArray(apiData.data)) planetsArray = apiData.data;
    else if (apiData.planets && Array.isArray(apiData.planets)) planetsArray = apiData.planets;
    else if (apiData.response && Array.isArray(apiData.response)) planetsArray = apiData.response;
    else if (apiData.result && Array.isArray(apiData.result)) planetsArray = apiData.result;
    else if (apiData.planets_data && Array.isArray(apiData.planets_data)) planetsArray = apiData.planets_data;
    else if (typeof apiData === 'object') {
      for (const key in apiData) {
        if (Array.isArray(apiData[key]) && apiData[key].length > 0) {
          planetsArray = apiData[key];
          break;
        }
      }
    }

    if (!planetsArray || planetsArray.length === 0) {
      throw new Error('Invalid planet data format received from API');
    }

    return planetsArray.map((planet, index) => {
      let degreeValue = planet.degree || planet.normDegree || planet.longitude || planet.deg;
      if (degreeValue && typeof degreeValue === 'string') degreeValue = parseFloat(degreeValue);

      return {
        id: index + 1,
        name: planet.name || planet.planet_name || planet.planet || 'Unknown',
        sign: planet.sign || planet.zodiac_sign || planet.rashi || planet.rasi || '',
        degree: planet.degree || (planet.normDegree ? `${planet.normDegree}°` : (planet.longitude ? `${planet.longitude}°` : 'N/A')),
        house: planet.house || planet.bhava || planet.house_number || 0,
        nakshatra: planet.nakshatra || planet.nakshatra_name || planet.star || '',
        retrograde: planet.retrograde || planet.is_retrograde || false,
        normDegree: planet.normDegree || planet.longitude || degreeValue,
        fullDegree: planet.fullDegree || planet.degree
      };
    });
  };

  // Save data to Supabase
  const saveToSupabase = async (data) => {
    try {
      const month = String(data.birthDate.month).padStart(2, '0');
      const day = String(data.birthDate.day).padStart(2, '0');
      const minute = String(data.birthTime.minute).padStart(2, '0');

      const reportRecord = {
        user_phone: user?.phone || null,
        name: data.name,
        dob: `${data.birthDate.year}-${month}-${day}`,
        basic_info: {
          gender: data.gender,
          email: data.email,
          birth_time: `${data.birthTime.hour24}:${minute}:00`,
          birth_place: data.place,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          ascendant: data.ascendant,
          moon_sign: data.moonSign,
          nakshatra: data.nakshatra,
        },
        planets_data: data.planets,
        ai_insights: null,
        created_at: new Date().toISOString(),
      };

      const { data: savedData, error: supabaseError } = await supabase.from('saved_reports').insert([reportRecord]).select();

      if (supabaseError) return null;
      return savedData?.[0]?.id;
    } catch (err) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name) throw new Error('Please enter your name');
      if (!formData.birthDate.day || !formData.birthDate.month || !formData.birthDate.year) throw new Error('Please enter complete birth date');
      if (!formData.birthTime.hour || !formData.birthTime.minute) throw new Error('Please enter complete birth time');
      if (!formData.place) throw new Error('Please enter your birthplace');

      let finalLat, finalLon, finalTzone;
      let exactLoc = selectedExactLocation;
      if (!exactLoc) {
        const geoResult = await astrologyServices.kundli.getGeoDetails({ place: formData.place });
        exactLoc = (geoResult && geoResult.geonames) ? geoResult.geonames[0] : null;
      }
      if (!exactLoc) throw new Error('City not found. Please select from suggestions.');

      finalLat = parseFloat(exactLoc.lat);
      finalLon = parseFloat(exactLoc.lng);
      finalTzone = parseFloat(exactLoc.timezone || 5.5);

      let hour24 = parseInt(formData.birthTime.hour);
      if (formData.birthTime.ampm === 'PM' && hour24 !== 12) hour24 += 12;
      if (formData.birthTime.ampm === 'AM' && hour24 === 12) hour24 = 0;

      const astroPayload = {
        day: parseInt(formData.birthDate.day),
        month: parseInt(formData.birthDate.month),
        year: parseInt(formData.birthDate.year),
        hour: hour24,
        minute: parseInt(formData.birthTime.minute),
        second: 0,
        latitude: finalLat,
        longitude: finalLon,
        timezone: finalTzone,
        ayanamsa: "lahiri"
      };

      const basicDetails = await astrologyServices.kundli.getBirthDetails(astroPayload);
      let planetsData = await astrologyServices.planetary.getPlanetsExtended(astroPayload);

      if (!basicDetails || !planetsData) throw new Error('Failed to fetch astrological data from API');

      const transformedPlanets = transformPlanetData(planetsData);
      const transformedBasic = {
        ascendant: basicDetails.ascendant || basicDetails.lagna,
        sign: basicDetails.sign || basicDetails.moon_sign,
        Naksahtra: basicDetails.Naksahtra || basicDetails.nakshatra,
        Varna: basicDetails.Varna || basicDetails.varna,
        Gana: basicDetails.Gana || basicDetails.gana,
        ...basicDetails
      };

      const userFormDetails = {
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        birthDate: formData.birthDate,
        birthTime: { ...formData.birthTime, hour24, minute: formData.birthTime.minute },
        place: formData.place,
        latitude: finalLat,
        longitude: finalLon,
        timezone: finalTzone,
        ascendant: transformedBasic.ascendant,
        moonSign: transformedBasic.sign,
        nakshatra: transformedBasic.Naksahtra,
        planets: transformedPlanets,
        reportData: { basic: transformedBasic, planets: transformedPlanets }
      };

      const requestId = await saveToSupabase(userFormDetails);

      const kundliDataToStore = {
        userDetails: {
          name: formData.name,
          email: formData.email,
          gender: formData.gender,
          dob: `${formData.birthDate.day}/${formData.birthDate.month}/${formData.birthDate.year}`,
          time: `${formData.birthTime.hour}:${formData.birthTime.minute} ${formData.birthTime.ampm}`,
          place: formData.place
        },
        basic: transformedBasic,
        planets: transformedPlanets,
        request_id: requestId,
        saved_to_supabase: !!requestId,
        payment_completed: true 
      };

      localStorage.setItem('kundliData', JSON.stringify(kundliDataToStore));
      sessionStorage.setItem('kundliData', JSON.stringify(kundliDataToStore));

      setSuccess(true);
      
      setTimeout(() => navigate('/kundli-result'), 1000);

    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || 'Submission failed. Please try again.');
      setLoading(false);
    }
  };

  // Custom Astrology Illustration SVG
  const AstrologyIllustration = () => (
    <div className="w-full max-w-md lg:max-w-lg aspect-square relative" style={{ perspective: '1000px' }}>
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"
        style={{ transform: 'translateZ(10px)', filter: 'drop-shadow(0 10px 30px rgba(212,175,55,0.15))' }}>
        
        {/* Background circle */}
        <circle cx="250" cy="250" r="240" fill="url(#bgGradient)" />
        
        {/* Decorative outer ring */}
        <circle cx="250" cy="250" r="220" stroke="url(#ringGradient)" strokeWidth="2" strokeDasharray="8 8" opacity="0.4" />
        <circle cx="250" cy="250" r="210" stroke="url(#ringGradient)" strokeWidth="1" opacity="0.2" />
        
        {/* Zodiac circle */}
        <circle cx="250" cy="250" r="180" stroke="#d4af37" strokeWidth="1.5" opacity="0.3" />
        
        {/* Zodiac symbols around the circle */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x = 250 + 180 * Math.cos(angle);
          const y = 250 + 180 * Math.sin(angle);
          const symbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central"
              fontSize="16" fill="#d4af37" opacity="0.6" style={{ fontFamily: 'serif' }}>
              {symbols[i]}
            </text>
          );
        })}
        
        {/* Central figure - meditating person */}
        <g transform="translate(250, 250)">
          {/* Body glow */}
          <circle cx="0" cy="10" r="70" fill="url(#glowGradient)" opacity="0.4" />
          
          {/* Head */}
          <circle cx="0" cy="-50" r="30" fill="url(#skinGradient)" />
          
          {/* Hair */}
          <path d="M-30 -55 Q-35 -85 0 -90 Q35 -85 30 -55" fill="#2d1b0e" opacity="0.9" />
          
          {/* Tilak */}
          <circle cx="0" cy="-55" r="4" fill="#d4af37" opacity="0.8" />
          
          {/* Eyes - closed meditation */}
          <path d="M-12 -52 Q-8 -48 -4 -52" stroke="#2d1b0e" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M4 -52 Q8 -48 12 -52" stroke="#2d1b0e" strokeWidth="2" fill="none" strokeLinecap="round" />
          
          {/* Peaceful smile */}
          <path d="M-6 -42 Q0 -36 6 -42" stroke="#2d1b0e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          
          {/* Necklace */}
          <path d="M-22 -25 Q0 -15 22 -25" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.8" />
          <circle cx="0" cy="-18" r="5" fill="#d4af37" opacity="0.6" />
          
          {/* Body - robe */}
          <path d="M-30 -20 Q-40 20 -45 50 L-35 55 Q-25 25 -15 20" fill="url(#robeGradient)" opacity="0.9" />
          <path d="M30 -20 Q40 20 45 50 L35 55 Q25 25 15 20" fill="url(#robeGradient)" opacity="0.9" />
          <path d="M-30 -20 L30 -20 L15 20 L-15 20 Z" fill="url(#robeGradient)" opacity="0.85" />
          
          {/* Arms in meditation pose */}
          <path d="M-30 -15 Q-55 -5 -45 20 Q-40 30 -35 25" stroke="url(#skinGradient)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.9" />
          <path d="M30 -15 Q55 -5 45 20 Q40 30 35 25" stroke="url(#skinGradient)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.9" />
          
          {/* Hands together */}
          <ellipse cx="0" cy="25" rx="18" ry="12" fill="url(#skinGradient)" opacity="0.9" />
          <line x1="0" y1="15" x2="0" y2="35" stroke="#2d1b0e" strokeWidth="1" opacity="0.3" />
          
          {/* Sacred thread */}
          <path d="M-25 -15 Q-30 0 -25 20" stroke="#d4af37" strokeWidth="1.5" fill="none" opacity="0.7" />
        </g>
        
        {/* Orbiting planets */}
        <g>
          {/* Sun */}
          <circle cx="380" cy="120" r="25" fill="url(#sunGradient)">
            <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="360 250 250" dur="20s" repeatCount="indefinite" />
          </circle>
          <circle cx="380" cy="120" r="28" stroke="#f98a2c" strokeWidth="1" opacity="0.4" fill="none" />
          
          {/* Moon */}
          <circle cx="120" cy="380" r="18" fill="url(#moonGradient)">
            <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="360 250 250" dur="15s" repeatCount="indefinite" />
          </circle>
          
          {/* Jupiter */}
          <circle cx="400" cy="300" r="12" fill="url(#jupiterGradient)" opacity="0.8">
            <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="360 250 250" dur="25s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <circle key={i} cx={Math.random() * 450 + 25} cy={Math.random() * 450 + 25} 
            r={Math.random() * 2 + 1} fill="#d4af37" opacity={Math.random() * 0.6 + 0.2}>
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur={Math.random() * 3 + 2}s repeatCount="indefinite" />
          </circle>
        ))}
        
        {/* Subtle rays from center */}
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="250" y1="250" x2={250 + 80 * Math.cos(i * 30 * Math.PI / 180)} 
            y2={250 + 80 * Math.sin(i * 30 * Math.PI / 180)} stroke="#d4af37" strokeWidth="0.5" opacity="0.08" />
        ))}
        
        {/* Gradients */}
        <defs>
          <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef9f0" />
            <stop offset="60%" stopColor="#fdf2e9" />
            <stop offset="100%" stopColor="#fef5e7" />
          </radialGradient>
          
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f98a2c" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#e8a87c" />
          </linearGradient>
          
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5d0a9" />
            <stop offset="100%" stopColor="#e8b88a" />
          </linearGradient>
          
          <linearGradient id="robeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f98a2c" />
            <stop offset="100%" stopColor="#e8a87c" />
          </linearGradient>
          
          <radialGradient id="sunGradient" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#f98a2c" />
            <stop offset="100%" stopColor="#f98a2c" stopOpacity="0.3" />
          </radialGradient>
          
          <radialGradient id="moonGradient" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </radialGradient>
          
          <radialGradient id="jupiterGradient" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Floating accent dots */}
      <div className="absolute top-4 right-4 w-5 h-5 bg-[#d4af37] rounded-full animate-ping opacity-60" 
        style={{ animationDuration: '3s', boxShadow: '0 0 15px rgba(212,175,55,0.4)' }} />
      <div className="absolute bottom-10 left-4 w-3 h-3 bg-[#f98a2c] rounded-full animate-ping opacity-60" 
        style={{ animationDuration: '4s', animationDelay: '1s', boxShadow: '0 0 10px rgba(249,138,44,0.4)' }} />
      <div className="absolute top-20 left-6 w-2 h-2 bg-[#e8a87c] rounded-full animate-ping opacity-60" 
        style={{ animationDuration: '5s', animationDelay: '2s', boxShadow: '0 0 8px rgba(232,168,124,0.4)' }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f0] via-[#fef5e7] to-[#fdf2e9] py-16 px-4 relative overflow-hidden font-sans">
      {/* 3D floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large soft glow orbs for depth */}
        <div className="absolute top-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#f98a2c]/10 to-[#d4af37]/5 blur-[80px] animate-pulse" 
          style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#d4af37]/8 to-[#f98a2c]/5 blur-[100px] animate-pulse" 
          style={{ animationDuration: '10s', animationDelay: '3s' }} />
        <div className="absolute top-[50%] left-[40%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-[#e8a87c]/10 to-[#d4af37]/5 blur-[60px] animate-pulse" 
          style={{ animationDuration: '12s', animationDelay: '6s' }} />
        
        {/* Grid pattern for 3D perspective */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #d4af37 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            perspective: '1000px',
            transform: 'rotateX(60deg) scale(1.5)',
          }} />
        
        {/* Floating decorative elements */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 3 + 'px',
              height: Math.random() * 6 + 3 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: i % 3 === 0 
                ? 'linear-gradient(135deg, #f98a2c, #d4af37)' 
                : i % 3 === 1 
                ? 'linear-gradient(135deg, #d4af37, #e8a87c)' 
                : 'linear-gradient(135deg, #f98a2c, #e8a87c)',
              opacity: Math.random() * 0.4 + 0.1,
              animation: `float3d ${Math.random() * 10 + 8}s infinite ease-in-out`,
              animationDelay: Math.random() * 5 + 's',
              boxShadow: i % 3 === 0 
                ? '0 0 10px rgba(249,138,44,0.3), 0 0 20px rgba(249,138,44,0.15)' 
                : i % 3 === 1 
                ? '0 0 10px rgba(212,175,55,0.3), 0 0 20px rgba(212,175,55,0.15)' 
                : '0 0 10px rgba(232,168,124,0.3), 0 0 20px rgba(232,168,124,0.15)',
              filter: 'blur(0.5px)',
            }}
          />
        ))}
      </div>

      {/* Top decorations */}
      <div className="absolute top-10 left-10 text-[#d4af37]/30 animate-pulse drop-shadow-[0_0_20px_rgba(212,175,55,0.15)]">
        <Stars size={40} />
      </div>
      <div className="absolute bottom-20 right-10 text-[#f98a2c]/30 animate-bounce drop-shadow-[0_0_20px_rgba(249,138,44,0.15)]">
        <Sparkles size={30} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#f98a2c] via-[#d4af37] to-[#e8a87c] bg-clip-text text-transparent mb-6"
            style={{ 
              backgroundSize: '200% 200%',
              animation: 'gradient 4s ease infinite',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1), 0 0 30px rgba(212,175,55,0.2)' 
            }}>
            Every Problem Has A Solution
          </h1>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            Get your accurate Vedic Kundli report with planetary positions and predictions, completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* 3D Image Card */}
          <div className="flex justify-center" style={{ perspective: '1000px' }}>
            <div className="relative group transform-gpu transition-all duration-500 hover:scale-[1.02]"
              style={{ transformStyle: 'preserve-3d' }}>
              {/* Outer glow ring */}
              <div className="absolute -inset-4 rounded-[3rem] opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(249,138,44,0.2), rgba(212,175,55,0.2), rgba(232,168,124,0.2))',
                  filter: 'blur(30px)',
                }} />
              
              {/* Decorative ring 1 */}
              <div className="absolute -inset-6 rounded-[3.5rem] border-2 border-[#d4af37]/20 animate-pulse"
                style={{ boxShadow: '0 0 30px rgba(212,175,55,0.15), inset 0 0 30px rgba(212,175,55,0.08)' }} />
              
              {/* Decorative ring 2 */}
              <div className="absolute -inset-3 rounded-[3.2rem] border border-[#f98a2c]/15"
                style={{ boxShadow: '0 0 20px rgba(249,138,44,0.1)' }} />
              
              {/* Custom Astrology Illustration */}
              <AstrologyIllustration />
            </div>
          </div>

          {/* 3D Form Card */}
          <div className="w-full max-w-lg mx-auto lg:mx-0" style={{ perspective: '1000px' }}>
            <form 
              onSubmit={handleSubmit} 
              className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-[#d4af37]/10"
              style={{
                boxShadow: '0 25px 60px rgba(0,0,0,0.08), 0 0 40px rgba(212,175,55,0.1), 0 0 80px rgba(249,138,44,0.05), 0 5px 15px rgba(0,0,0,0.05)',
                transformStyle: 'preserve-3d',
                transform: 'rotateY(-1deg) rotateX(1deg)',
              }}
            >
              {/* Top shimmer line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30" />
              
              {/* Inner subtle glow */}
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-[#f98a2c]/3 to-[#d4af37]/3 pointer-events-none" />
              
              <div className="text-center mb-8 relative">
                <div className="inline-block mb-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#fff8f0] to-[#fff5e6] flex items-center justify-center border border-[#d4af37]/20"
                    style={{ boxShadow: '0 5px 20px rgba(212,175,55,0.15), inset 0 2px 10px rgba(212,175,55,0.05)' }}>
                    <Stars size={32} className="text-[#d4af37]" style={{ filter: 'drop-shadow(0 2px 4px rgba(212,175,55,0.3))' }} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f98a2c] to-[#d4af37] bg-clip-text text-transparent"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  Free Janam Kundli
                </h2>
                <p className="text-sm text-slate-400 mt-1">Complete Vedic Astrology Analysis</p>
              </div>

              <div className="space-y-5 relative z-10">
                {/* Name */}
                <div className="group">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Full Name</label>
                  <div className="mt-1.5 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#f98a2c] transition-colors duration-300">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      required 
                      placeholder="Your full name" 
                      value={formData.name} 
                      onChange={(e) => handleChange(e, null, 'name')} 
                      className="w-full pl-12 pr-4 py-3.5 bg-[#fefefe] border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#f98a2c]/30 focus:border-[#d4af37]/50 outline-none font-medium transition-all duration-300"
                      style={{ 
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.02), 0 0 0 1px rgba(212,175,55,0.05)' 
                      }}
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div className="group">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Email (Optional)</label>
                  <div className="mt-1.5 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#f98a2c] transition-colors duration-300">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      value={formData.email} 
                      onChange={(e) => handleChange(e, null, 'email')} 
                      className="w-full pl-12 pr-4 py-3.5 bg-[#fefefe] border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#f98a2c]/30 focus:border-[#d4af37]/50 outline-none font-medium transition-all duration-300"
                      style={{ 
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.02), 0 0 0 1px rgba(212,175,55,0.05)' 
                      }}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Gender</label>
                  <div className="flex gap-3 mt-1.5 bg-[#fefefe] p-1.5 rounded-xl border border-slate-200"
                    style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                    {['male', 'female'].map((g) => (
                      <button 
                        key={g} 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, gender: g }))} 
                        className={`flex-1 py-2.5 rounded-lg font-bold capitalize transition-all duration-300 text-sm ${
                          formData.gender === g 
                            ? 'bg-gradient-to-r from-[#f98a2c] to-[#e8a87c] text-white shadow-lg scale-105' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                        style={formData.gender === g ? { 
                          boxShadow: '0 4px 15px rgba(249,138,44,0.3), 0 2px 4px rgba(0,0,0,0.1)' 
                        } : {}}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Birth Date</label>
                  <div className="grid grid-cols-3 gap-3 mt-1.5">
                    <select 
                      value={formData.birthDate.day} 
                      onChange={(e) => handleChange(e, 'birthDate', 'day')} 
                      className="py-3.5 px-3 bg-[#fefefe] border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-[#f98a2c]/30 focus:border-[#d4af37]/50 outline-none font-medium text-sm transition-all duration-300"
                      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                    >
                      <option value="">DD</option>
                      {[...Array(31)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>
                    <select 
                      value={formData.birthDate.month} 
                      onChange={(e) => handleChange(e, 'birthDate', 'month')} 
                      className="py-3.5 px-3 bg-[#fefefe] border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-[#f98a2c]/30 focus:border-[#d4af37]/50 outline-none font-medium text-sm transition-all duration-300"
                      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                    >
                      <option value="">MM</option>
                      {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>
                    <select 
                      value={formData.birthDate.year} 
                      onChange={(e) => handleChange(e, 'birthDate', 'year')} 
                      className="py-3.5 px-3 bg-[#fefefe] border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-[#f98a2c]/30 focus:border-[#d4af37]/50 outline-none font-medium text-sm transition-all duration-300"
                      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                    >
                      <option value="">YYYY</option>
                      {[...Array(100)].map((_, i) => { 
                        const year = new Date().getFullYear() - i; 
                        return <option key={year} value={year}>{year}</option>; 
                      })}
                    </select>
                  </div>
                </div>

                {/* Birth Time */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Birth Time</label>
                  <div className="grid grid-cols-3 gap-3 mt-1.5">
                    <select 
                      value={formData.birthTime.hour} 
                      onChange={(e) => handleChange(e, 'birthTime', 'hour')} 
                      className="py-3.5 px-3 bg-[#fefefe] border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-[#f98a2c]/30 focus:border-[#d4af37]/50 outline-none font-medium text-sm transition-all duration-300"
                      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                    >
                      <option value="">HH</option>
                      {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>
                    <select 
                      value={formData.birthTime.minute} 
                      onChange={(e) => handleChange(e, 'birthTime', 'minute')} 
                      className="py-3.5 px-3 bg-[#fefefe] border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-[#f98a2c]/30 focus:border-[#d4af37]/50 outline-none font-medium text-sm transition-all duration-300"
                      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                    >
                      <option value="">MM</option>
                      {[...Array(60)].map((_, i) => <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>)}
                    </select>
                    <select 
                      value={formData.birthTime.ampm} 
                      onChange={(e) => handleChange(e, 'birthTime', 'ampm')} 
                      className="py-3.5 px-3 bg-[#fefefe] border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-[#f98a2c]/30 focus:border-[#d4af37]/50 outline-none font-medium text-sm transition-all duration-300"
                      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                {/* Place of Birth */}
                <div className="relative">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Place of Birth</label>
                  <div className="mt-1.5 relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#f98a2c] transition-colors duration-300">
                      <MapPin size={18} />
                    </div>
                    <input 
                      type="text" 
                      required 
                      placeholder="Start typing city name..." 
                      value={formData.place} 
                      onChange={(e) => { handleChange(e, null, 'place'); setSelectedExactLocation(null); }} 
                      className="w-full pl-12 pr-4 py-3.5 bg-[#fefefe] border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#f98a2c]/30 focus:border-[#d4af37]/50 outline-none font-medium transition-all duration-300 text-sm"
                      style={{ 
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.02), 0 0 0 1px rgba(212,175,55,0.05)' 
                      }}
                    />
                    {isSearchingCity && (
                      <div className="absolute right-4 top-3.5">
                        <Loader2 size={16} className="animate-spin text-[#f98a2c]" />
                      </div>
                    )}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-50 w-full bg-white border border-[#d4af37]/20 rounded-xl shadow-2xl mt-1 overflow-hidden max-h-60 overflow-y-auto"
                        style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 0 20px rgba(212,175,55,0.1)' }}>
                        {suggestions.map((loc, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleSelectSuggestion(loc)} 
                            className="px-4 py-3 hover:bg-orange-50 cursor-pointer font-medium text-slate-600 text-sm border-b border-slate-50 last:border-0 transition-all duration-200 hover:text-[#f98a2c]"
                          >
                            {loc.place_name || loc.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-slate-100">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="relative w-full py-4 bg-gradient-to-r from-[#f98a2c] via-[#f98a2c] to-[#e8a87c] text-white font-black text-lg rounded-xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 overflow-hidden group hover:scale-[1.02] active:scale-95"
                    style={{ 
                      boxShadow: '0 10px 30px rgba(249,138,44,0.3), 0 5px 15px rgba(212,175,55,0.2), 0 0 0 1px rgba(255,255,255,0.2) inset',
                      transform: 'translateZ(5px)',
                    }}
                  >
                    {/* Button shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    {loading ? (
                      <Loader2 className="animate-spin relative z-10" size={24} />
                    ) : (
                      <Sparkles className="relative z-10" size={24} />
                    )}
                    <span className="relative z-10">
                      {loading ? 'Consulting the Stars...' : 'Generate Free Kundli'}
                    </span>
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 py-3 px-4 rounded-xl border border-red-100"
                    style={{ boxShadow: '0 2px 10px rgba(239,68,68,0.1)' }}>
                    <AlertCircle size={18} /> {error}
                  </div>
                )}
                
                {success && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 py-3 px-4 rounded-xl border border-green-100"
                    style={{ boxShadow: '0 2px 10px rgba(34,197,94,0.1)' }}>
                    <Stars size={18} /> Celestial alignment successful! Redirecting...
                  </div>
                )}

                <p className="text-center text-xs text-slate-400 mt-2">
                  ✨ Powered by authentic Vedic astrology calculations ✨
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float3d {
          0%, 100% {
            transform: translateY(0) translateZ(0) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-15px) translateZ(15px) scale(1.3);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-8px) translateZ(30px) scale(1);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-25px) translateZ(20px) scale(1.2);
            opacity: 0.4;
          }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default KundliForm;