// // client/src/components/kundli/KundliChart.jsx
// import React, { useState, useMemo } from "react";

// const PLANET_META = {
//   Sun: { short: "Su", color: "#d97706", name: "Surya", mantra: "ॐ सूर्याय नमः" },
//   Moon: { short: "Mo", color: "#475569", name: "Chandra", mantra: "ॐ चन्द्राय नमः" },
//   Mars: { short: "Ma", color: "#dc2626", name: "Mangal", mantra: "ॐ मङ्गलाय नमः" },
//   Mercury: { short: "Me", color: "#059669", name: "Budha", mantra: "ॐ बुधाय नमः" },
//   Jupiter: { short: "Ju", color: "#7c3aed", name: "Guru", mantra: "ॐ गुरवे नमः" },
//   Venus: { short: "Ve", color: "#db2777", name: "Shukra", mantra: "ॐ शुक्राय नमः" },
//   Saturn: { short: "Sa", color: "#1d4ed8", name: "Shani", mantra: "ॐ शनैश्चराय नमः" },
//   Rahu: { short: "Ra", color: "#334155", name: "Rahu", mantra: "ॐ राहवे नमः" },
//   Ketu: { short: "Ke", color: "#334155", name: "Ketu", mantra: "ॐ केतवे नमः" },
// };

// const ZODIAC = [
//   "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
//   "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
// ];

// const ZODIAC_NUM = {
//   Aries: 1, Taurus: 2, Gemini: 3, Cancer: 4, Leo: 5, Virgo: 6,
//   Libra: 7, Scorpio: 8, Sagittarius: 9, Capricorn: 10, Aquarius: 11, Pisces: 12,
// };

// const S = 400;
// const H = S / 2;      
// const Q = S / 4;      
// const TQ = (3 * S) / 4; 

// // For each house:
// //   center: geometric center for planet text
// //   numPos: corner position for small sign number
// const HOUSES = [
//   { num: 1,  name: "Lagna",   points: `${H},0 ${TQ},${Q} ${H},${H} ${Q},${Q}`,
//     center: { x: H, y: Q * 0.72 },          numPos: { x: H - 14, y: H - 14 } },
//   { num: 2,  name: "Dhana",   points: `${H},0 ${Q},${Q} 0,0`,
//     center: { x: Q * 0.58, y: Q * 0.42 },   numPos: { x: Q * 0.28, y: Q * 0.72 } },
//   { num: 3,  name: "Sahaja",  points: `0,0 ${Q},${Q} 0,${H}`,
//     center: { x: Q * 0.38, y: Q * 0.72 },   numPos: { x: Q * 0.72, y: Q * 0.28 } },
//   { num: 4,  name: "Sukha",   points: `0,${H} ${Q},${Q} ${H},${H} ${Q},${TQ}`,
//     center: { x: Q * 0.72, y: H },           numPos: { x: H - 14, y: H + 14 } },
//   { num: 5,  name: "Putra",   points: `0,${H} ${Q},${TQ} 0,${S}`,
//     center: { x: Q * 0.38, y: TQ * 0.72 },  numPos: { x: Q * 0.72, y: TQ * 0.72 } },
//   { num: 6,  name: "Ripu",    points: `0,${S} ${Q},${TQ} ${H},${S}`,
//     center: { x: Q * 0.58, y: S - Q * 0.42 }, numPos: { x: Q * 0.28, y: S - Q * 0.72 } },
//   { num: 7,  name: "Yuvati",  points: `${H},${S} ${Q},${TQ} ${H},${H} ${TQ},${TQ}`,
//     center: { x: H, y: TQ + Q * 0.28 },     numPos: { x: H + 14, y: H + 14 } },
//   { num: 8,  name: "Randhra", points: `${H},${S} ${TQ},${TQ} ${S},${S}`,
//     center: { x: S - Q * 0.58, y: S - Q * 0.42 }, numPos: { x: S - Q * 0.28, y: S - Q * 0.72 } },
//   { num: 9,  name: "Dharma",  points: `${S},${S} ${TQ},${TQ} ${S},${H}`,
//     center: { x: S - Q * 0.38, y: TQ * 0.72 }, numPos: { x: S - Q * 0.72, y: TQ * 0.72 } },
//   { num: 10, name: "Karma",   points: `${S},${H} ${TQ},${TQ} ${H},${H} ${TQ},${Q}`,
//     center: { x: S - Q * 0.72, y: H },      numPos: { x: H + 14, y: H - 14 } },
//   { num: 11, name: "Labha",   points: `${S},${H} ${TQ},${Q} ${S},0`,
//     center: { x: S - Q * 0.38, y: Q * 0.72 }, numPos: { x: S - Q * 0.72, y: Q * 0.28 } },
//   { num: 12, name: "Vyaya",   points: `${S},0 ${TQ},${Q} ${H},0`,
//     center: { x: S - Q * 0.58, y: Q * 0.42 }, numPos: { x: S - Q * 0.28, y: Q * 0.72 } },
// ];

