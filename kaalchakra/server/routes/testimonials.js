// server/routes/testimonials.js
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// GET testimonials
router.get('/', async (req, res) => {
    try {
        const { limit = 6 } = req.query;
        
        const { data: testimonials, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('is_approved', true)
            .order('rating', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(parseInt(limit));
        
        if (error) throw error;
        
        res.json({ success: true, testimonials });
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
                averageRating: 4.9,
                expertAstrologers: '15+',
                yearsOfService: '25+'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;