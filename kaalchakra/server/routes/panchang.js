// server/routes/panchang.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

const ASTROLOGY_USER_ID = process.env.ASTROLOGY_USER_ID;
const ASTROLOGY_WALLET_TOKEN = process.env.ASTROLOGY_WALLET_TOKEN;
const ASTROLOGY_API_URL = 'https://json.astrologyapi.com/v1';

const callAstrologyAPI = async (endpoint, payload) => {
    const authString = `${ASTROLOGY_USER_ID}:${ASTROLOGY_WALLET_TOKEN}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    
    try {
        const response = await axios.post(
            `${ASTROLOGY_API_URL}/${endpoint}`,
            payload,
            {
                headers: {
                    'Authorization': `Basic ${encodedAuth}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Panchang API Error (${endpoint}):`, error.message);
        throw error;
    }
};

// Get basic panchang
router.post('/basic', async (req, res) => {
    try {
        const data = await callAstrologyAPI('basic_panchang', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get advanced panchang
router.post('/advanced', async (req, res) => {
    try {
        const data = await callAstrologyAPI('advanced_panchang', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get panchang with sunrise/sunset
router.post('/sunrise', async (req, res) => {
    try {
        const data = await callAstrologyAPI('basic_panchang/sunrise', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get monthly panchang
router.post('/monthly', async (req, res) => {
    try {
        const data = await callAstrologyAPI('monthly_panchang', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get panchang chart
router.post('/chart', async (req, res) => {
    try {
        const data = await callAstrologyAPI('panchang_chart', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get chaughadiya muhurta
router.post('/chaughadiya', async (req, res) => {
    try {
        const data = await callAstrologyAPI('chaughadiya_muhurta', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get hora muhurta
router.post('/hora', async (req, res) => {
    try {
        const data = await callAstrologyAPI('hora_muhurta', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get auspicious muhurta for marriage
router.post('/marriage-muhurta', async (req, res) => {
    try {
        const data = await callAstrologyAPI('auspicious_muhurta/marriage', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;