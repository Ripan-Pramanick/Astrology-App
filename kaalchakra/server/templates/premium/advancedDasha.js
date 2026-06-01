import { translations } from "../translations.js";
const generateAdvancedDasha = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // Fallback data for Premium Dasha Analysis
    const currentDasha = data.currentDasha || {
        mahadasha: "Jupiter",
        antardasha: "Saturn",
        startDate: "15-Aug-2024",
        endDate: "27-Feb-2027",
        aiAnalysis: "You are currently undergoing the Mahadasha of Jupiter and the Antardasha of Saturn. Jupiter brings expansion, wisdom, and opportunities, while Saturn demands discipline, hard work, and structure. This period might feel like a push-and-pull between wanting to expand rapidly and facing delays. However, it is an excellent time for long-term investments and building a solid career foundation. Patience and ethical conduct will yield maximum benefits.",
        keyThemes: ["Career Structuring", "Financial Prudence", "Spiritual Maturation"]
    };

    const dashaTimeline = data.dashaTimeline || [
        {
            mahadasha: "Jupiter",
            start: "2010",
            end: "2026",
            antardashas: [
                { planet: "Saturn", start: "15-Aug-2024", end: "27-Feb-2027" },
                { planet: "Mercury", start: "27-Feb-2027", end: "04-Jun-2029" }
            ]
        },
        {
            mahadasha: "Saturn",
            start: "2026",
            end: "2045",
            antardashas: [
                { planet: "Saturn", start: "04-Jun-2029", end: "07-Jun-2032" },
                { planet: "Mercury", start: "07-Jun-2032", end: "16-Feb-2035" }
            ]
        }
    ];

    const translateVal = (val) => t[val.toLowerCase()] || val;

    const themesHtml = currentDasha.keyThemes.map(theme => `<span class="theme-pill">✧ ${theme}</span>`).join('');

    const timelineHtml = dashaTimeline.map(md => `
        <div class="dasha-table-block">
            <div class="md-header">
                <h4>${translateVal(md.mahadasha)} Mahadasha</h4>
                <span>${md.start} - ${md.end}</span>
            </div>
            <table class="ad-table">
                <thead>
                    <tr>
                        <th>Antardasha (Sub-period)</th>
                        <th class="text-center">Start Date</th>
                        <th class="text-center">End Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${md.antardashas.map(ad => `
                        <tr>
                            <td style="font-weight: bold; color: #a1493b;">${translateVal(ad.planet)}</td>
                            <td class="text-center">${ad.start}</td>
                            <td class="text-center">${ad.end}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `).join('');

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

        /* Current Dasha Analysis Box */
        .current-dasha-box { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; padding: 25px; margin-bottom: 30px; }
        .current-dasha-title { font-size: 20px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; text-align: center; }
        .current-dasha-period { font-family: 'Arial', sans-serif; font-size: 13px; color: #707070; text-align: center; margin-bottom: 20px; }
        .analysis-text { font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.8; color: #555555; text-align: justify; margin-bottom: 20px; }
        
        .theme-container { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; border-top: 1px dashed rgba(161, 73, 59, 0.3); padding-top: 15px; }
        .theme-pill { font-family: 'Arial', sans-serif; font-size: 12.5px; background-color: rgba(161, 73, 59, 0.05); color: #a1493b; padding: 6px 15px; border-radius: 20px; border: 1px solid rgba(161, 73, 59, 0.2); font-weight: bold; }

        /* Timeline Tables */
        .dasha-table-block { margin-bottom: 20px; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 4px; overflow: hidden; page-break-inside: avoid; }
        .md-header { background-color: rgba(161, 73, 59, 0.1); padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(161, 73, 59, 0.2); }
        .md-header h4 { color: #a1493b; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
        .md-header span { font-family: 'Arial', sans-serif; font-size: 13px; font-weight: bold; color: #555; }
        
        .ad-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 13.5px; }
        .ad-table th { text-align: left; padding: 10px 20px; color: #707070; background-color: #fcfcfc; border-bottom: 1px solid #eee; font-weight: normal; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
        .ad-table td { padding: 10px 20px; border-bottom: 1px dashed #eee; color: #4a4a4a; }
        .ad-table tr:last-child td { border-bottom: none; }
        .text-center { text-align: center; }
    </style>

    <!-- Page 1: Deep Analysis of Current Dasha -->
    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.vimshottariDasha || "Advanced Dasha Analysis"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.dashaDesc || "The unfolding of your karma through planetary periods"}</p>
            </div>

            <div class="current-dasha-box">
                <h3 class="current-dasha-title">Current Period: ${translateVal(currentDasha.mahadasha)} - ${translateVal(currentDasha.antardasha)}</h3>
                <div class="current-dasha-period">${currentDasha.startDate} to ${currentDasha.endDate}</div>
                <p class="analysis-text">${currentDasha.aiAnalysis}</p>
                <div class="theme-container">
                    ${themesHtml}
                </div>
            </div>
            
            <h3 style="font-size: 18px; color: #4a4a4a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-left: 4px solid #a1493b; padding-left: 10px;">Dasha Timeline</h3>
            ${timelineHtml}
        </div>
    </div>
    `;
};

export default generateAdvancedDasha;