// server/services/astrologyAPIService.js
const axios = require('axios');

const callAstrologyAPI = async (endpoint, requestData, pathParams = {}) => {
    const apiKey = process.env.ASTROLOGY_API_KEY;

    if (!apiKey) {
        throw new Error('❌ ASTROLOGY_API_KEY is missing in .env file');
    }

    // Replace path parameters in endpoint
    let finalEndpoint = endpoint;
    for (const [key, value] of Object.entries(pathParams)) {
        finalEndpoint = finalEndpoint.replace(`:${key}`, value);
    }

    const config = {
        method: 'post',
        url: `https://json.astrologyapi.com/v1/${finalEndpoint}`,
        headers: {
            'x-astrologyapi-key': apiKey,
            'Content-Type': 'application/json'
        },
        data: {
            day: requestData.day,
            month: requestData.month,
            year: requestData.year,
            hour: requestData.hour,
            min: requestData.minute,
            lat: requestData.latitude,
            lon: requestData.longitude,
            tzone: requestData.timezone
        }
    };

    // Add optional parameters
    if (requestData.ayanamsa) config.data.ayanamsa = requestData.ayanamsa;
    if (requestData.planet_name) config.data.planet_name = requestData.planet_name;
    if (requestData.dasha_date) config.data.dasha_date = requestData.dasha_date;
    if (requestData.chartType) config.data.chartType = requestData.chartType;
    if (requestData.image_type) config.data.image_type = requestData.image_type;
    if (requestData.planetColor) config.data.planetColor = requestData.planetColor;
    if (requestData.signColor) config.data.signColor = requestData.signColor;
    if (requestData.lineColor) config.data.lineColor = requestData.lineColor;
    if (requestData.name) config.data.name = requestData.name;
    if (requestData.varshphal_year) config.data.varshphal_year = requestData.varshphal_year;

    console.log(`📤 Calling AstrologyAPI: ${finalEndpoint}`);
    const response = await axios(config);
    return response.data;
};

// ============================================
// CORE API FUNCTIONS
// ============================================
const getAstroDetails = async (params) => callAstrologyAPI('astro_details', params);
const getPlanets = async (params) => callAstrologyAPI('planets', params);
const getPlanetsExtended = async (params) => callAstrologyAPI('planets/extended', params);
const getBhavMadhya = async (params) => callAstrologyAPI('bhav_madhya', params);
const getGhatChakra = async (params) => callAstrologyAPI('ghat_chakra', params);
const getAyanamsha = async (params) => callAstrologyAPI('ayanamsha', params);
const getPlanetNature = async (params) => callAstrologyAPI('planet_nature', params);
const getBirthDetails = async (params) => callAstrologyAPI('birth_details', params);

// ============================================
// BIORHYTHM & HOROSCOPE
// ============================================
const getBiorhythm = async (params) => callAstrologyAPI('biorhythm', params);
const getMoonBiorhythm = async (params) => callAstrologyAPI('moon_biorhythm', params);
const getHoroChart = async (params, chartId) => callAstrologyAPI(`horo_chart/${chartId}`, params);
const getHoroChartImage = async (params, chartId) => callAstrologyAPI(`horo_chart_image/${chartId}`, params);
const getPlanetAshtak = async (params, planetName) => callAstrologyAPI(`planet_ashtak/${planetName}`, params);
const getSarvashtak = async (params) => callAstrologyAPI('sarvashtak', params);

// ============================================
// VIMSHOTTARI DASHA
// ============================================
const getCurrentVdashaAll = async (params) => callAstrologyAPI('current_vdasha_all', params);
const getMajorVdasha = async (params) => callAstrologyAPI('major_vdasha', params);
const getCurrentVdasha = async (params) => callAstrologyAPI('current_vdasha', params);
const getCurrentVdashaByDate = async (params) => callAstrologyAPI('current_vdasha_date', params);
const getSubVdasha = async (params, md) => callAstrologyAPI(`sub_vdasha/${md}`, params);
const getSubSubVdasha = async (params, md, ad) => callAstrologyAPI(`sub_sub_vdasha/${md}/${ad}`, params);
const getSubSubSubVdasha = async (params, md, ad, pd) => callAstrologyAPI(`sub_sub_sub_vdasha/${md}/${ad}/${pd}`, params);
const getSubSubSubSubVdasha = async (params, md, ad, pd, sd) => callAstrologyAPI(`sub_sub_sub_sub_vdasha/${md}/${ad}/${pd}/${sd}`, params);

