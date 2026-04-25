// client/src/pages/KundliResult.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Sparkles, AlertTriangle, Calendar, Star, Zap, Gem, User, MapPin, Moon, Sun, Eye, Heart, Shield, Brain, Users, HeartHandshake, Saturn } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import KundliChart from '../components/kundli/KundliChart.jsx';
import PlanetTable from '../components/kundli/PlanetTable.jsx';
import PredictionSection from '../components/kundli/PredictionSection.jsx';
import SadeSatiCard from '../components/kundli/SadeSatiCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';

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
  const [loadingDrishti, setLoadingDrishti] = useState(false);

  const reportRef = useRef(null);

  useEffect(() => {
    const loadData = () => {
      console.log("🟢 KundliResult page loaded");
      console.log("🔍 Location state:", location.state);

      const storedData = localStorage.getItem('kundliData');
      console.log("💾 localStorage data:", storedData);

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log("✅ Parsed data:", parsedData);

          if (parsedData.userDetails || (parsedData.basic && parsedData.planets)) {
            setKundliData(parsedData);

            // Fetch Moon and Sun Drishti based on chart data
            if (parsedData.basic && parsedData.basic.ascendant) {
              fetchDrishtiData(parsedData.basic.ascendant);
              fetchCompatibilityData(parsedData.basic.ascendant);
              fetchLagnaData(parsedData.basic.ascendant);
            }

            // Fetch Moon Sign for Sade Sati calculation
            if (parsedData.basic && parsedData.basic.moon_sign) {
              fetchSadeSatiData(parsedData.basic.moon_sign);
            } else if (parsedData.basic && parsedData.basic.sign) {
              fetchSadeSatiData(parsedData.basic.sign);
            }

            // Fetch Darakaraka if available
            if (parsedData.darakaraka && parsedData.darakaraka.planet) {
              fetchDarakarakaData(parsedData.darakaraka.planet);
            } else if (parsedData.planets) {
              calculateAndFetchDarakaraka(parsedData.planets);
            }

            setLoading(false);
            return;
          } else {
            console.warn("⚠️ Data missing required fields");
          }
        } catch (err) {
          console.error("❌ Error parsing data:", err);
        }
      }

      setError("No Kundli data found. Please generate a new report.");
      setLoading(false);
    };

    loadData();
  }, [location]);

  // Fetch Lagna Data from Supabase
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

  // Fetch Sade Sati Data from Supabase
  const fetchSadeSatiData = async (moonSign) => {
    if (!moonSign) return;

    try {
      // Get current Saturn position (Saturn is in Pisces currently)
      const { data: currentSaturn } = await supabase
        .from('current_sade_sati')
        .select('*')
        .single();

      // Check if user's moon sign is affected
      const isAffected = currentSaturn?.affected_signs?.includes(moonSign);

      // Determine which phase
      let phase = null;
      if (currentSaturn?.first_phase_signs?.includes(moonSign)) phase = 'First Phase';
      else if (currentSaturn?.second_phase_signs?.includes(moonSign)) phase = 'Second Phase';
      else if (currentSaturn?.third_phase_signs?.includes(moonSign)) phase = 'Third Phase';

      // Fetch detailed Sade Sati data for the moon sign
      const { data: sadeSatiDetails, error } = await supabase
        .from('sade_sati')
        .select('*')
        .eq('moon_sign', moonSign)
        .order('phase_number', { ascending: true });

      if (sadeSatiDetails && !error) {
        // Find the current phase data
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

  // Calculate Darakaraka from planets data (lowest degree)
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

  // Calculate and fetch Darakaraka
  const calculateAndFetchDarakaraka = async (planetsList) => {
    const darakarakaPlanet = calculateDarakarakaPlanet(planetsList);
    if (darakarakaPlanet) {
      await fetchDarakarakaData(darakarakaPlanet);
    }
  };

  const fetchDrishtiData = async (ascendant) => {
    setLoadingDrishti(true);
    try {
      // Fetch Moon Drishti for the ascendant sign
      const { data: moonData, error: moonError } = await supabase
        .from('planet_drishti')
        .select('*')
        .eq('planet', 'Moon')
        .eq('base_sign', ascendant)
        .single();

      if (moonData && !moonError) {
        setMoonDrishti(moonData);
      }

      // Fetch Sun Drishti for the ascendant sign
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
    } finally {
      setLoadingDrishti(false);
    }
  };

  // Function to get planet aspect data
  const getPlanetAspect = async (planetFrom, planetTo) => {
    try {
      const { data, error } = await supabase
        .from('planet_other_effects')
        .select('*')
        .eq('planet_aspect', `${planetFrom} → ${planetTo}`)
        .single();

      return data;
    } catch (err) {
      console.error('Error fetching planet aspect:', err);
      return null;
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
          <div className="mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">{data.concept_content?.[0] || 'Your ascendant defines how the world perceives you.'}</p>
          </div>

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

          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-600 font-semibold mb-2 flex items-center gap-1">
              <Heart className="w-3 h-3" /> Relationships & Love
            </p>
            <ul className="space-y-1">
              {data.relationships && data.relationships.slice(0, 3).map((rel, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-400">•</span> {rel}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 rounded-lg p-3">
            <p className="text-xs text-amber-600 font-semibold mb-2 flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> Ideal Career Paths
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
              <Shield className="w-3 h-3" /> Life Lesson & Affirmation
            </p>
            <p className="text-sm text-gray-700 italic">"{data.affirmation}"</p>
          </div>
        </div>
      </div>
    );
  };

  // Darakaraka Card Component
  const DarakarakaCard = ({ data }) => {
    if (!data) return null;

    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6" />
            <h3 className="font-bold text-lg">Darakaraka: {data.planet}</h3>
          </div>
          <p className="text-pink-100 text-sm mt-1">The significator of life partner and relationship karma</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-600 font-semibold mb-2">✨ Positive Traits of Spouse</p>
              <ul className="space-y-1">
                {data.positive_traits && data.positive_traits.map((trait, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500">✓</span> {trait}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs text-red-600 font-semibold mb-2">⚠️ Challenges in Relationship</p>
              <ul className="space-y-1">
                {data.challenges && data.challenges.map((challenge, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-red-500">•</span> {challenge}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-purple-600 font-semibold mb-2 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Spiritual Lesson
            </p>
            <p className="text-sm text-gray-700">{data.spiritual_lesson}</p>
          </div>

          <div>
            <p className="text-xs text-orange-600 font-semibold mb-2 flex items-center gap-1">
              <Heart className="w-3 h-3" /> Remedies
            </p>
            <ul className="space-y-1">
              {data.remedies && data.remedies.map((remedy, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-orange-400">•</span> {remedy}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Compatibility Card Component
  const CompatibilityCard = ({ compatibility }) => {
    const getColorByScore = (score) => {
      if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
      if (score >= 6) return 'text-orange-500 bg-orange-50 border-orange-200';
      if (score >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      return 'text-red-500 bg-red-50 border-red-200';
    };

    const otherSign = compatibility.sign1 === basicInfo.ascendant ? compatibility.sign2 : compatibility.sign1;

    return (
      <div className={`rounded-lg p-3 border ${getColorByScore(compatibility.score)}`}>
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
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
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

  // Drishti Card Component
  const DrishtiCard = ({ title, icon: Icon, data, isMoon }) => {
    if (!data) return null;

    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
        <div className={`p-4 ${isMoon ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-orange-500 to-red-500'} text-white`}>
          <div className="flex items-center gap-2">
            <Icon className="w-6 h-6" />
            <h3 className="font-bold text-lg">{title} Drishti ({data.base_sign} → {data.target_sign})</h3>
          </div>
        </div>
        <div className="p-5">
          <p className="text-gray-700 leading-relaxed mb-4">{data.effect}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-600 font-semibold mb-1">✨ Positive Traits</p>
              <p className="text-sm text-gray-700">{data.positive_trait}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs text-red-600 font-semibold mb-1">⚠️ Challenges</p>
              <p className="text-sm text-gray-700">{data.challenge_trait}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-orange-600 font-semibold mb-2 flex items-center gap-1"><Heart className="w-3 h-3" /> Remedies</p>
            <ul className="space-y-1">
              {data.remedies && data.remedies.map((remedy, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-orange-400">•</span> {remedy}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Sade Sati Card Component
  const SadeSatiCard = () => {
    if (!sadeSatiStatus) return null;

    return (
      <div className="px-8 pb-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Saturn className="w-6 h-6 text-gray-700" /> Shani Sade Sati
          </h2>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-auto"></div>
          <p className="text-gray-500 text-sm mt-2">7.5 years of karmic growth and transformation</p>
          <p className="text-xs text-gray-400 mt-1">Your Moon Sign: {sadeSatiStatus.moonSign}</p>
        </div>

        <div className={`rounded-xl overflow-hidden border-2 ${sadeSatiStatus.isActive ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50' : 'border-gray-200 bg-gray-50'
          }`}>
          <div className={`p-4 ${sadeSatiStatus.isActive ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gray-600'} text-white`}>
            <div className="flex items-center gap-2">
              <Saturn className="w-6 h-6" />
              <h3 className="font-bold text-lg">
                {sadeSatiStatus.isActive ? '🔴 Sade Sati is Active' : '🟢 No Active Sade Sati'}
              </h3>
            </div>
            {sadeSatiStatus.isActive && (
              <p className="text-gray-300 text-sm mt-1">
                {sadeSatiStatus.phase} • Shani in Meena (Pisces)
              </p>
            )}
          </div>

          {sadeSatiData && sadeSatiStatus.isActive ? (
            <div className="p-5">
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{sadeSatiData.effect_description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-semibold mb-2">✨ Positive Aspects</p>
                  <p className="text-sm text-gray-700">{sadeSatiData.positive_aspects}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-semibold mb-2">⚠️ Challenges</p>
                  <p className="text-sm text-gray-700">{sadeSatiData.challenges}</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-purple-600 font-semibold mb-2 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Spiritual Lesson
                </p>
                <p className="text-sm text-gray-700">{sadeSatiData.lesson}</p>
              </div>

              <div>
                <p className="text-xs text-orange-600 font-semibold mb-2 flex items-center gap-1">
                  <Heart className="w-3 h-3" /> Remedies
                </p>
                <ul className="space-y-1">
                  {sadeSatiData.remedies && sadeSatiData.remedies.slice(0, 4).map((remedy, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-orange-400">•</span> {remedy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-5 text-center">
              <p className="text-gray-500">Sade Sati is not currently active for your Moon Sign ({sadeSatiStatus.moonSign}).</p>
              <p className="text-gray-400 text-sm mt-2">This period brings important life lessons when active.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Navigation Bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl mb-6 shadow-lg">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-bold px-4 py-2 bg-white rounded-xl shadow-sm"
          >
            <ArrowLeft size={18} /> Dashboard
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-6 py-2 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            Download PDF
          </button>
        </div>

        {/* Main Report Content */}
        <div ref={reportRef} className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white">
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
                  <div><p className="text-sm text-gray-500">Full Name</p><p className="font-semibold">{userDetails.name || user?.name || 'N/A'}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4"></div>
                  <div><p className="text-sm text-gray-500">Gender</p><p className="font-semibold capitalize">{userDetails.gender || 'N/A'}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div><p className="text-sm text-gray-500">Date of Birth</p><p className="font-semibold">{userDetails.dob || 'N/A'} {userDetails.time && `(${userDetails.time})`}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div><p className="text-sm text-gray-500">Place of Birth</p><p className="font-semibold">{userDetails.place || 'N/A'}</p></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" /> Astrological Details
              </h3>
              <div className="space-y-3">
                <div><p className="text-sm text-gray-500">Ascendant (Lagna)</p><p className="font-semibold text-lg text-orange-600">{basicInfo.ascendant || 'N/A'}</p></div>
                <div><p className="text-sm text-gray-500">Moon Sign (Rasi)</p><p className="font-semibold text-blue-600">{basicInfo.sign || 'N/A'}</p></div>
                <div><p className="text-sm text-gray-500">Nakshatra</p><p className="font-semibold text-purple-600">{basicInfo.Naksahtra || 'N/A'}</p></div>
                <div><p className="text-sm text-gray-500">Varna / Gana</p><p className="font-semibold">{basicInfo.Varna || 'N/A'} / {basicInfo.Gana || 'N/A'}</p></div>
              </div>
            </div>
          </div>

          {/* 🌟 LAGNA CHARACTERISTICS SECTION - NEW */}
          {lagnaData && (
            <div className="px-8 pb-8">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Star className="w-6 h-6 text-purple-500" /> Your Ascendant: {basicInfo.ascendant} ({lagnaData.lagna_name_bn}) Lagna
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">How the world perceives you and your natural approach to life</p>
              </div>
              <LagnaCard data={lagnaData} />
            </div>
          )}

          {/* 🌑 SADE SATI SECTION */}
          <SadeSatiCard
            sadeSatiData={sadeSatiData}
            sadeSatiStatus={sadeSatiStatus}
          />

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

          {/* Compatibility Section */}
          {compatibilityList.length > 0 && basicInfo.ascendant && (
            <div className="px-8 pb-8">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <HeartHandshake className="w-6 h-6 text-orange-500" /> Zodiac Compatibility
                </h2>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">
                  How your ascendant sign ({basicInfo.ascendant}) connects with other zodiac signs
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {compatibilityList.map((comp, idx) => (
                  <CompatibilityCard key={idx} compatibility={comp} />
                ))}
              </div>
            </div>
          )}

          {/* Chart Section */}
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

          {/* 🌙 MOON & SUN DRISHTI SECTION */}
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
                <DrishtiCard
                  title="🌙 Chandra (Moon)"
                  icon={Moon}
                  data={moonDrishti}
                  isMoon={true}
                />
                <DrishtiCard
                  title="☀️ Surya (Sun)"
                  icon={Sun}
                  data={sunDrishti}
                  isMoon={false}
                />
              </div>
            </div>
          )}

          {/* Planet Table */}
          {planetsList.length > 0 && (
            <div className="px-8 pb-8">
              <PlanetTable planets={planetsList} />
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