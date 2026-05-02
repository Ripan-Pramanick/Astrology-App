// client/src/pages/Horoscope.jsx
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import astrologyServices from '../services/astrologyApi.js';

// Import zodiac images
import Aries from '../assets/images/Aries.webp';
import Taurus from '../assets/images/Taurus.webp';
import Gemini from '../assets/images/Gemini.webp';
import Cancer from '../assets/images/Cancer.webp';
import Leo from '../assets/images/Leo.webp';
import Virgo from '../assets/images/Virgo.webp';
import Libra from '../assets/images/Libra.webp';
import Scorpio from '../assets/images/Scorpio.webp';
import Sagittarius from '../assets/images/Sagittarius.webp';
import Capricorn from '../assets/images/Capricorn.webp';
import Aquarius from '../assets/images/Aquarius.webp';
import Pisces from '../assets/images/Pisces.webp';

// Fallback emoji icons (if image fails to load)
const zodiacIcons = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

const Horoscope = () => {
  const [selectedSign, setSelectedSign] = useState('Aries');
  const [selectedDay, setSelectedDay] = useState('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Zodiac Signs with images
  const zodiacSigns = [
    { name: 'Aries', date: 'Mar 21 - Apr 19', image: Aries, icon: '♈', element: 'Fire', color: '#F97316', apiName: 'aries' },
    { name: 'Taurus', date: 'Apr 20 - May 20', image: Taurus, icon: '♉', element: 'Earth', color: '#22C55E', apiName: 'taurus' },
    { name: 'Gemini', date: 'May 21 - Jun 20', image: Gemini, icon: '♊', element: 'Air', color: '#EAB308', apiName: 'gemini' },
    { name: 'Cancer', date: 'Jun 21 - Jul 22', image: Cancer, icon: '♋', element: 'Water', color: '#6B7280', apiName: 'cancer' },
    { name: 'Leo', date: 'Jul 23 - Aug 22', image: Leo, icon: '♌', element: 'Fire', color: '#EA580C', apiName: 'leo' },
    { name: 'Virgo', date: 'Aug 23 - Sep 22', image: Virgo, icon: '♍', element: 'Earth', color: '#CA8A04', apiName: 'virgo' },
    { name: 'Libra', date: 'Sep 23 - Oct 22', image: Libra, icon: '♎', element: 'Air', color: '#EC4899', apiName: 'libra' },
    { name: 'Scorpio', date: 'Oct 23 - Nov 21', image: Scorpio, icon: '♏', element: 'Water', color: '#E11D48', apiName: 'scorpio' },
    { name: 'Sagittarius', date: 'Nov 22 - Dec 21', image: Sagittarius, icon: '♐', element: 'Fire', color: '#A855F7', apiName: 'sagittarius' },
    { name: 'Capricorn', date: 'Dec 22 - Jan 19', image: Capricorn, icon: '♑', element: 'Earth', color: '#475569', apiName: 'capricorn' },
    { name: 'Aquarius', date: 'Jan 20 - Feb 18', image: Aquarius, icon: '♒', element: 'Air', color: '#0EA5E9', apiName: 'aquarius' },
    { name: 'Pisces', date: 'Feb 19 - Mar 20', image: Pisces, icon: '♓', element: 'Water', color: '#14B8A6', apiName: 'pisces' }
  ];

  const days = [
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' }
  ];

  // Handle image error - show emoji fallback
  const handleImageError = (signName) => {
    setImageErrors(prev => ({ ...prev, [signName]: true }));
  };

  // Map day value to API parameter
  const getDayParam = (day) => {
    switch (day) {
      case 'yesterday': return -1;
      case 'today': return 0;
      case 'tomorrow': return 1;
      default: return 0;
    }
  };

  // Fetch horoscope from AstrologyAPI
  useEffect(() => {
    fetchHoroscope();
  }, [selectedSign, selectedDay]);

  const fetchHoroscope = async () => {
    setLoading(true);
    setError('');
    try {
      const signData = zodiacSigns.find(s => s.name === selectedSign);
      const dayParam = getDayParam(selectedDay);

      console.log(`🔮 Fetching horoscope for ${signData.apiName}, day offset: ${dayParam}`);

      const currentDate = new Date();
      const payload = {
        day: currentDate.getDate() + dayParam,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        hour: 12,
        minute: 0,
        second: 0,
        latitude: 28.6139,
        longitude: 77.2090,
        timezone: 5.5,
        ayanamsa: "lahiri"
      };

      const birthDetails = await astrologyServices.kundli.getBirthDetails(payload);
      console.log("📊 Birth details for horoscope:", birthDetails);

      if (birthDetails) {
        const horoscope = generateHoroscopeFromPlanets(birthDetails, selectedSign, selectedDay);
        setHoroscopeData(horoscope);
      } else {
        throw new Error('No data received');
      }
    } catch (err) {
      console.error('Horoscope fetch error:', err);
      setError('Unable to fetch horoscope. Using celestial calculations.');
      setHoroscopeData(getFallbackHoroscope(selectedSign, selectedDay));
    } finally {
      setLoading(false);
    }
  };

  // Generate horoscope based on planetary positions
  const generateHoroscopeFromPlanets = (planets, sign, day) => {
    const sunSign = planets.sun_sign || sign;
    const dayLabel = day === 'today' ? 'today' : day === 'yesterday' ? 'yesterday' : 'tomorrow';

    return {
      general: `The cosmic energies are aligning favorably for you ${dayLabel}, ${sign}. ${getPlanetaryInfluence(sunSign)}`,
      love: getLovePrediction(sunSign, dayLabel),
      career: getCareerPrediction(sunSign, dayLabel),
      health: getHealthPrediction(sunSign, dayLabel),
      lucky_number: getLuckyNumber(sunSign),
      lucky_color: getLuckyColor(sunSign),
      element: zodiacSigns.find(s => s.name === sign)?.element || 'Fire'
    };
  };

  const getPlanetaryInfluence = (sunSign) => {
    const influences = {
      'Aries': 'Mars brings bold energy to your endeavors.',
      'Taurus': 'Venus enhances your charm and financial prospects.',
      'Gemini': 'Mercury sharpens your communication skills.',
      'Cancer': 'The Moon heightens your intuition and emotional depth.',
      'Leo': 'The Sun illuminates your path to success.',
      'Virgo': 'Mercury helps you organize and plan effectively.',
      'Libra': 'Venus brings harmony to your relationships.',
      'Scorpio': 'Pluto reveals hidden opportunities for transformation.',
      'Sagittarius': 'Jupiter expands your horizons and luck.',
      'Capricorn': 'Saturn rewards your discipline and hard work.',
      'Aquarius': 'Uranus brings unexpected but welcome changes.',
      'Pisces': 'Neptune enhances your creativity and spiritual connection.'
    };
    return influences[sunSign] || 'The planetary alignment is favorable for new beginnings.';
  };

  const getLovePrediction = (sunSign, dayLabel) => {
    const predictions = {
      'Aries': `Your passionate nature shines ${dayLabel}. Single Aries might meet someone intriguing, while committed ones should plan a spontaneous date.`,
      'Taurus': `Romance feels secure and warm ${dayLabel}. A heartfelt conversation deepens your bond.`,
      'Gemini': `Flirtatious energy surrounds you ${dayLabel}. Express your feelings openly.`,
      'Cancer': `Emotional connections deepen ${dayLabel}. Family matters bring joy.`,
      'Leo': `Romance feels dramatic and exciting ${dayLabel}. Plan a special date night.`,
      'Virgo': `Small acts of service show your love ${dayLabel}. Pay attention to details.`,
      'Libra': `Partnerships thrive ${dayLabel}. A heart-to-heart conversation strengthens your bond.`,
      'Scorpio': `Passion runs deep ${dayLabel}. Intimate conversations lead to breakthroughs.`,
      'Sagittarius': `Spontaneity sparks romance ${dayLabel}. A last-minute date excites your partner.`,
      'Capricorn': `Stability feels comforting ${dayLabel}. Discuss future plans with your partner.`,
      'Aquarius': `Friendship and love blend beautifully ${dayLabel}. Your partner is also your best friend.`,
      'Pisces': `Romance feels dreamy ${dayLabel}. An artistic date sparks connection.`
    };
    return predictions[sunSign] || `Love is in the air ${dayLabel}. Open your heart to new possibilities.`;
  };

  const getCareerPrediction = (sunSign, dayLabel) => {
    const predictions = {
      'Aries': `A project you've been working on gets greenlit ${dayLabel}. Take credit for your hard work.`,
      'Taurus': `Financial matters look promising ${dayLabel}. Review investments for long-term gains.`,
      'Gemini': `Multitasking is your superpower ${dayLabel}. Handle emails and meetings with ease.`,
      'Cancer': `A colleague may seek your advice ${dayLabel}. Offer help but maintain boundaries.`,
      'Leo': `Leadership opportunities arise ${dayLabel}. Speak up and share your bold ideas.`,
      'Virgo': `Your analytical skills save the day ${dayLabel}. Double-check important documents.`,
      'Libra': `Collaboration brings success ${dayLabel}. Team projects benefit from your diplomatic touch.`,
      'Scorpio': `Research pays off ${dayLabel}. Dig deeper into a project for valuable insights.`,
      'Sagittarius': `Travel or training opportunities arise ${dayLabel}. Say yes to growth experiences.`,
      'Capricorn': `Recognition comes your way ${dayLabel}. Apply for that promotion or new role.`,
      'Aquarius': `Technology works in your favor ${dayLabel}. Automate tasks to save time.`,
      'Pisces': `Trust your intuition when making decisions ${dayLabel}. Your gut feeling is accurate.`
    };
    return predictions[sunSign] || `New opportunities are emerging ${dayLabel}. Stay alert and ready.`;
  };

  const getHealthPrediction = (sunSign, dayLabel) => {
    const predictions = {
      'Aries': `High energy levels ${dayLabel}, but remember to take breaks.`,
      'Taurus': `Your throat needs care ${dayLabel}. Stay hydrated.`,
      'Gemini': `Nervous energy needs an outlet ${dayLabel}. Try breathing exercises.`,
      'Cancer': `Focus on digestive health ${dayLabel}. Eat warm meals.`,
      'Leo': `Heart and spine need attention ${dayLabel}. Good posture helps.`,
      'Virgo': `Gut health is highlighted ${dayLabel}. Probiotics are beneficial.`,
      'Libra': `Kidneys need care ${dayLabel}. Drink plenty of water.`,
      'Scorpio': `Reproductive health needs attention ${dayLabel}. Schedule checkups.`,
      'Sagittarius': `Hips and thighs benefit from stretching ${dayLabel}.`,
      'Capricorn': `Bones and joints need care ${dayLabel}. Weight-bearing exercises help.`,
      'Aquarius': `Circulation improves with movement ${dayLabel}.`,
      'Pisces': `Feet need pampering ${dayLabel}. A foot soak relieves stress.`
    };
    return predictions[sunSign] || `Listen to your body ${dayLabel}. Rest when needed.`;
  };

  const getLuckyNumber = (sign) => {
    const numbers = {
      'Aries': 3, 'Taurus': 6, 'Gemini': 5, 'Cancer': 2,
      'Leo': 1, 'Virgo': 7, 'Libra': 4, 'Scorpio': 9,
      'Sagittarius': 8, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
    };
    return numbers[sign] || 7;
  };

  const getLuckyColor = (sign) => {
    const colors = {
      'Aries': 'Crimson Red', 'Taurus': 'Forest Green', 'Gemini': 'Golden Yellow', 'Cancer': 'Ocean Blue',
      'Leo': 'Royal Purple', 'Virgo': 'Emerald', 'Libra': 'Rose Gold', 'Scorpio': 'Crimson Red',
      'Sagittarius': 'Sapphire Blue', 'Capricorn': 'Forest Green', 'Aquarius': 'Ocean Blue', 'Pisces': 'Royal Purple'
    };
    return colors[sign] || 'Golden Yellow';
  };

  const getFallbackHoroscope = (sign, day) => {
    const dayLabel = day === 'today' ? 'today' : day === 'yesterday' ? 'yesterday' : 'tomorrow';
    const signData = zodiacSigns.find(s => s.name === sign);
    const element = signData?.element || 'Fire';

    const fallbackData = {
      general: `The stars are aligned for you ${dayLabel}, ${sign}. Trust the cosmic energy.`,
      love: `Love and harmony surround you ${dayLabel}. Open your heart.`,
      career: `Professional opportunities are emerging ${dayLabel}. Stay focused.`,
      health: `Your vitality is strong ${dayLabel}. Maintain a balanced routine.`
    };

    return {
      general: fallbackData.general,
      love: fallbackData.love,
      career: fallbackData.career,
      health: fallbackData.health,
      lucky_number: getLuckyNumber(sign),
      lucky_color: getLuckyColor(sign),
      element: element,
      date: new Date().toLocaleDateString(),
      sign: sign
    };
  };

  const currentSignData = zodiacSigns.find(s => s.name === selectedSign);
  const currentDayLabel = days.find(d => d.value === selectedDay)?.label || 'Today';
  const horoscope = horoscopeData || getFallbackHoroscope(selectedSign, selectedDay);
  const element = horoscope.element || currentSignData?.element || 'Fire';

  const getElementColor = (element) => {
    switch (element) {
      case 'Fire': return 'from-red-500 to-orange-500';
      case 'Earth': return 'from-emerald-500 to-green-500';
      case 'Air': return 'from-sky-400 to-blue-500';
      case 'Water': return 'from-cyan-500 to-teal-500';
      default: return 'from-orange-500 to-amber-500';
    }
  };

  const getElementBg = (element) => {
    switch (element) {
      case 'Fire': return 'bg-red-50 border-red-200';
      case 'Earth': return 'bg-emerald-50 border-emerald-200';
      case 'Air': return 'bg-sky-50 border-sky-200';
      case 'Water': return 'bg-cyan-50 border-cyan-200';
      default: return 'bg-orange-50 border-orange-200';
    }
  };

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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-700 text-sm text-center">{error}</p>
          </div>
        )}

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
                className={`group flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 min-h-[130px] ${selectedSign === sign.name
                    // text-white এখান থেকে সরিয়ে দিয়েছি যাতে পুরো বাটনের টেক্সট সাদা না হয়ে যায়
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-xl transform scale-105 border-transparent'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
                  }`}
              >
                {/* ইমেজ বা আইকন এরিয়া */}
                <div className="h-16 flex items-center justify-center mb-2">
                  {!imageErrors[sign.name] ? (
                    <img
                      src={sign.image}
                      alt={sign.name}
                      className={`w-12 h-12 md:w-14 md:h-14 transition-all duration-300 object-cover object-center rounded-full ${selectedSign === sign.name
                          ? 'transform scale-125 ring-2 ring-white shadow-md'
                          : 'opacity-80 group-hover:opacity-100'
                        }`}
                      onError={() => handleImageError(sign.name)}
                    />
                  ) : (
                    <span className={`text-3xl md:text-4xl transition-all duration-300 ${selectedSign === sign.name
                        // আইকন লোড হলে সেটাকেও ডার্ক কালার করা হলো
                        ? 'text-gray-900 transform scale-125 drop-shadow-md'
                        : 'text-gray-600 group-hover:text-orange-500'
                      }`}>
                      {sign.icon}
                    </span>
                  )}
                </div>

                {/* টেক্সট সেকশন */}
                <div className="flex flex-col items-center justify-center w-full mt-1">
                  <span className={`text-sm md:text-base font-bold transition-colors ${
                    // selectedSign হলে text-gray-900 (কালো) দেখাবে
                    selectedSign === sign.name ? 'text-gray-900' : 'text-gray-800'
                    }`}>
                    {sign.name}
                  </span>
                  <span className={`text-[10px] md:text-xs mt-0.5 transition-colors ${
                    // তারিখটাকেও ডার্ক এবং বোল্ড করা হলো যাতে স্পষ্ট বোঝা যায়
                    selectedSign === sign.name ? 'text-gray-800 font-bold' : 'text-gray-500 font-medium'
                    }`}>
                    {sign.date.split(' - ')[0]}
                  </span>
                </div>
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
                className={`flex-1 py-4 text-center text-sm md:text-base font-semibold transition-all duration-200 ${selectedDay === day.value
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
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getElementColor(element)} flex items-center justify-center text-white text-4xl shadow-md`}>
                {/* {currentSignData?.icon} */}
                <img
                  src={currentSignData?.image}
                  // bg-cover এবং object-contain সরিয়ে object-cover object-center দেওয়া হলো
                  className='w-12 h-12 md:w-14 md:h-14 object-cover object-center rounded-full'
                  alt={currentSignData?.name}
                />
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
                {horoscope.general}
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
                <span className="text-orange-600 font-bold text-xl">{horoscope.lucky_number}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-200">
                <span className="text-gray-500 font-medium text-sm">Lucky Color:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{
                      backgroundColor:
                        horoscope.lucky_color === 'Crimson Red' ? '#DC2626' :
                          horoscope.lucky_color === 'Forest Green' ? '#166534' :
                            horoscope.lucky_color === 'Ocean Blue' ? '#0284C7' :
                              horoscope.lucky_color === 'Golden Yellow' ? '#EAB308' :
                                horoscope.lucky_color === 'Royal Purple' ? '#9333EA' :
                                  horoscope.lucky_color === 'Rose Gold' ? '#F43F5E' :
                                    horoscope.lucky_color === 'Emerald' ? '#10B981' :
                                      horoscope.lucky_color === 'Sapphire Blue' ? '#1E3A8A' : '#F97316'
                    }}
                  />
                  <span className="text-orange-600 font-semibold text-md">{horoscope.lucky_color}</span>
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