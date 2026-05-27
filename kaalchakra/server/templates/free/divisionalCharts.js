import { translations } from "../translations.js";

const generateDivisionalCharts = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const C = 100 / 350;
    const HOUSES_POLYGONS = [
        { num: 1, points: "50,2.86 73.57,26.43 50,50 26.43,26.43" }, { num: 2, points: "2.86,2.86 50,2.86 26.43,26.43" }, { num: 3, points: "2.86,2.86 26.43,26.43 2.86,50" }, { num: 4, points: "2.86,50 26.43,26.43 50,50 26.43,73.57" }, { num: 5, points: "2.86,50 26.43,73.57 2.86,97.14" }, { num: 6, points: "2.86,97.14 26.43,73.57 50,97.14" }, { num: 7, points: "50,97.14 26.43,73.57 50,50 73.57,73.57" }, { num: 8, points: "50,97.14 73.57,73.57 97.14,97.14" }, { num: 9, points: "97.14,97.14 73.57,73.57 97.14,50" }, { num: 10, points: "97.14,50 73.57,73.57 50,50 73.57,26.43" }, { num: 11, points: "97.14,50 73.57,26.43 97.14,2.86" }, { num: 12, points: "97.14,2.86 73.57,26.43 50,2.86" },
    ];
    const SIGN_POSITIONS = { 1: {x:175*C,y:158.5*C}, 2: {x:92.5*C,y:76*C}, 3: {x:76*C,y:92.5*C}, 4: {x:158.5*C,y:175*C}, 5: {x:76*C,y:257.5*C}, 6: {x:92.5*C,y:274*C}, 7: {x:175*C,y:191.5*C}, 8: {x:257.5*C,y:274*C}, 9: {x:274*C,y:257.5*C}, 10: {x:191.5*C,y:175*C}, 11: {x:274*C,y:92.5*C}, 12: {x:257.5*C,y:76*C} };
    const PLANET_ZONES = { 1: {ax:165*C,ay:91.9*C,cols:2,cw:9,rh:6}, 2: {ax:87.2*C,ay:33*C,cols:2,cw:9,rh:6}, 3: {ax:30*C,ay:92.5*C,cols:1,cw:9,rh:6}, 4: {ax:77.8*C,ay:175*C,cols:1,cw:9,rh:6}, 5: {ax:30*C,ay:257.5*C,cols:1,cw:9,rh:6}, 6: {ax:87.2*C,ay:304*C,cols:2,cw:9,rh:6}, 7: {ax:175*C,ay:259*C,cols:2,cw:9,rh:6}, 8: {ax:254.6*C,ay:304*C,cols:2,cw:9,rh:6}, 9: {ax:320*C,ay:257.5*C,cols:1,cw:9,rh:6}, 10: {ax:272*C,ay:175*C,cols:1,cw:9,rh:6}, 11: {ax:297*C,ay:92.5*C,cols:1,cw:9,rh:6}, 12: {ax:258*C,ay:40*C,cols:2,cw:9,rh:6} };
    const ZODIAC_NUM = { "Aries":1,"Taurus":2,"Gemini":3,"Cancer":4,"Leo":5,"Virgo":6,"Libra":7,"Scorpio":8,"Sagittarius":9,"Capricorn":10,"Aquarius":11,"Pisces":12 };

    const PLANET_SHORT = {
        "Sun": t.sunShort, "Moon": t.moonShort, "Mars": t.marsShort, "Mercury": t.mercuryShort,
        "Jupiter": t.jupiterShort, "Venus": t.venusShort, "Saturn": t.saturnShort, "Rahu": t.rahuShort, "Ketu": t.ketuShort
    };

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
            svgPolygons += `<polygon points="${h.points}" fill="${isLagna?'rgba(161, 73, 59, 0.1)':'transparent'}" stroke="#a1493b" stroke-width="0.5" stroke-linejoin="round" />`;
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
        return `
            <div class="chart-block">
                <div class="chart-header">
                    <h3 class="chart-title">${chartConfig.title}</h3>
                    <div class="chart-subtitle">${chartConfig.subtitle}</div>
                </div>
                <div class="chart-container">
                    <svg viewBox="0 0 100 100">${svgPolygons}${svgRashiText}${svgPlanetsText}</svg>
                </div>
            </div>
        `;
    };

    const d9Planets = data.d9Planets || data.planets;
    const d10Planets = data.d10Planets || data.planets; 
    const chartConfigs = [
        { title: t.navamsaChart || "Navamsa Chart (D-9)", subtitle: t.navamsaDesc || "Marriage, Inner Self & Dharma", ascendant: "Taurus", planets: d9Planets },
        { title: t.dasamsaChart || "Dasamsa Chart (D-10)", subtitle: t.dasamsaDesc || "Career, Power & Achievements", ascendant: "Leo", planets: d10Planets }
    ];

    const pagesHtml = chartConfigs.map((config, index) => `
        <div class="page-container">
            <div class="content-wrapper">
                ${index === 0 ? `
                <div class="section-header">
                    <h2 class="section-title">${t.divisionalCharts || "Divisional Charts"}</h2>
                    <div class="gold-line"></div>
                    <p class="section-subtitle">${t.divisionalChartsDesc || "Micro-analysis of specific life aspects (Vargas)"}</p>
                </div>
                ` : '<div style="height: 25mm;"></div>'}
                <div class="charts-grid">${drawChart(config)}</div>
            </div>
        </div>
    `).join('');

    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background-color: #fdfbf3; color: #4a4a4a; width: 210mm; }
        .page-container { padding: 20mm; width: 210mm; min-height: 297mm; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; min-height: calc(297mm - 40mm); border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; align-items: center; }
        .section-header { text-align: center; margin-bottom: 25px; width: 100%; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; }
        .charts-grid { display: flex; flex-direction: column; width: 100%; align-items: center; justify-content: center; flex-grow: 1; }
        .chart-block { display: flex; flex-direction: column; align-items: center; width: 100%; }
        .chart-header { text-align: center; margin-bottom: 20px; }
        .chart-title { font-size: 24px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; }
        .chart-subtitle { font-size: 14px; color: #666; margin-top: 5px; font-family: 'Arial', sans-serif; }
        .chart-container { width: 130mm; height: 130mm; position: relative; background-color: #ffffff; border: 1px solid rgba(161, 73, 59, 0.2); padding: 5mm; box-shadow: 0 0 15px rgba(0,0,0,0.03); }
        svg { width: 100%; height: 100%; display: block; }
    </style>
    ${pagesHtml}
    `;
};

export default generateDivisionalCharts;