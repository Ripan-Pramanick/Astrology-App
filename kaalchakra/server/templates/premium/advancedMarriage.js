import { translations } from "../translations.js";

const generateAdvancedMarriage = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const marriageData = data.marriageAnalysis || {
        seventhLord: "Venus",
        seventhLordPosition: "Placed in 9th House",
        darakaraka: "Mercury",
        navamsaAscendant: "Libra",
        aiProfile: "Your astrological chart indicates a harmonious and balanced approach to relationships...",
        marriageTiming: "Favorable planetary periods for marriage are highly active between mid-2027 and late-2028.",
        partnerTraits: ["Intellectual", "Communicative", "Spiritual", "Supportive"],
        relationshipAdvice: "Open communication is your greatest asset. Avoid over-analyzing your partner's actions..."
    };

    const traitsHtml = marriageData.partnerTraits.map(trait => `<div class="tag-pill trait-pill">✨ ${trait}</div>`).join('');

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
        .indicator-card { background-color: #fcfcfc; border: 1px solid rgba(161, 73, 59, 0.15); border-radius: 6px; padding: 15px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .indicator-label { font-family: 'Arial', sans-serif; font-size: 11px; color: #707070; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
        .indicator-value { font-size: 18px; color: #a1493b; font-weight: bold; }
        .indicator-sub { font-family: 'Arial', sans-serif; font-size: 11px; color: #666; margin-top: 5px; }
        .analysis-section { margin-bottom: 25px; }
        .analysis-heading { font-size: 18px; color: #4a4a4a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-left: 4px solid #a1493b; padding-left: 10px; display: flex; align-items: center; gap: 8px; }
        .analysis-text { font-family: 'Arial', sans-serif; font-size: 14.5px; line-height: 1.8; color: #555555; text-align: justify; background-color: rgba(161, 73, 59, 0.03); padding: 20px; border-radius: 4px; border: 1px solid rgba(161, 73, 59, 0.1); }
        .tags-container { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; margin-bottom: 25px; justify-content: center; }
        .tag-pill { font-family: 'Arial', sans-serif; font-size: 13px; padding: 8px 18px; border-radius: 25px; font-weight: bold; border: 1px solid rgba(161, 73, 59, 0.2); }
        .trait-pill { background-color: #fdfbf3; color: #a1493b; }
        .split-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: auto; }
        .info-box { padding: 15px; border-radius: 6px; font-family: 'Arial', sans-serif; font-size: 13.5px; line-height: 1.6; }
        .timing-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .advice-box { background-color: #fffbeb; border: 1px solid #fde68a; color: #b45309; }
        .box-title { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: bold; display: block; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.marriageAnalysis || "Marriage & Relationships"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.marriageDesc || "Astrological insights into your partnerships and marital harmony"}</p>
            </div>

            <div class="indicators-grid">
                <div class="indicator-card">
                    <span class="indicator-label">${t.seventhLordMarriage || "7th Lord (Marriage)"}</span>
                    <span class="indicator-value">${marriageData.seventhLord}</span>
                    <div class="indicator-sub">${marriageData.seventhLordPosition}</div>
                </div>
                <div class="indicator-card">
                    <span class="indicator-label">${t.darakarakaSpouse || "Darakaraka (Spouse)"}</span>
                    <span class="indicator-value">${marriageData.darakaraka}</span>
                    <div class="indicator-sub">${t.soulLevelConnection || "Soul Level Connection"}</div>
                </div>
                <div class="indicator-card">
                    <span class="indicator-label">${t.navamsaAscendantD9 || "Navamsa (D-9) Ascendant"}</span>
                    <span class="indicator-value">${marriageData.navamsaAscendant}</span>
                    <div class="indicator-sub">${t.innerMaritalReality || "Inner Marital Reality"}</div>
                </div>
            </div>

            <div class="analysis-section">
                <h3 class="analysis-heading"><span>💍</span> ${t.relationshipDynamics || "Relationship Dynamics"}</h3>
                <div class="analysis-text">
                    ${marriageData.aiProfile}
                </div>
            </div>

            <div style="text-align: center;">
                <h4 style="font-size: 15px; color: #4a4a4a; text-transform: uppercase; letter-spacing: 1px;">${t.likelyPartnerTraits || "Likely Partner Traits"}</h4>
                <div class="tags-container">
                    ${traitsHtml}
                </div>
            </div>

            <div class="split-section">
                <div class="info-box timing-box">
                    <span class="box-title">⏳ ${t.marriageTimingTitle || "Marriage Timing"}</span>
                    <p>${marriageData.marriageTiming}</p>
                </div>
                <div class="info-box advice-box">
                    <span class="box-title">💡 ${t.relationshipAdviceTitle || "Relationship Advice"}</span>
                    <p>${marriageData.relationshipAdvice}</p>
                </div>
            </div>
        </div>
    </div>
    `;
};

export default generateAdvancedMarriage;