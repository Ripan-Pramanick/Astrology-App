// client/src/pages/KundliResult.jsx (Updated for real API data)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Sparkles, AlertTriangle, FileText, Crown, Star, Zap, Gem } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import KundliChart from '../components/kundli/KundliChart.jsx';
import PlanetTable from '../components/kundli/PlanetTable.jsx';
import PredictionSection from '../components/kundli/PredictionSection.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { KundliReportGenerator } from '../components/KundliReportGenerator.jsx';
import { BackgroundSparkles, SparkleButton } from '../components/ui/Sparkle.jsx';
import astrologyServices from '../services/astrologyApi.js';

const KundliResult = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [kundliData, setKundliData] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [reportType, setReportType] = useState('free');
  const [showSparkles, setShowSparkles] = useState(true);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const [aiInsights, setAiInsights] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [liveApiData, setLiveApiData] = useState(null);

  const reportRef = useRef(null);

  // Check if user is premium from backend
  useEffect(() => {
    const checkUserStatus = async () => {
      if (user?.phone) {
        try {
          const response = await api.get(`/user/${user.phone}/status`);
          setIsPremiumUser(response.data.isPremium || false);
        } catch (err) {
          console.error("Error checking premium status:", err);
          setIsPremiumUser(user?.subscription === 'premium' || user?.isPremium === true);
        }
      }
    };
    checkUserStatus();
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      const storedData = localStorage.getItem('kundliData');
      console.log("💾 Raw Data from LocalStorage:", storedData);

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setKundliData(parsedData);
        
        // If we have API data in localStorage, use it
        if (parsedData.basic && parsedData.planets) {
          setLiveApiData({
            basic: parsedData.basic,
            planets: parsedData.planets
          });
        }
      }
      setLoading(false);
      setTimeout(() => setShowSparkles(false), 3000);
    };
    loadData();
  }, []);

  const userDetails = kundliData?.userDetails || {};

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
            name: userDetails.name || user?.name || "Seeker",
            dob: userDetails.dob || "N/A",
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
          setAiInsights("✨ Could not load AI insights at the moment. Please try again later. ✨");
        }
      } catch (err) {
        setAiInsights("✨ Failed to connect to the AI service. Using fallback predictions. ✨");
      } finally {
        setIsAiLoading(false);
      }
    };

    fetchAIAndSave();
  }, [kundliData, user]);

  const handleQuickDownloadPdf = async () => {
    setIsDownloading(true);
    const element = reportRef.current;
    try {
      const dataUrl = await toPng(element, { quality: 1.0, backgroundColor: '#fefaf5' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Kundli_Report.pdf');
    } catch (err) {
      alert("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getBirthDetailsForPDF = () => {
    let planetsList = [];
    if (kundliData) {
      if (Array.isArray(kundliData.planets)) planetsList = kundliData.planets;
      else if (Array.isArray(kundliData.planets?.data)) planetsList = kundliData.planets.data;
      else if (Array.isArray(kundliData.data?.planets)) planetsList = kundliData.data.planets;
    }

    const basicInfo = kundliData?.basic || kundliData?.basic?.data || {
      ascendant: "Capricorn",
      sign: "Aquarius",
      Naksahtra: "Shravana",
      Varna: "Shudra",
      Gana: "Manushya"
    };

    return {
      birthDetails: {
        name: userDetails.name || user?.name || "Seeker",
        dob: userDetails.dob || "N/A",
        tob: userDetails.time || "N/A",
        pob: userDetails.place || "N/A",
        gender: userDetails.gender || "Not specified"
      },
      chartData: {
        lagna: basicInfo.ascendant,
        rasi: basicInfo.sign,
        nakshatra: basicInfo.Naksahtra,
        nakshatraPada: "1",
        sunSign: "Pisces",
        moonSign: basicInfo.sign,
        planets: planetsList,
        aiInsights: aiInsights,
        // Add real API data if available
        realData: liveApiData
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9e6df] to-[#dcd6cc] relative overflow-hidden">
        <BackgroundSparkles count={30} />
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 animate-pulse" size={28} />
          </div>
          <p className="text-[#4a3727] font-medium mt-4 text-lg">Loading your cosmic chart...</p>
          <p className="text-[#8b765c] text-sm mt-2">Calculating planetary positions</p>
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

  const basicInfo = kundliData?.basic || kundliData?.basic?.data || {
    ascendant: "Capricorn", sign: "Aquarius", Naksahtra: "Shravana", Varna: "Shudra", Gana: "Manushya"
  };

  if (!planetsList || planetsList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e9e6df] to-[#dcd6cc] p-4 text-center relative overflow-hidden">
        <BackgroundSparkles count={20} colors={['#EF4444', '#F97316']} />
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md border-t-4 border-red-500 relative z-10">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <AlertTriangle className="text-red-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-[#4a3727] mb-2">Cosmic Data Missing!</h2>
          <p className="text-slate-600 mb-6">We couldn't find your planetary data. Please generate your Kundli again.</p>
          <SparkleButton
            onClick={() => navigate('/kundli')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-6 py-3 rounded-xl shadow-md w-full"
            sparkleColor="#FFD700"
          >
            Go back to Kundli Form ✨
          </SparkleButton>
        </div>
      </div>
    );
  }

  const pdfData = getBirthDetailsForPDF();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9e6df] to-[#dcd6cc] py-8 px-4 font-sans text-[#1e1b17] relative overflow-hidden">
      {showSparkles && <BackgroundSparkles count={40} />}
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Navigation Bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl mb-6 shadow-lg border border-[#dcd6cc]">
          <SparkleButton
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[#4a3727] hover:text-[#b46f2c] font-bold px-4 py-2 bg-white rounded-xl shadow-sm"
            sparkleColor="#F7931E"
          >
            <ArrowLeft size={18} /> Dashboard
          </SparkleButton>
          
          <div className="flex gap-3">
            <SparkleButton
              onClick={handleQuickDownloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-[#b46f2c] text-white font-bold px-4 py-2 rounded-xl shadow-md disabled:opacity-70"
              sparkleColor="#FFD700"
            >
              {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} Quick PDF
            </SparkleButton>

            <SparkleButton
              onClick={() => setShowPdfModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#e6b34c] text-[#2c2a24] font-bold px-5 py-2 rounded-xl shadow-md"
              sparkleColor="#FFF8DC"
            >
              {isPremiumUser ? <Crown size={18} /> : <FileText size={18} />}
              {isPremiumUser ? 'Premium Report (200+ Pages)' : 'Upgrade to Premium Report'}
            </SparkleButton>
          </div>
        </div>

        {/* PDF Page Count Info Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-3 mb-4 text-center border border-purple-100">
          <p className="text-sm text-gray-600">
            📄 {isPremiumUser ? 'Premium Report: 200+ pages' : 'Free Report: 50+ pages'} of detailed astrological analysis
            {!isPremiumUser && ' • Upgrade to unlock 200+ pages of complete insights'}
          </p>
        </div>

        {/* Main Report Content */}
        <div ref={reportRef} className="bg-[#fefaf5] rounded-[2rem] shadow-2xl overflow-hidden pb-6 relative">
          {/* Decorative top gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
          
          <div className="bg-gradient-to-r from-[#2c2a24] to-[#3d3a30] p-8 border-b-[3px] border-[#e6b34c]">
            <h1 className="text-[#f7e9cd] font-bold text-3xl md:text-4xl flex items-center gap-3">
              <div className="relative">
                <Sparkles className="text-[#e6b34c] animate-pulse" size={32} />
                <Star className="absolute -top-2 -right-2 text-yellow-400 animate-ping" size={12} fill="#FFD700" />
              </div>
              Comprehensive Astrological Report
              <Sparkles className="text-[#e6b34c] animate-pulse" size={28} />
            </h1>
            <p className="text-[#cbc3ae] mt-2 flex items-center gap-2">
              <Zap size={16} /> Vedic Astrology • Janam Kundali Analysis • AI Predictions <Gem size={16} />
            </p>
          </div>

          {/* Birth Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
            <div className="bg-white rounded-2xl shadow-md border border-[#f0e7db] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-[#fffbf5] to-[#fef7ed] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-bold text-lg py-3 px-6 border-b flex items-center gap-2">
                <Sparkles size={18} className="text-[#e6b34c]" /> Birth Details
              </div>
              <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Full Name</p>
                  <p className="font-semibold text-gray-800">{userDetails.name || user?.name || "Seeker"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Gender</p>
                  <p className="font-semibold text-gray-800 capitalize">{userDetails.gender || "Not specified"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Date of Birth</p>
                  <p className="font-semibold text-gray-800">{userDetails.dob || "N/A"} {userDetails.time && `(${userDetails.time})`}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Place of Birth</p>
                  <p className="font-semibold text-gray-800">{userDetails.place || "N/A"}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md border border-[#f0e7db] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-[#fffbf5] to-[#fef7ed] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-bold text-lg py-3 px-6 border-b flex items-center gap-2">
                <Star size={18} className="text-[#e6b34c]" /> Avakhada Chakra
              </div>
              <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Ascendant (Lagna)</p>
                  <p className="font-bold text-[#b46f2c] text-lg">{basicInfo.ascendant}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Moon Sign (Rasi)</p>
                  <p className="font-bold text-blue-600 text-lg">{basicInfo.sign}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Nakshatra</p>
                  <p className="font-bold text-purple-600">{basicInfo.Naksahtra}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Varna</p>
                  <p className="font-semibold text-green-600">{basicInfo.Varna}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Astrological Charts */}
          <div className="px-8 pb-8">
            <div className="bg-white rounded-2xl shadow-md border border-[#f0e7db] overflow-hidden">
              <div className="bg-gradient-to-r from-[#fffbf5] to-[#fef7ed] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-bold text-lg py-3 px-6 border-b text-center">
                🕉️ Astrological Charts
              </div>
              <div className="p-8 flex flex-col lg:flex-row gap-12 justify-center items-start">
                <div className="w-full max-w-[450px] mx-auto">
                  <h3 className="text-center font-bold text-[#4a3727] mb-4 flex items-center justify-center gap-2">
                    <Sparkles size={16} className="text-[#e6b34c]" /> Lagna Chart (D-1) <Sparkles size={16} className="text-[#e6b34c]" />
                  </h3>
                  <div className="p-4 border-2 border-orange-100 rounded-2xl bg-gradient-to-br from-[#fffdfa] to-[#fef7ed] shadow-lg">
                    <KundliChart planets={planetsList} chartData={kundliData} />
                  </div>
                </div>
                <div className="w-full max-w-[650px] mx-auto">
                  <PlanetTable planets={planetsList} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Predictions Section */}
          <div className="px-8 pb-8">
            <PredictionSection
              birthDetails={userDetails}
              kundliData={kundliData}
              planetsList={planetsList}
              basicInfo={basicInfo}
            />
          </div>

          <div className="text-center p-6 mt-4 text-[#a08c74] border-t border-[#ede3d7] bg-[#fefaf5] text-xs flex items-center justify-center gap-2">
            <Sparkles size={12} /> © 2026 Kaal Chakra | Vedic Sidereal Calculations <Sparkles size={12} />
          </div>
        </div>
      </div>

      {/* PDF Report Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-white to-orange-50 border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Sparkles size={24} className="text-orange-500" /> Download Full Report
                </h2>
                <p className="text-gray-500 text-sm mt-1">Choose your report type</p>
              </div>
              <button onClick={() => setShowPdfModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">&times;</button>
            </div>
            
            <div className="p-6">
              {/* Free Report Option */}
              <div 
                className={`border-2 rounded-xl p-6 mb-4 cursor-pointer transition-all transform hover:scale-[1.02] ${
                  reportType === 'free' 
                    ? 'border-[#F7931E] bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg' 
                    : 'border-gray-200 hover:border-orange-200 hover:shadow-md'
                }`} 
                onClick={() => setReportType('free')}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-inner">
                      <FileText className="text-green-600" size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">Free Kundli Report</h3>
                      <p className="text-gray-500 text-sm mt-1">50+ pages • Basic analysis • Planetary positions • Nakshatra details</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">FREE</span>
                        <span className="text-gray-400 text-xs">No payment required</span>
                      </div>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    reportType === 'free' ? 'border-[#F7931E] bg-[#F7931E]' : 'border-gray-300'
                  }`}>
                    {reportType === 'free' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
              </div>

              {/* Premium Report Option */}
              <div 
                className={`border-2 rounded-xl p-6 mb-6 cursor-pointer transition-all transform hover:scale-[1.02] ${
                  reportType === 'premium' 
                    ? 'border-[#d4af37] bg-gradient-to-r from-yellow-50 to-amber-50 shadow-lg' 
                    : 'border-gray-200 hover:border-yellow-200 hover:shadow-md'
                }`} 
                onClick={() => setReportType('premium')}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center shadow-inner">
                      <Crown className="text-yellow-600" size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">Premium Kundli Report</h3>
                      <p className="text-gray-500 text-sm mt-1">200+ pages • Complete analysis • Divisional charts • Dasha predictions • Transit analysis • Yearly forecasts • Detailed remedies</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-gray-400 line-through text-sm">₹1999</span>
                        <span className="text-[#d4af37] font-bold text-2xl">₹999</span>
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">50% OFF</span>
                      </div>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    reportType === 'premium' ? 'border-[#d4af37] bg-[#d4af37]' : 'border-gray-300'
                  }`}>
                    {reportType === 'premium' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
              </div>

              {/* Premium Features List */}
              {reportType === 'premium' && (
                <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 rounded-xl p-5 mb-6 animate-fadeIn">
                  <h4 className="font-bold text-[#1f2a44] mb-3 flex items-center gap-2">
                    <Sparkles size={18} className="text-yellow-500" /> Premium Report Includes:
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2"><span className="text-green-500 text-lg">✓</span> All 16 Divisional Charts</div>
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2"><span className="text-green-500 text-lg">✓</span> Vimshottari Dasha Analysis</div>
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2"><span className="text-green-500 text-lg">✓</span> Transit Predictions (Gochar)</div>
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2"><span className="text-green-500 text-lg">✓</span> Yearly Forecast (30 Years)</div>
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2"><span className="text-green-500 text-lg">✓</span> Ashtakavarga Analysis</div>
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2"><span className="text-green-500 text-lg">✓</span> Yogas & Combinations</div>
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2"><span className="text-green-500 text-lg">✓</span> Planetary Remedies</div>
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2"><span className="text-green-500 text-lg">✓</span> Gemstone Recommendations</div>
                  </div>
                </div>
              )}

              {/* Download Button */}
              <PDFDownloadLink
                document={<KundliReportGenerator 
                  clientType={reportType} 
                  birthDetails={pdfData.birthDetails} 
                  chartData={pdfData.chartData}
                />}
                fileName={`${reportType === 'premium' ? 'Premium' : 'Free'}_Kundli_Report_${pdfData.birthDetails.name}.pdf`}
              >
                {({ loading, error }) => (
                  <SparkleButton
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                      reportType === 'premium' 
                        ? 'bg-gradient-to-r from-[#d4af37] via-[#e6b34c] to-[#f5c542] hover:shadow-xl text-[#2c2a24]' 
                        : 'bg-gradient-to-r from-[#F7931E] to-[#f4a460] hover:shadow-lg'
                    }`}
                    sparkleColor={reportType === 'premium' ? '#FFD700' : '#FFFFFF'}
                  >
                    {loading ? (
                      <><Loader2 className="animate-spin" size={20} /> Generating Your Report...</>
                    ) : (
                      <><Download size={20} /> Download {reportType === 'premium' ? 'Premium ✨' : 'Free'} Report</>
                    )}
                  </SparkleButton>
                )}
              </PDFDownloadLink>

              {!isPremiumUser && reportType === 'premium' && (
                <div className="text-center mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
                    <Sparkles size={14} /> Secure payment via Razorpay • Instant download • Lifetime access <Sparkles size={14} />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default KundliResult;