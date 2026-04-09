import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import KundliChart from '../pages/kundli/KundliChart.jsx';
import PlanetTable from '../pages/kundli/PlanetTable.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const KundliResult = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [kundliData, setKundliData] = useState(null);

  const [aiInsights, setAiInsights] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const reportRef = useRef(null);

  useEffect(() => {
    const storedData = localStorage.getItem('kundliData');
    console.log("💾 Raw Data from LocalStorage:", storedData); // 🟢 ডিবাগিংয়ের জন্য

    if (storedData) {
      setKundliData(JSON.parse(storedData));
    }
    setLoading(false);
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
            name: userDetails.name || user?.name || "Seeker", // Updated
            dob: userDetails.dob || "N/A", // Updated
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
        setAiInsights("Failed to connect to the AI service or Database.");
      } finally {
        setIsAiLoading(false);
      }
    };

    fetchAIAndSave();
  }, [kundliData, user]);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const element = reportRef.current;
    try {
      const dataUrl = await toPng(element, { quality: 1.0, backgroundColor: '#fefaf5' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Premium_Vedic_Report.pdf');
    } catch (err) {
      alert("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#e9e6df]">Loading...</div>;

  // 🟢 Bulletproof Data Extraction Logic
  let planetsList = [];
  if (kundliData) {
    if (Array.isArray(kundliData.planets)) planetsList = kundliData.planets;
    else if (Array.isArray(kundliData.planets?.data)) planetsList = kundliData.planets.data;
    else if (Array.isArray(kundliData.data?.planets)) planetsList = kundliData.data.planets;
  }

  const basicInfo = kundliData?.basic || kundliData?.basic?.data || {
    ascendant: "Capricorn", sign: "Aquarius", Naksahtra: "Shravana", Varna: "Shudra", Gana: "Manushya"
  };

  console.log("💡 Final Extracted Planets for Chart:", planetsList); // 🟢 চেক করার জন্য

  // 🟢 যদি ডেটা ফাঁকা থাকে, তবে ইউজারকে ওয়ার্নিং দেখানো
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
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl mb-6 shadow-sm border border-[#dcd6cc]">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#4a3727] hover:text-[#b46f2c] font-bold px-4 py-2 bg-white rounded-xl shadow-sm">
          <ArrowLeft size={18} /> Dashboard
        </button>
        <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-2 bg-[#b46f2c] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#8f551e] transition-colors disabled:opacity-70 shadow-md">
          {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />} Download PDF
        </button>
      </div>

      <div ref={reportRef} className="max-w-6xl mx-auto bg-[#fefaf5] rounded-[2rem] shadow-2xl overflow-hidden pb-6">
        <div className="bg-[#2c2a24] p-8 border-b-[5px] border-[#e6b34c]">
          <h1 className="text-[#f7e9cd] font-semibold text-3xl flex items-center gap-3">
            <Sparkles className="text-[#e6b34c]" /> Comprehensive Astrological Report
          </h1>
          <p className="text-[#cbc3ae] mt-2">Vedic Astrology • Janam Kundali Analysis • AI Predictions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b">📅 Birth Details</div>
            <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong className="text-[#c28135]">Name:</strong> {userDetails.name || user?.name || "Seeker"}</p>
              <p className="capitalize"><strong className="text-[#c28135]">Gender:</strong> {userDetails.gender || "Not specified"}</p>
              <p><strong className="text-[#c28135]">Date:</strong> {userDetails.dob || "N/A"} ({userDetails.time || ""})</p>
              <p><strong className="text-[#c28135]">Place:</strong> {userDetails.place || "N/A"}</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b">🌀 Avakhada Chakra</div>
            <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong className="text-[#c28135]">Ascendant:</strong> {basicInfo.ascendant}</p>
              <p><strong className="text-[#c28135]">Moon Sign:</strong> {basicInfo.sign}</p>
              <p><strong className="text-[#c28135]">Nakshatra:</strong> {basicInfo.Naksahtra}</p>
              <p><strong className="text-[#c28135]">Varna:</strong> {basicInfo.Varna}</p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b text-center">
              🕉️ Astrological Charts
            </div>
            <div className="p-8 flex flex-col md:flex-row gap-12 justify-center items-start">
              {/* 1. Kundli Chart */}
              <div className="w-full max-w-[400px] mx-auto">
                <h3 className="text-center font-bold text-[#4a3727] mb-4">Lagna Chart (D-1)</h3>
                <div className="p-2 border border-orange-100 rounded-xl bg-[#fffdfa] shadow-inner">
                  <KundliChart planets={planetsList} />
                </div>
              </div>

              {/* 2. Planet Table (নতুন যোগ করা হলো) */}
              <div className="w-full max-w-[600px] mx-auto">
                <PlanetTable planets={planetsList} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden shadow-sm">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b flex items-center gap-2">
              <Sparkles size={20} className="text-[#e6b34c]" /> AI Cosmic Insights & Predictions
            </div>
            <div className="p-8">
              {isAiLoading ? (
                <div className="flex flex-col items-center py-10">
                  <Loader2 className="animate-spin text-[#c28135] mb-3" size={36} />
                  <p className="text-[#8b765c] font-medium animate-pulse">AI is reading the stars and generating your personalized predictions...</p>
                </div>
              ) : (
                <div className="text-[#2e2a24] text-sm md:text-base leading-relaxed whitespace-pre-line font-medium bg-[#fefaf2] p-6 rounded-2xl border border-[#f0e2d2]">
                  {aiInsights || "Your personalized AI insights could not be loaded."}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center p-6 mt-4 text-[#a08c74] border-t border-[#ede3d7] bg-[#fefaf5] text-xs">
          © 2026 RUHU Astrology | Vedic Sidereal Calculations
        </div>
      </div>
    </div>
  );
};

export default KundliResult;