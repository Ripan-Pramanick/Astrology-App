import { translations } from "../translations.js";

const generateAdvancedConclusion = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const conclusionData = data.advancedConclusion || {
        karmicSummary: "Your birth chart reveals a soul that has journeyed through many lifetimes to master the art of balance and leadership. While your early years may have presented challenges in finding your true voice, the planetary alignments promise a highly rewarding second half of life. Your ultimate karmic goal is to use your wisdom and material success to uplift those around you.",
        dos: [
            "Maintain a daily gratitude journal to appease Jupiter and attract abundance.",
            "Wear light, pastel colors on Fridays to enhance Venusian harmony in relationships.",
            "Donate to educational institutions or mentor young minds to fulfill your 5th house karma.",
            "Practice mindfulness or meditation during Mercury retrograde periods.",
            "Trust your intuition in business partnerships; your Darakaraka strongly supports gut feelings."
        ],
        donts: [
            "Avoid making impulsive financial decisions on Tuesdays, as Mars may trigger aggressive investments.",
            "Do not hold onto past emotional grudges; it blocks your 4th house of inner peace.",
            "Avoid sharing your long-term goals with pessimistic individuals before they manifest.",
            "Never ignore your sleep schedule; your 12th house requires adequate rest for subconscious healing.",
            "Refrain from taking loans or accumulating debt during the sub-periods of Saturn."
        ]
    };

    const dosHtml = conclusionData.dos.map(item => `
        <div class="guideline-item do-item">
            <div class="icon">✨</div>
            <div class="text">${item}</div>
        </div>
    `).join('');

    const dontsHtml = conclusionData.donts.map(item => `
        <div class="guideline-item dont-item">
            <div class="icon">🚫</div>
            <div class="text">${item}</div>
        </div>
    `).join('');

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

        .summary-box { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); padding: 25px; border-radius: 6px; margin-bottom: 30px; text-align: justify; font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.8; color: #4a4a4a; }
        
        .guidelines-grid { display: flex; gap: 20px; flex-grow: 1; margin-bottom: 20px; }
        .guideline-column { flex: 1; display: flex; flex-direction: column; gap: 15px; }
        .column-header { font-size: 16px; text-transform: uppercase; letter-spacing: 1px; text-align: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); }
        .do-header { color: #15803d; }
        .dont-header { color: #b91c1c; }

        .guideline-item { display: flex; align-items: flex-start; padding: 15px; border-radius: 4px; font-family: 'Arial', sans-serif; font-size: 13.5px; line-height: 1.6; }
        .guideline-item .icon { font-size: 16px; margin-right: 12px; margin-top: -2px; }
        .do-item { background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .dont-item { background-color: #fef2f2; border: 1px solid #fca5a5; color: #b91c1c; }

        .back-cover-wrapper { justify-content: center; align-items: center; text-align: center; border: 3px solid #a1493b; background-color: #fdfbf3; }
        .om-symbol-large { font-size: 60px; color: #a1493b; margin-bottom: 25px; }
        .closing-title { font-size: 32px; color: #a1493b; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 20px; }
        .closing-text { font-family: 'Arial', sans-serif; font-size: 16px; line-height: 1.8; color: #555; max-width: 80%; margin: 0 auto 40px auto; }
        
        .brand-footer { margin-top: auto; padding-top: 30px; border-top: 1px solid rgba(161, 73, 59, 0.2); width: 80%; }
        .brand-name { font-size: 24px; color: #a1493b; letter-spacing: 4px; text-transform: uppercase; font-weight: bold; margin-bottom: 5px; }
        .brand-website { font-family: 'Arial', sans-serif; font-size: 13px; color: #707070; letter-spacing: 2px; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.karmicGuidelines || "Karmic Guidelines"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.karmicDesc || "Final synthesis and actionable advice for your journey"}</p>
            </div>

            <div class="summary-box">
                <strong style="color: #a1493b; font-size: 16px; text-transform: uppercase;">${t.soulsJourney || "The Soul's Journey:"}</strong><br><br>
                ${conclusionData.karmicSummary}
            </div>

            <div class="guidelines-grid">
                <div class="guideline-column">
                    <div class="column-header do-header">${t.dos || "Favorable Actions (Dos)"}</div>
                    ${dosHtml}
                </div>
                <div class="guideline-column">
                    <div class="column-header dont-header">${t.donts || "Actions to Avoid (Don'ts)"}</div>
                    ${dontsHtml}
                </div>
            </div>
        </div>
    </div>

    <div class="page-container">
        <div class="content-wrapper back-cover-wrapper">
            <div class="om-symbol-large">ॐ</div>
            <h2 class="closing-title">${t.mayStarsGuide || "May The Stars Guide You"}</h2>
            
            <p class="closing-text">
                ${t.dear || "Dear"} <strong>${data.name || 'Seeker'}</strong>, ${t.closingText || "astrology is a profound tool for self-awareness, not a definitive script of your future. You possess the free will to shape your destiny. Use this cosmic blueprint to navigate life's challenges with wisdom, patience, and grace."}
            </p>

            <div class="brand-footer">
                <div class="brand-name">KAALCHAKRA</div>
                <div class="brand-website">www.kaalchakra.com | contact@kaalchakra.com</div>
            </div>
        </div>
    </div>
    `;
};

export default generateAdvancedConclusion;