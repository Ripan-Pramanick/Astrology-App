import { translations } from "../translations.js";

const generateYogasAndDoshas = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;
    
    // Yogas Translations
    const yogasData = [
        { title: "GAJAKESARI YOGA", type: t.auspicious, icon: "🐘", formation: "Formed when Jupiter is in a Kendra from the Moon.", effects: "Brings wealth, intelligence, virtues, and lasting fame." },
        { title: "BUDHADITYA YOGA", type: t.auspicious, icon: "🌟", formation: "Formed by the conjunction of the Sun and Mercury.", effects: "Grants high intelligence, excellent communication skills, and success." },
        { title: "RUCHAKA YOGA", type: t.auspicious, icon: "🔥", formation: "Formed when Mars is in its own sign or exalted.", effects: "Makes you courageous, energetic, and physically strong." }
    ];

    const yogasHtml = yogasData.map(yoga => `
        <div class="analysis-block" style="border-left: 4px solid #b45309;">
            <div class="block-header">
                <div style="display:flex; align-items:center;">
                    <div style="font-size:24px; margin-right:10px;">${yoga.icon}</div>
                    <div>
                        <div class="block-title">${yoga.title}</div>
                        <div style="font-size:12px; color:#15803d; font-weight:bold;">${yoga.type}</div>
                    </div>
                </div>
            </div>
            <p class="block-text"><strong>${t.formation}:</strong> ${yoga.formation}</p>
            <p class="block-text" style="margin-top:8px;"><strong>${t.effects}:</strong> ${yoga.effects}</p>
        </div>
    `).join('');

    const doshasData = data.doshas || {
        manglik: { isPresent: false, title: "Manglik Dosha", status: t.notPresent, description: "Manglik Dosha is not present in your chart." },
        sadeSati: { isPresent: false, title: "Shani Sade Sati", status: t.notActive, description: "Data unavailable." }
    };

    const doshaHtml = Object.values(doshasData).map(dosha => `
        <div class="analysis-block" style="border-left: 4px solid ${dosha.isPresent ? '#b91c1c' : '#15803d'};">
            <div class="block-header">
                <div class="block-title" style="text-transform:uppercase;">${dosha.title}</div>
                <div class="status-badge" style="background-color: ${dosha.isPresent ? '#fee2e2' : '#dcfce3'}; color: ${dosha.isPresent ? '#b91c1c' : '#15803d'};">
                    ${dosha.status}
                </div>
            </div>
            <p class="block-text">${dosha.description}</p>
        </div>
    `).join('');

    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background-color: #fdfbf3; color: #4a4a4a; width: 210mm; }
        .page-container { padding: 20mm; width: 210mm; min-height: 297mm; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; min-height: calc(297mm - 40mm); border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; }
        .section-header { text-align: center; margin-bottom: 30px; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; }
        .analysis-block { margin-bottom: 25px; background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.15); border-radius: 6px; padding: 20px; }
        .block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); padding-bottom: 10px; }
        .block-title { font-size: 18px; color: #4a4a4a; font-weight: bold; letter-spacing: 1px; }
        .status-badge { padding: 5px 12px; border-radius: 20px; font-family: 'Arial', sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .block-text { font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.7; color: #555555; text-align: justify; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.planetaryYogas}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.yogasDesc}</p>
            </div>
            <div style="flex-grow: 1;">
                ${yogasHtml}
            </div>
        </div>
    </div>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.astroDoshas}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.doshasDesc}</p>
            </div>
            <div style="flex-grow: 1;">
                ${doshaHtml}
            </div>
        </div>
    </div>
    `;
};

export default generateYogasAndDoshas;