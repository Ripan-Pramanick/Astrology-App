import React, { useState, useMemo } from "react";

/**
 * Premium North Indian Kundli Chart
 */

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

// Geometry for a 400x400 chart
const S = 400;
const H = S / 2;
const Q = S / 4;
const TQ = (3 * S) / 4;

const HOUSES = [
  { num: 1, name: "Lagna", points: `${H},0 ${TQ},${Q} ${H},${H} ${Q},${Q}`, label: { x: H, y: Q * 0.85 } },
  { num: 2, name: "Dhana", points: `${H},0 ${Q},${Q} 0,0`, label: { x: Q * 0.7, y: Q * 0.55 } },
  { num: 3, name: "Sahaja", points: `0,0 ${Q},${Q} 0,${H}`, label: { x: Q * 0.55, y: Q * 0.7 } },
  { num: 4, name: "Sukha", points: `0,${H} ${Q},${Q} ${H},${H} ${Q},${TQ}`, label: { x: Q * 0.85, y: H } },
  { num: 5, name: "Putra", points: `0,${H} ${Q},${TQ} 0,${S}`, label: { x: Q * 0.55, y: TQ * 0.7 } },
  { num: 6, name: "Ripu", points: `0,${S} ${Q},${TQ} ${H},${S}`, label: { x: Q * 0.7, y: TQ * 0.55 } },
  { num: 7, name: "Yuvati", points: `${H},${S} ${Q},${TQ} ${H},${H} ${TQ},${TQ}`, label: { x: H, y: TQ * 1.15 } },
  { num: 8, name: "Randhra", points: `${H},${S} ${TQ},${TQ} ${S},${S}`, label: { x: TQ * 0.7, y: TQ * 0.55 } },
  { num: 9, name: "Dharma", points: `${S},${S} ${TQ},${TQ} ${S},${H}`, label: { x: TQ * 0.55, y: TQ * 0.7 } },
  { num: 10, name: "Karma", points: `${S},${H} ${TQ},${TQ} ${H},${H} ${TQ},${Q}`, label: { x: TQ * 1.15, y: H } },
  { num: 11, name: "Labha", points: `${S},${H} ${TQ},${Q} ${S},0`, label: { x: TQ * 0.55, y: Q * 0.7 } },
  { num: 12, name: "Vyaya", points: `${S},0 ${TQ},${Q} ${H},0`, label: { x: TQ * 0.7, y: Q * 0.55 } },
];

