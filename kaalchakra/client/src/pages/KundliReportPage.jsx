// client/src/pages/KundliReportPage.jsx
import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { KundliReportGenerator } from '../components/KundliReportGenerator';
import { Loader2, AlertCircle, RefreshCw, Info, Sparkles, MapPin, Calendar, Clock, Moon, Sun, Eye, Heart, Shield, HeartHandshake, Star, TrendingUp } from 'lucide-react';
import astrologyServices from '../services/astrologyApi.js';
import { fallbackChartData } from '../data/fallbackData';
import { supabase } from '../lib/supabase.js';

const KundliReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('idle');
  const [chartData, setChartData] = useState(null);
  const [moonDrishti, setMoonDrishti] = useState(null);
  const [sunDrishti, setSunDrishti] = useState(null);
  const [darakaraka, setDarakaraka] = useState(null);
  const [compatibilityList, setCompatibilityList] = useState([]);
  const [partnerMatch, setPartnerMatch] = useState(null);
  const [partnerSign, setPartnerSign] = useState('');
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
      if (data && !error) setCurrentSaturn(data);
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
      if (data && !error) setLagnaData(data);
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

      const { data, error } = await supabase
        .from('sade_sati')
        .select('*')
        .eq('moon_sign', moonSign)
        .eq('phase', phase)
        .single();

      if (data && !error) {
        setSadeSatiData(data);
        setSadeSatiStatus({ isActive: isAffected, phase: phase, moonSign: moonSign });
      } else {
        setSadeSatiStatus({ isActive: isAffected, phase: phase, moonSign: moonSign });
      }
    } catch (err) {
      console.error('Error fetching Sade Sati:', err);
    }
  };

  // Fetch Drishti data from Supabase
  const fetchDrishtiData = async (ascendant) => {
    if (!ascendant) return;
    try {
      const { data: moonData } = await supabase
        .from('planet_drishti')
        .select('*')
        .eq('planet', 'Moon')
        .eq('base_sign', ascendant)
        .single();
      if (moonData) setMoonDrishti(moonData);

      const { data: sunData } = await supabase
        .from('planet_drishti')
        .select('*')
        .eq('planet', 'Sun')
        .eq('base_sign', ascendant)
        .single();
      if (sunData) setSunDrishti(sunData);
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
      if (data && !error) setCompatibilityList(data);
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
      return data || null;
    } catch (err) {
      console.error('Error fetching partner compatibility:', err);
      return null;
    }
  };

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
      if (data && !error) setDarakaraka(data);
    } catch (err) {
      console.error('Error fetching darakaraka data:', err);
    }
  };

  // Calculate Darakaraka planet
  const calculateDarakaraka = (planetsData) => {
    const planets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
    const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    let lowestDegree = 360;
    let lowestPlanet = null;
    planets.forEach((planet, index) => {
      const data = planetsData[planet];
      if (data && data.longitude !== undefined && data.longitude < lowestDegree) {
        lowestDegree = data.longitude;
        lowestPlanet = planetNames[index];
      }
    });
    return lowestPlanet;
  };

  // Main fetch function
  const fetchAstrologyData = async () => {
    setLoading(true);
    setError(null);
    setApiStatus('loading');

    try {
      const [year, month, day] = birthDetails.dob.split('-');
      const [hour, minute] = birthDetails.tob.split(':');

      const astroPayload = {
        day: parseInt(day), month: parseInt(month), year: parseInt(year),
        hour: parseInt(hour), minute: parseInt(minute), second: 0,
        latitude: parseFloat(birthDetails.latitude),
        longitude: parseFloat(birthDetails.longitude),
        timezone: 5.5, ayanamsa: "lahiri"
      };

      console.log("🌟 Fetching birth details from AstrologyAPI...");
      const birthDetailsData = await astrologyServices.kundli.getBirthDetails(astroPayload);
      console.log("🪐 Fetching planet positions...");
      const planetsData = await astrologyServices.planetary.getPlanetsExtended(astroPayload);
      console.log("📊 Fetching yogas...");
      const yogasData = await astrologyServices.dosha.getYogas(astroPayload);
      console.log("⏰ Fetching dasha periods...");
      const dashaData = await astrologyServices.dasha.getCurrentVDasha(astroPayload);

      if (birthDetailsData && planetsData) {
        const ascendant = birthDetailsData?.ascendant || getAscendantFromDob(birthDetails.dob, birthDetails.tob);
        const moonSign = birthDetailsData?.moon_sign || birthDetailsData?.sign || getMoonSignFromDob(birthDetails.dob);

        await fetchCurrentSaturn();
        await fetchDrishtiData(ascendant);
        await fetchCompatibilityData(ascendant);
        await fetchLagnaData(ascendant);

        const darakarakaPlanet = calculateDarakaraka(planetsData);
        if (darakarakaPlanet) await fetchDarakarakaData(darakarakaPlanet);

        // Small delay for Saturn to load then fetch Sade Sati
        setTimeout(async () => {
          if (moonSign) await fetchSadeSatiForSign(moonSign);
        }, 500);

        const transformedData = {
          lagna: ascendant,
          rasi: birthDetailsData?.moon_sign || getMoonSignFromDob(birthDetails.dob),
          nakshatra: birthDetailsData?.nakshatra || getNakshatraFromDob(birthDetails.dob),
          nakshatraPada: birthDetailsData?.nakshatra_pada || "1",
          sunSign: birthDetailsData?.sun_sign || getSunSign(birthDetails.dob),
          moonSign: birthDetailsData?.moon_sign || getMoonSignFromDob(birthDetails.dob),
          planets: transformPlanetsData(planetsData, birthDetails.dob),
          houses: transformHousesData(birthDetailsData),
          yogas: yogasData?.map(y => y.name) || detectYogas(birthDetails.dob),
          dasha: transformDashaData(dashaData) || calculateDashaPeriods(birthDetails.dob),
          moonDrishti, sunDrishti, darakaraka: darakarakaPlanet, lagnaData,
          sadeSatiData, sadeSatiStatus
        };

        setChartData(transformedData);
        setApiStatus('success');

        localStorage.setItem('kundliData', JSON.stringify({
          userDetails: { name: birthDetails.name, gender: birthDetails.gender, dob: birthDetails.dob, time: birthDetails.tob, place: birthDetails.pob },
          basic: birthDetailsData, planets: planetsData, drishti: { moonDrishti, sunDrishti },
          darakaraka: { planet: darakarakaPlanet, data: darakaraka }, lagna: ascendant, moonSign, sadeSatiStatus
        }));
      } else {
        console.log("Using fallback data");
        setChartData(fallbackChartData);
        setApiStatus('fallback');
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
       console.error("Error:", err);
      // Use fallback on error
      setChartData(fallbackChartData);
      setApiStatus('fallback');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
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
      planet: d.planet, years: d.years, start: d.start_date, end: d.end_date, status: d.status || 'active'
    }));
  };

  const getLocalChartData = (details) => ({
    lagna: getAscendantFromDob(details.dob, details.tob),
    rasi: getMoonSignFromDob(details.dob),
    nakshatra: getNakshatraFromDob(details.dob),
    nakshatraPada: "2",
    sunSign: getSunSign(details.dob),
    moonSign: getMoonSignFromDob(details.dob),
    planets: generatePlanetaryPositions(details.dob),
    houses: generateHouseCusps(details.dob, details.tob),
    yogas: detectYogas(details.dob),
    dasha: calculateDashaPeriods(details.dob),
    moonDrishti, sunDrishti, darakaraka: "Venus", darakarakaData: darakaraka,
    lagnaData, sadeSatiStatus
  });

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
      name: planet, sign: signs[(index + dayOfYear) % 12], house: (index % 12) + 1,
      degree: `${Math.floor(Math.random() * 30)}° ${Math.floor(Math.random() * 60)}'`,
      lord: getPlanetLord(signs[(index + dayOfYear) % 12]),
      nakshatra: getNakshatraFromDob(dob), pada: "1", longitude: Math.random() * 360
    }));
  };

  const generateHouseCusps = (dob, tob) => {
    const houses = [];
    const ascendant = getAscendantFromDob(dob, tob);
    for (let i = 1; i <= 12; i++) {
      houses.push({
        number: i, sign: ascendant, cusp: `${Math.floor(Math.random() * 30)}° ${Math.floor(Math.random() * 60)}'`,
        lord: getPlanetLord(ascendant)
      });
    }
    return houses;
  };

  const detectYogas = (dob) => {
    const allYogas = ['Gaja Kesari', 'Lakshmi', 'Saraswati', 'Chandra Mangal', 'Ruchaka', 'Bhadra', 'Hamsa', 'Malavya'];
    const dayOfYear = getDayOfYear(new Date(dob));
    return allYogas.slice(0, (dayOfYear % 4) + 1);
  };

  const calculateDashaPeriods = (dob) => [
    { planet: 'Ketu', years: 7, start: 'Birth' }, { planet: 'Venus', years: 20, start: 'Age 7' },
    { planet: 'Sun', years: 6, start: 'Age 27' }, { planet: 'Moon', years: 10, start: 'Age 33' },
    { planet: 'Mars', years: 7, start: 'Age 43' }, { planet: 'Rahu', years: 18, start: 'Age 50' },
    { planet: 'Jupiter', years: 16, start: 'Age 68' }, { planet: 'Saturn', years: 19, start: 'Age 84' },
    { planet: 'Mercury', years: 17, start: 'Age 103' }
  ];

  const handleInputChange = (e) => setBirthDetails({ ...birthDetails, [e.target.name]: e.target.value });

  useEffect(() => {
    fetchAstrologyData();
    console.log("🔍 Debug Info:", {
      isPremium,
      chartData: !!chartData,
      birthDetails,
      user
    });
  }, []);

  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  // Debug info
  console.log("👤 Is Premium:", isPremium);
  console.log("📊 Chart Data:", !!chartData);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Consulting the cosmic records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {apiStatus === 'fallback' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <p className="text-yellow-800 font-medium">Using Local Astrology Calculations</p>
                <p className="text-yellow-700 text-sm mt-1">{error}</p>
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
              </div>
            </div>
          </div>
        )}

        {/* Rest of your UI remains the same */}
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

          <div className="mt-4">
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
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 h-[80vh]">
          {chartData ? (
            <PDFViewer width="100%" height="100%">
              {/* <KundliReportGenerator
                clientType={isPremium ? 'premium' : 'free'}
                birthDetails={birthDetails}
                chartData={chartData}
                moonDrishti={moonDrishti}
                sunDrishti={sunDrishti}
                darakaraka={darakaraka}
                lagnaData={lagnaData}
                sadeSatiData={sadeSatiData}
                sadeSatiStatus={sadeSatiStatus}
              /> */}
              <TestPDF />
            </PDFViewer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
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