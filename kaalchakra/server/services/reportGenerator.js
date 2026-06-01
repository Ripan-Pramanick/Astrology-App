import axios from "axios";
import { generatePDF } from "./pdfService.js";
import { generateAIPredictions } from "./aiService.js";

// --- Free Report Templates ---
import generateCoverPage from "../templates/free/cover.js";
import generateBirthDetails from "../templates/free/birthDetails.js";
import generateKundliChart from "../templates/free/kundliChart.js";
import generateDivisionalCharts from "../templates/free/divisionalCharts.js";
import generatePlanetTable from "../templates/free/planetTable.js";
import generatePersonalityAnalysis from "../templates/free/personality.js";
import generateLifePredictions from "../templates/free/lifePredictions.js";
import generateHouseAnalysis from "../templates/free/houseAnalysis.js";
import generateYogasAndDoshas from "../templates/free/yogasAndDoshas.js";
import generateDasha from "../templates/free/dasha.js";
import generateRemedies from "../templates/free/remedies.js";
import generateConclusion from "../templates/free/conclusion.js";

// --- Premium Report Templates ---
import generateExecutiveSummary from "../templates/premium/executiveSummary.js";
import generateAdvancedPlanets from "../templates/premium/advancedPlanets.js";
import generateAdvancedHouseAnalysis from "../templates/premium/advancedHouseAnalysis.js";
import generateAdvancedNakshatra from "../templates/premium/advancedNakshatra.js";
import generateAdvancedDasha from "../templates/premium/advancedDasha.js";
import generateYearlyPredictions from "../templates/premium/advancedYearlyPredictions.js";
import generateAdvancedCareer from "../templates/premium/advancedCareer.js";
import generateAdvancedMarriage from "../templates/premium/advancedMarriage.js";
import generateAdvancedPsychology from "../templates/premium/advancedPsychology.js";
import generateAdvancedDivisionalCharts from "../templates/premium/advancedDivisionalCharts.js";
import generateAdvancedAIInsights from "../templates/premium/advancedAIInsights.js";
import generateAdvancedConclusion from "../templates/premium/advancedConclusion.js";

// ==========================================
// 1. GENERATE FREE REPORT
// ==========================================
export const generateFreeReport = async (userData) => {
  const userId = process.env.ASTROLOGY_USER_ID;
  const apiKey = process.env.ASTROLOGY_API_KEY;
  const auth = Buffer.from(`${userId}:${apiKey}`).toString("base64");
  const apiConfig = { headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" } };

  const payload = {
    day: userData.day, month: userData.month, year: userData.year,
    hour: userData.hour, min: userData.min, lat: userData.lat,
    lon: userData.lon, tzone: userData.tzone
  };

  try {
    // Fetch ALL data sequentially to avoid 429 Rate Limit
    console.log("Fetching Astro APIs sequentially for Free Report...");
    const astroDetailsRes = await axios.post("https://json.astrologyapi.com/v1/astro_details", payload, apiConfig);
    const planetsRes = await axios.post("https://json.astrologyapi.com/v1/planets", payload, apiConfig);
    const majorDashaRes = await axios.post("https://json.astrologyapi.com/v1/major_vdasha", payload, apiConfig);
    const manglikRes = await axios.post("https://json.astrologyapi.com/v1/manglik", payload, apiConfig);
    const gemRes = await axios.post("https://json.astrologyapi.com/v1/basic_gem_suggestion", payload, apiConfig);

    const astroDetails = astroDetailsRes.data;
    const planetsData = planetsRes.data;
    const majorDashaData = majorDashaRes.data;
    const manglikData = manglikRes.data;
    const gemData = gemRes.data;

    // Fetch Sub-Dasha Sequentially
    const realDashaData = [];
    for (const mahadasha of majorDashaData) {
      try {
        const subDashaRes = await axios.post(`https://json.astrologyapi.com/v1/sub_vdasha/${mahadasha.planet}`, payload, apiConfig);
        realDashaData.push({
          planet: mahadasha.planet,
          start: mahadasha.start,
          end: mahadasha.end,
          antardashas: subDashaRes.data.map(ad => ({ planet: ad.planet, start: ad.start, end: ad.end }))
        });
      } catch (e) {
        realDashaData.push({ planet: mahadasha.planet, start: mahadasha.start, end: mahadasha.end, antardashas: [] });
      }
    }

    // Fetch AI Predictions
    const aiPredictions = await generateAIPredictions({
      name: userData.name || "Seeker",
      ascendant: astroDetails.ascendant,
      moonSign: astroDetails.sign,
      sunSign: astroDetails.sun_sign,
      language: userData.language || "en" 
    });

    // Format reportData
    const reportData = {
      name: userData.name || "Seeker",
      language: userData.language || "en",
      date: new Date().toLocaleDateString('en-IN'),
      ascendant: astroDetails.ascendant,
      moonSign: astroDetails.sign,
      basic: {
        name: userData.name, dob: `${userData.day}/${userData.month}/${userData.year}`,
        tob: `${userData.hour}:${userData.min}`, pob: userData.pob || "Coordinates used",
        gender: userData.gender || "Not Specified", lat: userData.lat, lon: userData.lon,
        sunrise: astroDetails.sunrise, sunset: astroDetails.sunset, ayanamsa: astroDetails.ayanamsa
      },
      panchang: {
        ascendant: astroDetails.ascendant, moonSign: astroDetails.sign, sunSign: astroDetails.sun_sign,
        nakshatra: astroDetails.Naksahtra, nakshatraPada: astroDetails.NaksahtraLord,
        varna: astroDetails.Varna, vashya: astroDetails.Vashya, yoni: astroDetails.Yoni,
        gana: astroDetails.Gana, nadi: astroDetails.Nadi
      },
      planets: planetsData,
      lagnaAnalysis: aiPredictions.lagnaAnalysis,
      rashiAnalysis: aiPredictions.rashiAnalysis,
      corePersonality: aiPredictions.corePersonality,
      predictions: {
        career: aiPredictions.career, careerHighlights: aiPredictions.careerHighlights,
        relationship: aiPredictions.relationship, relationshipHighlights: aiPredictions.relationshipHighlights,
        health: aiPredictions.health, healthHighlights: aiPredictions.healthHighlights,
        finance: aiPredictions.finance, financeHighlights: aiPredictions.financeHighlights
      },
      doshas: {
        manglik: manglikData ? {
          isPresent: manglikData.manglik_present,
          title: "Manglik Dosha (Kuja Dosha)",
          status: manglikData.manglik_present ? "Active" : "Not Present",
          description: manglikData.manglik_report || "No Manglik Dosha found."
        } : { isPresent: false, title: "Manglik Dosha", status: "N/A", description: "Data unavailable." },
        sadeSati: { isPresent: false, title: "Shani Sade Sati", status: "Not Active", description: "Data unavailable." }
      },
      luckyGem: gemData.LIFE ? gemData.LIFE.name : "Yellow Sapphire",
      dashas: realDashaData
    };

   // Assemble all modular templates in the CORRECT ORDER
    const finalHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Free Vedic Astrology Report - ${reportData.name}</title>
          <style>
              /* Global Watermark Style for all pages */
              body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              .content-wrapper, .cover-border { position: relative; overflow: hidden; }
              .content-wrapper::after, .cover-border::after {
                  content: 'KAALCHAKRA';
                  position: absolute;
                  top: 50%; left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                  font-size: 110px;
                  font-family: 'Georgia', serif; font-weight: bold;
                  color: rgba(161, 73, 59, 0.04);
                  z-index: 0; pointer-events: none;
                  letter-spacing: 15px; white-space: nowrap;
              }
              .content-wrapper > *, .cover-border > * { position: relative; z-index: 1; }
          </style>
      </head>
      <body>
          ${generateCoverPage(reportData)}
          ${generateBirthDetails(reportData)}
          ${generateKundliChart(reportData)}
          ${generateDivisionalCharts(reportData)}
          ${generatePlanetTable(reportData)}
          ${generatePersonalityAnalysis(reportData)}
          ${generateLifePredictions(reportData)}
          ${generateHouseAnalysis(reportData)}
          ${generateYogasAndDoshas(reportData)}
          ${generateDasha(reportData)}
          ${generateRemedies(reportData)}
          ${generateConclusion(reportData)}
      </body>
      </html>
    `;

    // Generate PDF via Puppeteer
    return await generatePDF(finalHtml);
  } catch (error) {
    console.error("Error in generateFreeReport:", error);
    throw new Error("Failed to generate free report.");
  }
};


// ==========================================
// 2. GENERATE PREMIUM REPORT (190+ Pages)
// ==========================================
export const generatePremiumReport = async (userData) => {
  const userId = process.env.ASTROLOGY_USER_ID;
  const apiKey = process.env.ASTROLOGY_API_KEY;
  const auth = Buffer.from(`${userId}:${apiKey}`).toString("base64");
  const apiConfig = { headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" } };

  const payload = {
    day: userData.day, month: userData.month, year: userData.year,
    hour: userData.hour, min: userData.min, lat: userData.lat,
    lon: userData.lon, tzone: userData.tzone
  };

  try {
    console.log("Fetching Astro APIs sequentially for Premium Report...");
    
    // Fetch core API data
    const astroDetailsRes = await axios.post("https://json.astrologyapi.com/v1/astro_details", payload, apiConfig);
    const planetsRes = await axios.post("https://json.astrologyapi.com/v1/planets", payload, apiConfig);
    
    const astroDetails = astroDetailsRes.data;
    const planetsData = planetsRes.data;

    // Fetch AI Predictions with a premium flag (if your aiService supports it)
    const aiPredictions = await generateAIPredictions({
      name: userData.name || "Seeker",
      ascendant: astroDetails.ascendant,
      moonSign: astroDetails.sign,
      sunSign: astroDetails.sun_sign,
      language: userData.language || "en",
      type: "premium" 
    });

    // Format Data (You can add actual API responses here later. The templates have fallbacks to prevent breaking)
    const reportData = {
      name: userData.name || "Seeker",
      language: userData.language || "en",
      date: new Date().toLocaleDateString('en-IN'),
      ascendant: astroDetails.ascendant,
      moonSign: astroDetails.sign,
      basic: {
        name: userData.name, dob: `${userData.day}/${userData.month}/${userData.year}`,
        tob: `${userData.hour}:${userData.min}`, pob: userData.pob || "Coordinates used",
        gender: userData.gender || "Not Specified", lat: userData.lat, lon: userData.lon,
        sunrise: astroDetails.sunrise, sunset: astroDetails.sunset, ayanamsa: astroDetails.ayanamsa
      },
      panchang: {
        ascendant: astroDetails.ascendant, moonSign: astroDetails.sign, sunSign: astroDetails.sun_sign,
        nakshatra: astroDetails.Naksahtra, nakshatraPada: astroDetails.NaksahtraLord,
        varna: astroDetails.Varna, vashya: astroDetails.Vashya, yoni: astroDetails.Yoni,
        gana: astroDetails.Gana, nadi: astroDetails.Nadi
      },
      planets: planetsData,
      // You can append other premium API data here later (e.g., advancedHouses, advancedNakshatras, etc.)
    };

    // Assemble Premium templates in the CORRECT ORDER
    const finalHtml = `
      <!DOCTYPE html>
      <html lang="${reportData.language}">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Kaalchakra Premium Horosocpe - ${reportData.name}</title>
          <style>
              /* Global Watermark Style */
              body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background-color: #fdfbf3; margin: 0; padding: 0;}
              .content-wrapper, .cover-border { position: relative; overflow: hidden; }
              .content-wrapper::after, .cover-border::after {
                  content: 'KAALCHAKRA PREMIUM';
                  position: absolute;
                  top: 50%; left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                  font-size: 80px;
                  font-family: 'Georgia', serif; font-weight: bold;
                  color: rgba(161, 73, 59, 0.03);
                  z-index: 0; pointer-events: none;
                  letter-spacing: 10px; white-space: nowrap;
              }
              .content-wrapper > *, .cover-border > * { position: relative; z-index: 1; }
          </style>
      </head>
      <body>
          ${generateCoverPage(reportData)}
          ${generateBirthDetails(reportData)}
          ${generateExecutiveSummary(reportData)}
          ${generateKundliChart(reportData)}
          ${generateAdvancedPlanets(reportData)}
          ${generateAdvancedHouseAnalysis(reportData)}
          ${generateAdvancedNakshatra(reportData)}
          ${generateAdvancedDivisionalCharts(reportData)}
          ${generateAdvancedCareer(reportData)}
          ${generateAdvancedMarriage(reportData)}
          ${generateAdvancedPsychology(reportData)}
          ${generateAdvancedDasha(reportData)}
          ${generateYearlyPredictions(reportData)}
          ${generateAdvancedAIInsights(reportData)}
          ${generateAdvancedConclusion(reportData)}
      </body>
      </html>
    `;

    // Generate Premium PDF via Puppeteer
    return await generatePDF(finalHtml);
  } catch (error) {
    console.error("Error in generatePremiumReport:", error);
    throw new Error("Failed to generate premium report.");
  }
};