// server/routes/astrologyRoutes.js
const express = require('express');
const router = express.Router();
const {
    // Core Services
    getGeoDetails,
    getBirthDetailsData,
    getAstroDetailsData,
    getPlanetsData,
    getPlanetsExtendedData,
    getBhavMadhyaData,
    getGhatChakraData,
    getAyanamshaData,
    getPlanetNatureData,
    getMatchmakingData,
    
    // Biorhythm
    getBiorhythmData,
    getMoonBiorhythmData,
    
    // Horo Chart
    getHoroChartData,
    getHoroChartImageData,
    
    // Planet Ashtak & Sarvashtak
    getPlanetAshtakData,
    getSarvashtakData,
    
    // Vimshottari Dasha
    getCurrentVdashaAllData,
    getMajorVdashaData,
    getCurrentVdashaData,
    getCurrentVdashaByDateData,
    getSubVdashaData,
    getSubSubVdashaData,
    getSubSubSubVdashaData,
    getSubSubSubSubVdashaData,
    
    // Chardasha
    getMajorChardashaData,
    getCurrentChardashaData,
    getSubChardashaData,
    getSubSubChardashaData,
    
    // Yogini Dasha
    getMajorYoginiDashaData,
    getCurrentYoginiDashaData,
    getSubYoginiDashaData,
    
    // General Reports
    getGeneralHouseReportData,
    getGeneralRashiReportData,
    getGeneralAscendantReportData,
    getGeneralNakshatraReportData,
    
    // Lal Kitab
    getLalkitabHoroscopeData,
    getLalkitabDebtsData,
    getLalkitabRemediesData,
    getLalkitabHousesData,
    getLalkitabPlanetsData,
    
    // Nakshatra Predictions
    getDailyNakshatraPredictionData,
    getNextDayNakshatraPredictionData,
    getPreviousDayNakshatraPredictionData,
    getDailyNakshatraConsolidatedData,
    
    // Panchang & Muhurta
    getBasicPanchangSunriseData,
    getBasicPanchangData,
    getAdvancedPanchangSunriseData,
    getAdvancedPanchangData,
    getPlanetPanchangData,
    getChaughadiyaMuhurtaData,
    getHoraMuhurtaDinmanData,
    getPanchangChartData,
    getPanchangChartSunriseData,
    getTamilMonthPanchangData,
    getTamilPanchangData,
    getPanchangFestivalData,
    
    // Numerology
    getNumeroTableData,
    getNumeroReportData,
    getNumeroFavTimeData,
    getNumeroPlaceVastuData,
    getNumeroFastsReportData,
    getNumeroFavLordData,
    getNumeroFavMantraData,
    getNumeroPredictionDailyData,
    
    // Dosha & Yoga
    getSimpleManglikData,
    getManglikData,
    getKalsarpaDetailsData,
    getSadeSatiCurrentStatusData,
    getSadeSatiLifeDetailsData,
    getPitraDoshaReportData,

    // Varshaphal
    getVarshaphalYearChartData,
    getVarshaphalMonthChartData,
    getVarshaphalDetailsData,
    getVarshaphalPlanetsData,
    getVarshaphalMunthaData,
    getVarshaphalMuddaDashaData,
    getVarshaphalPanchavargeeyaBalaData,
    getVarshaphalSahamPointsData,
    getVarshaphalYogaData,

    // KP System
    getKpPlanetsData,
    getKpHouseCuspsData,
    getKpBirthChartData,
    getKpHouseSignificatorData,
    getKpPlanetSignificatorData,

    // Matchmaking
    getMatchBirthDetailsData,
    getMatchAshtakootPointsData,
    getMatchObstructionsData,
    getMatchAstroDetailsData,
    getMatchPlanetDetailsData,
    getMatchManglikReportData,
    getMatchMakingReportData,
    getMatchMakingDetailedReportData,
    getMatchDashakootPointsData,
    getMatchPercentageData,

    // Daily Horoscope
    getDailyHoroscopeData
} from '../services/astrologyService.js';

const router = express.Router();

