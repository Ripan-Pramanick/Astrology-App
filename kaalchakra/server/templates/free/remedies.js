import { translations } from "../translations.js";

const generateRemedies = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // Fallback Basic Data
    const basicRemedy = data.luckyGem || "Yellow Sapphire (Pukhraj)";
    const basicMantraData = data.basicMantra || "Om Namah Shivaya";

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
        
        .basic-remedy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .basic-card { padding: 20px; border-radius: 6px; text-align: center; border: 1px solid rgba(161, 73, 59, 0.2); background-color: #fdfbf3; }
        .basic-card-title { font-family: 'Arial', sans-serif; font-size: 12px; color: #707070; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .basic-card-value { font-size: 20px; color: #15803d; font-weight: bold; }

        .premium-teaser { margin-top: auto; background: linear-gradient(135deg, #a1493b 0%, #d97766 100%); padding: 30px 25px; border-radius: 8px; color: #ffffff; text-align: center; box-shadow: 0 4px 15px rgba(161, 73, 59, 0.2); }
        .teaser-icon { font-size: 40px; margin-bottom: 15px; }
        .teaser-title { font-size: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-weight: bold; }
        .teaser-desc { font-family: 'Arial', sans-serif; font-size: 14.5px; line-height: 1.6; color: #fdfbf3; }
        .lock-list { text-align: left; margin-top: 15px; font-family: 'Arial', sans-serif; font-size: 14px; display: inline-block; }
        .lock-list li { margin-bottom: 8px; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.freeRemediesTitle || "Basic Cosmic Remedies"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.freeRemediesDesc || "A glimpse of remedies to balance your planetary energies"}</p>
            </div>

            <div class="basic-remedy-grid">
                <div class="basic-card">
                    <div class="basic-card-title">💎 ${t.primaryGemstone || "Primary Lucky Gemstone"}</div>
                    <div class="basic-card-value">${basicRemedy}</div>
                </div>
                <div class="basic-card">
                    <div class="basic-card-title">📿 ${t.basicMantra || "Basic Daily Mantra"}</div>
                    <div class="basic-card-value">${basicMantraData}</div>
                </div>
            </div>

            <div class="premium-teaser">
                <div class="teaser-icon">🔒</div>
                <h3 class="teaser-title">${t.premiumUnlockTitle || "Unlock Complete Remedies in Premium"}</h3>
                <p class="teaser-desc">${t.premiumUnlockDesc || "Get your personalized Lal Kitab remedies, Rudraksha suggestions, Sade Sati analysis, and Vedic Puja recommendations in our 200+ pages Premium Report."}</p>
                <ul class="lock-list">
                    <li>🔑 Detailed Lal Kitab Debts & Remedies</li>
                    <li>🔑 Perfect Rudraksha for your Kundli</li>
                    <li>🔑 Specific Vedic Pujas for success</li>
                    <li>🔑 Shani Sade Sati phases & timeline</li>
                </ul>
            </div>

        </div>
    </div>
    `;
};

export default generateRemedies;