// client/src/components/kundli/KundliChart.jsx
import React from 'react';

const KundliChart = ({ planets }) => {
  // ১২টি ঘরের (Houses) জন্য X ও Y স্থানাঙ্ক (SVG-এর জন্য)
  const houses = [
    { id: 1, x: 50, y: 25 },  // লগ্ন (Center Top)
    { id: 2, x: 25, y: 12 },  // 2nd House
    { id: 3, x: 12, y: 25 },  // 3rd House
    { id: 4, x: 25, y: 50 },  // 4th House (Center Left)
    { id: 5, x: 12, y: 75 },  // 5th House
    { id: 6, x: 25, y: 88 },  // 6th House
    { id: 7, x: 50, y: 75 },  // 7th House (Center Bottom)
    { id: 8, x: 75, y: 88 },  // 8th House
    { id: 9, x: 88, y: 75 },  // 9th House
    { id: 10, x: 75, y: 50 }, // 10th House (Center Right)
    { id: 11, x: 88, y: 25 }, // 11th House
    { id: 12, x: 75, y: 12 }, // 12th House
  ];

  // গ্রহগুলোকে তাদের ঘরের নাম্বারের ভিত্তিতে সাজানো (আপাতত ডেমো লজিক)
  const getPlanetsForHouse = (houseNum) => {
    if (!planets) return '';
    return planets
      .filter((p) => p.house && p.house.replace(/\D/g, '') === String(houseNum))
      .map((p) => p.name.substring(0, 2).toUpperCase()) // Su, Mo, Ma, etc.
      .join(', ');
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square bg-[#fffbf2] p-4 rounded-lg shadow-inner border-2 border-amber-800/20">
      <svg viewBox="0 0 100 100" className="w-full h-full text-amber-800">
        {/* Outer Square */}
        <rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="0.8" />
        
        {/* Diagonals */}
        <line x1="2" y1="2" x2="98" y2="98" stroke="currentColor" strokeWidth="0.5" />
        <line x1="98" y1="2" x2="2" y2="98" stroke="currentColor" strokeWidth="0.5" />
        
        {/* Inner Diamond */}
        <polygon points="50,2 98,50 50,98 2,50" fill="none" stroke="currentColor" strokeWidth="0.8" />

        {/* House Numbers & Planets */}
        {houses.map((house) => (
          <g key={house.id} transform={`translate(${house.x}, ${house.y})`}>
            {/* House Number (ছোট করে) */}
            <text x="0" y="-8" fontSize="4" textAnchor="middle" fill="#92400e" className="opacity-50">
              {house.id}
            </text>
            {/* Planets in that house */}
            <text x="0" y="2" fontSize="5" textAnchor="middle" fill="#78350f" fontWeight="bold" className="font-serif">
              {getPlanetsForHouse(house.id)}
            </text>
          </g>
        ))}
      </svg>
      
      {/* Decorative Corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600 rounded-tl-md"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600 rounded-tr-md"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600 rounded-bl-md"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600 rounded-br-md"></div>
    </div>
  );
};

export default KundliChart;