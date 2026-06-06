import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Sparkles, AlertTriangle, Star, User, Heart, Shield, HeartHandshake, Eye, Moon, Sun, Crown, FileText } from 'lucide-react';
import KundliChart from '../components/kundli/KundliChart';
import PlanetTable from '../components/kundli/PlanetTable';
import SadeSatiCard from '../components/kundli/SadeSatiCard';
import DarakarakaHouses from '../components/kundli/DarakarakaHouses/DarakarakaHouses';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import api from '../services/api';
import { initiatePayment } from '../utils/razorpay';

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
    <div className="bg-gradient-to-br from-purple-50/80 via-purple-50/50 to-pink-50/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-purple-100/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{ boxShadow: '0 10px 30px rgba(147,51,234,0.08), 0 0 20px rgba(147,51,234,0.05), inset 0 1px 0 rgba(255,255,255,0.5)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p className="text-xs sm:text-sm text-purple-600 uppercase tracking-wider font-bold">Characteristics</p>
          <p className="font-medium text-gray-800 mt-1 text-sm sm:text-base">{data.characteristics || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-purple-600 uppercase tracking-wider font-bold">Strengths</p>
          <p className="font-medium text-gray-800 mt-1 text-sm sm:text-base">{data.strengths || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-purple-600 uppercase tracking-wider font-bold">Weaknesses</p>
          <p className="font-medium text-gray-800 mt-1 text-sm sm:text-base">{data.weaknesses || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-purple-600 uppercase tracking-wider font-bold">Lucky Color</p>
          <p className="font-medium text-gray-800 mt-1 text-sm sm:text-base">{data.lucky_color || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

const DarakarakaCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="bg-gradient-to-br from-pink-50/80 via-pink-50/50 to-rose-50/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-pink-100/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{ boxShadow: '0 10px 30px rgba(236,72,153,0.08), 0 0 20px rgba(236,72,153,0.05), inset 0 1px 0 rgba(255,255,255,0.5)' }}>
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-lg"
          style={{ boxShadow: '0 0 20px rgba(236,72,153,0.3)' }}>
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{data.planet} Darakaraka</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div><p className="text-xs sm:text-sm text-pink-600 uppercase tracking-wider font-bold">Partner Nature</p><p className="font-medium text-gray-800 text-sm sm:text-base mt-1">{data.partner_nature || 'N/A'}</p></div>
        <div><p className="text-xs sm:text-sm text-pink-600 uppercase tracking-wider font-bold">Relationship Dynamics</p><p className="font-medium text-gray-800 text-sm sm:text-base mt-1">{data.relationship_dynamics || 'N/A'}</p></div>
        <div><p className="text-xs sm:text-sm text-pink-600 uppercase tracking-wider font-bold">Challenges</p><p className="font-medium text-gray-800 text-sm sm:text-base mt-1">{data.challenges || 'N/A'}</p></div>
        <div><p className="text-xs sm:text-sm text-pink-600 uppercase tracking-wider font-bold">Remedies</p><p className="font-medium text-gray-800 text-sm sm:text-base mt-1">{data.remedies || 'N/A'}</p></div>
      </div>
    </div>
  );
};

const DrishtiCard = ({ title, icon: Icon, data, isMoon }) => {
  if (!data) return null;
  return (
    <div className={`rounded-2xl p-4 sm:p-5 border shadow-lg hover:shadow-xl transition-shadow duration-300 ${
      isMoon 
        ? 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-100/50' 
        : 'bg-gradient-to-br from-orange-50/80 to-amber-50/80 border-orange-100/50'
    }`}
      style={{ boxShadow: isMoon 
        ? '0 10px 30px rgba(59,130,246,0.08), 0 0 20px rgba(59,130,246,0.05), inset 0 1px 0 rgba(255,255,255,0.5)'
        : '0 10px 30px rgba(249,115,22,0.08), 0 0 20px rgba(249,115,22,0.05), inset 0 1px 0 rgba(255,255,255,0.5)'
      }}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
          isMoon ? 'bg-gradient-to-br from-blue-400 to-indigo-400' : 'bg-gradient-to-br from-orange-400 to-amber-400'
        }`}
          style={{ boxShadow: isMoon ? '0 0 15px rgba(59,130,246,0.3)' : '0 0 15px rgba(249,115,22,0.3)' }}>
          <Icon className="w-4 h-4 text-white" />
        </div>
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
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 sm:p-4 text-center border border-gray-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      style={{ boxShadow: '0 8px 25px rgba(0,0,0,0.06)' }}>
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
  const [isPremiumLoading, setIsPremiumLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState('');
  const [kundliData, setKundliData] = useState(null);
  const [aiInsights, setAiInsights] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [moonDrishti, setMoonDrishti] = useState(null);
  const [sunDrishti, setSunDrishti] = useState(null);
  const [darakaraka, setDarakaraka] = useState(null);
  const [compatibilityList, setCompatibilityList] = useState([]);
  const [sadeSatiData, setSadeSatiData] = useState(null);
  const [sadeSatiStatus, setSadeSatiStatus] = useState(null);
  const [lagnaData, setLagnaData] = useState(null);
  const [darakarakaHouses, setDarakarakaHouses] = useState([]);

  const reportRef = useRef(null);

  const normalizeSign = (sign) => {
    if (!sign || sign === 'N/A') return 'Aries';
    return sign.trim().charAt(0).toUpperCase() + sign.trim().slice(1).toLowerCase();
  };

  const fetchAdditionalData = async (ascendant, moonSign, planetsList) => {
    const cleanAscendant = normalizeSign(ascendant);
    const cleanMoonSign = normalizeSign(moonSign);

    try {
      if (cleanAscendant) {
        const { data: lagnaDataRes, error: lagnaErr } = await supabase.from('lagna_characteristics').select('*').eq('lagna_name', cleanAscendant).maybeSingle();
        if (lagnaDataRes && !lagnaErr && lagnaDataRes.characteristics) {
          setLagnaData(lagnaDataRes);
        } else {
          setLagnaData(LAGNA_FALLBACKS[cleanAscendant] || LAGNA_FALLBACKS['Aries']);
        }

        const { data: moonData } = await supabase.from('planet_drishti').select('*').eq('planet', 'Moon').eq('base_sign', cleanAscendant).maybeSingle();
        if (moonData) setMoonDrishti(moonData);

        const { data: sunData } = await supabase.from('planet_drishti').select('*').eq('planet', 'Sun').eq('base_sign', cleanAscendant).maybeSingle();
        if (sunData) setSunDrishti(sunData);

        const { data: compatData } = await supabase.from('compatibility_scores').select('*').or(`sign1.eq.${cleanAscendant},sign2.eq.${cleanAscendant}`).order('score', { ascending: false });
        if (compatData) setCompatibilityList(compatData);
      }

      if (cleanMoonSign) {
        const { data: currentSaturn } = await supabase.from('current_sade_sati').select('*').maybeSingle();
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
          const { data: dkData } = await supabase.from('darakaraka_planets').select('*').eq('planet', darakarakaPlanet).maybeSingle();
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

  // ==========================================
  // PREMIUM PDF DOWNLOAD LOGIC
  // ==========================================
  const handlePremiumDownload = async () => {
    if (!kundliData) return;
    setIsPremiumLoading(true);

    try {
      const paymentResult = await new Promise((resolve) => {
        initiatePayment({
          amount: 49900,
          currency: "INR",
          description: "Premium Kundli Report (200+ Pages)",
          prefill: { 
            name: kundliData.userDetails?.name || user?.name || "Seeker", 
            email: user?.email || "user@example.com",
            contact: user?.phone || ""
          }
        }, (res) => resolve({ success: true }), (err) => resolve({ success: false }));
      });

      if (paymentResult.success) {
        const selectedLanguage = localStorage.getItem('i18nextLng') || 'en';
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
          name: kundliData.userDetails?.name || user?.name || "Seeker",
          language: selectedLanguage,
          day: day,
          month: month,
          year: year,
          hour: hour,
          min: minute,
          lat: kundliData.basic?.latitude || 28.6139,
          lon: kundliData.basic?.longitude || 77.2090,
          tzone: kundliData.basic?.timezone || 5.5,
          gender: kundliData.userDetails?.gender || "male",
          isPremium: true
        };

        const response = await api.post('/reports/generate-premium-report', payload, { 
            responseType: 'blob',
            timeout: 180000 
        });

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${payload.name}_Premium_Kundli.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        alert("Payment Successful! Your 200+ page report has been downloaded.");
      }
    } catch (error) {
      console.error("Premium Flow Failed:", error);
      alert("Payment or report generation failed. Please try again.");
    } finally {
      setIsPremiumLoading(false);
    }
  };

  // ==========================================
  // FREE PDF DOWNLOAD LOGIC
  // ==========================================
  const handleDownloadPdf = async () => {
    if (!kundliData) return;
    setIsDownloading(true);
    setDownloadProgress('Generating Basic Report...');

    try {
      const selectedLanguage = localStorage.getItem('i18nextLng') || 'en';
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
        language: selectedLanguage,
        day: day,
        month: month,
        year: year,
        hour: hour,
        min: minute,
        lat: kundliData.basic?.latitude || 28.6139,
        lon: kundliData.basic?.longitude || 77.2090,
        tzone: kundliData.basic?.timezone || 5.5,
        gender: kundliData.userDetails?.gender || "male",
        isPremium: false
      };

      setDownloadProgress('Connecting to Astro-Engine...');

      const response = await api.post('/reports/generate-free-report', payload, { 
        responseType: 'blob',
        timeout: 60000
      });

      setDownloadProgress('Downloading...');

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${payload.name}_Basic_Kundli.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Oops! Failed to generate free report. Please try again.");
    } finally {
      setIsDownloading(false);
      setDownloadProgress('');
    }
  };

  const handleFreeDownload = () => {
    handleDownloadPdf();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f0] via-[#fef5e7] to-[#fdf2e9]">
        <div className="text-center relative">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-spin-slow"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-amber-400 border-r-orange-400 border-b-amber-300 border-l-orange-300 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={28} className="text-amber-500 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-lg animate-pulse">Loading your cosmic chart...</p>
        </div>
        <style>{`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fef9f0] via-[#fef5e7] to-[#fdf2e9] p-4 text-center">
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-amber-200"
          style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.1), 0 0 30px rgba(212,175,55,0.1)' }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(239,68,68,0.15)' }}>
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Cosmic Data Missing!</h2>
          <p className="text-slate-600 mb-6 text-sm sm:text-base font-medium">We couldn't find your planetary data. Please generate your Kundli again.</p>
          <button onClick={() => navigate('/kundli')} className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ boxShadow: '0 10px 30px rgba(249,115,22,0.3)' }}>
            Go back to Kundli Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f0] via-[#fef5e7] to-[#fdf2e9] py-4 sm:py-8 px-2 sm:px-4 font-sans text-[#1e1b17]">
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-amber-200/10 to-orange-200/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full bg-gradient-to-tl from-amber-200/10 to-orange-200/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6 shadow-xl border border-amber-100/50"
          style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.06), 0 0 20px rgba(212,175,55,0.05)' }}>
          
          <button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-700 hover:text-orange-600 font-bold px-5 py-3 sm:py-2.5 bg-white rounded-xl shadow-md border border-amber-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <ArrowLeft size={18} /> Dashboard
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Free Download Button */}
            <button
              onClick={handleFreeDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-bold px-5 py-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:from-gray-200 hover:to-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span className="text-sm">{downloadProgress || 'Downloading...'}</span>
                </>
              ) : (
                <>
                  <FileText size={18} className="text-gray-500" />
                  <span className="text-sm">Download Basic PDF</span>
                </>
              )}
            </button>

            {/* Premium Unlock Button */}
            <button
              onClick={handlePremiumDownload}
              disabled={isPremiumLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 relative overflow-hidden group"
              style={{ boxShadow: '0 10px 30px rgba(245,158,11,0.3), 0 0 20px rgba(249,115,22,0.15)' }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isPremiumLoading ? (
                <Loader2 className="animate-spin w-5 h-5 relative z-10" />
              ) : (
                <Crown size={18} className="relative z-10" />
              )}
              <span className="relative z-10 text-sm">
                {isPremiumLoading ? 'Processing...' : 'Unlock Premium (200+ Pages)'}
              </span>
            </button>
          </div>
        </div>

        {/* Main Report Container */}
        <div ref={reportRef} className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden pb-4 sm:pb-6 border border-amber-100/50"
          style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.08), 0 0 40px rgba(212,175,55,0.08), 0 0 80px rgba(249,115,22,0.03)' }}>

          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-[#1a1520] via-[#2d2333] to-[#1a1520] p-5 sm:p-8 border-b-[4px] border-amber-400 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #d4af37 1px, transparent 1px)',
                backgroundSize: '25px 25px',
              }} />
            
            {/* Glow orbs */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-orange-400/10 blur-2xl" />
            
            <h1 className="text-[#f7e9cd] font-bold text-xl sm:text-2xl md:text-3xl flex items-center gap-2 sm:gap-3 leading-tight relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
                style={{ boxShadow: '0 0 25px rgba(245,158,11,0.4)' }}>
                <Sparkles className="text-white flex-shrink-0" size={20} />
              </div>
              Comprehensive Astrological Report
            </h1>
            <p className="text-[#cbc3ae] mt-2 text-xs sm:text-sm relative z-10 pl-12">Vedic Astrology • Janam Kundali Analysis • AI Predictions</p>
          </div>

          {/* Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-8">
            {/* Birth Details Card */}
            <div className="bg-white rounded-2xl border border-amber-100/50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-[5px] border-amber-400 text-gray-800 font-bold text-base sm:text-lg py-3 px-4 sm:px-6 border-b flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md"
                  style={{ boxShadow: '0 0 15px rgba(245,158,11,0.3)' }}>
                  <User size={16} className="text-white" />
                </div>
                Birth Details
              </div>
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-amber-600">Name:</strong> <span className="font-medium text-gray-700">{userDetails.name || user?.name || "Seeker"}</span></div>
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-amber-600">Gender:</strong> <span className="font-medium text-gray-700">{userDetails.gender || "Male"}</span></div>
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-amber-600">Date:</strong> <span className="font-medium text-gray-700">{userDetails.dob || "N/A"}</span></div>
                <div className="flex sm:block justify-between"><strong className="text-amber-600">Place:</strong> <span className="font-medium text-gray-700 text-right sm:text-left">{userDetails.place || "N/A"}</span></div>
              </div>
            </div>

            {/* Astrological Details Card */}
            <div className="bg-white rounded-2xl border border-amber-100/50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-[5px] border-amber-400 text-gray-800 font-bold text-base sm:text-lg py-3 px-4 sm:px-6 border-b flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md"
                  style={{ boxShadow: '0 0 15px rgba(245,158,11,0.3)' }}>
                  <Star size={16} className="text-white" />
                </div>
                Astrological Details
              </div>
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-amber-600">Ascendant:</strong> <span className="font-medium text-gray-700">{ascendantVal}</span></div>
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-amber-600">Moon Sign:</strong> <span className="font-medium text-gray-700">{moonSignVal}</span></div>
                <div className="flex sm:block justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><strong className="text-amber-600">Nakshatra:</strong> <span className="font-medium text-gray-700">{nakshatraVal}</span></div>
                <div className="flex sm:block justify-between"><strong className="text-amber-600">Varna:</strong> <span className="font-medium text-gray-700">{varnaVal}</span></div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-amber-100/50 overflow-hidden shadow-lg"
              style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-[5px] border-amber-400 text-gray-800 font-bold text-base sm:text-lg py-3 px-4 sm:px-6 border-b text-center tracking-wide">
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  🕉️ Astrological Charts 🕉️
                  <Sparkles size={18} className="text-amber-500" />
                </span>
              </div>

              <div className="p-3 sm:p-6 md:p-10 flex flex-col gap-8 md:gap-12 justify-center items-center">
                <div className="w-full">
                  <h3 className="text-center font-extrabold text-gray-800 text-xl sm:text-2xl mb-4 sm:mb-6 tracking-wide">Lagna Chart (D-1)</h3>
                  <div className="p-2 sm:p-4 md:p-8 border-2 border-amber-100 rounded-xl sm:rounded-[2rem] bg-gradient-to-br from-[#fffdfa] to-[#fefaf2] shadow-inner flex justify-center overflow-hidden w-full">
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

          {/* Lagna Card Section */}
          {lagnaData && (
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-violet-400 flex items-center justify-center shadow-md"
                    style={{ boxShadow: '0 0 15px rgba(147,51,234,0.3)' }}>
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  Your Ascendant: {ascendantVal}
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
                <p className="text-gray-500 text-xs sm:text-sm mt-2 px-2">How the world perceives you and your natural approach to life</p>
              </div>
              <LagnaCard data={lagnaData} />
            </div>
          )}

          {/* Sade Sati Section */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <SadeSatiCard sadeSatiData={sadeSatiData} sadeSatiStatus={sadeSatiStatus} />
          </div>

          {/* Darakaraka Section */}
          {darakaraka && (
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-md"
                    style={{ boxShadow: '0 0 15px rgba(236,72,153,0.3)' }}>
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  Darakaraka
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"></div>
                <p className="text-gray-500 text-xs sm:text-sm mt-2 px-2">The significator of your life partner and relationship karma</p>
              </div>
              <DarakarakaCard data={darakaraka} />
            </div>
          )}

          {/* Darakaraka Houses Section */}
          {darakarakaHouses.length > 0 && (
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-violet-400 flex items-center justify-center shadow-md"
                    style={{ boxShadow: '0 0 15px rgba(147,51,234,0.3)' }}>
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  Darakaraka Houses
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
              </div>
              <DarakarakaHouses />
            </div>
          )}

          {/* Planetary Aspects Section */}
          {(moonDrishti || sunDrishti) && (
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center shadow-md"
                    style={{ boxShadow: '0 0 15px rgba(99,102,241,0.3)' }}>
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  Planetary Aspects (Drishti)
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <DrishtiCard title="🌙 Chandra (Moon)" icon={Moon} data={moonDrishti} isMoon={true} />
                <DrishtiCard title="☀️ Surya (Sun)" icon={Sun} data={sunDrishti} isMoon={false} />
              </div>
            </div>
          )}

          {/* Compatibility Section */}
          {compatibilityList.length > 0 && (
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center shadow-md"
                    style={{ boxShadow: '0 0 15px rgba(249,115,22,0.3)' }}>
                    <HeartHandshake className="w-4 h-4 text-white" />
                  </div>
                  Zodiac Compatibility
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {compatibilityList.map((comp, idx) => (
                  <CompatibilityCard key={idx} compatibility={comp} ascendantSign={ascendantVal} />
                ))}
              </div>
            </div>
          )}

          {/* AI Insights Section */}
          <div className="px-4 sm:px-8 pb-4 sm:pb-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-amber-100/50 overflow-hidden shadow-lg"
              style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-[5px] border-amber-400 text-gray-800 font-bold text-base sm:text-lg py-3 px-4 sm:px-6 border-b flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md"
                  style={{ boxShadow: '0 0 15px rgba(245,158,11,0.3)' }}>
                  <Sparkles size={16} className="text-white" />
                </div>
                AI Cosmic Insights
              </div>
              <div className="p-4 sm:p-8">
                {isAiLoading ? (
                  <div className="flex flex-col items-center py-8 sm:py-10">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-full border-3 border-amber-200 animate-spin-slow"></div>
                      <div className="absolute inset-2 rounded-full border-3 border-t-amber-400 border-r-orange-400 border-b-amber-300 border-l-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={20} className="text-amber-500" />
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base font-medium animate-pulse">AI is reading the stars...</p>
                  </div>
                ) : (
                  <div className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose whitespace-pre-line font-medium bg-gradient-to-br from-[#fefaf2] to-[#fef9f0] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-amber-100"
                    style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                    {aiInsights || "Your personalized AI insights could not be loaded."}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center p-4 sm:p-6 mt-2 text-gray-500 border-t border-amber-100 bg-gradient-to-r from-[#fefaf2] to-[#fef9f0] text-[10px] sm:text-xs font-medium">
            © 2026 Kaal Chakra | Vedic Sidereal Calculations
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default KundliResult;