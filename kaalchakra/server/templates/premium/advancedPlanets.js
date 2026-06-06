import { translations } from "../translations.js";

const generateAdvancedPlanets = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const planets = [
        { name: "Sun (Surya)", role: "Soul, Ego, Father, Authority", meaning: "The Sun represents your core identity, vitality, and your conscious mind." },
        { name: "Moon (Chandra)", role: "Mind, Emotions, Mother", meaning: "The Moon rules your deepest feelings, instincts, and how you nurture yourself." },
        { name: "Mars (Mangal)", role: "Energy, Action, Courage", meaning: "Mars indicates your drive, ambition, and how you assert yourself in the world." },
        { name: "Mercury (Budh)", role: "Intellect, Communication", meaning: "Mercury governs your logic, reasoning, and how you process information." },
        { name: "Jupiter (Guru)", role: "Wisdom, Expansion, Luck", meaning: "Jupiter is the planet of abundance, philosophy, and spiritual growth." },
        { name: "Venus (Shukra)", role: "Love, Beauty, Wealth", meaning: "Venus dictates your aesthetic sense, romantic life, and material comforts." },
        { name: "Saturn (Shani)", role: "Karma, Discipline, Lessons", meaning: "Saturn represents your boundaries, responsibilities, and karmic tests." },
        { name: "Rahu (North Node)", role: "Desires, Obsession, Illusion", meaning: "Rahu shows where you have insatiable worldly desires and where you must grow." },
        { name: "Ketu (South Node)", role: "Spirituality, Past Karma", meaning: "Ketu represents past life mastery, detachment, and spiritual liberation." }
    ];

    let pagesHtml = '';

    planets.forEach((planet, index) => {
        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    <div class="section-header">
                        <h2 class="section-title">${t.planetAnalysis || "Detailed Planetary Analysis"}</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">${planet.name}</p>
                    </div>

                    <div class="planet-box">
                        <h3 class="planet-heading">Astrological Role: ${planet.role}</h3>
                        <p class="planet-text" style="margin-top: 15px;">
                            ${planet.meaning} The position of ${planet.name.split(" ")[0]} in your specific birth chart modifies these natural significations based on its house placement, zodiac sign, and aspects from other planets.
                        </p>
                        
                        <div style="margin-top: 30px; background-color: rgba(161,73,59,0.05); padding: 20px; border-left: 4px solid #a1493b;">
                            <h4 style="color:#a1493b; font-size:16px; margin-bottom:10px;">Cosmic Influence</h4>
                            <p style="font-family:'Arial', sans-serif; font-size:14px; color:#555; line-height:1.7;">
                                During the Mahadasha or Antardasha of this planet, its fundamental qualities will dominate your life events. If well-placed, it brings out the highest positive traits associated with it. If afflicted, it requires conscious karmic work and specific remedies to harmonize its energy.
                            </p>
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
        .section-subtitle { font-size: 16px; color: #707070; font-style: italic; font-weight: bold; }
        .planet-box { padding: 25px; background-color: #fcfcfc; border: 1px solid rgba(161,73,59,0.2); border-radius: 6px; flex-grow: 1; }
        .planet-heading { font-size: 18px; color: #a1493b; margin-bottom: 15px; border-bottom: 1px dashed #ccc; padding-bottom: 10px; }
        .planet-text { font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.8; color: #4a4a4a; text-align: justify; }
    </style>
    ${pagesHtml}
    `;
};

export default generateAdvancedPlanets;