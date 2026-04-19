// client/src/components/kundli/KundliChart.jsx
import React, { useState } from 'react';

const KundliChart = ({ chartData, planetsList, onHouseClick }) => {
  const [selectedHouse, setSelectedHouse] = useState(null);

  // North Indian chart layout (3x4 grid with specific house positions)
  // House positions in North Indian style:
  // Row 1: Houses 9, 8, 7 (top row)
  // Row 2: Houses 10, 1/12, 6 (middle rows with central square)
  // Row 3: Houses 11, 2, 5
  // Row 4: Houses 12, 3, 4 (bottom row)
  
  const northIndianLayout = [
    { row: 0, col: 0, house: 9 },   // Top-left
    { row: 0, col: 1, house: 8 },   // Top-center  
    { row: 0, col: 2, house: 7 },   // Top-right
    { row: 1, col: 0, house: 10 },  // Middle-left
    { row: 1, col: 1, house: 1 },   // Center-left (Lagna)
    { row: 1, col: 2, house: 6 },   // Middle-right
    { row: 2, col: 0, house: 11 },  // Bottom-left
    { row: 2, col: 1, house: 2 },   // Bottom-center
    { row: 2, col: 2, house: 5 },   // Bottom-right
    { row: 3, col: 0, house: 12 },  // Extra row left
    { row: 3, col: 1, house: 3 },   // Extra row center
    { row: 3, col: 2, house: 4 },   // Extra row right
  ];

  // Standard 3x4 grid layout (simpler version)
  const standardLayout = [
    { row: 0, col: 0, house: 1 },
    { row: 0, col: 1, house: 2 },
    { row: 0, col: 2, house: 3 },
    { row: 1, col: 0, house: 4 },
    { row: 1, col: 1, house: 5 },
    { row: 1, col: 2, house: 6 },
    { row: 2, col: 0, house: 7 },
    { row: 2, col: 1, house: 8 },
    { row: 2, col: 2, house: 9 },
    { row: 3, col: 0, house: 10 },
    { row: 3, col: 1, house: 11 },
    { row: 3, col: 2, house: 12 },
  ];

  // Get planet symbol
  const getPlanetSymbol = (planetName) => {
    const symbols = {
      'Sun': '☉',
      'Moon': '☽',
      'Mars': '♂',
      'Mercury': '☿',
      'Jupiter': '♃',
      'Venus': '♀',
      'Saturn': '♄',
      'Rahu': '☊',
      'Ketu': '☋',
      'Uranus': '⛢',
      'Neptune': '♆',
      'Pluto': '♇'
    };
    return symbols[planetName] || planetName.charAt(0);
  };

  // Get zodiac sign symbol
  const getZodiacSymbol = (sign) => {
    const symbols = {
      'Aries': '♈',
      'Taurus': '♉',
      'Gemini': '♊',
      'Cancer': '♋',
      'Leo': '♌',
      'Virgo': '♍',
      'Libra': '♎',
      'Scorpio': '♏',
      'Sagittarius': '♐',
      'Capricorn': '♑',
      'Aquarius': '♒',
      'Pisces': '♓'
    };
    return symbols[sign] || sign;
  };

  // Get house data
  const getHouseData = (houseNumber) => {
    // Get house sign from chartData
    let houseSign = '';
    let houseLord = '';
    let planetsInHouse = [];
    
    if (chartData?.houses && chartData.houses[houseNumber - 1]) {
      const house = chartData.houses[houseNumber - 1];
      houseSign = house.sign || '';
      houseLord = house.lord || '';
    }
    
    // Get planets in this house from planetsList
    if (planetsList && Array.isArray(planetsList)) {
      planetsInHouse = planetsList.filter(planet => planet.house === houseNumber);
    }
    
    return {
      number: houseNumber,
      sign: houseSign,
      lord: houseLord,
      planets: planetsInHouse,
      isLagna: houseNumber === 1
    };
  };

  // Handle house click
  const handleHouseClick = (houseNumber) => {
    setSelectedHouse(houseNumber);
    if (onHouseClick) {
      onHouseClick(houseNumber, getHouseData(houseNumber));
    }
  };

  // Get sign color
  const getSignColor = (sign) => {
    const colors = {
      'Aries': '#FF6B6B', 'Taurus': '#4ECDC4', 'Gemini': '#45B7D1',
      'Cancer': '#96CEB4', 'Leo': '#FFEAA7', 'Virgo': '#DDA0DD',
      'Libra': '#98D8C8', 'Scorpio': '#F7DC6F', 'Sagittarius': '#BB8FCE',
      'Capricorn': '#85C1E9', 'Aquarius': '#76D7C4', 'Pisces': '#F5B7B1'
    };
    return colors[sign] || '#E8E8E8';
  };

  // Render a single house cell
  const renderHouseCell = (houseNumber, position) => {
    const houseData = getHouseData(houseNumber);
    const isSelected = selectedHouse === houseNumber;
    const signColor = getSignColor(houseData.sign);
    
    return (
      <div
        key={houseNumber}
        onClick={() => handleHouseClick(houseNumber)}
        className={`
          relative bg-white border-2 rounded-lg p-2 transition-all duration-200 cursor-pointer
          hover:shadow-lg hover:scale-105 hover:z-10
          ${isSelected ? 'ring-2 ring-orange-500 shadow-lg scale-105 z-10' : ''}
          ${houseData.isLagna ? 'bg-gradient-to-br from-orange-50 to-amber-50' : ''}
        `}
        style={{ borderColor: signColor }}
      >
        {/* House Number */}
        <div className="absolute top-1 left-2 text-xs font-bold text-gray-400">
          {houseNumber}
        </div>
        
        {/* Lagna Indicator */}
        {houseData.isLagna && (
          <div className="absolute top-1 right-2 text-[10px] font-bold text-orange-500">
            LAGNA
          </div>
        )}
        
        {/* Zodiac Sign */}
        <div className="text-center mt-4">
          <span className="text-2xl" style={{ color: signColor }}>
            {getZodiacSymbol(houseData.sign)}
          </span>
          <div className="text-xs font-medium text-gray-700 mt-0.5">
            {houseData.sign}
          </div>
        </div>
        
        {/* Planets in House */}
        {houseData.planets.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {houseData.planets.map((planet, idx) => (
              <div
                key={idx}
                className="group relative"
                title={`${planet.name} in ${houseData.sign} at ${planet.degree}`}
              >
                <span 
                  className="text-base cursor-help transition-transform hover:scale-110 inline-block"
                  style={{ 
                    color: planet.color || '#F7931E',
                    textShadow: '0 0 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {getPlanetSymbol(planet.name)}
                </span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  {planet.name} - {planet.degree}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Retrograde Indicator */}
        {houseData.planets.some(p => p.isRetrograde) && (
          <div className="absolute bottom-1 right-1 text-[10px] text-red-400 font-bold">
            R
          </div>
        )}
      </div>
    );
  };

  // Create the 4x3 grid layout
  const renderGridLayout = () => {
    const layout = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 11, 12]
    ];
    
    return (
      <div className="grid grid-cols-3 gap-2">
        {layout.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map(houseNumber => renderHouseCell(houseNumber))}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // North Indian style with central square
  const renderNorthIndianStyle = () => {
    const centerSquare = (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg border-2 border-orange-300 flex flex-col items-center justify-center shadow-inner">
          <span className="text-2xl">🕉️</span>
          <span className="text-[10px] font-bold text-orange-600 mt-1">KUNDLI</span>
        </div>
      </div>
    );
    
    return (
      <div className="relative">
        <div className="grid grid-cols-3 gap-2">
          {/* Row 1: Houses 9, 8, 7 */}
          <div>{renderHouseCell(9)}</div>
          <div>{renderHouseCell(8)}</div>
          <div>{renderHouseCell(7)}</div>
          
          {/* Row 2: Houses 10, Center, 6 */}
          <div>{renderHouseCell(10)}</div>
          <div className="relative">
            <div className="invisible">{renderHouseCell(1)}</div>
            {centerSquare}
          </div>
          <div>{renderHouseCell(6)}</div>
          
          {/* Row 3: Houses 11, 2, 5 */}
          <div>{renderHouseCell(11)}</div>
          <div>{renderHouseCell(2)}</div>
          <div>{renderHouseCell(5)}</div>
          
          {/* Row 4: Houses 12, 3, 4 */}
          <div>{renderHouseCell(12)}</div>
          <div>{renderHouseCell(3)}</div>
          <div>{renderHouseCell(4)}</div>
        </div>
      </div>
    );
  };

  // Legend Component
  const ChartLegend = () => (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-orange-500">★</span>
          <span className="text-gray-600">Lagna (Ascendant)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-red-400 text-xs">R</span>
          <span className="text-gray-600">Retrograde Planet</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-300"></div>
          <span className="text-gray-600">Kundli Center</span>
        </div>
      </div>
    </div>
  );

  // Empty state
  if (!chartData && (!planetsList || planetsList.length === 0)) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Chart data not available. Please generate your Kundli first.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-amber-50/30 to-orange-50/30 p-4 rounded-xl shadow-inner">
        {/* Chart Title */}
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            North Indian Style Birth Chart (Kundli)
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Click on any house for detailed information
          </p>
        </div>
        
        {/* Chart Grid */}
        {renderNorthIndianStyle()}
        
        {/* Legend */}
        <ChartLegend />
        
        {/* Selected House Details */}
        {selectedHouse && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200 shadow-sm">
            <h4 className="text-sm font-bold text-orange-600 mb-2">
              House {selectedHouse} Details
            </h4>
            {(() => {
              const houseData = getHouseData(selectedHouse);
              return (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Sign:</span>
                    <span className="ml-2 font-semibold">
                      {houseData.sign || '—'} {houseData.sign && getZodiacSymbol(houseData.sign)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Lord:</span>
                    <span className="ml-2 font-semibold">{houseData.lord || '—'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Planets:</span>
                    <span className="ml-2">
                      {houseData.planets.length > 0 
                        ? houseData.planets.map(p => p.name).join(', ')
                        : 'No planets'}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default KundliChart;