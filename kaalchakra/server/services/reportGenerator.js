import axios from "axios";
import { generatePDF } from "./pdfService.js";
import { generateAIPredictions } from "./aiService.js";

// --- Free Report Templates ---
import generateCoverPage from "../templates/free/cover.js";
import generateBirthDetails from "../templates/free/birthDetails.js";
import generateKundliChart from "../templates/free/kundliChart.js";
import generatePlanetTable from "../templates/free/planetTable.js";
import generatePersonalityAnalysis from "../templates/free/personality.js";
import generateRemedies from "../templates/free/remedies.js";
import generateConclusion from "../templates/free/conclusion.js";
import generateFooter from "../templates/free/footer.js";

// --- Premium Report Templates ---
import generateExecutiveSummary from "../templates/premium/executiveSummary.js";
import generateAdvancedPlanets from "../templates/premium/advancedPlanets.js";
import generateAdvancedHouseAnalysis from "../templates/premium/advancedHouseAnalysis.js";
import generateAdvancedNakshatra from "../templates/premium/advancedNakshatra.js";
import generateAdvancedDasha from "../templates/premium/advancedDasha.js";
import generateYearlyPredictions from "../templates/premium/advancedYearlyPredictions.js";
import generateAdvancedMarriage from "../templates/premium/advancedMarriage.js";
import generateAdvancedCareer from "../templates/premium/advancedCareer.js";
import generateAdvancedPsychology from "../templates/premium/advancedPsychology.js";
import generateAdvancedAIInsights from "../templates/premium/advancedAIInsights.js";
import generateAdvancedDivisionalCharts from "../templates/premium/advancedDivisionalCharts.js";
import generateAdvancedNumerology from "../templates/premium/advancedNumerology.js"; // 🌟 Numerology Import
import generateAdvancedConclusion from "../templates/premium/advancedConclusion.js";
import generateAdvancedLalkitab from "../templates/premium/advancedLalkitab.js";
import generateAdvancedRemedies from "../templates/premium/advancedRemedies.js";

