// server/routes/astrologyRoutes.js
import express from 'express';
// import {
//     getGeoDetails,
//     getBirthDetailsData,
//     getAstroDetailsData,
//     getPlanetsData,
//     getPlanetsExtendedData,
//     getBhavMadhyaData,
//     getGhatChakraData,
//     getAyanamshaData,
//     getPlanetNatureData,
//     getMatchmakingData,
//     getBiorhythmData,
//     getMoonBiorhythmData,
//     getHoroChartData,
//     getHoroChartImageData,
//     getPlanetAshtakData,
//     getSarvashtakData,
//     getCurrentVdashaAllData,
//     getMajorVdashaData,
//     getCurrentVdashaData,
//     getCurrentVdashaByDateData,
//     getSubVdashaData,
//     getSubSubVdashaData,
//     getSubSubSubVdashaData,
//     getSubSubSubSubVdashaData,
//     getMajorChardashaData,
//     getCurrentChardashaData,
//     getSubChardashaData,
//     getSubSubChardashaData,
//     getMajorYoginiDashaData,
//     getCurrentYoginiDashaData,
//     getSubYoginiDashaData,
//     getGeneralHouseReportData,
//     getGeneralRashiReportData,
//     getGeneralAscendantReportData,
//     getGeneralNakshatraReportData,
//     getLalkitabHoroscopeData,
//     getLalkitabDebtsData,
//     getLalkitabRemediesData,
//     getLalkitabHousesData,
//     getLalkitabPlanetsData,
//     getDailyNakshatraPredictionData,
//     getNextDayNakshatraPredictionData,
//     getPreviousDayNakshatraPredictionData,
//     getDailyNakshatraConsolidatedData,
//     getBasicPanchangSunriseData,
//     getBasicPanchangData,
//     getAdvancedPanchangSunriseData,
//     getPlanetPanchangData,
//     getChaughadiyaMuhurtaData,
//     getHoraMuhurtaDinmanData,
//     getPanchangChartData,
//     getPanchangChartSunriseData,
//     getTamilMonthPanchangData,
//     getTamilPanchangData,
//     getPanchangFestivalData,
//     getNumeroTableData,
//     getNumeroReportData,
//     getNumeroFavTimeData,
//     getNumeroPlaceVastuData,
//     getNumeroFastsReportData,
//     getNumeroFavLordData,
//     getNumeroFavMantraData,
//     getNumeroPredictionDailyData,
//     getSimpleManglikData,
//     getManglikData,
//     getKalsarpaDetailsData,
//     getSadeSatiCurrentStatusData,
//     getSadeSatiLifeDetailsData,
//     getPitraDoshaReportData,
//     getVarshaphalYearChartData,
//     getVarshaphalMonthChartData,
//     getVarshaphalDetailsData,
//     getVarshaphalPlanetsData,
//     getVarshaphalMunthaData,
//     getVarshaphalMuddaDashaData,
//     getVarshaphalPanchavargeeyaBalaData,
//     getVarshaphalSahamPointsData,
//     getVarshaphalYogaData,
//     getKpPlanetsData,
//     getKpHouseCuspsData,
//     getKpBirthChartData,
//     getKpHouseSignificatorData,
//     getKpPlanetSignificatorData,
//     getMatchBirthDetailsData,
//     getMatchAshtakootPointsData,
//     getMatchObstructionsData,
//     getMatchAstroDetailsData,
//     getMatchPlanetDetailsData,
//     getMatchManglikReportData,
//     getMatchMakingReportData,
//     getMatchMakingDetailedReportData,
//     getMatchDashakootPointsData,
//     getMatchPercentageData,
//     getDailyHoroscopeData
// } from '../services/astrologyService.js';

import astrologyRoutes from './routes/astrologyRoutes.js';
const router = express.Router();

// ============================================
// CORE ENDPOINTS (✅ হাইফেন পাল্টে আন্ডারস্কোর করা হলো)
// ============================================
router.post('/birth_details', async (req, res) => {
    try {
        const result = await getBirthDetailsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/astro_details', async (req, res) => {
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

router.post('/bhav_madhya', async (req, res) => {
    try {
        const result = await getBhavMadhyaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/ghat_chakra', async (req, res) => {
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

router.post('/planet_nature', async (req, res) => {
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

router.post('/geo_details', async (req, res) => {
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

router.post('/moon_biorhythm', async (req, res) => {
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
router.post('/horo_chart/:chartId', async (req, res) => {
    try {
        const { chartId } = req.params;
        const result = await getHoroChartData(req.body, chartId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/horo_chart_image/:chartId', async (req, res) => {
    try {
        const { chartId } = req.params;
        const result = await getHoroChartImageData(req.body, chartId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// PLANET ASHTAK AND SARVASHTAK
// ============================================
router.post('/planet_ashtak/:planetName', async (req, res) => {
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
router.post('/current_vdasha_all', async (req, res) => {
    try {
        const result = await getCurrentVdashaAllData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/major_vdasha', async (req, res) => {
    try {
        const result = await getMajorVdashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/current_vdasha', async (req, res) => {
    try {
        const result = await getCurrentVdashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/current_vdasha_date', async (req, res) => {
    try {
        const result = await getCurrentVdashaByDateData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub_vdasha/:md', async (req, res) => {
    try {
        const { md } = req.params;
        const result = await getSubVdashaData(req.body, md);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub_sub_vdasha/:md/:ad', async (req, res) => {
    try {
        const { md, ad } = req.params;
        const result = await getSubSubVdashaData(req.body, md, ad);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub_sub_sub_vdasha/:md/:ad/:pd', async (req, res) => {
    try {
        const { md, ad, pd } = req.params;
        const result = await getSubSubSubVdashaData(req.body, md, ad, pd);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub_sub_sub_sub_vdasha/:md/:ad/:pd/:sd', async (req, res) => {
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
router.post('/major_chardasha', async (req, res) => {
    try {
        const result = await getMajorChardashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/current_chardasha', async (req, res) => {
    try {
        const result = await getCurrentChardashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub_chardasha/:md', async (req, res) => {
    try {
        const { md } = req.params;
        const result = await getSubChardashaData(req.body, md);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub_sub_chardasha/:md/:ad', async (req, res) => {
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
router.post('/major_yogini_dasha', async (req, res) => {
    try {
        const result = await getMajorYoginiDashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/current_yogini_dasha', async (req, res) => {
    try {
        const result = await getCurrentYoginiDashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sub_yogini_dasha/:dashaCycle/:dashaName', async (req, res) => {
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
router.post('/general_house_report/:planetName', async (req, res) => {
    try {
        const { planetName } = req.params;
        const result = await getGeneralHouseReportData(req.body, planetName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/general_rashi_report/:planetName', async (req, res) => {
    try {
        const { planetName } = req.params;
        const result = await getGeneralRashiReportData(req.body, planetName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/general_ascendant_report', async (req, res) => {
    try {
        const result = await getGeneralAscendantReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/general_nakshatra_report', async (req, res) => {
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
router.post('/lalkitab_horoscope', async (req, res) => {
    try {
        const result = await getLalkitabHoroscopeData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/lalkitab_debts', async (req, res) => {
    try {
        const result = await getLalkitabDebtsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/lalkitab_remedies/:planetName', async (req, res) => {
    try {
        const { planetName } = req.params;
        const result = await getLalkitabRemediesData(req.body, planetName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/lalkitab_houses', async (req, res) => {
    try {
        const result = await getLalkitabHousesData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/lalkitab_planets', async (req, res) => {
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
router.post('/daily_nakshatra_prediction', async (req, res) => {
    try {
        const result = await getDailyNakshatraPredictionData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/next_day_nakshatra_prediction', async (req, res) => {
    try {
        const result = await getNextDayNakshatraPredictionData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/previous_day_nakshatra_prediction', async (req, res) => {
    try {
        const result = await getPreviousDayNakshatraPredictionData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/daily_nakshatra_consolidated', async (req, res) => {
    try {
        const result = await getDailyNakshatraConsolidatedData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// PANCHANG AND MUHURTA ENDPOINTS
// ============================================
router.post('/basic_panchang_sunrise', async (req, res) => {
    try {
        const result = await getBasicPanchangSunriseData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/basic_panchang', async (req, res) => {
    try {
        const result = await getBasicPanchangData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/advanced_panchang_sunrise', async (req, res) => {
    try {
        const result = await getAdvancedPanchangSunriseData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/advanced_panchang', async (req, res) => {
    try {
        const result = await getAdvancedPanchangData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/planet_panchang', async (req, res) => {
    try {
        const result = await getPlanetPanchangData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/chaughadiya_muhurta', async (req, res) => {
    try {
        const result = await getChaughadiyaMuhurtaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/hora_muhurta_dinman', async (req, res) => {
    try {
        const result = await getHoraMuhurtaDinmanData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/panchang_chart', async (req, res) => {
    try {
        const result = await getPanchangChartData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/panchang_chart_sunrise', async (req, res) => {
    try {
        const result = await getPanchangChartSunriseData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/tamil_month_panchang', async (req, res) => {
    try {
        const result = await getTamilMonthPanchangData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/tamil_panchang', async (req, res) => {
    try {
        const result = await getTamilPanchangData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/panchang_festival', async (req, res) => {
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
router.post('/numero_table', async (req, res) => {
    try {
        const result = await getNumeroTableData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero_report', async (req, res) => {
    try {
        const result = await getNumeroReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero_fav_time', async (req, res) => {
    try {
        const result = await getNumeroFavTimeData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero_place_vastu', async (req, res) => {
    try {
        const result = await getNumeroPlaceVastuData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero_fasts_report', async (req, res) => {
    try {
        const result = await getNumeroFastsReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero_fav_lord', async (req, res) => {
    try {
        const result = await getNumeroFavLordData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero_fav_mantra', async (req, res) => {
    try {
        const result = await getNumeroFavMantraData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/numero_prediction_daily', async (req, res) => {
    try {
        const result = await getNumeroPredictionDailyData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// DOSHA AND YOGA ENDPOINTS
// ============================================
router.post('/simple_manglik', async (req, res) => {
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

router.post('/kalsarpa_details', async (req, res) => {
    try {
        const result = await getKalsarpaDetailsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sade_sati_current_status', async (req, res) => {
    try {
        const result = await getSadeSatiCurrentStatusData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sade_sati_life_details', async (req, res) => {
    try {
        const result = await getSadeSatiLifeDetailsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/pitra_dosha_report', async (req, res) => {
    try {
        const result = await getPitraDoshaReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// VARSHAPHAL ENDPOINTS
// ============================================
router.post('/varshaphal_year_chart', async (req, res) => {
    try {
        const result = await getVarshaphalYearChartData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/varshaphal_month_chart', async (req, res) => {
    try {
        const result = await getVarshaphalMonthChartData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/varshaphal_details', async (req, res) => {
    try {
        const result = await getVarshaphalDetailsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/varshaphal_planets', async (req, res) => {
    try {
        const result = await getVarshaphalPlanetsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/varshaphal_muntha', async (req, res) => {
    try {
        const result = await getVarshaphalMunthaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/varshaphal_mudda_dasha', async (req, res) => {
    try {
        const result = await getVarshaphalMuddaDashaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/varshaphal_panchavargeeya_bala', async (req, res) => {
    try {
        const result = await getVarshaphalPanchavargeeyaBalaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/varshaphal_saham_points', async (req, res) => {
    try {
        const result = await getVarshaphalSahamPointsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/varshaphal_yoga', async (req, res) => {
    try {
        const result = await getVarshaphalYogaData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// KP SYSTEM ENDPOINTS
// ============================================
router.post('/kp_planets', async (req, res) => {
    try {
        const result = await getKpPlanetsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/kp_house_cusps', async (req, res) => {
    try {
        const result = await getKpHouseCuspsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/kp_birth_chart', async (req, res) => {
    try {
        const result = await getKpBirthChartData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/kp_house_significator', async (req, res) => {
    try {
        const result = await getKpHouseSignificatorData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/kp_planet_significator', async (req, res) => {
    try {
        const result = await getKpPlanetSignificatorData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// MATCHMAKING ENDPOINTS
// ============================================
router.post('/match_birth_details', async (req, res) => {
    try {
        const result = await getMatchBirthDetailsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/match_ashtakoot_points', async (req, res) => {
    try {
        const result = await getMatchAshtakootPointsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/match_obstructions', async (req, res) => {
    try {
        const result = await getMatchObstructionsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/match_astro_details', async (req, res) => {
    try {
        const result = await getMatchAstroDetailsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/match_planet_details', async (req, res) => {
    try {
        const result = await getMatchPlanetDetailsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/match_manglik_report', async (req, res) => {
    try {
        const result = await getMatchManglikReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/match_making_report', async (req, res) => {
    try {
        const result = await getMatchMakingReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/match_making_detailed_report', async (req, res) => {
    try {
        const result = await getMatchMakingDetailedReportData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/match_dashakoot_points', async (req, res) => {
    try {
        const result = await getMatchDashakootPointsData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/match_percentage', async (req, res) => {
    try {
        const result = await getMatchPercentageData(req.body);
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
        message: 'Astrology API is running successfully'
    });
});

// Daily Horoscope endpoint
router.post('/daily_horoscope', async (req, res) => {
    try {
        const { sign, day, month, year } = req.body;
        const result = await getDailyHoroscopeData(sign, day || 12, month || 5, year || 2024);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;