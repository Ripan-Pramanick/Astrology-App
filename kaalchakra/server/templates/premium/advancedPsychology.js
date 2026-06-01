import { translations } from "../translations.js";

const generateAdvancedPsychology = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // Fallback data for Premium Psychological Profile
    const psychData = data.psychologyAnalysis || {
        atmakaraka: "Sun",
        moonPosition: "Taurus (Exalted)",
        mercuryPosition: "Aries",
        emotionalLandscape: "With an exalted Moon, you possess a highly stable and emotionally grounded nature. You seek comfort, beauty, and security in your surroundings. However, your Atmakaraka being the Sun indicates a deep soul-level desire for recognition, authority, and self-expression. You process emotions practically, but there is a hidden intensity in how you attach yourself to people and objects.",
        shadowSelf: "Your shadow self is influenced by the placement of Rahu and the 8th house. You may unconsciously harbor a fear of losing control or facing sudden disruptions in your carefully structured life. In times of extreme stress, you might become overly stubborn or detached.",
        cognitiveStrengths: ["Emotionally Resilient", "Practical Thinker", "Focused", "Creative Problem Solver"],
        blindSpots: ["Resistance to Change", "Ego-driven decisions", "Over-attachment"],
        copingMechanism: "Nature walks, grounding meditations, and creative arts (like painting or music) are your best emotional anchors."
    };

    const strengthsHtml = psychData.cognitiveStrengths.map(s => `<div class="tag-pill strength-pill">🧠 ${s}</div>`).join('');
    const blindSpotsHtml = psychData.blindSpots.map(b => `<div class="tag-pill blind-pill">⚠️ ${b}</div>`).join('');

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

        /* Key Indicators Grid */
        .indicators-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
        .indicator-card { background-color: #fcfcfc; border: 1px solid rgba(161, 73, 59, 0.15); border-radius: 6px; padding: 15px; text-align: center; border-top: 3px solid #a1493b;}
        .indicator-label { font-family: 'Arial', sans-serif; font-size: 11px; color: #707070; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
        .indicator-value { font-size: 17px; color: #4a4a4a; font-weight: bold; }
        .indicator-sub { font-family: 'Arial', sans-serif; font-size: 11px; color: #a1493b; margin-top: 5px; font-weight: bold; }

        /* Analysis Box */
        .analysis-section { margin-bottom: 20px; }
        .analysis-heading { font-size: 17px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); padding-bottom: 8px; }
        .analysis-text { font-family: 'Arial', sans-serif; font-size: 14.5px; line-height: 1.8; color: #555555; text-align: justify; }
        
        .shadow-box { background-color: #fef2f2; border: 1px solid #fca5a5; padding: 15px; border-radius: 6px; margin-bottom: 25px; }
        .shadow-heading { font-size: 15px; color: #b91c1c; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: bold; }

        /* Tags Container */
        .tags-section { margin-bottom: 20px; background-color: #fdfbf3; padding: 15px; border-radius: 6px; border: 1px solid rgba(161, 73, 59, 0.1); }
        .tags-container { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
        .tag-pill { font-family: 'Arial', sans-serif; font-size: 12.5px; padding: 6px 14px; border-radius: 20px; font-weight: bold; border: 1px solid rgba(161, 73, 59, 0.2); }
        .strength-pill { background-color: #ffffff; color: #15803d; border-color: #bbf7d0; }
        .blind-pill { background-color: #ffffff; color: #b91c1c; border-color: #fca5a5; }

        .coping-box { margin-top: auto; padding: 15px; border-left: 4px solid #15803d; background-color: #f0fdf4; font-family: 'Arial', sans-serif; font-size: 13.5px; color: #15803d; line-height: 1.5; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.psychologicalProfile || "Psychological Profile"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.psychologyDesc || "Mapping your inner world, emotional landscape, and subconscious drivers"}</p>
            </div>

            <!-- Key Mental Indicators -->
            <div class="indicators-grid">
                <div class="indicator-card">
                    <span class="indicator-label">Atmakaraka</span>
                    <span class="indicator-value">${psychData.atmakaraka}</span>
                    <div class="indicator-sub">Soul's Core Desire</div>
                </div>
                <div class="indicator-card">
                    <span class="indicator-label">Moon (Mind)</span>
                    <span class="indicator-value">${psychData.moonPosition.split(' ')[0]}</span>
                    <div class="indicator-sub">${psychData.moonPosition.includes('Exalted') || psychData.moonPosition.includes('Own') ? 'Strong & Stable' : 'Emotional Filter'}</div>
                </div>
                <div class="indicator-card">
                    <span class="indicator-label">Mercury (Intellect)</span>
                    <span class="indicator-value">${psychData.mercuryPosition}</span>
                    <div class="indicator-sub">Cognitive Processing</div>
                </div>
            </div>

            <!-- Emotional Landscape -->
            <div class="analysis-section">
                <h3 class="analysis-heading">Emotional Landscape</h3>
                <p class="analysis-text">
                    ${psychData.emotionalLandscape}
                </p>
            </div>

            <!-- Shadow Self -->
            <div class="shadow-box">
                <div class="shadow-heading">🌑 The Shadow Self & Triggers</div>
                <p style="font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; color: #7f1d1d; text-align: justify;">
                    ${psychData.shadowSelf}
                </p>
            </div>

            <!-- Cognitive Strengths & Blind Spots -->
            <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <div class="tags-section" style="flex: 1; margin-bottom: 0;">
                    <h4 style="font-size: 13px; color: #15803d; text-transform: uppercase;">Cognitive Strengths</h4>
                    <div class="tags-container">
                        ${strengthsHtml}
                    </div>
                </div>
                <div class="tags-section" style="flex: 1; margin-bottom: 0;">
                    <h4 style="font-size: 13px; color: #b91c1c; text-transform: uppercase;">Mental Blind Spots</h4>
                    <div class="tags-container">
                        ${blindSpotsHtml}
                    </div>
                </div>
            </div>

            <!-- Coping Mechanism -->
            <div class="coping-box">
                <strong>Recommended Grounding Practice:</strong> ${psychData.copingMechanism}
            </div>

        </div>
    </div>
    `;
};

export default generateAdvancedPsychology;