// client/src/pages/KundliResult.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchKundliResult } from '../services/kundli'; // We'll create this
import KundliChart from '../components/kundli/KundliChart';
import PlanetTable from '../components/kundli/PlanetTable';

const KundliResult = () => {
  const { id } = useParams(); // ID of the kundali request
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kundliData, setKundliData] = useState(null);

  useEffect(() => {
    const loadKundli = async () => {
      try {
        const data = await fetchKundliResult(id);
        setKundliData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load kundali. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadKundli();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">Loading your kundali...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Your Kundali</h1>
      <p className="text-center text-gray-600 mb-8">
        Based on your birth details, here is your astrological chart
      </p>

      {/* Kundli Chart */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Birth Chart (Rasi)</h2>
        <KundliChart chartData={kundliData.chart} />
      </div>

      {/* Planet Positions Table */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Planet Positions</h2>
        <PlanetTable planets={kundliData.planets} />
      </div>

      {/* Additional Info */}
      {kundliData.additional && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Insights</h2>
          <p>{kundliData.additional.analysis}</p>
        </div>
      )}
    </div>
  );
};

export default KundliResult;