// client/src/pages/Horoscope.jsx
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import astrologyServices from '../services/astrologyApi.js';

const Horoscope = () => {
  const [selectedSign, setSelectedSign] = useState('Aries');
  const [selectedDay, setSelectedDay] = useState('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [horoscopeData, setHoroscopeData] = useState(null);

  // Zodiac Signs Data
  const zodiacSigns = [
    { name: 'Aries', date: 'Mar 21 - Apr 19', icon: '♈', element: 'Fire', color: '#F97316', apiName: 'aries' },
    { name: 'Taurus', date: 'Apr 20 - May 20', icon: '♉', element: 'Earth', color: '#22C55E', apiName: 'taurus' },
    { name: 'Gemini', date: 'May 21 - Jun 20', icon: '♊', element: 'Air', color: '#EAB308', apiName: 'gemini' },
    { name: 'Cancer', date: 'Jun 21 - Jul 22', icon: '♋', element: 'Water', color: '#6B7280', apiName: 'cancer' },
    { name: 'Leo', date: 'Jul 23 - Aug 22', icon: '♌', element: 'Fire', color: '#EA580C', apiName: 'leo' },
    { name: 'Virgo', date: 'Aug 23 - Sep 22', icon: '♍', element: 'Earth', color: '#CA8A04', apiName: 'virgo' },
    { name: 'Libra', date: 'Sep 23 - Oct 22', icon: '♎', element: 'Air', color: '#EC4899', apiName: 'libra' },
    { name: 'Scorpio', date: 'Oct 23 - Nov 21', icon: '♏', element: 'Water', color: '#E11D48', apiName: 'scorpio' },
    { name: 'Sagittarius', date: 'Nov 22 - Dec 21', icon: '♐', element: 'Fire', color: '#A855F7', apiName: 'sagittarius' },
    { name: 'Capricorn', date: 'Dec 22 - Jan 19', icon: '♑', element: 'Earth', color: '#475569', apiName: 'capricorn' },
    { name: 'Aquarius', date: 'Jan 20 - Feb 18', icon: '♒', element: 'Air', color: '#0EA5E9', apiName: 'aquarius' },
    { name: 'Pisces', date: 'Feb 19 - Mar 20', icon: '♓', element: 'Water', color: '#14B8A6', apiName: 'pisces' }
  ];

  const days = [
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' }
  ];

  // Fetch horoscope from AstrologyAPI
  useEffect(() => {
    fetchHoroscope();
  }, [selectedSign, selectedDay]);

  const fetchHoroscope = async () => {
    setLoading(true);
    setError('');
    try {
      const signData = zodiacSigns.find(s => s.name === selectedSign);
      const response = await astrologyServices.predictions.getDailyHoroscope(
        signData.apiName,
        selectedDay
      );
      
      if (response) {
        setHoroscopeData(response);
      } else {
        throw new Error('No data received');
      }
    } catch (err) {
      console.error('Horoscope fetch error:', err);
      setError('Unable to fetch horoscope. Please try again later.');
      // Set fallback data
      setHoroscopeData(getFallbackHoroscope(selectedSign, selectedDay));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackHoroscope = (sign, day) => {
    const dayLabel = day === 'today' ? 'today' : day === 'yesterday' ? 'yesterday' : 'tomorrow';
    const fallbacks = {
      Aries: {
        prediction: `Dynamic energy surrounds you ${dayLabel}, Aries. Mars, your ruling planet, brings a surge of motivation that will help you tackle long-pending tasks. New opportunities in leadership may appear unexpectedly.`,
        love: `Your passionate nature shines today. Single Aries might meet someone intriguing, while committed ones should plan a spontaneous date.`,
        career: `A project you've been working on gets greenlit. Take credit for your hard work and don't shy away from negotiations.`,
        health: `High energy levels, but remember to take breaks. A quick workout will boost your mood significantly.`
      },
      Taurus: {
        prediction: `Stability and comfort are highlighted ${dayLabel}, Taurus. Venus brings harmony to your surroundings. Focus on home improvements and family connections.`,
        love: `Romance feels secure and warm. A heartfelt conversation deepens your bond. Surprise your partner with a small gift.`,
        career: `Financial matters look promising. Review investments and consider long-term savings plans.`,
        health: `Your throat needs care. Stay hydrated and avoid cold drinks. Meditation brings mental peace.`
      },
      Gemini: {
        prediction: `Communication flows effortlessly ${dayLabel}, Gemini. Mercury enhances your wit and charm. Networking events bring valuable connections.`,
        love: `Flirtatious energy surrounds you. Express your feelings openly. A text message might lead to an exciting plan.`,
        career: `Multitasking is your superpower today. Handle emails, calls, and meetings with ease. New learning opportunities arise.`,
        health: `Nervous energy needs an outlet. Try breathing exercises or a brisk walk.`
      },
      Cancer: {
        prediction: `Emotions run deep ${dayLabel}, Cancer. The Moon intensifies your intuition. Trust your gut feelings when making decisions.`,
        love: `Nurturing instincts are strong. Cook a meal for your loved one. Family matters take center stage.`,
        career: `A colleague may seek your advice. Offer help but maintain boundaries.`,
        health: `Focus on digestive health. Eat warm, home-cooked meals.`
      },
      Leo: {
        prediction: `Your creative spark is undeniable ${dayLabel}, Leo. The Sun boosts your confidence. Perfect time to start a passion project or hobby.`,
        love: `Romance feels dramatic and exciting. Plan a grand gesture or a special date night.`,
        career: `Leadership opportunities arise. Speak up in meetings and share your bold ideas.`,
        health: `Heart and spine need attention. Good posture and cardiovascular exercise help.`
      },
      Virgo: {
        prediction: `Organization brings peace ${dayLabel}, Virgo. Mercury helps you sort through clutter — both physical and mental.`,
        love: `Small acts of service show your love. Pay attention to details your partner appreciates.`,
        career: `Your analytical skills save the day. Double-check documents before submitting.`,
        health: `Gut health is highlighted. Probiotics and fiber-rich foods are beneficial.`
      },
      Libra: {
        prediction: `Balance is key ${dayLabel}, Libra. Venus helps you harmonize work and personal life. A creative solution emerges for an old problem.`,
        love: `Partnerships thrive. A heart-to-heart conversation strengthens your bond.`,
        career: `Collaboration brings success. Team projects benefit from your diplomatic touch.`,
        health: `Kidneys need care. Drink plenty of water and reduce salt intake.`
      },
      Scorpio: {
        prediction: `Intensity serves you well ${dayLabel}, Scorpio. Pluto reveals hidden truths. A mystery you've been pondering gets solved.`,
        love: `Passion runs deep. Intimate conversations lead to breakthroughs.`,
        career: `Research pays off. Dig deeper into a project — you'll find valuable insights.`,
        health: `Reproductive health needs attention. Schedule any pending checkups.`
      },
      Sagittarius: {
        prediction: `Adventure calls ${dayLabel}, Sagittarius. Jupiter expands your horizons. Learning something new brings joy.`,
        love: `Spontaneity sparks romance. A last-minute trip or date idea excites your partner.`,
        career: `Travel or training opportunities arise. Say yes to growth experiences.`,
        health: `Hips and thighs benefit from stretching. Yoga or pilates is ideal.`
      },
      Capricorn: {
        prediction: `Ambition meets discipline ${dayLabel}, Capricorn. Saturn rewards your hard work. A goal you've been pursuing moves closer.`,
        love: `Stability feels comforting. Discuss future plans with your partner.`,
        career: `Recognition comes your way. Apply for that promotion or new role.`,
        health: `Bones and joints need care. Weight-bearing exercises strengthen them.`
      },
      Aquarius: {
        prediction: `Innovation flows freely ${dayLabel}, Aquarius. Uranus brings unexpected inspiration. A unique solution to a problem surprises everyone.`,
        love: `Friendship and love blend beautifully. Your partner is also your best friend.`,
        career: `Technology works in your favor. Automate repetitive tasks to save time.`,
        health: `Circulation improves with movement. Take the stairs instead of the elevator.`
      },
      Pisces: {
        prediction: `Creativity knows no bounds ${dayLabel}, Pisces. Neptune enhances your imagination. Art, music, or writing projects flourish.`,
        love: `Romance feels dreamy. A movie night or art gallery visit sparks connection.`,
        career: `Trust your intuition when making decisions. Your gut feeling is accurate.`,
        health: `Feet need pampering. A foot soak or massage relieves stress.`
      }
    };
    
    const data = fallbacks[sign] || fallbacks.Aries;
    const luckyNumbers = [3, 7, 9, 12, 21, 24, 33, 42];
    const luckyColors = ['Crimson Red', 'Forest Green', 'Ocean Blue', 'Golden Yellow', 'Royal Purple', 'Rose Gold', 'Emerald', 'Sapphire Blue'];
    const elements = { Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water', Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water', Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water' };
    
    return {
      prediction: data.prediction,
      love: data.love,
      career: data.career,
      health: data.health,
      lucky_number: luckyNumbers[Math.floor(Math.random() * luckyNumbers.length)],
      lucky_color: luckyColors[Math.floor(Math.random() * luckyColors.length)],
      element: elements[sign] || 'Fire',
      date: new Date().toLocaleDateString(),
      sign: sign
    };
  };

  const currentSignData = zodiacSigns.find(s => s.name === selectedSign);
  const currentDayLabel = days.find(d => d.value === selectedDay)?.label || 'Today';

  const getElementColor = (element) => {
    switch(element) {
      case 'Fire': return 'from-red-500 to-orange-500';
      case 'Earth': return 'from-emerald-500 to-green-500';
      case 'Air': return 'from-sky-400 to-blue-500';
      case 'Water': return 'from-cyan-500 to-teal-500';
      default: return 'from-orange-500 to-amber-500';
    }
  };

  const getElementBg = (element) => {
    switch(element) {
      case 'Fire': return 'bg-red-50 border-red-200';
      case 'Earth': return 'bg-emerald-50 border-emerald-200';
      case 'Air': return 'bg-sky-50 border-sky-200';
      case 'Water': return 'bg-cyan-50 border-cyan-200';
      default: return 'bg-orange-50 border-orange-200';
    }
  };

  // Show loading state
  if (loading && !horoscopeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Consulting the stars...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !horoscopeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchHoroscope} 
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const horoscope = horoscopeData || getFallbackHoroscope(selectedSign, selectedDay);
  const element = horoscope.element || currentSignData?.element || 'Fire';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg mb-5">
            <span className="text-3xl">🌟</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 tracking-tight">
            Daily Horoscope
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover what the stars have aligned for you — insights for love, career, and well-being
          </p>
        </div>

        {/* Zodiac Signs Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">✨</span>
            <h2 className="text-xl font-semibold text-gray-800">Choose Your Zodiac Sign</h2>
            <span className="text-2xl">✨</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.name}
                onClick={() => setSelectedSign(sign.name)}
                className={`group flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${
                  selectedSign === sign.name
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span className={`text-3xl md:text-4xl mb-2 transition-colors ${
                  selectedSign === sign.name ? 'text-white' : 'text-gray-600 group-hover:text-orange-500'
                }`}>
                  {sign.icon}
                </span>
                <span className={`text-sm md:text-base font-semibold ${
                  selectedSign === sign.name ? 'text-white' : 'text-gray-800'
                }`}>
                  {sign.name}
                </span>
                <span className={`text-[10px] md:text-xs mt-1 ${
                  selectedSign === sign.name ? 'text-white/80' : 'text-gray-400'
                }`}>
                  {sign.date.split(' - ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Horoscope Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Day Selection Tabs */}
          <div className="flex border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            {days.map((day) => (
              <button
                key={day.value}
                onClick={() => setSelectedDay(day.value)}
                className={`flex-1 py-4 text-center text-sm md:text-base font-semibold transition-all duration-200 ${
                  selectedDay === day.value
                    ? 'text-orange-600 border-b-2 border-orange-500 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Horoscope Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* Sign Header */}
            <div className="flex flex-col sm:flex-row items-center gap-5 mb-8 pb-6 border-b border-gray-100">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getElementColor(element)} flex items-center justify-center text-white text-4xl shadow-md`}>
                {currentSignData?.icon}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {selectedSign} Horoscope
                  </h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getElementBg(element)} text-gray-600 font-medium`}>
                    {element}
                  </span>
                </div>
                <p className="text-orange-500 font-medium mt-1">
                  {currentDayLabel}'s Celestial Guidance
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {currentSignData?.date}
                </p>
              </div>
            </div>

            {/* General Prediction */}
            <div className="mb-8 p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🔮</span>
                <h3 className="font-bold text-gray-800">General Overview</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {horoscope.prediction || horoscope.general}
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Love */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">❤️</span>
                  <h3 className="font-bold text-gray-800">Love & Relationships</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{horoscope.love}</p>
              </div>

              {/* Career */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💼</span>
                  <h3 className="font-bold text-gray-800">Career & Finance</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{horoscope.career}</p>
              </div>

              {/* Health */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🧘‍♀️</span>
                  <h3 className="font-bold text-gray-800">Health & Wellness</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{horoscope.health}</p>
              </div>
            </div>

            {/* Lucky Details */}
            <div className="flex flex-wrap justify-center gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-200">
                <span className="text-gray-500 font-medium text-sm">Lucky Number:</span>
                <span className="text-orange-600 font-bold text-xl">{horoscope.lucky_number || horoscope.luckyNumber || 7}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-200">
                <span className="text-gray-500 font-medium text-sm">Lucky Color:</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm" 
                    style={{ 
                      backgroundColor: 
                        (horoscope.lucky_color || horoscope.luckyColor) === 'Crimson Red' ? '#DC2626' :
                        (horoscope.lucky_color || horoscope.luckyColor) === 'Forest Green' ? '#166534' :
                        (horoscope.lucky_color || horoscope.luckyColor) === 'Ocean Blue' ? '#0284C7' :
                        (horoscope.lucky_color || horoscope.luckyColor) === 'Golden Yellow' ? '#EAB308' :
                        (horoscope.lucky_color || horoscope.luckyColor) === 'Royal Purple' ? '#9333EA' :
                        (horoscope.lucky_color || horoscope.luckyColor) === 'Rose Gold' ? '#F43F5E' :
                        (horoscope.lucky_color || horoscope.luckyColor) === 'Emerald' ? '#10B981' :
                        (horoscope.lucky_color || horoscope.luckyColor) === 'Sapphire Blue' ? '#1E3A8A' : '#F97316'
                    }}
                  />
                  <span className="text-orange-600 font-semibold text-md">{horoscope.lucky_color || horoscope.luckyColor || 'Golden Yellow'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-200">
                <span className="text-gray-500 font-medium text-sm">Element:</span>
                <span className="text-orange-600 font-semibold text-md">{element}</span>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                These predictions are generated based on celestial alignments and are meant for guidance
                <Sparkles className="w-3 h-3" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Horoscope;