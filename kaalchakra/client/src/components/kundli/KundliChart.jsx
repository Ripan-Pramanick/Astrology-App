// client/src/components/kundli/KundliChart.jsx
import React, { useState, useMemo } from "react";

const PLANET_META = {
  Sun: { short: "Su", color: "#d97706", name: "Surya", mantra: "ॐ सूर्याय नमः" },
  Moon: { short: "Mo", color: "#475569", name: "Chandra", mantra: "ॐ चन्द्राय नमः" },
  Mars: { short: "Ma", color: "#dc2626", name: "Mangal", mantra: "ॐ मङ्गलाय नमः" },
  Mercury: { short: "Me", color: "#059669", name: "Budha", mantra: "ॐ बुधाय नमः" },
  Jupiter: { short: "Ju", color: "#7c3aed", name: "Guru", mantra: "ॐ गुरवे नमः" },
  Venus: { short: "Ve", color: "#db2777", name: "Shukra", mantra: "ॐ शुक्राय नमः" },
  Saturn: { short: "Sa", color: "#1d4ed8", name: "Shani", mantra: "ॐ शनैश्चराय नमः" },
  Rahu: { short: "Ra", color: "#334155", name: "Rahu", mantra: "ॐ राहवे नमः" },
  Ketu: { short: "Ke", color: "#334155", name: "Ketu", mantra: "ॐ केतवे नमः" },
};

const ZODIAC = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const ZODIAC_NUM = {
  Aries: 1, Taurus: 2, Gemini: 3, Cancer: 4, Leo: 5, Virgo: 6,
  Libra: 7, Scorpio: 8, Sagittarius: 9, Capricorn: 10, Aquarius: 11, Pisces: 12,
};

const HOUSE_SIGNIFICATIONS = {
  1: "Self, personality, health, character, physical appearance",
  2: "Wealth, family, speech, values, possessions, food",
  3: "Siblings, courage, communication, short travel, skills",
  4: "Mother, home, vehicles, emotional foundation, happiness",
  5: "Children, creativity, intelligence, romance, education",
  6: "Health, enemies, service, daily work, debts, diseases",
  7: "Marriage, partnerships, business, public relations",
  8: "Longevity, inheritance, secrets, transformation, occult",
  9: "Father, luck, spirituality, higher learning, foreign travel",
  10: "Career, reputation, karma, authority, achievements",
  11: "Gains, income, friendships, aspirations, fulfillment",
  12: "Expenses, foreign travel, liberation, spirituality, losses"
};

// ── SVG Constants & Coordinates ──────────────────────────────────────────────
const C = 100 / 350; // Scale factor for perfect 100x100 viewBox

const HOUSES_POLYGONS = [
  { num: 1, name: "Lagna", points: "50,2.86 73.57,26.43 50,50 26.43,26.43" },
  { num: 2, name: "Dhana", points: "2.86,2.86 50,2.86 26.43,26.43" },
  { num: 3, name: "Sahaja", points: "2.86,2.86 26.43,26.43 2.86,50" },
  { num: 4, name: "Sukha", points: "2.86,50 26.43,26.43 50,50 26.43,73.57" },
  { num: 5, name: "Putra", points: "2.86,50 26.43,73.57 2.86,97.14" },
  { num: 6, name: "Ripu", points: "2.86,97.14 26.43,73.57 50,97.14" },
  { num: 7, name: "Yuvati", points: "50,97.14 26.43,73.57 50,50 73.57,73.57" },
  { num: 8, name: "Randhra", points: "50,97.14 73.57,73.57 97.14,97.14" },
  { num: 9, name: "Dharma", points: "97.14,97.14 73.57,73.57 97.14,50" },
  { num: 10, name: "Karma", points: "97.14,50 73.57,73.57 50,50 73.57,26.43" },
  { num: 11, name: "Labha", points: "97.14,50 73.57,26.43 97.14,2.86" },
  { num: 12, name: "Vyaya", points: "97.14,2.86 73.57,26.43 50,2.86" },
];

