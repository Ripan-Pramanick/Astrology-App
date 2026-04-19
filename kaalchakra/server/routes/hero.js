// server/routes/hero.js
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// GET hero section data
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hero_section')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Default data if no record exists
    const defaultData = {
      title: "ॐ गन् गणपत् र नमो नमः",
      subtitle: "॥ श्री सिद्धि विनायक नमो नमः ॥",
      description: "ॐ गन गणपतए नमो नमः श्री सिद्धि विनायक नमो नमः अष्टविनायक नमो नमः गणपति बाप्पा मोरया",
      buttonText: "Explore Services",
      buttonLink: "/services",
      secondaryButtonText: "Consult Now",
      secondaryButtonLink: "/contact"
    };

    res.json({ 
      success: true, 
      data: data || defaultData 
    });
  } catch (error) {
    console.error('Error fetching hero data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET stats (for trust badges)
router.get('/stats', async (req, res) => {
  try {
    // Fetch real counts from database
    const [usersCount, ordersCount, reportsCount] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('service_orders').select('*', { count: 'exact', head: true }),
      supabase.from('saved_reports').select('*', { count: 'exact', head: true })
    ]);

    const totalUsers = usersCount.count || 0;
    const totalOrders = ordersCount.count || 0;
    const totalReports = reportsCount.count || 0;

    // Calculate years of service (based on first user or order)
    let yearsOfService = '25+';
    try {
      const { data: firstOrder } = await supabase
        .from('service_orders')
        .select('created_at')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (firstOrder) {
        const startYear = new Date(firstOrder.created_at).getFullYear();
        const currentYear = new Date().getFullYear();
        yearsOfService = `${currentYear - startYear}+`;
      }
    } catch (e) {
      // Use default
    }

    res.json({
      success: true,
      stats: {
        happyClients: totalUsers > 1000 ? `${Math.floor(totalUsers / 1000)}K+` : `${totalUsers}+`,
        yearsOfService: yearsOfService,
        certifiedAstrologers: "15+ Certified",
        support: "24/7"
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default stats on error
    res.json({
      success: true,
      stats: {
        happyClients: "50,000+",
        yearsOfService: "25+",
        certifiedAstrologers: "Certified",
        support: "24/7"
      }
    });
  }
});

// UPDATE hero section (Admin only)
router.put('/', async (req, res) => {
  try {
    const { title, subtitle, description, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink } = req.body;

    // Check if record exists
    const { data: existing } = await supabase
      .from('hero_section')
      .select('id')
      .maybeSingle();

    let result;
    if (existing) {
      // Update existing
      result = await supabase
        .from('hero_section')
        .update({
          title, subtitle, description, buttonText, buttonLink,
          secondaryButtonText, secondaryButtonLink,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select();
    } else {
      // Insert new
      result = await supabase
        .from('hero_section')
        .insert([{
          title, subtitle, description, buttonText, buttonLink,
          secondaryButtonText, secondaryButtonLink,
          created_at: new Date().toISOString()
        }])
        .select();
    }

    if (result.error) throw result.error;

    res.json({ success: true, data: result.data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;