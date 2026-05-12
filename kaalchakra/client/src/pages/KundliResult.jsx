// client/src/pages/KundliResult.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, ArrowLeft, Loader2, Sparkles, AlertTriangle, Calendar, Star, 
  User, MapPin, Moon, Sun, Eye, Heart, Shield, HeartHandshake, Compass, Info 
} from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import KundliChart from '../components/kundli/KundliChart';
import PlanetTable from '../components/kundli/PlanetTable';
import SadeSatiCard from '../components/kundli/SadeSatiCard';
import DarakarakaHouses from '../components/kundli/DarakarakaHouses/DarakarakaHouses';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import api from '../services/api';

// ==================== হেল্পার কম্পোনেন্টস ====================

const SectionHeader = ({ title, subtitle, icon: Icon, color = "text-amber-600" }) => (
  <div className="text-center mb-10">
    <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-white shadow-md border border-amber-100 mb-5 ${color}`}>
      <Icon size={32} />
    </div>
    <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">{title}</h2>
    <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-3"></div>
    {subtitle && <p className="text-gray-500 text-base mt-4 max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
  </div>
);

const InfoCard = ({ label, value, icon: Icon, colorClass }) => (
  <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-amber-100 flex items-center gap-5 hover:shadow-lg transition-all duration-300">
    <div className={`p-4 rounded-xl ${colorClass} bg-opacity-10 shadow-inner`}>
      <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-400 font-black">{label}</p>
      <p className="text-gray-900 font-black text-lg">{value || 'N/A'}</p>
    </div>
  </div>
);

const LagnaCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="bg-white rounded-[3rem] p-10 border border-amber-100 shadow-2xl shadow-amber-900/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
        <Compass size={180} />
      </div>
      <div className="grid md:grid-cols-2 gap-10 relative z-10">
        {[
          { label: "Personality Traits", val: data.characteristics, icon: User },
          { label: "Core Strengths", val: data.strengths, icon: Sparkles },
          { label: "Areas to Improve", val: data.weaknesses, icon: AlertTriangle },
          { label: "Lucky Elements", val: data.lucky_color, icon: Star }
        ].map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-3 text-amber-600">
              <item.icon size={20} />
              <p className="text-sm uppercase tracking-[0.2em] font-black">{item.label}</p>
            </div>
            <p className="text-gray-700 leading-relaxed font-semibold text-lg">{item.val || 'Analyzing Stars...'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DrishtiCard = ({ title, icon: Icon, data, isMoon }) => {
  if (!data) return null;
  return (
    <div className={`rounded-[2.5rem] p-8 border transition-all hover:shadow-2xl ${isMoon ? 'bg-indigo-50/50 border-indigo-100' : 'bg-orange-50/50 border-orange-100'}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-2xl ${isMoon ? 'bg-indigo-500' : 'bg-orange-500'} text-white shadow-xl shadow-current/30`}>
          <Icon size={24} />
        </div>
        <h3 className="font-black text-gray-800 text-xl">{title}</h3>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-white">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Aspects House</span>
          <span className="font-black text-gray-800 bg-white px-4 py-1.5 rounded-xl shadow-sm">{data.aspect_house || 'N/A'}</span>
        </div>
        <div className="space-y-2">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Influence</span>
          <p className="text-base text-gray-700 leading-relaxed font-medium italic">"{data.influence || 'Calculating influence...'}"</p>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const KundliResult = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const reportRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
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

  const cap = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : 'Aries';

  const fetchAdditionalData = async (ascendant, moonSign, planetsList) => {
    try {
      const asc = cap(ascendant);
      const moon = cap(moonSign);

      const [moonD, sunD, compat, lagna, saturn] = await Promise.all([
        supabase.from('planet_drishti').select('*').eq('planet', 'Moon').eq('base_sign', asc).maybeSingle(),
        supabase.from('planet_drishti').select('*').eq('planet', 'Sun').eq('base_sign', asc).maybeSingle(),
        supabase.from('compatibility_scores').select('*').or(`sign1.eq.${asc},sign2.eq.${asc}`).order('score', { ascending: false }),
        supabase.from('lagna_characteristics').select('*').eq('lagna_name', asc).maybeSingle(),
        supabase.from('current_sade_sati').select('*').maybeSingle()
      ]);

      if (moonD.data) setMoonDrishti(moonD.data);
      if (sunD.data) setSunDrishti(sunD.data);
      if (compat.data) setCompatibilityList(compat.data);
      if (lagna.data) setLagnaData(lagna.data);

      if (moon && saturn.data) {
        const isAffected = saturn.data.affected_signs?.includes(moon);
        let phase = null;
        if (saturn.data.first_phase_signs?.includes(moon)) phase = 'First Phase';
        else if (saturn.data.second_phase_signs?.includes(moon)) phase = 'Second Phase';
        else if (saturn.data.third_phase_signs?.includes(moon)) phase = 'Third Phase';

        const { data: ssDetails } = await supabase.from('sade_sati').select('*').eq('moon_sign', moon).eq('phase', phase).maybeSingle();
        setSadeSatiData(ssDetails);
        setSadeSatiStatus({ isActive: isAffected, phase, moonSign: moon });
      }

      const eligible = planetsList.filter(p => !['Rahu', 'Ketu', 'Ascendant'].includes(p.name));
      let lowest = 360; let dkPlanet = null;
      eligible.forEach(p => {
        let deg = p.normDegree !== undefined ? p.normDegree % 30 : parseFloat(p.degree || 0) % 30;
        if (deg < lowest) { lowest = deg; dkPlanet = p.name; }
      });
      if (dkPlanet) {
        const { data: dk } = await supabase.from('darakaraka_planets').select('*').eq('planet', dkPlanet).maybeSingle();
        setDarakaraka(dk);
      }

      const { data: houses } = await supabase.from('darakaraka_houses').select('*').order('house_number', { ascending: true });
      if (houses) setDarakarakaHouses(houses);

    } catch (err) { console.error('Supabase Error:', err); }
  };

  useEffect(() => {
    const stored = localStorage.getItem('kundliData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setKundliData(parsed);
      const planets = Array.isArray(parsed.planets) ? parsed.planets : (parsed.planets?.data || []);
      const basic = parsed.basic || {};
      fetchAdditionalData(basic.ascendant || basic.lagna, basic.sign || basic.moon_sign, planets);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchAI = async () => {
      if (!kundliData || !user?.phone || aiInsights || kundliData.basic?.ai_insights) return;
      setIsAiLoading(true);
      try {
        const res = await api.post('/ai/interpret', { planets: kundliData.planets, basic: kundliData.basic });
        if (res.data.success) {
          const text = res.data.interpretation.replace(/\*/g, '');
          setAiInsights(text);
          await api.post('/reports/save', {
            user_phone: user.phone,
            name: user.name || "Seeker",
            dob: kundliData.userDetails?.dob || "N/A",
            basic_info: kundliData.basic,
            planets_data: kundliData.planets,
            ai_insights: text
          });
        }
      } catch (err) { console.error("AI Error:", err); }
      finally { setIsAiLoading(false); }
    };
    fetchAI();
  }, [kundliData, user]);

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, { quality: 1.0, backgroundColor: '#fffbf5' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      const h = (reportRef.current.offsetHeight * w) / reportRef.current.offsetWidth;
      pdf.addImage(dataUrl, 'PNG', 0, 0, w, h);
      pdf.save('Premium_Vedic_Report.pdf');
    } catch (err) { alert("Failed to download PDF."); }
    finally { setIsDownloading(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf5]">
      <Loader2 className="animate-spin text-amber-500 mb-4" size={56} />
      <p className="text-amber-800 text-xl font-black animate-pulse">Consulting the Cosmic Archives...</p>
    </div>
  );

  const planetsList = Array.isArray(kundliData?.planets) ? kundliData.planets : (kundliData?.planets?.data || []);
  const basic = kundliData?.basic || {};
  const userDetails = kundliData?.userDetails || {};

  if (!planetsList.length) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf5] p-6 text-center">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-red-50 max-w-lg">
        <AlertTriangle className="text-red-500 mx-auto mb-6" size={72} />
        <h2 className="text-4xl font-black text-gray-800 mb-4">Cosmic Silence</h2>
        <p className="text-gray-500 text-lg mb-10">We couldn't retrieve your planetary alignment from the universe. Let's try again.</p>
        <button onClick={() => navigate('/kundli')} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl">Restart Journey</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f3ed] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center mb-10 px-4">
          <button onClick={() => navigate('/dashboard')} className="group flex items-center gap-3 text-gray-500 hover:text-amber-600 transition-all font-black uppercase text-sm tracking-widest">
            <div className="p-3 rounded-full bg-white shadow-md group-hover:shadow-lg group-hover:-translate-x-1 transition-all"><ArrowLeft size={20} /></div>
            Dashboard
          </button>
          <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white font-black px-10 py-5 rounded-[2rem] shadow-2xl shadow-amber-600/30 transition-all active:scale-95 disabled:opacity-50 text-lg">
            {isDownloading ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />} Premium Report
          </button>
        </div>

        {/* --- MAIN REPORT START --- */}
        <div ref={reportRef} className="bg-[#fffbf5] rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-amber-100/50">
          
          {/* Cover Header */}
          <div className="bg-[#1a1915] p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1.5px, transparent 0)', backgroundSize: '60px 60px' }}></div>
            </div>
            <div className="inline-block p-6 rounded-full bg-amber-500/10 mb-8 border border-amber-500/20 shadow-2xl">
              <Sparkles className="text-amber-400" size={56} />
            </div>
            <h1 className="text-amber-200 text-5xl md:text-8xl font-black mb-6 tracking-tighter">Premium Janam Kundli</h1>
            <div className="flex items-center justify-center gap-4 mb-2">
               <div className="h-px w-12 bg-amber-500/30"></div>
               <p className="text-amber-100/70 font-black tracking-[0.4em] uppercase text-sm md:text-base">Vedic Wisdom • AI Insights</p>
               <div className="h-px w-12 bg-amber-500/30"></div>
            </div>
            <p className="text-white/40 font-bold text-lg">Generated for: {userDetails.name || user?.name || "The Honored Seeker"}</p>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-10 bg-white border-b border-amber-100 shadow-sm relative z-10">
            <InfoCard label="Lagna (Asc)" value={basic.ascendant || basic.lagna} icon={Sun} colorClass="bg-orange-500" />
            <InfoCard label="Rashi (Moon)" value={basic.sign || basic.moon_sign} icon={Moon} colorClass="bg-indigo-500" />
            <InfoCard label="Nakshatra" value={basic.Naksahtra || basic.nakshatra} icon={Star} colorClass="bg-amber-500" />
            <InfoCard label="Birth Date" value={userDetails.dob} icon={Calendar} colorClass="bg-emerald-500" />
          </div>

          <div className="p-10 md:p-20 space-y-24">
            
            {/* Chapter 1: The Soul Profile */}
            <section>
              <SectionHeader title="Your Soul Profile" subtitle="Analysis of your Lagna and the fundamental energies that define your essence." icon={User} />
              <LagnaCard data={lagnaData} />
            </section>

            {/* Chapter 2: Cosmic Mapping (The Big Chart) */}
            <section>
              <SectionHeader title="Cosmic Mapping" subtitle="The precise celestial alignment at the exact moment of your birth." icon={Compass} />
              <div className="flex flex-col gap-16 items-center">
                <div className="flex flex-col items-center space-y-8 w-full">
                  {/* CHART SIZE INCREASED HERE (max-w-[800px]) */}
                  <div className="w-full max-w-[800px] p-8 bg-white rounded-[4rem] border border-amber-100 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-700 hover:shadow-amber-900/10 hover:scale-[1.01]">
                    <KundliChart planets={planetsList} ascendant={basic.ascendant || basic.lagna} />
                  </div>
                  <div className="px-10 py-3 bg-amber-50 rounded-full border border-amber-200 shadow-inner">
                    <p className="text-xs uppercase font-black text-amber-800 tracking-[0.4em]">D1 - Primary Vedic Rashi Chart</p>
                  </div>
                </div>
                <div className="w-full max-w-5xl">
                  <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-amber-100 shadow-xl shadow-amber-900/5">
                     <div className="mb-8 flex items-center gap-3">
                        <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
                        <h3 className="font-black text-gray-800 uppercase tracking-widest text-lg">Planetary Positions & Degrees</h3>
                     </div>
                     <PlanetTable planets={planetsList} />
                  </div>
                </div>
              </div>
            </section>

            {/* Chapter 3: Karmic Cycles (Sade Sati) */}
            <section>
              <SectionHeader title="Karmic Cycles" subtitle="Understanding Shani's profound influence on your spiritual and material journey." icon={Shield} color="text-slate-800" />
              <div className="bg-white rounded-[3rem] border border-amber-100 overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-amber-900/10">
                 <SadeSatiCard sadeSatiData={sadeSatiData} sadeSatiStatus={sadeSatiStatus} />
              </div>
            </section>

            {/* Chapter 4: Love & Relationship Destiny */}
            <section>
              <SectionHeader title="Love & Destiny" subtitle="Mapping your relationship karma and compatibility with other cosmic forces." icon={Heart} color="text-rose-600" />
              <div className="space-y-12">
                {darakaraka && (
                  <div className="bg-gradient-to-br from-rose-50 to-white p-10 rounded-[3rem] border border-rose-100 shadow-xl relative overflow-hidden">
                    <Heart className="absolute -bottom-10 -right-10 text-rose-100/50" size={250} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="p-4 bg-rose-600 text-white rounded-[1.5rem] shadow-2xl shadow-rose-600/40"><Heart size={28} /></div>
                         <h3 className="text-3xl font-black text-gray-800">{darakaraka.planet} Darakaraka</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-2">
                           <p className="text-sm font-black text-rose-400 uppercase tracking-widest">Partner Nature</p>
                           <p className="text-gray-800 font-bold text-xl leading-relaxed">{darakaraka.partner_nature}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-sm font-black text-rose-400 uppercase tracking-widest">Remedies</p>
                           <p className="text-gray-800 font-bold text-xl leading-relaxed">{darakaraka.remedies}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-white p-10 md:p-16 rounded-[4rem] border border-amber-100 shadow-2xl">
                  <div className="text-center mb-10">
                    <h3 className="text-2xl font-black text-gray-800 flex items-center justify-center gap-3">
                       <Compass className="text-amber-500" /> Darakaraka Houses Analysis
                    </h3>
                  </div>
                  <DarakarakaHouses />
                </div>
              </div>
            </section>

            {/* Chapter 5: Planetary Vision (Drishti) */}
            <section>
              <SectionHeader title="Planetary Vision" subtitle="How the Sun and Moon project their divine light onto your life's path." icon={Eye} color="text-indigo-700" />
              <div className="grid md:grid-cols-2 gap-10">
                <DrishtiCard title="Chandra (Moon) Vision" icon={Moon} data={moonDrishti} isMoon={true} />
                <DrishtiCard title="Surya (Sun) Vision" icon={Sun} data={sunDrishti} isMoon={false} />
              </div>
            </section>

            {/* AI Predictions - Final Section */}
            <section>
              <div className="bg-[#1a1915] p-12 md:p-20 rounded-[4rem] text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]">
                 <div className="absolute top-0 right-0 p-12 opacity-5"><Sparkles size={200} /></div>
                 <div className="flex items-center gap-5 mb-12">
                    <div className="p-4 bg-amber-500 rounded-[1.5rem] shadow-2xl shadow-amber-500/40"><Sparkles size={40} /></div>
                    <div>
                      <h2 className="text-4xl font-black">AI Cosmic Insights</h2>
                      <p className="text-amber-500 text-sm font-black tracking-[0.3em] uppercase">Deep Neural Astrological Analysis</p>
                    </div>
                 </div>
                 
                 <div className="relative z-10">
                   {isAiLoading ? (
                     <div className="flex flex-col items-center py-16">
                       <Loader2 className="animate-spin text-amber-500 mb-6" size={56} />
                       <p className="text-amber-100 text-xl font-bold animate-pulse">Decoding celestial patterns...</p>
                     </div>
                   ) : (
                     <div className="text-amber-50/90 text-xl md:text-2xl leading-[1.8] whitespace-pre-line font-serif italic text-center max-w-4xl mx-auto">
                       {aiInsights || kundliData.basic?.ai_insights || "The cosmic gateway is momentarily closed. Please check your connection or regenerate from the dashboard."}
                     </div>
                   )}
                 </div>
              </div>
            </section>

          </div>

          {/* Report Footer */}
          <div className="bg-white p-12 text-center border-t border-amber-50">
             <div className="flex justify-center gap-10 mb-8">
                <div className="text-center"><p className="text-3xl font-black text-gray-800">2026</p><p className="text-xs font-black text-gray-400 tracking-[0.3em] uppercase">Year</p></div>
                <div className="w-px h-12 bg-amber-200"></div>
                <div className="text-center"><p className="text-3xl font-black text-gray-800">KC-IX</p><p className="text-xs font-black text-gray-400 tracking-[0.3em] uppercase">Series</p></div>
             </div>
             <p className="text-gray-400 text-sm font-bold tracking-tight">© 2026 Kaal Chakra Astrology. Advanced Sidereal Calculations. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KundliResult;