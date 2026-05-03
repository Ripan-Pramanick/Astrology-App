// client/src/pages/KundliResult.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Sparkles, AlertTriangle, Calendar, Star, Zap, Gem, User, MapPin, Moon, Sun, Eye, Heart, Shield, Brain, Users, HeartHandshake } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import KundliChart from '../components/kundli/KundliChart.jsx';
import PlanetTable from '../components/kundli/PlanetTable.jsx';
import PredictionSection from '../components/kundli/PredictionSection.jsx';
import SadeSatiCard from '../components/kundli/SadeSatiCard.jsx';
import DarakarakaHouses from '../components/kundli/DarakarakaHouses/DarakarakaHouses.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';

// ==================== HELPER COMPONENTS ====================

// Lagna Card Component
const LagnaCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">Characteristics</p>
          <p className="font-medium text-gray-800 mt-1">{data.characteristics || data.lagna_characteristics || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Strengths</p>
          <p className="font-medium text-gray-800 mt-1">{data.strengths || data.lagna_strengths || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Weaknesses</p>
          <p className="font-medium text-gray-800 mt-1">{data.weaknesses || data.lagna_weaknesses || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Lucky Color</p>
          <p className="font-medium text-gray-800 mt-1">{data.lucky_color || data.color || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

// Darakaraka Card Component
const DarakarakaCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100">
      <div className="flex items-center gap-3 mb-4">
        <Heart className="w-8 h-8 text-pink-500" />
        <h3 className="text-xl font-bold text-gray-800">{data.planet} Darakaraka</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Partner Nature</p>
          <p className="font-medium text-gray-800">{data.partner_nature || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Relationship Dynamics</p>
          <p className="font-medium text-gray-800">{data.relationship_dynamics || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Challenges</p>
          <p className="font-medium text-gray-800">{data.challenges || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Remedies</p>
          <p className="font-medium text-gray-800">{data.remedies || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

// Drishti Card Component
const DrishtiCard = ({ title, icon: Icon, data, isMoon }) => {
  if (!data) return null;
  return (
    <div className={`rounded-xl p-5 border ${isMoon ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${isMoon ? 'text-blue-500' : 'text-orange-500'}`} />
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Aspects House</span>
          <span className="font-semibold">{data.aspect_house || data.house || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Influence</span>
          <span className="font-semibold">{data.influence || data.description || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Effect on Native</span>
          <span className="font-semibold">{data.effect_on_native || data.effect || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

// Compatibility Card Component - FIXED: basicInfo as parameter
const CompatibilityCard = ({ compatibility, ascendantSign }) => {
  if (!compatibility) return null;
  const otherSign = compatibility.sign1 !== ascendantSign ? compatibility.sign1 : compatibility.sign2;
  const score = compatibility.score || 50;
  const scoreColor = score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600';
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center hover:shadow-md transition">
      <p className="font-bold text-gray-800">{otherSign}</p>
      <p className={`text-lg font-black ${scoreColor}`}>{score}%</p>
      <p className="text-xs text-gray-400">{compatibility.description || 'Compatible'}</p>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const KundliResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [kundliData, setKundliData] = useState(null);
  const [error, setError] = useState(null);
  const [moonDrishti, setMoonDrishti] = useState(null);
  const [sunDrishti, setSunDrishti] = useState(null);
  const [darakaraka, setDarakaraka] = useState(null);
  const [compatibilityList, setCompatibilityList] = useState([]);
  const [sadeSatiData, setSadeSatiData] = useState(null);
  const [sadeSatiStatus, setSadeSatiStatus] = useState(null);
  const [lagnaData, setLagnaData] = useState(null);
  const [darakarakaHouses, setDarakarakaHouses] = useState([]);
  const [loadingDrishti, setLoadingDrishti] = useState(false);
  const [loadingHouses, setLoadingHouses] = useState(false);

  const reportRef = useRef(null);

  // client/src/pages/KundliResult.jsx - শুধু API ডেটার জন্য
  // শুধুমাত্র useEffect অংশটি প্রতিস্থাপন করুন

  useEffect(() => {
    const loadData = async () => {
      console.log("🟢 KundliResult page loaded");
      console.log("🔍 Location path:", window.location.pathname);
      console.log("🔍 Location state:", location.state);

      // Try to get data from localStorage
      let storedData = localStorage.getItem('kundliData');
      console.log("💾 localStorage data exists:", !!storedData);

      if (!storedData) {
        storedData = sessionStorage.getItem('kundliData');
        console.log("💾 sessionStorage data exists:", !!storedData);
      }

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log("✅ Parsed data from storage:", parsedData);
          console.log("📊 Planets count:", parsedData.planets?.length);

          // Check if data has userDetails and basic info
          if (parsedData.userDetails && parsedData.basic && parsedData.planets) {
            console.log("✅ Valid data found - showing original API data");

            // Transform planets if needed (from normDegree format)
            let finalPlanets = parsedData.planets;
            if (parsedData.planets.length > 0 && parsedData.planets[0].normDegree !== undefined) {
              console.log("🔄 Transforming planet data from normDegree format...");
              finalPlanets = transformPlanetData(parsedData.planets);
            }

            // Ensure basic info has correct fields
            const finalBasic = {
              ascendant: parsedData.basic?.ascendant || parsedData.basic?.lagna || 'N/A',
              sign: parsedData.basic?.sign || parsedData.basic?.moon_sign || 'N/A',
              Naksahtra: parsedData.basic?.Naksahtra || parsedData.basic?.nakshatra || 'N/A',
              Varna: parsedData.basic?.Varna || parsedData.basic?.varna || 'N/A',
              Gana: parsedData.basic?.Gana || parsedData.basic?.gana || 'N/A',
              ...parsedData.basic
            };

            const finalData = {
              ...parsedData,
              basic: finalBasic,
              planets: finalPlanets
            };

            setKundliData(finalData);

            // Fetch additional data from Supabase
            const ascendant = finalBasic.ascendant;
            const moonSign = finalBasic.sign;

            if (ascendant && ascendant !== 'N/A') {
              await fetchDrishtiData(ascendant);
              await fetchCompatibilityData(ascendant);
              await fetchLagnaData(ascendant);
            }

            if (moonSign && moonSign !== 'N/A') {
              await fetchSadeSatiData(moonSign);
            }

            if (finalPlanets && finalPlanets.length > 0) {
              await calculateAndFetchDarakaraka(finalPlanets);
            }

            await fetchDarakarakaHouses();

            setLoading(false);
            return;
          } else {
            console.warn("⚠️ Data missing required fields:", {
              hasUserDetails: !!parsedData.userDetails,
              hasBasic: !!parsedData.basic,
              hasPlanets: !!parsedData.planets
            });
            setError("कुंडली डेटा अधूरा है। कृपया फिर से जनरेट करें।");
          }
        } catch (err) {
          console.error("❌ Error parsing data:", err);
          setError("डेटा पढ़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
        }
      } else {
        setError("कोई कुंडली डेटा नहीं मिला। कृपया पहले कुंडली जनरेट करें।");
      }

      setLoading(false);
    };

    loadData();
  }, [location, user]);

  // Helper function to transform planet data from API format
  const transformPlanetData = (planets) => {
    if (!planets || !Array.isArray(planets)) return [];

    return planets.map(planet => {
      const degree = planet.normDegree || parseFloat(planet.degree) || 0;
      return {
        name: planet.name || planet.planet_name,
        sign: planet.sign || getSignFromDegree(degree),
        degree: planet.degree || `${degree}°`,
        house: planet.house || calculateHouseFromDegree(degree),
        nakshatra: planet.nakshatra || getNakshatraFromDegree(degree),
        retrograde: planet.retrograde || false,
        normDegree: degree
      };
    });
  };

  // Helper: Get sign from degree
  const getSignFromDegree = (degree) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor((degree || 0) / 30);
    return signs[signIndex % 12] || 'Aries';
  };

  // Helper: Calculate house from degree
  const calculateHouseFromDegree = (degree) => {
    if (!degree) return 1;
    // Assuming ascendant is at house 1, this is simplified
    return Math.floor((degree % 360) / 30) + 1;
  };

  // Helper: Get nakshatra from degree
  const getNakshatraFromDegree = (degree) => {
    const nakshatras = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
      'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
      'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
      'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];
    if (!degree) return nakshatras[0];
    const nakshatraIndex = Math.floor((degree % 360) / 13.333);
    return nakshatras[nakshatraIndex % 27] || nakshatras[0];
  };

  // Fetch functions
  const fetchDarakarakaHouses = async () => {
    setLoadingHouses(true);
    try {
      const { data, error } = await supabase
        .from('darakaraka_houses')
        .select('*')
        .order('house_number', { ascending: true });

      if (error) throw error;
      setDarakarakaHouses(data || []);
    } catch (err) {
      console.error('Error fetching Darakaraka houses:', err);
    } finally {
      setLoadingHouses(false);
    }
  };

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

  const fetchSadeSatiData = async (moonSign) => {
    if (!moonSign) return;
    try {
      const { data: currentSaturn } = await supabase
        .from('current_sade_sati')
        .select('*')
        .single();

      const isAffected = currentSaturn?.affected_signs?.includes(moonSign);
      let phase = null;
      if (currentSaturn?.first_phase_signs?.includes(moonSign)) phase = 'First Phase';
      else if (currentSaturn?.second_phase_signs?.includes(moonSign)) phase = 'Second Phase';
      else if (currentSaturn?.third_phase_signs?.includes(moonSign)) phase = 'Third Phase';

      const { data: sadeSatiDetails } = await supabase
        .from('sade_sati')
        .select('*')
        .eq('moon_sign', moonSign)
        .order('phase_number', { ascending: true });

      if (sadeSatiDetails) {
        const currentPhaseData = sadeSatiDetails.find(d => d.phase === phase);
        setSadeSatiData(currentPhaseData);
        setSadeSatiStatus({
          isActive: isAffected,
          phase: phase,
          moonSign: moonSign,
          signs: currentSaturn?.affected_signs || []
        });
      }
    } catch (err) {
      console.error('Error fetching Sade Sati data:', err);
    }
  };

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

  const calculateDarakarakaPlanet = (planetsList) => {
    if (!planetsList || planetsList.length === 0) return null;
    let lowestDegree = 360;
    let darakarakaPlanet = null;
    planetsList.forEach(planet => {
      let degreeValue = 360;
      if (planet.degree) {
        const degreeMatch = planet.degree.match(/(\d+)°/);
        if (degreeMatch) {
          degreeValue = parseInt(degreeMatch[1]);
        }
      }
      if (degreeValue < lowestDegree) {
        lowestDegree = degreeValue;
        darakarakaPlanet = planet.name;
      }
    });
    return darakarakaPlanet;
  };

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

  const calculateAndFetchDarakaraka = async (planetsList) => {
    const darakarakaPlanet = calculateDarakarakaPlanet(planetsList);
    if (darakarakaPlanet) {
      await fetchDarakarakaData(darakarakaPlanet);
    }
  };

  const fetchDrishtiData = async (ascendant) => {
    setLoadingDrishti(true);
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
    } finally {
      setLoadingDrishti(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, { quality: 1.0, backgroundColor: '#fefaf5' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (reportRef.current.offsetHeight * pdfWidth) / reportRef.current.offsetWidth;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Kundli_Report.pdf');
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cosmic chart...</p>
        </div>
      </div>
    );
  }

  if (error || !kundliData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Found</h2>
          <p className="text-gray-600 mb-6">{error || "Could not load your Kundli report."}</p>
          <button
            onClick={() => navigate('/kundli')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
          >
            Generate New Kundli
          </button>
        </div>
      </div>
    );
  }

  const userDetails = kundliData.userDetails || {};
  const basicInfo = kundliData.basic || {};
  const planetsList = kundliData.planets || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Navigation Bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl mb-6 shadow-lg">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-bold px-4 py-2 bg-white rounded-xl shadow-sm transition"
          >
            <ArrowLeft size={18} /> Dashboard
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 text-white font-bold px-6 py-2 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition"
            style={{ background: 'linear-gradient(to right, #f97316, #f59e0b)' }}
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            Download PDF
          </button>
        </div>

        {/* Main Report Content */}
        <div ref={reportRef} className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="p-8 text-white" style={{ background: 'linear-gradient(to right, #f97316, #f59e0b)' }}>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-8 h-8" /> Comprehensive Astrological Report
            </h1>
            <p className="text-orange-100 mt-2">Vedic Astrology • Janam Kundali Analysis • AI Predictions</p>
          </div>

          {/* Birth Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" /> Birth Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div><p className="text-xs text-gray-400">Full Name</p><p className="font-semibold text-gray-800">{userDetails.name || user?.name || 'N/A'}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4"></div>
                  <div><p className="text-xs text-gray-400">Gender</p><p className="font-semibold text-gray-800 capitalize">{userDetails.gender || 'N/A'}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div><p className="text-xs text-gray-400">Date of Birth</p><p className="font-semibold text-gray-800">{userDetails.dob || 'N/A'} {userDetails.time && `(${userDetails.time})`}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div><p className="text-xs text-gray-400">Place of Birth</p><p className="font-semibold text-gray-800">{userDetails.place || 'N/A'}</p></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" /> Astrological Details
              </h3>
              <div className="space-y-3">
                <div><p className="text-xs text-gray-400">Ascendant (Lagna)</p><p className="font-bold text-xl text-orange-600">{basicInfo.ascendant || basicInfo.lagna || 'N/A'}</p></div>
                <div><p className="text-xs text-gray-400">Moon Sign (Rasi)</p><p className="font-semibold text-lg text-blue-600">{basicInfo.sign || basicInfo.moon_sign || 'N/A'}</p></div>
                <div><p className="text-xs text-gray-400">Nakshatra</p><p className="font-semibold text-purple-600">{basicInfo.Naksahtra || basicInfo.nakshatra || 'N/A'}</p></div>
                <div><p className="text-xs text-gray-400">Varna / Gana</p><p className="font-semibold">{basicInfo.Varna || basicInfo.varna || 'N/A'} / {basicInfo.Gana || basicInfo.gana || 'N/A'}</p></div>
              </div>
            </div>
          </div>

          {/* Lagna Characteristics Section */}
          {lagnaData && (
            <div className="px-8 pb-8">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Star className="w-6 h-6 text-purple-500" /> Your Ascendant: {basicInfo.ascendant || basicInfo.lagna} Lagna
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">How the world perceives you and your natural approach to life</p>
              </div>
              <LagnaCard data={lagnaData} />
            </div>
          )}

          {/* Sade Sati Section */}
          <SadeSatiCard sadeSatiData={sadeSatiData} sadeSatiStatus={sadeSatiStatus} />

          {/* Darakaraka Section */}
          {darakaraka && (
            <div className="px-8 pb-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-pink-500" /> Darakaraka — Your Relationship Guide
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">The significator of your life partner and relationship karma</p>
              </div>
              <DarakarakaCard data={darakaraka} />
            </div>
          )}

          {/* Darakaraka Houses Section */}
          {darakarakaHouses.length > 0 && (
            <div className="px-8 pb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6 text-purple-500" /> Darakaraka Houses (Relationship Karma)
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">The house placement of your Darakaraka reveals where relationship lessons manifest</p>
              </div>
              {loadingHouses ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-purple-500 animate-spin" /></div>
              ) : (
                <DarakarakaHouses />
              )}
            </div>
          )}

          {/* Compatibility Section - FIXED: passing ascendantSign */}
          {compatibilityList.length > 0 && basicInfo.ascendant && (
            <div className="px-8 pb-8">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <HeartHandshake className="w-6 h-6 text-orange-500" /> Zodiac Compatibility
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">How your ascendant sign ({basicInfo.ascendant}) connects with other zodiac signs</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {compatibilityList.map((comp, idx) => (
                  <CompatibilityCard
                    key={idx}
                    compatibility={comp}
                    ascendantSign={basicInfo.ascendant}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Lagna Chart Section */}
          <div className="px-8 pb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4 text-center">Lagna Chart (D-1)</h3>
              {planetsList.length > 0 ? (
                <KundliChart planets={planetsList} chartData={basicInfo} />
              ) : (
                <p className="text-center text-gray-500 py-8">Chart data not available</p>
              )}
            </div>
          </div>

          {/* Planet Table Section */}
          {planetsList.length > 0 && (
            <div className="px-8 pb-8">
              <PlanetTable planets={planetsList} />
            </div>
          )}

          {/* Planetary Aspects Section */}
          {(moonDrishti || sunDrishti) && (
            <div className="px-8 pb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Eye className="w-6 h-6 text-purple-500" /> Planetary Aspects (Drishti)
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">How planets influence your life through their special aspects</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <DrishtiCard title="🌙 Chandra (Moon)" icon={Moon} data={moonDrishti} isMoon={true} />
                <DrishtiCard title="☀️ Surya (Sun)" icon={Sun} data={sunDrishti} isMoon={false} />
              </div>
            </div>
          )}

          {/* AI Predictions Section */}
          <div className="px-8 pb-8">
            <PredictionSection
              birthDetails={userDetails}
              kundliData={kundliData}
              planetsList={planetsList}
              basicInfo={basicInfo}
            />
          </div>

          {/* Footer */}
          <div className="text-center p-6 border-t border-gray-100 text-gray-400 text-xs flex items-center justify-center gap-2">
            <Sparkles size={12} /> © 2026 Kaal Chakra | Vedic Sidereal Calculations <Sparkles size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KundliResult;