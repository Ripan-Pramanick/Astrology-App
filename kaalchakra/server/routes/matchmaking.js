// server/routes/matchmaking.js
import express from 'express';
import { callAstrologyAPI } from '../services/astrologyAPIService.js';

const router = express.Router();

// Direct AstrologyAPI matchmaking endpoint
router.post('/', async (req, res) => {
    try {
        const { personA, personB } = req.body;
        
        // AstrologyAPI expects m_ and f_ prefix
        const params = {
            m_day: personA.day,
            m_month: personA.month,
            m_year: personA.year,
            m_hour: personA.hour,
            m_min: personA.minute,
            m_lat: personA.latitude,
            m_lon: personA.longitude,
            m_tzone: personA.timezone,
            f_day: personB.day,
            f_month: personB.month,
            f_year: personB.year,
            f_hour: personB.hour,
            f_min: personB.minute,
            f_lat: personB.latitude,
            f_lon: personB.longitude,
            f_tzone: personB.timezone
        };
        
        // Call real AstrologyAPI
        const data = await callAstrologyAPI('match_birth_details', params);
        res.json({ success: true, data });
        
    } catch (error) {
        console.error('❌ Matchmaking API error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Matchmaking API failed. Please check your credentials.'
        });
    }
});

export default router;