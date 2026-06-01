import { translations } from "../translations.js";

const generateAdvancedPlanets = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // Fallback data for preview/testing
    const planets = data.advancedPlanets || [
        { name: "Sun", sign: "Aries", degree: "15°20'", nakshatra: "Ashwini", pada: 1, dignity: "Exalted", status: "Direct" },
        { name: "Moon", sign: "Taurus", degree: "27°10'", nakshatra: "Mrigashira", pada: 2, dignity: "Exalted", status: "Direct" },
        { name: "Mars", sign: "Cancer", degree: "05°45'", nakshatra: "Pushya", pada: 4, dignity: "Debilitated", status: "Retrograde" },
        { name: "Mercury", sign: "Pisces", degree: "12°30'", nakshatra: "Uttara Bhadrapada", pada: 3, dignity: "Debilitated", status: "Combust" },
        { name: "Jupiter", sign: "Cancer", degree: "20°00'", nakshatra: "Ashlesha", pada: 1, dignity: "Exalted", status: "Direct" },
        { name: "Venus", sign: "Pisces", degree: "25°15'", nakshatra: "Revati", pada: 3, dignity: "Exalted", status: "Direct" },
        { name: "Saturn", sign: "Libra", degree: "18°40'", nakshatra: "Swati", pada: 4, dignity: "Exalted", status: "Retrograde" },
        { name: "Rahu", sign: "Gemini", degree: "10°05'", nakshatra: "Ardra", pada: 2, dignity: "Neutral", status: "Retrograde" },
        { name: "Ketu", sign: "Sagittarius", degree: "10°05'", nakshatra: "Mula", pada: 4, dignity: "Neutral", status: "Retrograde" }
    ];

    // Helper to translate planet and sign names
    const translateVal = (val) => {
        if (!val) return '-';
        return t[val.toLowerCase()] || val;
    };

    const tableRows = planets.map((p, index) => {
        const isEven = index % 2 === 0;
        const rowBg = isEven ? 'background-color: #fafafa;' : 'background-color: #ffffff;';
        
        // Highlight logic for specific statuses
        let statusStyle = "color: #4a4a4a;";
        if (p.status.toLowerCase() === 'retrograde' || p.status.toLowerCase() === 'combust') {
            statusStyle = "color: #b91c1c; font-weight: bold;";
        }
        
        let dignityStyle = "color: #4a4a4a;";
        if (p.dignity.toLowerCase() === 'exalted' || p.dignity.toLowerCase() === 'own house') {
            dignityStyle = "color: #15803d; font-weight: bold;";
        } else if (p.dignity.toLowerCase() === 'debilitated') {
            dignityStyle = "color: #b91c1c; font-weight: bold;";
        }

        return `
            <tr style="${rowBg}">
                <td class="planet-name">${translateVal(p.name)}</td>
                <td class="text-center">${translateVal(p.sign)}</td>
                <td class="text-center" style="font-family: 'Arial', sans-serif;">${p.degree}</td>
                <td class="text-center">${translateVal(p.nakshatra)}</td>
                <td class="text-center">${p.pada}</td>
                <td class="text-center" style="${dignityStyle}">${translateVal(p.dignity)}</td>
                <td class="text-center" style="${statusStyle}">${translateVal(p.status)}</td>
            </tr>
        `;
    }).join('');

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

        .table-wrapper { width: 100%; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; overflow: hidden; margin-top: 10px; }
        .premium-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 12.5px; }
        .premium-table th { background-color: rgba(161, 73, 59, 0.08); color: #a1493b; text-transform: uppercase; letter-spacing: 1px; padding: 12px 10px; border-bottom: 2px solid rgba(161, 73, 59, 0.2); font-weight: bold; }
        .premium-table td { padding: 12px 10px; border-bottom: 1px dashed rgba(0, 0, 0, 0.1); color: #4a4a4a; }
        .premium-table tr:last-child td { border-bottom: none; }
        
        .planet-name { font-weight: bold; color: #a1493b; font-family: 'Georgia', serif; font-size: 14px; }
        .text-center { text-align: center; }

        .info-box { background-color: #fdfbf3; border-left: 4px solid #a1493b; padding: 15px; margin-top: 25px; font-family: 'Arial', sans-serif; font-size: 13px; line-height: 1.6; color: #555; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.advancedPlanets || "Advanced Planetary Analysis"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.advancedPlanetsDesc || "Precise astronomical positions and dignity of planets at your birth"}</p>
            </div>

            <div class="table-wrapper">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th style="text-align: left;">${t.planet || "Planet"}</th>
                            <th class="text-center">${t.sign || "Sign"}</th>
                            <th class="text-center">${t.degree || "Degree"}</th>
                            <th class="text-center">${t.nakshatra || "Nakshatra"}</th>
                            <th class="text-center">${t.pada || "Pada"}</th>
                            <th class="text-center">${t.dignity || "Dignity"}</th>
                            <th class="text-center">${t.status || "Status"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>

            <div class="info-box">
                <strong>${t.note || "Note"}:</strong> ${t.planetNoteDesc || "Planets marked in green are in a strong position (Exalted or Own House), bestowing positive results. Planets marked in red (Debilitated, Combust, or Retrograde) may require specific remedies to mitigate their challenging effects."}
            </div>

        </div>
    </div>
    `;
};

export default generateAdvancedPlanets;