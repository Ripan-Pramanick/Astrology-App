// client/src/pages/KundliForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import astrologyServices from '../services/astrologyApi.js';
import { Sparkles, MapPin, User, Send, ShieldCheck, Stars, Loader2, AlertCircle } from 'lucide-react';
import astrologerImg from '../assets/kundliRishi.svg';

// --- Razorpay Script Load Function ---
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
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
    gender: 'male',
    birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', ampm: 'AM' },
    place: '',
    useCoordinates: false,
    longitude: { deg: '', min: '', sec: '' },
    latitude: { deg: '', min: '', sec: '' },
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

  // Location auto-suggestion logic using AstrologyAPI
  useEffect(() => {
    if (formData.useCoordinates || formData.place.length < 3 || selectedExactLocation?.place_name === formData.place) {
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
  }, [formData.place, formData.useCoordinates, selectedExactLocation]);

  const handleSelectSuggestion = (loc) => {
    setFormData(prev => ({ ...prev, place: loc.place_name }));
    setSelectedExactLocation(loc);
    setShowSuggestions(false);
  };

  // Calculate age from birth date
  const calculateAge = (day, month, year) => {
    if (!day || !month || !year) return 0;
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Verify payment and activate premium
  const verifyPaymentAndActivatePremium = async (paymentResponse, userFormDetails, basicDetails, planetsData) => {
    try {
      const verifyResponse = await fetch('http://localhost:5000/api/payment/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          user_id: user?.id,
          user_phone: user?.phone,
          user_email: user?.email,
          plan_type: 'premium'
        })
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        // Refresh premium status in AuthContext
        if (refreshPremiumStatus) {
          await refreshPremiumStatus();
        }
        
        // Update local storage with premium status
        const updatedUser = { ...user, isPremium: true, subscription: 'premium' };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Payment verification error:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name) throw new Error('Please enter your name');
      if (!formData.birthDate.day || !formData.birthDate.month || !formData.birthDate.year) {
        throw new Error('Please enter complete birth date');
      }
      if (!formData.birthTime.hour || !formData.birthTime.minute) {
        throw new Error('Please enter complete birth time');
      }

      let finalLat, finalLon, finalTzone;
      if (!formData.useCoordinates) {
        let exactLoc = selectedExactLocation;
        if (!exactLoc) {
          const geoResult = await astrologyServices.kundli.getGeoDetails({ place: formData.place });
          exactLoc = (geoResult && geoResult.geonames) ? geoResult.geonames[0] : null;
        }
        if (!exactLoc) throw new Error('City not found. Please select from suggestions.');
        finalLat = parseFloat(exactLoc.lat);
        finalLon = parseFloat(exactLoc.lng);
        finalTzone = parseFloat(exactLoc.timezone || 5.5);
      } else {
        finalLat = parseFloat(formData.latitude.deg) + (parseFloat(formData.latitude.min) / 60);
        finalLon = parseFloat(formData.longitude.deg) + (parseFloat(formData.longitude.min) / 60);
        finalTzone = 5.5;
      }

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

      // User form details for localStorage
      const userFormDetails = {
        name: formData.name,
        gender: formData.gender,
        dob: `${formData.birthDate.day}/${formData.birthDate.month}/${formData.birthDate.year}`,
        time: `${formData.birthTime.hour}:${formData.birthTime.minute} ${formData.birthTime.ampm}`,
        place: formData.place,
        age: calculateAge(formData.birthDate.day, formData.birthDate.month, formData.birthDate.year)
      };

      // Fetch Astrology Data from API
      console.log("🌟 Fetching birth details...");
      const basicDetails = await astrologyServices.kundli.getBirthDetails(astroPayload);
      console.log("🪐 Fetching planet positions...");
      const planetsData = await astrologyServices.planetary.getPlanetsExtended(astroPayload);

      console.log("🌟 API Response - Basic Details:", basicDetails);
      console.log("🪐 API Response - Planets Data:", planetsData);

      if (basicDetails && planetsData) {
        // Store data in localStorage
        localStorage.setItem('kundliData', JSON.stringify({
          userDetails: userFormDetails,
          basic: basicDetails,
          planets: planetsData
        }));

        // --- Payment Logic ---
        const res = await loadRazorpayScript();
        if (!res) {
          setError('Razorpay SDK failed to load. Check your internet connection.');
          setLoading(false);
          return;
        }

        // Create order from backend
        const orderResponse = await fetch('http://localhost:5000/api/payment/create-order', { method: 'POST' });
        const orderData = await orderResponse.json();

        if (!orderData.success) {
          throw new Error('Failed to create payment order');
        }

        // Razorpay options
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
            
            // Verify payment and activate premium
            const isPremiumActivated = await verifyPaymentAndActivatePremium(
              response, 
              userFormDetails, 
              basicDetails, 
              planetsData
            );
            
            localStorage.setItem('kundliData', JSON.stringify({
              userDetails: userFormDetails,
              basic: basicDetails,
              planets: planetsData,
              payment_id: response.razorpay_payment_id,
              isPremium: isPremiumActivated
            }));
            
            console.log("Payment Successful! Payment ID:", response.razorpay_payment_id);
            console.log("Premium Activated:", isPremiumActivated);
            
            setTimeout(() => navigate('/kundli-result'), 2000);
          },
          prefill: {
            name: formData.name,
            email: user?.email || '',
            contact: user?.phone || "9999999999"
          },
          theme: {
            color: "#f98a2c"
          }
        };

        const paymentObject = new window.Razorpay(options);

        paymentObject.on('payment.failed', function (response) {
          setError("Payment Failed! " + (response.error?.description || 'Please try again'));
          setLoading(false);
        });

        paymentObject.open();
      } else {
        throw new Error('Failed to fetch astrological data');
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || 'Submission failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5eb] py-16 px-4 relative overflow-hidden font-sans text-slate-800">

      {/* Decorative Stars */}
      <div className="absolute top-10 left-10 text-[#d4af37]/20 animate-pulse"><Stars size={40} /></div>
      <div className="absolute bottom-20 right-10 text-[#d4af37]/20 animate-bounce"><Sparkles size={30} /></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Top Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-[#1e293b] mb-4">
            Every Problem Have A Solution
          </h1>
          <p className="text-lg text-slate-700 font-medium leading-relaxed">
            We will provide the charges after reviewing the nature of your query & study required. <br className="hidden md:block" />
            An upfront token payment will be deducted from the total charges. <br className="hidden md:block" />
            Kindly proceed to submit your query.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Image */}
          <div className="flex justify-center">
            <img
              src={astrologerImg}
              alt="Cosmic Astrologer"
              className="w-full max-w-md lg:max-w-lg aspect-square object-cover rounded-[3rem] shadow-[0_20px_50px_rgba(212,175,55,0.2)] border-4 border-white"
            />
          </div>

          {/* Right Column: Form */}
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 space-y-6">

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#f98a2c]">Submit your query</h2>
                <p className="text-sm text-slate-500">if it is a unique ask and not listed</p>
              </div>

              {/* Name Input */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Name</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><User size={18} /></div>
                  <input
                    type="text" required placeholder="Your name here"
                    value={formData.name} onChange={(e) => handleChange(e, null, 'name')}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f98a2c]/50 outline-none font-medium transition-all"
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gender</label>
                <div className="flex gap-4 mt-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  {['male', 'female'].map((g) => (
                    <button
                      key={g} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                      className={`flex-1 py-2.5 rounded-lg font-bold capitalize transition-all text-sm ${formData.gender === g ? 'bg-white shadow-sm text-[#f98a2c] border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {g}
                    </button>
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

              {/* Place of Birth Input */}
              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Place of Birth</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><MapPin size={18} /></div>
                  <input
                    type="text" required placeholder="Start typing & choose..."
                    value={formData.place} disabled={formData.useCoordinates}
                    onChange={(e) => { handleChange(e, null, 'place'); setSelectedExactLocation(null); }}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f98a2c]/50 outline-none font-medium transition-all text-sm"
                  />
                  {isSearchingCity && <div className="absolute right-4 top-3.5 animate-spin text-[#f98a2c]"><Loader2 size={16} /></div>}

                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 overflow-hidden max-h-48 overflow-y-auto">
                      {suggestions.map((loc, idx) => (
                        <div key={idx} onClick={() => handleSelectSuggestion(loc)} className="px-4 py-3 hover:bg-orange-50 cursor-pointer font-medium text-slate-700 text-sm border-b border-slate-50 last:border-0 transition-colors">
                          {loc.place_name || loc.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Section / Price */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 line-through">Rs. 1500</div>
                  <div className="text-xl font-black text-red-500">Rs. 1100/-</div>
                </div>
                <button
                  type="submit" disabled={loading}
                  className="py-3 px-8 bg-[#f98a2c] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-70 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 py-2 px-3 rounded-lg">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 py-2 px-3 rounded-lg">
                  <ShieldCheck size={16} />
                  Payment successful! Redirecting to your Kundli report...
                </div>
              )}

              {/* Note about data source */}
              <p className="text-center text-xs text-slate-400 mt-2">
                ✨ Powered by authentic Vedic astrology calculations ✨
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default KundliForm;