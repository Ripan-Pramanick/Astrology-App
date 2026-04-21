// client/src/pages/KundliResult.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Sparkles, AlertTriangle, Calendar, Star, Zap, Gem, User, MapPin } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import KundliChart from '../components/kundli/KundliChart.jsx';
import PlanetTable from '../components/kundli/PlanetTable.jsx';
import PredictionSection from '../components/kundli/PredictionSection.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const KundliResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [kundliData, setKundliData] = useState(null);
  const [error, setError] = useState(null);

  const reportRef = useRef(null);

  useEffect(() => {
    const loadData = () => {
      console.log("🟢 KundliResult page loaded");
      console.log("🔍 Location state:", location.state);
      
      // Try to get data from localStorage
      const storedData = localStorage.getItem('kundliData');
      console.log("💾 localStorage data:", storedData);
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log("✅ Parsed data:", parsedData);
          
          // Validate data has required fields
          if (parsedData.userDetails || (parsedData.basic && parsedData.planets)) {
            setKundliData(parsedData);
            setLoading(false);
            return;
          } else {
            console.warn("⚠️ Data missing required fields");
          }
        } catch (err) {
          console.error("❌ Error parsing data:", err);
        }
      }
      
      // If no data found, show error
      setError("No Kundli data found. Please generate a new report.");
      setLoading(false);
    };
    
    loadData();
  }, [location]);

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
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Generate New Kundli
          </button>
        </div>
      </div>
    );
  }

  // Extract data with fallbacks
  const userDetails = kundliData.userDetails || {};
  const basicInfo = kundliData.basic || {};
  const planetsList = kundliData.planets || [];

  console.log("📊 Rendering with data:", { userDetails, basicInfo, planetsCount: planetsList.length });

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