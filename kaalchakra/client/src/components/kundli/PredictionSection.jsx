// client/src/components/kundli/PredictionSection.jsx (with sparkles)
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Brain, TrendingUp, Heart, Briefcase, 
  Activity, Shield, RefreshCw, ChevronDown, ChevronUp,
  Star, Zap
} from 'lucide-react';
import { SparkleButton, SparkleText, BackgroundSparkles } from '../ui/Sparkle';
import api from '../../services/api';

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
  const [showSparkles, setShowSparkles] = useState(true);

  // Fetch AI prediction
  const fetchPrediction = async () => {
    setLoading(true);
    setError('');
    setShowSparkles(true);
    
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
        },
        kundliId: kundliData?.id || null
      };

      const response = await api.post('/ai/interpret', requestData);
      
      if (response.data.success) {
        const parsedPrediction = parseAIPrediction(response.data.interpretation);
        setPrediction(parsedPrediction);
      } else {
        throw new Error(response.data.message || 'Failed to get prediction');
      }
      
    } catch (err) {
      console.error('AI Prediction error:', err);
      setError(err.response?.data?.message || 'Failed to fetch AI prediction');
      setPrediction(getFallbackPrediction(birthDetails, basicInfo));
    } finally {
      setLoading(false);
      setTimeout(() => setShowSparkles(false), 2000);
    }
  };

  const parseAIPrediction = (interpretation) => {
    if (typeof interpretation === 'object') return interpretation;
    
    const text = interpretation || '';
    
    return {
      summary: text.substring(0, 300) || getDefaultSummary(birthDetails, basicInfo),
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

  useEffect(() => {
    if (planetsList || birthDetails) {
      fetchPrediction();
    }
  }, [planetsList, birthDetails]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-2xl p-8 shadow-lg relative overflow-hidden">
        <BackgroundSparkles count={15} />
        <div className="flex flex-col items-center justify-center py-12 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-500 animate-pulse" size={28} />
            <div className="absolute -top-2 -right-2 animate-ping">
              <Star className="text-yellow-400" size={16} fill="#FBBF24" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-ping delay-300">
              <Star className="text-yellow-400" size={12} fill="#FBBF24" />
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-semibold text-lg">AI is analyzing your cosmic chart...</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            <Sparkles size={14} className="animate-pulse" /> Generating personalized predictions <Sparkles size={14} className="animate-pulse" />
          </p>
        </div>
      </div>
    );
  }

  if (error && !prediction) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg text-center relative overflow-hidden">
        <BackgroundSparkles count={10} colors={['#EF4444', '#F97316']} />
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <Shield className="text-red-500" size={32} />
          </div>
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <SparkleButton
            onClick={fetchPrediction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl"
            sparkleColor="#FBBF24"
          >
            <RefreshCw size={18} /> Retry Prediction <Sparkles size={16} />
          </SparkleButton>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  return (
    <div className="relative">
      {showSparkles && <BackgroundSparkles count={20} />}
      
      <div className="space-y-6 relative z-10">
        {/* Header Section with Sparkles */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <Brain size={28} className="text-white" />
            </div>
            <div>
              <SparkleText className="text-2xl font-bold" sparkleColor="#FFD700">
                AI Cosmic Insights
              </SparkleText>
              <p className="text-purple-200 text-sm flex items-center gap-1">
                <Sparkles size={14} /> Powered by Google Gemini AI <Sparkles size={14} />
              </p>
            </div>
          </div>
          
          <p className="text-purple-100 leading-relaxed relative z-10">
            {prediction.summary}
          </p>
          
          {/* Decorative sparkles */}
          <div className="absolute top-2 right-2 opacity-30">
            <Star size={40} fill="#FFD700" />
          </div>
        </div>

        {/* Career Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
          <button
            onClick={() => toggleSection('career')}
            className="w-full flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                <Briefcase className="text-white" size={22} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-800 text-lg">Career & Finance</h4>
                <p className="text-xs text-gray-500">Professional growth and wealth insights</p>
              </div>
            </div>
            {expandedSections.career ? <ChevronUp size={22} className="text-orange-500" /> : <ChevronDown size={22} className="text-gray-400" />}
          </button>
          
          {expandedSections.career && (
            <div className="px-5 pb-5 animate-fadeIn">
              <p className="text-gray-600 leading-relaxed">{prediction.career}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={12} /> Growth Period
                </span>
                <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={12} /> Networking
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Love Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
          <button
            onClick={() => toggleSection('love')}
            className="w-full flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-pink-50 hover:to-transparent transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                <Heart className="text-white" size={22} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-800 text-lg">Love & Relationships</h4>
                <p className="text-xs text-gray-500">Romance, family, and emotional bonds</p>
              </div>
            </div>
            {expandedSections.love ? <ChevronUp size={22} className="text-orange-500" /> : <ChevronDown size={22} className="text-gray-400" />}
          </button>
          
          {expandedSections.love && (
            <div className="px-5 pb-5 animate-fadeIn">
              <p className="text-gray-600 leading-relaxed">{prediction.love}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-pink-50 text-pink-600 px-3 py-1 rounded-full flex items-center gap-1">
                  <Heart size={12} /> Venus Favorable
                </span>
                <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={12} /> Communication
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Health Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
          <button
            onClick={() => toggleSection('health')}
            className="w-full flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <Activity className="text-white" size={22} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-800 text-lg">Health & Wellness</h4>
                <p className="text-xs text-gray-500">Physical and mental well-being</p>
              </div>
            </div>
            {expandedSections.health ? <ChevronUp size={22} className="text-orange-500" /> : <ChevronDown size={22} className="text-gray-400" />}
          </button>
          
          {expandedSections.health && (
            <div className="px-5 pb-5 animate-fadeIn">
              <p className="text-gray-600 leading-relaxed">{prediction.health}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={12} /> Meditation
                </span>
                <span className="text-xs bg-teal-50 text-teal-600 px-3 py-1 rounded-full flex items-center gap-1">
                  <Activity size={12} /> Balanced Diet
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Spiritual Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
          <button
            onClick={() => toggleSection('spiritual')}
            className="w-full flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="text-white" size={22} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-800 text-lg">Spiritual Guidance</h4>
                <p className="text-xs text-gray-500">Inner wisdom and cosmic connection</p>
              </div>
            </div>
            {expandedSections.spiritual ? <ChevronUp size={22} className="text-orange-500" /> : <ChevronDown size={22} className="text-gray-400" />}
          </button>
          
          {expandedSections.spiritual && (
            <div className="px-5 pb-5 animate-fadeIn">
              <p className="text-gray-600 leading-relaxed">{prediction.spiritual}</p>
            </div>
          )}
        </div>

        {/* Lucky Elements Card with Sparkles */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-6 border border-amber-200 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
          
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="text-orange-500 animate-pulse" size={20} />
            Your Lucky Elements
            <Sparkles className="text-orange-500 animate-pulse" size={20} />
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all hover:scale-105">
              <p className="text-xs text-gray-500 mb-1">Lucky Number</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {prediction.luckyNumber}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all hover:scale-105">
              <p className="text-xs text-gray-500 mb-1">Lucky Color</p>
              <p className="text-lg font-semibold text-orange-600">{prediction.luckyColor}</p>
              <div 
                className="w-8 h-8 rounded-full mx-auto mt-2 shadow-inner"
                style={{ 
                  backgroundColor: prediction.luckyColor === 'Crimson Red' ? '#DC2626' :
                    prediction.luckyColor === 'Royal Blue' ? '#2563EB' :
                    prediction.luckyColor === 'Emerald Green' ? '#059669' :
                    prediction.luckyColor === 'Golden Yellow' ? '#D97706' :
                    '#7C3AED'
                }}
              />
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all hover:scale-105">
              <p className="text-xs text-gray-500 mb-1">Recommended Gemstone</p>
              <p className="text-sm font-semibold text-orange-600">{prediction.gemstone}</p>
              <Sparkles size={16} className="mx-auto mt-2 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Disclaimer with Sparkles */}
        <div className="text-center">
          <p className="text-xs text-gray-400 italic flex items-center justify-center gap-2">
            <Sparkles size={12} className="text-purple-400" />
            AI-generated insights based on Vedic astrology principles. For entertainment and guidance purposes.
            <Sparkles size={12} className="text-purple-400" />
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PredictionSection;