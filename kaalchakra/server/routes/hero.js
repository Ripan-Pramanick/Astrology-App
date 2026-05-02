// server/routes/hero.js
import express from 'express';

const router = express.Router();

// GET hero section data
router.get('/', async (req, res) => {
  try {
    const heroData = {
      title: "ॐ गन् गणपत् र नमो नमः",
      subtitle: "॥ श्री सिद्धि विनायक नमो नमः ॥",
      description: "ॐ गन गणपतए नमो नमः श्री सिद्धि विनायक नमो नमः अष्टविनायक नमो नमः गणपति बाप्पा मोरया",
      buttonText: "Explore Services",
      buttonLink: "/services",
      secondaryButtonText: "Consult Now",
      secondaryButtonLink: "/contact"
    };
    
    res.json({ success: true, data: heroData });
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
        happyClients: "50,000+",
        yearsOfService: "25+",
        certifiedAstrologers: "15+",
        support: "24/7"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;