import axios from 'axios';

export const callAstrologyAPI = async (req, res) => {
  const { endpoint } = req.params;
  const requestData = req.body;

  // ১. নিশ্চিত করুন .env ফাইলের নামের সাথে এই নামগুলো মিলছে
  const userId = String(process.env.ASTROLOGY_USER_ID || '').trim();
  const apiKey = String(process.env.ASTROLOGY_API_KEY || '').trim();

  // ২. যদি আইডি বা কি না থাকে তবে এরর দেবে
  if (!userId || !apiKey) {
    console.error("❌ Error: API Credentials missing in .env file!");
    return res.status(500).json({ success: false, message: "Server configuration error" });
  }

  const authString = Buffer.from(`${userId}:${apiKey}`).toString('base64');

  try {
    console.log(`📡 Calling AstrologyAPI: ${endpoint} for User: ${userId}`);

    const response = await axios.post(
      `https://json.astrologyapi.com/v1/${endpoint}`,
      requestData,
      {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // ১০ সেকেন্ড টাইমআউট
      }
    );

    res.status(200).json({ success: true, data: response.data });

  }  catch (error) {
    console.error(`❌ Astrology API Error:`, error.response?.data || error.message);
    
    // 401 এর বদলে 400 বা 500 পাঠাচ্ছি যাতে আপনাকে সাইন-ইন পেজে না পাঠিয়ে দেয়
    const originalStatus = error.response?.status;
    const finalStatus = originalStatus === 401 ? 403 : (originalStatus || 500);

    res.status(finalStatus).json({ 
      success: false, 
      message: error.response?.data?.msg || "API Credentials-এ সমস্যা হচ্ছে",
      error: error.response?.data || error.message 
    });
  }
};