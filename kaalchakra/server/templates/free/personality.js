import { translations } from "../translations.js";

const generatePersonalityAnalysis = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;
    
    const ascendant = data.ascendant || 'Aries';
    const moonSign = data.moonSign || 'Aries';
    const name = data.name || 'Seeker';
    
    // API এর ইংরেজি রাশিকে বাংলায় কনভার্ট
    const translatedAscSign = t[ascendant.toLowerCase()] || ascendant;
    const translatedMoonSign = t[moonSign.toLowerCase()] || moonSign;

    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background-color: #fdfbf3; color: #4a4a4a; width: 210mm; height: 297mm; }
        .page-container { padding: 20mm; width: 100%; height: 100%; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; height: 100%; border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; }
        .section-header { text-align: center; margin-bottom: 20mm; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
        .section-subtitle { font-size: 14px; color: #707070; font-style: italic; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .analysis-block { margin-bottom: 25px; background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.15); border-radius: 6px; padding: 20px; position: relative; }
        .block-header { display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); padding-bottom: 10px; }
        .block-icon { font-size: 24px; margin-right: 15px; background-color: rgba(161, 73, 59, 0.1); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: #a1493b; }
        .block-title { font-size: 18px; color: #4a4a4a; font-weight: bold; letter-spacing: 1px; }
        .sign-highlight { color: #a1493b; font-style: italic; }
        .block-text { font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.7; color: #555555; text-align: justify; }
        .traits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
        .trait-item { display: flex; align-items: center; font-family: 'Arial', sans-serif; font-size: 13px; color: #666666; }
        .trait-bullet { color: #a1493b; margin-right: 8px; font-size: 16px; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.personalityAnalysis}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.deepDive} ${name}</p>
            </div>

            <div class="analysis-block">
                <div class="block-header">
                    <div class="block-icon">🌅</div>
                    <div class="block-title">${t.ascProfile}: <span class="sign-highlight">${translatedAscSign}</span></div>
                </div>
                <p class="block-text">${data.lagnaAnalysis}</p>
                <div class="traits-grid">
                    <div class="trait-item"><span class="trait-bullet">✦</span> ${t.outwardBehavior}</div>
                    <div class="trait-item"><span class="trait-bullet">✦</span> ${t.physicalConst}</div>
                </div>
            </div>

            <div class="analysis-block">
                <div class="block-header">
                    <div class="block-icon">🌙</div>
                    <div class="block-title">${t.moonProfile}: <span class="sign-highlight">${translatedMoonSign}</span></div>
                </div>
                <p class="block-text">${data.rashiAnalysis}</p>
                <div class="traits-grid">
                    <div class="trait-item"><span class="trait-bullet">✦</span> ${t.emotionalIntel}</div>
                    <div class="trait-item"><span class="trait-bullet">✦</span> ${t.subconsciousMind}</div>
                </div>
            </div>

            <div class="analysis-block" style="border-left: 4px solid #a1493b; background-color: #ffffff;">
                <div class="block-header">
                    <div class="block-icon" style="background: transparent;">✨</div>
                    <div class="block-title">${t.coreIdentity}</div>
                </div>
                <p class="block-text">${data.corePersonality}</p>
            </div>
        </div>
    </div>
    `;
};

export default generatePersonalityAnalysis;