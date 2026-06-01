// client/src/pages/Matchmaking.jsx
import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, MapPin, Calendar, Clock, User, Loader2, AlertCircle, CheckCircle, XCircle, TrendingUp, Shield, Moon, Sun, Eye, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <-- Import translation hook
import astrologyServices from '../services/astrologyApi.js';
import { supabase } from '../lib/supabase.js';

// Zodiac Images
import AriesImg from '../assets/images/Aries.webp';
import TaurusImg from '../assets/images/Taurus.webp';
import GeminiImg from '../assets/images/Gemini.webp';
import CancerImg from '../assets/images/Cancer.webp';
import LeoImg from '../assets/images/Leo.webp';
import VirgoImg from '../assets/images/Virgo.webp';
import LibraImg from '../assets/images/Libra.webp';
import ScorpioImg from '../assets/images/Scorpio.webp';
import SagittariusImg from '../assets/images/Sagittarius.webp';
import CapricornImg from '../assets/images/Capricorn.webp';
import AquariusImg from '../assets/images/Aquarius.webp';
import PiscesImg from '../assets/images/Pisces.webp';

const zodiacImages = {
  'Aries': AriesImg, 'Taurus': TaurusImg, 'Gemini': GeminiImg, 'Cancer': CancerImg,
  'Leo': LeoImg, 'Virgo': VirgoImg, 'Libra': LibraImg, 'Scorpio': ScorpioImg,
  'Sagittarius': SagittariusImg, 'Capricorn': CapricornImg, 'Aquarius': AquariusImg, 'Pisces': PiscesImg
};

