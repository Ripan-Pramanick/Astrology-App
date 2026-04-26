// client/src/pages/KundliReportPage.jsx
import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { KundliReportGenerator } from '../components/KundliReportGenerator';
import { Loader2, AlertCircle, RefreshCw, Info, Sparkles, MapPin, Calendar, Clock, Moon, Sun, Eye, Heart, Shield, Users, HeartHandshake, Star, TrendingUp, AlertTriangle } from 'lucide-react';
// import api from '../services/api';
import astrologyServices from '../services/astrologyApi.js';
import { supabase } from '../lib/supabase.js';

const KundliReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('idle');
  const [chartData, setChartData] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [moonDrishti, setMoonDrishti] = useState(null);
  const [sunDrishti, setSunDrishti] = useState(null);
  const [darakaraka, setDarakaraka] = useState(null);
  const [compatibilityList, setCompatibilityList] = useState([]);
  const [partnerMatch, setPartnerMatch] = useState(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerSign, setPartnerSign] = useState('');
  
  // New states for Lagna and Sade Sati
  const [lagnaData, setLagnaData] = useState(null);
  const [sadeSatiData, setSadeSatiData] = useState(null);
  const [sadeSatiStatus, setSadeSatiStatus] = useState(null);
  const [currentSaturn, setCurrentSaturn] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPremium = user.subscription === 'premium';

  // State for form inputs
  const [birthDetails, setBirthDetails] = useState({
    name: user.name || "Client Name",
    dob: user.dob || "1990-03-15",
    tob: user.tob || "10:30:00",
    pob: user.pob || "New Delhi, India",
    gender: user.gender || "Male",
    latitude: "28.6139",
    longitude: "77.2090"
  });

  // Fetch current Saturn position
  const fetchCurrentSaturn = async () => {
    try {
      const { data, error } = await supabase
        .from('current_sade_sati')
        .select('*')
        .single();
      
      if (data && !error) {
        setCurrentSaturn(data);
      }
    } catch (err) {
      console.error('Error fetching Saturn position:', err);
    }
  };

  // Fetch Lagna data from Supabase
  const fetchLagnaData = async (lagnaName) => {
    if (!lagnaName) return;

    try {
      const { data, error } = await supabase
        .from('lagna_characteristics')
        .select('*')
        .eq('lagna_name', lagnaName)
        .single();

      if (data && !error) {
        setLagnaData(data);
      }
    } catch (err) {
      console.error('Error fetching lagna data:', err);
    }
  };

  // Fetch Sade Sati data for moon sign
  const fetchSadeSatiForSign = async (moonSign) => {
    if (!moonSign || !currentSaturn) return;

    try {
      const isAffected = currentSaturn.affected_signs?.includes(moonSign);
      
      let phase = null;
      if (currentSaturn.first_phase_signs?.includes(moonSign)) phase = 'First Phase';
      else if (currentSaturn.second_phase_signs?.includes(moonSign)) phase = 'Second Phase';
      else if (currentSaturn.third_phase_signs?.includes(moonSign)) phase = 'Third Phase';

      const { data: sadeSatiDetails, error } = await supabase
        .from('sade_sati')
        .select('*')
        .eq('moon_sign', moonSign)
        .eq('phase', phase)
        .single();

      if (sadeSatiDetails && !error) {
        setSadeSatiData(sadeSatiDetails);
        setSadeSatiStatus({
          isActive: isAffected,
          phase: phase,
          moonSign: moonSign
        });
      } else {
        setSadeSatiStatus({
          isActive: isAffected,
          phase: phase,
          moonSign: moonSign,
          data: null
        });
      }
    } catch (err) {
      console.error('Error fetching Sade Sati:', err);
    }
  };

  // Fetch Drishti data from Supabase
  const fetchDrishtiData = async (ascendant) => {
    if (!ascendant) return;
    
    try {
      const { data: moonData, error: moonError } = await supabase
        .from('planet_drishti')
        .select('*')
        .eq('planet', 'Moon')
        .eq('base_sign', ascendant)
        .single();
      
      if (moonData && !moonError) {
        setMoonDrishti(moonData);
      }
      
      const { data: sunData, error: sunError } = await supabase
        .from('planet_drishti')
        .select('*')
        .eq('planet', 'Sun')
        .eq('base_sign', ascendant)
        .single();
      
      if (sunData && !sunError) {
        setSunDrishti(sunData);
      }
      
    } catch (err) {
      console.error('Error fetching drishti data:', err);
    }
  };

  // Fetch Compatibility Data from Supabase
  const fetchCompatibilityData = async (sign) => {
    if (!sign) return;
    
    try {
      const { data, error } = await supabase
        .from('compatibility_scores')
        .select('*')
        .or(`sign1.eq.${sign},sign2.eq.${sign}`)
        .order('score', { ascending: false });
      
      if (data && !error) {
        setCompatibilityList(data);
      }
    } catch (err) {
      console.error('Error fetching compatibility data:', err);
    }
  };

  // Fetch Partner Compatibility
  const fetchPartnerCompatibility = async (userSign, partnerSign) => {
    if (!userSign || !partnerSign) return null;
    
    try {
      const { data, error } = await supabase
        .from('compatibility_scores')
        .select('*')
        .or(`and(sign1.eq.${userSign},sign2.eq.${partnerSign}),and(sign1.eq.${partnerSign},sign2.eq.${userSign})`)
        .single();
      
      if (data && !error) {
        return data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching partner compatibility:', err);
      return null;
    }
  };

  // Handle Partner Check
  const handlePartnerCheck = async () => {
    if (!partnerSign || !chartData?.lagna) {
      alert('Please select a zodiac sign');
      return;
    }
    
    const result = await fetchPartnerCompatibility(chartData.lagna, partnerSign);
    setPartnerMatch(result);
  };

  // Fetch Darakaraka data from Supabase
  const fetchDarakarakaData = async (planetName) => {
    if (!planetName) return;
    
    try {
      const { data, error } = await supabase
        .from('darakaraka_planets')
        .select('*')
        .eq('planet', planetName)
        .single();
      
      if (data && !error) {
        setDarakaraka(data);
      }
    } catch (err) {
      console.error('Error fetching darakaraka data:', err);
    }
  };

  // Calculate Darakaraka planet from planets data (lowest degree)
  const calculateDarakaraka = (planetsData) => {
    const planets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
    const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    
    let lowestDegree = 360;
    let lowestPlanet = null;
    
    planets.forEach((planet, index) => {
      const data = planetsData[planet];
      if (data && data.longitude !== undefined) {
        const degree = data.longitude;
        if (degree < lowestDegree) {
          lowestDegree = degree;
          lowestPlanet = planetNames[index];
        }
      }
    });
    
    return lowestPlanet;
  };

  // Fetch data from AstrologyAPI
  const fetchAstrologyData = async () => {
    setLoading(true);
    setError(null);
    setApiStatus('loading');
    
    try {
      const [year, month, day] = birthDetails.dob.split('-');
      const [hour, minute] = birthDetails.tob.split(':');
      
      const astroPayload = {
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year),
        hour: parseInt(hour),
        minute: parseInt(minute),
        second: 0,
        latitude: parseFloat(birthDetails.latitude),
        longitude: parseFloat(birthDetails.longitude),
        timezone: 5.5,
        ayanamsa: "lahiri"
      };

      console.log("🌟 Fetching birth details from AstrologyAPI...");
      const birthDetailsData = await astrologyServices.kundli.getBirthDetails(astroPayload);
      
      console.log("🪐 Fetching planet positions from AstrologyAPI...");
      const planetsData = await astrologyServices.planetary.getPlanetsExtended(astroPayload);
      
      console.log("📊 Fetching yogas from AstrologyAPI...");
      const yogasData = await astrologyServices.dosha.getYogas(astroPayload);
      
      console.log("⏰ Fetching dasha periods from AstrologyAPI...");
      const dashaData = await astrologyServices.dasha.getCurrentVDasha(astroPayload);

      if (birthDetailsData && planetsData) {
        const ascendant = birthDetailsData?.ascendant || getAscendantFromDob(birthDetails.dob, birthDetails.tob);
        const moonSign = birthDetailsData?.moon_sign || birthDetailsData?.sign || getMoonSignFromDob(birthDetails.dob);
        
        // Fetch all data
        await fetchCurrentSaturn();
        await fetchDrishtiData(ascendant);
        await fetchCompatibilityData(ascendant);
        await fetchLagnaData(ascendant);
        
        const darakarakaPlanet = calculateDarakaraka(planetsData);
        if (darakarakaPlanet) {
          await fetchDarakarakaData(darakarakaPlanet);
        }
        
        // Fetch Sade Sati after Saturn is loaded
        if (moonSign && currentSaturn) {
          await fetchSadeSatiForSign(moonSign);
        } else {
          // Wait a bit and try again
          setTimeout(async () => {
            if (moonSign) {
              await fetchSadeSatiForSign(moonSign);
            }
          }, 500);
        }
        
        const transformedData = {
          lagna: ascendant,
          rasi: planetsData?.moon?.sign || getMoonSignFromDob(birthDetails.dob),
          nakshatra: planetsData?.moon?.nakshatra || getNakshatraFromDob(birthDetails.dob),
          nakshatraPada: planetsData?.moon?.nakshatra_pada || "2",
          sunSign: planetsData?.sun?.sign || getSunSign(birthDetails.dob),
          moonSign: planetsData?.moon?.sign || getMoonSignFromDob(birthDetails.dob),
          planets: transformPlanetsData(planetsData, birthDetails.dob),
          houses: transformHousesData(birthDetailsData),
          yogas: yogasData?.map(y => y.name) || detectYogas(birthDetails.dob),
          dasha: transformDashaData(dashaData) || calculateDashaPeriods(birthDetails.dob),
          moonDrishti: moonDrishti,
          sunDrishti: sunDrishti,
          darakaraka: darakarakaPlanet,
          darakarakaData: darakaraka,
          lagnaData: lagnaData,
          sadeSatiData: sadeSatiData,
          sadeSatiStatus: sadeSatiStatus
        };
        
        setChartData(transformedData);
        setRealTimeData({ birthDetails: birthDetailsData, planets: planetsData });
        setApiStatus('success');
        
        localStorage.setItem('kundliData', JSON.stringify({
          userDetails: {
            name: birthDetails.name,
            gender: birthDetails.gender,
            dob: birthDetails.dob,
            time: birthDetails.tob,
            place: birthDetails.pob
          },
          basic: birthDetailsData,
          planets: planetsData,
          drishti: { moonDrishti, sunDrishti },
          darakaraka: { planet: darakarakaPlanet, data: darakaraka },
          lagna: ascendant,
          moonSign: moonSign,
          sadeSatiStatus: sadeSatiStatus
        }));
      } else {
        throw new Error('Failed to fetch astrological data');
      }
      
    } catch (err) {
      console.error("Error fetching from AstrologyAPI:", err);
      const ascendant = getAscendantFromDob(birthDetails.dob, birthDetails.tob);
      await fetchDrishtiData(ascendant);
      await fetchCompatibilityData(ascendant);
      await fetchLagnaData(ascendant);
      await fetchCurrentSaturn();
      
      setChartData(getLocalChartData(birthDetails));
      setApiStatus('fallback');
      setError("Using local calculations. For accurate results, please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Transform planets data from API
  const transformPlanetsData = (planetsData, dob) => {
    const planets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
    const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    
    return planets.map((planet, index) => {
      const data = planetsData[planet] || {};
      return {
        name: planetNames[index],
        sign: data.sign || signs[index % 12],
        house: data.house || (index % 12) + 1,
        degree: data.longitude ? `${Math.floor(data.longitude)}° ${Math.floor((data.longitude % 1) * 60)}'` : '0° 00\'',
        lord: getPlanetLord(data.sign || signs[index % 12]),
        nakshatra: data.nakshatra || 'Unknown',
        pada: data.nakshatra_pada || 1,
        longitude: data.longitude || 0
      };
    });
  };

  const transformHousesData = (birthDetailsData) => {
    const houses = [];
    for (let i = 1; i <= 12; i++) {
      houses.push({
        number: i,
        sign: birthDetailsData?.[`house_${i}`]?.sign || 'Unknown',
        cusp: birthDetailsData?.[`house_${i}`]?.cusp || '0° 00\'',
        lord: getPlanetLord(birthDetailsData?.[`house_${i}`]?.sign)
      });
    }
    return houses;
  };

  const transformDashaData = (dashaData) => {
    if (!dashaData?.mahadasha) return null;
    return dashaData.mahadasha.map(d => ({
      planet: d.planet,
      years: d.years,
      start: d.start_date,
      end: d.end_date,
      status: d.status || 'active'
    }));
  };

  const getLocalChartData = (details) => {
    const ascendant = getAscendantFromDob(details.dob, details.tob);
    return {
      lagna: ascendant,
      rasi: getMoonSignFromDob(details.dob),
      nakshatra: getNakshatraFromDob(details.dob),
      nakshatraPada: "2",
      sunSign: getSunSign(details.dob),
      moonSign: getMoonSignFromDob(details.dob),
      planets: generatePlanetaryPositions(details.dob),
      houses: generateHouseCusps(details.dob, details.tob),
      yogas: detectYogas(details.dob),
      dasha: calculateDashaPeriods(details.dob),
      moonDrishti: moonDrishti,
      sunDrishti: sunDrishti,
      darakaraka: "Venus",
      darakarakaData: darakaraka,
      lagnaData: lagnaData,
      sadeSatiStatus: sadeSatiStatus
    };
  };

  // Helper functions
  const getSunSign = (date) => {
    const signs = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];
    const dates = [20, 19, 20, 20, 20, 21, 21, 22, 21, 22, 21, 21];
    const [year, month, day] = date.split('-').map(Number);
    let index = month - 1;
    if (day < dates[index]) index = (index + 11) % 12;
    return signs[index];
  };

  const getMoonSignFromDob = (date) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const dayOfYear = getDayOfYear(new Date(date));
    return signs[dayOfYear % 12];
  };

  const getAscendantFromDob = (date, time) => {
    const hour = parseInt(time.split(':')[0]);
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[Math.floor(hour / 2) % 12];
  };

  const getNakshatraFromDob = (date) => {
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    const dayOfYear = getDayOfYear(new Date(date));
    return nakshatras[dayOfYear % 27];
  };

  const getDayOfYear = (date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 86400000;
    return Math.floor(diff / oneDay);
  };

  const getPlanetLord = (sign) => {
    const lords = {
      'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
      'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
      'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
    };
    return lords[sign] || 'Unknown';
  };

  const generatePlanetaryPositions = (dob) => {
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const dayOfYear = getDayOfYear(new Date(dob));
    
    return planets.map((planet, index) => ({
      name: planet,
      sign: signs[(index + dayOfYear) % 12],
      house: (index % 12) + 1,
      degree: `${Math.floor(Math.random() * 30)}° ${Math.floor(Math.random() * 60)}'`,
      lord: getPlanetLord(signs[(index + dayOfYear) % 12]),
      nakshatra: getNakshatraFromDob(dob),
      pada: "1",
      longitude: Math.random() * 360
    }));
  };

  const generateHouseCusps = (dob, tob) => {
    const houses = [];
    const ascendant = getAscendantFromDob(dob, tob);
    for (let i = 1; i <= 12; i++) {
      houses.push({
        number: i,
        sign: ascendant,
        cusp: `${Math.floor(Math.random() * 30)}° ${Math.floor(Math.random() * 60)}'`,
        lord: getPlanetLord(ascendant)
      });
    }
    return houses;
  };

  const detectYogas = (dob) => {
    const allYogas = ['Gaja Kesari', 'Lakshmi', 'Saraswati', 'Chandra Mangal', 'Ruchaka', 'Bhadra', 'Hamsa', 'Malavya'];
    const dayOfYear = getDayOfYear(new Date(dob));
    const numYogas = (dayOfYear % 4) + 1;
    return allYogas.slice(0, numYogas);
  };

  const calculateDashaPeriods = (dob) => {
    return [
      { planet: 'Ketu', years: 7, start: 'Birth' },
      { planet: 'Venus', years: 20, start: 'Age 7' },
      { planet: 'Sun', years: 6, start: 'Age 27' },
      { planet: 'Moon', years: 10, start: 'Age 33' },
      { planet: 'Mars', years: 7, start: 'Age 43' },
      { planet: 'Rahu', years: 18, start: 'Age 50' },
      { planet: 'Jupiter', years: 16, start: 'Age 68' },
      { planet: 'Saturn', years: 19, start: 'Age 84' },
      { planet: 'Mercury', years: 17, start: 'Age 103' }
    ];
  };

  const handleInputChange = (e) => {
    setBirthDetails({ ...birthDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchAstrologyData();
  }, []);

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  // Lagna Card Component
  const LagnaCard = ({ data }) => {
    if (!data) return null;

    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 text-white">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6" />
            <h3 className="font-bold text-lg">{data.lagna_name_bn} Lagna ({data.lagna_name})</h3>
          </div>
          <p className="text-purple-100 text-sm mt-1">Element: {data.element} • Ruling Planet: {data.ruling_planet_bn} ({data.ruling_planet})</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-600 font-semibold mb-2">✨ Personality Traits</p>
              <ul className="space-y-1">
                {data.personality_traits && data.personality_traits.slice(0, 4).map((trait, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500">✓</span> {trait}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs text-red-600 font-semibold mb-2">⚠️ Shadow Side</p>
              <ul className="space-y-1">
                {data.shadow_side && data.shadow_side.slice(0, 4).map((shadow, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-red-500">•</span> {shadow}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-3">
            <p className="text-xs text-amber-600 font-semibold mb-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Ideal Career Paths
            </p>
            <ul className="space-y-1">
              {data.career_paths && data.career_paths.slice(0, 4).map((career, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-amber-400">•</span> {career}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 font-semibold mb-2 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Life Affirmation
            </p>
            <p className="text-sm text-gray-700 italic">"{data.affirmation}"</p>
          </div>
        </div>
      </div>
    );
  };

  // Sade Sati Card Component
  const SadeSatiCard = ({ status, data }) => {
    if (!status) return null;

    return (
      <div className={`rounded-xl overflow-hidden border-2 ${status.isActive ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50' : 'border-gray-200 bg-gray-50'}`}>
        <div className={`p-4 ${status.isActive ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gray-600'} text-white`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            <h3 className="font-bold text-lg">
              {status.isActive ? '🔴 Sade Sati is Active' : '🟢 No Active Sade Sati'}
            </h3>
          </div>
          {status.isActive && (
            <p className="text-gray-300 text-sm mt-1">
              {status.phase} • Your Moon Sign: {status.moonSign}
            </p>
          )}
        </div>
        
        {data && status.isActive ? (
          <div className="p-5">
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">{data.effect_description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600 font-semibold mb-2">✨ Positive Aspects</p>
                <p className="text-sm text-gray-700">{data.positive_aspects}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-600 font-semibold mb-2">⚠️ Challenges</p>
                <p className="text-sm text-gray-700">{data.challenges}</p>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-600 font-semibold mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Spiritual Lesson
              </p>
              <p className="text-sm text-gray-700">{data.lesson}</p>
            </div>
            
            <div>
              <p className="text-xs text-orange-600 font-semibold mb-2 flex items-center gap-1">
                <Heart className="w-3 h-3" /> Remedies
              </p>
              <ul className="space-y-1">
                {data.remedies && data.remedies.slice(0, 4).map((remedy, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-orange-400">•</span> {remedy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-5 text-center">
            <p className="text-gray-500">Sade Sati is not currently active for your Moon Sign ({status.moonSign}).</p>
            <p className="text-gray-400 text-sm mt-2">This period brings important life lessons when active.</p>
          </div>
        )}
      </div>
    );
  };

  // Compatibility Card Component
  const CompatibilityCard = ({ compatibility }) => {
    const getScoreColor = (score) => {
      if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
      if (score >= 6) return 'text-orange-500 bg-orange-50 border-orange-200';
      if (score >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      return 'text-red-500 bg-red-50 border-red-200';
    };

    const otherSign = compatibility.sign1 === chartData?.lagna ? compatibility.sign2 : compatibility.sign1;
    
    return (
      <div className={`rounded-lg p-3 border ${getScoreColor(compatibility.score)}`}>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">{otherSign}</span>
            <div className="text-xs opacity-70 mt-0.5">{compatibility.relationship_type?.substring(0, 40)}...</div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold">{compatibility.score}/10</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 animate-pulse" size={24} />
          </div>
          <p className="text-gray-600 mt-4 font-medium">Consulting the cosmic records...</p>
          <p className="text-gray-400 text-sm mt-1">Fetching your personalized astrological data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* API Status Info */}
        {apiStatus === 'fallback' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <p className="text-yellow-800 font-medium">Using Local Astrology Calculations</p>
                <p className="text-yellow-700 text-sm mt-1">
                  {error || "We're using our internal calculations for accurate results."}
                  <a href="/upgrade" className="ml-2 text-orange-600 hover:underline">Upgrade for advanced features →</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {apiStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="text-green-600 mt-0.5" size={20} />
              <div>
                <p className="text-green-800 font-medium">✨ Vedic Astrology Data Fetched Successfully</p>
                <p className="text-green-700 text-sm mt-1">
                  Your personalized Kundli has been generated using authentic Vedic calculations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 LAGNA CHARACTERISTICS SECTION - NEW */}
        {lagnaData && chartData?.lagna && (
          <div className="mb-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                <Star className="w-6 h-6 text-purple-500" /> Your Ascendant: {chartData.lagna} ({lagnaData.lagna_name_bn}) Lagna
              </h2>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
              <p className="text-gray-500 text-sm mt-2">How the world perceives you and your natural approach to life</p>
            </div>
            <LagnaCard data={lagnaData} />
          </div>
        )}

        {/* 🌑 SADE SATI SECTION - NEW */}
        {sadeSatiStatus && (
          <div className="mb-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                <AlertCircle className="w-6 h-6 text-gray-700" /> Shani Sade Sati
              </h2>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-auto"></div>
              <p className="text-gray-500 text-sm mt-2">7.5 years of karmic growth and transformation</p>
            </div>
            <SadeSatiCard status={sadeSatiStatus} data={sadeSatiData} />
          </div>
        )}

        {/* Darakaraka Info Banner */}
        {darakaraka && (
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Heart className="text-pink-600 mt-0.5" size={20} />
              <div>
                <p className="text-pink-800 font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Darakaraka Planet: {darakaraka.planet}
                </p>
                <p className="text-pink-700 text-sm mt-1">
                  Your life partner's nature and relationship karma are influenced by {darakaraka.planet}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Partner Compatibility Check Section */}
        {chartData?.lagna && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <HeartHandshake className="text-purple-600 mt-0.5" size={20} />
                <div>
                  <p className="text-purple-800 font-medium">Check Compatibility with Your Partner</p>
                  <p className="text-purple-700 text-sm">Your Ascendant: <span className="font-bold">{chartData.lagna}</span></p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={partnerSign}
                  onChange={(e) => setPartnerSign(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-purple-200 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select partner's zodiac sign</option>
                  {zodiacSigns.map(sign => (
                    <option key={sign} value={sign}>{sign}</option>
                  ))}
                </select>
                <button
                  onClick={handlePartnerCheck}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" /> Check Compatibility
                </button>
              </div>
            </div>
            
            {/* Partner Match Result */}
            {partnerMatch && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-purple-100">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className={`text-center p-4 rounded-full w-32 h-32 flex flex-col items-center justify-center ${
                    partnerMatch.score >= 8 ? 'bg-green-100' :
                    partnerMatch.score >= 6 ? 'bg-orange-100' :
                    partnerMatch.score >= 4 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <span className="text-3xl font-bold">{partnerMatch.score}/10</span>
                    <p className="text-xs text-gray-500 mt-1">Compatibility Score</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {chartData.lagna} ✨ {partnerSign}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{partnerMatch.relationship_type}</p>
                    <p className="text-sm text-purple-600 mt-2">
                      <span className="font-medium">Remedy:</span> {partnerMatch.remedy}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Drishti Info Banner */}
        {(moonDrishti || sunDrishti) && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Eye className="text-purple-600 mt-0.5" size={20} />
              <div>
                <p className="text-purple-800 font-medium flex items-center gap-2">
                  <Moon className="w-4 h-4" /> Chandra Drishti & <Sun className="w-4 h-4" /> Surya Drishti
                </p>
                <p className="text-purple-700 text-sm mt-1">
                  Your chart analysis includes special planetary aspects (Drishti) from Moon and Sun
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Birth Details Form */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            Birth Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={birthDetails.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={birthDetails.dob}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time of Birth</label>
              <input
                type="time"
                name="tob"
                value={birthDetails.tob}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" /> Place of Birth
              </label>
              <input
                type="text"
                name="pob"
                value={birthDetails.pob}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={birthDetails.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchAstrologyData}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh Chart
              </button>
            </div>
          </div>
        </div>

        {/* Zodiac Compatibility Section */}
        {compatibilityList.length > 0 && chartData?.lagna && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <HeartHandshake className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800">Zodiac Compatibility</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              How your ascendant sign ({chartData.lagna}) connects with other zodiac signs
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {compatibilityList.map((comp, idx) => (
                <CompatibilityCard key={idx} compatibility={comp} />
              ))}
            </div>
          </div>
        )}

        {/* Report Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isPremium ? 'Premium Kundli Report (200+ Pages)' : 'Free Kundli Report (50+ Pages)'}
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            {isPremium 
              ? 'Complete analysis with all divisional charts, dashas, transits, and detailed remedies'
              : 'Basic analysis including planetary positions, ascendant details, and nakshatra analysis'}
          </p>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <PDFDownloadLink
              document={<KundliReportGenerator 
                clientType={isPremium ? 'premium' : 'free'} 
                birthDetails={birthDetails} 
                chartData={chartData}
                moonDrishti={moonDrishti}
                sunDrishti={sunDrishti}
                darakaraka={darakaraka}
                lagnaData={lagnaData}
                sadeSatiData={sadeSatiData}
                sadeSatiStatus={sadeSatiStatus}
              />}
              fileName={`kundli_report_${birthDetails.name.replace(/\s/g, '_')}.pdf`}
            >
              {({ loading: pdfLoading }) => (
                <button 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                  disabled={pdfLoading || !chartData}
                >
                  {pdfLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  {pdfLoading ? 'Generating PDF...' : 'Download Report'}
                </button>
              )}
            </PDFDownloadLink>
            
            {/* Darakaraka Badge */}
            {darakaraka && (
              <span className="flex items-center gap-1 text-xs bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full">
                <Heart className="w-3 h-3" /> Darakaraka: {darakaraka.planet}
              </span>
            )}
            
            {/* Drishti Badges */}
            {moonDrishti && (
              <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">
                <Moon className="w-3 h-3" /> Moon Drishti
              </span>
            )}
            {sunDrishti && (
              <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full">
                <Sun className="w-3 h-3" /> Sun Drishti
              </span>
            )}
            
            {/* Lagna Badge */}
            {lagnaData && (
              <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full">
                <Star className="w-3 h-3" /> {lagnaData.lagna_name_bn} Lagna
              </span>
            )}
          </div>
        </div>
        
        {/* PDF Viewer */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 h-[80vh]">
          {chartData ? (
            <PDFViewer width="100%" height="100%">
              <KundliReportGenerator 
                clientType={isPremium ? 'premium' : 'free'} 
                birthDetails={birthDetails} 
                chartData={chartData}
                moonDrishti={moonDrishti}
                sunDrishti={sunDrishti}
                darakaraka={darakaraka}
                lagnaData={lagnaData}
                sadeSatiData={sadeSatiData}
                sadeSatiStatus={sadeSatiStatus}
              />
            </PDFViewer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading your cosmic chart...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KundliReportPage;