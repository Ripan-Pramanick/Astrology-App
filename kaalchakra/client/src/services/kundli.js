// client/src/services/kundli.js
import api from './api'; 

// ১. ফর্ম সাবমিট করার ফাংশন (যেটা আগে বানিয়েছিলাম)
export const createKundaliRequest = async (formData) => {
  try {
    const response = await api.post('/kundli/generate', formData);
    return response.data;
  } catch (error) {
    console.error("Error creating Kundli request:", error);
    throw error.response?.data || error.message;
  }
};

// ২. রেজাল্ট ফেচ করার নতুন ফাংশন (যেটার জন্য এরর দিচ্ছিল)
export const fetchKundliResult = async (id) => {
  try {
    // ব্যাকএন্ড থেকে রেজাল্ট আনার API কল
    // const response = await api.get(`/kundli/result/${id}`);
    // return response.data;
    
    // আপাতত UI চেক করার জন্য একটি ফেক/ডামি রেজাল্ট পাঠাচ্ছি
    return {
      success: true,
      data: {
        zodiac: 'Aries',
        ascendant: 'Leo',
        planets: [
          { name: 'Sun', sign: 'Aries', degree: '15° 30\'' },
          { name: 'Moon', sign: 'Taurus', degree: '22° 10\'' }
        ]
      }
    };
  } catch (error) {
    console.error("Error fetching Kundli result:", error);
    throw error.response?.data || error.message;
  }
};