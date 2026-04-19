// // client/src/services/astrologyApi.js
// import axios from 'axios';

// // ============================================
// // ASTROLOGY API CONFIGURATION - Using Backend Proxy
// // ============================================
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // Create axios instance for backend proxy
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 20000,
// });

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     console.error('API Error:', error.response?.data || error.message);
//     throw error.response?.data || { error: error.message };
//   }
// );

// // ============================================
// // PANCHANG & CALENDAR ENDPOINTS
// // ============================================
// export const panchangService = {
//   async getAdvancedPanchang(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getAdvancedPanchangSunrise(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getBasicPanchang(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getBasicPanchangSunrise(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getMonthlyPanchang(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getTamilPanchang(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getTamilMonthPanchang(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getPanchangChart(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getPanchangFestival(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getPanchangLagnaTable(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getPlanetPanchang(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getPlanetPanchangSunrise(params) {
//     return api.post('/astrology/birth_details', params);
//   },
// };

// // ============================================
// // BIRTH CHART & KUNDLI ENDPOINTS
// // ============================================
// export const kundliService = {
//   async getKundli(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getVedicHoroscope(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getWesternHoroscope(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getBirthDetails(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getAstroDetails(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getWesternChartData(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getCustomWesternChart(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getGeoDetails(place) {
//     return api.post('/astrology/geo_details', { place: typeof place === 'string' ? place : place.place });
//   },
//   async getTimezone(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getTimezoneWithDST(params) {
//     return api.post('/astrology/birth_details', params);
//   },
// };

// // ============================================
// // PLANETARY POSITIONS ENDPOINTS
// // ============================================
// export const planetaryService = {
//   async getPlanets(birthDetails) {
//     return api.post('/astrology/planets', birthDetails);
//   },
//   async getPlanetsExtended(birthDetails) {
//     return api.post('/astrology/planets', birthDetails);
//   },
//   async getPlanetsTropical(birthDetails) {
//     return api.post('/astrology/planets', birthDetails);
//   },
//   async getPlanetAshtak(planetName, birthDetails) {
//     return api.post('/astrology/planets', birthDetails);
//   },
//   async getPlanetNature(planetName) {
//     return api.post('/astrology/planets', { planet: planetName });
//   },
//   async getBhavMadhya(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getHouseCuspsTropical(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getNatalHouseCuspReport(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getGeneralHouseReport(planetName, birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getGeneralHouseReportTropical(planetName, birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // DASHA (PERIOD) ENDPOINTS
// // ============================================
// export const dashaService = {
//   async getCurrentVDasha(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getAllVDasha(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getVDashaByDate(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getMajorVDasha(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSubVDasha(md, birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSubSubVDasha(md, ad, birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSubSubSubVDasha(md, ad, pd, birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSubSubSubSubVDasha(md, ad, pd, sd, birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getCurrentChardasha(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getMajorChardasha(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSubChardasha(md, birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSubSubChardasha(md, ad, birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getCurrentYoginiDasha(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getMajorYoginiDasha(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSubYoginiDasha(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // MATCHMAKING & COMPATIBILITY ENDPOINTS
// // ============================================
// export const matchmakingService = {
//   async getMatchMaking(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getMatchMakingDetailed(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getSimpleMatch(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getMatchPercentage(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getAshtakootPoints(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getDashakootPoints(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getMatchManglik(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getMatchObstructions(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getMatchPlanetDetails(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getMatchAstroDetails(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getMatchBirthDetails(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getZodiacCompatibility(zodiacName, partnerZodiacName) {
//     return api.post('/matchmaking', { zodiacName, partnerZodiacName });
//   },
//   async getLoveCompatibilityReport(params) {
//     return api.post('/matchmaking', params);
//   },
//   async getPartnerReport(birthDetails) {
//     return api.post('/matchmaking', birthDetails);
//   },
//   async getCompositeHoroscope(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getSynastryHoroscope(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getAffinityCalculator(personA, personB) {
//     return api.post('/matchmaking', { personA, personB });
//   },
//   async getRomanticForecastReport(params) {
//     return api.post('/matchmaking', params);
//   },
//   async getRomanticForecastCoupleReport(params) {
//     return api.post('/matchmaking', params);
//   },
//   async getRomanticPersonalityReport(params) {
//     return api.post('/matchmaking', params);
//   },
// };

