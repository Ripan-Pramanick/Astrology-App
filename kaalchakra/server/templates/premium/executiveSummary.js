import { translations } from "../translations.js";

const generateExecutiveSummary = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;
    
    // Fallback data for the preview
    const panchang = data.panchang || {};
    const summary = data.executiveSummary || {};

    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background-color: #fdfbf3; color: #4a4a4a; width: 210mm; }
        .page-container { padding: 20mm; width: 210mm; min-height: 297mm; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; min-height: calc(297mm - 40mm); border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; }
        .section-header { text-align: center; margin-bottom: 25px; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; }

        .summary-box { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; padding: 20px; margin-bottom: 20px; }
        .summary-title { font-size: 18px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); padding-bottom: 10px; margin-bottom: 15px; }
        .summary-text { font-family: 'Arial', sans-serif; font-size: 14.5px; line-height: 1.8; color: #555; text-align: justify; }

        .highlight-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .highlight-item { background: #fff; padding: 15px; border: 1px solid #eee; border-left: 4px solid #a1493b; border-radius: 4px; }
        .highlight-label { font-size: 11px; color: #707070; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px; }
        .highlight-value { font-size: 16px; color: #a1493b; font-weight: bold; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.executiveSummary || "Executive Summary"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.executiveSummaryDesc || "A premium overview of your cosmic blueprint"}</p>
            </div>

            <!-- Core Astrological Highlights -->
            <div class="highlight-grid">
                <div class="highlight-item">
                    <span class="highlight-label">${t.ascendant || "Ascendant (Lagna)"}</span>
                    <span class="highlight-value">${panchang.ascendant || 'Loading...'}</span>
                </div>
                <div class="highlight-item">
                    <span class="highlight-label">${t.moonSign || "Moon Sign (Rashi)"}</span>
                    <span class="highlight-value">${panchang.moonSign || 'Loading...'}</span>
                </div>
                <div class="highlight-item">
                    <span class="highlight-label">${t.nakshatra || "Birth Star (Nakshatra)"}</span>
                    <span class="highlight-value">${panchang.nakshatra || 'Loading...'}</span>
                </div>
                <div class="highlight-item">
                    <span class="highlight-label">${t.currentDasha || "Current Mahadasha"}</span>
                    <span class="highlight-value">${summary.currentDasha || 'Loading...'}</span>
                </div>
            </div>

            <!-- AI Generated Core Personality -->
            <div class="summary-box">
                <h3 class="summary-title">${t.corePersonality || "Core Personality & Strengths"}</h3>
                <p class="summary-text">${summary.personality || "Your astrological chart indicates a unique blend of energies. Driven by your Ascendant, you possess a natural inclination towards leadership and deep empathy. This summary will be populated dynamically by our AI engine based on your precise planetary degrees."}</p>
            </div>

            <!-- AI Generated Life Focus -->
            <div class="summary-box">
                <h3 class="summary-title">${t.lifeFocus || "Primary Life Focus"}</h3>
                <p class="summary-text">${summary.lifeFocus || "The current planetary transits and your Dasha period suggest that your karmic path is currently focused on career expansion, personal growth, and establishing a secure foundation for the future."}</p>
            </div>
            
            <div class="summary-box" style="background-color: transparent; border: none; text-align: center; margin-top: auto; padding-bottom: 0;">
                <p style="font-family: 'Arial', sans-serif; font-size: 12px; color: #888; font-style: italic;">
                    *This is an executive summary. Detailed micro-analysis of each aspect is provided in the subsequent pages of this premium report.
                </p>
            </div>
        </div>
    </div>
    `;
};

export default generateExecutiveSummary;