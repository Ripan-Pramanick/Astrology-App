// client/src/components/kundli/PlanetTable.jsx
import React from 'react';

const ZODIAC_NUMBERS = {
  "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4, "Leo": 5, "Virgo": 6,
  "Libra": 7, "Scorpio": 8, "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
};

const PLANET_ABBREVIATIONS = {
  "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
  "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke"
};

const PlanetTable = ({ planets }) => {
  // 🟢 ডেটা রিসিভ করা
  const planetData = Array.isArray(planets) ? planets : (planets?.data || planets?.response || []);

  if (planetData.length === 0) return null;

  // 🟢 Lagna Calculation
  const ascendantPlanet = planetData.find(p => p.name?.toLowerCase() === 'ascendant' || p.house === 1);
  const ascendantSign = ascendantPlanet ? ascendantPlanet.sign : "Aries";
  const ascendantNo = ZODIAC_NUMBERS[ascendantSign] || 1;

  const validPlanetsList = [];

  planetData.forEach(planet => {
    if (planet.name?.toLowerCase() !== 'ascendant') {
      let houseNum = parseInt(planet.house);
      if (!houseNum && planet.sign) {
        const planetSignNo = ZODIAC_NUMBERS[planet.sign];
        houseNum = (planetSignNo - ascendantNo + 12) % 12 + 1;
      }
      if (houseNum >= 1 && houseNum <= 12) {
        validPlanetsList.push({ ...planet, calculatedHouse: houseNum });
      }
    }
  });

  // 🟢 ঘর অনুযায়ী গ্রহগুলোকে সাজানো
  const sortedPlanets = [...validPlanetsList].sort((a, b) => a.calculatedHouse - b.calculatedHouse);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-[#e6b34c]/30 p-6 mt-6">
      <h3 className="text-[#4a3727] font-bold font-serif text-lg mb-4 border-b border-[#e6b34c]/20 pb-3 text-center">
        Planetary Positions Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sortedPlanets.map((planet, index) => {
          const planetName = planet.name || "Unknown";
          const abbrev = PLANET_ABBREVIATIONS[planetName] || planetName.slice(0, 2);

          // 🟢 ডিগ্রির বুলেটপ্রুফ ক্যালকুলেশন
          let degreeValue = "0.00";
          if (planet.normDegree !== undefined && planet.normDegree !== null) {
            degreeValue = parseFloat(planet.normDegree).toFixed(2);
          } else if (planet.fullDegree !== undefined && planet.fullDegree !== null) {
            degreeValue = (parseFloat(planet.fullDegree) % 30).toFixed(2); // যদি normDegree না থাকে
          }

          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-[#fffdfa] hover:bg-[#e6b34c]/10 transition-colors border border-[#e6b34c]/10 hover:border-[#e6b34c]/40 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e6b34c]/20 flex items-center justify-center text-[#4a3727] font-bold font-serif text-base shadow-inner border border-[#e6b34c]/30">
                  {abbrev}
                </div>
                <div>
                  <p className="text-[#4a3727] font-bold text-sm capitalize">{planetName.toLowerCase()}</p>
                  <p className="text-[#c28135] text-xs font-semibold">{planet.sign}</p>
                </div>
              </div>

              <div className="text-right flex flex-col justify-center">
                <p className="text-[#4a3727] font-bold text-sm bg-orange-50 px-2 py-0.5 rounded text-center border border-orange-100 mb-1">
                  House {planet.calculatedHouse}
                </p>
                {/* 🟢 ডিগ্রি এখানে একটু বড় এবং স্পষ্ট করে দেখানো হলো */}
                <p className="text-slate-600 text-sm font-bold">
                  {degreeValue}°
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanetTable;