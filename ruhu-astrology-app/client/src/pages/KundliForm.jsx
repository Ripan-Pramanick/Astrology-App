// client/src/pages/KundliForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAstroData, getGeoLocation } from '../services/astrology';

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
    comment: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-Suggestion এর জন্য নতুন স্টেটগুলো
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [selectedExactLocation, setSelectedExactLocation] = useState(null); // ইউজার ক্লিক করে সিলেক্ট করলে ডেটা সেভ রাখার জন্য

  const handleChange = (e, section, field) => {
    const value = e.target.value;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      useCoordinates: e.target.checked,
    }));
  };

  // ==========================================
  // 🌍 লোকেশন অটো-সাজেশন লজিক (Debounce সহ)
  // ==========================================
 // ==========================================
  // 🌍 লোকেশন অটো-সাজেশন লজিক (Updated)
  // ==========================================
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
        
        // এই লাইনটা যোগ করুন, এটা পুরো ডেটাটাকে ভেঙে টেক্সট বানিয়ে কনসোলে দেখাবে
        console.log("💥 RAW DATA:", JSON.stringify(geoResult.data)); 

        
        // AstrologyAPI রেসপন্স হ্যান্ডলিং (Updated)
        // ওরা যদি সরাসরি Array পাঠায় (geoResult.data) অথবা Object-এর ভেতরে Array পাঠায় (geoResult.data.geonames)
        let placesList = [];
        
        // ২০০ আসার পর ডেটাটা ঠিক কোন বাক্সে আছে তা চেক করা হচ্ছে
        if (geoResult.success && geoResult.data) {
          if (Array.isArray(geoResult.data.geonames)) {
            placesList = geoResult.data.geonames;
          } else if (Array.isArray(geoResult.data)) {
            placesList = geoResult.data;
          }
        }

        console.log("🏙️ Final Places List:", placesList); // এটা চেক করবেন

        if (placesList.length > 0) {
          setSuggestions(placesList);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }

      
      } catch (error) {
        console.error("❌ Suggestion error:", error);
      } finally {
        setIsSearchingCity(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.place, formData.useCoordinates, selectedExactLocation]);

  // ইউজার যখন লিস্ট থেকে কোনো শহর সিলেক্ট করবে
  const handleSelectSuggestion = (loc) => {
    setFormData(prev => ({ ...prev, place: loc.place_name }));
    setSelectedExactLocation(loc); // সাবমিটের সময় API কল না করে সরাসরি এই ডেটাটা ব্যবহার করব
    setShowSuggestions(false);
  };


  // ==========================================
  // 🚀 ফর্ম সাবমিট লজিক
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!formData.name.trim()) return setError('Please enter your name.'), setLoading(false);
    if (!formData.birthDate.day || !formData.birthDate.month || !formData.birthDate.year) return setError('Please enter complete birth date.'), setLoading(false);
    if (!formData.birthTime.hour || !formData.birthTime.minute) return setError('Please enter complete birth time.'), setLoading(false);
    if (!formData.place.trim() && !formData.useCoordinates) return setError('Please enter birth place or enable coordinates.'), setLoading(false);

    try {
      let finalLat, finalLon, finalTzone;

      if (!formData.useCoordinates) {
        // যদি ইউজার ড্রপডাউন থেকে সিলেক্ট করে থাকে, তাহলে ডাইরেক্ট সেই ডেটা ব্যবহার করব (সময় বাঁচবে)
        if (selectedExactLocation) {
          finalLat = parseFloat(selectedExactLocation.latitude);
          finalLon = parseFloat(selectedExactLocation.longitude);
          finalTzone = parseFloat(selectedExactLocation.timezone || 5.5);
        } else {
          // যদি ড্রপডাউন থেকে সিলেক্ট না করে নিজে টাইপ করে সাবমিট মারে (ফলব্যাক)
          const geoResult = await getGeoLocation(formData.place);
          if (geoResult.success && geoResult.data.geonames && geoResult.data.geonames.length > 0) {
            const exactLoc = geoResult.data.geonames[0];
            finalLat = parseFloat(exactLoc.latitude);
            finalLon = parseFloat(exactLoc.longitude);
            finalTzone = parseFloat(exactLoc.timezone || 5.5); 
          } else {
            throw new Error('City not found. Please select a valid city from the suggestions.');
          }
        }
      }  else {
          // যদি ড্রপডাউন থেকে সিলেক্ট না করে নিজে টাইপ করে সাবমিট মারে (ফলব্যাক)
          const geoResult = await getGeoLocation(formData.place);
          
          let exactLoc = null;
          if (geoResult.success && geoResult.data) {
             if (Array.isArray(geoResult.data) && geoResult.data.length > 0) {
                exactLoc = geoResult.data[0];
             } else if (geoResult.data.geonames && geoResult.data.geonames.length > 0) {
                exactLoc = geoResult.data.geonames[0];
             }
          }

          if (exactLoc) {
            finalLat = parseFloat(exactLoc.latitude);
            finalLon = parseFloat(exactLoc.longitude);
            finalTzone = parseFloat(exactLoc.timezone || 5.5); 
          } else {
            throw new Error('City not found. Please select a valid city from the suggestions.');
          }
        }

      let hour24 = parseInt(formData.birthTime.hour);
      const isPM = formData.birthTime.ampm === 'PM';
      if (isPM && hour24 !== 12) hour24 += 12;
      if (!isPM && hour24 === 12) hour24 = 0;

      const astroPayload = {
        day: parseInt(formData.birthDate.day),
        month: parseInt(formData.birthDate.month),
        year: parseInt(formData.birthDate.year),
        hour: hour24,
        min: parseInt(formData.birthTime.minute),
        lat: finalLat,
        lon: finalLon,
        tzone: finalTzone
      };

      const basicDetails = await fetchAstroData('birth_details', astroPayload);
      const planetsData = await fetchAstroData('planets', astroPayload);

      if (basicDetails.success && planetsData.success) {
        setSuccess(true);
        localStorage.setItem('kundliData', JSON.stringify({
          basic: basicDetails.data,
          planets: planetsData.data
        }));
        setTimeout(() => navigate('/kundli-result'), 2000);
      } else {
        setError('Failed to fetch astrology data from server.');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Fill the form to get your kundali</h1>
      <p className="text-center text-gray-600 mb-8">Please provide accurate birth details for precise analysis.</p>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6 border border-gray-100">
        
        {/* Name & Gender Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange(e, null, 'name')}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-[#f98a2c] focus:border-[#f98a2c]"
              placeholder="Your name here"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="flex space-x-6 mt-2">
              <label className="inline-flex items-center cursor-pointer">
                <input type="radio" value="male" checked={formData.gender === 'male'} onChange={(e) => handleChange(e, null, 'gender')} className="w-4 h-4 text-[#f98a2c] focus:ring-[#f98a2c] border-gray-300" />
                <span className="ml-2 text-gray-700">Male</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input type="radio" value="female" checked={formData.gender === 'female'} onChange={(e) => handleChange(e, null, 'gender')} className="w-4 h-4 text-[#f98a2c] focus:ring-[#f98a2c] border-gray-300" />
                <span className="ml-2 text-gray-700">Female</span>
              </label>
            </div>
          </div>
        </div>

        {/* Birth Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <div className="grid grid-cols-3 gap-4">
            <select value={formData.birthDate.day} onChange={(e) => handleChange(e, 'birthDate', 'day')} className="border border-gray-300 rounded-md p-2.5 focus:ring-[#f98a2c] focus:border-[#f98a2c]">
              <option value="">DD</option>
              {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <select value={formData.birthDate.month} onChange={(e) => handleChange(e, 'birthDate', 'month')} className="border border-gray-300 rounded-md p-2.5 focus:ring-[#f98a2c] focus:border-[#f98a2c]">
              <option value="">MM</option>
              {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <select value={formData.birthDate.year} onChange={(e) => handleChange(e, 'birthDate', 'year')} className="border border-gray-300 rounded-md p-2.5 focus:ring-[#f98a2c] focus:border-[#f98a2c]">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Time of Birth</label>
          <div className="grid grid-cols-3 gap-4">
            <select value={formData.birthTime.hour} onChange={(e) => handleChange(e, 'birthTime', 'hour')} className="border border-gray-300 rounded-md p-2.5 focus:ring-[#f98a2c] focus:border-[#f98a2c]">
              <option value="">HH</option>
              {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <select value={formData.birthTime.minute} onChange={(e) => handleChange(e, 'birthTime', 'minute')} className="border border-gray-300 rounded-md p-2.5 focus:ring-[#f98a2c] focus:border-[#f98a2c]">
              <option value="">MM</option>
              {[...Array(60)].map((_, i) => <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>)}
            </select>
            <select value={formData.birthTime.ampm} onChange={(e) => handleChange(e, 'birthTime', 'ampm')} className="border border-gray-300 rounded-md p-2.5 focus:ring-[#f98a2c] focus:border-[#f98a2c]">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* 🌍 Auto-Suggestion Place of Birth */}
        <div className="space-y-4 pt-2">
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
            <input
              type="text"
              value={formData.place}
              onChange={(e) => {
                handleChange(e, null, 'place');
                setSelectedExactLocation(null); // নতুন কিছু টাইপ করলে আগের সিলেকশন মুছে যাবে
              }}
              className={`block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-[#f98a2c] focus:border-[#f98a2c] ${formData.useCoordinates ? 'bg-gray-100 text-gray-500' : ''}`}
              placeholder="E.g., Kolkata, Delhi (Type 3 letters)"
              disabled={formData.useCoordinates}
            />
            
            {/* Loading Indicator */}
            {isSearchingCity && (
              <div className="absolute right-3 top-9 text-xs text-orange-500 font-medium animate-pulse">
                Searching...
              </div>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-gray-200 shadow-xl max-h-60 rounded-md py-1 mt-1 overflow-auto">
                {suggestions.map((loc, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectSuggestion(loc)}
                    className="cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-orange-50 hover:text-[#f98a2c] text-gray-700 border-b border-gray-50 last:border-0 transition"
                  >
                    <div className="font-medium text-[15px]">{loc.place_name}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="useCoordinates" checked={formData.useCoordinates} onChange={handleCheckboxChange} className="h-4 w-4 text-[#f98a2c] focus:ring-[#f98a2c] border-gray-300 rounded cursor-pointer" />
            <label htmlFor="useCoordinates" className="ml-2 block text-sm text-gray-900 cursor-pointer">
              I have exact Coordinates (Longitude/Latitude)
            </label>
          </div>

          {/* Manual Coordinates Logic (Hide if not checked) */}
          {formData.useCoordinates && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-orange-50 p-4 rounded-lg border border-orange-100">
               {/* ... (লংগিচিউড আর ল্যাটিচিউডের আগের কোডগুলো এখানে থাকবে, জায়গা বাঁচানোর জন্য শর্ট করে দিয়েছি) ... */}
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" placeholder="Deg" value={formData.longitude.deg} onChange={(e) => handleChange(e, 'longitude', 'deg')} className="border border-gray-300 rounded-md p-2 text-sm" />
                  <input type="number" placeholder="Min" value={formData.longitude.min} onChange={(e) => handleChange(e, 'longitude', 'min')} className="border border-gray-300 rounded-md p-2 text-sm" />
                  <input type="number" placeholder="Sec" value={formData.longitude.sec} onChange={(e) => handleChange(e, 'longitude', 'sec')} className="border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" placeholder="Deg" value={formData.latitude.deg} onChange={(e) => handleChange(e, 'latitude', 'deg')} className="border border-gray-300 rounded-md p-2 text-sm" />
                  <input type="number" placeholder="Min" value={formData.latitude.min} onChange={(e) => handleChange(e, 'latitude', 'min')} className="border border-gray-300 rounded-md p-2 text-sm" />
                  <input type="number" placeholder="Sec" value={formData.latitude.sec} onChange={(e) => handleChange(e, 'latitude', 'sec')} className="border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f98a2c] text-white py-3 px-4 rounded-md font-bold text-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f98a2c] disabled:opacity-70 flex justify-center items-center transition duration-300"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Kundali...
              </>
            ) : 'Get Kundali'}
          </button>
          
          {error && <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm text-center">{error}</div>}
          {success && <div className="mt-4 p-3 bg-green-50 text-green-600 border border-green-200 rounded-md text-sm text-center font-medium">Kundli Generated Successfully! Redirecting...</div>}
        </div>
      </form>
    </div>
  );
};

export default KundliForm;