// const HOUSE_SIGNIFICATIONS = {
//   1: "Self, personality, health, character, physical appearance",
//   2: "Wealth, family, speech, values, possessions, food",
//   3: "Siblings, courage, communication, short travel, skills",
//   4: "Mother, home, vehicles, emotional foundation, happiness",
//   5: "Children, creativity, intelligence, romance, education",
//   6: "Health, enemies, service, daily work, debts, diseases",
//   7: "Marriage, partnerships, business, public relations",
//   8: "Longevity, inheritance, secrets, transformation, occult",
//   9: "Father, luck, spirituality, higher learning, foreign travel",
//   10: "Career, reputation, karma, authority, achievements",
//   11: "Gains, income, friendships, aspirations, fulfillment",
//   12: "Expenses, foreign travel, liberation, spirituality, losses"
// };

// const signForHouse = (ascendantSign, houseNumber) => {
//   const ascIdx = ZODIAC_NUM[ascendantSign] || 1;
//   // In Vedic astrology, house 1 is ascendant, house 2 is next sign, etc.
//   const idx = ((ascIdx - 1 + (houseNumber - 1)) % 12) + 1;
//   return { name: ZODIAC[idx - 1], num: idx };
// };

// const getZodiacSymbol = (sign) => {
//   const symbols = {
//     'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
//     'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
//     'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
//   };
//   return symbols[sign] || '';
// };

// const getPlanetHindiName = (planetName) => {
//   const names = {
//     'Sun': 'सूर्य', 'Moon': 'चंद्र', 'Mars': 'मंगल', 'Mercury': 'बुध',
//     'Jupiter': 'बृहस्पति', 'Venus': 'शुक्र', 'Saturn': 'शनि', 'Rahu': 'राहु', 'Ketu': 'केतु'
//   };
//   return names[planetName] || planetName;
// };

// // Helper: Format string to capitalize
// const formatString = (str) => {
//   if (!str) return "";
//   return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
// };

// const sanitizeSign = (signStr) => {
//   if (!signStr) return "Aries";
//   return formatString(signStr);
// };

// const KundliChart = ({ planets = [], ascendant = "Aries", name = "", onHouseClick }) => {
//   const [selected, setSelected] = useState(null);
//   const [hoverHouse, setHoverHouse] = useState(null);

//   // Helper: Get house for a planet based on its sign and ascendant
//   const getHouseFromSign = (planetSign, ascSign) => {
//     const planetNum = ZODIAC_NUM[planetSign] || 1;
//     const ascNum = ZODIAC_NUM[ascSign] || 1;
//     // Calculate house: (planet number - ascendant number + 12) % 12 + 1
//     // e.g. planet in lagna sign → (ascNum - ascNum + 12) % 12 + 1 = 0 + 1 = 1 ✓
//     return ((planetNum - ascNum + 12) % 12) + 1;
//   };

//   // Process planets data
//   const processedData = useMemo(() => {
//     console.log("📥 KundliChart received planets:", planets);
    
//     let rawList = [];
    
//     // Handle different API response formats
//     if (Array.isArray(planets)) {
//       rawList = planets;
//     } else if (planets?.data && Array.isArray(planets.data)) {
//       rawList = planets.data;
//     } else if (planets?.planets && Array.isArray(planets.planets)) {
//       rawList = planets.planets;
//     } else if (typeof planets === 'object') {
//       // Try to extract planets from object
//       rawList = Object.values(planets).filter(v => v && typeof v === 'object' && v.name);
//     }
    
//     console.log("📊 Raw planets list:", rawList);
    
//     // Find ascendant
//     let lagnaSign = sanitizeSign(ascendant);
//     const ascPlanet = rawList.find(p => 
//       p.name && p.name.toLowerCase() === 'ascendant'
//     );
    
//     if (ascPlanet && ascPlanet.sign) {
//       lagnaSign = sanitizeSign(ascPlanet.sign);
//     }
    
//     console.log("🌟 Lagna (Ascendant):", lagnaSign);
    
//     // Valid planet names (Vedic)
//     const validPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
//     const validPlanetsLower = validPlanets.map(p => p.toLowerCase());
    
//     // Process each planet
//     const processedPlanets = [];
    
//     rawList.forEach(p => {
//       if (!p.name) return;
      
//       const planetName = formatString(p.name);
//       const planetNameLower = planetName.toLowerCase();
      
//       // Skip if not a valid Vedic planet
//       if (!validPlanetsLower.includes(planetNameLower)) return;
      
//       // Get planet sign
//       let planetSign = p.sign ? sanitizeSign(p.sign) : "";
      
//       // Calculate house based on sign
//       let houseNum = null;
      
//       if (planetSign) {
//         // Calculate house from sign based on ascendant
//         houseNum = getHouseFromSign(planetSign, lagnaSign);
//       } else {
//         // If no sign, try to use provided house
//         houseNum = parseInt(p.house);
//         if (isNaN(houseNum)) houseNum = null;
//       }
      
//       // If we still don't have a house, calculate from degree if available
//       if (!houseNum && p.normDegree !== undefined) {
//         // Rough calculation: degree to sign, then to house
//         const degree = parseFloat(p.normDegree);
//         if (!isNaN(degree)) {
//           const signIndex = Math.floor(degree / 30);
//           planetSign = ZODIAC[signIndex % 12];
//           houseNum = getHouseFromSign(planetSign, lagnaSign);
//         }
//       }
      
