// client/src/components/kundli/DarakarakaHouses/DarakarakaHouses.jsx
import React, { useState, useEffect } from 'react';
import { Home, Heart, TrendingUp, Shield, Users, Globe, Star, Zap, Briefcase, GraduationCap, User, Coins, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase.js';

const houseIcons = {
  1: <User className="w-5 h-5" />,
  2: <Coins className="w-5 h-5" />,
  3: <Zap className="w-5 h-5" />,
  4: <Home className="w-5 h-5" />,
  5: <Heart className="w-5 h-5" />,
  6: <Briefcase className="w-5 h-5" />,
  7: <Users className="w-5 h-5" />,
  8: <Shield className="w-5 h-5" />,
  9: <GraduationCap className="w-5 h-5" />,
  10: <TrendingUp className="w-5 h-5" />,
  11: <Star className="w-5 h-5" />,
  12: <Globe className="w-5 h-5" />
};

// Normal CSS Gradient for Solid Colors
const getHouseColor = (houseNumber) => {
  const colors = {
    1: 'linear-gradient(to right, #ef4444, #f97316)', // red to orange
    2: 'linear-gradient(to right, #22c55e, #10b981)', // green to emerald
    3: 'linear-gradient(to right, #eab308, #f59e0b)', // yellow to amber
    4: 'linear-gradient(to right, #3b82f6, #06b6d4)', // blue to cyan
    5: 'linear-gradient(to right, #ec4899, #f43f5e)', // pink to rose
    6: 'linear-gradient(to right, #a855f7, #6366f1)', // purple to indigo
    7: 'linear-gradient(to right, #f97316, #ef4444)', // orange to red
    8: 'linear-gradient(to right, #374151, #111827)', // gray-700 to gray-900
    9: 'linear-gradient(to right, #14b8a6, #22c55e)', // teal to green
    10: 'linear-gradient(to right, #6366f1, #a855f7)', // indigo to purple
    11: 'linear-gradient(to right, #f59e0b, #eab308)', // amber to yellow
    12: 'linear-gradient(to right, #06b6d4, #3b82f6)'  // cyan to blue
  };
  return colors[houseNumber] || 'linear-gradient(to right, #6b7280, #374151)';
};

// Normal CSS Gradient for Light/Transparent Colors (Opacity 15%)
const getHouseColorLight = (houseNumber) => {
  const colors = {
    1: 'linear-gradient(to right, #ef444425, #f9731625)',
    2: 'linear-gradient(to right, #22c55e25, #10b98125)',
    3: 'linear-gradient(to right, #eab30825, #f59e0b25)',
    4: 'linear-gradient(to right, #3b82f625, #06b6d425)',
    5: 'linear-gradient(to right, #ec489925, #f43f5e25)',
    6: 'linear-gradient(to right, #a855f725, #6366f125)',
    7: 'linear-gradient(to right, #f9731625, #ef444425)',
    8: 'linear-gradient(to right, #37415125, #11182725)',
    9: 'linear-gradient(to right, #14b8a625, #22c55e25)',
    10: 'linear-gradient(to right, #6366f125, #a855f725)',
    11: 'linear-gradient(to right, #f59e0b25, #eab30825)',
    12: 'linear-gradient(to right, #06b6d425, #3b82f625)'
  };
  return colors[houseNumber] || 'linear-gradient(to right, #6b728025, #37415125)';
};

const getHouseName = (houseNumber) => {
  const names = {
    1: 'Tanu Bhava (Self)',
    2: 'Dhana Bhava (Wealth)',
    3: 'Sahaja Bhava (Siblings)',
    4: 'Sukha Bhava (Happiness)',
    5: 'Putra Bhava (Children)',
    6: 'Ripu Bhava (Enemies)',
    7: 'Yuvati Bhava (Spouse)',
    8: 'Randhra Bhava (Longevity)',
    9: 'Dharma Bhava (Fortune)',
    10: 'Karma Bhava (Career)',
    11: 'Labha Bhava (Gains)',
    12: 'Vyaya Bhava (Losses)'
  };
  return names[houseNumber] || 'Unknown';
};

const DarakarakaHouses = () => {
  const [darakarakas, setDarakarakas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data from Supabase
  useEffect(() => {
    fetchDarakarakaHouses();
  }, []);

  const fetchDarakarakaHouses = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('darakaraka_houses')
        .select('*')
        .eq('language', 'bn')
        .order('house_number', { ascending: true });

      if (error) throw error;

      // Remove duplicates (if any)
      const uniqueHouses = data.reduce((acc, curr) => {
        if (!acc.find(item => item.house_number === curr.house_number)) {
          acc.push(curr);
        }
        return acc;
      }, []);

      setDarakarakas(uniqueHouses);
      
      // Auto-select first house by default
      if (uniqueHouses.length > 0 && !selectedHouse) {
        setSelectedHouse(uniqueHouses[0].house_number);
      }
    } catch (err) {
      console.error('Error fetching Darakaraka houses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
        <p className="text-gray-500">Loading Darakaraka houses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-xl">
        <p className="text-red-500">Error loading data: {error}</p>
        <button 
          onClick={fetchDarakarakaHouses}
          className="mt-2 text-purple-500 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (darakarakas.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <p className="text-gray-500">No Darakaraka house data available</p>
      </div>
    );
  }

  const selectedHouseData = darakarakas.find(h => h.house_number === selectedHouse);

  return (
    <div className="w-full">
      {/* Darakaraka Houses Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {darakarakas.map((house) => (
          <button
            key={house.id}
            onClick={() => setSelectedHouse(house.house_number)}
            className={`relative group p-4 rounded-xl text-center transition-all duration-300 ${
              selectedHouse === house.house_number
                ? `text-white shadow-lg scale-105 border-transparent`
                : 'bg-white hover:shadow-md border border-gray-200'
            }`}
            style={{
              background: selectedHouse === house.house_number ? getHouseColor(house.house_number) : ''
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: selectedHouse === house.house_number 
                    ? 'rgba(255, 255, 255, 0.25)' 
                    : getHouseColorLight(house.house_number)
                }}
              >
                {React.cloneElement(houseIcons[house.house_number], {
                  className: `w-5 h-5 ${selectedHouse === house.house_number ? 'text-white' : 'text-gray-600'}`
                })}
              </div>
              <span className={`text-sm font-bold ${selectedHouse === house.house_number ? 'text-white' : 'text-gray-700'}`}>
                House {house.house_number}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected House Details */}
      {selectedHouseData && (
        <div 
          className="rounded-xl p-6 border border-purple-200"
          style={{ background: 'linear-gradient(to bottom right, #faf5ff, #eef2ff)' }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ background: getHouseColor(selectedHouseData.house_number) }}
            >
              {React.cloneElement(houseIcons[selectedHouseData.house_number], { className: "w-7 h-7 text-white" })}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                House {selectedHouseData.house_number} - {getHouseName(selectedHouseData.house_number)}
              </h3>
              <p className="text-sm text-purple-600 font-medium mb-3">Theme: {selectedHouseData.theme}</p>
              <p className="text-gray-700 leading-relaxed">{selectedHouseData.effect}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DarakarakaHouses;