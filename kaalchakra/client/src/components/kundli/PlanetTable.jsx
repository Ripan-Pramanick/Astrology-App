// client/src/components/kundli/PlanetTable.jsx
import React, { useState, useMemo } from 'react';

// Zodiac numbers for sign to house calculation
const ZODIAC_NUMBERS = {
  "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4, "Leo": 5, "Virgo": 6,
  "Libra": 7, "Scorpio": 8, "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
};

// Planet abbreviations
const PLANET_ABBREVIATIONS = {
  "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
  "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke", "Lagna": "Lg"
};

// Planet colors for visual representation
const PLANET_COLORS = {
  'Sun': '#F7931E', 'Moon': '#6B7280', 'Mars': '#DC2626', 'Mercury': '#10B981',
  'Jupiter': '#8B5CF6', 'Venus': '#EC4899', 'Saturn': '#3B82F6', 'Rahu': '#1f2a44', 'Ketu': '#1f2a44', 'Lagna': '#0c4a6e'
};

// Planet config specifically for Mobile Pill Layout
const PLANET_MOBILE_CONFIG = {
  'Sun': { symbol: '☉', bg: 'bg-[#ffebd2]', iconBg: 'bg-[#f8d7b0]', text: 'text-[#5c4033]' },
  'Moon': { symbol: '☽', bg: 'bg-[#f3e8ff]', iconBg: 'bg-[#e9d5ff]', text: 'text-[#4b2c20]' },
  'Mars': { symbol: '♂', bg: 'bg-[#fff9c4]', iconBg: 'bg-[#fff59d]', text: 'text-[#5c4033]' },
  'Mercury': { symbol: '☿', bg: 'bg-[#ffe4e6]', iconBg: 'bg-[#fecdd3]', text: 'text-[#4b2c20]' },
  'Jupiter': { symbol: '♃', bg: 'bg-[#dbeafe]', iconBg: 'bg-[#bfdbfe]', text: 'text-[#1e3a8a]' },
  'Venus': { symbol: '♀', bg: 'bg-[#dcfce7]', iconBg: 'bg-[#bbf7d0]', text: 'text-[#14532d]' },
  'Saturn': { symbol: '♄', bg: 'bg-[#e0e7ff]', iconBg: 'bg-[#c7d2fe]', text: 'text-[#312e81]' },
  'Rahu': { symbol: '☊', bg: 'bg-[#fef3c7]', iconBg: 'bg-[#fde68a]', text: 'text-[#78350f]' },
  'Ketu': { symbol: '☋', bg: 'bg-[#ecfccb]', iconBg: 'bg-[#d9f99d]', text: 'text-[#365314]' },
  'Lagna': { symbol: 'Lg', bg: 'bg-[#bae6fd]', iconBg: 'bg-[#7dd3fc]', text: 'text-[#0c4a6e]' },
};

// Zodiac symbols
const ZODIAC_SYMBOLS = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

// Planet lordship based on sign
const getLordBySign = (sign) => {
  const lordMap = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
    'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
    'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
  };
  return lordMap[sign] || 'Unknown';
};

// Get degree value from planet object
const getDegreeValue = (planet) => {
  if (planet.normDegree !== undefined && planet.normDegree !== null) {
    return parseFloat(planet.normDegree).toFixed(2);
  }
  if (planet.fullDegree !== undefined && planet.fullDegree !== null) {
    return (parseFloat(planet.fullDegree) % 30).toFixed(2);
  }
  if (planet.degree && planet.degree !== '0° 00\'') {
    const match = planet.degree.match(/(\d+(?:\.\d+)?)/);
    if (match) return parseFloat(match[1]).toFixed(2);
  }
  return "0.00";
};

// Format degree for display
const formatDegree = (degree) => {
  const num = parseFloat(degree);
  const deg = Math.floor(num);
  const min = Math.floor((num - deg) * 60);
  const sec = Math.floor((((num - deg) * 60) - min) * 60);
  return `${deg}°${min.toString().padStart(2, '0')}'${sec.toString().padStart(2, '0')}”`;
};

const PlanetTable = ({ planets = [] }) => {
  const [sortBy, setSortBy] = useState('house');
  const [sortOrder, setSortOrder] = useState('asc');

  // Process planets data - handle different API response formats
  const processPlanets = (planetsData) => {
    if (!planetsData) return [];
    if (Array.isArray(planetsData)) return planetsData;
    if (planetsData.data && Array.isArray(planetsData.data)) return planetsData.data;
    if (planetsData.planets && Array.isArray(planetsData.planets)) return planetsData.planets;
    return [];
  };

  const rawPlanets = processPlanets(planets);
  
  // Calculate ascendant sign from planets
  const ascendantPlanet = rawPlanets.find(p => 
    p.name?.toLowerCase() === 'ascendant' || 
    p.name === 'Ascendant' ||
    p.name?.toLowerCase() === 'lagna' ||
    p.name === 'Lagna' ||
    p.house === 1
  );
  const ascendantSign = ascendantPlanet?.sign || "Aries";
  const ascendantNo = ZODIAC_NUMBERS[ascendantSign] || 1;

  // Process and validate planets
  const validPlanets = useMemo(() => {
    const result = [];
    
    rawPlanets.forEach(planet => {
      let houseNum = parseInt(planet.house);
      
      if (!houseNum && planet.sign) {
        const planetSignNo = ZODIAC_NUMBERS[planet.sign];
        houseNum = (planetSignNo - ascendantNo + 12) % 12 + 1;
      }
      
      if (houseNum && houseNum >= 1 && houseNum <= 12) {
        const isLagna = planet.name?.toLowerCase() === 'ascendant' || planet.name === 'Ascendant' || planet.name?.toLowerCase() === 'lagna' || planet.name === 'Lagna';
        result.push({
          name: isLagna ? 'Lagna' : planet.name,
          sign: planet.sign,
          house: houseNum,
          degree: getDegreeValue(planet),
          normDegree: planet.normDegree,
          retrograde: planet.retrograde || false,
          lord: planet.lord || getLordBySign(planet.sign),
          isAscendant: isLagna
        });
      }
    });
    
    return result;
  }, [rawPlanets, ascendantNo]);

  // Sort planets
  const sortedPlanets = useMemo(() => {
    const sorted = [...validPlanets];
    sorted.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'house') {
        aVal = parseInt(aVal);
        bVal = parseInt(bVal);
      }
      
      if (sortBy === 'degree') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      
      if (sortBy === 'name') {
        aVal = aVal || '';
        bVal = bVal || '';
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // 🌟 Lagna always stays at the TOP
    const lagnaIndex = sorted.findIndex(p => p.isAscendant);
    if (lagnaIndex !== -1) {
      const lagna = sorted.splice(lagnaIndex, 1)[0];
      sorted.unshift(lagna); 
    }

    return sorted;
  }, [validPlanets, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <span className="ml-1 text-orange-200/50 text-xs">↕</span>;
    return <span className="ml-1 text-white">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  if (!validPlanets || validPlanets.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm border border-orange-200/50 p-8 text-center">
        <div className="text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">Planetary data not available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .grad-table-header {
            background: linear-gradient(to right, #f97316, #f59e0b);
          }
        `}
      </style>
      <div className="w-full p-2 sm:p-4 bg-[#fdfaf5] rounded-3xl">
        {/* Header with count */}
        <div className="mb-6 flex justify-between items-center px-2">
          <h3 className="text-[#4a3727] font-bold text-lg flex items-center gap-2">
            <span className="inline-block w-1 h-5 bg-orange-500 rounded-full"></span>
            Planetary Positions
          </h3>
          <span className="text-xs text-gray-500 bg-white shadow-sm border border-gray-100 px-3 py-1 rounded-full font-medium">
            {validPlanets.length} Positions
          </span>
        </div>

        {/* 📱 MOBILE VIEW (Pill Layout) */}
        <div className="flex flex-col gap-3 md:hidden px-1">
          {sortedPlanets.map((planet, index) => {
            const config = PLANET_MOBILE_CONFIG[planet.name] || PLANET_MOBILE_CONFIG['Sun'];
            const rashiSymbol = ZODIAC_SYMBOLS[planet.sign] || '';
            const degreeText = formatDegree(planet.degree);
            // ✅ এখানে গ্রহের শর্ট নেম (যেমন: Su, Mo, Ma, Ra) আনা হয়েছে
            const abbrev = PLANET_ABBREVIATIONS[planet.name] || planet.name;
            
            return (
              <div 
                key={index}
                className={`flex items-center w-full rounded-full pr-3 py-1 shadow-sm border border-black/5 ${config.bg} relative overflow-hidden`}
              >
                {/* Left Icon Part (Width reduced to give more space for text) */}
                <div className={`flex items-center justify-center min-w-[70px] h-9 rounded-full shadow-inner ${config.iconBg} ${config.text} px-2`}>
                  <span className="text-base mr-1.5">{config.symbol}</span>
                  <span className="text-[14px] font-extrabold tracking-wider">{abbrev}</span>
                </div>

                {/* Right Data Part */}
                <div className={`flex-1 text-[12px] font-semibold ${config.text} flex items-center justify-between pl-2.5 pr-1`}>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-base">{rashiSymbol}</span>
                    <span>{planet.sign} {degreeText}</span>
                  </div>
                  <span className="whitespace-nowrap ml-1 opacity-90 font-bold">
                    {planet.house}{planet.house === 1 ? 'st' : planet.house === 2 ? 'nd' : planet.house === 3 ? 'rd' : 'th'}
                  </span>
                </div>
                
                {/* Retrograde Marker for Mobile */}
                {!planet.isAscendant && planet.retrograde && (
                  <div className="absolute top-1 right-2 text-[9px] font-black text-red-600">R</div>
                )}
              </div>
            );
          })}
        </div>

        {/* 💻 DESKTOP VIEW (Table Layout) */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
          <table className="min-w-full">
            <thead className="grad-table-header">
              <tr>
                <th onClick={() => handleSort('name')} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors">
                  Planet <SortIcon column="name" />
                </th>
                <th onClick={() => handleSort('sign')} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors">
                  Sign <SortIcon column="sign" />
                </th>
                <th onClick={() => handleSort('house')} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors">
                  House <SortIcon column="house" />
                </th>
                <th onClick={() => handleSort('degree')} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors">
                  Degree <SortIcon column="degree" />
                </th>
                <th onClick={() => handleSort('lord')} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors">
                  Lord <SortIcon column="lord" />
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedPlanets.map((planet, idx) => {
                const abbrev = PLANET_ABBREVIATIONS[planet.name] || planet.name?.slice(0, 2) || '?';
                const planetColor = PLANET_COLORS[planet.name] || '#6B7280';
                
                return (
                  <tr key={idx} className="hover:bg-orange-50/50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                          style={{ backgroundColor: planetColor }}
                        >
                          {abbrev}
                        </div>
                        <span className="font-semibold text-gray-800">{planet.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{ZODIAC_SYMBOLS[planet.sign] || ''}</span>
                        <span className="text-gray-700">{planet.sign}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                        {planet.house}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <span className="font-mono text-sm text-gray-700 font-medium">
                          {formatDegree(planet.degree)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-700">{planet.lord}</span>
                        {PLANET_COLORS[planet.lord] && (
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLANET_COLORS[planet.lord] }} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {planet.isAscendant ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
                          Lagna
                        </span>
                      ) : planet.retrograde ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Retrograde
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Direct
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm">
          <div className="flex items-start gap-3 text-sm text-amber-800">
            <span className="text-xl">✨</span>
            <p className="leading-relaxed">
              <span className="font-bold text-orange-700">Vedic Astrology System:</span> House positions are calculated relative to the Lagna. Degrees reflect the accurate sidereal (Nirayana) positions utilizing the Lahiri Ayanamsa.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanetTable;