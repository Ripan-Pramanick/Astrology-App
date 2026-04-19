// server/routes/articles.js
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// GET articles
router.get('/', async (req, res) => {
    try {
        const { category, limit = 9 } = req.query;
        
        let query = supabase
            .from('articles')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });
        
        if (category && category !== 'all') {
            query = query.eq('category', category);
        }
        
        const { data: articles, error } = await query.limit(parseInt(limit));
        
        if (error) throw error;
        
        res.json({ success: true, articles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single article
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data: article, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', parseInt(id))
            .single();
        
        if (error) throw error;
        
        res.json({ success: true, article });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Newsletter subscription
router.post('/newsletter/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Valid email required' });
        }
        
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email, subscribed_at: new Date().toISOString() }]);
        
        if (error && error.code === '23505') {
            return res.json({ success: true, message: 'Already subscribed' });
        }
        
        if (error) throw error;
        
        res.json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;