// ============================================
// CHAR DASHA
// ============================================
const getMajorChardasha = async (params) => callAstrologyAPI('major_chardasha', params);
const getCurrentChardasha = async (params) => callAstrologyAPI('current_chardasha', params);
const getSubChardasha = async (params, md) => callAstrologyAPI(`sub_chardasha/${md}`, params);
const getSubSubChardasha = async (params, md, ad) => callAstrologyAPI(`sub_sub_chardasha/${md}/${ad}`, params);

// ============================================
// YOGINI DASHA
// ============================================
const getMajorYoginiDasha = async (params) => callAstrologyAPI('major_yogini_dasha', params);
const getCurrentYoginiDasha = async (params) => callAstrologyAPI('current_yogini_dasha', params);
const getSubYoginiDasha = async (params, dashaCycle, dashaName) =>
    callAstrologyAPI(`sub_yogini_dasha/${dashaCycle}/${dashaName}`, params);

// ============================================
// GENERAL REPORTS
// ============================================
const getGeneralHouseReport = async (params, planetName) =>
    callAstrologyAPI(`general_house_report/${planetName}`, params);
const getGeneralRashiReport = async (params, planetName) =>
    callAstrologyAPI(`general_rashi_report/${planetName}`, params);
const getGeneralAscendantReport = async (params) =>
    callAstrologyAPI('general_ascendant_report', params);
const getGeneralNakshatraReport = async (params) =>
    callAstrologyAPI('general_nakshatra_report', params);

// ============================================
// LAL KITAB
// ============================================
const getLalkitabHoroscope = async (params) => callAstrologyAPI('lalkitab_horoscope', params);
const getLalkitabDebts = async (params) => callAstrologyAPI('lalkitab_debts', params);
const getLalkitabRemedies = async (params, planetName) =>
    callAstrologyAPI(`lalkitab_remedies/${planetName}`, params);
const getLalkitabHouses = async (params) => callAstrologyAPI('lalkitab_houses', params);
const getLalkitabPlanets = async (params) => callAstrologyAPI('lalkitab_planets', params);

// ============================================
// NAKSHATRA PREDICTIONS
// ============================================
const getDailyNakshatraPrediction = async (params) =>
    callAstrologyAPI('daily_nakshatra_prediction', params);
const getNextDayNakshatraPrediction = async (params) =>
    callAstrologyAPI('daily_nakshatra_prediction/next', params);
const getPreviousDayNakshatraPrediction = async (params) =>
    callAstrologyAPI('daily_nakshatra_prediction/previous', params);
const getDailyNakshatraConsolidated = async (params) =>
    callAstrologyAPI('daily_nakshatra_consolidated', params);

// ============================================
// PANCHANG & MUHURTA
// ============================================
const getBasicPanchangSunrise = async (params) => callAstrologyAPI('basic_panchang/sunrise', params);
const getBasicPanchang = async (params) => callAstrologyAPI('basic_panchang', params);
const getAdvancedPanchangSunrise = async (params) => callAstrologyAPI('advanced_panchang/sunrise', params);
const getAdvancedPanchang = async (params) => callAstrologyAPI('advanced_panchang', params);
const getPlanetPanchang = async (params) => callAstrologyAPI('planet_panchang', params);
const getChaughadiyaMuhurta = async (params) => callAstrologyAPI('chaughadiya_muhurta', params);
const getHoraMuhurtaDinman = async (params) => callAstrologyAPI('hora_muhurta_dinman', params);
const getPanchangChart = async (params) => callAstrologyAPI('panchang_chart', params);
const getPanchangChartSunrise = async (params) => callAstrologyAPI('panchang_chart/sunrise', params);
const getTamilMonthPanchang = async (params) => callAstrologyAPI('tamil_month_panchang', params);
const getTamilPanchang = async (params) => callAstrologyAPI('tamil_panchang', params);
const getPanchangFestival = async (params) => callAstrologyAPI('panchang_festival', params);

// ============================================
// NUMEROLOGY
// ============================================
const getNumeroTable = async (params) => callAstrologyAPI('numero_table', params);
const getNumeroReport = async (params) => callAstrologyAPI('numero_report', params);
const getNumeroFavTime = async (params) => callAstrologyAPI('numero_fav_time', params);
const getNumeroPlaceVastu = async (params) => callAstrologyAPI('numero_place_vastu', params);
const getNumeroFastsReport = async (params) => callAstrologyAPI('numero_fasts_report', params);
const getNumeroFavLord = async (params) => callAstrologyAPI('numero_fav_lord', params);
const getNumeroFavMantra = async (params) => callAstrologyAPI('numero_fav_mantra', params);
const getNumeroPredictionDaily = async (params) => callAstrologyAPI('numero_prediction/daily', params);

// ============================================
// DOSHA & YOGA
// ============================================
const getSimpleManglik = async (params) => callAstrologyAPI('simple_manglik', params);
const getManglik = async (params) => callAstrologyAPI('manglik', params);
const getKalsarpaDetails = async (params) => callAstrologyAPI('kalsarpa_details', params);
const getSadeSatiCurrentStatus = async (params) => callAstrologyAPI('sadhesati_current_status', params);
const getSadeSatiLifeDetails = async (params) => callAstrologyAPI('sadhesati_life_details', params);
const getPitraDoshaReport = async (params) => callAstrologyAPI('pitra_dosha_report', params);

// ============================================
// VARSHAPHAL (Yearly Predictions)
// ============================================
const getVarshaphalYearChart = async (params) => callAstrologyAPI('varshaphal_year_chart', params);
const getVarshaphalMonthChart = async (params) => callAstrologyAPI('varshaphal_month_chart', params);
const getVarshaphalDetails = async (params) => callAstrologyAPI('varshaphal_details', params);
const getVarshaphalPlanets = async (params) => callAstrologyAPI('varshaphal_planets', params);
const getVarshaphalMuntha = async (params) => callAstrologyAPI('varshaphal_muntha', params);
const getVarshaphalMuddaDasha = async (params) => callAstrologyAPI('varshaphal_mudda_dasha', params);
const getVarshaphalPanchavargeeyaBala = async (params) => callAstrologyAPI('varshaphal_panchavargeeya_bala', params);
const getVarshaphalSahamPoints = async (params) => callAstrologyAPI('varshaphal_saham_points', params);
const getVarshaphalYoga = async (params) => callAstrologyAPI('varshaphal_yoga', params);

// ============================================
// KP (KRISHNAMURTI) SYSTEM
// ============================================
const getKpPlanets = async (params) => callAstrologyAPI('kp_planets', params);
const getKpHouseCusps = async (params) => callAstrologyAPI('kp_house_cusps', params);
const getKpBirthChart = async (params) => callAstrologyAPI('kp_birth_chart', params);
const getKpHouseSignificator = async (params) => callAstrologyAPI('kp_house_significator', params);
const getKpPlanetSignificator = async (params) => callAstrologyAPI('kp_planet_significator', params);