// // ============================================
// // DOSHA & YOGA ENDPOINTS
// // ============================================
// export const doshaService = {
//   async getManglik(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSimpleManglik(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getKalsarpaDetails(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getPitraDoshaReport(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getPapasamyamDetails(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getYogas(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getVarshaphalYoga(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSarvashtak(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getGhatChakra(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // SADE SATI ENDPOINTS
// // ============================================
// export const sadeSatiService = {
//   async getSadeSatiCurrentStatus(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSadeSatiLifeDetails(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSadeSatiRemedies(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // LAL KITAB ENDPOINTS
// // ============================================
// export const lalKitabService = {
//   async getLalKitabHoroscope(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getLalKitabHouses(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getLalKitabPlanets(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getLalKitabDebts(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getLalKitabRemedies(planetName, birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // NUMEROLOGY ENDPOINTS
// // ============================================
// export const numerologyService = {
//   async getNumerologyReport(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getNumerologyTable(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getLifePathNumber(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getExpressionNumber(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getSoulUrgeNumber(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getPersonalityNumber(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getChallengeNumbers(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getNumerologicalNumbers(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getNumeroFavLord(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getNumeroFavMantra(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getNumeroFavTime(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getNumeroPlaceVastu(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getNumeroFastsReport(params) {
//     return api.post('/astrology/birth_details', params);
//   },
// };

// // ============================================
// // MUHURTA & AUSPICIOUS TIMINGS
// // ============================================
// export const muhurtaService = {
//   async getMarriageMuhurta(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getChaughadiyaMuhurta(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getHoraMuhurta(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getHoraMuhurtaDinman(params) {
//     return api.post('/astrology/birth_details', params);
//   },
// };

// // ============================================
// // TAROT & PREDICTIONS
// // ============================================
// export const tarotService = {
//   async getTarotPredictions(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getYesNoTarot(params) {
//     return api.post('/astrology/birth_details', params);
//   },
// };

// // ============================================
// // DAILY & WEEKLY PREDICTIONS
// // ============================================
// export const predictionsService = {
//   async getDailyHoroscope(sign, day = 'today') {
//     return api.post('/astrology/birth_details', { sign, day });
//   },
//   async getDailyNakshatraPrediction(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getNextDayNakshatraPrediction(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getPreviousDayNakshatraPrediction(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getDailyNakshatraConsolidated(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getPersonalDayPrediction(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getPersonalMonthPrediction(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getPersonalYearPrediction(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getChineseYearForecast(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getChineseZodiac(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getMoonPhaseReport(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getMoonBiorhythm(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getBiorhythm(params) {
//     return api.post('/astrology/birth_details', params);
//   },
//   async getLunarMetrics(params) {
//     return api.post('/astrology/birth_details', params);
//   },
// };

// // ============================================
// // VARSHAPHAL (YEARLY PREDICTIONS)
// // ============================================
// export const varshaphalService = {
//   async getVarshaphalDetails(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getVarshaphalPlanets(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getVarshaphalYearChart(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getVarshaphalMonthChart(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getVarshaphalMuntha(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getVarshaphalMuddaDasha(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getVarshaphalHarshaBala(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getVarshaphalPanchavargeeyaBala(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getVarshaphalSahamPoints(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // TRANSITS (GOCHAR)
// // ============================================
// export const transitService = {
//   async getDailyTransits(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getWeeklyTransits(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getTropicalDailyTransits(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getTropicalWeeklyTransits(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getTropicalMonthlyTransits(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getTropicalTransitsTimingDaily(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getTropicalTransitsTimingMonthly(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // REPORTS & INTERPRETATIONS
// // ============================================
// export const reportsService = {
//   async getNatalChartInterpretation(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getGeneralAscendantReport(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getGeneralAscendantReportTropical(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getGeneralNakshatraReport(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getGeneralRashiReport(planetName, birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getGeneralSignReportTropical(planetName, birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getPersonalityReport(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getLifeForecastReport(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getKarmaDestinyReport(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getFriendshipReport(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // SOLAR RETURN
// // ============================================
// export const solarReturnService = {
//   async getSolarReturnDetails(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSolarReturnPlanets(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSolarReturnPlanetReport(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSolarReturnHouseCusps(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSolarReturnPlanetAspects(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getSolarReturnAspectsReport(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // KP (KRISHNAMURTI) SYSTEM
// // ============================================
// export const kpService = {
//   async getKPBirthChart(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getKPPlanets(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getKPHouseCusps(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getKPPlanetSignificator(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getKPHouseSignificator(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // REMEDIES & SUGGESTIONS
// // ============================================
// export const remediesService = {
//   async getBasicGemSuggestion(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getRudrakshaSuggestion(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getPujaSuggestion(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // CHARTS & IMAGES
// // ============================================
// export const chartService = {
//   async getNatalWheelChart(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
//   async getHoroscopeChart(chartId) {
//     return api.get(`/astrology/chart/${chartId}`);
//   },
//   async getHoroscopeChartImage(chartId) {
//     return api.get(`/astrology/chart-image/${chartId}`, { responseType: 'blob' });
//   },
// };

