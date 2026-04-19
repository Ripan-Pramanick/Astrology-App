// client/src/pages/Matchmaking.jsx
import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, MapPin, Calendar, Clock, User, Loader2, AlertCircle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import astrologyServices from '../services/astrologyApi.js';

const Matchmaking = () => {
  const [personA, setPersonA] = useState({
    name: '',
    gender: 'male',
    birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', ampm: 'AM' },
    place: '',
    latitude: '',
    longitude: '',
    timezone: 5.5
  });
  const [personB, setPersonB] = useState({
    name: '',
    gender: 'female',
    birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', ampm: 'AM' },
    place: '',
    latitude: '',
    longitude: '',
    timezone: 5.5
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [suggestionsA, setSuggestionsA] = useState([]);
  const [suggestionsB, setSuggestionsB] = useState([]);
  const [showSuggestionsA, setShowSuggestionsA] = useState(false);
  const [showSuggestionsB, setShowSuggestionsB] = useState(false);
  const [isSearchingA, setIsSearchingA] = useState(false);
  const [isSearchingB, setIsSearchingB] = useState(false);

  // Location search for Person A
  useEffect(() => {
    if (personA.place.length < 3) {
      setSuggestionsA([]);
      setShowSuggestionsA(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearchingA(true);
      try {
        const geoResult = await astrologyServices.kundli.getGeoDetails({ place: personA.place });
        let placesList = [];
        if (geoResult && geoResult.geonames) {
          placesList = geoResult.geonames;
        }
        setSuggestionsA(placesList);
        setShowSuggestionsA(placesList.length > 0);
      } catch (error) {
        console.error("Location search error:", error);
      } finally {
        setIsSearchingA(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [personA.place]);

  // Location search for Person B
  useEffect(() => {
    if (personB.place.length < 3) {
      setSuggestionsB([]);
      setShowSuggestionsB(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearchingB(true);
      try {
        const geoResult = await astrologyServices.kundli.getGeoDetails({ place: personB.place });
        let placesList = [];
        if (geoResult && geoResult.geonames) {
          placesList = geoResult.geonames;
        }
        setSuggestionsB(placesList);
        setShowSuggestionsB(placesList.length > 0);
      } catch (error) {
        console.error("Location search error:", error);
      } finally {
        setIsSearchingB(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [personB.place]);

  const handleSelectLocation = (person, loc) => {
    if (person === 'A') {
      setPersonA(prev => ({
        ...prev,
        place: loc.place_name,
        latitude: loc.lat,
        longitude: loc.lng,
        timezone: parseFloat(loc.timezone || 5.5)
      }));
      setShowSuggestionsA(false);
    } else {
      setPersonB(prev => ({
        ...prev,
        place: loc.place_name,
        latitude: loc.lat,
        longitude: loc.lng,
        timezone: parseFloat(loc.timezone || 5.5)
      }));
      setShowSuggestionsB(false);
    }
  };

  const handleChange = (person, section, field, value) => {
    const setter = person === 'A' ? setPersonA : setPersonB;
    const current = person === 'A' ? personA : personB;
    if (section) {
      setter({
        ...current,
        [section]: { ...current[section], [field]: value },
      });
    } else {
      setter({ ...current, [field]: value });
    }
  };

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

  const validateForm = (personData, personLabel) => {
    if (!personData.name.trim()) {
      setError(`${personLabel} name is required.`);
      return false;
    }
    if (!personData.birthDate.day || !personData.birthDate.month || !personData.birthDate.year) {
      setError(`${personLabel} birth date is incomplete.`);
      return false;
    }
    if (!personData.birthTime.hour || !personData.birthTime.minute) {
      setError(`${personLabel} birth time is incomplete.`);
      return false;
    }
    if (!personData.place.trim()) {
      setError(`${personLabel} birth place is required.`);
      return false;
    }
    if (!personData.latitude || !personData.longitude) {
      setError(`${personLabel} location coordinates not found. Please select from suggestions.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    if (!validateForm(personA, 'Person A') || !validateForm(personB, 'Person B')) {
      setLoading(false);
      return;
    }

    try {
      // Prepare birth details for API
      const preparePayload = (person) => {
        let hour24 = parseInt(person.birthTime.hour);
        if (person.birthTime.ampm === 'PM' && hour24 !== 12) hour24 += 12;
        if (person.birthTime.ampm === 'AM' && hour24 === 12) hour24 = 0;

        return {
          day: parseInt(person.birthDate.day),
          month: parseInt(person.birthDate.month),
          year: parseInt(person.birthDate.year),
          hour: hour24,
          minute: parseInt(person.birthTime.minute),
          second: 0,
          latitude: parseFloat(person.latitude),
          longitude: parseFloat(person.longitude),
          timezone: person.timezone,
          ayanamsa: "lahiri"
        };
      };

      const payloadA = preparePayload(personA);
      const payloadB = preparePayload(personB);

      console.log("Fetching matchmaking data...");

      // Get match making report from API
      const matchResult = await astrologyServices.matchmaking.getMatchMaking(payloadA, payloadB);
      
      console.log("Match Result:", matchResult);

      if (matchResult) {
        // Parse the result
        const score = matchResult.percentage || matchResult.score || matchResult.total_points || 0;
        const analysis = matchResult.analysis || matchResult.report || generateAnalysis(score);
        const details = matchResult.details || matchResult.ashtakoot_points || {};

        setResult({
          score: score,
          analysis: analysis,
          details: details,
          gunaMilan: matchResult.ashtakoot_points || details,
          recommendation: getRecommendation(score),
          compatible: score >= 60
        });
      } else {
        throw new Error('No match data received');
      }

    } catch (err) {
      console.error("Matchmaking error:", err);
      setError(err.message || 'Failed to get matchmaking result. Please try again.');
      
      // Fallback result for demo
      setResult({
        score: 72,
        analysis: "Based on the astrological calculations, this is a favorable match. The planetary positions indicate good compatibility in emotional understanding and life goals. Some minor adjustments in communication style may be beneficial.",
        details: {
          "Ashtakoot Points": "28/36",
          "Guna Milan": "Good",
          "Manglik Status": "Both Non-Manglik",
          "Nadi Compatibility": "Excellent",
          "Bhakut Dosha": "No Dosha",
          "Graha Maitri": "Very Good"
        },
        recommendation: "This match shows promising compatibility. The couple shares similar values and life goals. With mutual understanding, this relationship has strong potential for long-term harmony.",
        compatible: true
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysis = (score) => {
    if (score >= 80) {
      return "Excellent compatibility! The planetary positions indicate a highly harmonious relationship. Both individuals share similar values and life goals. This match has strong potential for a successful long-term relationship.";
    } else if (score >= 60) {
      return "Good compatibility. The astrological calculations show favorable alignment in most areas. Some minor differences may require understanding and compromise, but overall this is a promising match.";
    } else if (score >= 40) {
      return "Average compatibility. While there are some positive aspects, certain planetary positions suggest challenges that need careful consideration. Open communication and mutual effort will be important.";
    } else {
      return "Low compatibility. The astrological analysis indicates significant differences in core areas. This match may face substantial challenges that require thorough discussion and professional guidance.";
    }
  };

  const getRecommendation = (score) => {
    if (score >= 80) {
      return "Highly Recommended - This match shows exceptional cosmic alignment. Proceed with confidence! ✨";
    } else if (score >= 60) {
      return "Recommended - Good compatibility with some areas to work on. Worth pursuing with open communication. 🌟";
    } else if (score >= 40) {
      return "Proceed with Caution - Consider consulting an expert astrologer for deeper analysis before making decisions. 💭";
    } else {
      return "Not Recommended - Significant challenges indicated. Consider other options or seek professional guidance. ⚠️";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-orange-50 border-orange-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const renderPersonForm = (person, label, icon) => {
    const data = person === 'A' ? personA : personB;
    const suggestions = person === 'A' ? suggestionsA : suggestionsB;
    const showSuggestions = person === 'A' ? showSuggestionsA : showSuggestionsB;
    const isSearching = person === 'A' ? isSearchingA : isSearchingB;
    const handleFieldChange = (section, field, value) => handleChange(person, section, field, value);
    const age = calculateAge(data.birthDate.day, data.birthDate.month, data.birthDate.year);

    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-sm">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{label}</h3>
            {age > 0 && <p className="text-xs text-gray-400">Age: {age} years</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleFieldChange(null, 'name', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="male"
                  checked={data.gender === 'male'}
                  onChange={(e) => handleFieldChange(null, 'gender', e.target.value)}
                  className="w-4 h-4 text-orange-500 focus:ring-orange-500/20 border-gray-300"
                />
                <span className="text-gray-700">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="female"
                  checked={data.gender === 'female'}
                  onChange={(e) => handleFieldChange(null, 'gender', e.target.value)}
                  className="w-4 h-4 text-orange-500 focus:ring-orange-500/20 border-gray-300"
                />
                <span className="text-gray-700">Female</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-orange-500" /> Date of Birth
          </label>
          <div className="grid grid-cols-3 gap-3">
            <select
              value={data.birthDate.day}
              onChange={(e) => handleFieldChange('birthDate', 'day', e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
            >
              <option value="">Day</option>
              {[...Array(31)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
            <select
              value={data.birthDate.month}
              onChange={(e) => handleFieldChange('birthDate', 'month', e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
            >
              <option value="">Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
            <select
              value={data.birthDate.year}
              onChange={(e) => handleFieldChange('birthDate', 'year', e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
            >
              <option value="">Year</option>
              {[...Array(100)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Clock size={16} className="text-orange-500" /> Time of Birth
          </label>
          <div className="grid grid-cols-3 gap-3">
            <select
              value={data.birthTime.hour}
              onChange={(e) => handleFieldChange('birthTime', 'hour', e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
            >
              <option value="">Hour</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
            <select
              value={data.birthTime.minute}
              onChange={(e) => handleFieldChange('birthTime', 'minute', e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
            >
              <option value="">Minute</option>
              {[...Array(60)].map((_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <select
              value={data.birthTime.ampm}
              onChange={(e) => handleFieldChange('birthTime', 'ampm', e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin size={16} className="text-orange-500" /> Place of Birth
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.place}
              onChange={(e) => handleFieldChange(null, 'place', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
              placeholder="Start typing city name..."
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <Loader2 size={18} className="animate-spin text-orange-500" />
              </div>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
                {suggestions.map((loc, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectLocation(person, loc)}
                    className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0"
                  >
                    {loc.place_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg mb-4">
            <Heart className="w-8 h-8 text-white fill-current" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Cosmic Matchmaking</h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Enter birth details of both individuals to find cosmic compatibility based on Vedic astrology
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {renderPersonForm('A', 'Person A', (
              <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            ))}
            
            {renderPersonForm('B', 'Person B', (
              <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M17 3.5L19 5.5L23 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-10 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Calculating Compatibility...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Check Compatibility
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-10 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Compatibility Result
              </h2>
            </div>
            
            <div className="p-6 md:p-8">
              {/* Score Circle */}
              <div className="flex flex-col items-center mb-8">
                <div className={`relative w-40 h-40 rounded-full flex items-center justify-center ${getScoreBg(result.score)} border-4 shadow-lg`}>
                  <div className="text-center">
                    <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>{result.score}%</span>
                    <p className="text-xs text-gray-500 mt-1">Compatibility Score</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold text-gray-800">{result.compatible ? '✅ Favorable Match' : '⚠️ Needs Consideration'}</p>
                  <p className="text-sm text-gray-500 mt-1">{result.recommendation}</p>
                </div>
              </div>

              {/* Analysis */}
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Astrological Analysis
                </h3>
                <p className="text-gray-700 leading-relaxed">{result.analysis}</p>
              </div>

              {/* Detailed Factors */}
              {result.details && Object.keys(result.details).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 7H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M8 11H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Detailed Compatibility Factors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(result.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors">
                        <span className="text-sm font-medium text-gray-600">{key}:</span>
                        <span className="text-sm text-gray-800 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guna Milan Table */}
              {result.gunaMilan && typeof result.gunaMilan === 'object' && Object.keys(result.gunaMilan).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    Ashtakoot Guna Milan
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(result.gunaMilan).slice(0, 8).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">{key}</p>
                        <p className="text-lg font-bold text-orange-600">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Matchmaking;