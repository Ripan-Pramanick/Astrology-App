// client/src/data/astrologyServices.js
export const astrologyServices = {
  // ============================================
  // PANCHANG & CALENDAR SERVICES
  // ============================================
  panchang: {
    category: "Panchang & Calendar",
    icon: "📅",
    description: "Get detailed daily, monthly, and yearly Panchang calculations",
    services: [
      { id: "advanced_panchang", name: "Advanced Panchang", price: 0.10, description: "Detailed Panchang with all astrological calculations" },
      { id: "basic_panchang", name: "Basic Panchang", price: 0.10, description: "Essential Panchang for daily use" },
      { id: "monthly_panchang", name: "Monthly Panchang", price: 0.10, description: "Complete monthly Panchang predictions" },
      { id: "tamil_panchang", name: "Tamil Panchang", price: 0.10, description: "Traditional Tamil Panchang" },
      { id: "panchang_festival", name: "Festival Calendar", price: 0.10, description: "Hindu festival dates and timings" }
    ]
  },

  // ============================================
  // BIRTH CHART & KUNDLI SERVICES
  // ============================================
  kundli: {
    category: "Birth Chart & Kundli",
    icon: "🕉️",
    description: "Complete birth chart analysis and interpretation",
    services: [
      { id: "kundli", name: "Complete Kundli (Birth Chart)", price: 0.20, description: "Full Vedic birth chart with detailed analysis" },
      { id: "vedic_horoscope", name: "Vedic Horoscope", price: 0.20, description: "Traditional Vedic horoscope reading" },
      { id: "western_horoscope", name: "Western Horoscope", price: 0.10, description: "Western astrology horoscope" },
      { id: "astro_details", name: "Astro Details", price: 0.10, description: "Detailed astrological calculations" },
      { id: "birth_details", name: "Birth Details Analysis", price: 0.10, description: "In-depth birth details interpretation" }
    ]
  },

  // ============================================
  // PLANETARY POSITIONS SERVICES
  // ============================================
  planetary: {
    category: "Planetary Positions",
    icon: "🪐",
    description: "Current and natal planetary positions",
    services: [
      { id: "planets", name: "Planet Positions", price: 0.10, description: "Current planetary positions" },
      { id: "planets_extended", name: "Extended Planet Positions", price: 0.10, description: "Detailed planetary positions with aspects" },
      { id: "planet_ashtak", name: "Planet Ashtakavarga", price: 0.10, description: "Ashtakavarga calculations for planets" },
      { id: "planet_nature", name: "Planet Nature Analysis", price: 0.10, description: "Understanding planetary nature and characteristics" },
      { id: "house_cusps", name: "House Cusps", price: 0.10, description: "House cusp calculations and meanings" }
    ]
  },

  // ============================================
  // DASHA (PERIOD) SERVICES
  // ============================================
  dasha: {
    category: "Dasha Periods",
    icon: "⏰",
    description: "Planetary period predictions and analysis",
    services: [
      { id: "current_vdasha", name: "Current Vimshottari Dasha", price: 0.10, description: "Your current planetary period analysis" },
      { id: "major_vdasha", name: "Major Vimshottari Dasha", price: 0.10, description: "Complete Vimshottari Dasha timeline" },
      { id: "current_chardasha", name: "Current Chara Dasha", price: 0.10, description: "Chara Dasha period analysis" },
      { id: "current_yogini_dasha", name: "Current Yogini Dasha", price: 0.10, description: "Yogini Dasha predictions" },
      { id: "dasha_timeline", name: "Complete Dasha Timeline", price: 0.20, description: "Full life Dasha timeline with predictions" }
    ]
  },

  // ============================================
  // MATCHMAKING & COMPATIBILITY SERVICES
  // ============================================
  matchmaking: {
    category: "Matchmaking & Compatibility",
    icon: "💑",
    description: "Horoscope matching for marriage and relationships",
    services: [
      { id: "match_making_report", name: "Match Making Report", price: 0.20, description: "Complete horoscope matching report" },
      { id: "match_making_detailed", name: "Detailed Match Making", price: 0.20, description: "In-depth compatibility analysis" },
      { id: "match_percentage", name: "Compatibility Percentage", price: 0.10, description: "Guna Milan percentage calculation" },
      { id: "ashtakoot_points", name: "Ashtakoot Matching", price: 0.10, description: "8-point compatibility analysis" },
      { id: "dashakoot_points", name: "Dashakoot Matching", price: 0.10, description: "10-point compatibility analysis" },
      { id: "zodiac_compatibility", name: "Zodiac Compatibility", price: 0.10, description: "Sun sign compatibility check" },
      { id: "love_compatibility", name: "Love Compatibility", price: 0.10, description: "Romantic relationship compatibility" },
      { id: "synastry_horoscope", name: "Synastry Horoscope", price: 0.10, description: "Relationship dynamics analysis" },
      { id: "composite_horoscope", name: "Composite Horoscope", price: 0.10, description: "Combined chart analysis" }
    ]
  },

  // ============================================
  // DOSHA & YOGA SERVICES
  // ============================================
  dosha: {
    category: "Dosha & Yoga",
    icon: "⚠️",
    description: "Identify and remedy planetary afflictions",
    services: [
      { id: "manglik", name: "Manglik Dosha Check", price: 0.10, description: "Check for Manglik Dosha in chart" },
      { id: "kalsarpa_details", name: "Kalsarpa Dosha", price: 0.10, description: "Kalsarpa Yoga analysis and remedies" },
      { id: "pitra_dosha", name: "Pitra Dosha", price: 0.10, description: "Ancestral karma analysis" },
      { id: "yogas", name: "Astrological Yogas", price: 0.10, description: "Identify beneficial and malefic yogas" },
      { id: "sarvashtak", name: "Sarvashtakavarga", price: 0.10, description: "Complete Ashtakavarga analysis" }
    ]
  },

  // ============================================
  // SADE SATI SERVICES
  // ============================================
  sadeSati: {
    category: "Sade Sati",
    icon: "🌑",
    description: "Saturn's transit analysis and remedies",
    services: [
      { id: "sade_sati_status", name: "Sade Sati Status", price: 0.10, description: "Current Sade Sati status check" },
      { id: "sade_sati_life", name: "Sade Sati Life Details", price: 0.10, description: "Complete Sade Sati life analysis" },
      { id: "sade_sati_remedies", name: "Sade Sati Remedies", price: 0.10, description: "Remedies for Sade Sati" }
    ]
  },

  // ============================================
  // NUMEROLOGY SERVICES
  // ============================================
  numerology: {
    category: "Numerology",
    icon: "🔢",
    description: "Number-based life predictions",
    services: [
      { id: "numerology_report", name: "Complete Numerology Report", price: 0.20, description: "Full numerology analysis" },
      { id: "life_path_number", name: "Life Path Number", price: 0.10, description: "Your life purpose number" },
      { id: "expression_number", name: "Expression Number", price: 0.10, description: "Your natural talents number" },
      { id: "soul_urge_number", name: "Soul Urge Number", price: 0.10, description: "Your inner desires number" },
      { id: "personality_number", name: "Personality Number", price: 0.10, description: "How others see you" },
      { id: "challenge_numbers", name: "Challenge Numbers", price: 0.10, description: "Life obstacles analysis" }
    ]
  },

  // ============================================
  // MUHURTA SERVICES
  // ============================================
  muhurta: {
    category: "Muhurta (Auspicious Timings)",
    icon: "⌛",
    description: "Find the best time for important events",
    services: [
      { id: "marriage_muhurta", name: "Marriage Muhurta", price: 0.10, description: "Auspicious wedding dates" },
      { id: "chaughadiya_muhurta", name: "Chaughadiya Muhurta", price: 0.10, description: "Daily auspicious timings" },
      { id: "hora_muhurta", name: "Hora Muhurta", price: 0.10, description: "Hourly planetary timings" }
    ]
  },

  // ============================================
  // TAROT SERVICES
  // ============================================
  tarot: {
    category: "Tarot Reading",
    icon: "🎴",
    description: "Tarot card predictions and guidance",
    services: [
      { id: "tarot_predictions", name: "Tarot Predictions", price: 0.10, description: "General tarot reading" },
      { id: "yes_no_tarot", name: "Yes/No Tarot", price: 0.10, description: "Quick yes/no answers" }
    ]
  },

  // ============================================
  // DAILY PREDICTIONS SERVICES
  // ============================================
  dailyPredictions: {
    category: "Daily & Weekly Predictions",
    icon: "🌟",
    description: "Personalized daily, weekly, and monthly forecasts",
    services: [
      { id: "daily_horoscope", name: "Daily Horoscope", price: 0.10, description: "Your daily zodiac prediction" },
      { id: "daily_nakshatra", name: "Daily Nakshatra", price: 0.10, description: "Nakshatra-based daily prediction" },
      { id: "personal_day", name: "Personal Day Prediction", price: 0.10, description: "Day-specific personal forecast" },
      { id: "personal_month", name: "Personal Month Prediction", price: 0.10, description: "Monthly forecast" },
      { id: "personal_year", name: "Personal Year Prediction", price: 0.10, description: "Yearly forecast" },
      { id: "moon_phase", name: "Moon Phase Report", price: 0.10, description: "Moon's influence on your life" }
    ]
  },

  // ============================================
  // VARSHAPHAL (YEARLY) SERVICES
  // ============================================
  varshaphal: {
    category: "Yearly Predictions (Varshaphal)",
    icon: "📆",
    description: "Complete annual astrological forecast",
    services: [
      { id: "varshaphal_details", name: "Varshaphal Details", price: 0.10, description: "Annual solar return predictions" },
      { id: "varshaphal_year_chart", name: "Varshaphal Year Chart", price: 0.10, description: "Yearly chart analysis" },
      { id: "varshaphal_month_chart", name: "Varshaphal Month Chart", price: 0.10, description: "Monthly breakdown of the year" }
    ]
  },

  // ============================================
  // TRANSIT (GOCHAR) SERVICES
  // ============================================
  transit: {
    category: "Transits (Gochar)",
    icon: "🔄",
    description: "Planetary transit effects on your life",
    services: [
      { id: "daily_transits", name: "Daily Transits", price: 0.20, description: "Daily planetary transit effects" },
      { id: "weekly_transits", name: "Weekly Transits", price: 0.20, description: "Weekly transit predictions" },
      { id: "tropical_transits", name: "Tropical Transits", price: 0.20, description: "Western astrology transits" }
    ]
  },

  // ============================================
  // REMEDIES SERVICES
  // ============================================
  remedies: {
    category: "Remedies & Solutions",
    icon: "💎",
    description: "Vedic remedies for planetary problems",
    services: [
      { id: "gem_suggestion", name: "Gemstone Recommendation", price: 0.10, description: "Personalized gemstone suggestions" },
      { id: "rudraksha_suggestion", name: "Rudraksha Suggestion", price: 0.10, description: "Rudraksha recommendation" },
      { id: "puja_suggestion", name: "Puja Suggestion", price: 0.10, description: "Remedial puja recommendations" },
      { id: "lal_kitab_remedies", name: "Lal Kitab Remedies", price: 0.10, description: "Lal Kitab based remedies" }
    ]
  },

  // ============================================
  // LAL KITAB SERVICES
  // ============================================
  lalKitab: {
    category: "Lal Kitab",
    icon: "📖",
    description: "Lal Kitab astrology and remedies",
    services: [
      { id: "lal_kitab_horoscope", name: "Lal Kitab Horoscope", price: 0.10, description: "Lal Kitab chart analysis" },
      { id: "lal_kitab_houses", name: "Lal Kitab Houses", price: 0.10, description: "House analysis as per Lal Kitab" },
      { id: "lal_kitab_planets", name: "Lal Kitab Planets", price: 0.10, description: "Planetary positions in Lal Kitab" }
    ]
  },

  // ============================================
  // KP SYSTEM SERVICES
  // ============================================
  kp: {
    category: "KP System (Krishnamurti)",
    icon: "🔮",
    description: "KP Astrology predictions",
    services: [
      { id: "kp_birth_chart", name: "KP Birth Chart", price: 0.10, description: "Krishnamurti Paddhati chart" },
      { id: "kp_planets", name: "KP Planets", price: 0.10, description: "KP planetary positions" },
      { id: "kp_house_significator", name: "KP House Significator", price: 0.10, description: "House significators in KP" }
    ]
  },

  // ============================================
  // SPECIAL REPORTS SERVICES
  // ============================================
  reports: {
    category: "Special Reports",
    icon: "📊",
    description: "Comprehensive astrological reports",
    services: [
      { id: "natal_chart_interpretation", name: "Natal Chart Interpretation", price: 0.10, description: "Complete birth chart reading" },
      { id: "personality_report", name: "Personality Report", price: 0.10, description: "In-depth personality analysis" },
      { id: "life_forecast", name: "Life Forecast Report", price: 0.10, description: "Full life predictions" },
      { id: "karma_destiny", name: "Karma & Destiny Report", price: 0.10, description: "Karmic life path analysis" },
      { id: "career_report", name: "Career Astrology Report", price: 0.10, description: "Career guidance" },
      { id: "finance_report", name: "Finance & Wealth Report", price: 0.10, description: "Financial predictions" },
      { id: "health_report", name: "Health Astrology Report", price: 0.10, description: "Health predictions and remedies" }
    ]
  },

  // ============================================
  // SOLAR RETURN SERVICES
  // ============================================
  solarReturn: {
    category: "Solar Return",
    icon: "☀️",
    description: "Birthday to birthday predictions",
    services: [
      { id: "solar_return_details", name: "Solar Return Details", price: 0.10, description: "Annual solar return analysis" },
      { id: "solar_return_planets", name: "Solar Return Planets", price: 0.10, description: "Planetary positions in solar return" },
      { id: "solar_return_house_cusps", name: "Solar Return House Cusps", price: 0.10, description: "House analysis in solar return" }
    ]
  }
};

// Get all categories
export const getAllCategories = () => {
  return Object.keys(astrologyServices).map(key => ({
    id: key,
    name: astrologyServices[key].category,
    icon: astrologyServices[key].icon,
    description: astrologyServices[key].description,
    serviceCount: astrologyServices[key].services.length
  }));
};

// Get all services (flattened)
export const getAllServices = () => {
  const allServices = [];
  Object.keys(astrologyServices).forEach(categoryKey => {
    astrologyServices[categoryKey].services.forEach(service => {
      allServices.push({
        ...service,
        category: astrologyServices[categoryKey].category,
        categoryId: categoryKey,
        categoryIcon: astrologyServices[categoryKey].icon
      });
    });
  });
  return allServices;
};

// Get services by category
export const getServicesByCategory = (categoryId) => {
  return astrologyServices[categoryId]?.services || [];
};

// Get service by ID
export const getServiceById = (serviceId) => {
  for (const category of Object.values(astrologyServices)) {
    const service = category.services.find(s => s.id === serviceId);
    if (service) return service;
  }
  return null;
};