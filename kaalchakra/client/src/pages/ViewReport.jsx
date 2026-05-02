// client/src/pages/ViewReport.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Sparkles, Calendar, User, MapPin, Star, Zap, Gem, Shield, Award, Clock } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import KundliChart from '../components/kundli/KundliChart.jsx';
import PlanetTable from '../components/kundli/PlanetTable.jsx';
import api from '../services/api.js';
import { BackgroundSparkles, SparkleButton } from '../components/ui/Sparkle.jsx';

const ViewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchSavedReport = async () => {
      try {
        const response = await api.get(`/reports/single/${id}`);
        if (response.data.success) {
          setReport(response.data.report);
        } else {
          setError('Report not found');
        }
      } catch (err) {
        console.error("Failed to load report", err);
        setError('Failed to load the cosmic report');
      } finally {
        setLoading(false);
      }
    };
    fetchSavedReport();
  }, [id]);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const element = reportRef.current;
    try {
      const dataUrl = await toPng(element, { quality: 1.0, backgroundColor: '#fefaf5' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${report?.name || 'Vedic'}_Astrology_Report.pdf`);
    } catch (err) {
      alert("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e9e6df] to-[#dcd6cc] flex items-center justify-center relative overflow-hidden">
        <BackgroundSparkles count={30} />
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 animate-pulse" size={24} />
          </div>
          <p className="text-[#4a3727] font-medium mt-4">Retrieving Cosmic Records...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e9e6df] to-[#dcd6cc] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-xl border-t-4 border-red-500">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "The cosmic record you're looking for doesn't exist."}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-6 py-2 rounded-xl hover:shadow-lg transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const basicInfo = report.basic_info || {};
  const planetsList = report.planets_data || [];
  
  // Extract birth details
  const birthDetails = {
    name: report.name || 'Seeker',
    dob: report.dob || 'N/A',
    time: report.time || 'N/A',
    place: report.place || 'N/A',
    gender: report.gender || 'Not specified'
  };

  // Format date
  const formattedDate = report.created_at 
    ? new Date(report.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Unknown date';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9e6df] to-[#dcd6cc] py-8 px-4 font-sans text-[#1e1b17] relative overflow-hidden">
      <BackgroundSparkles count={40} />
      
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
          
          <SparkleButton
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-gradient-to-r from-[#b46f2c] to-[#e6b34c] text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70"
            sparkleColor="#FFD700"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            {isDownloading ? 'Generating PDF...' : 'Download Report'}
          </SparkleButton>
        </div>

        {/* Main Report Content */}
        <div ref={reportRef} className="bg-[#fefaf5] rounded-[2rem] shadow-2xl overflow-hidden pb-6 relative">
          
          {/* Decorative top gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2c2a24] to-[#3d3a30] p-8 border-b-[3px] border-[#e6b34c]">
            <h1 className="text-[#f7e9cd] font-bold text-3xl md:text-4xl flex items-center gap-3">
              <div className="relative">
                <Sparkles className="text-[#e6b34c] animate-pulse" size={32} />
                <Star className="absolute -top-2 -right-2 text-yellow-400 animate-ping" size={12} fill="#FFD700" />
              </div>
              Comprehensive Astrological Report
              <Sparkles className="text-[#e6b34c] animate-pulse" size={28} />
            </h1>
            <div className="flex flex-wrap justify-between items-center mt-2">
              <p className="text-[#cbc3ae] flex items-center gap-2">
                <Zap size={16} /> Vedic Astrology • Janam Kundali Analysis
              </p>
              <p className="text-[#cbc3ae] text-sm flex items-center gap-2">
                <Clock size={14} /> Generated on {formattedDate}
              </p>
            </div>
          </div>

          {/* Birth Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
            <div className="bg-white rounded-2xl shadow-md border border-[#f0e7db] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-[#fffbf5] to-[#fef7ed] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-bold text-lg py-3 px-6 border-b flex items-center gap-2">
                <Calendar size={18} className="text-[#e6b34c]" /> Birth Details
              </div>
              <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs flex items-center gap-1"><User size={12} /> Full Name</p>
                  <p className="font-semibold text-gray-800">{birthDetails.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Gender</p>
                  <p className="font-semibold text-gray-800 capitalize">{birthDetails.gender}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Date of Birth</p>
                  <p className="font-semibold text-gray-800">{birthDetails.dob}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Time of Birth</p>
                  <p className="font-semibold text-gray-800">{birthDetails.time}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 col-span-2">
                  <p className="text-gray-500 text-xs flex items-center gap-1"><MapPin size={12} /> Place of Birth</p>
                  <p className="font-semibold text-gray-800">{birthDetails.place}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md border border-[#f0e7db] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-[#fffbf5] to-[#fef7ed] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-bold text-lg py-3 px-6 border-b flex items-center gap-2">
                <Star size={18} className="text-[#e6b34c]" /> Cosmic Profile
              </div>
              <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Ascendant (Lagna)</p>
                  <p className="font-bold text-[#b46f2c] text-lg">{basicInfo.ascendant || 'Not Available'}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Moon Sign (Rasi)</p>
                  <p className="font-bold text-blue-600 text-lg">{basicInfo.sign || 'Not Available'}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Nakshatra</p>
                  <p className="font-bold text-purple-600">{basicInfo.Naksahtra || 'Not Available'}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Varna</p>
                  <p className="font-semibold text-green-600">{basicInfo.Varna || 'Not Available'}</p>
                </div>
                <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Gana</p>
                  <p className="font-semibold text-teal-600">{basicInfo.Gana || 'Not Available'}</p>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-2">
                  <p className="text-gray-500 text-xs">Yoni</p>
                  <p className="font-semibold text-rose-600">{basicInfo.Yoni || 'Not Available'}</p>
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
                    <KundliChart planets={planetsList} chartData={basicInfo} />
                  </div>
                </div>
                <div className="w-full max-w-[650px] mx-auto">
                  <PlanetTable planets={planetsList} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="px-8 pb-8">
            <div className="bg-white rounded-2xl shadow-md border border-[#f0e7db] overflow-hidden">
              <div className="bg-gradient-to-r from-[#fffbf5] to-[#fef7ed] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-bold text-lg py-3 px-6 border-b flex items-center gap-2">
                <Sparkles size={20} className="text-[#e6b34c]" /> AI Cosmic Insights
              </div>
              <div className="p-8">
                <div className="text-[#2e2a24] text-sm md:text-base leading-relaxed whitespace-pre-line font-medium bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  {report.ai_insights || (
                    <div className="text-center text-gray-500">
                      <Sparkles size={24} className="mx-auto mb-2 text-gray-400" />
                      <p>No AI insights available for this report.</p>
                      <p className="text-xs mt-1">Please generate a new Kundli report to get AI predictions.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center p-6 mt-4 text-[#a08c74] border-t border-[#ede3d7] bg-[#fefaf5] text-xs flex items-center justify-center gap-2">
            <Sparkles size={12} /> © 2026 Kaal Chakra | Vedic Sidereal Calculations <Sparkles size={12} />
          </div>
        </div>

        {/* Report ID Badge */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Award size={12} />
            Report ID: {id}
            <Shield size={12} className="ml-2" />
            Secured by Kaal Chakra
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;