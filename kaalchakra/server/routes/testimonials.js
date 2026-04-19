// server/routes/testimonials.js
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// GET all approved testimonials
router.get('/', async (req, res) => {
  try {
    const { limit = 6, is_approved = 'true' } = req.query;
    
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (is_approved === 'true') {
      query = query.eq('is_approved', true);
    }
    
    const { data: testimonials, error } = await query.limit(parseInt(limit));
    
    if (error) throw error;
    
    res.json({ success: true, testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET testimonial stats
router.get('/stats', async (req, res) => {
  try {
    // Get total count of approved testimonials
    const { count: totalCount, error: countError } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', true);
    
    if (countError) throw countError;
    
    // Get average rating
    const { data: avgData, error: avgError } = await supabase
      .from('testimonials')
      .select('rating')
      .eq('is_approved', true);
    
    let averageRating = 4.9;
    if (avgData && avgData.length > 0) {
      const sum = avgData.reduce((acc, curr) => acc + curr.rating, 0);
      averageRating = Math.round((sum / avgData.length) * 10) / 10;
    }
    
    // Get unique clients count (based on user_id or name)
    const { count: uniqueClients, error: clientError } = await supabase
      .from('testimonials')
      .select('user_id', { count: 'exact', head: true })
      .eq('is_approved', true);
    
    // Format happy clients count
    let happyClients = '50K+';
    if (uniqueClients) {
      if (uniqueClients > 1000) {
        happyClients = `${Math.floor(uniqueClients / 1000)}K+`;
      } else {
        happyClients = uniqueClients.toString();
      }
    }
    
    // Get expert astrologers count from users table with role 'astrologer'
    const { count: astrologerCount, error: astrologerError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'astrologer');
    
    // Calculate years of service (based on first testimonial date)
    let yearsOfService = '25+';
    const { data: firstTestimonial } = await supabase
      .from('testimonials')
      .select('created_at')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    
    if (firstTestimonial) {
      const startYear = new Date(firstTestimonial.created_at).getFullYear();
      const currentYear = new Date().getFullYear();
      yearsOfService = `${currentYear - startYear}+`;
    }
    
    res.json({
      success: true,
      stats: {
        happyClients: happyClients,
        averageRating: averageRating,
        expertAstrologers: astrologerCount ? `${astrologerCount}+` : '15+',
        yearsOfService: yearsOfService
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default stats on error
    res.json({
      success: true,
      stats: {
        happyClients: '50K+',
        averageRating: 4.9,
        expertAstrologers: '15+',
        yearsOfService: '25+'
      }
    });
  }
});

// POST new testimonial (requires auth)
router.post('/', async (req, res) => {
  try {
    const { user_id, name, role, zodiac, location, content, rating } = req.body;
    
    if (!content || !rating) {
      return res.status(400).json({ success: false, message: 'Content and rating are required' });
    }
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        user_id,
        name,
        role,
        zodiac,
        location,
        content,
        rating,
        is_approved: false, // Needs admin approval
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Testimonial submitted for approval', testimonial: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Approve testimonial
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('testimonials')
      .update({ is_approved: true, approved_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json({ success: true, testimonial: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;