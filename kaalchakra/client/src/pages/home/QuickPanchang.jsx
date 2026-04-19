import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, MapPin, Calendar } from 'lucide-react';
import api from '../services/api.js';
import astrologyServices from '../services/astrologyApi.js';

const TimeCard = ({ title, time, icon, bgColor, isLoading }) => (
  <div className={`${bgColor} rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300`}>
    <div className="text-white w-10 h-10 mb-3">{icon}</div>
    <p className="text-white text-sm font-medium uppercase tracking-wide">{title}</p>
    {isLoading ? (
      <div className="w-16 h-6 bg-white/20 rounded animate-pulse mt-1"></div>
    ) : (
      <p className="text-white text-xl font-bold mt-1">{time}</p>
    )}
  </div>
);

// SVGs
const SunriseIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path d="M4 18H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M6 14L12 8L18 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 4V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M4.5 12.5L6 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M19.5 12.5L18 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 21V19" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 18H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>;

const SunsetIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path d="M4 18H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M6 10L12 16L18 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 6V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M4.5 8.5L6 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M19.5 8.5L18 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 21V19" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 18H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>;

const MoonriseIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path d="M12 3V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 9V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M5 15L12 21L19 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 18L18 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 18L6 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="8" r="3" stroke="white" strokeWidth="1.5" /><path d="M4 15C4 11.6863 6.68629 9 10 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M20 15C20 11.6863 17.3137 9 14 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 8V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>;

const MoonsetIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path d="M12 21V18" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 15V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M5 9L12 3L19 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 6L18 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 6L6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="16" r="3" stroke="white" strokeWidth="1.5" /><path d="M4 9C4 12.3137 6.68629 15 10 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M20 9C20 12.3137 17.3137 15 14 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 16V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>;