//       // Fallback to house 1 if all else fails
//       if (!houseNum || houseNum < 1 || houseNum > 12) {
//         houseNum = 1;
//       }
      
//       // Get retrograde status
//       const isRetrograde = p.retrograde === true || p.isRetro === true || p.isRetro === "true";
      
//       // Format degree
//       let formattedDegree = p.degree || "";
//       let degreeVal = parseFloat(p.normDegree);
//       if (isNaN(degreeVal)) degreeVal = parseFloat(p.fullDegree);
      
//       if (!isNaN(degreeVal) && degreeVal !== 0) {
//         const deg = Math.floor(degreeVal % 30);
//         const min = Math.floor((degreeVal - Math.floor(degreeVal)) * 60);
//         formattedDegree = `${deg}° ${min.toString().padStart(2, '0')}'`;
//       }
      
//       processedPlanets.push({
//         name: planetName,
//         sign: planetSign,
//         house: houseNum,
//         degree: formattedDegree,
//         normDegree: degreeVal,
//         retrograde: isRetrograde,
//         original: p
//       });
//     });
    
//     console.log("✅ Processed planets with houses:", processedPlanets);
    
//     return {
//       lagna: lagnaSign,
//       planets: processedPlanets,
//       hasData: rawList.length > 0
//     };
//   }, [planets, ascendant]);

//   // Group planets by house
//   const planetsByHouse = useMemo(() => {
//     const map = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []};
    
//     processedData.planets.forEach((p) => {
//       if (p.house >= 1 && p.house <= 12) {
//         map[p.house].push(p);
//       }
//     });
    
//     return map;
//   }, [processedData.planets]);

//   const handleClick = (h) => {
//     const next = selected === h.num ? null : h.num;
//     setSelected(next);
//     if (onHouseClick) {
//       onHouseClick(h.num, {
//         house: h.num,
//         name: h.name,
//         sign: signForHouse(processedData.lagna, h.num).name,
//         planets: planetsByHouse[h.num] || [],
//         signification: HOUSE_SIGNIFICATIONS[h.num]
//       });
//     }
//   };

//   // Debug logging
//   console.log("🏠 Planets by house:", planetsByHouse);
//   console.log("📊 Processed planets count:", processedData.planets.length);
//   console.log("🔢 Houses filled:", Object.entries(planetsByHouse).filter(([k,v]) => v.length > 0).length);

//   // If no data
//   if (!processedData.hasData) {
//     return (
//       <div className="w-full bg-white rounded-2xl shadow-sm border border-orange-200/50 p-8 text-center mt-6">
//         <p className="text-gray-500">Planetary data not available to generate chart.</p>
//       </div>
//     );
//   }

//   // Show loading while processing
//   if (processedData.planets.length === 0) {
//     return (
//       <div className="w-full max-w-4xl mx-auto p-8 text-center">
//         <div className="animate-pulse">
//           <div className="w-16 h-16 mx-auto mb-4 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
//           <p className="text-stone-500">Loading cosmic chart...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto font-sans" data-testid="kundli-chart-root">
//       <div className="relative rounded-3xl p-6 md:p-8 border border-orange-200/60 shadow-[0_20px_60px_-15px_rgba(234,88,12,0.15)] overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #fffbeb, rgba(255, 247, 237, 0.5), #fff1f2)' }}>
        
//         <div className="relative flex items-center justify-between mb-8 z-10">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/30" style={{ background: 'linear-gradient(to bottom right, #f97316, #f43f5e)' }}>ॐ</div>
//             <div>
//               <h3 className="text-xl md:text-2xl font-bold tracking-tight" style={{ background: 'linear-gradient(to right, #292524, #7c2d12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>
//                 Vedic Birth Chart
//               </h3>
//               <p className="text-sm text-stone-500 mt-0.5">
//                 Lagna (Ascendant): <span className="font-bold text-orange-600">{processedData.lagna} {getZodiacSymbol(processedData.lagna)}</span>
//                 {name ? <span className="text-stone-400"> • <span className="text-stone-700 font-medium">{name}</span></span> : null}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
//           <div className="lg:col-span-7 flex flex-col items-center">
//             <div className="relative w-full max-w-[500px] aspect-square rounded-2xl p-2 bg-white/40 backdrop-blur-sm border border-white/60 shadow-inner">
//               <svg viewBox={`-8 -8 ${S + 16} ${S + 16}`} className="w-full h-full drop-shadow-md">
                
//                 <rect x="0" y="0" width={S} height={S} rx="4" fill="url(#paperBg)" stroke="#ea580c" strokeWidth="2.5" />
//                 <defs>
//                   <linearGradient id="paperBg" x1="0" y1="0" x2="1" y2="1">
//                     <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.9" />
//                     <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.9" />
//                   </linearGradient>
//                   <linearGradient id="lagnaFill" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
//                     <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.4" />
//                   </linearGradient>
//                   <linearGradient id="selectedFill" x1="0" y1="0" x2="1" y2="1">
//                     <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.9" />
//                     <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.7" />
//                   </linearGradient>
//                 </defs>

