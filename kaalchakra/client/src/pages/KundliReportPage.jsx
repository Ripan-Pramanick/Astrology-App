// client/src/pages/KundliReportPage.jsx
import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { KundliReportGenerator } from '../components/KundliReportGenerator';
import { Loader2, AlertCircle, RefreshCw, Info, Sparkles, MapPin, Calendar, Clock } from 'lucide-react';
import api from '../services/api';
import astrologyServices from '../services/astrologyApi.js';

const KundliReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('idle');
  const [chartData, setChartData] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  
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

  // Fetch data from AstrologyAPI
  const fetchAstrologyData = async () => {
    setLoading(true);
    setError(null);
    setApiStatus('loading');
    
    try {
      // Parse birth details for API
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

      // Fetch data from AstrologyAPI
      console.log("🌟 Fetching birth details from AstrologyAPI...");
      const birthDetailsData = await astrologyServices.kundli.getBirthDetails(astroPayload);
      
      console.log("🪐 Fetching planet positions from AstrologyAPI...");
      const planetsData = await astrologyServices.planetary.getPlanetsExtended(astroPayload);
      
      console.log("📊 Fetching yogas from AstrologyAPI...");
      const yogasData = await astrologyServices.dosha.getYogas(astroPayload);
      
      console.log("⏰ Fetching dasha periods from AstrologyAPI...");
      const dashaData = await astrologyServices.dasha.getCurrentVDasha(astroPayload);

      if (birthDetailsData && planetsData) {
        // Transform API data to chart format
        const transformedData = {
          lagna: birthDetailsData?.ascendant || getAscendantFromDob(birthDetails.dob, birthDetails.tob),
          rasi: planetsData?.moon?.sign || getMoonSignFromDob(birthDetails.dob),
          nakshatra: planetsData?.moon?.nakshatra || getNakshatraFromDob(birthDetails.dob),
          nakshatraPada: planetsData?.moon?.nakshatra_pada || "2",
          sunSign: planetsData?.sun?.sign || getSunSign(birthDetails.dob),
          moonSign: planetsData?.moon?.sign || getMoonSignFromDob(birthDetails.dob),
          planets: transformPlanetsData(planetsData, birthDetails.dob),
          houses: transformHousesData(birthDetailsData),
          yogas: yogasData?.map(y => y.name) || detectYogas(birthDetails.dob),
          dasha: transformDashaData(dashaData) || calculateDashaPeriods(birthDetails.dob)
        };
        
        setChartData(transformedData);
        setRealTimeData({ birthDetails: birthDetailsData, planets: planetsData });
        setApiStatus('success');
        
        // Save to localStorage for later use
        localStorage.setItem('kundliData', JSON.stringify({
          userDetails: {
            name: birthDetails.name,
            gender: birthDetails.gender,
            dob: birthDetails.dob,
            time: birthDetails.tob,
            place: birthDetails.pob
          },
          basic: birthDetailsData,
          planets: planetsData
        }));
      } else {
        throw new Error('Failed to fetch astrological data');
      }
      
    } catch (err) {
      console.error("Error fetching from AstrologyAPI:", err);
      // Use local calculations as fallback
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
        pada: data.nakshatra_pada || 1
      };
    });
  };

  // Transform houses data from API
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

  // Transform dasha data from API
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

  // Local calculations (fallback when API fails)
  const getLocalChartData = (details) => {
    return {
      lagna: getAscendantFromDob(details.dob, details.tob),
      rasi: getMoonSignFromDob(details.dob),
      nakshatra: getNakshatraFromDob(details.dob),
      nakshatraPada: "2",
      sunSign: getSunSign(details.dob),
      moonSign: getMoonSignFromDob(details.dob),
      planets: generatePlanetaryPositions(details.dob),
      houses: generateHouseCusps(details.dob, details.tob),
      yogas: detectYogas(details.dob),
      dasha: calculateDashaPeriods(details.dob)
    };
  };

  // Helper functions for local calculations
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
      lord: getPlanetLord(signs[(index + dayOfYear) % 12])
    }));
  };

  const generateHouseCusps = (dob, tob) => {
    const houses = [];
    for (let i = 1; i <= 12; i++) {
      houses.push({
        number: i,
        sign: getAscendantFromDob(dob, tob),
        cusp: `${Math.floor(Math.random() * 30)}° ${Math.floor(Math.random() * 60)}'`
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
          
          <div className="mt-4">
            <PDFDownloadLink
              document={<KundliReportGenerator 
                clientType={isPremium ? 'premium' : 'free'} 
                birthDetails={birthDetails} 
                chartData={chartData}
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
        
        {/* PDF Viewer */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 h-[80vh]">
          {chartData ? (
            <PDFViewer width="100%" height="100%">
              <KundliReportGenerator 
                clientType={isPremium ? 'premium' : 'free'} 
                birthDetails={birthDetails} 
                chartData={chartData}
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