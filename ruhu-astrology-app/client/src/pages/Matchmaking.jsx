// client/src/pages/Matchmaking.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Matchmaking = () => {
  const [personA, setPersonA] = useState({
    name: '',
    gender: 'male',
    birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', ampm: 'AM' },
    place: '',
  });
  const [personB, setPersonB] = useState({
    name: '',
    gender: 'female',
    birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', ampm: 'AM' },
    place: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (person, section, field, value) => {
    const setter = person === 'A' ? setPersonA : setPersonB;
    const current = person === 'A' ? personA : personB;
    if (section) {
      setter({
        ...current,
        [section]: { ...current[section], [field]: value },
      });
    } else {
      setter({ ...current, [field]: value });
    }
  };

  const validateForm = (personData, personLabel) => {
    if (!personData.name.trim()) {
      setError(`${personLabel} name is required.`);
      return false;
    }
    if (!personData.birthDate.day || !personData.birthDate.month || !personData.birthDate.year) {
      setError(`${personLabel} birth date is incomplete.`);
      return false;
    }
    if (!personData.birthTime.hour || !personData.birthTime.minute) {
      setError(`${personLabel} birth time is incomplete.`);
      return false;
    }
    if (!personData.place.trim()) {
      setError(`${personLabel} birth place is required.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    // Validate both persons
    if (!validateForm(personA, 'Person A') || !validateForm(personB, 'Person B')) {
      setLoading(false);
      return;
    }

    // Prepare payload
    const payload = {
      personA: {
        name: personA.name,
        gender: personA.gender,
        birthDate: `${personA.birthDate.year}-${personA.birthDate.month}-${personA.birthDate.day}`,
        birthTime: `${personA.birthTime.hour}:${personA.birthTime.minute} ${personA.birthTime.ampm}`,
        place: personA.place,
      },
      personB: {
        name: personB.name,
        gender: personB.gender,
        birthDate: `${personB.birthDate.year}-${personB.birthDate.month}-${personB.birthDate.day}`,
        birthTime: `${personB.birthTime.hour}:${personB.birthTime.minute} ${personB.birthTime.ampm}`,
        place: personB.place,
      },
    };

    try {
      const response = await axios.post('/api/matchmaking', payload);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to get matchmaking result.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to render form fields for a person
  const renderPersonForm = (person, label) => {
    const data = person === 'A' ? personA : personB;
    const handleFieldChange = (section, field, value) => handleChange(person, section, field, value);

    return (
      <div className="border rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">{label}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleFieldChange(null, 'name', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="mt-1 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="male"
                  checked={data.gender === 'male'}
                  onChange={(e) => handleFieldChange(null, 'gender', e.target.value)}
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="female"
                  checked={data.gender === 'female'}
                  onChange={(e) => handleFieldChange(null, 'gender', e.target.value)}
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <div className="grid grid-cols-3 gap-4 mt-1">
            <select
              value={data.birthDate.day}
              onChange={(e) => handleFieldChange('birthDate', 'day', e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">DD</option>
              {[...Array(31)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
            <select
              value={data.birthDate.month}
              onChange={(e) => handleFieldChange('birthDate', 'month', e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">MM</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
            <select
              value={data.birthDate.year}
              onChange={(e) => handleFieldChange('birthDate', 'year', e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">YYYY</option>
              {[...Array(100)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Time of Birth</label>
          <div className="grid grid-cols-3 gap-4 mt-1">
            <select
              value={data.birthTime.hour}
              onChange={(e) => handleFieldChange('birthTime', 'hour', e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">HH</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
            <select
              value={data.birthTime.minute}
              onChange={(e) => handleFieldChange('birthTime', 'minute', e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">MM</option>
              {[...Array(60)].map((_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <select
              value={data.birthTime.ampm}
              onChange={(e) => handleFieldChange('birthTime', 'ampm', e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Place of Birth</label>
          <input
            type="text"
            value={data.place}
            onChange={(e) => handleFieldChange(null, 'place', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="City, Country"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Matchmaking</h1>
      <p className="text-center text-gray-600 mb-8">
        Enter birth details of both individuals to find compatibility
      </p>

      <form onSubmit={handleSubmit}>
        {renderPersonForm('A', 'Person A')}
        {renderPersonForm('B', 'Person B')}

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 px-8 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Check Compatibility'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Compatibility Result</h2>
          <div className="mb-4">
            <span className="text-lg">Overall Score: </span>
            <span className="text-3xl font-bold text-indigo-600">{result.score}%</span>
          </div>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-2">Analysis</h3>
            <p>{result.analysis}</p>
          </div>
          {result.details && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Detailed Factors</h3>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(result.details).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Matchmaking;