//                 {/* Houses */}
//                 {HOUSES.map((h) => {
//                   const isSelected = selected === h.num;
//                   const isHover = hoverHouse === h.num;
//                   const isLagna = h.num === 1;
//                   let fill = "transparent";
//                   if (isSelected) fill = "url(#selectedFill)";
//                   else if (isLagna) fill = "url(#lagnaFill)";
//                   else if (isHover) fill = "rgba(251, 146, 60, 0.15)";

//                   return (
//                     <polygon
//                       key={h.num} 
//                       points={h.points} 
//                       fill={fill} 
//                       stroke="#ea580c" 
//                       strokeWidth={isSelected ? 3 : 1.5}
//                       strokeLinejoin="round" 
//                       className="transition-all duration-300 cursor-pointer"
//                       onClick={() => handleClick(h)} 
//                       onMouseEnter={() => setHoverHouse(h.num)} 
//                       onMouseLeave={() => setHoverHouse(null)}
//                     />
//                   );
//                 })}

//                 {/* House Numbers and Planets */}
//                 {HOUSES.map((h) => {
//                   const sign = signForHouse(processedData.lagna, h.num);
//                   const ps = planetsByHouse[h.num] || [];
//                   const isLagna = h.num === 1;

//                   // Layout planets in rows of up to 3, centered around house center
//                   const perRow = 3;
//                   const totalRows = Math.ceil(ps.length / perRow);
//                   const lineH = 17;
//                   const startY = h.center.y - ((totalRows - 1) * lineH) / 2;

//                   return (
//                     <g key={`t-${h.num}`} pointerEvents="none">

//                       {/* Small sign number at corner */}
//                       <text
//                         x={h.numPos.x}
//                         y={h.numPos.y}
//                         textAnchor="middle"
//                         fontSize="11"
//                         fontWeight="600"
//                         fill="#9a3412"
//                         opacity="0.75"
//                         style={{ fontFamily: "Georgia, serif" }}
//                       >
//                         {sign.num}
//                       </text>

//                       {/* Lagna marker — small italic label below number when house 1 */}
//                       {isLagna && (
//                         <text
//                           x={h.numPos.x}
//                           y={h.numPos.y + 12}
//                           textAnchor="middle"
//                           fontSize="8"
//                           fontWeight="700"
//                           fill="#ea580c"
//                           letterSpacing="0.8"
//                           style={{ fontFamily: "Georgia, serif" }}
//                         >
//                           L
//                         </text>
//                       )}

//                       {/* Planets centered in house */}
//                       {ps.map((p, i) => {
//                         const meta = PLANET_META[p.name] || { short: p.name?.slice(0, 2) || "?", color: "#334155" };
//                         const row = Math.floor(i / perRow);
//                         const col = i % perRow;
//                         const rowCount = Math.min(ps.length - row * perRow, perRow);
//                         const xSpread = 20;
//                         const xOffset = (col - (rowCount - 1) / 2) * xSpread;
//                         const yOffset = row * lineH;

//                         return (
//                           <g key={`${h.num}-${i}`}>
//                             <text
//                               x={h.center.x + xOffset}
//                               y={startY + yOffset}
//                               textAnchor="middle"
//                               dominantBaseline="central"
//                               fontSize="14"
//                               fontWeight="700"
//                               fill={meta.color}
//                               style={{
//                                 fontFamily: "'Inter', Arial, sans-serif",
//                                 paintOrder: "stroke",
//                                 stroke: "rgba(255,255,255,0.85)",
//                                 strokeWidth: "2.5px"
//                               }}
//                             >
//                               {meta.short}
//                             </text>
//                             {p.retrograde && (
//                               <text
//                                 x={h.center.x + xOffset + 9}
//                                 y={startY + yOffset - 6}
//                                 textAnchor="middle"
//                                 fontSize="8"
//                                 fontWeight="800"
//                                 fill="#dc2626"
//                               >
//                                 R
//                               </text>
//                             )}
//                           </g>
//                         );
//                       })}

//                     </g>
//                   );
//                 })}
                
//                 {/* Center Om */}
//                 <text x={H} y={H + 12} textAnchor="middle" fontSize="40" fill="#ea580c" opacity="0.1" fontWeight="700" pointerEvents="none">ॐ</text>
//               </svg>
//             </div>

