// client/src/pages/Matchmaking.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Matchmaking = () => {
  const [personA, setPersonA] = useState({
    name: '',
    gender: 'male',
    birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', ampm: 'AM' },
    place: '',
  });
  const [personB, setPersonB] = useState({
    name: '',
    gender: 'female',
    birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', ampm: 'AM' },
    place: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

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

    const payload = {
      personA: {
        name: personA.name,
        gender: personA.gender,
        birthDate: `${personA.birthDate.year}-${personA.birthDate.month}-${personA.birthDate.day}`,
        birthTime: `${personA.birthTime.hour}:${personA.birthTime.minute} ${personA.birthTime.ampm}`,
        place: personA.place,
      },
      personB: {
        name: personB.name,
        gender: personB.gender,
        birthDate: `${personB.birthDate.year}-${personB.birthDate.month}-${personB.birthDate.day}`,
        birthTime: `${personB.birthTime.hour}:${personB.birthTime.minute} ${personB.birthTime.ampm}`,
        place: personB.place,
      },
    };

    try {
      const response = await axios.post('/api/matchmaking', payload);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to get matchmaking result.');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonForm = (person, label, icon) => {
    const data = person === 'A' ? personA : personB;
    const handleFieldChange = (section, field, value) => handleChange(person, section, field, value);

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{label}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleFieldChange(null, 'name', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
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

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
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

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Time of Birth</label>
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

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth</label>
          <input
            type="text"
            value={data.place}
            onChange={(e) => handleFieldChange(null, 'place', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
            placeholder="City, Country"
          />
        </div>
      </div>
    );
  };

  // Helper to render compatibility score circle
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35Z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Matchmaking</h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Enter birth details of both individuals to find cosmic compatibility
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {renderPersonForm('A', 'Person A', (
              <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            ))}
            
            {renderPersonForm('B', 'Person B', (
              <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating Compatibility...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  Check Compatibility
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Compatibility Result</h2>
            </div>
            
            <div className="p-6 md:p-8">
              {/* Score Circle */}
              <div className="flex flex-col items-center mb-8">
                <div className={`relative w-40 h-40 rounded-full flex items-center justify-center ${getScoreBg(result.score)} border-4`}>
                  <div className="text-center">
                    <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>{result.score}%</span>
                    <p className="text-xs text-gray-500 mt-1">Compatibility Score</p>
                  </div>
                </div>
              </div>

              {/* Analysis */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12H15M12 9V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Analysis
                </h3>
                <p className="text-gray-600 leading-relaxed">{result.analysis}</p>
              </div>

              {/* Detailed Factors */}
              {result.details && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 7H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M8 11H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Detailed Factors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(result.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">{key}:</span>
                        <span className="text-sm text-gray-800 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matchmaking;