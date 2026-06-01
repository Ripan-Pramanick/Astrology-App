import { translations } from "../translations.js";

const generateYearlyPredictions = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // Fallback data for Premium Yearly Predictions
    const yearlyData = data.yearlyPredictions || [
        {
            year: "2026",
            overview: "A year of significant structural changes and professional growth. Saturn's transit will demand discipline, while Jupiter brings excellent opportunities in the second half. Focus on building a solid foundation rather than seeking quick results.",
            transits: [
                { planet: "Jupiter", transit: "Moves to Leo (5th House) in June", impact: "Highly favorable for creativity, children, and long-term investments." },
                { planet: "Saturn", transit: "Remains in Pisces (12th House)", impact: "Requires careful financial planning and spiritual grounding. Avoid unnecessary expenses." },
                { planet: "Rahu", transit: "Transits Aquarius (11th House)", impact: "Sudden gains through social networks and fulfillment of long-pending desires." }
            ],
            quarters: [
                { q: "Q1 (Jan - Mar)", focus: "Career & Finance", desc: "Expect a heavy workload. This is an excellent time to set boundaries and organize your finances. Avoid impulsive career switches." },
                { q: "Q2 (Apr - Jun)", focus: "Health & Relationships", desc: "Stress might peak due to professional demands. Prioritize mental health and take time to resolve any family disputes amicably." },
                { q: "Q3 (Jul - Sep)", focus: "Growth & Learning", desc: "Jupiter's blessing activates. A great period for learning new skills, starting a side project, or expanding your business." },
                { q: "Q4 (Oct - Dec)", focus: "Travel & Expansion", desc: "Possibility of foreign travel or connecting with international clients. You will end the year on a confident and high note." }
            ]
        }
        // The API will provide data for multiple years (e.g., next 5-10 years)
    ];

    let pagesHtml = '';

    yearlyData.forEach((yr, index) => {
        const transitsHtml = yr.transits.map(tr => `
            <div class="transit-item">
                <div class="transit-planet">${translateVal(tr.planet)}</div>
                <div class="transit-desc">${tr.transit}</div>
                <div class="transit-impact">↳ <strong>Impact:</strong> ${tr.impact}</div>
            </div>
        `).join('');

        const quartersHtml = yr.quarters.map(qtr => `
            <div class="quarter-card">
                <div class="q-header">
                    <span class="q-title">${qtr.q}</span>
                    <span class="q-focus">${qtr.focus}</span>
                </div>
                <p class="q-desc">${qtr.desc}</p>
            </div>
        `).join('');

        const translateVal = (val) => t[val.toLowerCase()] || val;

        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    ${index === 0 ? `
                    <div class="section-header">
                        <h2 class="section-title">${t.yearlyPredictions || "Yearly Forecast"}</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">${t.yearlyDesc || "Your personalized roadmap based on major planetary transits"}</p>
                    </div>
                    ` : '<div style="height: 15mm;"></div>'}

                    <div class="year-block">
                        <div class="year-header">
                            <h3>${t.forecastFor || "Forecast for"} ${yr.year}</h3>
                        </div>
                        
                        <div class="year-overview">
                            <p>${yr.overview}</p>
                        </div>
                        
                        <h4 class="sub-heading">${t.keyTransits || "Key Planetary Transits"}</h4>
                        <div class="transit-container">
                            ${transitsHtml}
                        </div>

                        <h4 class="sub-heading" style="margin-top: 25px;">${t.quarterlyBreakdown || "Quarterly Breakdown"}</h4>
                        <div class="quarters-grid">
                            ${quartersHtml}
                        </div>
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
        .page-container { padding: 20mm; width: 210mm; min-height: 297mm; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; min-height: calc(297mm - 40mm); border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; }
        
        .section-header { text-align: center; margin-bottom: 25px; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; }

        .year-block { display: flex; flex-direction: column; flex-grow: 1; }
        .year-header { background-color: #a1493b; color: #ffffff; padding: 15px; border-radius: 6px 6px 0 0; text-align: center; }
        .year-header h3 { font-size: 22px; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
        
        .year-overview { background-color: #fdfbf3; padding: 20px; border: 1px solid rgba(161, 73, 59, 0.2); border-top: none; margin-bottom: 25px; font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.8; color: #4a4a4a; text-align: justify; }

        .sub-heading { font-size: 18px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-left: 4px solid #a1493b; padding-left: 10px; }

        .transit-container { display: flex; flex-direction: column; gap: 12px; }
        .transit-item { border-left: 3px solid #d4af37; background-color: #fcfcfc; padding: 12px 15px; border-radius: 0 4px 4px 0; font-family: 'Arial', sans-serif; }
        .transit-planet { font-weight: bold; color: #a1493b; font-size: 14px; text-transform: uppercase; margin-bottom: 3px; }
        .transit-desc { font-size: 13.5px; color: #4a4a4a; margin-bottom: 5px; }
        .transit-impact { font-size: 12.5px; color: #15803d; }

        .quarters-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .quarter-card { border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; padding: 15px; background-color: #ffffff; }
        .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); padding-bottom: 8px; }
        .q-title { font-weight: bold; color: #a1493b; font-size: 15px; }
        .q-focus { font-family: 'Arial', sans-serif; font-size: 11px; background-color: rgba(161, 73, 59, 0.1); color: #a1493b; padding: 3px 8px; border-radius: 12px; text-transform: uppercase; font-weight: bold; }
        .q-desc { font-family: 'Arial', sans-serif; font-size: 13.5px; line-height: 1.6; color: #555555; text-align: justify; }
    </style>
    ${pagesHtml}
    `;
};

export default generateYearlyPredictions;