//             {/* Legend */}
//             <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3 px-4 py-3 bg-white/60 backdrop-blur border border-amber-100 rounded-2xl w-full max-w-[500px]">
//               {Object.entries(PLANET_META).map(([k, v]) => (
//                 <div key={k} className="inline-flex items-center gap-1.5 text-xs">
//                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }}></div>
//                   <span className="font-bold text-stone-700">{v.short}</span>
//                   <span className="text-stone-500 hidden sm:inline-block">- {k}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Details Panel */}
//           <div className="lg:col-span-5 h-full min-h-[400px]">
//             <HouseDetails 
//               selected={selected} 
//               ascendant={processedData.lagna} 
//               planetsByHouse={planetsByHouse} 
//               onClear={() => setSelected(null)} 
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // House Details Panel Component
// const HouseDetails = ({ selected, ascendant, planetsByHouse, onClear }) => {
//   if (!selected) {
//     return (
//       <div className="h-full w-full rounded-3xl border-2 border-dashed border-orange-200/60 bg-white/40 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center shadow-inner">
//         <div className="relative w-20 h-20 mb-6">
//           <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
//           <div className="relative w-full h-full rounded-full border-2 border-orange-200 flex items-center justify-center text-4xl shadow-lg" style={{ background: 'linear-gradient(to bottom right, #fff7ed, #fff1f2)' }}>✨</div>
//         </div>
//         <h4 className="text-xl font-bold text-stone-800 mb-2">Explore the Chart</h4>
//         <p className="text-sm text-stone-500 max-w-[240px] leading-relaxed">
//           Tap on any <span className="font-semibold text-orange-600">Bhava (House)</span> in the Kundli to reveal its ruling sign and planetary placements.
//         </p>
//       </div>
//     );
//   }

//   const h = HOUSES.find((x) => x.num === selected);
//   const sign = signForHouse(ascendant, selected);
//   const ps = planetsByHouse[selected] || [];

//   return (
//     <div className="h-full rounded-3xl border border-orange-100 bg-white/80 backdrop-blur-xl p-6 shadow-xl shadow-orange-900/5 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
//       <div className="flex items-start justify-between pb-5 border-b border-orange-100">
//         <div>
//           <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider mb-2">Bhava {selected}</span>
//           <h4 className="text-2xl font-bold text-stone-800">{h?.name} House</h4>
//           <p className="text-sm text-stone-500 mt-1.5 leading-relaxed pr-4">{HOUSE_SIGNIFICATIONS[selected]}</p>
//         </div>
//         <button onClick={onClear} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-rose-100 hover:text-rose-600 transition-colors">✕</button>
//       </div>

//       <div className="grid grid-cols-2 gap-4 mt-6">
//         <div className="rounded-2xl border border-amber-100/50 p-4 shadow-sm" style={{ background: 'linear-gradient(to bottom right, rgba(255, 251, 235, 0.5), rgba(255, 247, 237, 0.5))' }}>
//           <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">Rashi (Sign)</p>
//           <div className="flex items-center gap-2">
//             <span className="text-2xl">{getZodiacSymbol(sign.name)}</span>
//             <p className="font-bold text-stone-800 text-lg">{sign.name}</p>
//           </div>
//         </div>
//         <div className="rounded-2xl border border-amber-100/50 p-4 shadow-sm" style={{ background: 'linear-gradient(to bottom right, rgba(255, 251, 235, 0.5), rgba(255, 247, 237, 0.5))' }}>
//           <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">Grahas (Planets)</p>
//           <p className="font-bold text-stone-800 text-2xl">{ps.length}</p>
//         </div>
//       </div>

//       <div className="mt-6 flex-grow">
//         <p className="text-xs uppercase tracking-wider text-stone-400 font-bold mb-3 pl-1">Planetary Placements</p>
//         {ps.length === 0 ? (
//           <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/50 p-6 text-center">
//             <p className="text-sm text-stone-400 font-medium">No grahas placed in this house.</p>
//           </div>
//         ) : (
//           <ul className="space-y-3">
//             {ps.map((p, i) => {
//               const meta = PLANET_META[p.name] || { short: "?", color: "#334155", name: p.name };
//               return (
//                 <li key={i} className="flex items-center justify-between gap-3 rounded-xl border border-stone-100 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner" style={{ backgroundColor: meta.color }}>{meta.short}</div>
//                     <div>
//                       <p className="font-bold text-stone-800">{getPlanetHindiName(p.name)} <span className="text-xs font-normal text-stone-500 ml-1">({p.name})</span></p>
//                       {p.retrograde && <span className="inline-block mt-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Retrograde</span>}
//                     </div>
//                   </div>
//                   {p.degree && <span className="text-sm font-semibold text-stone-500 bg-stone-50 px-2 py-1 rounded-lg">{p.degree}</span>}
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>

//       {ps.length > 0 && (
//         <div className="mt-6 p-4 rounded-2xl border border-orange-200/50 relative overflow-hidden" style={{ background: 'linear-gradient(to right, rgba(255, 237, 213, 0.5), rgba(254, 243, 199, 0.5))' }}>
//           <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
//             <span>💡</span> Ruling Mantra
//           </p>
//           <p className="text-lg font-bold text-stone-800 font-serif">
//             {ps[0] && PLANET_META[ps[0].name]?.mantra || "ॐ नमः शिवाय"}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default KundliChart;



// client/src/components/kundli/KundliChartCanvas.jsx
// Canvas-based North Indian Kundli Chart
import React, { useRef, useEffect, useCallback, useState } from "react";