export const generateReport = async (userData) => {
  try {
    console.log("=== STARTING DIRECT ASTROLOGY API FETCH ===");

    const userId = process.env.ASTROLOGY_USER_ID;
    const apiKey = process.env.ASTROLOGY_API_KEY;
    const auth = Buffer.from(`${userId}:${apiKey}`).toString("base64");
    const apiConfig = { headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" } };

    const payload = {
      day: Number(userData.day) || 1, month: Number(userData.month) || 1, year: Number(userData.year) || 2000,
      hour: Number(userData.hour) || 12, min: Number(userData.min) || 0, lat: Number(userData.lat) || 28.6139,
      lon: Number(userData.lon) || 77.2090, tzone: Number(userData.tzone) || 5.5
    };

    const isPremium = userData.isPremium;
    const language = userData.language || 'en';
    
    let reportData = { name: userData.name || "Seeker", language: language, isPremium: isPremium };

    // 🌟 1. Fetch Basic Data
    console.log("Fetching Basic Data Directly...");
    const [basicRes, planetsRes] = await Promise.all([
        axios.post("https://json.astrologyapi.com/v1/astro_details", payload, apiConfig).catch(() => ({ data: {} })),
        axios.post("https://json.astrologyapi.com/v1/planets", payload, apiConfig).catch(() => ({ data: {} }))
    ]);
    
    reportData.basic = basicRes.data || {};
    reportData.planets = planetsRes.data || [];

    // 🌟 2. Fetch Premium Data
    if (isPremium) {
        console.log("Fetching Deep Premium Data (Dashas, Lalkitab, Numerology, 20-Year Varshaphal)...");
        const currentYear = new Date().getFullYear();
        
        const varshaphalPromises = [];
        for (let i = 0; i < 20; i++) {
            const vPayload = { ...payload, varshaphal_year: currentYear + i };
            varshaphalPromises.push(
                axios.post("https://json.astrologyapi.com/v1/varshaphal_details", vPayload, apiConfig).catch(() => ({ data: {} }))
            );
        }

        // Numerology Payload
        const numeroPayload = {
            day: payload.day, month: payload.month, year: payload.year, name: userData.name || "Seeker"
        };

        const premiumResponses = await Promise.all([
            axios.post("https://json.astrologyapi.com/v1/lalkitab_horoscope", payload, apiConfig).catch(() => ({ data: {} })),
            axios.post("https://json.astrologyapi.com/v1/major_vdasha", payload, apiConfig).catch(() => ({ data: {} })),
            axios.post("https://json.astrologyapi.com/v1/horo_chart_image/D9", payload, apiConfig).catch(() => ({ data: {} })),
            axios.post("https://json.astrologyapi.com/v1/horo_chart_image/D10", payload, apiConfig).catch(() => ({ data: {} })),
            axios.post("https://json.astrologyapi.com/v1/numero_report", numeroPayload, apiConfig).catch(() => ({ data: {} })), // API Call
            ...varshaphalPromises
        ]);

        reportData.lalkitab = premiumResponses[0].data || [];
        reportData.deepDashas = premiumResponses[1].data || [];
        reportData.divisionalCharts = { D9: premiumResponses[2].data || {}, D10: premiumResponses[3].data || {} };
        reportData.numerology = premiumResponses[4].data || {}; // Saved data

        const vResponses = premiumResponses.slice(5);
        reportData.varshaphal = vResponses.map((res, idx) => ({
            year: `${currentYear + idx} - ${currentYear + idx + 1}`,
            ...res.data
        }));

        console.log("✅ Premium Data Fetched Successfully!");
        
        // AI Insights
        try {
            reportData.aiInsights = await generateAIPredictions(reportData, language);
        } catch (e) {
            reportData.aiInsights = "The cosmic energies are aligning in your favor. Focus on your inner strengths.";
        }
    } // <-- এই ব্র্যাকেটটি আগেরবার মিস হয়ে গেছিল!

    let bodyContent = '';

    if (isPremium) {
      // 🚀 PREMIUM REPORT TEMPLATES 
      bodyContent = `
          ${generateCoverPage(reportData)}
          ${generateBirthDetails(reportData)}
          ${generateExecutiveSummary(reportData)}
          ${generateKundliChart(reportData)}
          ${generateAdvancedPlanets(reportData)}
          ${generateAdvancedHouseAnalysis(reportData)}
          ${generateAdvancedNakshatra(reportData)}
          ${generateAdvancedDivisionalCharts(reportData)}
          ${generateAdvancedNumerology(reportData)} ${generateAdvancedLalkitab(reportData)}
          ${generateAdvancedCareer(reportData)}
          ${generateAdvancedMarriage(reportData)}
          ${generateAdvancedPsychology(reportData)} 
          ${generateAdvancedDasha(reportData)}
          ${generateYearlyPredictions(reportData)}
          ${generateAdvancedAIInsights(reportData)}
          ${generateAdvancedRemedies(reportData)}
          ${generateAdvancedConclusion(reportData)}
          ${generateFooter(reportData)}
      `;
    } else {
      // 🎁 FREE REPORT TEMPLATES 
      bodyContent = `
          ${generateCoverPage(reportData)}
          ${generateBirthDetails(reportData)}
          ${generateKundliChart(reportData)}
          ${generatePlanetTable(reportData)}
          ${generatePersonalityAnalysis(reportData)}
          ${generateConclusion(reportData)}
          ${generateRemedies(reportData)}
          ${generateFooter(reportData)}          
      `;
    }

    // HTML Structure
    const finalHtml = `
      <!DOCTYPE html>
      <html lang="${language || 'en'}">
      <head>
          <meta charset="UTF-8">
          <title>Kundli Report - ${reportData.name}</title>
          <style>
              body { margin: 0; padding: 0; background-color: #fdfbf3; }
              .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; font-family: 'Georgia', serif; font-weight: bold; color: rgba(161, 73, 59, 0.03); z-index: 0; pointer-events: none; letter-spacing: 10px; white-space: nowrap; }
              .content-wrapper > *, .cover-border > * { position: relative; z-index: 1; }
          </style>
      </head>
      <body>
          ${bodyContent}
      </body>
      </html>
    `;

    // 🌟 Generate PDF
    const pdfData = await generatePDF(finalHtml);
    return Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);

  } catch (error) {
    console.error("Error generating report:", error.message);
    throw new Error("Failed to generate report");
  }
};

// Wrappers
export const generateFreeReport = async (userDetails) => {
    return await generateReport({ ...userDetails, isPremium: false });
};

export const generatePremiumReport = async (userDetails) => {
    return await generateReport({ ...userDetails, isPremium: true });
};