const signForHouse = (ascendantSign, houseNumber) => {
  const ascIdx = ZODIAC_NUM[ascendantSign] || 1;
  const idx = ((ascIdx - 1 + (houseNumber - 1)) % 12) + 1;
  return { name: ZODIAC[idx - 1], num: idx };
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

const KundliChart = ({ planets = [], ascendant = "Aries", name = "", onHouseClick }) => {
  const [selected, setSelected] = useState(null);
  const [hoverHouse, setHoverHouse] = useState(null);

  const planetsByHouse = useMemo(() => {
    const map = {};
    (planets || []).forEach((p) => {
      const h = parseInt(p.house, 10);
      if (!h || h < 1 || h > 12) return;
      if (!map[h]) map[h] = [];
      map[h].push(p);
    });
    return map;
  }, [planets]);

  const handleClick = (h) => {
    const next = selected === h.num ? null : h.num;
    setSelected(next);
    if (onHouseClick) {
      onHouseClick(h.num, {
        house: h.num,
        name: h.name,
        sign: signForHouse(ascendant, h.num).name,
        planets: planetsByHouse[h.num] || [],
        signification: HOUSE_SIGNIFICATIONS[h.num]
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans" data-testid="kundli-chart-root">
      {/* Premium Outer Container */}
      <div 
        className="relative rounded-3xl p-6 md:p-8 border border-orange-200/60 shadow-[0_20px_60px_-15px_rgba(234,88,12,0.15)] overflow-hidden"
        style={{ background: 'linear-gradient(to bottom right, #fffbeb, rgba(255, 247, 237, 0.5), #fff1f2)' }}
      >
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="relative flex items-center justify-between mb-8 z-10">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/30"
              style={{ background: 'linear-gradient(to bottom right, #f97316, #f43f5e)' }}
            >
              ॐ
            </div>
            <div>
              <h3 
                className="text-xl md:text-2xl font-bold tracking-tight inline-block"
                style={{ 
                  background: 'linear-gradient(to right, #292524, #7c2d12)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Vedic Birth Chart
              </h3>
              <p className="text-sm text-stone-500 mt-0.5">
                Lagna (Ascendant):{" "}
                <span className="font-bold text-orange-600">{ascendant} {getZodiacSymbol(ascendant)}</span>
                {name ? <span className="text-stone-400"> • <span className="text-stone-700 font-medium">{name}</span></span> : null}
              </p>
            </div>
          </div>
          <span className="hidden md:inline-flex items-center gap-2 text-xs font-bold text-orange-700 bg-white/80 backdrop-blur border border-orange-200 shadow-sm px-4 py-2 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Kundli
          </span>
        </div>

        {/* Chart + side panel */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SVG Chart (Left Side) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-[500px] aspect-square rounded-2xl p-2 bg-white/40 backdrop-blur-sm border border-white/60 shadow-inner">
              <svg viewBox={`-8 -8 ${S + 16} ${S + 16}`} className="w-full h-full drop-shadow-md">
                
                {/* Chart Background Base */}
                <rect x="0" y="0" width={S} height={S} rx="4" fill="url(#paperBg)" stroke="#ea580c" strokeWidth="2.5" />
                
                {/* SVG Definitions for Gradients */}
                <defs>
                  <linearGradient id="paperBg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="lagnaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="selectedFill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Render Houses (Polygons) */}
                {HOUSES.map((h) => {
                  const isSelected = selected === h.num;
                  const isHover = hoverHouse === h.num;
                  const isLagna = h.num === 1;
                  
                  let fill = "transparent";
                  if (isSelected) fill = "url(#selectedFill)";
                  else if (isLagna) fill = "url(#lagnaFill)";
                  else if (isHover) fill = "rgba(251, 146, 60, 0.15)";

                  return (
                    <polygon
                      key={h.num}
                      points={h.points}
                      fill={fill}
                      stroke="#ea580c"
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeLinejoin="round"
                      className="transition-all duration-300 cursor-pointer origin-center"
                      onClick={() => handleClick(h)}
                      onMouseEnter={() => setHoverHouse(h.num)}
                      onMouseLeave={() => setHoverHouse(null)}
                      data-testid={`house-${h.num}`}
                    />
                  );
                })}

                {/* Render House Numbers and Planets */}
                {HOUSES.map((h) => {
                  const sign = signForHouse(ascendant, h.num);
                  const ps = planetsByHouse[h.num] || [];
                  const isLagna = h.num === 1;
                  
                  return (
                    <g key={`t-${h.num}`} pointerEvents="none">
                      {/* House/Zodiac Number (with white stroke for readability over lines) */}
                      <text 
                        x={h.label.x} y={h.label.y - 16} 
                        textAnchor="middle" fontSize="15" fontWeight="800" fill="#9a3412" 
                        style={{ fontFamily: "'Crimson Pro', Georgia, serif", paintOrder: "stroke", stroke: "rgba(255,255,255,0.9)", strokeWidth: "3px" }}
                      >
                        {sign.num} {getZodiacSymbol(sign.name)}
                      </text>

                      {isLagna && ps.length === 0 && (
                        <text x={h.label.x} y={h.label.y + 6} textAnchor="middle" fontSize="11" fontWeight="800" fill="#ea580c" letterSpacing="1.5" style={{ paintOrder: "stroke", stroke: "rgba(255,255,255,0.9)", strokeWidth: "2px" }}>
                          LAGNA
                        </text>
                      )}

                      {/* Render Planets in the house */}
                      {ps.map((p, i) => {
                        const meta = PLANET_META[p.name] || { short: p.name?.slice(0, 2) || "?", color: "#334155" };
                        const perRow = 3;
                        const row = Math.floor(i / perRow);
                        const col = i % perRow;
                        const count = Math.min(ps.length - row * perRow, perRow);
                        const spread = 24;
                        const xOffset = (col - (count - 1) / 2) * spread;
                        const yOffset = row * 18 + (ps.length <= 3 ? 4 : 8);
                        
                        return (
                          <g key={`${h.num}-${i}`} transform={`translate(${h.label.x + xOffset}, ${h.label.y + yOffset})`}>
                            <text 
                              textAnchor="middle" fontSize="13" fontWeight="800" fill={meta.color} 
                              style={{ fontFamily: "'Inter', sans-serif", paintOrder: "stroke", stroke: "rgba(255,255,255,0.9)", strokeWidth: "3px" }}
                            >
                              {meta.short}
                              {p.retrograde && <tspan fontSize="9" dy="-5" fill="#dc2626"> (R)</tspan>}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                {/* Center Om Watermark */}
                <text x={H} y={H + 12} textAnchor="middle" fontSize="40" fill="#ea580c" opacity="0.1" fontWeight="700" pointerEvents="none">ॐ</text>
              </svg>
            </div>

            {/* Legend Bottom */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3 px-4 py-3 bg-white/60 backdrop-blur border border-amber-100 rounded-2xl w-full max-w-[500px]">
              {Object.entries(PLANET_META).map(([k, v]) => (
                <div key={k} className="inline-flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }}></div>
                  <span className="font-bold text-stone-700">{v.short}</span>
                  <span className="text-stone-500 hidden sm:inline-block">- {k}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details Panel (Right Side) */}
          <div className="lg:col-span-5 h-full min-h-[400px]">
            <HouseDetails
              selected={selected}
              ascendant={ascendant}
              planetsByHouse={planetsByHouse}
              onClear={() => setSelected(null)}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

// Details Panel Component
const HouseDetails = ({ selected, ascendant, planetsByHouse, onClear }) => {
  // Empty State
  if (!selected) {
    return (
      <div className="h-full w-full rounded-3xl border-2 border-dashed border-orange-200/60 bg-white/40 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center shadow-inner transition-all duration-500">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div 
            className="relative w-full h-full rounded-full border-2 border-orange-200 flex items-center justify-center text-4xl shadow-lg"
            style={{ background: 'linear-gradient(to bottom right, #fff7ed, #fff1f2)' }}
          >
            ✨
          </div>
        </div>
        <h4 className="text-xl font-bold text-stone-800 mb-2">Explore the Chart</h4>
        <p className="text-sm text-stone-500 max-w-[240px] leading-relaxed">
          Tap on any <span className="font-semibold text-orange-600">Bhava (House)</span> in the Kundli to reveal its ruling sign and planetary placements.
        </p>
      </div>
    );
  }

  // Active State
  const h = HOUSES.find((x) => x.num === selected);
  const sign = signForHouse(ascendant, selected);
  const ps = planetsByHouse[selected] || [];

  return (
    <div className="h-full rounded-3xl border border-orange-100 bg-white/80 backdrop-blur-xl p-6 shadow-xl shadow-orange-900/5 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Title Area */}
      <div className="flex items-start justify-between pb-5 border-b border-orange-100">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider mb-2">
            Bhava {selected}
          </span>
          <h4 className="text-2xl font-bold text-stone-800">{h?.name} House</h4>
          <p className="text-sm text-stone-500 mt-1.5 leading-relaxed pr-4">{HOUSE_SIGNIFICATIONS[selected]}</p>
        </div>
        <button 
          onClick={onClear} 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div 
          className="rounded-2xl border border-amber-100/50 p-4 shadow-sm"
          style={{ background: 'linear-gradient(to bottom right, rgba(255, 251, 235, 0.5), rgba(255, 247, 237, 0.5))' }}
        >
          <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">Rashi (Sign)</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getZodiacSymbol(sign.name)}</span>
            <p className="font-bold text-stone-800 text-lg">{sign.name}</p>
          </div>
        </div>
        <div 
          className="rounded-2xl border border-amber-100/50 p-4 shadow-sm"
          style={{ background: 'linear-gradient(to bottom right, rgba(255, 251, 235, 0.5), rgba(255, 247, 237, 0.5))' }}
        >
          <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">Grahas (Planets)</p>
          <p className="font-bold text-stone-800 text-2xl">{ps.length}</p>
        </div>
      </div>

      {/* Planets List */}
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
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner" 
                      style={{ backgroundColor: meta.color }}
                    >
                      {meta.short}
                    </div>
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

      {/* Remedial / Mantra Box */}
      {ps.length > 0 && (
        <div 
          className="mt-6 p-4 rounded-2xl border border-orange-200/50 relative overflow-hidden"
          style={{ background: 'linear-gradient(to right, rgba(255, 237, 213, 0.5), rgba(254, 243, 199, 0.5))' }}
        >
          <div className="absolute right-0 top-0 opacity-10 text-6xl -mt-4 -mr-2 pointer-events-none">✨</div>
          <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span>💡</span> Ruling Mantra
          </p>
          <p className="text-lg font-bold text-stone-800" style={{ fontFamily: "Georgia, serif" }}>
            {ps[0] && PLANET_META[ps[0].name]?.mantra || "ॐ नमः शिवाय"}
          </p>
        </div>
      )}
    </div>
  );
};

export default KundliChart;