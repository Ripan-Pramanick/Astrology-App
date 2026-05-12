// server/services/astrologyService.js
import axios from 'axios';
import { 
    // Core APIs
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
} from './astrologyAPIService.js';

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

// ============================================
// GEO LOCATION SERVICE
// ============================================
const getGeoDetails = async (placeName) => {
    if (!OPENCAGE_API_KEY) {
        throw new Error('❌ OPENCAGE_API_KEY is missing in .env file');
    }
    
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(placeName)}&key=${OPENCAGE_API_KEY}&limit=5`);
    const data = response.data;

    if (!data || !data.results || data.results.length === 0) {
        throw new Error(`No location found for: ${placeName}`);
    }

    return {
        success: true,
        geonames: data.results.map(item => ({
            place_name: item.formatted,
            latitude: item.geometry.lat.toString(),
            longitude: item.geometry.lng.toString(),
            timezone: (item.annotations.timezone.offset_sec / 3600).toString()
        }))
    };
};

// ============================================
// CORE DATA SERVICES
// ============================================
const getBirthDetailsData = async (params) => {
    const data = await getBirthDetails(params);
    return { success: true, data };
};

const getAstroDetailsData = async (params) => {
    const data = await getAstroDetails(params);
    return { success: true, data };
};

const getPlanetsData = async (params) => {
    const data = await getPlanets(params);
    return { success: true, data };
};

const getPlanetsExtendedData = async (params) => {
    const data = await getPlanetsExtended(params);
    return { success: true, data };
};

const getBhavMadhyaData = async (params) => {
    const data = await getBhavMadhya(params);
    return { success: true, data };
};

const getGhatChakraData = async (params) => {
    const data = await getGhatChakra(params);
    return { success: true, data };
};

const getAyanamshaData = async (params) => {
    const data = await getAyanamsha(params);
    return { success: true, data };
};

const getPlanetNatureData = async (params) => {
    const data = await getPlanetNature(params);
    return { success: true, data };
};

// ============================================
// BIORHYTHM & HOROSCOPE SERVICES
// ============================================
const getBiorhythmData = async (params) => {
    const data = await getBiorhythm(params);
    return { success: true, data };
};

const getMoonBiorhythmData = async (params) => {
    const data = await getMoonBiorhythm(params);
    return { success: true, data };
};

const getHoroChartData = async (params, chartId) => {
    const data = await getHoroChart(params, chartId);
    return { success: true, data };
};

const getHoroChartImageData = async (params, chartId) => {
    const data = await getHoroChartImage(params, chartId);
    return { success: true, data };
};

const getPlanetAshtakData = async (params, planetName) => {
    const data = await getPlanetAshtak(params, planetName);
    return { success: true, data };
};

const getSarvashtakData = async (params) => {
    const data = await getSarvashtak(params);
    return { success: true, data };
};

// ============================================
// VIMSHOTTARI DASHA SERVICES
// ============================================
const getCurrentVdashaAllData = async (params) => {
    const data = await getCurrentVdashaAll(params);
    return { success: true, data };
};

const getMajorVdashaData = async (params) => {
    const data = await getMajorVdasha(params);
    return { success: true, data };
};

const getCurrentVdashaData = async (params) => {
    const data = await getCurrentVdasha(params);
    return { success: true, data };
};

const getCurrentVdashaByDateData = async (params) => {
    const data = await getCurrentVdashaByDate(params);
    return { success: true, data };
};

const getSubVdashaData = async (params, md) => {
    const data = await getSubVdasha(params, md);
    return { success: true, data };
};

const getSubSubVdashaData = async (params, md, ad) => {
    const data = await getSubSubVdasha(params, md, ad);
    return { success: true, data };
};

const getSubSubSubVdashaData = async (params, md, ad, pd) => {
    const data = await getSubSubSubVdasha(params, md, ad, pd);
    return { success: true, data };
};

const getSubSubSubSubVdashaData = async (params, md, ad, pd, sd) => {
    const data = await getSubSubSubSubVdasha(params, md, ad, pd, sd);
    return { success: true, data };
};

// ============================================
// CHAR DASHA SERVICES
// ============================================
const getMajorChardashaData = async (params) => {
    const data = await getMajorChardasha(params);
    return { success: true, data };
};

const getCurrentChardashaData = async (params) => {
    const data = await getCurrentChardasha(params);
    return { success: true, data };
};

const getSubChardashaData = async (params, md) => {
    const data = await getSubChardasha(params, md);
    return { success: true, data };
};

const getSubSubChardashaData = async (params, md, ad) => {
    const data = await getSubSubChardasha(params, md, ad);
    return { success: true, data };
};

// ============================================
// YOGINI DASHA SERVICES
// ============================================
const getMajorYoginiDashaData = async (params) => {
    const data = await getMajorYoginiDasha(params);
    return { success: true, data };
};

const getCurrentYoginiDashaData = async (params) => {
    const data = await getCurrentYoginiDasha(params);
    return { success: true, data };
};

const getSubYoginiDashaData = async (params, dashaCycle, dashaName) => {
    const data = await getSubYoginiDasha(params, dashaCycle, dashaName);
    return { success: true, data };
};

// ============================================
// GENERAL REPORT SERVICES
// ============================================
const getGeneralHouseReportData = async (params, planetName) => {
    const data = await getGeneralHouseReport(params, planetName);
    return { success: true, data };
};

const getGeneralRashiReportData = async (params, planetName) => {
    const data = await getGeneralRashiReport(params, planetName);
    return { success: true, data };
};

const getGeneralAscendantReportData = async (params) => {
    const data = await getGeneralAscendantReport(params);
    return { success: true, data };
};

const getGeneralNakshatraReportData = async (params) => {
    const data = await getGeneralNakshatraReport(params);
    return { success: true, data };
};

// ============================================
// LAL KITAB SERVICES
// ============================================
const getLalkitabHoroscopeData = async (params) => {
    const data = await getLalkitabHoroscope(params);
    return { success: true, data };
};

const getLalkitabDebtsData = async (params) => {
    const data = await getLalkitabDebts(params);
    return { success: true, data };
};

const getLalkitabRemediesData = async (params, planetName) => {
    const data = await getLalkitabRemedies(params, planetName);
    return { success: true, data };
};

const getLalkitabHousesData = async (params) => {
    const data = await getLalkitabHouses(params);
    return { success: true, data };
};

const getLalkitabPlanetsData = async (params) => {
    const data = await getLalkitabPlanets(params);
    return { success: true, data };
};

// ============================================
// NAKSHATRA PREDICTION SERVICES
// ============================================
const getDailyNakshatraPredictionData = async (params) => {
    const data = await getDailyNakshatraPrediction(params);
    return { success: true, data };
};

const getNextDayNakshatraPredictionData = async (params) => {
    const data = await getNextDayNakshatraPrediction(params);
    return { success: true, data };
};

const getPreviousDayNakshatraPredictionData = async (params) => {
    const data = await getPreviousDayNakshatraPrediction(params);
    return { success: true, data };
};

const getDailyNakshatraConsolidatedData = async (params) => {
    const data = await getDailyNakshatraConsolidated(params);
    return { success: true, data };
};

// ============================================
// PANCHANG & MUHURTA SERVICES
// ============================================
const getBasicPanchangSunriseData = async (params) => {
    const data = await getBasicPanchangSunrise(params);
    return { success: true, data };
};

const getBasicPanchangData = async (params) => {
    const data = await getBasicPanchang(params);
    return { success: true, data };
};

const getAdvancedPanchangSunriseData = async (params) => {
    const data = await getAdvancedPanchangSunrise(params);
    return { success: true, data };
};

const getAdvancedPanchangData = async (params) => {
    const data = await getAdvancedPanchang(params);
    return { success: true, data };
};

const getPlanetPanchangData = async (params) => {
    const data = await getPlanetPanchang(params);
    return { success: true, data };
};

const getChaughadiyaMuhurtaData = async (params) => {
    const data = await getChaughadiyaMuhurta(params);
    return { success: true, data };
};

const getHoraMuhurtaDinmanData = async (params) => {
    const data = await getHoraMuhurtaDinman(params);
    return { success: true, data };
};

const getPanchangChartData = async (params) => {
    const data = await getPanchangChart(params);
    return { success: true, data };
};

const getPanchangChartSunriseData = async (params) => {
    const data = await getPanchangChartSunrise(params);
    return { success: true, data };
};

const getTamilMonthPanchangData = async (params) => {
    const data = await getTamilMonthPanchang(params);
    return { success: true, data };
};

const getTamilPanchangData = async (params) => {
    const data = await getTamilPanchang(params);
    return { success: true, data };
};

const getPanchangFestivalData = async (params) => {
    const data = await getPanchangFestival(params);
    return { success: true, data };
};

// ============================================
// NUMEROLOGY SERVICES
// ============================================
const getNumeroTableData = async (params) => {
    const data = await getNumeroTable(params);
    return { success: true, data };
};

const getNumeroReportData = async (params) => {
    const data = await getNumeroReport(params);
    return { success: true, data };
};

const getNumeroFavTimeData = async (params) => {
    const data = await getNumeroFavTime(params);
    return { success: true, data };
};

const getNumeroPlaceVastuData = async (params) => {
    const data = await getNumeroPlaceVastu(params);
    return { success: true, data };
};

const getNumeroFastsReportData = async (params) => {
    const data = await getNumeroFastsReport(params);
    return { success: true, data };
};

const getNumeroFavLordData = async (params) => {
    const data = await getNumeroFavLord(params);
    return { success: true, data };
};

const getNumeroFavMantraData = async (params) => {
    const data = await getNumeroFavMantra(params);
    return { success: true, data };
};

const getNumeroPredictionDailyData = async (params) => {
    const data = await getNumeroPredictionDaily(params);
    return { success: true, data };
};

// ============================================
// DOSHA & YOGA SERVICES
// ============================================
const getSimpleManglikData = async (params) => {
    const data = await getSimpleManglik(params);
    return { success: true, data };
};

const getManglikData = async (params) => {
    const data = await getManglik(params);
    return { success: true, data };
};

const getKalsarpaDetailsData = async (params) => {
    const data = await getKalsarpaDetails(params);
    return { success: true, data };
};

const getSadeSatiCurrentStatusData = async (params) => {
    const data = await getSadeSatiCurrentStatus(params);
    return { success: true, data };
};

const getSadeSatiLifeDetailsData = async (params) => {
    const data = await getSadeSatiLifeDetails(params);
    return { success: true, data };
};

const getPitraDoshaReportData = async (params) => {
    const data = await getPitraDoshaReport(params);
    return { success: true, data };
};

// ============================================
// VARSHAPHAL SERVICES
// ============================================
const getVarshaphalYearChartData = async (params) => {
    const data = await getVarshaphalYearChart(params);
    return { success: true, data };
};

const getVarshaphalMonthChartData = async (params) => {
    const data = await getVarshaphalMonthChart(params);
    return { success: true, data };
};

const getVarshaphalDetailsData = async (params) => {
    const data = await getVarshaphalDetails(params);
    return { success: true, data };
};

const getVarshaphalPlanetsData = async (params) => {
    const data = await getVarshaphalPlanets(params);
    return { success: true, data };
};

const getVarshaphalMunthaData = async (params) => {
    const data = await getVarshaphalMuntha(params);
    return { success: true, data };
};

const getVarshaphalMuddaDashaData = async (params) => {
    const data = await getVarshaphalMuddaDasha(params);
    return { success: true, data };
};

const getVarshaphalPanchavargeeyaBalaData = async (params) => {
    const data = await getVarshaphalPanchavargeeyaBala(params);
    return { success: true, data };
};

const getVarshaphalSahamPointsData = async (params) => {
    const data = await getVarshaphalSahamPoints(params);
    return { success: true, data };
};

const getVarshaphalYogaData = async (params) => {
    const data = await getVarshaphalYoga(params);
    return { success: true, data };
};

// ============================================
// KP SYSTEM SERVICES
// ============================================
const getKpPlanetsData = async (params) => {
    const data = await getKpPlanets(params);
    return { success: true, data };
};

const getKpHouseCuspsData = async (params) => {
    const data = await getKpHouseCusps(params);
    return { success: true, data };
};

const getKpBirthChartData = async (params) => {
    const data = await getKpBirthChart(params);
    return { success: true, data };
};

const getKpHouseSignificatorData = async (params) => {
    const data = await getKpHouseSignificator(params);
    return { success: true, data };
};

const getKpPlanetSignificatorData = async (params) => {
    const data = await getKpPlanetSignificator(params);
    return { success: true, data };
};

// ============================================
// MATCHMAKING SERVICES
// ============================================
const getMatchBirthDetailsData = async (params) => {
    const data = await getMatchBirthDetails(params);
    return { success: true, data };
};

const getMatchAshtakootPointsData = async (params) => {
    const data = await getMatchAshtakootPoints(params);
    return { success: true, data };
};

const getMatchObstructionsData = async (params) => {
    const data = await getMatchObstructions(params);
    return { success: true, data };
};

const getMatchAstroDetailsData = async (params) => {
    const data = await getMatchAstroDetails(params);
    return { success: true, data };
};

const getMatchPlanetDetailsData = async (params) => {
    const data = await getMatchPlanetDetails(params);
    return { success: true, data };
};

const getMatchManglikReportData = async (params) => {
    const data = await getMatchManglikReport(params);
    return { success: true, data };
};

const getMatchMakingReportData = async (params) => {
    const data = await getMatchMakingReport(params);
    return { success: true, data };
};

const getMatchMakingDetailedReportData = async (params) => {
    const data = await getMatchMakingDetailedReport(params);
    return { success: true, data };
};

const getMatchDashakootPointsData = async (params) => {
    const data = await getMatchDashakootPoints(params);
    return { success: true, data };
};

const getMatchPercentageData = async (params) => {
    const data = await getMatchPercentage(params);
    return { success: true, data };
};

// ============================================
// MATCHMAKING (SIMPLE) SERVICE
// ============================================
const getMatchmakingData = async (params) => {
    const data = await getMatchAshtakootPoints(params); 
    return { success: true, data };
};

const getDailyHoroscopeData = async (sign, day, month, year) => {
    const data = await getDailyHoroscope(sign, day, month, year);
    return { success: true, data };
};

// ============================================
// EXPORT ALL SERVICES
// ============================================
export {
    getGeoDetails,
    getBirthDetailsData,
    getAstroDetailsData,
    getPlanetsData,
    getPlanetsExtendedData,
    getBhavMadhyaData,
    getGhatChakraData,
    getAyanamshaData,
    getPlanetNatureData,
    getBiorhythmData,
    getMoonBiorhythmData,
    getHoroChartData,
    getHoroChartImageData,
    getPlanetAshtakData,
    getSarvashtakData,
    getCurrentVdashaAllData,
    getMajorVdashaData,
    getCurrentVdashaData,
    getCurrentVdashaByDateData,
    getSubVdashaData,
    getSubSubVdashaData,
    getSubSubSubVdashaData,
    getSubSubSubSubVdashaData,
    getMajorChardashaData,
    getCurrentChardashaData,
    getSubChardashaData,
    getSubSubChardashaData,
    getMajorYoginiDashaData,
    getCurrentYoginiDashaData,
    getSubYoginiDashaData,
    getGeneralHouseReportData,
    getGeneralRashiReportData,
    getGeneralAscendantReportData,
    getGeneralNakshatraReportData,
    getLalkitabHoroscopeData,
    getLalkitabDebtsData,
    getLalkitabRemediesData,
    getLalkitabHousesData,
    getLalkitabPlanetsData,
    getDailyNakshatraPredictionData,
    getNextDayNakshatraPredictionData,
    getPreviousDayNakshatraPredictionData,
    getDailyNakshatraConsolidatedData,
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
    getNumeroTableData,
    getNumeroReportData,
    getNumeroFavTimeData,
    getNumeroPlaceVastuData,
    getNumeroFastsReportData,
    getNumeroFavLordData,
    getNumeroFavMantraData,
    getNumeroPredictionDailyData,
    getSimpleManglikData,
    getManglikData,
    getKalsarpaDetailsData,
    getSadeSatiCurrentStatusData,
    getSadeSatiLifeDetailsData,
    getPitraDoshaReportData,
    getVarshaphalYearChartData,
    getVarshaphalMonthChartData,
    getVarshaphalDetailsData,
    getVarshaphalPlanetsData,
    getVarshaphalMunthaData,
    getVarshaphalMuddaDashaData,
    getVarshaphalPanchavargeeyaBalaData,
    getVarshaphalSahamPointsData,
    getVarshaphalYogaData,
    getKpPlanetsData,
    getKpHouseCuspsData,
    getKpBirthChartData,
    getKpHouseSignificatorData,
    getKpPlanetSignificatorData,
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
    getMatchmakingData,
    getDailyHoroscopeData
};