const PLANET_META = {
  Sun:     { short: "Su", color: "#d97706", name: "Surya",       mantra: "ॐ सूर्याय नमः" },
  Moon:    { short: "Mo", color: "#475569", name: "Chandra",     mantra: "ॐ चन्द्राय नमः" },
  Mars:    { short: "Ma", color: "#dc2626", name: "Mangal",      mantra: "ॐ मङ्गलाय नमः" },
  Mercury: { short: "Me", color: "#059669", name: "Budha",       mantra: "ॐ बुधाय नमः" },
  Jupiter: { short: "Ju", color: "#7c3aed", name: "Guru",        mantra: "ॐ गुरवे नमः" },
  Venus:   { short: "Ve", color: "#db2777", name: "Shukra",      mantra: "ॐ शुक्राय नमः" },
  Saturn:  { short: "Sa", color: "#1d4ed8", name: "Shani",       mantra: "ॐ शनैश्चराय नमः" },
  Rahu:    { short: "Ra", color: "#334155", name: "Rahu",        mantra: "ॐ राहवे नमः" },
  Ketu:    { short: "Ke", color: "#334155", name: "Ketu",        mantra: "ॐ केतवे नमः" },
};

const ZODIAC = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];
const ZODIAC_NUM = {
  Aries:1,Taurus:2,Gemini:3,Cancer:4,Leo:5,Virgo:6,
  Libra:7,Scorpio:8,Sagittarius:9,Capricorn:10,Aquarius:11,Pisces:12,
};
const ZODIAC_SYMBOLS = {
  Aries:"♈",Taurus:"♉",Gemini:"♊",Cancer:"♋",Leo:"♌",Virgo:"♍",
  Libra:"♎",Scorpio:"♏",Sagittarius:"♐",Capricorn:"♑",Aquarius:"♒",Pisces:"♓",
};
const HOUSE_SIGNIFICATIONS = {
  1:"Self, personality, health, character",
  2:"Wealth, family, speech, values",
  3:"Siblings, courage, communication",
  4:"Mother, home, vehicles, happiness",
  5:"Children, creativity, intelligence",
  6:"Health, enemies, service, debts",
  7:"Marriage, partnerships, business",
  8:"Longevity, secrets, transformation",
  9:"Father, luck, spirituality",
  10:"Career, reputation, karma",
  11:"Gains, income, friendships",
  12:"Expenses, foreign travel, liberation",
};

// House layout definitions (percentage coords, 0–100 scale)
// Each entry: { num, square/triangle, points[], center, numPos }
const HOUSE_DEFS = [
  { num:1,  shape:"square",   pts:[[50,0],[75,25],[50,50],[25,25]],  center:[50,22], numPos:[48,47] },
  { num:2,  shape:"triangle", pts:[[0,0],[50,0],[25,25]],             center:[25,12], numPos:[7,22]  },
  { num:3,  shape:"triangle", pts:[[0,0],[25,25],[0,50]],             center:[10,25], numPos:[19,14] },
  { num:4,  shape:"square",   pts:[[25,25],[50,50],[25,75],[0,50]],   center:[22,50], numPos:[47,48] },
  { num:5,  shape:"triangle", pts:[[0,50],[25,75],[0,100]],           center:[10,75], numPos:[19,62] },
  { num:6,  shape:"triangle", pts:[[25,75],[50,100],[0,100]],         center:[25,88], numPos:[7,78]  },
  { num:7,  shape:"square",   pts:[[50,50],[75,75],[50,100],[25,75]], center:[50,78], numPos:[48,53] },
  { num:8,  shape:"triangle", pts:[[75,75],[100,100],[50,100]],       center:[75,88], numPos:[63,78] },
  { num:9,  shape:"triangle", pts:[[75,75],[100,50],[100,100]],       center:[90,75], numPos:[71,62] },
  { num:10, shape:"square",   pts:[[75,25],[100,50],[75,75],[50,50]], center:[78,50], numPos:[53,48] },
  { num:11, shape:"triangle", pts:[[100,0],[100,50],[75,25]],         center:[90,25], numPos:[71,38] },
  { num:12, shape:"triangle", pts:[[50,0],[100,0],[75,25]],           center:[75,12], numPos:[63,22] },
];

// Point-in-polygon test
function pointInPolygon(px, py, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Format degree nicely
const fmtDeg = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "";
  const d = Math.floor(n % 30);
  const m = Math.floor((n - Math.floor(n)) * 60);
  return `${d}°${m.toString().padStart(2,"0")}'`;
};

// Sanitize sign name
const sanitizeSign = (s) => {
  if (!s) return "Aries";
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
};

// Calculate house from sign + ascendant
const getHouseFromSign = (planetSign, ascSign) => {
  const p = ZODIAC_NUM[planetSign] || 1;
  const a = ZODIAC_NUM[ascSign] || 1;
  return ((p - a + 12) % 12) + 1;
};

// Sign for a given house number
const signForHouse = (ascSign, houseNum) => {
  const aIdx = ZODIAC_NUM[ascSign] || 1;
  const idx = ((aIdx - 1 + (houseNum - 1)) % 12);
  return ZODIAC[idx];
};

