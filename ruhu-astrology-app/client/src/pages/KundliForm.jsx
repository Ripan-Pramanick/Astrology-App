// client/src/pages/KundliForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext exists
import { createKundaliRequest } from '../services/kundli'; // API service to call backend

const KundliForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // To associate the request with logged-in user, if any

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    birthDate: { day: '', month: '', year: '' },
    birthTime: { hour: '', minute: '', ampm: 'AM' },
    place: '',
    useCoordinates: false,
    longitude: { deg: '', min: '', sec: '' },
    latitude: { deg: '', min: '', sec: '' },
    comment: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handlers for nested inputs
  const handleChange = (e, section, field) => {
    const value = e.target.value;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      useCoordinates: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Basic validation
    if (!formData.name.trim()) {
      setError('Please enter your name.');
      setLoading(false);
      return;
    }
    if (!formData.birthDate.day || !formData.birthDate.month || !formData.birthDate.year) {
      setError('Please enter complete birth date.');
      setLoading(false);
      return;
    }
    if (!formData.birthTime.hour || !formData.birthTime.minute) {
      setError('Please enter complete birth time.');
      setLoading(false);
      return;
    }
    if (!formData.place.trim() && !formData.useCoordinates) {
      setError('Please enter birth place or enable coordinates.');
      setLoading(false);
      return;
    }
    if (formData.useCoordinates) {
      if (!formData.longitude.deg || !formData.latitude.deg) {
        setError('Please enter longitude and latitude degrees.');
        setLoading(false);
        return;
      }
    }

    // Prepare data for API
    const payload = {
      name: formData.name,
      gender: formData.gender,
      birthDate: `${formData.birthDate.year}-${formData.birthDate.month}-${formData.birthDate.day}`,
      birthTime: `${formData.birthTime.hour}:${formData.birthTime.minute} ${formData.birthTime.ampm}`,
      place: formData.place,
      useCoordinates: formData.useCoordinates,
      longitude: formData.useCoordinates ? {
        degrees: parseInt(formData.longitude.deg),
        minutes: parseInt(formData.longitude.min) || 0,
        seconds: parseInt(formData.longitude.sec) || 0,
      } : null,
      latitude: formData.useCoordinates ? {
        degrees: parseInt(formData.latitude.deg),
        minutes: parseInt(formData.latitude.min) || 0,
        seconds: parseInt(formData.latitude.sec) || 0,
      } : null,
      comment: formData.comment,
      userId: user?.uid || null, // if user is logged in, associate
    };

    try {
      const response = await createKundaliRequest(payload);
      if (response.success) {
        setSuccess(true);
        // Optionally redirect to a thank you page or show the generated kundali
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError(response.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Fill the form to get your kundali</h1>
      <p className="text-center text-gray-600 mb-8">Please provide accurate birth details for precise analysis.</p>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Name & Gender Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange(e, null, 'name')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Your name here"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="mt-1 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => handleChange(e, null, 'gender')}
                  className="form-radio"
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => handleChange(e, null, 'gender')}
                  className="form-radio"
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>
        </div>

        {/* Birth Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <div className="grid grid-cols-3 gap-4 mt-1">
            <select
              value={formData.birthDate.day}
              onChange={(e) => handleChange(e, 'birthDate', 'day')}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">DD</option>
              {[...Array(31)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
            <select
              value={formData.birthDate.month}
              onChange={(e) => handleChange(e, 'birthDate', 'month')}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">MM</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
            <select
              value={formData.birthDate.year}
              onChange={(e) => handleChange(e, 'birthDate', 'year')}
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

        {/* Birth Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Time of Birth</label>
          <div className="grid grid-cols-4 gap-4 mt-1">
            <select
              value={formData.birthTime.hour}
              onChange={(e) => handleChange(e, 'birthTime', 'hour')}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">HH</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
            <select
              value={formData.birthTime.minute}
              onChange={(e) => handleChange(e, 'birthTime', 'minute')}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">MM</option>
              {[...Array(60)].map((_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <select
              value={formData.birthTime.ampm}
              onChange={(e) => handleChange(e, 'birthTime', 'ampm')}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* Place OR Coordinates */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Place of Birth</label>
            <input
              type="text"
              value={formData.place}
              onChange={(e) => handleChange(e, null, 'place')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Start typing & choose from list"
              disabled={formData.useCoordinates}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="useCoordinates"
              checked={formData.useCoordinates}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="useCoordinates" className="ml-2 block text-sm text-gray-900">
              Or enter longitude/latitude
            </label>
          </div>

          {formData.useCoordinates && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <input
                    type="number"
                    placeholder="Deg"
                    value={formData.longitude.deg}
                    onChange={(e) => handleChange(e, 'longitude', 'deg')}
                    className="border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="number"
                    placeholder="Min"
                    value={formData.longitude.min}
                    onChange={(e) => handleChange(e, 'longitude', 'min')}
                    className="border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="number"
                    placeholder="Sec"
                    value={formData.longitude.sec}
                    onChange={(e) => handleChange(e, 'longitude', 'sec')}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <input
                    type="number"
                    placeholder="Deg"
                    value={formData.latitude.deg}
                    onChange={(e) => handleChange(e, 'latitude', 'deg')}
                    className="border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="number"
                    placeholder="Min"
                    value={formData.latitude.min}
                    onChange={(e) => handleChange(e, 'latitude', 'min')}
                    className="border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="number"
                    placeholder="Sec"
                    value={formData.latitude.sec}
                    onChange={(e) => handleChange(e, 'latitude', 'sec')}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Comment</label>
          <textarea
            rows="4"
            value={formData.comment}
            onChange={(e) => handleChange(e, null, 'comment')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Type message"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Get Kundali'}
          </button>
          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
          {success && <p className="mt-2 text-green-600 text-sm">Form submitted successfully! Redirecting...</p>}
        </div>
      </form>

      {/* Optional: Price tag like in image */}
      <div className="text-center mt-4 text-gray-500">
        <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm">Rs.1560 FREE</span>
      </div>
    </div>
  );
};

export default KundliForm;