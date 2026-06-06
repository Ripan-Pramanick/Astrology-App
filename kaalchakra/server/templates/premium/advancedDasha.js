import { translations } from "../translations.js";

const generateAdvancedDasha = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    let dashaTimeline = data.dashas || data.deepDashas || [];
    
    if (!Array.isArray(dashaTimeline) || dashaTimeline.length === 0) {
        dashaTimeline = [
            { mahadasha: "Jupiter", start: "2010", end: "2026", antardashas: [{ planet: "Saturn", start: "2024", end: "2027" }] },
            { mahadasha: "Saturn", start: "2026", end: "2045", antardashas: [{ planet: "Saturn", start: "2026", end: "2029" }, { planet: "Mercury", start: "2029", end: "2032" }] },
            { mahadasha: "Mercury", start: "2045", end: "2062", antardashas: [{ planet: "Mercury", start: "2045", end: "2048" }] },
            { mahadasha: "Ketu", start: "2062", end: "2069", antardashas: [{ planet: "Ketu", start: "2062", end: "2063" }] },
            { mahadasha: "Venus", start: "2069", end: "2089", antardashas: [{ planet: "Venus", start: "2069", end: "2072" }] },
            { mahadasha: "Sun", start: "2089", end: "2095", antardashas: [{ planet: "Sun", start: "2089", end: "2090" }] },
            { mahadasha: "Moon", start: "2095", end: "2105", antardashas: [{ planet: "Moon", start: "2095", end: "2096" }] },
            { mahadasha: "Mars", start: "2105", end: "2112", antardashas: [{ planet: "Mars", start: "2105", end: "2106" }] },
            { mahadasha: "Rahu", start: "2112", end: "2130", antardashas: [{ planet: "Rahu", start: "2112", end: "2115" }] }
        ];
    }

    const translateVal = (val) => t[val?.toLowerCase()] || val;

    let timelineHtml = '';

    dashaTimeline.forEach((md) => {
        let antardashasHtml = '';
        if (md.antardashas && Array.isArray(md.antardashas)) {
            antardashasHtml = md.antardashas.map(ad => `
                <tr>
                    <td style="font-weight: bold; color: #a1493b;">${translateVal(ad.planet || ad.antardasha)}</td>
                    <td class="text-center">${ad.start || ad.start_date}</td>
                    <td class="text-center">${ad.end || ad.end_date}</td>
                </tr>
            `).join('');
        }

        timelineHtml += `
        <div class="page-container">
            <div class="content-wrapper">
                <div class="section-header">
                    <h2 class="section-title">${t.advDashaTitle || "Detailed Dasha Timeline"}</h2>
                    <div class="gold-line"></div>
                    <p class="section-subtitle">${t.dashaDesc || "The complete unfolding of your karmic planetary periods"}</p>
                </div>
                
                <div class="dasha-table-block">
                    <div class="md-header">
                        <h4>${translateVal(md.mahadasha || md.planet)} ${t.mahadasha || "Mahadasha"}</h4>
                        <span>${md.start || md.start_date} - ${md.end || md.end_date}</span>
                    </div>
                    <table class="ad-table">
                        <thead>
                            <tr>
                                <th>${t.antardasha || "Antardasha (Sub-period)"}</th>
                                <th class="text-center">${t.startDate || "Start Date"}</th>
                                <th class="text-center">${t.endDate || "End Date"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${antardashasHtml || '<tr><td colspan="3" class="text-center">Detailed Antardashas will be populated from API</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    });

    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background-color: #fdfbf3; color: #4a4a4a; width: 210mm; }
        /* 🌟 প্রতিটি মহাদশা একটি নতুন পেজে প্রিন্ট হবে */
        .page-container { padding: 20mm; width: 210mm; min-height: 297mm; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; min-height: calc(297mm - 40mm); border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; }
        .section-header { text-align: center; margin-bottom: 25px; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; margin-bottom: 30px; }
        .dasha-table-block { border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 4px; overflow: hidden; flex-grow: 1; }
        .md-header { background-color: rgba(161, 73, 59, 0.1); padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(161, 73, 59, 0.2); }
        .md-header h4 { color: #a1493b; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; margin:0;}
        .md-header span { font-family: 'Arial', sans-serif; font-size: 15px; font-weight: bold; color: #555; }
        .ad-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 14.5px; }
        .ad-table th { text-align: left; padding: 15px 20px; color: #707070; background-color: #fcfcfc; border-bottom: 1px solid #eee; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
        .ad-table td { padding: 15px 20px; border-bottom: 1px dashed #eee; color: #4a4a4a; }
        .text-center { text-align: center; }
    </style>
    ${timelineHtml}
    `;
};

export default generateAdvancedDasha;