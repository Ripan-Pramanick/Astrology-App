// client/src/pages/KundliForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import astrologyServices from '../services/astrologyApi.js';
import { Sparkles, MapPin, User, ShieldCheck, Stars, Loader2, AlertCircle, Phone, Mail } from 'lucide-react';
import astrologerImg from '../assets/kundliRishi.svg';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const KundliForm = () => {
  const navigate = useNavigate();
  const { user, refreshPremiumStatus } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
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
        const geoResult = await astrologyServices.kundli.getGeoDetails({ place: formData.place });
        let placesList = [];
        if (geoResult && geoResult.geonames) {
          placesList = geoResult.geonames;
        } else if (geoResult && Array.isArray(geoResult)) {
          placesList = geoResult;
        }
        setSuggestions(placesList);
        setShowSuggestions(placesList.length > 0);
      } catch (error) {
        console.error("❌ Suggestion error:", error);
      } finally {
        setIsSearchingCity(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.place, selectedExactLocation]);

  const handleSelectSuggestion = (loc) => {
    setFormData(prev => ({ ...prev, place: loc.place_name }));
    setSelectedExactLocation(loc);
    setShowSuggestions(false);
  };

  // Transform planet data to proper format
  const transformPlanetData = (apiData) => {
    if (!apiData) return getDemoPlanets();
    
    if (Array.isArray(apiData)) {
      return apiData.map(planet => ({
        name: planet.name || planet.planet_name,
        sign: planet.sign || getSignFromDegree(planet.normDegree),
        degree: planet.degree || (planet.normDegree ? `${planet.normDegree}°` : 'N/A'),
        house: planet.house || calculateHouseFromDegree(planet.normDegree),
        nakshatra: planet.nakshatra || getNakshatraFromDegree(planet.normDegree),
        retrograde: planet.retrograde || false
      }));
    }
    
    if (apiData.planets) {
      return apiData.planets.map(planet => ({
        name: planet.name,
        sign: planet.sign,
        degree: planet.degree,
        house: planet.house,
        nakshatra: planet.nakshatra,
        retrograde: planet.retrograde
      }));
    }
    
    return getDemoPlanets();
  };

  const getSignFromDegree = (degree) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor((degree || 0) / 30);
    return signs[signIndex % 12];
  };

  const calculateHouseFromDegree = (degree) => {
    if (!degree) return 1;
    return Math.floor((degree % 360) / 30) + 1;
  };

  const getNakshatraFromDegree = (degree) => {
    const nakshatras = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
      'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
      'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
      'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];
    if (!degree) return nakshatras[0];
    const nakshatraIndex = Math.floor((degree % 360) / 13.333);
    return nakshatras[nakshatraIndex % 27];
  };

  const getDemoPlanets = () => {
    return [
      { name: "Sun", sign: "Leo", degree: "15°30'", house: 1, nakshatra: "Magha", retrograde: false },
      { name: "Moon", sign: "Pisces", degree: "22°15'", house: 7, nakshatra: "Revati", retrograde: false },
      { name: "Mars", sign: "Scorpio", degree: "8°45'", house: 4, nakshatra: "Anuradha", retrograde: false },
      { name: "Mercury", sign: "Virgo", degree: "5°20'", house: 2, nakshatra: "Uttara Phalguni", retrograde: false },
      { name: "Jupiter", sign: "Sagittarius", degree: "12°10'", house: 5, nakshatra: "Purva Ashadha", retrograde: false },
      { name: "Venus", sign: "Libra", degree: "18°35'", house: 3, nakshatra: "Swati", retrograde: false },
      { name: "Saturn", sign: "Capricorn", degree: "25°50'", house: 6, nakshatra: "Shravana", retrograde: true },
      { name: "Rahu", sign: "Aries", degree: "10°25'", house: 9, nakshatra: "Ashwini", retrograde: true },
      { name: "Ketu", sign: "Libra", degree: "10°25'", house: 3, nakshatra: "Swati", retrograde: true }
    ];
  };

  // Save data to Supabase
  const saveToSupabase = async (data) => {
    try {
      const kundliRequest = {
        user_id: user?.id || null,
        name: data.name,
        phone: data.phone,
        email: data.email,
        gender: data.gender,
        birth_date: `${data.birthDate.year}-${data.birthDate.month}-${data.birthDate.day}`,
        birth_time: `${data.birthTime.hour24}:${data.birthTime.minute}:00`,
        birth_place: data.place,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        ascendant: data.ascendant,
        moon_sign: data.moonSign,
        nakshatra: data.nakshatra,
        planets: data.planets,
        status: 'payment_pending',
        report_data: data.reportData
      };

      const { data: savedData, error: supabaseError } = await supabase
        .from('kundli_requests')
        .insert([kundliRequest])
        .select();

      if (supabaseError) throw supabaseError;

      console.log("✅ Data saved to Supabase:", savedData);
      return savedData?.[0]?.id;
    } catch (err) {
      console.error("❌ Supabase save error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validations
      if (!formData.name) throw new Error('Please enter your name');
      if (!formData.phone) throw new Error('Please enter your phone number');
      if (!formData.birthDate.day || !formData.birthDate.month || !formData.birthDate.year) {
        throw new Error('Please enter complete birth date');
      }
      if (!formData.birthTime.hour || !formData.birthTime.minute) {
        throw new Error('Please enter complete birth time');
      }
      if (!formData.place) throw new Error('Please enter your birthplace');

      // Get location coordinates
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

      // Convert time to 24hr
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

      // Fetch Astrology Data from API
      console.log("🌟 Fetching birth details...");
      const basicDetails = await astrologyServices.kundli.getBirthDetails(astroPayload);
      console.log("🪐 Fetching planet positions...");
      let planetsData = await astrologyServices.planetary.getPlanetsExtended(astroPayload);

      console.log("🌟 API Response - Basic Details:", basicDetails);
      console.log("🪐 API Response - Planets Data:", planetsData);

      if (!basicDetails || !planetsData) {
        throw new Error('Failed to fetch astrological data');
      }

      // Transform planet data
      const transformedPlanets = transformPlanetData(planetsData);
      
      // Ensure basic details have required fields
      const transformedBasic = {
        ascendant: basicDetails?.ascendant || basicDetails?.lagna || "Aries",
        sign: basicDetails?.sign || basicDetails?.moon_sign || "Pisces",
        Naksahtra: basicDetails?.Naksahtra || basicDetails?.nakshatra || "Ashwini",
        Varna: basicDetails?.Varna || basicDetails?.varna || "Kshatriya",
        Gana: basicDetails?.Gana || basicDetails?.gana || "Deva",
        ...basicDetails
      };

      // Prepare user details
      const userFormDetails = {
        name: formData.name,
        phone: formData.phone,
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

      // Save to Supabase
      const requestId = await saveToSupabase(userFormDetails);

      // Store in localStorage
      const kundliDataToStore = {
        userDetails: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender,
          dob: `${formData.birthDate.day}/${formData.birthDate.month}/${formData.birthDate.year}`,
          time: `${formData.birthTime.hour}:${formData.birthTime.minute} ${formData.birthTime.ampm}`,
          place: formData.place
        },
        basic: transformedBasic,
        planets: transformedPlanets,
        request_id: requestId,
        saved_to_supabase: !!requestId
      };

      localStorage.setItem('kundliData', JSON.stringify(kundliDataToStore));
      sessionStorage.setItem('kundliData', JSON.stringify(kundliDataToStore));

      // Payment Logic
      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error('Razorpay SDK failed to load');
      }

      const orderResponse = await fetch('http://localhost:5000/api/payment/create-order', { method: 'POST' });
      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error('Failed to create payment order');
      }

      const options = {
        key: "rzp_test_SZrJ56ltWYlhmu",
        amount: orderData.order.amount,
        currency: "INR",
        name: "Kaal Chakra",
        description: "Premium Kundli Report",
        image: "https://cdn-icons-png.flaticon.com/512/3592/3592033.png",
        order_id: orderData.order.id,
        handler: async function (response) {
          setSuccess(true);

          // Update payment status in Supabase
          if (requestId) {
            await supabase
              .from('kundli_requests')
              .update({
                payment_id: response.razorpay_payment_id,
                payment_status: 'completed',
                status: 'completed',
                updated_at: new Date().toISOString()
              })
              .eq('id', requestId);
          }

          localStorage.setItem('kundliData', JSON.stringify({
            ...kundliDataToStore,
            payment_id: response.razorpay_payment_id,
            payment_completed: true
          }));

          console.log("Payment Successful! Payment ID:", response.razorpay_payment_id);
          setTimeout(() => navigate('/kundli-result'), 2000);
        },
        prefill: {
          name: formData.name,
          email: formData.email || '',
          contact: formData.phone
        },
        theme: { color: "#f98a2c" }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setError("Payment Failed! " + (response.error?.description || 'Please try again'));
        setLoading(false);
      });
      paymentObject.open();

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
            Get your accurate Vedic Kundli report with planetary positions and predictions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex justify-center">
            <img src={astrologerImg} alt="Cosmic Astrologer" className="w-full max-w-md lg:max-w-lg aspect-square object-cover rounded-[3rem] shadow-[0_20px_50px_rgba(212,175,55,0.2)] border-4 border-white" />
          </div>

          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#f98a2c]">Janam Kundli Report</h2>
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

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Phone size={18} /></div>
                  <input type="tel" required placeholder="Your phone number" value={formData.phone} onChange={(e) => handleChange(e, null, 'phone')} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f98a2c]/50 outline-none font-medium transition-all" />
                </div>
              </div>

              {/* Email */}
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
                    {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                  </select>
                  <select value={formData.birthDate.month} onChange={(e) => handleChange(e, 'birthDate', 'month')} className="py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f98a2c]/50 outline-none font-medium text-sm">
                    <option value="">MM</option>
                    {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
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
                    {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
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

              {/* Submit */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 line-through">Rs. 1500</div>
                  <div className="text-xl font-black text-red-500">Rs. 1100/-</div>
                </div>
                <button type="submit" disabled={loading} className="py-3 px-8 bg-[#f98a2c] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-70 flex items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 py-2 px-3 rounded-lg">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 py-2 px-3 rounded-lg">
                  <ShieldCheck size={16} /> Payment successful! Redirecting...
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