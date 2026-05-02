// server/routes/about.js
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// GET about page data
router.get('/', async (req, res) => {
    try {
        const defaultData = {
            title: "About Vedic Astrology",
            description: "Vedic astrology, also known as Jyotish Shastra, is a traditional system of astrology that originated in ancient India.",
            scienceTitle: "The Science of Light",
            scienceDescription1: "Astrology or Jyotisha connects human life with cosmic order and karmic patterns.",
            brandStatement: "At Kaal-Chakra, we combine traditional Jyotish knowledge with modern technology.",
            mission: "To empower individuals with the wisdom of the stars.",
            vision: "To be a trusted bridge between ancient Vedic wisdom and modern seekers."
        };
        
        res.json({ success: true, data: defaultData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET stats
router.get('/stats', async (req, res) => {
    try {
        res.json({
            success: true,
            stats: {
                happyClients: '50K+',
                expertAstrologers: '15+',
                yearsOfService: '25+',
                satisfactionRate: '100%'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;