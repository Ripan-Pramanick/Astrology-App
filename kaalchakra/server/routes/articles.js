// server/routes/articles.js
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// GET all articles with filtering
router.get('/', async (req, res) => {
  try {
    const { category, limit = 9, featured } = req.query;
    
    let query = supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false });
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    
    const { data: articles, error } = await query.limit(parseInt(limit));
    
    if (error) throw error;
    
    res.json({ success: true, articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single article by ID or slug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is numeric or slug
    const isNumeric = /^\d+$/.test(id);
    
    let query = supabase
      .from('articles')
      .select('*')
      .eq('is_published', true);
    
    if (isNumeric) {
      query = query.eq('id', parseInt(id));
    } else {
      query = query.eq('slug', id);
    }
    
    const { data: article, error } = await query.single();
    
    if (error) throw error;
    
    // Increment view count
    await supabase
      .from('articles')
      .update({ views: (article.views || 0) + 1 })
      .eq('id', article.id);
    
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
    
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, subscribed_at: new Date().toISOString() }])
      .select();
    
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