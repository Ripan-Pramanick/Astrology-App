// client/src/pages/KundliForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import astrologyServices from '../services/astrologyApi.js';
import { Sparkles, MapPin, User, Stars, Loader2, AlertCircle, Mail } from 'lucide-react'; // ✅ Phone আইকন সরানো হয়েছে
import astrologerImg from '../assets/kundliRishi.svg';

const KundliForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '', // ইমেইল ফিল্ডটি থাকবে (অপশনাল)
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
        user_phone: user?.phone || null, // ✅ ইউজার লগইন থাকলে তার প্রোফাইলের ফোন নাম্বার ব্যাকগ্রাউন্ডে চলে যাবে
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
      // ❌ ফোন নাম্বারের রিকোয়ার্ড ভ্যালিডেশন রুল মুছে ফেলা হয়েছে
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

  return (
    <div className="min-h-screen bg-[#f8f5eb] py-16 px-4 relative overflow-hidden font-sans text-slate-800">
      <div className="absolute top-10 left-10 text-[#d4af37]/20 animate-pulse"><Stars size={40} /></div>
      <div className="absolute bottom-20 right-10 text-[#d4af37]/20 animate-bounce"><Sparkles size={30} /></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-[#1e293b] mb-4">Every Problem Has A Solution</h1>
          <p className="text-lg text-slate-700 font-medium leading-relaxed">
            Get your accurate Vedic Kundli report with planetary positions and predictions, completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex justify-center">
            <img src={astrologerImg} alt="Cosmic Astrologer" className="w-full max-w-md lg:max-w-lg aspect-square object-cover rounded-[3rem] shadow-[0_20px_50px_rgba(212,175,55,0.2)] border-4 border-white" />
          </div>

          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#f98a2c]">Free Janam Kundli</h2>
                <p className="text-sm text-slate-500">Complete Vedic Astrology Analysis</p>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><User size={18} /></div>
                  <input type="text" required placeholder="Your full name" value={formData.name} onChange={(e) => handleChange(e, null, 'name')} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f98a2c]/50 outline-none font-medium transition-all" />
                </div>
              </div>

              {/* ❌ Phone Input Section Removed entirely to enhance UX */}

              {/* Email (Optional) */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email (Optional)</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Mail size={18} /></div>
                  <input type="email" placeholder="Your email address" value={formData.email} onChange={(e) => handleChange(e, null, 'email')} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f98a2c]/50 outline-none font-medium transition-all" />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gender</label>
                <div className="flex gap-4 mt-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  {['male', 'female'].map((g) => (
                    <button key={g} type="button" onClick={() => setFormData(prev => ({ ...prev, gender: g }))} className={`flex-1 py-2.5 rounded-lg font-bold capitalize transition-all text-sm ${formData.gender === g ? 'bg-white shadow-sm text-[#f98a2c] border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}>{g}</button>
                  ))}
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Birth Date</label>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  <select value={formData.birthDate.day} onChange={(e) => handleChange(e, 'birthDate', 'day')} className="py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f98a2c]/50 outline-none font-medium text-sm">
                    <option value="">DD</option>
                    {[...Array(31)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                  </select>
                  <select value={formData.birthDate.month} onChange={(e) => handleChange(e, 'birthDate', 'month')} className="py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f98a2c]/50 outline-none font-medium text-sm">
                    <option value="">MM</option>
                    {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                  </select>
                  <select value={formData.birthDate.year} onChange={(e) => handleChange(e, 'birthDate', 'year')} className="py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f98a2c]/50 outline-none font-medium text-sm">
                    <option value="">YYYY</option>
                    {[...Array(100)].map((_, i) => { const year = new Date().getFullYear() - i; return <option key={year} value={year}>{year}</option>; })}
                  </select>
                </div>
              </div>

              {/* Birth Time */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Birth Time</label>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  <select value={formData.birthTime.hour} onChange={(e) => handleChange(e, 'birthTime', 'hour')} className="py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-sm">
                    <option value="">HH</option>
                    {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                  </select>
                  <select value={formData.birthTime.minute} onChange={(e) => handleChange(e, 'birthTime', 'minute')} className="py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-sm">
                    <option value="">MM</option>
                    {[...Array(60)].map((_, i) => <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>)}
                  </select>
                  <select value={formData.birthTime.ampm} onChange={(e) => handleChange(e, 'birthTime', 'ampm')} className="py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-sm">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* Place of Birth */}
              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Place of Birth</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><MapPin size={18} /></div>
                  <input type="text" required placeholder="Start typing city name..." value={formData.place} onChange={(e) => { handleChange(e, null, 'place'); setSelectedExactLocation(null); }} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f98a2c]/50 outline-none font-medium transition-all text-sm" />
                  {isSearchingCity && <div className="absolute right-4 top-3.5"><Loader2 size={16} className="animate-spin text-[#f98a2c]" /></div>}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 overflow-hidden max-h-60 overflow-y-auto">
                      {suggestions.map((loc, idx) => (
                        <div key={idx} onClick={() => handleSelectSuggestion(loc)} className="px-4 py-3 hover:bg-orange-50 cursor-pointer font-medium text-slate-700 text-sm border-b border-slate-50 last:border-0 transition-colors">
                          {loc.place_name || loc.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-slate-100">
                <button type="submit" disabled={loading} className="w-full py-4 bg-[#f98a2c] text-white font-black text-lg rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                  {loading ? 'Consulting the Stars...' : 'Generate Free Kundli'}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 py-3 px-4 rounded-xl border border-red-100">
                  <AlertCircle size={18} /> {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 py-3 px-4 rounded-xl border border-green-100">
                  <Stars size={18} /> Celestial alignment successful! Redirecting...
                </div>
              )}

              <p className="text-center text-xs text-slate-400 mt-2">✨ Powered by authentic Vedic astrology calculations ✨</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KundliForm;