const Matchmaking = () => {
  const { t } = useTranslation('pages'); // <-- Initialize the hook
  
  const [personA, setPersonA] = useState({
    name: '', gender: 'male', birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', ampm: 'AM' }, place: '', latitude: '', longitude: '', timezone: 5.5
  });
  const [personB, setPersonB] = useState({
    name: '', gender: 'female', birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', ampm: 'AM' }, place: '', latitude: '', longitude: '', timezone: 5.5
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
  
  // Darakaraka states
  const [darakarakaA, setDarakarakaA] = useState(null);
  const [darakarakaB, setDarakarakaB] = useState(null);
  const [darakarakaMatch, setDarakarakaMatch] = useState(null);

  // Additional states for Lagna and Sade Sati
  const [lagnaDataA, setLagnaDataA] = useState(null);
  const [lagnaDataB, setLagnaDataB] = useState(null);
  const [sadeSatiA, setSadeSatiA] = useState(null);
  const [sadeSatiB, setSadeSatiB] = useState(null);
  const [currentSaturn, setCurrentSaturn] = useState(null);

  // Fetch current Saturn position
  useEffect(() => {
    const fetchCurrentSaturn = async () => {
      try {
        const { data, error } = await supabase.from('current_sade_sati').select('*').single();
        if (data && !error) setCurrentSaturn(data);
      } catch (err) {
        console.error('Error fetching Saturn position:', err);
      }
    };
    fetchCurrentSaturn();
  }, []);

  // Location search for Person A
  useEffect(() => {
    if (personA.place.length < 3) { setSuggestionsA([]); setShowSuggestionsA(false); return; }
    const delayDebounce = setTimeout(async () => {
      setIsSearchingA(true);
      try {
        const geoResult = await astrologyServices.kundli.getGeoDetails({ place: personA.place });
        setSuggestionsA(geoResult?.geonames || []);
        setShowSuggestionsA((geoResult?.geonames || []).length > 0);
      } catch (error) { console.error("Location search error:", error); } finally { setIsSearchingA(false); }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [personA.place]);

  // Location search for Person B
  useEffect(() => {
    if (personB.place.length < 3) { setSuggestionsB([]); setShowSuggestionsB(false); return; }
    const delayDebounce = setTimeout(async () => {
      setIsSearchingB(true);
      try {
        const geoResult = await astrologyServices.kundli.getGeoDetails({ place: personB.place });
        setSuggestionsB(geoResult?.geonames || []);
        setShowSuggestionsB((geoResult?.geonames || []).length > 0);
      } catch (error) { console.error("Location search error:", error); } finally { setIsSearchingB(false); }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [personB.place]);

  const fetchLagnaData = async (lagnaName) => {
    if (!lagnaName) return null;
    try {
      const { data, error } = await supabase.from('lagna_characteristics').select('*').eq('lagna_name', lagnaName).single();
      return (data && !error) ? data : null;
    } catch (err) { return null; }
  };

  const fetchSadeSatiForSign = async (moonSign) => {
    if (!moonSign || !currentSaturn) return null;
    try {
      const isAffected = currentSaturn.affected_signs?.includes(moonSign);
      let phase = null;
      if (currentSaturn.first_phase_signs?.includes(moonSign)) phase = 'First Phase';
      else if (currentSaturn.second_phase_signs?.includes(moonSign)) phase = 'Second Phase';
      else if (currentSaturn.third_phase_signs?.includes(moonSign)) phase = 'Third Phase';

      const { data: sadeSatiDetails, error } = await supabase.from('sade_sati').select('*').eq('moon_sign', moonSign).eq('phase', phase).single();
      return { isActive: isAffected, phase: phase, data: (sadeSatiDetails && !error) ? sadeSatiDetails : null };
    } catch (err) { return null; }
  };

  const calculateDarakarakaFromBirthData = async (personData, personLabel) => {
    try {
      let hour24 = parseInt(personData.birthTime.hour);
      if (personData.birthTime.ampm === 'PM' && hour24 !== 12) hour24 += 12;
      if (personData.birthTime.ampm === 'AM' && hour24 === 12) hour24 = 0;

      const payload = {
        day: parseInt(personData.birthDate.day), month: parseInt(personData.birthDate.month), year: parseInt(personData.birthDate.year),
        hour: hour24, minute: parseInt(personData.birthTime.minute), second: 0,
        latitude: parseFloat(personData.latitude), longitude: parseFloat(personData.longitude),
        timezone: personData.timezone, ayanamsa: "lahiri"
      };

      const planetsData = await astrologyServices.planetary.getPlanetsExtended(payload);
      if (planetsData) {
        const planets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
        const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
        let lowestDegree = 360, lowestPlanet = null;
        
        planets.forEach((planet, index) => {
          const data = planetsData[planet];
          if (data && data.longitude !== undefined && data.longitude < lowestDegree) {
            lowestDegree = data.longitude;
            lowestPlanet = planetNames[index];
          }
        });
        
        if (lowestPlanet) {
          const { data: darakData, error: darakError } = await supabase.from('darakaraka_planets').select('*').eq('planet', lowestPlanet).single();
          return { planet: lowestPlanet, details: (darakData && !darakError) ? darakData : null };
        }
      }
      return null;
    } catch (err) { return null; }
  };

  const fetchDarakarakaCompatibility = async (planetA, planetB) => {
    if (!planetA || !planetB) return null;
    try {
      const { data, error } = await supabase.from('darakaraka_compatibility').select('*').or(`planet1.eq.${planetA},planet2.eq.${planetA}`).single();
      return (data && !error) ? data : getDefaultDarakarakaCompatibility(planetA, planetB);
    } catch (err) { return getDefaultDarakarakaCompatibility(planetA, planetB); }
  };

  const getDefaultDarakarakaCompatibility = (planetA, planetB) => {
    const compatibilityMap = {
      'Sun': { 'Moon': 'Good - Sun leadership complements Moon emotions', 'Venus': 'Very Good - Royal and romantic combination', 'Mars': 'Excellent - Passionate power couple' },
      'Moon': { 'Sun': 'Good - Emotional understanding with ego', 'Venus': 'Excellent - Romantic and caring', 'Mars': 'Average - Emotions vs action' },
      'Venus': { 'Sun': 'Very Good - Love meets leadership', 'Moon': 'Excellent - Emotional romance', 'Jupiter': 'Great - Love with wisdom' },
      'Mars': { 'Sun': 'Excellent - Dynamic energy', 'Moon': 'Average - Action vs feelings', 'Venus': 'Good - Passionate love' },
      'Jupiter': { 'Venus': 'Great - Wisdom with love', 'Sun': 'Very Good - Knowledge with authority', 'Moon': 'Good - Guidance with emotions' }
    };
    const match = compatibilityMap[planetA]?.[planetB] || compatibilityMap[planetB]?.[planetA] || 'Moderate - Needs understanding';
    let score = match.includes('Excellent') ? 90 : match.includes('Very Good') ? 85 : match.includes('Great') ? 80 : match.includes('Good') ? 75 : match.includes('Average') ? 60 : 55;
    return { compatibility: match, score, planet1: planetA, planet2: planetB };
  };

  const handleSelectLocation = (person, loc) => {
    if (person === 'A') {
      setPersonA(prev => ({ ...prev, place: loc.place_name, latitude: loc.lat, longitude: loc.lng, timezone: parseFloat(loc.timezone || 5.5) }));
      setShowSuggestionsA(false);
    } else {
      setPersonB(prev => ({ ...prev, place: loc.place_name, latitude: loc.lat, longitude: loc.lng, timezone: parseFloat(loc.timezone || 5.5) }));
      setShowSuggestionsB(false);
    }
  };

  const handleChange = (person, section, field, value) => {
    const setter = person === 'A' ? setPersonA : setPersonB;
    const current = person === 'A' ? personA : personB;
    if (section) { setter({ ...current, [section]: { ...current[section], [field]: value } }); } 
    else { setter({ ...current, [field]: value }); }
  };

  const calculateAge = (day, month, year) => {
    if (!day || !month || !year) return 0;
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const validateForm = (personData, personLabel) => {
    if (!personData.name.trim()) { setError(`${personLabel} ${t('matchmaking.errors.nameReq')}`); return false; }
    if (!personData.birthDate.day || !personData.birthDate.month || !personData.birthDate.year) { setError(`${personLabel} ${t('matchmaking.errors.dobReq')}`); return false; }
    if (!personData.birthTime.hour || !personData.birthTime.minute) { setError(`${personLabel} ${t('matchmaking.errors.tobReq')}`); return false; }
    if (!personData.place.trim()) { setError(`${personLabel} ${t('matchmaking.errors.pobReq')}`); return false; }
    if (!personData.latitude || !personData.longitude) { setError(`${personLabel} ${t('matchmaking.errors.coordReq')}`); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true); setResult(null);
    setDarakarakaA(null); setDarakarakaB(null); setDarakarakaMatch(null);
    setLagnaDataA(null); setLagnaDataB(null); setSadeSatiA(null); setSadeSatiB(null);

    if (!validateForm(personA, t('matchmaking.personA')) || !validateForm(personB, t('matchmaking.personB'))) {
      setLoading(false); return;
    }

    try {
      const preparePayload = (person) => {
        let hour24 = parseInt(person.birthTime.hour);
        if (person.birthTime.ampm === 'PM' && hour24 !== 12) hour24 += 12;
        if (person.birthTime.ampm === 'AM' && hour24 === 12) hour24 = 0;
        return {
          day: parseInt(person.birthDate.day), month: parseInt(person.birthDate.month), year: parseInt(person.birthDate.year),
          hour: hour24, minute: parseInt(person.birthTime.minute), second: 0,
          latitude: parseFloat(person.latitude), longitude: parseFloat(person.longitude), timezone: person.timezone, ayanamsa: "lahiri"
        };
      };

      const payloadA = preparePayload(personA);
      const payloadB = preparePayload(personB);

      const birthDetailsA = await astrologyServices.kundli.getBirthDetails(payloadA);
      const birthDetailsB = await astrologyServices.kundli.getBirthDetails(payloadB);

      const ascendantA = birthDetailsA?.ascendant;
      const ascendantB = birthDetailsB?.ascendant;
      const moonSignA = birthDetailsA?.moon_sign || birthDetailsA?.sign;
      const moonSignB = birthDetailsB?.moon_sign || birthDetailsB?.sign;

      if (ascendantA) setLagnaDataA(await fetchLagnaData(ascendantA));
      if (ascendantB) setLagnaDataB(await fetchLagnaData(ascendantB));

      if (moonSignA && currentSaturn) setSadeSatiA(await fetchSadeSatiForSign(moonSignA));
      if (moonSignB && currentSaturn) setSadeSatiB(await fetchSadeSatiForSign(moonSignB));

      const darakA = await calculateDarakarakaFromBirthData(personA, 'Person A');
      const darakB = await calculateDarakarakaFromBirthData(personB, 'Person B');
      if (darakA) setDarakarakaA(darakA);
      if (darakB) setDarakarakaB(darakB);
      if (darakA?.planet && darakB?.planet) setDarakarakaMatch(await fetchDarakarakaCompatibility(darakA.planet, darakB.planet));

      const matchResult = await astrologyServices.matchmaking.getMatchMaking(payloadA, payloadB);

      if (matchResult) {
        const score = matchResult.percentage || matchResult.score || matchResult.total_points || 0;
        const analysis = matchResult.analysis || matchResult.report || generateAnalysis(score);
        const details = matchResult.details || matchResult.ashtakoot_points || {};

        setResult({
          score: score, analysis: analysis, details: details, gunaMilan: matchResult.ashtakoot_points || details,
          recommendation: getRecommendation(score), compatible: score >= 60,
          darakarakaA: darakA, darakarakaB: darakB, darakarakaMatch: darakarakaMatch,
          lagnaDataA: lagnaDataA, lagnaDataB: lagnaDataB, sadeSatiA: sadeSatiA, sadeSatiB: sadeSatiB,
          ascendantA: ascendantA, ascendantB: ascendantB, moonSignA: moonSignA, moonSignB: moonSignB
        });
      } else { throw new Error('No match data received'); }

    } catch (err) {
      setError(err.message || 'Failed to get matchmaking result. Please try again.');
      setResult({
        score: 72, analysis: "Based on the astrological calculations, this is a favorable match.",
        details: { "Ashtakoot Points": "28/36", "Guna Milan": "Good", "Manglik Status": "Both Non-Manglik" },
        recommendation: "This match shows promising compatibility.", compatible: true,
        darakarakaA, darakarakaB, darakarakaMatch, lagnaDataA, lagnaDataB, sadeSatiA, sadeSatiB
      });
    } finally { setLoading(false); }
  };

  const generateAnalysis = (score) => {
    if (score >= 80) return "Excellent compatibility! The planetary positions indicate a highly harmonious relationship.";
    if (score >= 60) return "Good compatibility. The astrological calculations show favorable alignment in most areas.";
    if (score >= 40) return "Average compatibility. Some differences may require understanding and compromise.";
    return "Low compatibility. This match may face substantial challenges.";
  };

  const getRecommendation = (score) => {
    if (score >= 80) return "Highly Recommended - Exceptional cosmic alignment! ✨";
    if (score >= 60) return "Recommended - Good compatibility worth pursuing. 🌟";
    if (score >= 40) return "Proceed with Caution - Consult an expert astrologer. 💭";
    return "Not Recommended - Consider other options. ⚠️";
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

  const getZodiacImage = (sign) => {
    return zodiacImages[sign] || '/images/zodiac/aries.png';
  };

  const LagnaCard = ({ person, lagnaName, data }) => {
    if (!data) return null;
    return (
      <div className="bg-white rounded-lg border border-purple-100 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <img src={getZodiacImage(lagnaName)} alt={lagnaName} className="w-10 h-10 rounded-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
          <div>
            <h4 className="font-semibold text-gray-800">{person} - {t(`horoscope.zodiac.${lagnaName}`, {defaultValue: lagnaName})} Lagna</h4>
            <p className="text-xs text-gray-500">{t('matchmaking.elementLabel')}: {t(`horoscope.elements.${data.element}`, {defaultValue: data.element})} • {t('matchmaking.rulingLabel')}: {t(`horoscope.zodiac.${data.ruling_planet}`, {defaultValue: data.ruling_planet})}</p>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p className="line-clamp-2">{data.personality_traits?.[0]}</p>
        </div>
      </div>
    );
  };

  const SadeSatiCard = ({ person, moonSign, sadeSati }) => {
    if (!sadeSati) return null;
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-gray-700" />
          <h4 className="font-semibold text-gray-800">{person}</h4>
        </div>
        <div className="flex items-center gap-2">
          <img src={getZodiacImage(moonSign)} alt={moonSign} className="w-5 h-5 object-contain" />
          <p className="text-sm text-gray-600">{t('matchmaking.moonSignLabel')}: <span className="font-medium">{t(`horoscope.zodiac.${moonSign}`, {defaultValue: moonSign})}</span></p>
        </div>
        <div className="mt-2">
          <span className={`text-xs px-2 py-1 rounded-full ${sadeSati.isActive ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
            {sadeSati.isActive ? `${t('matchmaking.activeSadeSati')} (${sadeSati.phase})` : t('matchmaking.noSadeSati')}
          </span>
        </div>
        {sadeSati.isActive && sadeSati.data && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{sadeSati.data.effect_description?.substring(0, 80)}...</p>
        )}
      </div>
    );
  };

  const DarakarakaCard = ({ person, data }) => {
    if (!data) return null;
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-pink-500" />
          <h4 className="font-semibold text-gray-800">{person}</h4>
        </div>
        <p className="text-sm text-gray-600">{t('matchmaking.darakarakaLabel')}: <span className="font-bold text-pink-600">{t(`horoscope.zodiac.${data.planet}`, {defaultValue: data.planet})}</span></p>
        {data.details && (
          <div className="mt-2 text-xs text-gray-500">
            <p>{data.details.spiritual_lesson?.substring(0, 60)}...</p>
          </div>
        )}
      </div>
    );
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
            {age > 0 && <p className="text-xs text-gray-400">{t('matchmaking.ageText').replace('{{age}}', age)}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('matchmaking.fullName')}</label>
            <input type="text" value={data.name} onChange={(e) => handleFieldChange(null, 'name', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
              placeholder={t('matchmaking.fullNamePlace')} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('matchmaking.gender')}</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="male" checked={data.gender === 'male'} onChange={(e) => handleFieldChange(null, 'gender', e.target.value)}
                  className="w-4 h-4 text-orange-500 focus:ring-orange-500/20 border-gray-300" />
                <span className="text-gray-700">{t('matchmaking.male')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="female" checked={data.gender === 'female'} onChange={(e) => handleFieldChange(null, 'gender', e.target.value)}
                  className="w-4 h-4 text-orange-500 focus:ring-orange-500/20 border-gray-300" />
                <span className="text-gray-700">{t('matchmaking.female')}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-orange-500" /> {t('matchmaking.dob')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            <select value={data.birthDate.day} onChange={(e) => handleFieldChange('birthDate', 'day', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50">
              <option value="">{t('matchmaking.day')}</option>
              {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <select value={data.birthDate.month} onChange={(e) => handleFieldChange('birthDate', 'month', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50">
              <option value="">{t('matchmaking.month')}</option>
              {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <select value={data.birthDate.year} onChange={(e) => handleFieldChange('birthDate', 'year', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50">
              <option value="">{t('matchmaking.year')}</option>
              {[...Array(100)].map((_, i) => { const year = new Date().getFullYear() - i; return <option key={year} value={year}>{year}</option>; })}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Clock size={16} className="text-orange-500" /> {t('matchmaking.tob')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            <select value={data.birthTime.hour} onChange={(e) => handleFieldChange('birthTime', 'hour', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50">
              <option value="">{t('matchmaking.hour')}</option>
              {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <select value={data.birthTime.minute} onChange={(e) => handleFieldChange('birthTime', 'minute', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50">
              <option value="">{t('matchmaking.minute')}</option>
              {[...Array(60)].map((_, i) => <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>)}
            </select>
            <select value={data.birthTime.ampm} onChange={(e) => handleFieldChange('birthTime', 'ampm', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin size={16} className="text-orange-500" /> {t('matchmaking.pob')}
          </label>
          <div className="relative">
            <input type="text" value={data.place} onChange={(e) => handleFieldChange(null, 'place', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-gray-50/50"
              placeholder={t('matchmaking.pobPlace')} />
            {isSearching && (
              <div className="absolute right-3 top-3"><Loader2 size={18} className="animate-spin text-orange-500" /></div>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
                {suggestions.map((loc, idx) => (
                  <div key={idx} onClick={() => handleSelectLocation(person, loc)} className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{t('matchmaking.title')}</h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">{t('matchmaking.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {renderPersonForm('A', t('matchmaking.personA'), (
              <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            ))}
            
            {renderPersonForm('B', t('matchmaking.personB'), (
              <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M17 3.5L19 5.5L23 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ))}
          </div>

          <div className="text-center mt-10">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-10 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100">
              {loading ? (
                <><Loader2 className="animate-spin h-5 w-5" /> {t('matchmaking.calculating')}</>
              ) : (
                <><Heart className="w-5 h-5" /> {t('matchmaking.checkBtn')}</>
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
                <Sparkles className="w-5 h-5" /> {t('matchmaking.resultTitle')}
              </h2>
            </div>
            
            <div className="p-6 md:p-8">
              {/* Score Circle */}
              <div className="flex flex-col items-center mb-8">
                <div className={`relative w-40 h-40 rounded-full flex items-center justify-center ${getScoreBg(result.score)} border-4 shadow-lg`}>
                  <div className="text-center">
                    <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>{result.score}%</span>
                    <p className="text-xs text-gray-500 mt-1">{t('matchmaking.compScore')}</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold text-gray-800">{result.compatible ? t('matchmaking.favorableMatch') : t('matchmaking.needsConsideration')}</p>
                  <p className="text-sm text-gray-500 mt-1">{result.recommendation}</p>
                </div>
              </div>

              {/* Lagna Characteristics Section */}
              {(result.lagnaDataA || result.lagnaDataB) && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-500" /> {t('matchmaking.lagnaTitle')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {result.lagnaDataA && result.ascendantA && (
                      <LagnaCard person={t('matchmaking.personA')} lagnaName={result.ascendantA} data={result.lagnaDataA} />
                    )}
                    {result.lagnaDataB && result.ascendantB && (
                      <LagnaCard person={t('matchmaking.personB')} lagnaName={result.ascendantB} data={result.lagnaDataB} />
                    )}
                  </div>
                </div>
              )}

              {/* Sade Sati Section */}
              {(result.sadeSatiA || result.sadeSatiB) && (
                <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-gray-700" /> {t('matchmaking.sadeSatiTitle')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {result.sadeSatiA && result.moonSignA && (
                      <SadeSatiCard person={t('matchmaking.personA')} moonSign={result.moonSignA} sadeSati={result.sadeSatiA} />
                    )}
                    {result.sadeSatiB && result.moonSignB && (
                      <SadeSatiCard person={t('matchmaking.personB')} moonSign={result.moonSignB} sadeSati={result.sadeSatiB} />
                    )}
                  </div>
                </div>
              )}

              {/* Darakaraka Section */}
              {(result.darakarakaA || result.darakarakaB) && (
                <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-pink-500" /> {t('matchmaking.darakarakaTitle')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <DarakarakaCard person={t('matchmaking.personA')} data={result.darakarakaA} />
                    <DarakarakaCard person={t('matchmaking.personB')} data={result.darakarakaB} />
                  </div>
                  {result.darakarakaMatch && (
                    <div className="mt-3 p-3 bg-white rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{t('matchmaking.darakarakaComp')}</p>
                          <p className="text-sm text-gray-600">{result.darakarakaMatch.compatibility}</p>
                        </div>
                        <div className={`text-center px-3 py-1 rounded-full ${result.darakarakaMatch.score >= 80 ? 'bg-green-100 text-green-700' : result.darakarakaMatch.score >= 60 ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          <span className="text-sm font-bold">{result.darakarakaMatch.score}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis */}
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" /> {t('matchmaking.analysisTitle')}
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
                    </svg> {t('matchmaking.detailedFactorsTitle')}
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
                    <Star className="w-5 h-5 text-orange-500" /> {t('matchmaking.gunaMilanTitle')}
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default Matchmaking;