import { translations } from "../translations.js";

const generateAdvancedDivisionalCharts = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const C = 100 / 350;
    const HOUSES_POLYGONS = [
        { num: 1, points: "50,2.86 73.57,26.43 50,50 26.43,26.43" }, { num: 2, points: "2.86,2.86 50,2.86 26.43,26.43" }, { num: 3, points: "2.86,2.86 26.43,26.43 2.86,50" }, { num: 4, points: "2.86,50 26.43,26.43 50,50 26.43,73.57" }, { num: 5, points: "2.86,50 26.43,73.57 2.86,97.14" }, { num: 6, points: "2.86,97.14 26.43,73.57 50,97.14" }, { num: 7, points: "50,97.14 26.43,73.57 50,50 73.57,73.57" }, { num: 8, points: "50,97.14 73.57,73.57 97.14,97.14" }, { num: 9, points: "97.14,97.14 73.57,73.57 97.14,50" }, { num: 10, points: "97.14,50 73.57,73.57 50,50 73.57,26.43" }, { num: 11, points: "97.14,50 73.57,26.43 97.14,2.86" }, { num: 12, points: "97.14,2.86 73.57,26.43 50,2.86" }
    ];
    const SIGN_POSITIONS = { 1: {x:175*C,y:158.5*C}, 2: {x:92.5*C,y:76*C}, 3: {x:76*C,y:92.5*C}, 4: {x:158.5*C,y:175*C}, 5: {x:76*C,y:257.5*C}, 6: {x:92.5*C,y:274*C}, 7: {x:175*C,y:191.5*C}, 8: {x:257.5*C,y:274*C}, 9: {x:274*C,y:257.5*C}, 10: {x:191.5*C,y:175*C}, 11: {x:274*C,y:92.5*C}, 12: {x:257.5*C,y:76*C} };

    const drawChart = () => {
        let svgPolygons = '', svgRashiText = '';
        HOUSES_POLYGONS.forEach(h => {
            const isLagna = h.num === 1;
            svgPolygons += `<polygon points="${h.points}" fill="${isLagna?'rgba(161, 73, 59, 0.08)':'#ffffff'}" stroke="#a1493b" stroke-width="0.5" />`;
            const pos = SIGN_POSITIONS[h.num];
            svgRashiText += `<text x="${pos.x}" y="${pos.y}" font-size="4.5" text-anchor="middle" dominant-baseline="central" fill="#a1493b" font-weight="bold">${h.num}</text>`;
        });
        return `<svg viewBox="0 0 100 100">${svgPolygons}${svgRashiText}</svg>`;
    };

    // 🌟 ১৬টি চার্টের লিস্ট
    const vargas = [
        { id: "D-1", title: "Rasi Chart", focus: "Physical Body & General Life" },
        { id: "D-2", title: "Hora Chart", focus: "Wealth & Prosperity" },
        { id: "D-3", title: "Drekkana", focus: "Siblings & Courage" },
        { id: "D-4", title: "Chaturthamsa", focus: "Property & Fortune" },
        { id: "D-7", title: "Saptamsa", focus: "Children & Progeny" },
        { id: "D-9", title: "Navamsa", focus: "Marriage & Soul's Purpose" },
        { id: "D-10", title: "Dasamsa", focus: "Career & Profession" },
        { id: "D-12", title: "Dvadasamsa", focus: "Parents & Lineage" },
        { id: "D-16", title: "Shodashamsa", focus: "Vehicles & Comforts" },
        { id: "D-20", title: "Vimsamsa", focus: "Spiritual Progress" },
        { id: "D-24", title: "Chaturvimsamsa", focus: "Education & Learning" },
        { id: "D-27", title: "Saptavimsamsa", focus: "Strengths & Weaknesses" },
        { id: "D-30", title: "Trimsamsa", focus: "Misfortunes & Health" },
        { id: "D-40", title: "Khavedamsa", focus: "Auspicious Events" },
        { id: "D-45", title: "Akshavedamsa", focus: "General Character" },
        { id: "D-60", title: "Shashtiamsa", focus: "Past Life Karma" }
    ];

    let pagesHtml = '';

    vargas.forEach((varga) => {
        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    <div class="section-header">
                        <h2 class="section-title">${t.advDivCharts || "Advanced Divisional Charts"}</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">${varga.title} Analysis</p>
                    </div>

                    <div class="varga-layout">
                        <div class="chart-column">
                            <div class="varga-title-box">
                                <h3 class="varga-title">${varga.title} (${varga.id})</h3>
                                <div class="varga-focus">Focus: ${varga.focus}</div>
                            </div>
                            <div class="premium-chart-container">
                                ${drawChart()}
                            </div>
                        </div>
                        
                        <div class="analysis-column">
                            <h4 class="analysis-heading">${t.vargaDeepAnalysis || "Varga Deep Analysis"}</h4>
                            <div class="analysis-content">
                                <p>The ${varga.title} (${varga.id}) is a microscopic division of your birth chart specifically focusing on ${varga.focus}. It reveals the hidden potential, strengths, and karmic blocks related to this specific area of your life.</p>
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
        /* 🌟 প্রতিটি চার্ট একটি নতুন পেজে প্রিন্ট হবে */
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
    </style>
    ${pagesHtml}
    `;
};

export default generateAdvancedDivisionalCharts;