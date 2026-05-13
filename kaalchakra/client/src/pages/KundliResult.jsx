// client/src/pages/KundliResult.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Sparkles, AlertTriangle, Calendar, Star, User, MapPin, Moon, Sun, Eye, Heart, Shield, HeartHandshake } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import KundliChart from '../components/kundli/KundliChart';
import PlanetTable from '../components/kundli/PlanetTable';
import SadeSatiCard from '../components/kundli/SadeSatiCard';
import DarakarakaHouses from '../components/kundli/DarakarakaHouses/DarakarakaHouses';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import api from '../services/api';

// ==================== HELPER COMPONENTS ====================

const LagnaCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">Characteristics</p>
          <p className="font-medium text-gray-800 mt-1">{data.characteristics || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Strengths</p>
          <p className="font-medium text-gray-800 mt-1">{data.strengths || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Weaknesses</p>
          <p className="font-medium text-gray-800 mt-1">{data.weaknesses || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Lucky Color</p>
          <p className="font-medium text-gray-800 mt-1">{data.lucky_color || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

const DarakarakaCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100">
      <div className="flex items-center gap-3 mb-4">
        <Heart className="w-8 h-8 text-pink-500" />
        <h3 className="text-xl font-bold text-gray-800">{data.planet} Darakaraka</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><p className="text-sm text-gray-500">Partner Nature</p><p className="font-medium text-gray-800">{data.partner_nature || 'N/A'}</p></div>
        <div><p className="text-sm text-gray-500">Relationship Dynamics</p><p className="font-medium text-gray-800">{data.relationship_dynamics || 'N/A'}</p></div>
        <div><p className="text-sm text-gray-500">Challenges</p><p className="font-medium text-gray-800">{data.challenges || 'N/A'}</p></div>
        <div><p className="text-sm text-gray-500">Remedies</p><p className="font-medium text-gray-800">{data.remedies || 'N/A'}</p></div>
      </div>
    </div>
  );
};

const DrishtiCard = ({ title, icon: Icon, data, isMoon }) => {
  if (!data) return null;
  return (
    <div className={`rounded-xl p-5 border ${isMoon ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${isMoon ? 'text-blue-500' : 'text-orange-500'}`} />
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between"><span className="text-sm text-gray-500">Aspects House</span><span className="font-semibold">{data.aspect_house || 'N/A'}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">Influence</span><span className="font-semibold">{data.influence || 'N/A'}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">Effect</span><span className="font-semibold">{data.effect_on_native || 'N/A'}</span></div>
      </div>
    </div>
  );
};

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
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [kundliData, setKundliData] = useState(null);
  const [error, setError] = useState(null);
  const [aiInsights, setAiInsights] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Additional data states
  const [moonDrishti, setMoonDrishti] = useState(null);
  const [sunDrishti, setSunDrishti] = useState(null);
  const [darakaraka, setDarakaraka] = useState(null);
  const [compatibilityList, setCompatibilityList] = useState([]);
  const [sadeSatiData, setSadeSatiData] = useState(null);
  const [sadeSatiStatus, setSadeSatiStatus] = useState(null);
  const [lagnaData, setLagnaData] = useState(null);
  const [darakarakaHouses, setDarakarakaHouses] = useState([]);
  const [loadingAdditional, setLoadingAdditional] = useState(false);

  const reportRef = useRef(null);

  // Helper: Get sign from degree
  const getSignFromDegree = (degree) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor((degree || 0) / 30);
    return signs[signIndex % 12] || 'Aries';
  };

  // Fetch additional data from Supabase
  const fetchAdditionalData = async (ascendant, moonSign, planetsList) => {
    setLoadingAdditional(true);
    try {
      // Fetch Drishti data
      const { data: moonData } = await supabase.from('planet_drishti').select('*').eq('planet', 'Moon').eq('base_sign', ascendant).single();
      if (moonData) setMoonDrishti(moonData);
      
      const { data: sunData } = await supabase.from('planet_drishti').select('*').eq('planet', 'Sun').eq('base_sign', ascendant).single();
      if (sunData) setSunDrishti(sunData);

      // Fetch Compatibility
      const { data: compatData } = await supabase.from('compatibility_scores').select('*').or(`sign1.eq.${ascendant},sign2.eq.${ascendant}`).order('score', { ascending: false });
      if (compatData) setCompatibilityList(compatData);

      // Fetch Lagna data
      const { data: lagnaDataRes } = await supabase.from('lagna_characteristics').select('*').eq('lagna_name', ascendant).single();
      if (lagnaDataRes) setLagnaData(lagnaDataRes);

      // Fetch Sade Sati
      if (moonSign) {
        const { data: currentSaturn } = await supabase.from('current_sade_sati').select('*').single();
        const isAffected = currentSaturn?.affected_signs?.includes(moonSign);
        let phase = null;
        if (currentSaturn?.first_phase_signs?.includes(moonSign)) phase = 'First Phase';
        else if (currentSaturn?.second_phase_signs?.includes(moonSign)) phase = 'Second Phase';
        else if (currentSaturn?.third_phase_signs?.includes(moonSign)) phase = 'Third Phase';

        const { data: sadeSatiDetails } = await supabase.from('sade_sati').select('*').eq('moon_sign', moonSign).order('phase_number', { ascending: true });
        if (sadeSatiDetails) {
          const currentPhaseData = sadeSatiDetails.find(d => d.phase === phase);
          setSadeSatiData(currentPhaseData);
          setSadeSatiStatus({ isActive: isAffected, phase, moonSign, signs: currentSaturn?.affected_signs || [] });
        }
      }

      // Fetch Darakaraka from planets
      if (planetsList && planetsList.length > 0) {
        const eligiblePlanets = planetsList.filter(p => !['Rahu', 'Ketu'].includes(p.name));
        let lowestDegree = 360;
        let darakarakaPlanet = null;
        eligiblePlanets.forEach(planet => {
          let degreeInSign = 360;
          if (planet.normDegree !== undefined) degreeInSign = planet.normDegree % 30;
          else if (planet.degree) {
            const match = planet.degree.match(/(\d+(?:\.\d+)?)/);
            if (match) degreeInSign = parseFloat(match[1]) % 30;
          }
          if (degreeInSign < lowestDegree) {
            lowestDegree = degreeInSign;
            darakarakaPlanet = planet.name;
          }
        });
        if (darakarakaPlanet) {
          const { data: dkData } = await supabase.from('darakaraka_planets').select('*').eq('planet', darakarakaPlanet).single();
          if (dkData) setDarakaraka(dkData);
        }
      }

      // Fetch Darakaraka Houses
      const { data: housesData } = await supabase.from('darakaraka_houses').select('*').order('house_number', { ascending: true });
      if (housesData) setDarakarakaHouses(housesData);

    } catch (err) {
      console.error('Error fetching additional data:', err);
    } finally {
      setLoadingAdditional(false);
    }
  };

  // Load main data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('kundliData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setKundliData(parsedData);
      
      let planetsList = [];
      if (Array.isArray(parsedData.planets)) planetsList = parsedData.planets;
      else if (Array.isArray(parsedData.planets?.data)) planetsList = parsedData.planets.data;
      
      const basicInfo = parsedData.basic || {};
      const ascendant = basicInfo.ascendant || basicInfo.lagna;
      const moonSign = basicInfo.sign || basicInfo.moon_sign;
      
      if (ascendant && planetsList.length > 0) {
        fetchAdditionalData(ascendant, moonSign, planetsList);
      }
    }
    setLoading(false);
  }, []);

  // Fetch AI Insights
  useEffect(() => {
    const fetchAIAndSave = async () => {
      if (!kundliData || !user?.phone) return;
      if (kundliData.basic?.ai_insights) {
        setAiInsights(kundliData.basic.ai_insights);
        return;
      }

      setIsAiLoading(true);
      try {
        const aiResponse = await api.post('/ai/interpret', {
          planets: kundliData.planets || [],
          basic: kundliData.basic || {}
        });

        if (aiResponse.data.success) {
          const cleanText = aiResponse.data.interpretation.replace(/\*/g, '');
          setAiInsights(cleanText);

          const saveResponse = await api.post('/reports/save', {
            user_phone: user.phone,
            name: user.name || "Seeker",
            dob: kundliData.userDetails?.dob || "N/A",
            basic_info: kundliData.basic,
            planets_data: kundliData.planets,
            ai_insights: cleanText
          });

          if (saveResponse.data.success) {
            const updatedData = { ...kundliData };
            updatedData.basic = updatedData.basic || {};
            updatedData.basic.ai_insights = cleanText;
            localStorage.setItem('kundliData', JSON.stringify(updatedData));
          }
        } else {
          setAiInsights("Could not load AI insights at the moment.");
        }
      } catch (err) {
        console.error("AI Error:", err);
        setAiInsights("Failed to connect to the AI service.");
      } finally {
        setIsAiLoading(false);
      }
    };

    fetchAIAndSave();
  }, [kundliData, user]);

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, { quality: 1.0, backgroundColor: '#fefaf5' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (reportRef.current.offsetHeight * pdfWidth) / reportRef.current.offsetWidth;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Premium_Vedic_Report.pdf');
    } catch (err) {
      console.error("PDF error:", err);
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

  // Extract planets with bulletproof logic
  let planetsList = [];
  if (kundliData) {
    if (Array.isArray(kundliData.planets)) planetsList = kundliData.planets;
    else if (Array.isArray(kundliData.planets?.data)) planetsList = kundliData.planets.data;
    else if (Array.isArray(kundliData.data?.planets)) planetsList = kundliData.data.planets;
  }

  const userDetails = kundliData?.userDetails || {};
  const basicInfo = kundliData?.basic || {};

  // No data check
  if (!planetsList || planetsList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e9e6df] p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md border-t-4 border-red-500">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-[#4a3727] mb-2">Cosmic Data Missing!</h2>
          <p className="text-slate-600 mb-6 font-medium">We couldn't find your planetary data. Please generate your Kundli again.</p>
          <button onClick={() => navigate('/kundli')} className="bg-[#b46f2c] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#8f551e] transition-colors shadow-md w-full">
            Go back to Kundli Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9e6df] to-[#dcd6cc] py-8 px-4 font-sans text-[#1e1b17]">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl mb-6 shadow-sm border border-[#dcd6cc]">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#4a3727] hover:text-[#b46f2c] font-bold px-4 py-2 bg-white rounded-xl shadow-sm">
            <ArrowLeft size={18} /> Dashboard
          </button>
          <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-2 bg-[#b46f2c] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#8f551e] transition-colors disabled:opacity-70 shadow-md">
            {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />} Download PDF
          </button>
        </div>

        {/* Main Report */}
        <div ref={reportRef} className="bg-[#fefaf5] rounded-[2rem] shadow-2xl overflow-hidden pb-6">
          
          {/* Header */}
          <div className="bg-[#2c2a24] p-8 border-b-[5px] border-[#e6b34c]">
            <h1 className="text-[#f7e9cd] font-semibold text-3xl flex items-center gap-3">
              <Sparkles className="text-[#e6b34c]" /> Comprehensive Astrological Report
            </h1>
            <p className="text-[#cbc3ae] mt-2">Vedic Astrology • Janam Kundali Analysis • AI Predictions</p>
          </div>

          {/* Birth & Astrological Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
            <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
              <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b">📅 Birth Details</div>
              <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <p><strong className="text-[#c28135]">Name:</strong> {userDetails.name || user?.name || "Seeker"}</p>
                <p><strong className="text-[#c28135]">Gender:</strong> {userDetails.gender || "Male"}</p>
                <p><strong className="text-[#c28135]">Date:</strong> {userDetails.dob || "N/A"}</p>
                <p><strong className="text-[#c28135]">Place:</strong> {userDetails.place || "N/A"}</p>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
              <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b">🌀 Astrological Details</div>
              <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <p><strong className="text-[#c28135]">Ascendant:</strong> {basicInfo.ascendant || basicInfo.lagna || 'N/A'}</p>
                <p><strong className="text-[#c28135]">Moon Sign:</strong> {basicInfo.sign || basicInfo.moon_sign || 'N/A'}</p>
                <p><strong className="text-[#c28135]">Nakshatra:</strong> {basicInfo.Naksahtra || basicInfo.nakshatra || 'N/A'}</p>
                <p><strong className="text-[#c28135]">Varna:</strong> {basicInfo.Varna || basicInfo.varna || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Lagna Characteristics */}
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

          {/* Sade Sati */}
          <SadeSatiCard sadeSatiData={sadeSatiData} sadeSatiStatus={sadeSatiStatus} />

          {/* Darakaraka */}
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

          {/* Darakaraka Houses */}
          {darakarakaHouses.length > 0 && (
            <div className="px-8 pb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6 text-purple-500" /> Darakaraka Houses
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
              </div>
              <DarakarakaHouses />
            </div>
          )}

          {/* Compatibility */}
          {compatibilityList.length > 0 && (
            <div className="px-8 pb-8">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <HeartHandshake className="w-6 h-6 text-orange-500" /> Zodiac Compatibility
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {compatibilityList.map((comp, idx) => (
                  <CompatibilityCard key={idx} compatibility={comp} ascendantSign={basicInfo.ascendant || basicInfo.lagna} />
                ))}
              </div>
            </div>
          )}

          {/* Charts - ✅ Updated Layout (HUGE Chart + Vertical Stack) */}
          <div className="px-8 pb-8">
            <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
              <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b text-center">
                🕉️ Astrological Charts
              </div>
              <div className="p-4 md:p-10 flex flex-col gap-12 justify-center items-center">
                
                {/* 1. LARGE KUNDLI CHART */}
                <div className="w-full">
                  <h3 className="text-center font-extrabold text-[#4a3727] text-2xl mb-6 tracking-wide">Lagna Chart (D-1)</h3>
                  <div className="p-4 md:p-8 border-2 border-orange-100 rounded-[2rem] bg-[#fffdfa] shadow-inner flex justify-center">
                    <KundliChart planets={planetsList} ascendant={basicInfo.ascendant || basicInfo.lagna} />
                  </div>
                </div>

                {/* 2. PLANET TABLE */}
                <div className="w-full max-w-5xl mx-auto">
                  <PlanetTable planets={planetsList} />
                </div>

              </div>
            </div>
          </div>

          {/* Planetary Aspects */}
          {(moonDrishti || sunDrishti) && (
            <div className="px-8 pb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Eye className="w-6 h-6 text-purple-500" /> Planetary Aspects (Drishti)
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <DrishtiCard title="🌙 Chandra (Moon)" icon={Moon} data={moonDrishti} isMoon={true} />
                <DrishtiCard title="☀️ Surya (Sun)" icon={Sun} data={sunDrishti} isMoon={false} />
              </div>
            </div>
          )}

          {/* AI Insights */}
          <div className="px-8 pb-8">
            <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden shadow-sm">
              <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b flex items-center gap-2">
                <Sparkles size={20} className="text-[#e6b34c]"/> AI Cosmic Insights & Predictions
              </div>
              <div className="p-8">
                {isAiLoading ? (
                  <div className="flex flex-col items-center py-10">
                    <Loader2 className="animate-spin text-[#c28135] mb-3" size={36} />
                    <p className="text-[#8b765c] font-medium animate-pulse">AI is reading the stars...</p>
                  </div>
                ) : (
                  <div className="text-[#2e2a24] text-sm md:text-base leading-relaxed whitespace-pre-line font-medium bg-[#fefaf2] p-6 rounded-2xl border border-[#f0e2d2]">
                    {aiInsights || "Your personalized AI insights could not be loaded."}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center p-6 mt-4 text-[#a08c74] border-t border-[#ede3d7] bg-[#fefaf5] text-xs">
            © 2026 Kaal Chakra | Vedic Sidereal Calculations
          </div>
        </div>
      </div>
    </div>
  );
};

export default KundliResult;