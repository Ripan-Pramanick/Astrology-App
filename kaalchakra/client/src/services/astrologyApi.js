// client/src/services/astrologyApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kaalchakra-backend.onrender.com';

// ============================================
// AXIOS INSTANCE (একবারই ডিফাইন করুন)
// ============================================
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
);

// ============================================
// HELPER: Map frontend params to AstrologyAPI format
// ============================================
const mapToAstrologyParams = (params) => {
  return {
    day: params.day || params.birthDate?.day,
    month: params.month || params.birthDate?.month,
    year: params.year || params.birthDate?.year,
    hour: params.hour || params.birthTime?.hour,
    min: params.minute || params.birthTime?.minute,
    lat: params.latitude || params.lat,
    lon: params.longitude || params.lon,
    tzone: params.timezone || params.tzone,
    ayanamsa: params.ayanamsa || 'lahiri'
  };
};

// ============================================
// COMMON API CALL FUNCTION
// ============================================
const callAstrologyAPI = async (endpoint, params) => {
  const mappedParams = mapToAstrologyParams(params);
  return api.post(`/${endpoint}`, mappedParams);
};

// ============================================
// BIRTH DETAILS & KUNDLI ENDPOINTS
// ============================================
export const kundliService = {
  async getBirthDetails(params) {
    return callAstrologyAPI('birth_details', params);
  },
  
  async getVedicHoroscope(params) {
    return callAstrologyAPI('birth_details', params);
  },
  
  async getWesternHoroscope(params) {
    return callAstrologyAPI('western_horoscope', params);
  },
  
  async getKundli(params) {
    return callAstrologyAPI('planets/extended', params);
  },
  
  async getAstroDetails(params) {
    return callAstrologyAPI('birth_details', params);
  },
  
  async getGeoDetails(place) {
    const placeName = typeof place === 'string' ? place : place.place;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=5`,
      { headers: { 'User-Agent': 'KaalChakra-App/1.0' } }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        success: true,
        geonames: data.map(loc => ({
          place_name: loc.display_name,
          lat: loc.lat,
          lon: loc.lon,
          timezone: "5.5"
        }))
      };
    }
    return { success: false, geonames: [] };
  },
  
  async getTimezone(params) {
    return callAstrologyAPI('birth_details', params);
  },
  
  async getTimezoneWithDST(params) {
    return callAstrologyAPI('birth_details', params);
  },
  
  async getWesternChartData(params) {
    return callAstrologyAPI('western_horoscope', params);
  },
  
  async getCustomWesternChart(params) {
    return callAstrologyAPI('western_horoscope', params);
  }
};

// ============================================
// PLANETARY POSITIONS ENDPOINTS
// ============================================
export const planetaryService = {
  // Get planets position (Vedic)
  async getPlanets(params) {
    return callAstrologyAPI('planets', params);
  },
  
  // Get planets extended (with more details)
  async getPlanetsExtended(params) {
    return callAstrologyAPI('planets/extended', params);
  },
  
  // Get tropical (Western) planets
  async getPlanetsTropical(params) {
    return callAstrologyAPI('planets', { ...params, system: 'tropical' });
  },
  
  async getPlanetAshtak(planetName, params) {
    return callAstrologyAPI(`planets/${planetName}/ashtak`, params);
  },
  
  async getPlanetNature(planetName) {
    return api.get(`/planets/${planetName}/nature`);
  },
  
  async getBhavMadhya(params) {
    return callAstrologyAPI('bhava/madhya', params);
  },
  
  async getHouseCuspsTropical(params) {
    return callAstrologyAPI('house/cusps', { ...params, system: 'tropical' });
  },
  
  async getNatalHouseCuspReport(params) {
    return callAstrologyAPI('house/cusps', params);
  },
  
  async getGeneralHouseReport(planetName, params) {
    return callAstrologyAPI(`houses/${planetName}`, params);
  },
  
  async getGeneralHouseReportTropical(planetName, params) {
    return callAstrologyAPI(`houses/${planetName}`, { ...params, system: 'tropical' });
  }
};

// ============================================
// PANCHANG & CALENDAR ENDPOINTS
// ============================================
export const panchangService = {
  async getAdvancedPanchang(params) {
    return callAstrologyAPI('panchang', params);
  },
  
  async getAdvancedPanchangSunrise(params) {
    return callAstrologyAPI('panchang/sunrise', params);
  },
  
  async getBasicPanchang(params) {
    return callAstrologyAPI('panchang/basic', params);
  },
  
  async getBasicPanchangSunrise(params) {
    return callAstrologyAPI('panchang/basic/sunrise', params);
  },
  
  async getMonthlyPanchang(params) {
    return callAstrologyAPI('panchang/monthly', params);
  },
  
  async getTamilPanchang(params) {
    return callAstrologyAPI('panchang/tamil', params);
  },
  
  async getTamilMonthPanchang(params) {
    return callAstrologyAPI('panchang/tamil/monthly', params);
  },
  
  async getPanchangChart(params) {
    return callAstrologyAPI('panchang/chart', params);
  },
  
  async getPanchangFestival(params) {
    return callAstrologyAPI('panchang/festivals', params);
  },
  
  async getPanchangLagnaTable(params) {
    return callAstrologyAPI('panchang/lagna', params);
  },
  
  async getPlanetPanchang(params) {
    return callAstrologyAPI('panchang/planets', params);
  },
  
  async getPlanetPanchangSunrise(params) {
    return callAstrologyAPI('panchang/planets/sunrise', params);
  }
};

// ============================================
// NASHA (PERIOD) ENDPOINTS
// ============================================
export const dashaService = {
  async getCurrentVDasha(params) {
    return callAstrologyAPI('dasha/current', params);
  },
  
  async getAllVDasha(params) {
    return callAstrologyAPI('dasha/all', params);
  },
  
  async getVDashaByDate(params) {
    return callAstrologyAPI('dasha/by-date', params);
  },
  
  async getMajorVDasha(params) {
    return callAstrologyAPI('dasha/major', params);
  },
  
  async getSubVDasha(md, params) {
    return callAstrologyAPI(`dasha/${md}/sub`, params);
  },
  
  async getSubSubVDasha(md, ad, params) {
    return callAstrologyAPI(`dasha/${md}/${ad}/sub-sub`, params);
  },
  
  async getSubSubSubVDasha(md, ad, pd, params) {
    return callAstrologyAPI(`dasha/${md}/${ad}/${pd}/sub-sub-sub`, params);
  },
  
  async getCurrentChardasha(params) {
    return callAstrologyAPI('chardasha/current', params);
  },
  
  async getMajorChardasha(params) {
    return callAstrologyAPI('chardasha/major', params);
  },
  
  async getSubChardasha(md, params) {
    return callAstrologyAPI(`chardasha/${md}/sub`, params);
  },
  
  async getSubSubChardasha(md, ad, params) {
    return callAstrologyAPI(`chardasha/${md}/${ad}/sub-sub`, params);
  },
  
  async getCurrentYoginiDasha(params) {
    return callAstrologyAPI('yogini/current', params);
  },
  
  async getMajorYoginiDasha(params) {
    return callAstrologyAPI('yogini/major', params);
  },
  
  async getSubYoginiDasha(params) {
    return callAstrologyAPI('yogini/sub', params);
  }
};

// ============================================
// MATCHMAKING & COMPATIBILITY ENDPOINTS
// ============================================
export const matchmakingService = {
  async getMatchMaking(personA, personB) {
    return api.post('/matchmaking', { personA, personB });
  },
  
  async getMatchMakingDetailed(personA, personB) {
    return api.post('/matchmaking/detailed', { personA, personB });
  },
  
  async getSimpleMatch(personA, personB) {
    return api.post('/matchmaking/simple', { personA, personB });
  },
  
  async getMatchPercentage(personA, personB) {
    return api.post('/matchmaking/percentage', { personA, personB });
  },
  
  async getAshtakootPoints(personA, personB) {
    return api.post('/matchmaking/ashtakoot', { personA, personB });
  },
  
  async getDashakootPoints(personA, personB) {
    return api.post('/matchmaking/dashakoot', { personA, personB });
  },
  
  async getMatchManglik(personA, personB) {
    return api.post('/matchmaking/manglik', { personA, personB });
  },
  
  async getMatchObstructions(personA, personB) {
    return api.post('/matchmaking/obstructions', { personA, personB });
  },
  
  async getZodiacCompatibility(zodiacName, partnerZodiacName) {
    return api.get(`/compatibility/zodiac/${zodiacName}/${partnerZodiacName}`);
  },
  
  async getLoveCompatibilityReport(params) {
    return api.post('/compatibility/love', params);
  },
  
  async getPartnerReport(params) {
    return api.post('/matchmaking/partner', params);
  },
  
  async getCompositeHoroscope(personA, personB) {
    return api.post('/compatibility/composite', { personA, personB });
  },
  
  async getSynastryHoroscope(personA, personB) {
    return api.post('/compatibility/synastry', { personA, personB });
  },
  
  async getAffinityCalculator(personA, personB) {
    return api.post('/compatibility/affinity', { personA, personB });
  },
  
  async getRomanticForecastReport(params) {
    return api.post('/forecast/romantic', params);
  },
  
  async getRomanticForecastCoupleReport(params) {
    return api.post('/forecast/romantic/couple', params);
  },
  
  async getRomanticPersonalityReport(params) {
    return api.post('/forecast/romantic/personality', params);
  }
};

// ============================================
// DOSHA & YOGA ENDPOINTS
// ============================================
export const doshaService = {
  async getManglik(params) {
    return callAstrologyAPI('dosha/manglik', params);
  },
  
  async getSimpleManglik(params) {
    return callAstrologyAPI('dosha/manglik/simple', params);
  },
  
  async getKalsarpaDetails(params) {
    return callAstrologyAPI('dosha/kalsarpa', params);
  },
  
  async getPitraDoshaReport(params) {
    return callAstrologyAPI('dosha/pitra', params);
  },
  
  async getPapasamyamDetails(params) {
    return callAstrologyAPI('dosha/papasamyam', params);
  },
  
  async getYogas(params) {
    return callAstrologyAPI('yoga', params);
  },
  
  async getVarshaphalYoga(params) {
    return callAstrologyAPI('yoga/varshaphal', params);
  },
  
  async getSarvashtak(params) {
    return callAstrologyAPI('sarvashtak', params);
  },
  
  async getGhatChakra(params) {
    return callAstrologyAPI('ghat-chakra', params);
  }
};

// ============================================
// SADE SATI ENDPOINTS
// ============================================
export const sadeSatiService = {
  async getSadeSatiCurrentStatus(params) {
    return callAstrologyAPI('sade-sati/current', params);
  },
  
  async getSadeSatiLifeDetails(params) {
    return callAstrologyAPI('sade-sati/life', params);
  },
  
  async getSadeSatiRemedies(params) {
    return callAstrologyAPI('sade-sati/remedies', params);
  }
};

// ============================================
// LAL KITAB ENDPOINTS
// ============================================
export const lalKitabService = {
  async getLalKitabHoroscope(params) {
    return callAstrologyAPI('lal-kitab/horoscope', params);
  },
  
  async getLalKitabHouses(params) {
    return callAstrologyAPI('lal-kitab/houses', params);
  },
  
  async getLalKitabPlanets(params) {
    return callAstrologyAPI('lal-kitab/planets', params);
  },
  
  async getLalKitabDebts(params) {
    return callAstrologyAPI('lal-kitab/debts', params);
  },
  
  async getLalKitabRemedies(planetName, params) {
    return callAstrologyAPI(`lal-kitab/remedies/${planetName}`, params);
  }
};

// ============================================
// NUMEROLOGY ENDPOINTS
// ============================================
export const numerologyService = {
  async getNumerologyReport(params) {
    return api.post('/numerology/report', params);
  },
  
  async getNumerologyTable(params) {
    return api.post('/numerology/table', params);
  },
  
  async getLifePathNumber(params) {
    return api.post('/numerology/life-path', params);
  },
  
  async getExpressionNumber(params) {
    return api.post('/numerology/expression', params);
  },
  
  async getSoulUrgeNumber(params) {
    return api.post('/numerology/soul-urge', params);
  },
  
  async getPersonalityNumber(params) {
    return api.post('/numerology/personality', params);
  },
  
  async getChallengeNumbers(params) {
    return api.post('/numerology/challenges', params);
  },
  
  async getNumerologicalNumbers(params) {
    return api.post('/numerology/numbers', params);
  },
  
  async getNumeroFavLord(params) {
    return api.post('/numerology/favourable-lord', params);
  },
  
  async getNumeroFavMantra(params) {
    return api.post('/numerology/favourable-mantra', params);
  },
  
  async getNumeroFavTime(params) {
    return api.post('/numerology/favourable-time', params);
  },
  
  async getNumeroPlaceVastu(params) {
    return api.post('/numerology/place-vastu', params);
  },
  
  async getNumeroFastsReport(params) {
    return api.post('/numerology/fasts', params);
  }
};

// ============================================
// MUHURTA & AUSPICIOUS TIMINGS
// ============================================
export const muhurtaService = {
  async getMarriageMuhurta(params) {
    return callAstrologyAPI('muhurta/marriage', params);
  },
  
  async getChaughadiyaMuhurta(params) {
    return callAstrologyAPI('muhurta/chaughadiya', params);
  },
  
  async getHoraMuhurta(params) {
    return callAstrologyAPI('muhurta/hora', params);
  },
  
  async getHoraMuhurtaDinman(params) {
    return callAstrologyAPI('muhurta/hora/dinman', params);
  }
};

// ============================================
// TAROT & PREDICTIONS
// ============================================
export const tarotService = {
  async getTarotPredictions(params) {
    return api.post('/tarot/predict', params);
  },
  
  async getYesNoTarot(params) {
    return api.post('/tarot/yes-no', params);
  }
};

// ============================================
// DAILY & WEEKLY PREDICTIONS
// ============================================
export const predictionsService = {
  async getDailyHoroscope(sign, day = 'today') {
    return api.get(`/horoscope/daily/${sign}?day=${day}`);
  },
  
  async getDailyNakshatraPrediction(params) {
    return callAstrologyAPI('predictions/nakshatra/daily', params);
  },
  
  async getNextDayNakshatraPrediction(params) {
    return callAstrologyAPI('predictions/nakshatra/next-day', params);
  },
  
  async getPreviousDayNakshatraPrediction(params) {
    return callAstrologyAPI('predictions/nakshatra/previous-day', params);
  },
  
  async getDailyNakshatraConsolidated(params) {
    return callAstrologyAPI('predictions/nakshatra/consolidated', params);
  },
  
  async getPersonalDayPrediction(params) {
    return callAstrologyAPI('predictions/personal/day', params);
  },
  
  async getPersonalMonthPrediction(params) {
    return callAstrologyAPI('predictions/personal/month', params);
  },
  
  async getPersonalYearPrediction(params) {
    return callAstrologyAPI('predictions/personal/year', params);
  },
  
  async getChineseYearForecast(params) {
    return api.post('/chinese/year-forecast', params);
  },
  
  async getChineseZodiac(params) {
    return api.get('/chinese/zodiac');
  },
  
  async getMoonPhaseReport(params) {
    return callAstrologyAPI('moon/phase', params);
  },
  
  async getMoonBiorhythm(params) {
    return callAstrologyAPI('moon/biorhythm', params);
  },
  
  async getBiorhythm(params) {
    return callAstrologyAPI('biorhythm', params);
  },
  
  async getLunarMetrics(params) {
    return callAstrologyAPI('lunar/metrics', params);
  }
};

// ============================================
// VARSHAPHAL (YEARLY PREDICTIONS)
// ============================================
export const varshaphalService = {
  async getVarshaphalDetails(params) {
    return callAstrologyAPI('varshaphal/details', params);
  },
  
  async getVarshaphalPlanets(params) {
    return callAstrologyAPI('varshaphal/planets', params);
  },
  
  async getVarshaphalYearChart(params) {
    return callAstrologyAPI('varshaphal/year-chart', params);
  },
  
  async getVarshaphalMonthChart(params) {
    return callAstrologyAPI('varshaphal/month-chart', params);
  },
  
  async getVarshaphalMuntha(params) {
    return callAstrologyAPI('varshaphal/muntha', params);
  },
  
  async getVarshaphalMuddaDasha(params) {
    return callAstrologyAPI('varshaphal/mudda-dasha', params);
  },
  
  async getVarshaphalHarshaBala(params) {
    return callAstrologyAPI('varshaphal/harsha-bala', params);
  },
  
  async getVarshaphalPanchavargeeyaBala(params) {
    return callAstrologyAPI('varshaphal/panchavargeeya-bala', params);
  },
  
  async getVarshaphalSahamPoints(params) {
    return callAstrologyAPI('varshaphal/saham-points', params);
  }
};

// ============================================
// TRANSITS (GOCHAR)
// ============================================
export const transitService = {
  async getDailyTransits(params) {
    return callAstrologyAPI('transits/daily', params);
  },
  
  async getWeeklyTransits(params) {
    return callAstrologyAPI('transits/weekly', params);
  },
  
  async getTropicalDailyTransits(params) {
    return callAstrologyAPI('transits/daily', { ...params, system: 'tropical' });
  },
  
  async getTropicalWeeklyTransits(params) {
    return callAstrologyAPI('transits/weekly', { ...params, system: 'tropical' });
  },
  
  async getTropicalMonthlyTransits(params) {
    return callAstrologyAPI('transits/monthly', { ...params, system: 'tropical' });
  },
  
  async getTropicalTransitsTimingDaily(params) {
    return callAstrologyAPI('transits/timing/daily', { ...params, system: 'tropical' });
  },
  
  async getTropicalTransitsTimingMonthly(params) {
    return callAstrologyAPI('transits/timing/monthly', { ...params, system: 'tropical' });
  }
};

// ============================================
// REPORTS & INTERPRETATIONS
// ============================================
export const reportsService = {
  async getNatalChartInterpretation(params) {
    return callAstrologyAPI('interpretation/natal', params);
  },
  
  async getGeneralAscendantReport(params) {
    return callAstrologyAPI('report/ascendant', params);
  },
  
  async getGeneralAscendantReportTropical(params) {
    return callAstrologyAPI('report/ascendant', { ...params, system: 'tropical' });
  },
  
  async getGeneralNakshatraReport(params) {
    return callAstrologyAPI('report/nakshatra', params);
  },
  
  async getGeneralRashiReport(planetName, params) {
    return callAstrologyAPI(`report/rashi/${planetName}`, params);
  },
  
  async getGeneralSignReportTropical(planetName, params) {
    return callAstrologyAPI(`report/sign/${planetName}`, { ...params, system: 'tropical' });
  },
  
  async getPersonalityReport(params) {
    return callAstrologyAPI('report/personality', params);
  },
  
  async getLifeForecastReport(params) {
    return callAstrologyAPI('report/life-forecast', params);
  },
  
  async getKarmaDestinyReport(params) {
    return callAstrologyAPI('report/karma-destiny', params);
  },
  
  async getFriendshipReport(params) {
    return callAstrologyAPI('report/friendship', params);
  }
};

// ============================================
// SOLAR RETURN
// ============================================
export const solarReturnService = {
  async getSolarReturnDetails(params) {
    return callAstrologyAPI('solar-return/details', params);
  },
  
  async getSolarReturnPlanets(params) {
    return callAstrologyAPI('solar-return/planets', params);
  },
  
  async getSolarReturnPlanetReport(params) {
    return callAstrologyAPI('solar-return/planet-report', params);
  },
  
  async getSolarReturnHouseCusps(params) {
    return callAstrologyAPI('solar-return/house-cusps', params);
  },
  
  async getSolarReturnPlanetAspects(params) {
    return callAstrologyAPI('solar-return/planet-aspects', params);
  },
  
  async getSolarReturnAspectsReport(params) {
    return callAstrologyAPI('solar-return/aspects-report', params);
  }
};

// ============================================
// KP (KRISHNAMURTI) SYSTEM
// ============================================
export const kpService = {
  async getKPBirthChart(params) {
    return callAstrologyAPI('kp/birth-chart', params);
  },
  
  async getKPPlanets(params) {
    return callAstrologyAPI('kp/planets', params);
  },
  
  async getKPHouseCusps(params) {
    return callAstrologyAPI('kp/house-cusps', params);
  },
  
  async getKPPlanetSignificator(params) {
    return callAstrologyAPI('kp/planet-significator', params);
  },
  
  async getKPHouseSignificator(params) {
    return callAstrologyAPI('kp/house-significator', params);
  }
};

// ============================================
// REMEDIES & SUGGESTIONS
// ============================================
export const remediesService = {
  async getBasicGemSuggestion(params) {
    return callAstrologyAPI('remedies/gem', params);
  },
  
  async getRudrakshaSuggestion(params) {
    return callAstrologyAPI('remedies/rudraksha', params);
  },
  
  async getPujaSuggestion(params) {
    return callAstrologyAPI('remedies/puja', params);
  }
};

// ============================================
// CHARTS & IMAGES
// ============================================
export const chartService = {
  async getNatalWheelChart(params) {
    return api.post('/chart/natal', params);
  },
  
  async getHoroscopeChart(chartId) {
    return api.get(`/chart/${chartId}`);
  },
  
  async getHoroscopeChartImage(chartId) {
    return api.get(`/chart/${chartId}/image`, { responseType: 'blob' });
  }
};

// ============================================
// AYANAMSHA
// ============================================
export const ayanamshaService = {
  async getAyanamsha(date) {
    return api.get(`/ayanamsha?date=${date}`);
  }
};

// ============================================
// JAMINI SYSTEM
// ============================================
export const jaiminiService = {
  async getJaiminiDetails(params) {
    return callAstrologyAPI('jaimini/details', params);
  }
};

// ============================================
// MOON & SOLAR INGRESS
// ============================================
export const ingressService = {
  async getCustomMoonSolarIngress(params) {
    return callAstrologyAPI('ingress/moon-solar', params);
  }
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