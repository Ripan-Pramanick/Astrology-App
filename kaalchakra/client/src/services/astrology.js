// client/src/services/astrology.js
import api from './api';

// এই একটি মাস্টার ফাংশন দিয়ে আপনি যেকোনো ডেটা আনতে পারবেন
export const fetchAstroData = async (endpointName, formData) => {
  try {
    const response = await api.post(`/astrology/${endpointName}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpointName}:`, error);
    throw error.response?.data || error.message;
  }
};

// শহরের নাম থেকে Latitude, Longitude এবং Timezone বের করার ফাংশন
export const getGeoLocation = async (cityName) => {
  try {
    // AstrologyAPI এর geo_details এন্ডপয়েন্টে রিকোয়েস্ট পাঠাচ্ছি
    // maxRows: 5 মানে হলো একই নামের ৫টা শহরের অপশন দেবে (যাতে ইউজার সঠিকটা বেছে নিতে পারে)
    const response = await api.post('/astrology/geo_details', { 
      place: cityName, 
      maxRows: 5 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error.response?.data || "লোকেশন খুঁজে পাওয়া যায়নি";
  }
};