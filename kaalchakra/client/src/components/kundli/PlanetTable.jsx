// client/src/components/kundli/PlanetTable.jsx
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Zodiac numbers for sign to house calculation
const ZODIAC_NUMBERS = {
  "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4, "Leo": 5, "Virgo": 6,
  "Libra": 7, "Scorpio": 8, "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
};

// Zodiac array for translation index
const ZODIAC_ARRAY = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// Planet abbreviations
const PLANET_ABBREVIATIONS = {
  "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
  "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke"
};

// Planet colors for visual representation
const PLANET_COLORS = {
  'Sun': '#F7931E', 'Moon': '#6B7280', 'Mars': '#DC2626', 'Mercury': '#10B981',
  'Jupiter': '#8B5CF6', 'Venus': '#EC4899', 'Saturn': '#3B82F6', 'Rahu': '#1f2a44', 'Ketu': '#1f2a44'
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
  return `${deg}° ${min.toString().padStart(2, '0')}'`;
};

const PlanetTable = ({ planets = [] }) => {
  const { t } = useTranslation('kundli');
  const [sortBy, setSortBy] = useState('house');
  const [sortOrder, setSortOrder] = useState('asc');

  const processPlanets = (planetsData) => {
    if (!planetsData) return [];
    if (Array.isArray(planetsData)) return planetsData;
    if (planetsData.data && Array.isArray(planetsData.data)) return planetsData.data;
    if (planetsData.planets && Array.isArray(planetsData.planets)) return planetsData.planets;
    return [];
  };

  const rawPlanets = processPlanets(planets);
  
  const ascendantPlanet = rawPlanets.find(p => 
    p.name?.toLowerCase() === 'ascendant' || 
    p.name === 'Ascendant' ||
    p.house === 1
  );
  const ascendantSign = ascendantPlanet?.sign || "Aries";
  const ascendantNo = ZODIAC_NUMBERS[ascendantSign] || 1;

  const validPlanets = useMemo(() => {
    const result = [];
    rawPlanets.forEach(planet => {
      if (planet.name?.toLowerCase() === 'ascendant') return;
      if (planet.name === 'Ascendant') return;
      
      let houseNum = parseInt(planet.house);
      if (!houseNum && planet.sign) {
        const planetSignNo = ZODIAC_NUMBERS[planet.sign];
        houseNum = (planetSignNo - ascendantNo + 12) % 12 + 1;
      }
      
      if (houseNum && houseNum >= 1 && houseNum <= 12) {
        result.push({
          name: planet.name,
          sign: planet.sign,
          house: houseNum,
          degree: getDegreeValue(planet),
          normDegree: planet.normDegree,
          retrograde: planet.retrograde || false,
          lord: planet.lord || getLordBySign(planet.sign)
        });
      }
    });
    return result;
  }, [rawPlanets, ascendantNo]);

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
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
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
          <p className="text-gray-500">{t('planetTable.noData')}</p>
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
      <div className="w-full p-4">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-[#4a3727] font-bold text-lg flex items-center gap-2">
            <span className="inline-block w-1 h-5 bg-orange-500 rounded-full"></span>
            {t('planetTable.title')}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
            {validPlanets.length} {t('planetTable.planetsCount')}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="grad-table-header">
              <tr>
                <th onClick={() => handleSort('name')} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors">
                  {t('planetTable.planet')} <SortIcon column="name" />
                </th>
                <th onClick={() => handleSort('sign')} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors">
                  {t('planetTable.sign')} <SortIcon column="sign" />
                </th>
                <th onClick={() => handleSort('house')} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors">
                  {t('planetTable.house')} <SortIcon column="house" />
                </th>
                <th onClick={() => handleSort('degree')} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors">
                  {t('planetTable.degree')} <SortIcon column="degree" />
                </th>
                <th onClick={() => handleSort('lord')} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors">
                  {t('planetTable.lord')} <SortIcon column="lord" />
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  {t('planetTable.status')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedPlanets.map((planet, idx) => {
                const abbrev = PLANET_ABBREVIATIONS[planet.name] || planet.name?.slice(0, 2) || '?';
                const planetColor = PLANET_COLORS[planet.name] || '#6B7280';
                
                // Translated names for Zodiac and Lord
                const signIndex = ZODIAC_ARRAY.indexOf(planet.sign);
                const translatedSign = signIndex !== -1 ? t(`zodiac.${signIndex}`) : planet.sign;
                const translatedLord = t(`planets.${planet.lord}`, { defaultValue: planet.lord });
                
                return (
                  <tr key={idx} className="hover:bg-orange-50/50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ backgroundColor: planetColor }}>
                          {abbrev}
                        </div>
                        <span className="font-semibold text-gray-800">{t(`planets.${planet.name}`, { defaultValue: planet.name })}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{ZODIAC_SYMBOLS[planet.sign] || ''}</span>
                        <span className="text-gray-700">{translatedSign}</span>
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
                        {planet.normDegree && (
                          <span className="text-xs text-gray-400 ml-1">
                            ({planet.normDegree}°)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-700">{translatedLord}</span>
                        {PLANET_COLORS[planet.lord] && (
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLANET_COLORS[planet.lord] }} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {planet.retrograde ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          {t('retrogradeLabel')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {t('planetTable.direct')}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-amber-50/50 rounded-lg border border-amber-100">
          <div className="flex items-start gap-2 text-xs text-amber-700">
            <span className="text-base">📌</span>
            <div>
              {t('planetTable.note')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanetTable;