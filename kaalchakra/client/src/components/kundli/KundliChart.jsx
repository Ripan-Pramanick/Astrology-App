// client/src/components/kundli/KundliChart.jsx
import React from 'react';

const KundliChart = ({ chartData }) => {
  // chartData should be an object mapping house numbers (1-12) to zodiac signs and planets
  // For simplicity, we'll assume a 3x4 grid of cells representing the 12 houses.
  // Houses layout: typical North Indian chart: houses 1-12 arranged in a 4x3 grid.
  // We'll render a grid and fill each cell with house number, sign, and planets.

  const houses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // Grid positions: We'll use flex/grid to create a 3x4 layout (3 columns, 4 rows)
  // but actual North Indian chart has a specific arrangement with a central square.
  // For demo, we'll create a simple 4x3 grid.
  const gridRows = 4;
  const gridCols = 3;

  // Reorder houses to match grid positions (house numbers increase clockwise from top middle?).
  // Let's assume chartData.houses is an array of 12 objects.
  // We'll map them to grid cells in the order they appear in the array (1 to 12).

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden max-w-3xl mx-auto">
      <div className="grid grid-cols-3 gap-px bg-gray-300">
        {houses.map((houseNum) => {
          const house = chartData?.houses?.[houseNum - 1] || { sign: '', planets: [] };
          return (
            <div key={houseNum} className="bg-white p-4 text-center border border-gray-200">
              <div className="text-xs text-gray-500">House {houseNum}</div>
              <div className="text-lg font-semibold">{house.sign}</div>
              <div className="text-sm">{house.planets.join(', ')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KundliChart;