// ============================================
// CORE ENDPOINTS
// ============================================
router.post('/birth-details', async (req, res) => {
    try {
        const result = await getBirthDetailsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/astro-details', async (req, res) => {
    try {
        const result = await getAstroDetailsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/planets', async (req, res) => {
    try {
        const result = await getPlanetsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/planets/extended', async (req, res) => {
    try {
        const result = await getPlanetsExtendedData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/bhav-madhya', async (req, res) => {
    try {
        const result = await getBhavMadhyaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/ghat-chakra', async (req, res) => {
    try {
        const result = await getGhatChakraData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/ayanamsha', async (req, res) => {
    try {
        const result = await getAyanamshaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/planet-nature', async (req, res) => {
    try {
        const result = await getPlanetNatureData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/matchmaking', async (req, res) => {
    try {
        const result = await getMatchmakingData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/geo-details', async (req, res) => {
    try {
        const { place } = req.body;
        if (!place) {
            return res.status(400).json({ success: false, error: 'Place name is required' });
        }
        const result = await getGeoDetails(place);
        res.json(result);
    } catch (error) {
        console.error('❌ Geo details error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// BIORHYTHM ENDPOINTS
// ============================================
router.post('/biorhythm', async (req, res) => {
    try {
        const result = await getBiorhythmData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/moon-biorhythm', async (req, res) => {
    try {
        const result = await getMoonBiorhythmData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// HOROSCOPE CHART ENDPOINTS
// ============================================
router.post('/horo-chart/:chartId', async (req, res) => {
    try {
        const { chartId } = req.params;
        const result = await getHoroChartData(req.body, chartId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/horo-chart-image/:chartId', async (req, res) => {
    try {
        const { chartId } = req.params;
        const result = await getHoroChartImageData(req.body, chartId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// PLANET ASHTAK & SARVASHTAK
// ============================================
router.post('/planet-ashtak/:planetName', async (req, res) => {
    try {
        const { planetName } = req.params;
        const result = await getPlanetAshtakData(req.body, planetName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sarvashtak', async (req, res) => {
    try {
        const result = await getSarvashtakData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// VIMSHOTTARI DASHA ENDPOINTS
// ============================================
router.post('/current-vdasha-all', async (req, res) => {
    try {
        const result = await getCurrentVdashaAllData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/major-vdasha', async (req, res) => {
    try {
        const result = await getMajorVdashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/current-vdasha', async (req, res) => {
    try {
        const result = await getCurrentVdashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/current-vdasha-date', async (req, res) => {
    try {
        const result = await getCurrentVdashaByDateData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub-vdasha/:md', async (req, res) => {
    try {
        const { md } = req.params;
        const result = await getSubVdashaData(req.body, md);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub-sub-vdasha/:md/:ad', async (req, res) => {
    try {
        const { md, ad } = req.params;
        const result = await getSubSubVdashaData(req.body, md, ad);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub-sub-sub-vdasha/:md/:ad/:pd', async (req, res) => {
    try {
        const { md, ad, pd } = req.params;
        const result = await getSubSubSubVdashaData(req.body, md, ad, pd);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub-sub-sub-sub-vdasha/:md/:ad/:pd/:sd', async (req, res) => {
    try {
        const { md, ad, pd, sd } = req.params;
        const result = await getSubSubSubSubVdashaData(req.body, md, ad, pd, sd);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// CHAR DASHA ENDPOINTS
// ============================================
router.post('/major-chardasha', async (req, res) => {
    try {
        const result = await getMajorChardashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/current-chardasha', async (req, res) => {
    try {
        const result = await getCurrentChardashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub-chardasha/:md', async (req, res) => {
    try {
        const { md } = req.params;
        const result = await getSubChardashaData(req.body, md);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub-sub-chardasha/:md/:ad', async (req, res) => {
    try {
        const { md, ad } = req.params;
        const result = await getSubSubChardashaData(req.body, md, ad);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// YOGINI DASHA ENDPOINTS
// ============================================
router.post('/major-yogini-dasha', async (req, res) => {
    try {
        const result = await getMajorYoginiDashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/current-yogini-dasha', async (req, res) => {
    try {
        const result = await getCurrentYoginiDashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub-yogini-dasha/:dashaCycle/:dashaName', async (req, res) => {
    try {
        const { dashaCycle, dashaName } = req.params;
        const result = await getSubYoginiDashaData(req.body, dashaCycle, dashaName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// GENERAL REPORT ENDPOINTS
// ============================================
router.post('/general-house-report/:planetName', async (req, res) => {
    try {
        const { planetName } = req.params;
        const result = await getGeneralHouseReportData(req.body, planetName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/general-rashi-report/:planetName', async (req, res) => {
    try {
        const { planetName } = req.params;
        const result = await getGeneralRashiReportData(req.body, planetName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/general-ascendant-report', async (req, res) => {
    try {
        const result = await getGeneralAscendantReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/general-nakshatra-report', async (req, res) => {
    try {
        const result = await getGeneralNakshatraReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// LAL KITAB ENDPOINTS
// ============================================
router.post('/lalkitab-horoscope', async (req, res) => {
    try {
        const result = await getLalkitabHoroscopeData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/lalkitab-debts', async (req, res) => {
    try {
        const result = await getLalkitabDebtsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/lalkitab-remedies/:planetName', async (req, res) => {
    try {
        const { planetName } = req.params;
        const result = await getLalkitabRemediesData(req.body, planetName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/lalkitab-houses', async (req, res) => {
    try {
        const result = await getLalkitabHousesData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/lalkitab-planets', async (req, res) => {
    try {
        const result = await getLalkitabPlanetsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// NAKSHATRA PREDICTION ENDPOINTS
// ============================================
router.post('/daily-nakshatra-prediction', async (req, res) => {
    try {
        const result = await getDailyNakshatraPredictionData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/next-day-nakshatra-prediction', async (req, res) => {
    try {
        const result = await getNextDayNakshatraPredictionData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/previous-day-nakshatra-prediction', async (req, res) => {
    try {
        const result = await getPreviousDayNakshatraPredictionData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/daily-nakshatra-consolidated', async (req, res) => {
    try {
        const result = await getDailyNakshatraConsolidatedData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// PANCHANG & MUHURTA ENDPOINTS
// ============================================
router.post('/basic-panchang-sunrise', async (req, res) => {
    try {
        const result = await getBasicPanchangSunriseData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/basic-panchang', async (req, res) => {
    try {
        const result = await getBasicPanchangData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/advanced-panchang-sunrise', async (req, res) => {
    try {
        const result = await getAdvancedPanchangSunriseData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/advanced-panchang', async (req, res) => {
    try {
        const result = await getAdvancedPanchangData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/planet-panchang', async (req, res) => {
    try {
        const result = await getPlanetPanchangData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/chaughadiya-muhurta', async (req, res) => {
    try {
        const result = await getChaughadiyaMuhurtaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/hora-muhurta-dinman', async (req, res) => {
    try {
        const result = await getHoraMuhurtaDinmanData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/panchang-chart', async (req, res) => {
    try {
        const result = await getPanchangChartData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/panchang-chart-sunrise', async (req, res) => {
    try {
        const result = await getPanchangChartSunriseData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/tamil-month-panchang', async (req, res) => {
    try {
        const result = await getTamilMonthPanchangData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/tamil-panchang', async (req, res) => {
    try {
        const result = await getTamilPanchangData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/panchang-festival', async (req, res) => {
    try {
        const result = await getPanchangFestivalData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// NUMEROLOGY ENDPOINTS
// ============================================
router.post('/numero-table', async (req, res) => {
    try {
        const result = await getNumeroTableData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero-report', async (req, res) => {
    try {
        const result = await getNumeroReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero-fav-time', async (req, res) => {
    try {
        const result = await getNumeroFavTimeData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero-place-vastu', async (req, res) => {
    try {
        const result = await getNumeroPlaceVastuData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero-fasts-report', async (req, res) => {
    try {
        const result = await getNumeroFastsReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero-fav-lord', async (req, res) => {
    try {
        const result = await getNumeroFavLordData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero-fav-mantra', async (req, res) => {
    try {
        const result = await getNumeroFavMantraData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero-prediction-daily', async (req, res) => {
    try {
        const result = await getNumeroPredictionDailyData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// DOSHA & YOGA ENDPOINTS
// ============================================
router.post('/simple-manglik', async (req, res) => {
    try {
        const result = await getSimpleManglikData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/manglik', async (req, res) => {
    try {
        const result = await getManglikData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/kalsarpa-details', async (req, res) => {
    try {
        const result = await getKalsarpaDetailsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sade-sati-current-status', async (req, res) => {
    try {
        const result = await getSadeSatiCurrentStatusData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sade-sati-life-details', async (req, res) => {
    try {
        const result = await getSadeSatiLifeDetailsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/pitra-dosha-report', async (req, res) => {
    try {
        const result = await getPitraDoshaReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        total_endpoints: 70,
        message: 'Astrology API is running successfully'
    });
});

module.exports = router;