// // ============================================
// // AYANAMSHA
// // ============================================
// export const ayanamshaService = {
//   async getAyanamsha(date) {
//     return api.post('/astrology/birth_details', { date });
//   },
// };

// // ============================================
// // JAMINI SYSTEM
// // ============================================
// export const jaiminiService = {
//   async getJaiminiDetails(birthDetails) {
//     return api.post('/astrology/birth_details', birthDetails);
//   },
// };

// // ============================================
// // MOON & SOLAR INGRESS
// // ============================================
// export const ingressService = {
//   async getCustomMoonSolarIngress(params) {
//     return api.post('/astrology/birth_details', params);
//   },
// };

// // ============================================
// // EXPORT ALL SERVICES
// // ============================================
// const astrologyServices = {
//   panchang: panchangService,
//   kundli: kundliService,
//   planetary: planetaryService,
//   dasha: dashaService,
//   matchmaking: matchmakingService,
//   dosha: doshaService,
//   sadeSati: sadeSatiService,
//   lalKitab: lalKitabService,
//   numerology: numerologyService,
//   muhurta: muhurtaService,
//   tarot: tarotService,
//   predictions: predictionsService,
//   varshaphal: varshaphalService,
//   transit: transitService,
//   reports: reportsService,
//   solarReturn: solarReturnService,
//   kp: kpService,
//   remedies: remediesService,
//   chart: chartService,
//   ayanamsha: ayanamshaService,
//   jaimini: jaiminiService,
//   ingress: ingressService,
// };

// export default astrologyServices;

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
);

export const kundliService = {
  async getGeoDetails(place) {
    return api.post('/astrology/geo_details', { place });
  },
  async getBirthDetails(payload) {
    return api.post('/astrology/birth_details', payload);
  }
};

export const planetaryService = {
  async getPlanetsExtended(payload) {
    return api.post('/astrology/planets', payload);
  }
};

export const predictionsService = {
  async getDailyHoroscope(sign, day) {
    return {
      prediction: `Today's horoscope for ${sign} shows positive energy.`,
      love: "Romance is favorable today.",
      career: "Professional opportunities arise.",
      health: "Stay active and hydrated.",
      lucky_number: 7,
      lucky_color: "Gold"
    };
  }
};

export const panchangService = {
  async getBasicPanchang(params) {
    return api.post('/astrology/birth_details', params);
  },
  async getAdvancedPanchang(params) {
    return api.post('/astrology/birth_details', params);
  }
};

export const matchmakingService = {
  async getMatchMaking(personA, personB) {
    return {
      percentage: 72,
      score: 72,
      analysis: "This is a favorable match with good compatibility.",
      details: {
        "Ashtakoot Points": "28/36",
        "Guna Milan": "Good"
      }
    };
  }
};

export const doshaService = {
  async getYogas(params) {
    return [];
  }
};

export const dashaService = {
  async getCurrentVDasha(params) {
    return { mahadasha: [] };
  }
};

const astrologyServices = {
  kundli: kundliService,
  planetary: planetaryService,
  predictions: predictionsService,
  panchang: panchangService,
  matchmaking: matchmakingService,
  dosha: doshaService,
  dasha: dashaService,
};

export default astrologyServices;