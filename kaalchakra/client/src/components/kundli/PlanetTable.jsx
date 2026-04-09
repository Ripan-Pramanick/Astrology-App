// client/src/components/kundli/PlanetTable.jsx
import React from 'react';

const PlanetTable = ({ planets }) => {
  if (!planets || planets.length === 0) {
    return <div className="text-gray-500">No planet data available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Planet</th>
            <th className="px-4 py-2 border">Zodiac Sign</th>
            <th className="px-4 py-2 border">Degree</th>
            <th className="px-4 py-2 border">House</th>
          </tr>
        </thead>
        <tbody>
          {planets.map((planet) => (
            <tr key={planet.name} className="text-center">
              <td className="px-4 py-2 border font-medium">{planet.name}</td>
              <td className="px-4 py-2 border">{planet.sign}</td>
              <td className="px-4 py-2 border">{planet.degree}</td>
              <td className="px-4 py-2 border">{planet.house}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanetTable;