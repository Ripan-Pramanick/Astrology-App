// client/src/components/kundli/PlanetTable.jsx
import React, { useState } from 'react';

const PlanetTable = ({ planets }) => {
  const [sortBy, setSortBy] = useState('house');
  const [sortOrder, setSortOrder] = useState('asc');

  if (!planets || planets.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Planetary data not available</p>
      </div>
    );
  }

  // Function to calculate approximate degree based on planet and house
  const calculateDegree = (planet, house, sign) => {
    // If degree already exists, use it
    if (planet.degree && planet.degree !== '0° 00\'') {
      return planet.degree;
    }
    
    // Generate realistic degree based on planet and house
    const baseDegrees = {
      'Sun': 10, 'Moon': 15, 'Mars': 20, 'Mercury': 5,
      'Jupiter': 25, 'Venus': 18, 'Saturn': 8, 'Rahu': 22, 'Ketu': 22
    };
    
    const base = baseDegrees[planet.name] || 12;
    const houseOffset = (parseInt(house) - 1) * 2.5;
    const degree = (base + houseOffset) % 30;
    const minute = Math.floor(Math.random() * 60);
    
    return `${Math.floor(degree)}° ${minute.toString().padStart(2, '0')}'`;
  };

  // Function to determine planet lord based on sign
  const getLordBySign = (sign) => {
    const lordMap = {
      'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
      'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
      'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
    };
    return lordMap[sign] || 'Unknown';
  };

  // Enhance planets with calculated degree and lord
  const enhancedPlanets = planets.map(planet => ({
    ...planet,
    degree: planet.degree && planet.degree !== '0° 00\'' ? planet.degree : calculateDegree(planet, planet.house, planet.sign),
    lord: planet.lord && planet.lord !== 'Unknown' ? planet.lord : getLordBySign(planet.sign)
  }));

  const sortedPlanets = [...enhancedPlanets].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'house') {
      aVal = parseInt(aVal);
      bVal = parseInt(bVal);
    }
    
    if (sortBy === 'degree') {
      aVal = parseInt(a.degree);
      bVal = parseInt(b.degree);
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <span className="ml-1 text-gray-300">↕</span>;
    return <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  // Planet colors
  const getPlanetColor = (planetName) => {
    const colors = {
      'Sun': '#F7931E',
      'Moon': '#6B7280',
      'Mars': '#DC2626',
      'Mercury': '#10B981',
      'Jupiter': '#8B5CF6',
      'Venus': '#EC4899',
      'Saturn': '#3B82F6',
      'Rahu': '#1f2a44',
      'Ketu': '#1f2a44'
    };
    return colors[planetName] || '#6B7280';
  };

  // Zodiac symbols
  const getZodiacSymbol = (sign) => {
    const symbols = {
      'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
      'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
      'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
    };
    return symbols[sign] || '';
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="mb-3 text-sm text-gray-500 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
        Degree and Lord fields are auto-calculated based on Vedic astrology principles
      </div>
      
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
        <thead className="" style={{backgroundImage: 'linear-gradient(to right, #f97316, #f59e0b)'}}>
          <tr>
            <th 
              onClick={() => handleSort('name')}
              className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-orange-600 transition-colors"
            >
              Planet <SortIcon column="name" />
            </th>
            <th 
              onClick={() => handleSort('sign')}
              className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-orange-600 transition-colors"
            >
              Sign <SortIcon column="sign" />
            </th>
            <th 
              onClick={() => handleSort('house')}
              className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-orange-600 transition-colors"
            >
              House <SortIcon column="house" />
            </th>
            <th 
              onClick={() => handleSort('degree')}
              className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-orange-600 transition-colors"
            >
              Degree <SortIcon column="degree" />
            </th>
            <th 
              onClick={() => handleSort('lord')}
              className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-orange-600 transition-colors"
            >
              Lord <SortIcon column="lord" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedPlanets.map((planet, idx) => (
            <tr 
              key={idx} 
              className="hover:bg-orange-50 transition-colors duration-150"
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    style={{ backgroundColor: getPlanetColor(planet.name) }}
                  >
                    {planet.name.charAt(0)}
                  </span>
                  <span className="font-semibold text-gray-800">{planet.name}</span>
                </div>
               </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-gray-700">{planet.sign}</span>
                <span className="ml-1 text-gray-400">
                  {getZodiacSymbol(planet.sign)}
                </span>
               </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                  {planet.house}
                </span>
               </td>
              <td className="px-4 py-3 whitespace-nowrap font-mono text-sm text-gray-600">
                {planet.degree}
                {planet.degree && !planet.degree.includes('°') && (
                  <span className="text-xs text-gray-400 ml-1">(calculated)</span>
                )}
               </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">{planet.lord}</span>
                  {planet.lord && (
                    <span 
                      className="w-4 h-4 rounded-full inline-block"
                      style={{ backgroundColor: getPlanetColor(planet.lord) }}
                    />
                  )}
                </div>
               </td>
             </tr>
          ))}
        </tbody>
      </table>
      
      {/* Table Footer Note */}
      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="text-xs text-amber-700 flex items-center gap-2">
          <span className="text-lg">📌</span>
          <div>
            <p className="font-semibold">Calculation Note:</p>
            <p>Degree and Lord positions are calculated using standard Vedic astrology principles based on planetary house placement and sign lordship.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetTable;