// client/src/services/astrologyApi.js
import axios from 'axios';

// ============================================
// ASTROLOGY API CONFIGURATION
// ============================================
const ASTROLOGY_USER_ID = import.meta.env.VITE_ASTROLOGY_USER_ID || '651200';
const ASTROLOGY_WALLET_TOKEN = import.meta.env.VITE_ASTROLOGY_WALLET_TOKEN || '';
const ASTROLOGY_API_URL = import.meta.env.VITE_ASTROLOGY_API_URL || 'https://json.astrologyapi.com/v1';

// Create axios instance
const astrologyApi = axios.create({
  baseURL: ASTROLOGY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Add authentication interceptor
astrologyApi.interceptors.request.use((config) => {
  const authString = `${ASTROLOGY_USER_ID}:${ASTROLOGY_WALLET_TOKEN}`;
  const encodedAuth = btoa(authString);
  config.headers.Authorization = `Basic ${encodedAuth}`;
  return config;
});

// Response interceptor for error handling
astrologyApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('AstrologyAPI Error:', error.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
);

// ============================================
// PANCHANG & CALENDAR ENDPOINTS
// ============================================
export const panchangService = {
  // Advanced Panchang with detailed calculations
  async getAdvancedPanchang(params) {
    return astrologyApi.post('/advanced_panchang', params);
  },
  
  // Advanced Panchang Sunrise/Sunset
  async getAdvancedPanchangSunrise(params) {
    return astrologyApi.post('/advanced_panchang/sunrise', params);
  },
  
  // Basic Panchang
  async getBasicPanchang(params) {
    return astrologyApi.post('/basic_panchang', params);
  },
  
  // Basic Panchang Sunrise
  async getBasicPanchangSunrise(params) {
    return astrologyApi.post('/basic_panchang/sunrise', params);
  },
  
  // Monthly Panchang
  async getMonthlyPanchang(params) {
    return astrologyApi.post('/monthly_panchang', params);
  },
  
  // Tamil Panchang
  async getTamilPanchang(params) {
    return astrologyApi.post('/tamil_panchang', params);
  },
  
  // Tamil Month Panchang
  async getTamilMonthPanchang(params) {
    return astrologyApi.post('/tamil_month_panchang', params);
  },
  
  // Panchang Chart
  async getPanchangChart(params) {
    return astrologyApi.post('/panchang_chart', params);
  },
  
  // Panchang Festival
  async getPanchangFestival(params) {
    return astrologyApi.post('/panchang_festival', params);
  },
  
  // Panchang Lagna Table
  async getPanchangLagnaTable(params) {
    return astrologyApi.post('/panchang_lagna_table', params);
  },
  
  // Planet Panchang
  async getPlanetPanchang(params) {
    return astrologyApi.post('/planet_panchang', params);
  },
  
  // Planet Panchang Sunrise
  async getPlanetPanchangSunrise(params) {
    return astrologyApi.post('/planet_panchang/sunrise', params);
  },
};

// ============================================
// BIRTH CHART & KUNDLI ENDPOINTS
// ============================================
export const kundliService = {
  // Complete Birth Chart (Kundli)
  async getKundli(birthDetails) {
    return astrologyApi.post('/kundli', birthDetails);
  },
  
  // Vedic Horoscope
  async getVedicHoroscope(birthDetails) {
    return astrologyApi.post('/vedic_horoscope', birthDetails);
  },
  
  // Western Horoscope
  async getWesternHoroscope(birthDetails) {
    return astrologyApi.post('/western_horoscope', birthDetails);
  },
  
  // Birth Details
  async getBirthDetails(birthDetails) {
    return astrologyApi.post('/birth_details', birthDetails);
  },
  
  // Astro Details
  async getAstroDetails(birthDetails) {
    return astrologyApi.post('/astro_details', birthDetails);
  },
  
  // Western Chart Data
  async getWesternChartData(birthDetails) {
    return astrologyApi.post('/western_chart_data', birthDetails);
  },
  
  // Custom Western Chart
  async getCustomWesternChart(params) {
    return astrologyApi.post('/custom_western_chart', params);
  },
  
  // Geo Details (Location Search)
  async getGeoDetails(place) {
    return astrologyApi.post('/geo_details', { place });
  },
  
  // Timezone
  async getTimezone(params) {
    return astrologyApi.post('/timezone', params);
  },
  
  // Timezone with DST
  async getTimezoneWithDST(params) {
    return astrologyApi.post('/timezone_with_dst', params);
  },
};

// ============================================
// PLANETARY POSITIONS ENDPOINTS
// ============================================
export const planetaryService = {
  // Planet Positions
  async getPlanets(birthDetails) {
    return astrologyApi.post('/planets', birthDetails);
  },
  
  // Extended Planet Positions
  async getPlanetsExtended(birthDetails) {
    return astrologyApi.post('/planets/extended', birthDetails);
  },
  
  // Tropical Planets
  async getPlanetsTropical(birthDetails) {
    return astrologyApi.post('/planets/tropical', birthDetails);
  },
  
  // Planet Ashtak
  async getPlanetAshtak(planetName, birthDetails) {
    return astrologyApi.post(`/planet_ashtak/${planetName}`, birthDetails);
  },
  
  // Planet Nature
  async getPlanetNature(planetName) {
    return astrologyApi.post(`/planet_nature`, { planet: planetName });
  },
  
  // Bhav Madhya (House Midpoints)
  async getBhavMadhya(birthDetails) {
    return astrologyApi.post('/bhav_madhya', birthDetails);
  },
  
  // House Cusps Tropical
  async getHouseCuspsTropical(birthDetails) {
    return astrologyApi.post('/house_cusps/tropical', birthDetails);
  },
  
  // Natal House Cusp Report
  async getNatalHouseCuspReport(birthDetails) {
    return astrologyApi.post('/natal_house_cusp_report', birthDetails);
  },
  
  // General House Report
  async getGeneralHouseReport(planetName, birthDetails) {
    return astrologyApi.post(`/general_house_report/${planetName}`, birthDetails);
  },
  
  // General House Report Tropical
  async getGeneralHouseReportTropical(planetName, birthDetails) {
    return astrologyApi.post(`/general_house_report/tropical/${planetName}`, birthDetails);
  },
};

// ============================================
// DASHA (PERIOD) ENDPOINTS
// ============================================
export const dashaService = {
  // Current Vimshottari Dasha
  async getCurrentVDasha(birthDetails) {
    return astrologyApi.post('/current_vdasha', birthDetails);
  },
  
  // All Vimshottari Dasha
  async getAllVDasha(birthDetails) {
    return astrologyApi.post('/current_vdasha_all', birthDetails);
  },
  
  // Vimshottari Dasha by Date
  async getVDashaByDate(params) {
    return astrologyApi.post('/current_vdasha_date', params);
  },
  
  // Major Vimshottari Dasha
  async getMajorVDasha(birthDetails) {
    return astrologyApi.post('/major_vdasha', birthDetails);
  },
  
  // Sub Vimshottari Dasha
  async getSubVDasha(md, birthDetails) {
    return astrologyApi.post(`/sub_vdasha/${md}`, birthDetails);
  },
  
  // Sub-Sub Vimshottari Dasha
  async getSubSubVDasha(md, ad, birthDetails) {
    return astrologyApi.post(`/sub_sub_vdasha/${md}/${ad}`, birthDetails);
  },
  
  // Sub-Sub-Sub Vimshottari Dasha
  async getSubSubSubVDasha(md, ad, pd, birthDetails) {
    return astrologyApi.post(`/sub_sub_sub_vdasha/${md}/${ad}/${pd}`, birthDetails);
  },
  
  // Sub-Sub-Sub-Sub Vimshottari Dasha
  async getSubSubSubSubVDasha(md, ad, pd, sd, birthDetails) {
    return astrologyApi.post(`/sub_sub_sub_sub_vdasha/${md}/${ad}/${pd}/${sd}`, birthDetails);
  },
  
  // Current Chara Dasha
  async getCurrentChardasha(birthDetails) {
    return astrologyApi.post('/current_chardasha', birthDetails);
  },
  
  // Major Chara Dasha
  async getMajorChardasha(birthDetails) {
    return astrologyApi.post('/major_chardasha', birthDetails);
  },
  
  // Sub Chara Dasha
  async getSubChardasha(md, birthDetails) {
    return astrologyApi.post(`/sub_chardasha/${md}`, birthDetails);
  },
  
  // Sub-Sub Chara Dasha
  async getSubSubChardasha(md, ad, birthDetails) {
    return astrologyApi.post(`/sub_sub_chardasha/${md}/${ad}`, birthDetails);
  },
  
  // Current Yogini Dasha
  async getCurrentYoginiDasha(birthDetails) {
    return astrologyApi.post('/current_yogini_dasha', birthDetails);
  },
  
  // Major Yogini Dasha
  async getMajorYoginiDasha(birthDetails) {
    return astrologyApi.post('/major_yogini_dasha', birthDetails);
  },
  
  // Sub Yogini Dasha
  async getSubYoginiDasha(birthDetails) {
    return astrologyApi.post('/sub_yogini_dasha', birthDetails);
  },
};

// ============================================
// MATCHMAKING & COMPATIBILITY ENDPOINTS
// ============================================
export const matchmakingService = {
  // Match Making Report
  async getMatchMaking(personA, personB) {
    return astrologyApi.post('/match_making_report', { personA, personB });
  },
  
  // Detailed Match Making Report
  async getMatchMakingDetailed(personA, personB) {
    return astrologyApi.post('/match_making_detailed_report', { personA, personB });
  },
  
  // Simple Match Report
  async getSimpleMatch(personA, personB) {
    return astrologyApi.post('/match_simple_report', { personA, personB });
  },
  
  // Match Percentage
  async getMatchPercentage(personA, personB) {
    return astrologyApi.post('/match_percentage', { personA, personB });
  },
  
  // Ashtakoot Points
  async getAshtakootPoints(personA, personB) {
    return astrologyApi.post('/match_ashtakoot_points', { personA, personB });
  },
  
  // Dashakoot Points
  async getDashakootPoints(personA, personB) {
    return astrologyApi.post('/match_dashakoot_points', { personA, personB });
  },
  
  // Match Manglik Report
  async getMatchManglik(personA, personB) {
    return astrologyApi.post('/match_manglik_report', { personA, personB });
  },
  
  // Match Obstructions
  async getMatchObstructions(personA, personB) {
    return astrologyApi.post('/match_obstructions', { personA, personB });
  },
  
  // Match Planet Details
  async getMatchPlanetDetails(personA, personB) {
    return astrologyApi.post('/match_planet_details', { personA, personB });
  },
  
  // Match Astro Details
  async getMatchAstroDetails(personA, personB) {
    return astrologyApi.post('/match_astro_details', { personA, personB });
  },
  
  // Match Birth Details
  async getMatchBirthDetails(personA, personB) {
    return astrologyApi.post('/match_birth_details', { personA, personB });
  },
  
  // Zodiac Compatibility
  async getZodiacCompatibility(zodiacName, partnerZodiacName) {
    return astrologyApi.post(`/zodiac_compatibility/${zodiacName}/${partnerZodiacName}`);
  },
  
  // Love Compatibility Report (Tropical)
  async getLoveCompatibilityReport(params) {
    return astrologyApi.post('/love_compatibility_report/tropical', params);
  },
  
  // Partner Report
  async getPartnerReport(birthDetails) {
    return astrologyApi.post('/partner_report', birthDetails);
  },
  
  // Composite Horoscope
  async getCompositeHoroscope(personA, personB) {
    return astrologyApi.post('/composite_horoscope', { personA, personB });
  },
  
  // Synastry Horoscope
  async getSynastryHoroscope(personA, personB) {
    return astrologyApi.post('/synastry_horoscope', { personA, personB });
  },
  
  // Affinity Calculator
  async getAffinityCalculator(personA, personB) {
    return astrologyApi.post('/affinity_calculator', { personA, personB });
  },
  
  // Romantic Forecast Report
  async getRomanticForecastReport(params) {
    return astrologyApi.post('/romantic_forecast_report/tropical', params);
  },
  
  // Romantic Forecast Couple Report
  async getRomanticForecastCoupleReport(params) {
    return astrologyApi.post('/romantic_forecast_couple_report/tropical', params);
  },
  
  // Romantic Personality Report
  async getRomanticPersonalityReport(params) {
    return astrologyApi.post('/romantic_personality_report/tropical', params);
  },
};

// ============================================
// DOSHA & YOGA ENDPOINTS
// ============================================
export const doshaService = {
  // Manglik Dosha
  async getManglik(birthDetails) {
    return astrologyApi.post('/manglik', birthDetails);
  },
  
  // Simple Manglik
  async getSimpleManglik(birthDetails) {
    return astrologyApi.post('/simple_manglik', birthDetails);
  },
  
  // Kalsarpa Details
  async getKalsarpaDetails(birthDetails) {
    return astrologyApi.post('/kalsarpa_details', birthDetails);
  },
  
  // Pitra Dosha Report
  async getPitraDoshaReport(birthDetails) {
    return astrologyApi.post('/pitra_dosha_report', birthDetails);
  },
  
  // Papasamyam Details
  async getPapasamyamDetails(birthDetails) {
    return astrologyApi.post('/papasamyam_details', birthDetails);
  },
  
  // Yogas from chart
  async getYogas(birthDetails) {
    return astrologyApi.post('/yogas', birthDetails);
  },
  
  // Varshaphal Yoga
  async getVarshaphalYoga(birthDetails) {
    return astrologyApi.post('/varshaphal_yoga', birthDetails);
  },
  
  // Sarvashtak
  async getSarvashtak(birthDetails) {
    return astrologyApi.post('/sarvashtak', birthDetails);
  },
  
  // Ghat Chakra
  async getGhatChakra(birthDetails) {
    return astrologyApi.post('/ghat_chakra', birthDetails);
  },
};

// ============================================
// SADE SATI ENDPOINTS
// ============================================
export const sadeSatiService = {
  // Current Sade Sati Status
  async getSadeSatiCurrentStatus(birthDetails) {
    return astrologyApi.post('/sadhesati_current_status', birthDetails);
  },
  
  // Sade Sati Life Details
  async getSadeSatiLifeDetails(birthDetails) {
    return astrologyApi.post('/sadhesati_life_details', birthDetails);
  },
  
  // Sade Sati Remedies
  async getSadeSatiRemedies(birthDetails) {
    return astrologyApi.post('/sadhesati_remedies', birthDetails);
  },
};

// ============================================
// LAL KITAB ENDPOINTS
// ============================================
export const lalKitabService = {
  // Lal Kitab Horoscope
  async getLalKitabHoroscope(birthDetails) {
    return astrologyApi.post('/lalkitab_horoscope', birthDetails);
  },
  
  // Lal Kitab Houses
  async getLalKitabHouses(birthDetails) {
    return astrologyApi.post('/lalkitab_houses', birthDetails);
  },
  
  // Lal Kitab Planets
  async getLalKitabPlanets(birthDetails) {
    return astrologyApi.post('/lalkitab_planets', birthDetails);
  },
  
  // Lal Kitab Debts
  async getLalKitabDebts(birthDetails) {
    return astrologyApi.post('/lalkitab_debts', birthDetails);
  },
  
  // Lal Kitab Remedies
  async getLalKitabRemedies(planetName, birthDetails) {
    return astrologyApi.post(`/lalkitab_remedies/${planetName}`, birthDetails);
  },
};

// ============================================
// NUMEROLOGY ENDPOINTS
// ============================================
export const numerologyService = {
  // Numerology Report
  async getNumerologyReport(params) {
    return astrologyApi.post('/numero_report', params);
  },
  
  // Numerology Table
  async getNumerologyTable(params) {
    return astrologyApi.post('/numero_table', params);
  },
  
  // Life Path Number
  async getLifePathNumber(birthDetails) {
    return astrologyApi.post('/lifepath_number', birthDetails);
  },
  
  // Expression Number
  async getExpressionNumber(params) {
    return astrologyApi.post('/expression_number', params);
  },
  
  // Soul Urge Number
  async getSoulUrgeNumber(params) {
    return astrologyApi.post('/soul_urge_number', params);
  },
  
  // Personality Number
  async getPersonalityNumber(params) {
    return astrologyApi.post('/personality_number', params);
  },
  
  // Challenge Numbers
  async getChallengeNumbers(birthDetails) {
    return astrologyApi.post('/challenge_numbers', birthDetails);
  },
  
  // Numerology Numbers
  async getNumerologicalNumbers(params) {
    return astrologyApi.post('/numerological_numbers', params);
  },
  
  // Numerology Fav Lord
  async getNumeroFavLord(params) {
    return astrologyApi.post('/numero_fav_lord', params);
  },
  
  // Numerology Fav Mantra
  async getNumeroFavMantra(params) {
    return astrologyApi.post('/numero_fav_mantra', params);
  },
  
  // Numerology Fav Time
  async getNumeroFavTime(params) {
    return astrologyApi.post('/numero_fav_time', params);
  },
  
  // Numerology Place Vastu
  async getNumeroPlaceVastu(params) {
    return astrologyApi.post('/numero_place_vastu', params);
  },
  
  // Numerology Fasts Report
  async getNumeroFastsReport(params) {
    return astrologyApi.post('/numero_fasts_report', params);
  },
};

// ============================================
// MUHURTA & AUSPICIOUS TIMINGS
// ============================================
export const muhurtaService = {
  // Auspicious Muhurta for Marriage
  async getMarriageMuhurta(params) {
    return astrologyApi.post('/auspicious_muhurta/marriage', params);
  },
  
  // Chaughadiya Muhurta
  async getChaughadiyaMuhurta(params) {
    return astrologyApi.post('/chaughadiya_muhurta', params);
  },
  
  // Hora Muhurta
  async getHoraMuhurta(params) {
    return astrologyApi.post('/hora_muhurta', params);
  },
  
  // Hora Muhurta Dinman
  async getHoraMuhurtaDinman(params) {
    return astrologyApi.post('/hora_muhurta_dinman', params);
  },
};

// ============================================
// TAROT & PREDICTIONS
// ============================================
export const tarotService = {
  // Tarot Predictions
  async getTarotPredictions(params) {
    return astrologyApi.post('/tarot_predictions', params);
  },
  
  // Yes/No Tarot
  async getYesNoTarot(params) {
    return astrologyApi.post('/yes_no_tarot', params);
  },
};

// ============================================
// DAILY & WEEKLY PREDICTIONS
// ============================================
export const predictionsService = {
  // Daily Horoscope
  async getDailyHoroscope(sign, day = 'today') {
    return astrologyApi.post('/horoscope', { sign, day });
  },
  
  // Daily Nakshatra Prediction
  async getDailyNakshatraPrediction(params) {
    return astrologyApi.post('/daily_nakshatra_prediction', params);
  },
  
  // Next Day Nakshatra Prediction
  async getNextDayNakshatraPrediction(params) {
    return astrologyApi.post('/daily_nakshatra_prediction/next', params);
  },
  
  // Previous Day Nakshatra Prediction
  async getPreviousDayNakshatraPrediction(params) {
    return astrologyApi.post('/daily_nakshatra_prediction/previous', params);
  },
  
  // Daily Nakshatra Consolidated
  async getDailyNakshatraConsolidated(params) {
    return astrologyApi.post('/daily_nakshatra_consolidated', params);
  },
  
  // Personal Day Prediction
  async getPersonalDayPrediction(birthDetails) {
    return astrologyApi.post('/personal_day_prediction', birthDetails);
  },
  
  // Personal Month Prediction
  async getPersonalMonthPrediction(birthDetails) {
    return astrologyApi.post('/personal_month_prediction', birthDetails);
  },
  
  // Personal Year Prediction
  async getPersonalYearPrediction(birthDetails) {
    return astrologyApi.post('/personal_year_prediction', birthDetails);
  },
  
  // Chinese Year Forecast
  async getChineseYearForecast(params) {
    return astrologyApi.post('/chinese_year_forecast', params);
  },
  
  // Chinese Zodiac
  async getChineseZodiac(params) {
    return astrologyApi.post('/chinese_zodiac', params);
  },
  
  // Moon Phase Report
  async getMoonPhaseReport(params) {
    return astrologyApi.post('/moon_phase_report', params);
  },
  
  // Moon Biorhythm
  async getMoonBiorhythm(params) {
    return astrologyApi.post('/moon_biorhythm', params);
  },
  
  // Biorhythm
  async getBiorhythm(params) {
    return astrologyApi.post('/biorhythm', params);
  },
  
  // Lunar Metrics
  async getLunarMetrics(params) {
    return astrologyApi.post('/lunar_metrics', params);
  },
};

// ============================================
// VARSHAPHAL (YEARLY PREDICTIONS)
// ============================================
export const varshaphalService = {
  // Varshaphal Details
  async getVarshaphalDetails(birthDetails) {
    return astrologyApi.post('/varshaphal_details', birthDetails);
  },
  
  // Varshaphal Planets
  async getVarshaphalPlanets(birthDetails) {
    return astrologyApi.post('/varshaphal_planets', birthDetails);
  },
  
  // Varshaphal Year Chart
  async getVarshaphalYearChart(birthDetails) {
    return astrologyApi.post('/varshaphal_year_chart', birthDetails);
  },
  
  // Varshaphal Month Chart
  async getVarshaphalMonthChart(birthDetails) {
    return astrologyApi.post('/varshaphal_month_chart', birthDetails);
  },
  
  // Varshaphal Muntha
  async getVarshaphalMuntha(birthDetails) {
    return astrologyApi.post('/varshaphal_muntha', birthDetails);
  },
  
  // Varshaphal Mudda Dasha
  async getVarshaphalMuddaDasha(birthDetails) {
    return astrologyApi.post('/varshaphal_mudda_dasha', birthDetails);
  },
  
  // Varshaphal Harsha Bala
  async getVarshaphalHarshaBala(birthDetails) {
    return astrologyApi.post('/varshaphal_harsha_bala', birthDetails);
  },
  
  // Varshaphal Panchavargeeya Bala
  async getVarshaphalPanchavargeeyaBala(birthDetails) {
    return astrologyApi.post('/varshaphal_panchavargeeya_bala', birthDetails);
  },
  
  // Varshaphal Saham Points
  async getVarshaphalSahamPoints(birthDetails) {
    return astrologyApi.post('/varshaphal_saham_points', birthDetails);
  },
};

// ============================================
// TRANSITS (GOCHAR)
// ============================================
export const transitService = {
  // Daily Transits
  async getDailyTransits(birthDetails) {
    return astrologyApi.post('/natal_transits/daily', birthDetails);
  },
  
  // Weekly Transits
  async getWeeklyTransits(birthDetails) {
    return astrologyApi.post('/natal_transits/weekly', birthDetails);
  },
  
  // Tropical Daily Transits
  async getTropicalDailyTransits(birthDetails) {
    return astrologyApi.post('/tropical_transits/daily', birthDetails);
  },
  
  // Tropical Weekly Transits
  async getTropicalWeeklyTransits(birthDetails) {
    return astrologyApi.post('/tropical_transits/weekly', birthDetails);
  },
  
  // Tropical Monthly Transits
  async getTropicalMonthlyTransits(birthDetails) {
    return astrologyApi.post('/tropical_transits/monthly', birthDetails);
  },
  
  // Tropical Transits Timing Daily
  async getTropicalTransitsTimingDaily(birthDetails) {
    return astrologyApi.post('/tropical_transits_timing/daily', birthDetails);
  },
  
  // Tropical Transits Timing Monthly
  async getTropicalTransitsTimingMonthly(birthDetails) {
    return astrologyApi.post('/tropical_transits_timing/monthly', birthDetails);
  },
};

// ============================================
// REPORTS & INTERPRETATIONS
// ============================================
export const reportsService = {
  // Natal Chart Interpretation
  async getNatalChartInterpretation(birthDetails) {
    return astrologyApi.post('/natal_chart_interpretation', birthDetails);
  },
  
  // General Ascendant Report
  async getGeneralAscendantReport(birthDetails) {
    return astrologyApi.post('/general_ascendant_report', birthDetails);
  },
  
  // General Ascendant Report Tropical
  async getGeneralAscendantReportTropical(birthDetails) {
    return astrologyApi.post('/general_ascendant_report/tropical', birthDetails);
  },
  
  // General Nakshatra Report
  async getGeneralNakshatraReport(birthDetails) {
    return astrologyApi.post('/general_nakshatra_report', birthDetails);
  },
  
  // General Rashi Report
  async getGeneralRashiReport(planetName, birthDetails) {
    return astrologyApi.post(`/general_rashi_report/${planetName}`, birthDetails);
  },
  
  // General Sign Report Tropical
  async getGeneralSignReportTropical(planetName, birthDetails) {
    return astrologyApi.post(`/general_sign_report/tropical/${planetName}`, birthDetails);
  },
  
  // Personality Report
  async getPersonalityReport(birthDetails) {
    return astrologyApi.post('/personality_report/tropical', birthDetails);
  },
  
  // Life Forecast Report
  async getLifeForecastReport(birthDetails) {
    return astrologyApi.post('/life_forecast_report/tropical', birthDetails);
  },
  
  // Karma Destiny Report
  async getKarmaDestinyReport(birthDetails) {
    return astrologyApi.post('/karma_destiny_report/tropical', birthDetails);
  },
  
  // Friendship Report
  async getFriendshipReport(birthDetails) {
    return astrologyApi.post('/friendship_report/tropical', birthDetails);
  },
};

// ============================================
// SOLAR RETURN
// ============================================
export const solarReturnService = {
  // Solar Return Details
  async getSolarReturnDetails(birthDetails) {
    return astrologyApi.post('/solar_return_details', birthDetails);
  },
  
  // Solar Return Planets
  async getSolarReturnPlanets(birthDetails) {
    return astrologyApi.post('/solar_return_planets', birthDetails);
  },
  
  // Solar Return Planet Report
  async getSolarReturnPlanetReport(birthDetails) {
    return astrologyApi.post('/solar_return_planet_report', birthDetails);
  },
  
  // Solar Return House Cusps
  async getSolarReturnHouseCusps(birthDetails) {
    return astrologyApi.post('/solar_return_house_cusps', birthDetails);
  },
  
  // Solar Return Planet Aspects
  async getSolarReturnPlanetAspects(birthDetails) {
    return astrologyApi.post('/solar_return_planet_aspects', birthDetails);
  },
  
  // Solar Return Aspects Report
  async getSolarReturnAspectsReport(birthDetails) {
    return astrologyApi.post('/solar_return_aspects_report', birthDetails);
  },
};

// ============================================
// KP (KRISHNAMURTI) SYSTEM
// ============================================
export const kpService = {
  // KP Birth Chart
  async getKPBirthChart(birthDetails) {
    return astrologyApi.post('/kp_birth_chart', birthDetails);
  },
  
  // KP Planets
  async getKPPlanets(birthDetails) {
    return astrologyApi.post('/kp_planets', birthDetails);
  },
  
  // KP House Cusps
  async getKPHouseCusps(birthDetails) {
    return astrologyApi.post('/kp_house_cusps', birthDetails);
  },
  
  // KP Planet Significator
  async getKPPlanetSignificator(birthDetails) {
    return astrologyApi.post('/kp_planet_significator', birthDetails);
  },
  
  // KP House Significator
  async getKPHouseSignificator(birthDetails) {
    return astrologyApi.post('/kp_house_significator', birthDetails);
  },
};

// ============================================
// REMEDIES & SUGGESTIONS
// ============================================
export const remediesService = {
  // Basic Gem Suggestion
  async getBasicGemSuggestion(birthDetails) {
    return astrologyApi.post('/basic_gem_suggestion', birthDetails);
  },
  
  // Rudraksha Suggestion
  async getRudrakshaSuggestion(birthDetails) {
    return astrologyApi.post('/rudraksha_suggestion', birthDetails);
  },
  
  // Puja Suggestion
  async getPujaSuggestion(birthDetails) {
    return astrologyApi.post('/puja_suggestion', birthDetails);
  },
};

// ============================================
// CHARTS & IMAGES
// ============================================
export const chartService = {
  // Natal Wheel Chart
  async getNatalWheelChart(birthDetails) {
    return astrologyApi.post('/natal_wheel_chart', birthDetails);
  },
  
  // Horoscope Chart
  async getHoroscopeChart(chartId) {
    return astrologyApi.get(`/horo_chart/${chartId}`);
  },
  
  // Horoscope Chart Image
  async getHoroscopeChartImage(chartId) {
    return astrologyApi.get(`/horo_chart_image/${chartId}`, { responseType: 'blob' });
  },
};

// ============================================
// AYANAMSHA
// ============================================
export const ayanamshaService = {
  // Get Ayanamsha
  async getAyanamsha(date) {
    return astrologyApi.post('/ayanamsha', { date });
  },
};

// ============================================
// JAMINI SYSTEM
// ============================================
export const jaiminiService = {
  // Jaimini Details
  async getJaiminiDetails(birthDetails) {
    return astrologyApi.post('/jaimini_details', birthDetails);
  },
};

// ============================================
// MOON & SOLAR INGRESS
// ============================================
export const ingressService = {
  // Custom Moon Solar Ingress
  async getCustomMoonSolarIngress(params) {
    return astrologyApi.post('/custom_moon_solar_ingress', params);
  },
};

// ============================================
// EXPORT ALL SERVICES
// ============================================
const astrologyServices = {
  panchang: panchangService,
  kundli: kundliService,
  planetary: planetaryService,
  dasha: dashaService,
  matchmaking: matchmakingService,
  dosha: doshaService,
  sadeSati: sadeSatiService,
  lalKitab: lalKitabService,
  numerology: numerologyService,
  muhurta: muhurtaService,
  tarot: tarotService,
  predictions: predictionsService,
  varshaphal: varshaphalService,
  transit: transitService,
  reports: reportsService,
  solarReturn: solarReturnService,
  kp: kpService,
  remedies: remediesService,
  chart: chartService,
  ayanamsha: ayanamshaService,
  jaimini: jaiminiService,
  ingress: ingressService,
};

export default astrologyServices;