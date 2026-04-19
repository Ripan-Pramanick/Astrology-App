// server/routes/about.js
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// GET about page data
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('about_page')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    const defaultData = {
      title: "About Vedic Astrology",
      description: "Vedic astrology, also known as Jyotish Shastra, is a traditional system of astrology that originated in ancient India. Based on the Vedas, the oldest sacred texts of Hinduism, it has been guiding humanity for thousands of years.",
      scienceTitle: "The Science of Light",
      scienceDescription1: "Astrology or Jyotisha connects human life with cosmic order and karmic patterns. It is not just about making predictions or analyzing personality traits, but about understanding the cosmic play of karma, the soul's journey, and the individual's role in the greater scheme of the universe.",
      scienceDescription2: "Vedic astrology offers guidance, self-awareness, and a deeper understanding of life's purpose and challenges. Rooted in ancient wisdom, it provides insights into the karmic forces at play and helps us live more fulfilling and purposeful lives, making informed choices leading to material and spiritual success.",
      brandStatement: "At Kaal-Chakra, we combine traditional Jyotish knowledge with modern technology to provide accurate and personalized astrological services.",
      mission: "To empower individuals with the wisdom of the stars, helping them make informed decisions and live in harmony with cosmic rhythms.",
      missionSubtext: "We believe everyone deserves access to authentic astrological guidance that respects both ancient wisdom and modern needs.",
      vision: "To be a trusted bridge between ancient Vedic wisdom and modern seekers, offering clarity and direction in all aspects of life.",
      visionSubtext: "Creating a global community where astrological knowledge is accessible, accurate, and applied for positive transformation.",
      values: "Authenticity in Vedic traditions,Compassion and confidentiality,Continuous learning and accuracy,Empowerment through knowledge",
      teamMembers: JSON.stringify([
        { name: "Dr. Suresh Rao", role: "Chief Astrologer", expertise: "Vedic & KP", avatar: "SR", color: "bg-gradient-to-br from-orange-500 to-amber-500" },
        { name: "Pt. Rajesh Sharma", role: "Senior Astrologer", expertise: "Marriage & Career", avatar: "RS", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
        { name: "Ms. Geeta M", role: "Vedic Counselor", expertise: "Remedies & Mantras", avatar: "GM", color: "bg-gradient-to-br from-blue-500 to-cyan-500" }
      ]),
      whyChooseUs: "Authentic Vedic traditions & calculations,Experienced & certified astrologers,Personalized guidance & remedies,Confidential & compassionate service,Follow-up support & detailed reports"
    };
    
    res.json({ success: true, data: data || defaultData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET about page stats
router.get('/stats', async (req, res) => {
  try {
    // Get total users count
    const { count: userCount, error: userError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    // Get astrologers count
    const { count: astrologerCount, error: astroError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'astrologer');
    
    // Get years of service from first testimonial or order
    let yearsOfService = '25+';
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
    
    // Calculate satisfaction rate based on ratings
    let satisfactionRate = '100%';
    const { data: testimonials } = await supabase
      .from('testimonials')
      .select('rating')
      .eq('is_approved', true);
    
    if (testimonials && testimonials.length > 0) {
      const avgRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
      satisfactionRate = `${Math.round((avgRating / 5) * 100)}%`;
    }
    
    // Format happy clients
    let happyClients = '50K+';
    if (userCount) {
      if (userCount > 1000) {
        happyClients = `${Math.floor(userCount / 1000)}K+`;
      } else {
        happyClients = userCount.toString();
      }
    }
    
    res.json({
      success: true,
      stats: {
        happyClients: happyClients,
        expertAstrologers: astrologerCount ? `${astrologerCount}+` : '15+',
        yearsOfService: yearsOfService,
        satisfactionRate: satisfactionRate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;