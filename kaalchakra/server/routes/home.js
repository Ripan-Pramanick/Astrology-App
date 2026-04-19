// server/routes/home.js
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// GET home page services (limited for homepage)
router.get('/services/home', async (req, res) => {
  try {
    const { limit = 9 } = req.query;
    
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .eq('show_on_home', true)
      .order('display_order', { ascending: true })
      .limit(parseInt(limit));

    if (error) throw error;

    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET kundali banner for homepage
router.get('/home/kundali-banner', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('home_banners')
      .select('*')
      .eq('type', 'kundali')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const defaultBanner = {
      title: "Order Hard Copy of Kundali (Birth Chart) for convenient reference, personal keepsake, detailed layout and easy annotations",
      price: "1100",
      link: "/kundli"
    };

    res.json({ success: true, data: data || defaultBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;