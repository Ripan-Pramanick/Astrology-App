import { translations } from "../translations.js";

const generateAdvancedDivisionalCharts = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // SVG Chart Drawing Logic (Reused from free template)
    const C = 100 / 350;
    const HOUSES_POLYGONS = [
        { num: 1, points: "50,2.86 73.57,26.43 50,50 26.43,26.43" }, { num: 2, points: "2.86,2.86 50,2.86 26.43,26.43" }, { num: 3, points: "2.86,2.86 26.43,26.43 2.86,50" }, { num: 4, points: "2.86,50 26.43,26.43 50,50 26.43,73.57" }, { num: 5, points: "2.86,50 26.43,73.57 2.86,97.14" }, { num: 6, points: "2.86,97.14 26.43,73.57 50,97.14" }, { num: 7, points: "50,97.14 26.43,73.57 50,50 73.57,73.57" }, { num: 8, points: "50,97.14 73.57,73.57 97.14,97.14" }, { num: 9, points: "97.14,97.14 73.57,73.57 97.14,50" }, { num: 10, points: "97.14,50 73.57,73.57 50,50 73.57,26.43" }, { num: 11, points: "97.14,50 73.57,26.43 97.14,2.86" }, { num: 12, points: "97.14,2.86 73.57,26.43 50,2.86" },
    ];
    const SIGN_POSITIONS = { 1: {x:175*C,y:158.5*C}, 2: {x:92.5*C,y:76*C}, 3: {x:76*C,y:92.5*C}, 4: {x:158.5*C,y:175*C}, 5: {x:76*C,y:257.5*C}, 6: {x:92.5*C,y:274*C}, 7: {x:175*C,y:191.5*C}, 8: {x:257.5*C,y:274*C}, 9: {x:274*C,y:257.5*C}, 10: {x:191.5*C,y:175*C}, 11: {x:274*C,y:92.5*C}, 12: {x:257.5*C,y:76*C} };
    const PLANET_ZONES = { 1: {ax:165*C,ay:91.9*C,cols:2,cw:9,rh:6}, 2: {ax:87.2*C,ay:33*C,cols:2,cw:9,rh:6}, 3: {ax:30*C,ay:92.5*C,cols:1,cw:9,rh:6}, 4: {ax:77.8*C,ay:175*C,cols:1,cw:9,rh:6}, 5: {ax:30*C,ay:257.5*C,cols:1,cw:9,rh:6}, 6: {ax:87.2*C,ay:304*C,cols:2,cw:9,rh:6}, 7: {ax:175*C,ay:259*C,cols:2,cw:9,rh:6}, 8: {ax:254.6*C,ay:304*C,cols:2,cw:9,rh:6}, 9: {ax:320*C,ay:257.5*C,cols:1,cw:9,rh:6}, 10: {ax:272*C,ay:175*C,cols:1,cw:9,rh:6}, 11: {ax:297*C,ay:92.5*C,cols:1,cw:9,rh:6}, 12: {ax:258*C,ay:40*C,cols:2,cw:9,rh:6} };
    const ZODIAC_NUM = { "Aries":1,"Taurus":2,"Gemini":3,"Cancer":4,"Leo":5,"Virgo":6,"Libra":7,"Scorpio":8,"Sagittarius":9,"Capricorn":10,"Aquarius":11,"Pisces":12 };

    const PLANET_SHORT = { "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me", "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke" };

    const drawChart = (chartConfig) => {
        const ascIdx = ZODIAC_NUM[chartConfig.ascendant] || 1;
        const planetsByHouse = { 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[], 10:[], 11:[], 12:[] };
        
        if (chartConfig.planets && Array.isArray(chartConfig.planets)) {
            chartConfig.planets.forEach(p => {
                if (!PLANET_SHORT[p.name]) return;
                let houseNum = parseInt(p.house);
                if (houseNum >= 1 && houseNum <= 12) planetsByHouse[houseNum].push(p);
            });
        }

        let svgPolygons = '', svgRashiText = '', svgPlanetsText = '';
        HOUSES_POLYGONS.forEach(h => {
            const isLagna = h.num === 1;
            svgPolygons += `<polygon points="${h.points}" fill="${isLagna?'rgba(161, 73, 59, 0.08)':'#ffffff'}" stroke="#a1493b" stroke-width="0.5" stroke-linejoin="round" />`;
            const pos = SIGN_POSITIONS[h.num];
            svgRashiText += `<text x="${pos.x}" y="${pos.y}" font-size="4.5" text-anchor="middle" dominant-baseline="central" fill="#a1493b" font-weight="bold">${((ascIdx-1+h.num-1)%12)+1}</text>`;
            
            const ps = planetsByHouse[h.num] || [];
            if (ps.length > 0) {
                const { ax, ay, cols, cw, rh } = PLANET_ZONES[h.num];
                const rows = [];
                for (let i = 0; i < ps.length; i += cols) rows.push(ps.slice(i, i+cols));
                rows.forEach((row, rowIdx) => {
                    const rowY = ay + rowIdx * rh;
                    const rowHalfW = ((row.length - 1) * cw) / 2;
                    row.forEach((p, colIdx) => {
                        const shortName = PLANET_SHORT[p.name] || p.name.slice(0, 2);
                        const px = ax - rowHalfW + colIdx * cw;
                        svgPlanetsText += `<text x="${px}" y="${rowY}" font-size="4" text-anchor="middle" dominant-baseline="central" fill="#4a4a4a" font-weight="bold">${shortName}</text>`;
                    });
                });
            }
        });
        return `<svg viewBox="0 0 100 100">${svgPolygons}${svgRashiText}${svgPlanetsText}</svg>`;
    };

    // Fallback data for Premium Varga Charts
    const vargas = data.advancedVargas || [
        { 
            id: "D-2", 
            title: "Hora Chart", 
            focus: "Wealth, Assets & Financial Prosperity",
            ascendant: "Cancer", 
            planets: [], // API will populate
            analysis: "The Hora chart divides each sign into two halves, ruled by the Sun and Moon. Your D-2 chart shows a strong influence of lunar energy, indicating that your wealth is closely tied to your emotional well-being and public connections. Assets related to liquids, real estate, or nurturing services will bring you the most prosperity."
        },
        { 
            id: "D-9", 
            title: "Navamsa Chart", 
            focus: "Marriage, Dharma & Subconscious Self",
            ascendant: "Libra", 
            planets: [], 
            analysis: "Navamsa is the most critical divisional chart. With Libra ascending, your soul's journey is heavily focused on partnerships and finding balance. Planets that are weak in your D-1 chart but strong here show hidden blessings that will manifest after marriage or in the second half of life."
        }
        // API will provide D-3, D-4, D-7, D-10, D-12, D-60 etc.
    ];

    let pagesHtml = '';

    vargas.forEach((varga, index) => {
        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    ${index === 0 ? `
                    <div class="section-header">
                        <h2 class="section-title">Advanced Divisional Charts</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">Microscopic analysis of specific life events through Varga Kundlis</p>
                    </div>
                    ` : '<div style="height: 15mm;"></div>'}

                    <div class="varga-layout">
                        <div class="chart-column">
                            <div class="varga-title-box">
                                <h3 class="varga-title">${varga.title} (${varga.id})</h3>
                                <div class="varga-focus">${varga.focus}</div>
                            </div>
                            <div class="premium-chart-container">
                                ${drawChart(varga)}
                            </div>
                        </div>
                        
                        <div class="analysis-column">
                            <h4 class="analysis-heading">Varga Deep Analysis</h4>
                            <div class="analysis-content">
                                <p>${varga.analysis}</p>
                            </div>
                            
                            <div class="varga-highlights">
                                <div class="highlight-row">
                                    <span class="hl-label">Lagna Lord (D-1):</span>
                                    <span class="hl-value">To be calculated</span>
                                </div>
                                <div class="highlight-row">
                                    <span class="hl-label">Varga Lagna Lord:</span>
                                    <span class="hl-value">To be calculated</span>
                                </div>
                            </div>
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

        .varga-layout { display: flex; flex-direction: column; flex-grow: 1; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; overflow: hidden; background-color: #fdfbf3; }
        
        .chart-column { display: flex; flex-direction: column; align-items: center; padding: 25px; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); background-color: #ffffff; }
        .varga-title-box { text-align: center; margin-bottom: 20px; }
        .varga-title { font-size: 22px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; }
        .varga-focus { font-family: 'Arial', sans-serif; font-size: 12px; background-color: rgba(161, 73, 59, 0.1); color: #a1493b; padding: 4px 12px; border-radius: 20px; margin-top: 8px; display: inline-block; font-weight: bold; }
        
        .premium-chart-container { width: 110mm; height: 110mm; border: 1px solid rgba(161, 73, 59, 0.3); padding: 4mm; box-shadow: 0 4px 15px rgba(0,0,0,0.03); background-color: #ffffff; }
        svg { width: 100%; height: 100%; display: block; }

        .analysis-column { padding: 25px; display: flex; flex-direction: column; flex-grow: 1; }
        .analysis-heading { font-size: 15px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-left: 3px solid #a1493b; padding-left: 10px; }
        .analysis-content { font-family: 'Arial', sans-serif; font-size: 14.5px; line-height: 1.8; color: #555555; text-align: justify; flex-grow: 1; }

        .varga-highlights { margin-top: 20px; background-color: #ffffff; border: 1px solid rgba(161, 73, 59, 0.15); border-radius: 4px; padding: 15px; font-family: 'Arial', sans-serif; }
        .highlight-row { display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dashed #eee; padding-bottom: 5px; font-size: 13px; }
        .highlight-row:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
        .hl-label { color: #707070; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
        .hl-value { font-weight: bold; color: #4a4a4a; }
    </style>
    ${pagesHtml}
    `;
};

export default generateAdvancedDivisionalCharts;