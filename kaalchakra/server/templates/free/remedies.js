import { translations } from "../translations.js";

const generateRemedies = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;
    
    // Fallback Translated Data
    const localizedData = {
        en: { colors: "Saffron, Yellow", gem: "Yellow Sapphire (Pukhraj)", deity: "Lord Vishnu / Brihaspati" },
        bn: { colors: "জাফরান, হলুদ", gem: "পীত পোখরাজ", deity: "ভগবান বিষ্ণু / বৃহস্পতি" },
        hi: { colors: "केसरिया, पीला", gem: "पुखराज", deity: "भगवान विष्णु / बृहस्पति" }
    };
    const currentLoc = localizedData[lang] || localizedData.en;

    const luckyNumbers = data.luckyNumbers || "7, 9";
    const favorableColors = data.favorableColors || currentLoc.colors;
    const luckyGem = data.luckyGem || currentLoc.gem;
    const luckyDeity = data.luckyDeity || currentLoc.deity;

    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background-color: #fdfbf3; color: #4a4a4a; width: 210mm; }
        .page-container { padding: 20mm; width: 210mm; min-height: 297mm; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; min-height: calc(297mm - 40mm); border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; align-items: center; }
        .section-header { text-align: center; margin-bottom: 30mm; width: 100%; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; }
        
        .elements-grid { display: flex; flex-wrap: wrap; gap: 20px; width: 90%; justify-content: center; }
        .element-box { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.15); border-radius: 6px; padding: 20px; display: flex; align-items: center; width: 100%; }
        .half-box { width: calc(50% - 10px); }
        .element-icon { font-size: 32px; background-color: rgba(161, 73, 59, 0.1); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 6px; margin-right: 15px; border: 1px solid rgba(161, 73, 59, 0.2); }
        .element-label { font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; font-family: 'Arial', sans-serif;}
        .element-value { font-size: 20px; color: #a1493b; font-weight: bold; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.auspiciousElements || "Auspicious Elements"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.vibrationsDesc || "Vibrations and elements that align with your cosmic energy"}</p>
            </div>
            
            <div class="elements-grid">
                <div class="element-box half-box">
                    <div class="element-icon">🔢</div>
                    <div>
                        <div class="element-label">${t.luckyNumbers || "Lucky Numbers"}</div>
                        <div class="element-value">${luckyNumbers}</div>
                    </div>
                </div>
                <div class="element-box half-box">
                    <div class="element-icon">🎨</div>
                    <div>
                        <div class="element-label">${t.favorableColors || "Favorable Colors"}</div>
                        <div class="element-value">${favorableColors}</div>
                    </div>
                </div>
                <div class="element-box">
                    <div class="element-icon">💎</div>
                    <div>
                        <div class="element-label">${t.lifeGemstone || "Life Gemstone"}</div>
                        <div class="element-value">${luckyGem}</div>
                    </div>
                </div>
                <div class="element-box">
                    <div class="element-icon">🕉️</div>
                    <div>
                        <div class="element-label">${t.guidingDeity || "Guiding Deity"}</div>
                        <div class="element-value">${luckyDeity}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};

export default generateRemedies;