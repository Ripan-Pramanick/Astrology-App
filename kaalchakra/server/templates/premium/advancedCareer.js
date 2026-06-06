import { translations } from "../translations.js";

const generateAdvancedCareer = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const careerData = data.careerAnalysis || {
        tenthLord: "Mars",
        tenthLordPosition: "Exalted in 1st House",
        amatyakaraka: "Jupiter", 
        d10Ascendant: "Leo",
        aiProfile: "Your astrological chart reveals a highly ambitious and leadership-driven professional profile. With Mars as your 10th lord exalted in the ascendant, you are a self-starter who thrives in independent or authoritative roles. You do not like taking orders and prefer to lead from the front. The influence of Jupiter as your Amatyakaraka indicates that your career will involve guiding, consulting, or managing others.",
        wealthPotential: "The connection between your 2nd house of savings and 11th house of gains is very strong. You are likely to build substantial wealth in your mid-30s. However, avoid speculative investments as your 5th house shows some volatility.",
        favorableFields: ["Business Leadership", "Technology & Engineering", "Consulting", "Real Estate"],
        workStyle: ["Decisive", "Action-oriented", "Ethical", "Independent"]
    };

    const fieldsHtml = careerData.favorableFields.map(field => `<div class="tag-pill field-pill">💼 ${field}</div>`).join('');
    const stylesHtml = careerData.workStyle.map(style => `<div class="tag-pill style-pill">🎯 ${style}</div>`).join('');

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

        .indicators-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
        .indicator-card { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; padding: 15px; text-align: center; }
        .indicator-label { font-family: 'Arial', sans-serif; font-size: 11px; color: #707070; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
        .indicator-value { font-size: 18px; color: #a1493b; font-weight: bold; }
        .indicator-sub { font-family: 'Arial', sans-serif; font-size: 11px; color: #555; margin-top: 5px; }

        .analysis-section { margin-bottom: 25px; }
        .analysis-heading { font-size: 18px; color: #4a4a4a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-left: 4px solid #a1493b; padding-left: 10px; }
        .analysis-text { font-family: 'Arial', sans-serif; font-size: 14.5px; line-height: 1.8; color: #555555; text-align: justify; background-color: rgba(161, 73, 59, 0.03); padding: 15px; border-radius: 4px; border: 1px solid rgba(161, 73, 59, 0.1); }

        .tags-section { margin-bottom: 20px; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
        .tag-pill { font-family: 'Arial', sans-serif; font-size: 13px; padding: 8px 15px; border-radius: 4px; font-weight: bold; border: 1px solid rgba(161, 73, 59, 0.2); }
        .field-pill { background-color: #fdfbf3; color: #a1493b; }
        .style-pill { background-color: #ffffff; color: #15803d; border-color: #bbf7d0; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.careerWealth || "Career & Wealth Analysis"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.careerDesc || "Decoding your professional path, success potential, and financial prosperity"}</p>
            </div>

            <div class="indicators-grid">
                <div class="indicator-card">
                    <span class="indicator-label">${t.tenthLord || "10th Lord (Profession)"}</span>
                    <span class="indicator-value">${careerData.tenthLord}</span>
                    <div class="indicator-sub">${careerData.tenthLordPosition}</div>
                </div>
                <div class="indicator-card">
                    <span class="indicator-label">${t.amatyakaraka || "Amatyakaraka (Career Soul)"}</span>
                    <span class="indicator-value">${careerData.amatyakaraka}</span>
                    <div class="indicator-sub">${t.primaryGuidingForce || "Primary Guiding Force"}</div>
                </div>
                <div class="indicator-card">
                    <span class="indicator-label">${t.d10Ascendant || "Dasamsa (D-10) Ascendant"}</span>
                    <span class="indicator-value">${careerData.d10Ascendant}</span>
                    <div class="indicator-sub">${t.profEnvironment || "Professional Environment"}</div>
                </div>
            </div>

            <div class="analysis-section">
                <h3 class="analysis-heading">${t.profProfileKarma || "Professional Profile & Karma"}</h3>
                <div class="analysis-text">
                    ${careerData.aiProfile}
                </div>
            </div>

            <div style="display: flex; gap: 20px; margin-bottom: 25px;">
                <div class="tags-section" style="flex: 1;">
                    <h4 style="font-size: 14px; color: #a1493b; text-transform: uppercase;">${t.favorableSectors || "Favorable Sectors"}</h4>
                    <div class="tags-container">
                        ${fieldsHtml}
                    </div>
                </div>
                <div class="tags-section" style="flex: 1;">
                    <h4 style="font-size: 14px; color: #15803d; text-transform: uppercase;">${t.yourWorkStyle || "Your Work Style"}</h4>
                    <div class="tags-container">
                        ${stylesHtml}
                    </div>
                </div>
            </div>

            <div class="analysis-section" style="margin-bottom: 0;">
                <h3 class="analysis-heading">${t.wealthFinancialPotential || "Wealth & Financial Potential"}</h3>
                <div class="analysis-text" style="background-color: #f0fdf4; border-color: #bbf7d0;">
                    ${careerData.wealthPotential}
                </div>
            </div>

        </div>
    </div>
    `;
};

export default generateAdvancedCareer;