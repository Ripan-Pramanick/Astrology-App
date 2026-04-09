import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import KundliChart from '../components/kundli/KundliChart.jsx';
import api from '../services/api.js';

const ViewReport = () => {
  const { id } = useParams(); // URL থেকে রিপোর্টের ID নিলাম
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchSavedReport = async () => {
      try {
        const response = await api.get(`/reports/single/${id}`);
        if (response.data.success) {
          setReport(response.data.report);
        }
      } catch (err) {
        console.error("Failed to load report", err);
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
      pdf.save(`${report?.name || 'Vedic'}_Premium_Report.pdf`);
    } catch (err) {
      alert("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#e9e6df] font-bold text-[#b46f2c]">Retrieving Cosmic Records...</div>;
  if (!report) return <div className="min-h-screen flex items-center justify-center bg-[#e9e6df] font-bold text-red-500">Report not found!</div>;

  const basicInfo = report.basic_info || {};
  const planetsList = report.planets_data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9e6df] to-[#dcd6cc] py-8 px-4 font-sans text-[#1e1b17]">
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl mb-6 shadow-sm border border-[#dcd6cc]">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#4a3727] hover:text-[#b46f2c] font-bold px-4 py-2 bg-white rounded-xl shadow-sm">
          <ArrowLeft size={18} /> Dashboard
        </button>
        <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-2 bg-[#b46f2c] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#8f551e] shadow-md">
          {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />} Download PDF
        </button>
      </div>

      <div ref={reportRef} className="max-w-6xl mx-auto bg-[#fefaf5] rounded-[2rem] shadow-2xl overflow-hidden pb-6">
        <div className="bg-[#2c2a24] p-8 border-b-[5px] border-[#e6b34c]">
          <h1 className="text-[#f7e9cd] font-semibold text-3xl flex items-center gap-3">
            <Sparkles className="text-[#e6b34c]" /> Comprehensive Astrological Report
          </h1>
          <p className="text-[#cbc3ae] mt-2">Saved Record • Generated on {new Date(report.created_at).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b">📅 Birth Details</div>
            <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong className="text-[#c28135]">Name:</strong> {report.name}</p>
              <p><strong className="text-[#c28135]">Date:</strong> {report.dob}</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b">🌀 Avakhada Chakra</div>
            <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong className="text-[#c28135]">Varna:</strong> {basicInfo.Varna}</p>
              <p><strong className="text-[#c28135]">Gana:</strong> {basicInfo.Gana}</p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b text-center">🕉️ Astrological Chart</div>
            <div className="p-8 flex justify-center">
              <div className="w-full max-w-[350px]">
                <div className="p-2 border border-orange-100 rounded-xl bg-[#fffdfa]">
                  <KundliChart
                    planetsData={kundliData?.planets}
                    basicDetails={kundliData?.basic} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden shadow-sm">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b flex items-center gap-2">
              <Sparkles size={20} className="text-[#e6b34c]" /> AI Cosmic Insights
            </div>
            <div className="p-8">
              <div className="text-[#2e2a24] text-sm md:text-base leading-relaxed whitespace-pre-line font-medium bg-[#fefaf2] p-6 rounded-2xl border border-[#f0e2d2]">
                {report.ai_insights || "No AI insights saved for this report."}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewReport;