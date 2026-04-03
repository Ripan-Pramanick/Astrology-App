// client/src/pages/KundliForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAstroData, getGeoLocation } from '../services/astrology';
import { Sparkles, MapPin, User, Send, ShieldCheck, Stars } from 'lucide-react';

import astrologerImg from '../assets/kundliRishi.svg';

// --- Razorpay Script লোড করার ফাংশন ---
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
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
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

  // 🌍 লোকেশন অটো-সাজেশন লজিক
  useEffect(() => {
    if (formData.useCoordinates || formData.place.length < 3 || selectedExactLocation?.place_name === formData.place) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchingCity(true);
      try {
        const geoResult = await getGeoLocation(formData.place);
        let placesList = [];
        if (geoResult.success && geoResult.data) {
          placesList = Array.isArray(geoResult.data.geonames) ? geoResult.data.geonames : (Array.isArray(geoResult.data) ? geoResult.data : []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let finalLat, finalLon, finalTzone;
      if (!formData.useCoordinates) {
        let exactLoc = selectedExactLocation;
        if (!exactLoc) {
          const geoResult = await getGeoLocation(formData.place);
          exactLoc = (geoResult.success && geoResult.data.geonames) ? geoResult.data.geonames[0] : (geoResult.data ? geoResult.data[0] : null);
        }
        if (!exactLoc) throw new Error('City not found. Please select from suggestions.');
        finalLat = parseFloat(exactLoc.latitude);
        finalLon = parseFloat(exactLoc.longitude);
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
        min: parseInt(formData.birthTime.minute),
        lat: finalLat, lon: finalLon, tzone: finalTzone
      };

      // প্রথমে অ্যাস্ট্রোলজি ডাটা ফেচ করা
      const basicDetails = await fetchAstroData('birth_details', astroPayload);
      const planetsData = await fetchAstroData('planets', astroPayload);

      if (basicDetails.success && planetsData.success) {
        
        // --- পেমেন্ট লজিক শুরু ---
        const res = await loadRazorpayScript();
        if (!res) {
          setError('Razorpay SDK failed to load. Check your internet connection.');
          setLoading(false);
          return;
        }

        // ব্যাকএন্ড থেকে অর্ডার ক্রিয়েট করা (আপনার সার্ভার পোর্টে)
        const orderResponse = await fetch('http://localhost:5000/api/payment/create-order', { method: 'POST' });
        const orderData = await orderResponse.json();

        if (!orderData.success) throw new Error('Order creation failed on backend.');

        // Razorpay পপআপ অপশন
        const options = {
          key: "rzp_test_SZ58CuarkpUXG2", 
          amount: orderData.order.amount,
          currency: "INR",
          name: "RUHU Astrology",
          description: "Premium Kundli Report",
          // image: "/images/astrologer.jpg", <-- এই লাইনটা পাল্টে নিচেরটা দিন
          image: "https://cdn-icons-png.flaticon.com/512/3592/3592033.png", // টেস্ট করার জন্য পাবলিক আইকন
          order_id: orderData.order.id,
          handler: function (response) {
            // পেমেন্ট সফল হলে এই অংশ রান করবে
            setSuccess(true);
            
            // ডাটা লোকাল স্টোরেজে সেভ করা
            localStorage.setItem('kundliData', JSON.stringify({ basic: basicDetails.data, planets: planetsData.data }));
            
            console.log("Payment Successful! Payment ID:", response.razorpay_payment_id);
            
            // ২ সেকেন্ড পর রেজাল্ট পেজে রিডাইরেক্ট করা
            setTimeout(() => navigate('/kundli-result/demo_123'), 2000);
          },
          prefill: {
            name: formData.name,
            contact: "9999999999" // এখানে ইউজারের ফোন নম্বর ডায়নামিক ভাবে দিতে পারেন
          },
          theme: {
            color: "#f98a2c" // আপনার ওয়েবসাইটের থিম অরেঞ্জ কালার
          }
        };

        const paymentObject = new window.Razorpay(options);
        
        paymentObject.on('payment.failed', function (response) {
          setError("Payment Failed! " + response.error.description);
          setLoading(false);
        });
        
        // পপআপ ওপেন করা
        paymentObject.open();
        // --- পেমেন্ট লজিক শেষ ---

      } else {
        setError('Stars are misaligned. Failed to fetch cosmic data.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Submission failed.');
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
            We will provide the charges after reviewing the nature of your query & study required. <br className="hidden md:block"/>
            An upfront token payment will be deducted from the total charges. <br className="hidden md:block"/>
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
                  {isSearchingCity && <div className="absolute right-4 top-3.5 animate-spin text-[#f98a2c]"><Sparkles size={16} /></div>}
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 overflow-hidden max-h-48">
                      {suggestions.map((loc, idx) => (
                        <div key={idx} onClick={() => handleSelectSuggestion(loc)} className="px-4 py-3 hover:bg-orange-50 cursor-pointer font-medium text-slate-700 text-sm border-b border-slate-50 last:border-0 transition-colors">
                          {loc.place_name}
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
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>

              {error && <p className="text-center text-red-500 text-sm font-bold bg-red-50 py-2 rounded-lg">{error}</p>}
              {success && <p className="text-center text-green-600 text-sm font-bold bg-green-50 py-2 rounded-lg flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> Form processed successfully!
              </p>}

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default KundliForm;