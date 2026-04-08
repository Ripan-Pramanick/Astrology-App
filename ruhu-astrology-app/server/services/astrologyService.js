// Ei file ti apnar server/services/astrologyService.js e thaka uchit.
// Apni ekhane OpenCage Geocoding API integrate korte paren.
import axios from 'axios';

const OPENCAGE_API_KEY = "af0a52f04b5f451a9884ecd5831736e1"; // ⚠️ Apnar API key diye replace korun

// Configuration for external API (could be from env)
const ASTRO_API_URL = process.env.ASTRO_API_URL || 'https://api.example.com/astrology';
const ASTRO_API_KEY = process.env.ASTRO_API_KEY;

export const getGeoDetails = async (placeName) => {
    try {
        console.log(`📍 Searching for exact coordinates for: ${placeName}`);
        
        // Check if API key is present in environment variables, else use fallback
        const apiKey = process.env.OPENCAGE_API_KEY || OPENCAGE_API_KEY;
        if (!process.env.OPENCAGE_API_KEY) {
            console.warn("⚠️ OPENCAGE_API_KEY is missing in .env file! Using fallback key.");
        }

        // OpenCage API call (axios use kora holo jate Node.js e fetch error na dey)
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(placeName)}&key=${apiKey}&limit=5`);
        const data = response.data;

        if (data && data.results && data.results.length > 0) {
            // Data format kore frontend er dorkar moto banano
            const formattedPlaces = data.results.map(item => ({
                place_name: item.formatted,
                latitude: item.geometry.lat.toString(),
                longitude: item.geometry.lng.toString(),
                // Timezone offset k seconds theke hours e convert kora hoche (e.g., 5.5 for IST)
                timezone: (item.annotations.timezone.offset_sec / 3600).toString() 
            }));

            console.log(`✅ Found ${formattedPlaces.length} location(s)`);
            return formattedPlaces;
        }
        
        console.log("⚠️ No locations found via OpenCage.");
        return [];

    } catch (error) {
        // Asol error details dekhar jonno console.error update kora holo
        console.log("🔥 ACTUAL API ERROR:", error.response ? error.response.data : error.message);
        console.error("❌ Location Fetch Error:", error.response?.data || error.message);
        
        // Jodi API fail kore, tokhon fallback hisebe ei data ti dite paren
        console.log("⚠️ Using Smart Bypass fallback data.");
        return [
            {
                place_name: "Santipur, West Bengal, India",
                latitude: "23.2500",
                longitude: "88.4333",
                timezone: "5.5"
            }
        ];
    }
};

/**
 * Fetch astrological data for a given birth time and location.
 * @param {Object} params - Birth details
 * @param {Date} params.birthDateTime - Combined date and time
 * @param {string} params.place - Place of birth (city name)
 * @param {Object} params.coordinates - Optional { latitude, longitude }
 * @returns {Promise<Object>} - Structured astrological data (chart, planets, etc.)
 */
export const fetchAstrologicalData = async (params) => {
  const { birthDateTime, place, coordinates } = params;

  // Convert to required format (example: ISO string)
  const birthTimeISO = birthDateTime.toISOString();

  // 🌐 TODO: [EXTERNAL ASTRO API] Replace with actual API call.
  // Example using a hypothetical API:
  // const response = await axios.post(`${ASTRO_API_URL}/kundli`, {
  //   api_key: ASTRO_API_KEY,
  //   birth_time: birthTimeISO,
  //   place: place,
  //   lat: coordinates?.latitude,
  //   lon: coordinates?.longitude,
  // });
  // return response.data;

  // Simulated data for demonstration (remove in production)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        chart: {
          houses: [
            { sign: 'Aries', planets: ['Sun'] },
            { sign: 'Taurus', planets: [] },
            { sign: 'Gemini', planets: ['Mercury'] },
            { sign: 'Cancer', planets: [] },
            { sign: 'Leo', planets: [] },
            { sign: 'Virgo', planets: ['Venus'] },
            { sign: 'Libra', planets: [] },
            { sign: 'Scorpio', planets: ['Mars'] },
            { sign: 'Sagittarius', planets: [] },
            { sign: 'Capricorn', planets: ['Jupiter'] },
            { sign: 'Aquarius', planets: ['Saturn'] },
            { sign: 'Pisces', planets: [] },
          ],
        },
        planets: [
          { name: 'Sun', sign: 'Aries', degree: '10° 30\'', house: 1 },
          { name: 'Moon', sign: 'Leo', degree: '15° 20\'', house: 5 },
          { name: 'Mars', sign: 'Scorpio', degree: '5° 45\'', house: 8 },
          { name: 'Mercury', sign: 'Gemini', degree: '22° 10\'', house: 3 },
          { name: 'Jupiter', sign: 'Sagittarius', degree: '12° 15\'', house: 9 },
          { name: 'Venus', sign: 'Virgo', degree: '18° 35\'', house: 6 },
          { name: 'Saturn', sign: 'Aquarius', degree: '7° 20\'', house: 11 },
          { name: 'Rahu', sign: 'Taurus', degree: '25° 40\'', house: 2 },
          { name: 'Ketu', sign: 'Scorpio', degree: '25° 40\'', house: 8 },
        ],
        additional: {
          analysis: 'Your chart shows strong leadership qualities with Sun in Aries. You are independent and energetic. There may be challenges in relationships due to Mars in Scorpio, but Jupiter in Sagittarius brings good fortune in higher education and travel.',
        },
      });
    }, 1000);
  });
};

/**
 * Fetch matchmaking compatibility data from external API.
 * @param {Object} params - Details for both persons
 * @returns {Promise<Object>} - Compatibility result
 */
export const getMatchmakingData = async (params) => {
  const { personA, personB } = params;

  // 🌐 TODO: [EXTERNAL ASTRO API] Replace with actual API call.
  // Example using a hypothetical matchmaking endpoint:
  // const response = await axios.post(`${ASTRO_API_URL}/match`, {
  //   api_key: ASTRO_API_KEY,
  //   personA: {
  //     birth_time: personA.birthDateTime.toISOString(),
  //     place: personA.place,
  //     gender: personA.gender,
  //   },
  //   personB: {
  //     birth_time: personB.birthDateTime.toISOString(),
  //     place: personB.place,
  //     gender: personB.gender,
  //   },
  // });
  // return response.data;

  // Simulated data for demonstration
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * 100); // random score for demo
      let analysis = '';
      if (score >= 80) {
        analysis = 'Excellent compatibility! Both charts complement each other well.';
      } else if (score >= 60) {
        analysis = 'Good compatibility with some areas to work on.';
      } else if (score >= 40) {
        analysis = 'Average compatibility. Both need to make adjustments.';
      } else {
        analysis = 'Challenging compatibility. May require extra effort.';
      }
      resolve({
        score,
        analysis,
        details: {
          'Guna Milan': `${score}/36`,
          'Manglik Dosha': 'None',
          'Bhakut Dosha': 'Present',
          'Nadi Dosha': 'Absent',
        },
      });
    }, 1500);
  });
};