// Process raw planets prop → { lagna, planetsByHouse }
const processPlanets = (planets, ascendant) => {
  let raw = [];
  if (Array.isArray(planets)) raw = planets;
  else if (planets?.planets && Array.isArray(planets.planets)) raw = planets.planets;
  else if (planets?.data && Array.isArray(planets.data)) raw = planets.data;
  else if (typeof planets === "object") raw = Object.values(planets).filter(v => v?.name);

  const validNames = ["sun","moon","mars","mercury","jupiter","venus","saturn","rahu","ketu"];

  let lagna = sanitizeSign(ascendant) || "Aries";
  const ascEntry = raw.find(p => p.name?.toLowerCase() === "ascendant");
  if (ascEntry?.sign) lagna = sanitizeSign(ascEntry.sign);

  const byHouse = { 1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[] };

  raw.forEach(p => {
    if (!p.name) return;
    const nameLower = p.name.trim().toLowerCase();
    if (!validNames.includes(nameLower)) return;

    const name = p.name.trim().charAt(0).toUpperCase() + p.name.trim().slice(1).toLowerCase();
    const sign = p.sign ? sanitizeSign(p.sign) : null;

    let house = sign ? getHouseFromSign(sign, lagna) : parseInt(p.house);
    if (!house || house < 1 || house > 12) house = 1;

    const degRaw = p.normDegree ?? p.fullDegree;
    const deg = isNaN(parseFloat(degRaw)) ? "" : fmtDeg(degRaw);
    const retrograde = p.retrograde === true || p.isRetro === true || p.isRetro === "true";

    byHouse[house].push({ name, sign, house, deg, retrograde });
  });

  return { lagna, byHouse, hasData: raw.length > 0 };
};

// ─── Main Component ───────────────────────────────────────────────────────────
const KundliChart = ({
  planets = [],
  ascendant = "Aries",
  name = "",
  onHouseClick,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState(420);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [hoveredHouse, setHoveredHouse] = useState(null);

  const { lagna, byHouse, hasData } = React.useMemo(
    () => processPlanets(planets, ascendant),
    [planets, ascendant]
  );

  // Responsive size
  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect?.width || 420;
      setSize(Math.min(w - 10, 500));
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Draw canvas ─────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const sc = (v) => (v / 100) * W; // scale percent → px

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#fffbf5";
    ctx.fillRect(0, 0, W, H);

    // Draw Om watermark
    ctx.save();
    ctx.font = `bold ${W * 0.22}px serif`;
    ctx.fillStyle = "rgba(234,88,12,0.06)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ॐ", W / 2, H / 2);
    ctx.restore();

    // ── Draw each house ──────────────────────────────────────────────────────
    HOUSE_DEFS.forEach(house => {
      const pts = house.pts.map(([x, y]) => [sc(x), sc(y)]);
      const isHovered  = hoveredHouse  === house.num;
      const isSelected = selectedHouse === house.num;

      // Fill
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();

      if (isSelected) {
        ctx.fillStyle = "rgba(251,146,60,0.18)";
      } else if (isHovered) {
        ctx.fillStyle = "rgba(251,146,60,0.09)";
      } else {
        ctx.fillStyle = house.num === 1 ? "rgba(254,243,199,0.5)" : "rgba(255,251,245,0.4)";
      }
      ctx.fill();

      // Border
      ctx.strokeStyle = isSelected ? "#ea580c" : isHovered ? "#fb923c" : "#d4a96a";
      ctx.lineWidth = isSelected ? 2 : 1.2;
      ctx.stroke();

      // ── House number (small, corner) ────────────────────────────────────
      const [nx, ny] = house.numPos;
      ctx.save();
      ctx.font = `600 ${W * 0.026}px Inter, Arial`;
      ctx.fillStyle = house.num === 1 ? "#92400e" : "#a16207";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(house.num, sc(nx), sc(ny));
      ctx.restore();

      // ── Sign symbol + name in corner ──────────────────────────────────
      const houseSign = signForHouse(lagna, house.num);
      const sym = ZODIAC_SYMBOLS[houseSign] || "";
      const [cx, cy] = house.center;

      ctx.save();
      ctx.font = `${W * 0.032}px serif`;
      ctx.fillStyle = "rgba(120,80,20,0.35)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sym, sc(cx), sc(cy) - W * 0.038);
      ctx.restore();

      // ── Planets in this house ──────────────────────────────────────────
      const ps = byHouse[house.num] || [];
      if (ps.length === 0) return;

      const lineH = W * 0.038;
      const perRow = 3;
      const totalRows = Math.ceil(ps.length / perRow);
      const startY = sc(cy) + (ps.length === 1 ? 0 : -(totalRows - 1) * lineH * 0.5);

      ps.forEach((p, i) => {
        const meta = PLANET_META[p.name] || { short: p.name.slice(0, 2), color: "#6b7280" };
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const rowCount = Math.min(ps.length - row * perRow, perRow);
        const xSpread = W * 0.044;
        const xOff = (col - (rowCount - 1) / 2) * xSpread;
        const yOff = row * lineH;

        const px2 = sc(cx) + xOff;
        const py2 = startY + yOff;

        // Planet circle bg
        ctx.beginPath();
        ctx.arc(px2, py2, W * 0.018, 0, Math.PI * 2);
        ctx.fillStyle = meta.color;
        ctx.fill();

        // Planet abbrev text
        ctx.save();
        ctx.font = `bold ${W * 0.024}px Inter, Arial`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(meta.short, px2, py2 + 0.5);
        ctx.restore();

        // Retrograde R
        if (p.retrograde) {
          ctx.save();
          ctx.font = `bold ${W * 0.016}px Inter, Arial`;
          ctx.fillStyle = "#dc2626";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("R", px2 + W * 0.02, py2 - W * 0.016);
          ctx.restore();
        }
      });
    });

    // Outer border
    ctx.strokeStyle = "#d4a96a";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, W - 2, H - 2);
  }, [lagna, byHouse, selectedHouse, hoveredHouse, size]);

  useEffect(() => { draw(); }, [draw]);

  // ── Mouse interaction helpers ────────────────────────────────────────────
  const getHouseAtPoint = (canvas, clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = ((clientX - rect.left) * scaleX) / canvas.width * 100;
    const py = ((clientY - rect.top) * scaleY) / canvas.height * 100;

    for (const h of HOUSE_DEFS) {
      if (pointInPolygon(px, py, h.pts)) return h.num;
    }
    return null;
  };

  const handleMouseMove = (e) => {
    const h = getHouseAtPoint(canvasRef.current, e.clientX, e.clientY);
    setHoveredHouse(h);
    if (canvasRef.current) canvasRef.current.style.cursor = h ? "pointer" : "default";
  };

  const handleClick = (e) => {
    const h = getHouseAtPoint(canvasRef.current, e.clientX, e.clientY);
    if (!h) return;
    const next = selectedHouse === h ? null : h;
    setSelectedHouse(next);
    if (onHouseClick && next) {
      onHouseClick(next, {
        house: next,
        sign: signForHouse(lagna, next),
        planets: byHouse[next] || [],
        signification: HOUSE_SIGNIFICATIONS[next],
      });
    }
  };

  const handleMouseLeave = () => setHoveredHouse(null);

  // Touch support
  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const h = getHouseAtPoint(canvasRef.current, touch.clientX, touch.clientY);
    if (!h) return;
    setSelectedHouse(prev => prev === h ? null : h);
  };

  if (!hasData) {
    return (
      <div className="w-full bg-white rounded-2xl border border-orange-200/50 p-8 text-center">
        <p className="text-gray-500">Planetary data not available to generate chart.</p>
      </div>
    );
  }

  const selSign    = selectedHouse ? signForHouse(lagna, selectedHouse) : null;
  const selPlanets = selectedHouse ? (byHouse[selectedHouse] || []) : [];

  return (
    <div className="w-full">
      {/* Chart name header */}
      {name && (
        <p className="text-center text-sm font-semibold text-amber-800 mb-2 tracking-wide">
          {name} — Lagna Chart
        </p>
      )}

      <div ref={containerRef} className="w-full flex flex-col items-center gap-4">

        {/* ── Canvas ──────────────────────────────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg shadow-orange-900/10"
             style={{ width: size, height: size }}>
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            style={{ width: size, height: size, display: "block" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        {/* ── Lagna badge ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-800">
          <span>{ZODIAC_SYMBOLS[lagna]}</span>
          <span>Lagna: {lagna}</span>
        </div>

        {/* ── Planet legend ────────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-4 py-3 bg-white/80 border border-amber-100 rounded-2xl w-full max-w-[500px]">
          {Object.entries(PLANET_META).map(([k, v]) => (
            <div key={k} className="inline-flex items-center gap-1.5 text-xs">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                   style={{ backgroundColor: v.color }}>
                {v.short}
              </div>
              <span className="text-stone-600 font-medium">{k}</span>
            </div>
          ))}
        </div>

        {/* ── Selected house detail ─────────────────────────────────────── */}
        {selectedHouse && (
          <div className="w-full max-w-[500px] rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  Bhava {selectedHouse}
                </span>
                <p className="font-bold text-stone-800 mt-1 text-lg">
                  {ZODIAC_SYMBOLS[selSign]} {selSign}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">{HOUSE_SIGNIFICATIONS[selectedHouse]}</p>
              </div>
              <button
                onClick={() => setSelectedHouse(null)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:bg-rose-100 hover:text-rose-600 transition-colors flex items-center justify-center text-sm"
              >✕</button>
            </div>

            {selPlanets.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-3 border border-dashed border-stone-200 rounded-xl">
                No planets in this house
              </p>
            ) : (
              <ul className="space-y-2">
                {selPlanets.map((p, i) => {
                  const meta = PLANET_META[p.name] || { short:"?", color:"#6b7280", name: p.name };
                  return (
                    <li key={i} className="flex items-center justify-between gap-3 bg-stone-50 rounded-xl px-3 py-2 border border-stone-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                             style={{ backgroundColor: meta.color }}>
                          {meta.short}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-800 text-sm">{p.name}</p>
                          {p.retrograde && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 rounded">Retrograde</span>
                          )}
                        </div>
                      </div>
                      {p.deg && <span className="text-xs font-mono text-stone-500">{p.deg}</span>}
                    </li>
                  );
                })}
              </ul>
            )}

            {selPlanets.length > 0 && PLANET_META[selPlanets[0].name] && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
                <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-0.5">Mantra</p>
                <p className="text-base font-bold text-stone-800 font-serif">
                  {PLANET_META[selPlanets[0].name].mantra}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KundliChart;