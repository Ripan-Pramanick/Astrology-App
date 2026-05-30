import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Sparkles, AlertTriangle, Star, User, Heart, Shield, HeartHandshake, Eye, Moon, Sun } from 'lucide-react';
import KundliChart from '../components/kundli/KundliChart';
import PlanetTable from '../components/kundli/PlanetTable';
import SadeSatiCard from '../components/kundli/SadeSatiCard';
import DarakarakaHouses from '../components/kundli/DarakarakaHouses/DarakarakaHouses';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import api from '../services/api';

// ==================== BUILT-IN FALLBACK DATA ====================
const LAGNA_FALLBACKS = {
  Aries: { characteristics: "Energetic, pioneering, and courageous. Always ready for action.", strengths: "Brave, direct, highly independent.", weaknesses: "Impulsive, short-tempered, impatient.", lucky_color: "Red" },
  Taurus: { characteristics: "Grounded, practical, and appreciates beauty and comfort.", strengths: "Reliable, patient, devoted.", weaknesses: "Stubborn, possessive, uncompromising.", lucky_color: "White, Pink" },
  Gemini: { characteristics: "Quick-witted, expressive, and highly adaptable.", strengths: "Curious, affectionate, adaptable.", weaknesses: "Nervous, inconsistent, indecisive.", lucky_color: "Green" },
  Cancer: { characteristics: "Deeply intuitive, sentimental, and fiercely protective of family.", strengths: "Highly imaginative, loyal, emotional.", weaknesses: "Moody, pessimistic, suspicious.", lucky_color: "White, Silver" },
  Leo: { characteristics: "Dramatic, creative, self-confident, and dominant.", strengths: "Creative, passionate, generous.", weaknesses: "Arrogant, stubborn, self-centered.", lucky_color: "Gold, Orange" },
  Virgo: { characteristics: "Loyal, analytical, kind, and hardworking.", strengths: "Practical, loyal, hardworking.", weaknesses: "Overly critical, shy, worries too much.", lucky_color: "Green, Pale Yellow" },
  Libra: { characteristics: "Peaceful, fair, and hates being alone. Values harmony.", strengths: "Cooperative, diplomatic, gracious.", weaknesses: "Indecisive, avoids confrontations.", lucky_color: "Light Blue, Pink" },
  Scorpio: { characteristics: "Passionate, stubborn, resourceful, and brave.", strengths: "Resourceful, brave, a true friend.", weaknesses: "Distrusting, jealous, secretive.", lucky_color: "Red, Black" },
  Sagittarius: { characteristics: "Generous, idealistic, and has a great sense of humor.", strengths: "Generous, highly idealistic, great humor.", weaknesses: "Promises more than can deliver, impatient.", lucky_color: "Yellow" },
  Capricorn: { characteristics: "Responsible, disciplined, and exercises self-control.", strengths: "Responsible, disciplined, good managers.", weaknesses: "Know-it-all, unforgiving, condescending.", lucky_color: "Black, Dark Blue" },
  Aquarius: { characteristics: "Deep thinkers, highly intellectual, and loves helping others.", strengths: "Progressive, original, independent.", weaknesses: "Runs from emotional expression, aloof.", lucky_color: "Light Blue, Silver" },
  Pisces: { characteristics: "Very friendly, compassionate, and highly artistic.", strengths: "Compassionate, artistic, intuitive.", weaknesses: "Fearful, overly trusting, desire to escape reality.", lucky_color: "Sea Green, Yellow" }
};

const SADE_SATI_PHASES = { "Aries": "First Phase", "Pisces": "Second Phase", "Aquarius": "Third Phase" };
const CURRENT_SATURN_SIGN = "Pisces";
const SADE_SATI_FALLBACKS = {
  "First Phase": { phase: "First Phase", effect_description: "Saturn is transiting the 12th house from your Moon. This marks the beginning of Sade Sati. You may experience increased expenses, physical fatigue, and unexpected travels.", positive_aspects: "Opportunities for spiritual growth and foreign connections.", challenges: "Financial strain, disturbed sleep, hidden enemies.", lesson: "Learn to let go of attachments and manage finances prudently.", remedies: ["Chant Hanuman Chalisa daily", "Donate black sesame seeds on Saturdays"] },
  "Second Phase": { phase: "Second Phase", effect_description: "Saturn is transiting directly over your Moon. This is the peak phase. It brings profound mental, emotional, and physical transformation.", positive_aspects: "Deep personal maturity, building resilience, karmic cleansing.", challenges: "Mental stress, health issues, feeling restricted.", lesson: "Patience, humility, and accepting reality as it is.", remedies: ["Worship Lord Shiva", "Light a mustard oil lamp under a Peepal tree"] },
  "Third Phase": { phase: "Third Phase", effect_description: "Saturn is transiting the 2nd house from your Moon. The intensity starts to fade, focusing now on family, wealth, and speech.", positive_aspects: "Resolution of past conflicts, rebuilding your foundation.", challenges: "Family misunderstandings, harsh speech, financial adjustments.", lesson: "Value relationships and practice mindful communication.", remedies: ["Recite Shani Stotram", "Help the elderly or disabled on Saturdays"] }
};

