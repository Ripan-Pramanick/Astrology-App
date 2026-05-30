import { translations } from "../translations.js";

const generatePlanetTable = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const getZodiacSymbol = (sign) => {
        const symbols = { 'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏', 'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓' };
        return symbols[sign] || '';
    };

    // 🌟 রাশির নাম অনুযায়ী অধিপতি (Lord) বের করা
    const getSignLord = (sign) => {
        const lords = {
            'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
            'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
            'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
        };
        const lordEn = lords[sign];
        if (!lordEn) return '-';
        // অধিপতি গ্রহের নামকে বাংলা/হিন্দিতে ট্রান্সলেট করা হচ্ছে
        return t[lordEn.toLowerCase()] || lordEn;
    };

    const formatDegree = (degreeVal) => {
        if (!degreeVal) return "0° 00' 00\"";
        const num = parseFloat(degreeVal);
        const deg = Math.floor(num);
        const min = Math.floor((num - deg) * 60);
        const sec = Math.floor((((num - deg) * 60) - min) * 60);
        return `${deg}° ${min.toString().padStart(2, '0')}' ${sec.toString().padStart(2, '0')}"`;
    };

    let planetsHtml = '';
    if (data.planets && Array.isArray(data.planets)) {
        planetsHtml = data.planets.map(planet => {
            const symbol = getZodiacSymbol(planet.sign);
            const degreeText = formatDegree(planet.normDegree || planet.degree);
            const statusLabel = planet.isAscendant ? 
                `<span class="status-lagna">${t.ascendant.split(' ')[0]}</span>` : 
                (planet.retrograde ? `<span class="status-retro">${t.retrograde} (R)</span>` : `<span class="status-direct">${t.direct}</span>`);

            const planetNameTranslated = t[planet.name.toLowerCase()] || planet.name;
            const signNameTranslated = t[planet.sign.toLowerCase()] || planet.sign;
            
            // 🌟 API থেকে Lord না এলে আমাদের লজিক থেকে Lord নিয়ে নেবে
            const calculatedLord = planet.lord ? (t[planet.lord.toLowerCase()] || planet.lord) : getSignLord(planet.sign);

            return `
                <tr>
                    <td class="planet-name">${planetNameTranslated}</td>
                    <td><span class="zodiac-symbol">${symbol}</span> ${signNameTranslated}</td>
                    <td class="text-center">${planet.house}</td>
                    <td class="font-mono">${degreeText}</td>
                    <td style="font-weight: 500; color: #4a4a4a;">${calculatedLord}</td>
                    <td class="text-center">${statusLabel}</td>
                </tr>
            `;
        }).join('');
    }

    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background-color: #fdfbf3; color: #4a4a4a; width: 210mm; height: 297mm; }
        .page-container { padding: 20mm; width: 100%; height: 100%; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; height: 100%; border-radius: 4px; background-color: #ffffff; }
        .section-header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid rgba(161, 73, 59, 0.3); padding-bottom: 15px; }
        .section-title { font-size: 28px; color: #a1493b; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 5px; }
        .section-subtitle { font-size: 14px; color: #707070; letter-spacing: 1px; }
        .planet-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-family: 'Arial', sans-serif; font-size: 13px; }
        .planet-table th { background-color: rgba(161, 73, 59, 0.1); color: #a1493b; text-transform: uppercase; letter-spacing: 1px; padding: 12px 10px; text-align: left; border-bottom: 2px solid #a1493b; font-weight: bold; }
        .planet-table td { padding: 12px 10px; border-bottom: 1px solid #e0e0e0; color: #4a4a4a; }
        .planet-table tr:nth-child(even) { background-color: #f9f9f9; }
        .text-center { text-align: center; } .font-mono { font-family: 'Courier New', monospace; letter-spacing: 0.5px; }
        .planet-name { font-weight: bold; color: #a1493b; } .zodiac-symbol { font-size: 16px; color: #a1493b; margin-right: 5px; }
        .status-lagna { color: #1e3a8a; font-weight: bold; font-size: 11px; text-transform: uppercase; }
        .status-retro { color: #b91c1c; font-weight: bold; font-size: 11px; text-transform: uppercase; }
        .status-direct { color: #15803d; font-weight: bold; font-size: 11px; text-transform: uppercase; }
        .footer-note { margin-top: 30px; font-size: 11px; color: #666666; font-style: italic; text-align: justify; line-height: 1.5; border-top: 1px dashed rgba(161, 73, 59, 0.2); padding-top: 15px; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.planetaryPositions}</h2>
                <div class="section-subtitle">${t.astrologicalCoordinates}</div>
            </div>
            <table class="planet-table">
                <thead>
                    <tr>
                        <th>${t.planet}</th>
                        <th>${t.sign}</th>
                        <th class="text-center">${t.house}</th>
                        <th>${t.degree}</th>
                        <th>${t.lord}</th>
                        <th class="text-center">${t.status}</th>
                    </tr>
                </thead>
                <tbody>${planetsHtml}</tbody>
            </table>
            <div class="footer-note">
                <span style="color: #a1493b;">✨ Note:</span> House positions are calculated relative to the Lagna (Ascendant). Degrees reflect the accurate sidereal (Nirayana) positions utilizing the Lahiri Ayanamsa. Calculations are dynamically generated for <strong>${data.name || 'Seeker'}</strong>.
            </div>
        </div>
    </div>
    `;
};

export default generatePlanetTable;