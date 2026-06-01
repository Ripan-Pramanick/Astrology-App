import { translations } from "../translations.js";

const generateAdvancedHouseAnalysis = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // Fallback data for 12 Houses (Premium Level Detail)
    const housesData = data.advancedHouses || [
        { 
            num: 1, 
            name: "First House (Tanu Bhava)", 
            icon: "👤",
            sign: "Aries",
            lord: "Mars",
            lordStatus: "Exalted in 10th House",
            occupants: "Jupiter, Rahu",
            aspects: "Saturn, Venus",
            aiAnalysis: "The First House represents your physical body, personality, and overall vitality. With Jupiter here, you are blessed with an optimistic and expansive aura. However, the presence of Rahu indicates a constant desire to reinvent yourself and sometimes struggling with illusions about your identity. The exalted Mars (House Lord) in the 10th house provides immense drive and guarantees success in leadership roles. The aspect of Saturn brings discipline but may cause occasional self-doubt.",
            impact: ["Physical Health", "Self-Image", "Life Path"],
            remedies: "Daily meditation and reciting the Surya Mantra will balance the Rahu energy in your ascendant."
        },
        // We add fallback for 2nd house just as an example. In reality, pass all 12 from backend.
        { 
            num: 2, 
            name: "Second House (Dhana Bhava)", 
            icon: "🪙",
            sign: "Taurus",
            lord: "Venus",
            lordStatus: "Placed in 12th House",
            occupants: "None",
            aspects: "Mars, Jupiter",
            aiAnalysis: "The Second House governs accumulated wealth, speech, and immediate family. Your 2nd house is empty, which means its results heavily depend on its lord, Venus. Since Venus is in the 12th house, your expenses might often equal your income, especially on luxury or foreign travels. However, the aspect of Jupiter protects your finances from drying up completely. Your speech is generally sweet but Mars's aspect can make you blunt when provoked.",
            impact: ["Wealth Accumulation", "Family Harmony", "Communication"],
            remedies: "Donating white sweets on Fridays will strengthen Venus and improve wealth retention."
        }
        // ... (API should provide 12 houses)
    ];

    let pagesHtml = '';

    housesData.forEach((house, index) => {
        const impactsHtml = house.impact.map(i => `<span class="impact-pill">${i}</span>`).join('');

        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    ${index === 0 ? `
                    <div class="section-header">
                        <h2 class="section-title">${t.advancedBhavPhal || "In-Depth House Analysis"}</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">${t.advancedBhavPhalDesc || "Comprehensive micro-analysis of all 12 houses of your Kundli"}</p>
                    </div>
                    ` : '<div style="height: 15mm;"></div>'}
                    
                    <div class="house-block">
                        <div class="house-header">
                            <div class="house-title-group">
                                <div class="house-icon">${house.icon}</div>
                                <div>
                                    <h3 class="house-title">${house.name}</h3>
                                    <div class="house-sign">Sign: <strong style="color: #a1493b;">${house.sign}</strong></div>
                                </div>
                            </div>
                            <div class="house-number">${house.num}</div>
                        </div>

                        <div class="house-data-grid">
                            <div class="data-item">
                                <span class="data-label">House Lord</span>
                                <span class="data-value">${house.lord} <span style="font-weight:normal; font-size: 12px; color: #777;">(${house.lordStatus})</span></span>
                            </div>
                            <div class="data-item">
                                <span class="data-label">Occupying Planets</span>
                                <span class="data-value">${house.occupants}</span>
                            </div>
                            <div class="data-item" style="grid-column: span 2;">
                                <span class="data-label">Planetary Aspects (Drishti)</span>
                                <span class="data-value">${house.aspects}</span>
                            </div>
                        </div>

                        <div class="house-analysis-content">
                            <h4 class="analysis-heading">Astrological Deep Dive</h4>
                            <p class="house-text">${house.aiAnalysis}</p>
                        </div>

                        <div class="house-footer">
                            <div class="impact-areas">
                                <span class="data-label" style="margin-bottom: 8px;">Key Impact Areas</span>
                                <div class="impact-container">${impactsHtml}</div>
                            </div>
                            <div class="house-remedy">
                                <span class="data-label" style="margin-bottom: 8px; color: #15803d;">Suggested Remedy</span>
                                <p style="font-size: 13px; color: #4a4a4a; line-height: 1.5;">${house.remedies}</p>
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

        .house-block { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; flex-grow: 1; }
        
        .house-header { background-color: rgba(161, 73, 59, 0.08); padding: 20px 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(161, 73, 59, 0.2); }
        .house-title-group { display: flex; align-items: center; }
        .house-icon { font-size: 36px; margin-right: 15px; }
        .house-title { font-size: 22px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .house-sign { font-family: 'Arial', sans-serif; font-size: 13px; color: #666; }
        .house-number { font-size: 50px; font-family: 'Arial', sans-serif; font-weight: bold; color: rgba(161, 73, 59, 0.15); line-height: 1; }

        .house-data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px 25px; background-color: #ffffff; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); }
        .data-item { font-family: 'Arial', sans-serif; }
        .data-label { color: #707070; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px; }
        .data-value { color: #4a4a4a; font-size: 14px; font-weight: bold; }

        .house-analysis-content { padding: 25px; flex-grow: 1; }
        .analysis-heading { font-size: 16px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
        .house-text { font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.8; color: #555555; text-align: justify; white-space: pre-line; }

        .house-footer { padding: 20px 25px; background-color: rgba(161, 73, 59, 0.03); border-top: 1px solid rgba(161, 73, 59, 0.1); display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .impact-container { display: flex; flex-wrap: wrap; gap: 8px; }
        .impact-pill { font-family: 'Arial', sans-serif; font-size: 12px; background-color: #ffffff; border: 1px solid rgba(161, 73, 59, 0.3); color: #a1493b; padding: 4px 10px; border-radius: 20px; }
        .house-remedy { border-left: 3px solid #15803d; padding-left: 15px; }
    </style>
    ${pagesHtml}
    `;
};

export default generateAdvancedHouseAnalysis;