// ============================================
// MATCHMAKING
// ============================================
const getMatchBirthDetails = async (params) => callAstrologyAPI('match_birth_details', params);
const getMatchAshtakootPoints = async (params) => callAstrologyAPI('match_ashtakoot_points', params);
const getMatchObstructions = async (params) => callAstrologyAPI('match_obstructions', params);
const getMatchAstroDetails = async (params) => callAstrologyAPI('match_astro_details', params);
const getMatchPlanetDetails = async (params) => callAstrologyAPI('match_planet_details', params);
const getMatchManglikReport = async (params) => callAstrologyAPI('match_manglik_report', params);
const getMatchMakingReport = async (params) => callAstrologyAPI('match_making_report', params);
const getMatchMakingDetailedReport = async (params) => callAstrologyAPI('match_making_detailed_report', params);
const getMatchDashakootPoints = async (params) => callAstrologyAPI('match_dashakoot_points', params);
const getMatchPercentage = async (params) => callAstrologyAPI('match_percentage', params);

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
    // Core
    callAstrologyAPI,
    getAstroDetails,
    getPlanets,
    getPlanetsExtended,
    getBhavMadhya,
    getGhatChakra,
    getAyanamsha,
    getPlanetNature,
    getBirthDetails,
    
    // Biorhythm & Horoscope
    getBiorhythm,
    getMoonBiorhythm,
    getHoroChart,
    getHoroChartImage,
    getPlanetAshtak,
    getSarvashtak,
    
    // Vimshottari Dasha
    getCurrentVdashaAll,
    getMajorVdasha,
    getCurrentVdasha,
    getCurrentVdashaByDate,
    getSubVdasha,
    getSubSubVdasha,
    getSubSubSubVdasha,
    getSubSubSubSubVdasha,
    
    // Char Dasha
    getMajorChardasha,
    getCurrentChardasha,
    getSubChardasha,
    getSubSubChardasha,
    
    // Yogini Dasha
    getMajorYoginiDasha,
    getCurrentYoginiDasha,
    getSubYoginiDasha,
    
    // General Reports
    getGeneralHouseReport,
    getGeneralRashiReport,
    getGeneralAscendantReport,
    getGeneralNakshatraReport,
    
    // Lal Kitab
    getLalkitabHoroscope,
    getLalkitabDebts,
    getLalkitabRemedies,
    getLalkitabHouses,
    getLalkitabPlanets,
    
    // Nakshatra Predictions
    getDailyNakshatraPrediction,
    getNextDayNakshatraPrediction,
    getPreviousDayNakshatraPrediction,
    getDailyNakshatraConsolidated,
    
    // Panchang & Muhurta
    getBasicPanchangSunrise,
    getBasicPanchang,
    getAdvancedPanchangSunrise,
    getAdvancedPanchang,
    getPlanetPanchang,
    getChaughadiyaMuhurta,
    getHoraMuhurtaDinman,
    getPanchangChart,
    getPanchangChartSunrise,
    getTamilMonthPanchang,
    getTamilPanchang,
    getPanchangFestival,
    
    // Numerology
    getNumeroTable,
    getNumeroReport,
    getNumeroFavTime,
    getNumeroPlaceVastu,
    getNumeroFastsReport,
    getNumeroFavLord,
    getNumeroFavMantra,
    getNumeroPredictionDaily,
    
    // Dosha & Yoga
    getSimpleManglik,
    getManglik,
    getKalsarpaDetails,
    getSadeSatiCurrentStatus,
    getSadeSatiLifeDetails,
    getPitraDoshaReport,
    
    // Varshaphal
    getVarshaphalYearChart,
    getVarshaphalMonthChart,
    getVarshaphalDetails,
    getVarshaphalPlanets,
    getVarshaphalMuntha,
    getVarshaphalMuddaDasha,
    getVarshaphalPanchavargeeyaBala,
    getVarshaphalSahamPoints,
    getVarshaphalYoga,
    
    // KP System
    getKpPlanets,
    getKpHouseCusps,
    getKpBirthChart,
    getKpHouseSignificator,
    getKpPlanetSignificator,
    
    // Matchmaking
    getMatchBirthDetails,
    getMatchAshtakootPoints,
    getMatchObstructions,
    getMatchAstroDetails,
    getMatchPlanetDetails,
    getMatchManglikReport,
    getMatchMakingReport,
    getMatchMakingDetailedReport,
    getMatchDashakootPoints,
    getMatchPercentage
};