const SIGN_POSITIONS = {
  1: { x: 175 * C, y: 158.5 * C },
  2: { x: 92.5 * C, y: 76 * C },
  3: { x: 76 * C, y: 92.5 * C },
  4: { x: 158.5 * C, y: 175 * C },
  5: { x: 76 * C, y: 257.5 * C },
  6: { x: 92.5 * C, y: 274 * C },
  7: { x: 175 * C, y: 191.5 * C },
  8: { x: 257.5 * C, y: 274 * C },
  9: { x: 274 * C, y: 257.5 * C },
  10: { x: 191.5 * C, y: 175 * C },
  11: { x: 274 * C, y: 92.5 * C },
  12: { x: 257.5 * C, y: 76 * C },
};

const PLANET_ZONES = {
  1: { ax: 165 * C, ay: 91.9 * C, cols: 2, cw: 9, rh: 6 },
  2: { ax: 87.2 * C, ay: 33 * C, cols: 2, cw: 9, rh: 6 },
  3: { ax: 30 * C, ay: 92.5 * C, cols: 1, cw: 9, rh: 6 },
  4: { ax: 77.8 * C, ay: 175 * C, cols: 1, cw: 9, rh: 6 },
  5: { ax: 30 * C, ay: 257.5 * C, cols: 1, cw: 9, rh: 6 },
  6: { ax: 87.2 * C, ay: 304 * C, cols: 2, cw: 9, rh: 6 },
  7: { ax: 175 * C, ay: 259 * C, cols: 2, cw: 9, rh: 6 },
  8: { ax: 254.6 * C, ay: 304 * C, cols: 2, cw: 9, rh: 6 },
  9: { ax: 320 * C, ay: 257.5 * C, cols: 1, cw: 9, rh: 6 },
  10: { ax: 272 * C, ay: 175 * C, cols: 1, cw: 9, rh: 6 },
  11: { ax: 297 * C, ay: 92.5 * C, cols: 1, cw: 9, rh: 6 },
  12: { ax: 258 * C, ay: 40 * C, cols: 2, cw: 9, rh: 6 },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const signForHouse = (ascendantSign, houseNumber) => {
  const ascIdx = ZODIAC_NUM[ascendantSign] || 1;
  const idx = ((ascIdx - 1 + (houseNumber - 1)) % 12) + 1;
  return { name: ZODIAC[idx - 1], num: idx };
};

const getZodiacSymbol = (sign) => {
  const symbols = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
  };
  return symbols[sign] || '';
};

const getPlanetHindiName = (planetName) => {
  const names = {
    'Sun': 'सूर्य', 'Moon': 'चंद्र', 'Mars': 'मंगल', 'Mercury': 'बुध',
    'Jupiter': 'बृहस्पति', 'Venus': 'शुक्र', 'Saturn': 'शनि', 'Rahu': 'राहु', 'Ketu': 'केतु'
  };
  return names[planetName] || planetName;
};

const formatString = (str) => {
  if (!str) return "";
  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
};

const sanitizeSign = (signStr) => {
  if (!signStr) return "Aries";
  return formatString(signStr);
};

// 🌟 New Helper: Convert Degree to Superscript String (e.g. 24 -> ²⁴)
const getSuperscriptDegree = (degree) => {
  if (degree === undefined || degree === null || isNaN(degree)) return "";
  const num = Math.floor(degree % 30); // 0-29 degrees in a sign
  const superscripts = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  return String(num).split('').map(d => superscripts[d] || d).join('');
};


