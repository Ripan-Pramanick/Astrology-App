import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Loader2, Sparkles, Moon, Sun, Star } from 'lucide-react';
import { toPng } from 'html-to-image'; 
import jsPDF from 'jspdf';
import KundliChart from '../components/kundli/KundliChart'; // আপনার আগের তৈরি করা চার্ট কম্পোনেন্ট

const KundliResult = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); 
  const [kundliData, setKundliData] = useState(null);
  
  const reportRef = useRef(null); 

  useEffect(() => {
    const storedData = localStorage.getItem('kundliData');
    if (storedData) {
      setKundliData(JSON.parse(storedData));
    }
    setLoading(false);
  }, []);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const element = reportRef.current;
    try {
      const dataUrl = await toPng(element, { 
        quality: 1.0, 
        backgroundColor: '#fefaf5' 
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Premium_Vedic_Report.pdf');
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const basicInfo = kundliData?.basic || {
    ascendant: "Capricorn", sign: "Aquarius", Naksahtra: "Shravana", Varna: "Shudra", Gana: "Manushya"
  };

  const planetsList = kundliData?.planets || [];

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9e6df] to-[#dcd6cc] py-8 px-4 font-sans text-[#1e1b17]">
      
      {/* Action Bar */}
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl mb-6 shadow-sm border border-[#dcd6cc]">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#4a3727] hover:text-[#b46f2c] font-bold px-4 py-2 bg-white rounded-xl shadow-sm">
          <ArrowLeft size={18} /> Back
        </button>
        <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-2 bg-[#b46f2c] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#8f551e] transition-colors disabled:opacity-70 shadow-md">
          {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />} Download PDF
        </button>
      </div>

      {/* Main Report Area */}
      <div ref={reportRef} className="max-w-6xl mx-auto bg-[#fefaf5] rounded-[2rem] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2c2a24] p-8 border-b-[5px] border-[#e6b34c]">
          <h1 className="text-[#f7e9cd] font-semibold text-3xl flex items-center gap-3">
            <Sparkles className="text-[#e6b34c]" /> Comprehensive Astrological Report
          </h1>
          <p className="text-[#cbc3ae] mt-2">Vedic Astrology • Janam Kundali Analysis</p>
        </div>

        {/* 1. Birth Details & Avakhada Chakra */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b">📅 Birth Details</div>
            <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong className="text-[#c28135]">Name:</strong> RIPAN PRAMANIK</p>
              <p><strong className="text-[#c28135]">Gender:</strong> Male</p>
              <p><strong className="text-[#c28135]">Date:</strong> 12/09/2011</p>
              <p><strong className="text-[#c28135]">Place:</strong> Santipur, WB</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b">🌀 Avakhada Chakra</div>
            <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong className="text-[#c28135]">Varna:</strong> {basicInfo.Varna}</p>
              <p><strong className="text-[#c28135]">Yoni:</strong> Lion</p>
              <p><strong className="text-[#c28135]">Gana:</strong> {basicInfo.Gana}</p>
              <p><strong className="text-[#c28135]">Nadi:</strong> Adi</p>
            </div>
          </div>
        </div>

        {/* 2. ASTROLOGICAL CHARTS (Lagna & Navamsa) */}
        <div className="px-8 pb-8">
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b text-center">
               🕉️ Astrological Charts
            </div>
            <div className="p-8 flex flex-col md:flex-row gap-12 justify-center items-center">
              {/* Lagna Chart */}
              <div className="w-full max-w-[350px]">
                <h3 className="text-center font-bold text-[#4a3727] mb-4">Lagna Chart (D-1)</h3>
                <div className="p-2 border border-orange-100 rounded-xl bg-[#fffdfa]">
                  <KundliChart planets={planetsList} />
                </div>
              </div>
              {/* Navamsa Chart */}
              <div className="w-full max-w-[350px]">
                <h3 className="text-center font-bold text-[#4a3727] mb-4">Navamsa Chart (D-9)</h3>
                <div className="p-2 border border-orange-100 rounded-xl bg-[#fffdfa]">
                  <KundliChart planets={planetsList} /> 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Planetary Positions Table */}
        <div className="px-8 pb-10">
          <div className="bg-white rounded-3xl border border-[#f0e7db] overflow-hidden shadow-sm">
            <div className="bg-[#fffbf5] border-l-[5px] border-[#e6b34c] text-[#4a3727] font-semibold text-lg py-3 px-6 border-b">🪐 Planetary Positions</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f8f3ea]">
                  <tr>
                    <th className="p-4 border-b border-[#e2d6c8]">Planet</th>
                    <th className="p-4 border-b border-[#e2d6c8]">Sign</th>
                    <th className="p-4 border-b border-[#e2d6c8]">Degree</th>
                    <th className="p-4 border-b border-[#e2d6c8]">Nakshatra</th>
                  </tr>
                </thead>
                <tbody>
                  {planetsList.map((p, i) => (
                    <tr key={i} className="hover:bg-[#fefaf5]">
                      <td className="p-4 border-b border-[#f0e7dd] font-bold text-[#ab7e4b]">{p.name}</td>
                      <td className="p-4 border-b border-[#f0e7dd]">{p.sign}</td>
                      <td className="p-4 border-b border-[#f0e7dd]">{p.normDegree?.toFixed(2)}°</td>
                      <td className="p-4 border-b border-[#f0e7dd]">{p.nakshatra || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center p-6 text-[#a08c74] border-t border-[#ede3d7] bg-[#fefaf5] text-xs">
          © 2026 RUHU Astrology | Vedic Sidereal Calculations
        </div>
      </div>
    </div>
  );
};

export default KundliResult;