// ==================== HELPER COMPONENTS ====================

const LagnaCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6 border border-purple-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold">Characteristics</p>
          <p className="font-medium text-gray-800 mt-1 text-sm sm:text-base">{data.characteristics || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold">Strengths</p>
          <p className="font-medium text-gray-800 mt-1 text-sm sm:text-base">{data.strengths || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold">Weaknesses</p>
          <p className="font-medium text-gray-800 mt-1 text-sm sm:text-base">{data.weaknesses || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold">Lucky Color</p>
          <p className="font-medium text-gray-800 mt-1 text-sm sm:text-base">{data.lucky_color || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

const DarakarakaCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 sm:p-6 border border-pink-100">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{data.planet} Darakaraka</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div><p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold">Partner Nature</p><p className="font-medium text-gray-800 text-sm sm:text-base mt-1">{data.partner_nature || 'N/A'}</p></div>
        <div><p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold">Relationship Dynamics</p><p className="font-medium text-gray-800 text-sm sm:text-base mt-1">{data.relationship_dynamics || 'N/A'}</p></div>
        <div><p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold">Challenges</p><p className="font-medium text-gray-800 text-sm sm:text-base mt-1">{data.challenges || 'N/A'}</p></div>
        <div><p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold">Remedies</p><p className="font-medium text-gray-800 text-sm sm:text-base mt-1">{data.remedies || 'N/A'}</p></div>
      </div>
    </div>
  );
};

const DrishtiCard = ({ title, icon: Icon, data, isMoon }) => {
  if (!data) return null;
  return (
    <div className={`rounded-2xl p-4 sm:p-5 border ${isMoon ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${isMoon ? 'text-blue-500' : 'text-orange-500'}`} />
        <h3 className="font-bold text-gray-800 text-sm sm:text-base">{title}</h3>
      </div>
      <div className="space-y-3 text-sm sm:text-base">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-black/5 pb-2">
          <span className="text-gray-500 font-medium">Aspects House</span>
          <span className="font-bold text-gray-800">{data.aspect_house || 'N/A'}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 border-b border-black/5 pb-2">
          <span className="text-gray-500 font-medium whitespace-nowrap">Influence</span>
          <span className="font-semibold text-gray-800 sm:text-right">{data.influence || 'N/A'}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 pt-1">
          <span className="text-gray-500 font-medium whitespace-nowrap">Effect</span>
          <span className="font-semibold text-gray-800 sm:text-right">{data.effect_on_native || 'N/A'}</span>
        </div>
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
    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center border border-gray-100 shadow-sm hover:shadow-md transition">
      <p className="font-bold text-gray-800 text-sm sm:text-base">{otherSign}</p>
      <p className={`text-xl sm:text-2xl font-black my-1 ${scoreColor}`}>{score}%</p>
      <p className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight">{compatibility.description || 'Compatible'}</p>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const KundliResult = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState('');
  const [kundliData, setKundliData] = useState(null);
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

  const reportRef = useRef(null);

  // Normalize sign name
  const normalizeSign = (sign) => {
    if (!sign || sign === 'N/A') return 'Aries';
    return sign.trim().charAt(0).toUpperCase() + sign.trim().slice(1).toLowerCase();
  };

  // Fetch additional data from Supabase
  const fetchAdditionalData = async (ascendant, moonSign, planetsList) => {
    const cleanAscendant = normalizeSign(ascendant);
    const cleanMoonSign = normalizeSign(moonSign);

    try {
      if (cleanAscendant) {
        const { data: lagnaDataRes, error: lagnaErr } = await supabase.from('lagna_characteristics').select('*').eq('lagna_name', cleanAscendant).single();
        if (lagnaDataRes && !lagnaErr && lagnaDataRes.characteristics) {
          setLagnaData(lagnaDataRes);
        } else {
          setLagnaData(LAGNA_FALLBACKS[cleanAscendant] || LAGNA_FALLBACKS['Aries']); 
        }

        const { data: moonData } = await supabase.from('planet_drishti').select('*').eq('planet', 'Moon').eq('base_sign', cleanAscendant).single();
        if (moonData) setMoonDrishti(moonData);
        
        const { data: sunData } = await supabase.from('planet_drishti').select('*').eq('planet', 'Sun').eq('base_sign', cleanAscendant).single();
        if (sunData) setSunDrishti(sunData);

        const { data: compatData } = await supabase.from('compatibility_scores').select('*').or(`sign1.eq.${cleanAscendant},sign2.eq.${cleanAscendant}`).order('score', { ascending: false });
        if (compatData) setCompatibilityList(compatData);
      }

      if (cleanMoonSign) {
        const { data: currentSaturn } = await supabase.from('current_sade_sati').select('*').single();
        let phase = null;
        let isAffected = false;
        let saturnSign = CURRENT_SATURN_SIGN;

        if (currentSaturn) {
          isAffected = currentSaturn.affected_signs?.includes(cleanMoonSign);
          saturnSign = currentSaturn.saturn_sign || CURRENT_SATURN_SIGN;
          if (currentSaturn.first_phase_signs?.includes(cleanMoonSign)) phase = 'First Phase';
          else if (currentSaturn.second_phase_signs?.includes(cleanMoonSign)) phase = 'Second Phase';
          else if (currentSaturn.third_phase_signs?.includes(cleanMoonSign)) phase = 'Third Phase';
        } else {
          phase = SADE_SATI_PHASES[cleanMoonSign] || null;
          isAffected = !!phase;
        }

        setSadeSatiStatus({ isActive: isAffected, phase, moonSign: cleanMoonSign, saturnSign });

        if (isAffected) {
          const { data: sadeSatiDetails } = await supabase.from('sade_sati').select('*').eq('moon_sign', cleanMoonSign).order('phase_number', { ascending: true });
          if (sadeSatiDetails && sadeSatiDetails.length > 0) {
            setSadeSatiData(sadeSatiDetails.find(d => d.phase === phase));
          } else {
            setSadeSatiData(SADE_SATI_FALLBACKS[phase]); 
          }
        }
      }

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

      const { data: housesData } = await supabase.from('darakaraka_houses').select('*').order('house_number', { ascending: true });
      if (housesData) setDarakarakaHouses(housesData);

    } catch (err) {
      console.error('Data fetch error, using local engines:', err);
      if (cleanAscendant) setLagnaData(LAGNA_FALLBACKS[cleanAscendant] || LAGNA_FALLBACKS['Aries']);
      
      const phase = SADE_SATI_PHASES[cleanMoonSign] || null;
      const isAffected = !!phase;
      setSadeSatiStatus({ isActive: isAffected, phase, moonSign: cleanMoonSign, saturnSign: CURRENT_SATURN_SIGN });
      if (isAffected) setSadeSatiData(SADE_SATI_FALLBACKS[phase]);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem('kundliData') || sessionStorage.getItem('kundliData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setKundliData(parsedData);
      
      let planetsList = [];
      if (Array.isArray(parsedData.planets)) planetsList = parsedData.planets;
      else if (Array.isArray(parsedData.planets?.data)) planetsList = parsedData.planets.data;
      else if (Array.isArray(parsedData.data?.planets)) planetsList = parsedData.data.planets;
      
      let basicInfo = parsedData.basic || parsedData.basic_info || parsedData.reportData?.basic || {};
      if (basicInfo.data) basicInfo = { ...basicInfo, ...basicInfo.data };

      const ascPlanet = planetsList.find(p => p.name?.toLowerCase() === 'ascendant' || p.name?.toLowerCase() === 'lagna');
      const moonPlanet = planetsList.find(p => p.name?.toLowerCase() === 'moon');

      const ascendant = basicInfo.ascendant || basicInfo.lagna || basicInfo.Ascendant || basicInfo.Lagna || ascPlanet?.sign;
      const moonSign = basicInfo.sign || basicInfo.moon_sign || basicInfo.moonSign || basicInfo.MoonSign || moonPlanet?.sign;
      
      if (ascendant && planetsList.length > 0) {
        fetchAdditionalData(ascendant, moonSign, planetsList);
      }
    }
    setLoading(false);
  }, []);

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
        }
      } catch (err) {
        console.error("AI Error:", err);
      } finally {
        setIsAiLoading(false);
      }
    };
    fetchAIAndSave();
  }, [kundliData, user]);

  // ==========================================
  // PDF DOWNLOAD LOGIC CONNECTED TO BACKEND API
  // ==========================================
  const handleDownloadPdf = async () => {
    if (!kundliData) return;
    setIsDownloading(true);
    setDownloadProgress('Generating Premium Report...');
    
    try {
      // লোকাল স্টোরেজ থেকে ইউজারের সিলেক্ট করা ল্যাঙ্গুয়েজ নেওয়া হচ্ছে
      const selectedLanguage = localStorage.getItem('i18nextLng') || 'en';
      
      // জন্মতারিখ এবং সময় পার্স করা হচ্ছে API এর জন্য
      const dobParts = kundliData.userDetails?.dob ? kundliData.userDetails.dob.split('/') : ['1', '1', '2000'];
      const day = parseInt(dobParts[0]);
      const month = parseInt(dobParts[1]);
      const year = parseInt(dobParts[2]);

      let hour = 12;
      let minute = 0;
      if (kundliData.userDetails?.time) {
         const timeParts = kundliData.userDetails.time.split(' ');
         const hm = timeParts[0].split(':');
         hour = parseInt(hm[0]);
         minute = parseInt(hm[1]);
         if (timeParts[1] === 'PM' && hour !== 12) hour += 12;
         if (timeParts[1] === 'AM' && hour === 12) hour = 0;
      }

      const payload = {
        name: kundliData.userDetails?.name || "Seeker",
        language: selectedLanguage, // 'bn', 'hi', or 'en'
        day: day,
        month: month,
        year: year,
        hour: hour,
        min: minute,
        lat: kundliData.basic?.latitude || 28.6139,
        lon: kundliData.basic?.longitude || 77.2090,
        tzone: kundliData.basic?.timezone || 5.5,
        gender: kundliData.userDetails?.gender || "male"
      };

      setDownloadProgress('Connecting to Astro-Engine...');
      
      const response = await api.post('/report/generate-report', payload, {
        responseType: 'blob', // Important for PDF download
        timeout: 60000 // 60 seconds timeout as PDF generation takes time
      });

      setDownloadProgress('Downloading...');
      
      // ফাইলটি ব্রাউজারে ডাউনলোড করা
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${payload.name}_Premium_Kundli.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Oops! Failed to generate premium report. Please try again.");
    } finally {
      setIsDownloading(false);
      setDownloadProgress('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your cosmic chart...</p>
        </div>
      </div>
    );
  }

  let planetsList = [];
  if (kundliData) {
    if (Array.isArray(kundliData.planets)) planetsList = kundliData.planets;
    else if (Array.isArray(kundliData.planets?.data)) planetsList = kundliData.planets.data;
    else if (Array.isArray(kundliData.data?.planets)) planetsList = kundliData.data.planets;
  }

  let basicInfo = {};
  if (kundliData) {
    basicInfo = kundliData.basic || kundliData.basic_info || kundliData.reportData?.basic || {};
    if (basicInfo.data) basicInfo = { ...basicInfo, ...basicInfo.data };
  }

  const ascPlanet = planetsList.find(p => p.name?.toLowerCase() === 'ascendant' || p.name?.toLowerCase() === 'lagna');
  const moonPlanet = planetsList.find(p => p.name?.toLowerCase() === 'moon');

  const ascendantVal = normalizeSign(basicInfo.ascendant || basicInfo.lagna || basicInfo.Ascendant || basicInfo.Lagna || ascPlanet?.sign);
  const moonSignVal = normalizeSign(basicInfo.sign || basicInfo.moon_sign || basicInfo.moonSign || basicInfo.MoonSign || moonPlanet?.sign);
  const nakshatraVal = basicInfo.Naksahtra || basicInfo.nakshatra || basicInfo.Nakshatra || moonPlanet?.nakshatra || 'N/A';
  
  const getVarnaFromMoonSign = (sign) => {
    if (!sign || sign === 'N/A') return 'N/A';
    const brahmin = ['Cancer', 'Scorpio', 'Pisces'];
    const kshatriya = ['Aries', 'Leo', 'Sagittarius'];
    const vaishya = ['Taurus', 'Virgo', 'Capricorn'];
    const shudra = ['Gemini', 'Libra', 'Aquarius'];
    if (brahmin.includes(sign)) return 'Brahmin';
    if (kshatriya.includes(sign)) return 'Kshatriya';
    if (vaishya.includes(sign)) return 'Vaishya';
    if (shudra.includes(sign)) return 'Shudra';
    return 'N/A';
  };

  const varnaVal = basicInfo.Varna || basicInfo.varna || getVarnaFromMoonSign(moonSignVal);
  const userDetails = kundliData?.userDetails || {};

  if (!planetsList || planetsList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e9e6df] p-4 text-center">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-red-500">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl sm:text-2xl font-bold text-[#4a3727] mb-2">Cosmic Data Missing!</h2>
          <p className="text-slate-600 mb-6 text-sm sm:text-base font-medium">We couldn't find your planetary data. Please generate your Kundli again.</p>
          <button onClick={() => navigate('/kundli')} className="bg-[#b46f2c] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#8f551e] transition-colors shadow-md w-full">
            Go back to Kundli Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9e6df] to-[#dcd6cc] py-4 sm:py-8 px-2 sm:px-4 font-sans text-[#1e1b17]">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6 shadow-sm border border-[#dcd6cc]">
          <button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#4a3727] hover:text-[#b46f2c] font-bold px-4 py-2.5 sm:py-2 bg-white rounded-xl shadow-sm border border-orange-50">
            <ArrowLeft size={18} /> Dashboard
          </button>
          
          <button onClick={handleDownloadPdf} disabled={isDownloading} className="w-full sm:w-auto flex flex-col items-center justify-center gap-1 bg-[#b46f2c] text-white font-bold px-6 py-2 rounded-xl hover:bg-[#8f551e] transition-colors disabled:opacity-70 shadow-md">
            <div className="flex items-center gap-2">
              {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />} 
              {isDownloading ? 'Generating...' : 'Download Premium PDF'}
            </div>
            {isDownloading && <span className="text-[10px] font-normal tracking-wider opacity-80">{downloadProgress}</span>}
          </button>
        </div>

        <div ref={reportRef} className="bg-[#fefaf5] rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden pb-4 sm:pb-6">
          
          <div className="bg-[#2c2a24] p-5 sm:p-8 border-b-[5px] border-[#e6b34c]">
            <h1 className="text-[#f7e9cd] font-semibold text-xl sm:text-2xl md:text-3xl flex items-center gap-2 sm:gap-3 leading-tight">
              <Sparkles className="text-[#e6b34c] flex-shrink-0" size={24} /> Comprehensive Astrological Report
            </h1>
            <p className="text-[#cbc3ae] mt-2 text-xs sm:text-sm">Vedic Astrology • Janam Kundali Analysis • AI Predictions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-8">
            <div className="bg-white rounded-2xl border border-[#f0e7db] overflow-hidden shadow-sm">
              <div className="bg-[#fffbf5] border-l-[4px] sm:border-l-[5px] border-[#e6b34c] text-[#4a3727] font-bold text-base sm:text-lg py-2.5 sm:py-3 px-4 sm:px-6 border-b flex items-center gap-2">
                <User size={18} className="text-[#e6b34c]" /> Birth Details
              </div>
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-[#c28135]">Name:</strong> <span className="font-medium">{userDetails.name || user?.name || "Seeker"}</span></div>
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-[#c28135]">Gender:</strong> <span className="font-medium">{userDetails.gender || "Male"}</span></div>
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-[#c28135]">Date:</strong> <span className="font-medium">{userDetails.dob || "N/A"}</span></div>
                <div className="flex sm:block justify-between"><strong className="text-[#c28135]">Place:</strong> <span className="font-medium text-right sm:text-left">{userDetails.place || "N/A"}</span></div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#f0e7db] overflow-hidden shadow-sm">
              <div className="bg-[#fffbf5] border-l-[4px] sm:border-l-[5px] border-[#e6b34c] text-[#4a3727] font-bold text-base sm:text-lg py-2.5 sm:py-3 px-4 sm:px-6 border-b flex items-center gap-2">
                <Star size={18} className="text-[#e6b34c]" /> Astrological Details
              </div>
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-[#c28135]">Ascendant:</strong> <span className="font-medium">{ascendantVal}</span></div>
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-[#c28135]">Moon Sign:</strong> <span className="font-medium">{moonSignVal}</span></div>
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-[#c28135]">Nakshatra:</strong> <span className="font-medium">{nakshatraVal}</span></div>
                <div className="flex sm:block justify-between"><strong className="text-[#c28135]">Varna:</strong> <span className="font-medium">{varnaVal}</span></div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#f0e7db] overflow-hidden shadow-sm">
              <div className="bg-[#fffbf5] border-l-[4px] sm:border-l-[5px] border-[#e6b34c] text-[#4a3727] font-bold text-base sm:text-lg py-3 px-4 sm:px-6 border-b text-center tracking-wide">
                🕉️ Astrological Charts
              </div>
              
              <div className="p-3 sm:p-6 md:p-10 flex flex-col gap-8 md:gap-12 justify-center items-center">
                <div className="w-full">
                  <h3 className="text-center font-extrabold text-[#4a3727] text-xl sm:text-2xl mb-4 sm:mb-6 tracking-wide">Lagna Chart (D-1)</h3>
                  <div className="p-2 sm:p-4 md:p-8 border sm:border-2 border-orange-100 rounded-xl sm:rounded-[2rem] bg-[#fffdfa] shadow-inner flex justify-center overflow-hidden w-full">
                    <div className="w-full max-w-[1100px]">
                      <KundliChart planets={planetsList} ascendant={ascendantVal} />
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-5xl mx-auto">
                  <PlanetTable planets={planetsList} />
                </div>
              </div>
            </div>
          </div>

          {lagnaData && (
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" /> Your Ascendant: {ascendantVal}
                </h2>
                <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
                <p className="text-gray-500 text-xs sm:text-sm mt-2 px-2">How the world perceives you and your natural approach to life</p>
              </div>
              <LagnaCard data={lagnaData} />
            </div>
          )}

          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
             <SadeSatiCard sadeSatiData={sadeSatiData} sadeSatiStatus={sadeSatiStatus} />
          </div>

          {darakaraka && (
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" /> Darakaraka
                </h2>
                <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent mx-auto"></div>
                <p className="text-gray-500 text-xs sm:text-sm mt-2 px-2">The significator of your life partner and relationship karma</p>
              </div>
              <DarakarakaCard data={darakaraka} />
            </div>
          )}

          {darakarakaHouses.length > 0 && (
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" /> Darakaraka Houses
                </h2>
                <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
              </div>
              <DarakarakaHouses />
            </div>
          )}

          {(moonDrishti || sunDrishti) && (
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" /> Planetary Aspects (Drishti)
                </h2>
                <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <DrishtiCard title="🌙 Chandra (Moon)" icon={Moon} data={moonDrishti} isMoon={true} />
                <DrishtiCard title="☀️ Surya (Sun)" icon={Sun} data={sunDrishti} isMoon={false} />
              </div>
            </div>
          )}

          {compatibilityList.length > 0 && (
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" /> Zodiac Compatibility
                </h2>
                <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {compatibilityList.map((comp, idx) => (
                  <CompatibilityCard key={idx} compatibility={comp} ascendantSign={ascendantVal} />
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          <div className="px-4 sm:px-8 pb-4 sm:pb-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#f0e7db] overflow-hidden shadow-sm">
              <div className="bg-[#fffbf5] border-l-[4px] sm:border-l-[5px] border-[#e6b34c] text-[#4a3727] font-bold text-base sm:text-lg py-2.5 sm:py-3 px-4 sm:px-6 border-b flex items-center gap-2">
                <Sparkles size={18} className="text-[#e6b34c] flex-shrink-0"/> AI Cosmic Insights
              </div>
              <div className="p-4 sm:p-8">
                {isAiLoading ? (
                  <div className="flex flex-col items-center py-8 sm:py-10">
                    <Loader2 className="animate-spin text-[#c28135] mb-3" size={32} />
                    <p className="text-[#8b765c] text-sm sm:text-base font-medium animate-pulse">AI is reading the stars...</p>
                  </div>
                ) : (
                  <div className="text-[#2e2a24] text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose whitespace-pre-line font-medium bg-[#fefaf2] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#f0e2d2]">
                    {aiInsights || "Your personalized AI insights could not be loaded."}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center p-4 sm:p-6 mt-2 text-[#a08c74] border-t border-[#ede3d7] bg-[#fefaf5] text-[10px] sm:text-xs">
            © 2026 Kaal Chakra | Vedic Sidereal Calculations
          </div>
        </div>
      </div>
    </div>
  );
};

export default KundliResult;