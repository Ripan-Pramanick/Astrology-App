// client/src/components/kundli/PredictionSection.jsx
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Brain, TrendingUp, Heart, Briefcase, 
  Activity, Shield, RefreshCw, ChevronDown, ChevronUp,
  Star, Zap
} from 'lucide-react';
import api from '../../services/api.js';

const PredictionSection = ({ birthDetails, kundliData, planetsList, basicInfo }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    career: true,
    love: true,
    health: true,
    spiritual: true
  });

  useEffect(() => {
    fetchPrediction();
  }, []);

  const fetchPrediction = async () => {
    setLoading(true);
    setError('');
    
    try {
      const requestData = {
        planets: planetsList || [],
        basic: {
          ascendant: basicInfo?.ascendant || birthDetails?.lagna || 'Unknown',
          sign: basicInfo?.sign || birthDetails?.rasi || 'Unknown',
          Naksahtra: basicInfo?.Naksahtra || birthDetails?.nakshatra || 'Unknown',
          name: birthDetails?.name || 'Client',
          dob: birthDetails?.dob || 'Unknown',
          tob: birthDetails?.tob || 'Unknown',
          pob: birthDetails?.pob || 'Unknown'
        }
      };

      const response = await api.post('/ai/interpret', requestData);
      
      if (response.data.success) {
        const parsedPrediction = parseAIPrediction(response.data.interpretation);
        setPrediction(parsedPrediction);
      } else {
        throw new Error('Failed to get prediction');
      }
      
    } catch (err) {
      console.error('AI Prediction error:', err);
      setError(err.message || 'Failed to fetch AI prediction');
      setPrediction(getFallbackPrediction(birthDetails, basicInfo));
    } finally {
      setLoading(false);
    }
  };

  const parseAIPrediction = (interpretation) => {
    if (typeof interpretation === 'object') return interpretation;
    
    return {
      summary: interpretation?.substring(0, 300) || getDefaultSummary(birthDetails, basicInfo),
      career: getDefaultCareerPrediction(birthDetails),
      love: getDefaultLovePrediction(birthDetails),
      health: getDefaultHealthPrediction(birthDetails),
      spiritual: getDefaultSpiritualPrediction(birthDetails),
      luckyNumber: Math.floor(Math.random() * 9) + 1,
      luckyColor: ['Crimson Red', 'Royal Blue', 'Emerald Green', 'Golden Yellow', 'Royal Purple'][Math.floor(Math.random() * 5)],
      gemstone: ['Ruby', 'Pearl', 'Coral', 'Emerald', 'Yellow Sapphire'][Math.floor(Math.random() * 5)]
    };
  };

  const getDefaultSummary = (details, basic) => {
    const ascendant = basic?.ascendant || details?.lagna || 'Aries';
    const moonSign = basic?.sign || details?.rasi || 'Aries';
    return `✨ Based on your birth chart with ${ascendant} ascendant and ${moonSign} moon sign, the stars indicate a period of growth and transformation. Jupiter's influence brings opportunities for expansion in multiple areas of your life. ✨`;
  };

  const getDefaultCareerPrediction = (details) => {
    return '🌟 Professional growth and recognition are indicated in the coming months. Stay open to new opportunities and trust your instincts. A promotion or career shift may be on the horizon. 🌟';
  };

  const getDefaultLovePrediction = (details) => {
    return '💖 Venus brings harmony to relationships. For singles, a meaningful connection may appear. For couples, deeper understanding and bonding are indicated. Open communication will strengthen existing bonds. 💖';
  };

  const getDefaultHealthPrediction = (details) => {
    return '💪 Energy levels are high. Focus on work-life balance. Meditation and yoga will be particularly beneficial this month. Pay attention to digestive health and stay hydrated. 💪';
  };

  const getDefaultSpiritualPrediction = (details) => {
    return '🕉️ Your intuition is heightened. This is an excellent time for meditation and spiritual practices. Past life connections may surface. Trust your inner guidance. 🕉️';
  };

  const getFallbackPrediction = (details, basic) => {
    return {
      summary: getDefaultSummary(details, basic),
      career: getDefaultCareerPrediction(details),
      love: getDefaultLovePrediction(details),
      health: getDefaultHealthPrediction(details),
      spiritual: getDefaultSpiritualPrediction(details),
      luckyNumber: Math.floor(Math.random() * 9) + 1,
      luckyColor: ['Crimson Red', 'Royal Blue', 'Emerald Green', 'Golden Yellow', 'Royal Purple'][Math.floor(Math.random() * 5)],
      gemstone: ['Ruby', 'Pearl', 'Coral', 'Emerald', 'Yellow Sapphire'][Math.floor(Math.random() * 5)]
    };
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-500 animate-pulse" size={24} />
          </div>
          <p className="mt-4 text-gray-600 font-medium">AI is analyzing your cosmic chart...</p>
          <p className="text-sm text-gray-400 mt-1">Generating personalized predictions</p>
        </div>
      </div>
    );
  }

  if (error && !prediction) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg text-center">
        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="text-red-500" size={32} />
        </div>
        <p className="text-red-600 mb-3">{error}</p>
        <button
          onClick={fetchPrediction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <RefreshCw size={16} /> Retry Prediction
        </button>
      </div>
    );
  }

  if (!prediction) return null;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Cosmic Insights</h3>
            <p className="text-purple-200 text-sm">Powered by Google Gemini AI</p>
          </div>
        </div>
        <p className="text-purple-100 leading-relaxed">
          {prediction.summary}
        </p>
      </div>

      {/* Career Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('career')}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase className="text-blue-600" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Career & Finance</h4>
              <p className="text-xs text-gray-500">Professional growth and wealth insights</p>
            </div>
          </div>
          {expandedSections.career ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSections.career && (
          <div className="px-5 pb-5">
            <p className="text-gray-600 leading-relaxed">{prediction.career}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">📈 Growth Period</span>
              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">💼 Networking</span>
            </div>
          </div>
        )}
      </div>

      {/* Love Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('love')}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart className="text-pink-600" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Love & Relationships</h4>
              <p className="text-xs text-gray-500">Romance, family, and emotional bonds</p>
            </div>
          </div>
          {expandedSections.love ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSections.love && (
          <div className="px-5 pb-5">
            <p className="text-gray-600 leading-relaxed">{prediction.love}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full">❤️ Venus Favorable</span>
              <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">💑 Communication</span>
            </div>
          </div>
        )}
      </div>

      {/* Health Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('health')}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Activity className="text-green-600" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Health & Wellness</h4>
              <p className="text-xs text-gray-500">Physical and mental well-being</p>
            </div>
          </div>
          {expandedSections.health ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSections.health && (
          <div className="px-5 pb-5">
            <p className="text-gray-600 leading-relaxed">{prediction.health}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">🧘 Meditation</span>
              <span className="text-xs bg-teal-50 text-teal-600 px-2 py-1 rounded-full">🥗 Balanced Diet</span>
            </div>
          </div>
        )}
      </div>

      {/* Spiritual Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('spiritual')}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Sparkles className="text-purple-600" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Spiritual Guidance</h4>
              <p className="text-xs text-gray-500">Inner wisdom and cosmic connection</p>
            </div>
          </div>
          {expandedSections.spiritual ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSections.spiritual && (
          <div className="px-5 pb-5">
            <p className="text-gray-600 leading-relaxed">{prediction.spiritual}</p>
          </div>
        )}
      </div>

      {/* Lucky Elements Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <TrendingUp className="text-orange-500" size={18} />
          Your Lucky Elements
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xs text-gray-500">Lucky Number</p>
            <p className="text-2xl font-bold text-orange-600">{prediction.luckyNumber}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xs text-gray-500">Lucky Color</p>
            <p className="text-lg font-semibold text-orange-600">{prediction.luckyColor}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xs text-gray-500">Recommended Gemstone</p>
            <p className="text-sm font-semibold text-orange-600">{prediction.gemstone}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-gray-400 italic">
        <p>✨ AI-generated insights based on Vedic astrology principles. For entertainment and guidance purposes. ✨</p>
      </div>
    </div>
  );
};

export default PredictionSection;