const QuickPanchang = () => {
  const [panchangData, setPanchangData] = useState({
    date: '',
    location: 'Santipur, West Bengal',
    sunrise: '--:--:--',
    sunset: '--:--:--',
    moonrise: '--:--:--',
    moonset: '--:--:--',
    month: { amanta: '--', purnimanta: '--' },
    tithi: { name: '--', endTime: '--' },
    yoga: { name: '--', endTime: '--' },
    nakshatra: { name: '--', endTime: '--' },
    karana: { name: '--', purnimanta: '--' },
    samvat: { vikram: '--', shaka: '--' }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationInput, setLocationInput] = useState('Santipur, West Bengal');
  const [coordinates, setCoordinates] = useState({ lat: 23.2500, lng: 88.4333, timezone: 5.5 });

  useEffect(() => {
    fetchPanchangData();
  }, [coordinates]);

  const fetchLocationCoordinates = async (placeName) => {
    try {
      const response = await astrologyServices.panchang.getGeoDetails({ place: placeName });
      if (response.geonames && response.geonames.length > 0) {
        const location = response.geonames[0];
        return {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lng),
          timezone: parseFloat(location.timezone || 5.5),
          name: location.name
        };
      }
      return null;
    } catch (error) {
      console.error('Location fetch error:', error);
      return null;
    }
  };

  const fetchPanchangData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const today = new Date();
      const params = {
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        hour: today.getHours(),
        minute: today.getMinutes(),
        second: today.getSeconds(),
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        timezone: coordinates.timezone
      };

      // Fetch basic panchang data
      const response = await astrologyServices.panchang.getBasicPanchang(params);
      
      if (response) {
        setPanchangData({
          date: `${today.toLocaleDateString('en-US', { weekday: 'long' })}, ${today.getDate()} ${today.toLocaleDateString('en-US', { month: 'long' })} ${today.getFullYear()}`,
          location: locationInput,
          sunrise: response.sunrise || '06:18:31',
          sunset: response.sunset || '17:57:43',
          moonrise: response.moonrise || '12:10:28',
          moonset: response.moonset || '22:13:07',
          month: {
            amanta: response.month?.amanta || 'Ashwin',
            purnimanta: response.month?.purnimanta || 'Ashwin'
          },
          tithi: {
            name: response.tithi?.name || 'Shukla Shashthi',
            endTime: response.tithi?.end_time || '2024-10-09 12:15:55'
          },
          yoga: {
            name: response.yoga?.name || 'Shobhan',
            endTime: response.yoga?.end_time || '2024-10-10 05:53:23'
          },
          nakshatra: {
            name: response.nakshatra?.name || 'Mool',
            endTime: response.nakshatra?.end_time || '2024-10-10 05:15:08'
          },
          karana: {
            name: response.karana?.name || 'Taitil',
            purnimanta: response.karana?.purnimanta || '2024-10-09 12:12:55'
          },
          samvat: {
            vikram: response.samvat?.vikram || '2081 Peengal',
            shaka: response.samvat?.shaka || '1946 Krodhi'
          }
        });
      }
    } catch (err) {
      console.error('Panchang fetch error:', err);
      setError('Unable to fetch Panchang data. Please try again later.');
      
      // Fallback to local date
      const today = new Date();
      setPanchangData(prev => ({
        ...prev,
        date: `${today.toLocaleDateString('en-US', { weekday: 'long' })}, ${today.getDate()} ${today.toLocaleDateString('en-US', { month: 'long' })} ${today.getFullYear()}`
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async () => {
    setLoading(true);
    const coords = await fetchLocationCoordinates(locationInput);
    if (coords) {
      setCoordinates({ lat: coords.lat, lng: coords.lng, timezone: coords.timezone });
      setPanchangData(prev => ({ ...prev, location: coords.name || locationInput }));
    } else {
      setError('Location not found. Please try a different location.');
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLocationSearch();
    }
  };

  if (error && loading === false) {
    return (
      <div className="bg-gray-50 py-12 px-4 md:px-6 font-sans antialiased">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchPanchangData} 
            className="bg-[#F7931E] hover:bg-[#e6840c] text-white font-semibold px-6 py-2 rounded-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Aaj Ka Panchang</h1>
            <div className="flex items-center gap-2 text-gray-500 text-base mt-1">
              <MapPin className="w-4 h-4" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-none outline-none text-gray-500 text-base w-48"
                placeholder="Enter location"
              />
              <button onClick={handleLocationSearch} className="text-[#F7931E] hover:text-[#e6840c] text-sm">
                Update
              </button>
            </div>
          </div>
          <Link to="/panchang">
            <button className="bg-[#F7931E] hover:bg-[#e6840c] transition-colors text-white font-semibold px-6 py-2.5 rounded-full shadow-md text-sm tracking-wide">
              Detailed Panchang
            </button>
          </Link>
        </div>

        <div className="flex items-center justify-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <div className="px-6">
            {loading ? (
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-gray-700 font-medium text-base">{panchangData.date}</p>
            )}
          </div>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <TimeCard 
            title="Sunrise" 
            time={panchangData.sunrise} 
            icon={<SunriseIcon />} 
            bgColor="bg-[#F7931E]" 
            isLoading={loading}
          />
          <TimeCard 
            title="Sunset" 
            time={panchangData.sunset} 
            icon={<SunsetIcon />} 
            bgColor="bg-[#F7931E]" 
            isLoading={loading}
          />
          <TimeCard 
            title="Moonrise" 
            time={panchangData.moonrise} 
            icon={<MoonriseIcon />} 
            bgColor="bg-[#2C3E8F]" 
            isLoading={loading}
          />
          <TimeCard 
            title="Moonset" 
            time={panchangData.moonset} 
            icon={<MoonsetIcon />} 
            bgColor="bg-[#2C3E8F]" 
            isLoading={loading}
          />
        </div>

        <div className="w-full h-px bg-[#F7931E] opacity-60 my-4"></div>

        <div className="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Left Column */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Month</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Amanta</span>
                    {loading ? (
                      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <span className="text-gray-800 font-medium">{panchangData.month.amanta}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Purnimanta</span>
                    {loading ? (
                      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <span className="text-gray-800 font-medium">{panchangData.month.purnimanta}</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tithi</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    {loading ? (
                      <>
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-800 font-semibold">{panchangData.tithi.name}</span>
                        <span className="text-gray-500 text-sm">Till: {panchangData.tithi.endTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Yog</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    {loading ? (
                      <>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-800 font-semibold">{panchangData.yoga.name}</span>
                        <span className="text-gray-500 text-sm">Till: {panchangData.yoga.endTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Samvat</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Vikram</span>
                    {loading ? (
                      <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <span className="text-gray-800 font-medium">{panchangData.samvat.vikram}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Shaka</span>
                    {loading ? (
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <span className="text-gray-800 font-medium">{panchangData.samvat.shaka}</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nakshatra</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    {loading ? (
                      <>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-800 font-semibold">{panchangData.nakshatra.name}</span>
                        <span className="text-gray-500 text-sm">Till: {panchangData.nakshatra.endTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Karan</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    {loading ? (
                      <>
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-800 font-semibold">{panchangData.karana.name}</span>
                        <span className="text-gray-500 text-sm">Purnimanta: {panchangData.karana.purnimanta}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last updated indicator */}
        {!loading && (
          <div className="text-center mt-4">
            <p className="text-xs text-gray-400">
              📍 Location: {panchangData.location} | Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickPanchang;