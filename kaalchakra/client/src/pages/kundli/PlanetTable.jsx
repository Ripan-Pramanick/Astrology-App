// client/src/components/kundli/PlanetTable.jsx
import React from 'react';

const PlanetTable = ({ planets }) => {
  if (!planets || planets.length === 0) {
    return <div className="p-4 text-amber-200/50 text-center font-sans">No planetary data available</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left font-sans border-collapse">
        <thead>
          <tr className="bg-amber-900/30 text-amber-300 text-sm uppercase tracking-wider border-b border-amber-500/30">
            <th className="py-4 px-6 font-semibold">Planet</th>
            <th className="py-4 px-6 font-semibold">Sign (Rashi)</th>
            <th className="py-4 px-6 font-semibold">Degree</th>
            <th className="py-4 px-6 font-semibold">House</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-500/10 text-amber-100/80">
          {planets.map((planet, index) => (
            <tr 
              key={index} 
              className="hover:bg-amber-500/5 transition-colors duration-200"
            >
              <td className="py-4 px-6 font-medium text-amber-200 flex items-center gap-2">
                {/* গ্রহের নামের প্রথম অক্ষরটা একটু স্টাইল করে দেখানো */}
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#111827] border border-amber-500/30 text-amber-500 font-serif font-bold text-xs">
                  {planet.name.charAt(0)}
                </span>
                {planet.name}
              </td>
              <td className="py-4 px-6">{planet.sign}</td>
              <td className="py-4 px-6">{planet.normDegree ? planet.normDegree.toFixed(2) + '°' : '-'}</td>
              <td className="py-4 px-6 font-medium text-amber-400/80">{planet.house}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanetTable;