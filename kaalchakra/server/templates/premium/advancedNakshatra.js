import { translations } from "../translations.js";

const generateAdvancedNakshatra = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // Fallback data for 10 Nakshatra Placements (Lagna + 9 Planets)
    const nakshatrasData = data.advancedNakshatras || [
        {
            point: "Ascendant (Lagna)",
            name: "Rohini",
            pada: 2,
            lord: "Moon",
            deity: "Brahma (The Creator)",
            symbol: "Chariot / Ox Cart",
            animal: "Serpent",
            guna: "Rajas",
            element: "Earth",
            aiAnalysis: "Your Ascendant falls in Rohini, a nakshatra of immense growth, beauty, and creativity. You possess a magnetic charm and a strong desire for material stability. Driven by the Moon, your mind is highly fertile and imaginative. However, you must guard against stubbornness and over-attachment to worldly pleasures. You have a natural ability to manifest your desires into reality.",
            strengths: ["Charismatic", "Creative", "Stable", "Manifestor"],
            weaknesses: ["Possessive", "Stubborn", "Materialistic"]
        },
        {
            point: "Moon (Janma Nakshatra)",
            name: "Mrigashira",
            pada: 1,
            lord: "Mars",
            deity: "Soma (Moon God)",
            symbol: "Deer's Head",
            animal: "Serpent",
            guna: "Tamas",
            element: "Earth",
            aiAnalysis: "Your Moon is placed in Mrigashira, making you a constant seeker of knowledge and experience. Like a deer, your mind is highly active, restless, and always searching for the next big thing. You are gentle, highly intelligent, and possess excellent research skills. The influence of Mars gives you the courage to explore unknown territories, but you may struggle with indecisiveness or mental exhaustion.",
            strengths: ["Inquisitive", "Gentle", "Quick-witted", "Adventurous"],
            weaknesses: ["Restless", "Anxious", "Fickle-minded"]
        }
        // The API should provide the rest of the planets (Sun, Mars, Mercury, etc.)
    ];

    let pagesHtml = '';

    nakshatrasData.forEach((nak, index) => {
        const strengthsHtml = nak.strengths.map(s => `<span class="trait-pill strength-pill">✓ ${s}</span>`).join('');
        const weaknessesHtml = nak.weaknesses.map(w => `<span class="trait-pill weakness-pill">✕ ${w}</span>`).join('');

        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    ${index === 0 ? `
                    <div class="section-header">
                        <h2 class="section-title">${t.nakshatraAnalysis || "Nakshatra Deep Dive"}</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">${t.nakshatraDesc || "Cosmic DNA and psychological profiling based on Lunar Mansions"}</p>
                    </div>
                    ` : '<div style="height: 15mm;"></div>'}

                    <div class="nakshatra-block">
                        <div class="nakshatra-header">
                            <div class="nakshatra-point">${nak.point}</div>
                            <h3 class="nakshatra-name">${nak.name} <span class="nakshatra-pada">(Pada ${nak.pada})</span></h3>
                        </div>

                        <div class="nakshatra-grid">
                            <div class="grid-item">
                                <span class="grid-label">Nakshatra Lord</span>
                                <span class="grid-value">${nak.lord}</span>
                            </div>
                            <div class="grid-item">
                                <span class="grid-label">Ruling Deity</span>
                                <span class="grid-value">${nak.deity}</span>
                            </div>
                            <div class="grid-item">
                                <span class="grid-label">Symbol</span>
                                <span class="grid-value">${nak.symbol}</span>
                            </div>
                            <div class="grid-item">
                                <span class="grid-label">Spirit Animal</span>
                                <span class="grid-value">${nak.animal}</span>
                            </div>
                            <div class="grid-item">
                                <span class="grid-label">Guna (Quality)</span>
                                <span class="grid-value">${nak.guna}</span>
                            </div>
                            <div class="grid-item">
                                <span class="grid-label">Element (Tattva)</span>
                                <span class="grid-value">${nak.element}</span>
                            </div>
                        </div>

                        <div class="analysis-box">
                            <h4 class="analysis-title">Psychological & Karmic Profile</h4>
                            <p class="analysis-text">${nak.aiAnalysis}</p>
                        </div>

                        <div class="traits-container">
                            <div class="traits-column">
                                <h5 class="traits-title" style="color: #15803d;">Key Strengths</h5>
                                <div class="pill-container">${strengthsHtml}</div>
                            </div>
                            <div class="traits-column">
                                <h5 class="traits-title" style="color: #b91c1c;">Shadow Traits</h5>
                                <div class="pill-container">${weaknessesHtml}</div>
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

        .nakshatra-block { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; flex-grow: 1; }
        
        .nakshatra-header { background-color: rgba(161, 73, 59, 0.08); padding: 25px; text-align: center; border-bottom: 1px solid rgba(161, 73, 59, 0.2); }
        .nakshatra-point { font-family: 'Arial', sans-serif; font-size: 12px; color: #707070; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
        .nakshatra-name { font-size: 28px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; }
        .nakshatra-pada { font-size: 16px; font-weight: normal; color: #666; font-style: italic; text-transform: none; }

        .nakshatra-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 25px; background-color: #ffffff; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); }
        .grid-item { text-align: center; padding: 10px; background-color: #fdfbf3; border-radius: 4px; border: 1px solid rgba(161, 73, 59, 0.1); }
        .grid-label { font-family: 'Arial', sans-serif; font-size: 10.5px; color: #707070; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px; }
        .grid-value { font-size: 15px; color: #a1493b; font-weight: bold; }

        .analysis-box { padding: 25px; flex-grow: 1; }
        .analysis-title { font-size: 16px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; text-align: center; }
        .analysis-text { font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.8; color: #555555; text-align: justify; }

        .traits-container { display: flex; border-top: 1px solid rgba(161, 73, 59, 0.2); background-color: #ffffff; }
        .traits-column { flex: 1; padding: 20px 25px; }
        .traits-column:first-child { border-right: 1px dashed rgba(161, 73, 59, 0.2); }
        .traits-title { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; text-align: center; }
        .pill-container { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .trait-pill { font-family: 'Arial', sans-serif; font-size: 12px; padding: 5px 12px; border-radius: 20px; font-weight: bold; }
        .strength-pill { background-color: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .weakness-pill { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fca5a5; }
    </style>
    ${pagesHtml}
    `;
};

export default generateAdvancedNakshatra;