// ── Main Component ───────────────────────────────────────────────────────────
const KundliChart = ({ planets = [], ascendant = "Aries", name = "", onHouseClick }) => {
  const [selected, setSelected] = useState(null);
  const [hoverHouse, setHoverHouse] = useState(null);

  const getHouseFromSign = (planetSign, ascSign) => {
    const planetNum = ZODIAC_NUM[planetSign] || 1;
    const ascNum = ZODIAC_NUM[ascSign] || 1;
    return ((planetNum - ascNum + 12) % 12) + 1;
  };

  const processedData = useMemo(() => {
    let rawList = [];
    if (Array.isArray(planets)) rawList = planets;
    else if (planets?.data && Array.isArray(planets.data)) rawList = planets.data;
    else if (planets?.planets && Array.isArray(planets.planets)) rawList = planets.planets;
    else if (typeof planets === 'object') {
      rawList = Object.values(planets).filter(v => v && typeof v === 'object' && v.name);
    }
    
    let lagnaSign = sanitizeSign(ascendant);
    const ascPlanet = rawList.find(p => p.name && p.name.toLowerCase() === 'ascendant');
    if (ascPlanet && ascPlanet.sign) lagnaSign = sanitizeSign(ascPlanet.sign);
    
    const validPlanetsLower = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"];
    const processedPlanets = [];
    
    rawList.forEach(p => {
      if (!p.name) return;
      const planetName = formatString(p.name);
      if (!validPlanetsLower.includes(planetName.toLowerCase())) return;
      
      let planetSign = p.sign ? sanitizeSign(p.sign) : "";
      let houseNum = planetSign ? getHouseFromSign(planetSign, lagnaSign) : parseInt(p.house);
      
      if (!houseNum || houseNum < 1 || houseNum > 12) houseNum = 1;
      
      const isRetrograde = p.retrograde === true || p.isRetro === true || p.isRetro === "true";
      
      let formattedDegree = p.degree || "";
      let degreeVal = parseFloat(p.normDegree);
      if (isNaN(degreeVal)) degreeVal = parseFloat(p.fullDegree);
      if (!isNaN(degreeVal) && degreeVal !== 0) {
        const deg = Math.floor(degreeVal % 30);
        const min = Math.floor((degreeVal - Math.floor(degreeVal)) * 60);
        formattedDegree = `${deg}° ${min.toString().padStart(2, '0')}'`;
      }
      
      processedPlanets.push({
        name: planetName, sign: planetSign, house: houseNum,
        degree: formattedDegree, normDegree: degreeVal, retrograde: isRetrograde,
        original: p
      });
    });
    
    return { lagna: lagnaSign, planets: processedPlanets, hasData: rawList.length > 0 };
  }, [planets, ascendant]);

  const planetsByHouse = useMemo(() => {
    const map = {1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[], 10:[], 11:[], 12:[]};
    processedData.planets.forEach((p) => {
      if (p.house >= 1 && p.house <= 12) map[p.house].push(p);
    });
    return map;
  }, [processedData.planets]);

  const handleClick = (houseObj) => {
    const next = selected === houseObj.num ? null : houseObj.num;
    setSelected(next);
    if (onHouseClick) {
      onHouseClick(houseObj.num, {
        house: houseObj.num,
        name: houseObj.name,
        sign: signForHouse(processedData.lagna, houseObj.num).name,
        planets: planetsByHouse[houseObj.num] || [],
        signification: HOUSE_SIGNIFICATIONS[houseObj.num]
      });
    }
  };

  if (!processedData.hasData) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm border border-orange-200/50 p-8 text-center mt-6">
        <p className="text-gray-500">Planetary data not available to generate chart.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto font-sans" data-testid="kundli-chart-root">
      <div className="relative rounded-3xl p-6 md:p-8 border border-orange-200/60 shadow-[0_20px_60px_-15px_rgba(234,88,12,0.15)] overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #fffbeb, rgba(255, 247, 237, 0.5), #fff1f2)' }}>
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-8 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/30" style={{ background: 'linear-gradient(to bottom right, #f97316, #f43f5e)' }}>ॐ</div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight" style={{ background: 'linear-gradient(to right, #292524, #7c2d12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>
                Vedic Birth Chart
              </h3>
              <p className="text-sm text-stone-500 mt-0.5">
                Lagna (Ascendant): <span className="font-bold text-orange-600">{processedData.lagna} {getZodiacSymbol(processedData.lagna)}</span>
                {name && <span className="text-stone-400"> • <span className="text-stone-700 font-medium">{name}</span></span>}
              </p>
            </div>
          </div>
        </div>

        {/* Chart + Details Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SVG CHART (Left Side) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-[450px] aspect-square rounded-2xl p-3 bg-[#fef3c7] shadow-inner border border-amber-800/20">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" style={{ color: '#ea580c' }}>
                <defs>
                  <linearGradient id="lagnaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="selectedFill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* 1. Clickable Polygons for Houses */}
                {HOUSES_POLYGONS.map((h) => {
                  const isSelected = selected === h.num;
                  const isHover = hoverHouse === h.num;
                  const isLagna = h.num === 1;
                  
                  let fill = "transparent";
                  if (isSelected) fill = "url(#selectedFill)";
                  else if (isLagna) fill = "url(#lagnaFill)";
                  else if (isHover) fill = "rgba(251, 146, 60, 0.15)";

                  return (
                    <polygon
                      key={`poly-${h.num}`} 
                      points={h.points} 
                      fill={fill} 
                      stroke="currentColor" 
                      strokeWidth={isSelected ? 1.2 : 0.6}
                      strokeLinejoin="round" 
                      className="transition-all duration-300 cursor-pointer"
                      onClick={() => handleClick(h)} 
                      onMouseEnter={() => setHoverHouse(h.num)} 
                      onMouseLeave={() => setHoverHouse(null)}
                    />
                  );
                })}

                {/* 2. Zodiac Sign Numbers (Rashi labels) & Ascendant Marker */}
                {HOUSES_POLYGONS.map((h) => {
                  const sign = signForHouse(processedData.lagna, h.num);
                  const pos = SIGN_POSITIONS[h.num];
                  const isLagna = h.num === 1;
                  
                  return (
                    <g key={`sign-group-${h.num}`}>
                      <text
                        x={pos.x} y={pos.y}
                        fontSize="4.5"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#9a3412"
                        opacity="0.6"
                        fontWeight="bold"
                        pointerEvents="none"
                      >
                        {sign.num}
                      </text>
                      
                      {/* ✅ Ascendant (Lagna) Marker */}
                      {isLagna && (
                        <text
                          x={pos.x} y={pos.y - 10} 
                          fontSize="4" 
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#dc2626"
                          opacity="0.8"
                          fontWeight="900"
                          pointerEvents="none"
                          letterSpacing="0.2"
                        >
                          Asc
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* 3. Render Planets with Superscript Degrees */}
                {HOUSES_POLYGONS.map((h) => {
                  const ps = planetsByHouse[h.num] || [];
                  if (!ps.length) return null;

                  const { ax, ay, cols, cw, rh } = PLANET_ZONES[h.num];
                  const rows = [];
                  for (let i = 0; i < ps.length; i += cols) rows.push(ps.slice(i, i + cols));

                  return rows.flatMap((row, rowIdx) => {
                    const rowY = ay + rowIdx * rh;
                    const rowHalfW = ((row.length - 1) * cw) / 2;
                    
                    return row.map((p, colIdx) => {
                      const meta = PLANET_META[p.name] || { short: p.name.slice(0, 2), color: "#1e293b" };
                      const px = ax - rowHalfW + colIdx * cw;
                      const degreeSuperScript = getSuperscriptDegree(p.normDegree);

                      return (
                        <g key={`p-${h.num}-${rowIdx}-${colIdx}`} pointerEvents="none">
                          <text
                            x={px} y={rowY}
                            fontSize="4"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={meta.color}
                            fontWeight="900"
                          >
                            {/* Short name + Superscript degree */}
                            {meta.short}{degreeSuperScript}
                          </text>
                          {/* Retrograde Indicator - Moved slightly to right to prevent overlap with superscript */}
                          {p.retrograde && (
                            <text x={px + 4.5} y={rowY - 2.5} fontSize="2.5" textAnchor="middle" fill="#dc2626" fontWeight="bold">R</text>
                          )}
                        </g>
                      );
                    });
                  });
                })}
              </svg>
            </div>

            {/* Planet Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3 px-4 py-3 bg-white/60 backdrop-blur border border-amber-100 rounded-2xl w-full max-w-[450px]">
              {Object.entries(PLANET_META).map(([k, v]) => (
                <div key={k} className="inline-flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }}></div>
                  <span className="font-bold text-stone-700">{v.short}</span>
                  <span className="text-stone-500 hidden sm:inline-block">- {k}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE DETAILS PANEL */}
          <div className="lg:col-span-5 h-full min-h-[400px]">
            <HouseDetails 
              selected={selected} 
              ascendant={processedData.lagna} 
              planetsByHouse={planetsByHouse} 
              onClear={() => setSelected(null)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── House Details Panel Component ──────────────────────────────────────────────
const HouseDetails = ({ selected, ascendant, planetsByHouse, onClear }) => {
  if (!selected) {
    return (
      <div className="h-full w-full rounded-3xl border-2 border-dashed border-orange-200/60 bg-white/40 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center shadow-inner">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="relative w-full h-full rounded-full border-2 border-orange-200 flex items-center justify-center text-4xl shadow-lg" style={{ background: 'linear-gradient(to bottom right, #fff7ed, #fff1f2)' }}>✨</div>
        </div>
        <h4 className="text-xl font-bold text-stone-800 mb-2">Explore the Chart</h4>
        <p className="text-sm text-stone-500 max-w-[240px] leading-relaxed">
          Tap on any <span className="font-semibold text-orange-600">Bhava (House)</span> in the Kundli to reveal its ruling sign and planetary placements.
        </p>
      </div>
    );
  }

  const h = HOUSES_POLYGONS.find((x) => x.num === selected);
  const sign = signForHouse(ascendant, selected);
  const ps = planetsByHouse[selected] || [];

  return (
    <div className="h-full rounded-3xl border border-orange-100 bg-white/80 backdrop-blur-xl p-6 shadow-xl shadow-orange-900/5 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between pb-5 border-b border-orange-100">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider mb-2">Bhava {selected}</span>
          <h4 className="text-2xl font-bold text-stone-800">{h?.name} House</h4>
          <p className="text-sm text-stone-500 mt-1.5 leading-relaxed pr-4">{HOUSE_SIGNIFICATIONS[selected]}</p>
        </div>
        <button onClick={onClear} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-rose-100 hover:text-rose-600 transition-colors">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl border border-amber-100/50 p-4 shadow-sm" style={{ background: 'linear-gradient(to bottom right, rgba(255, 251, 235, 0.5), rgba(255, 247, 237, 0.5))' }}>
          <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">Rashi (Sign)</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getZodiacSymbol(sign.name)}</span>
            <p className="font-bold text-stone-800 text-lg">{sign.name}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-100/50 p-4 shadow-sm" style={{ background: 'linear-gradient(to bottom right, rgba(255, 251, 235, 0.5), rgba(255, 247, 237, 0.5))' }}>
          <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">Grahas (Planets)</p>
          <p className="font-bold text-stone-800 text-2xl">{ps.length}</p>
        </div>
      </div>

      <div className="mt-6 flex-grow">
        <p className="text-xs uppercase tracking-wider text-stone-400 font-bold mb-3 pl-1">Planetary Placements</p>
        {ps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/50 p-6 text-center">
            <p className="text-sm text-stone-400 font-medium">No grahas placed in this house.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {ps.map((p, i) => {
              const meta = PLANET_META[p.name] || { short: "?", color: "#334155", name: p.name };
              return (
                <li key={i} className="flex items-center justify-between gap-3 rounded-xl border border-stone-100 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner" style={{ backgroundColor: meta.color }}>{meta.short}</div>
                    <div>
                      <p className="font-bold text-stone-800">{getPlanetHindiName(p.name)} <span className="text-xs font-normal text-stone-500 ml-1">({p.name})</span></p>
                      {p.retrograde && <span className="inline-block mt-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Retrograde</span>}
                    </div>
                  </div>
                  {p.degree && <span className="text-sm font-semibold text-stone-500 bg-stone-50 px-2 py-1 rounded-lg">{p.degree}</span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {ps.length > 0 && (
        <div className="mt-6 p-4 rounded-2xl border border-orange-200/50 relative overflow-hidden" style={{ background: 'linear-gradient(to right, rgba(255, 237, 213, 0.5), rgba(254, 243, 199, 0.5))' }}>
          <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span>💡</span> Ruling Mantra
          </p>
          <p className="text-lg font-bold text-stone-800 font-serif">
            {ps[0] && PLANET_META[ps[0].name]?.mantra || "ॐ नमः शिवाय"}
          </p>
        </div>
      )}
    </div>
  );
};

export default KundliChart;