// client/src/components/kundli/KundliChart.jsx
import React, { useEffect, useState } from 'react';

const ZODIAC_NUMBERS = {
  "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4, "Leo": 5, "Virgo": 6,
  "Libra": 7, "Scorpio": 8, "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
};

const PLANET_ABBREVIATIONS = {
  "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
  "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke"
};

const KundliChart = ({ planets }) => {
  const [planetData, setPlanetData] = useState([]);

  useEffect(() => {
    const dataArray = Array.isArray(planets) ? planets : (planets?.data || planets?.response || []);
    if (dataArray.length > 0) {
      setPlanetData(dataArray);
    }
  }, [planets]);

  const layout = {
    1:  { pX: 200, pY: 100, sX: 200, sY: 25 },
    2:  { pX: 100, pY: 55,  sX: 100, sY: 20 },
    3:  { pX: 55,  pY: 100, sX: 20,  sY: 105 },
    4:  { pX: 100, pY: 200, sX: 25,  sY: 205 },
    5:  { pX: 55,  pY: 300, sX: 20,  sY: 305 },
    6:  { pX: 100, pY: 355, sX: 100, sY: 390 },
    7:  { pX: 200, pY: 300, sX: 200, sY: 385 },
    8:  { pX: 300, pY: 355, sX: 300, sY: 390 },
    9:  { pX: 345, pY: 300, sX: 380, sY: 305 },
    10: { pX: 300, pY: 200, sX: 375, sY: 205 },
    11: { pX: 345, pY: 100, sX: 380, sY: 105 },
    12: { pX: 300, pY: 55,  sX: 300, sY: 20 }
  };

  const planetsByHouse = Array.from({ length: 12 }, () => []);
  const ascendantPlanet = planetData.find(p => p.name?.toLowerCase() === 'ascendant' || p.house === 1);
  const ascendantSign = ascendantPlanet ? ascendantPlanet.sign : "Aries";
  const ascendantNo = ZODIAC_NUMBERS[ascendantSign] || 1;

  if (planetData.length > 0) {
    planetData.forEach(planet => {
      if (planet.name?.toLowerCase() !== 'ascendant') {
        let houseNum = parseInt(planet.house);
        if (!houseNum && planet.sign) {
          const planetSignNo = ZODIAC_NUMBERS[planet.sign];
          houseNum = (planetSignNo - ascendantNo + 12) % 12 + 1;
        }
        if (houseNum >= 1 && houseNum <= 12) {
          planetsByHouse[houseNum - 1].push(planet);
        }
      }
    });
  }

  if (planetData.length === 0) {
    return <div className="text-center p-4 text-[#c28135] animate-pulse">Mapping the cosmic stars...</div>;
  }

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto select-none">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm">
        <rect x="0" y="0" width="400" height="400" fill="#fffdfa" />
        <polygon points="200,0 100,100 200,200 300,100" fill="#e6b34c" fillOpacity="0.1" />

        <g stroke="#e6b34c" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="396" height="396" />
          <line x1="0" y1="0" x2="400" y2="400" />
          <line x1="400" y1="0" x2="0" y2="400" />
          <polygon points="200,0 400,200 200,400 0,200" />
        </g>

        {Object.entries(layout).map(([house, coords]) => {
          const houseIndex = parseInt(house);
          let signNo = (ascendantNo + houseIndex - 1) % 12;
          if (signNo === 0) signNo = 12;
          const housePlanets = planetsByHouse[houseIndex - 1];

          return (
            <g key={house} className="text-center">
              <text x={coords.sX} y={coords.sY} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#c28135" fontFamily="serif">{signNo}</text>
              {houseIndex === 1 && <text x={200} y={45} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#e6b34c" fontFamily="serif">Lagna</text>}
              {housePlanets.length > 0 && (
                <text x={coords.pX} y={coords.pY - ((housePlanets.length - 1) * 10)} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#4a3727" fontFamily="serif">
                  {housePlanets.map((p, i) => {
                    let planetName = p.name || "Unk";
                    const abbrev = PLANET_ABBREVIATIONS[planetName] || planetName.slice(0, 2);
                    return <tspan key={i} x={coords.pX} dy={i === 0 ? 0 : 20}>{abbrev}</tspan>;
                  })}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default KundliChart;