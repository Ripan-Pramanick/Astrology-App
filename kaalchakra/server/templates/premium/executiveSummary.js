import { translations } from "../translations.js";

const generateExecutiveSummary = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // Fallback Data
    const summaryData = data.executiveSummary || {
        lifePath: "You are fundamentally driven by a need to establish security, structure, and fairness in the world. Your chart indicates a strong inclination towards leadership, but true success will come when you balance your professional ambitions with deep, meaningful personal relationships. The universe is calling you to become a pillar of strength for others.",
        strengths: ["Strategic Thinking", "Resilience", "Natural Leadership", "Empathy"],
        challenges: ["Overthinking", "Difficulty delegating tasks", "Ignoring emotional needs"]
    };

    const strengthsHtml = summaryData.strengths.map(s => `<div class="tag-pill strength-pill">✓ ${s}</div>`).join('');
    const challengesHtml = summaryData.challenges.map(c => `<div class="tag-pill challenge-pill">⚠ ${c}</div>`).join('');

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
        
        .summary-box { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); padding: 25px; border-radius: 6px; margin-bottom: 25px; }
        .summary-heading { font-size: 18px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); padding-bottom: 8px; }
        .summary-text { font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.8; color: #555555; text-align: justify; }
        
        .tags-section { background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid rgba(161, 73, 59, 0.1); margin-bottom: 15px; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
        .tag-pill { font-family: 'Arial', sans-serif; font-size: 13px; padding: 8px 15px; border-radius: 4px; font-weight: bold; border: 1px solid rgba(161, 73, 59, 0.2); }
        .strength-pill { background-color: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
        .challenge-pill { background-color: #fef2f2; color: #b91c1c; border-color: #fca5a5; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.execSummaryTitle || "Executive Summary"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.execSummaryDesc || "A high-level overview of your astrological blueprint"}</p>
            </div>

            <div class="summary-box">
                <h3 class="summary-heading">🎯 ${t.lifePathPurpose || "Life Path & Core Purpose"}</h3>
                <p class="summary-text">${summaryData.lifePath}</p>
            </div>

            <div class="tags-section">
                <h4 style="font-size: 14px; color: #15803d; text-transform: uppercase;">🌟 ${t.coreStrengths || "Core Strengths"}</h4>
                <div class="tags-container">
                    ${strengthsHtml}
                </div>
            </div>

            <div class="tags-section" style="margin-bottom: 0; flex-grow: 1;">
                <h4 style="font-size: 14px; color: #b91c1c; text-transform: uppercase;">⛰️ ${t.majorChallenges || "Karmic Challenges"}</h4>
                <div class="tags-container">
                    ${challengesHtml}
                </div>
            </div>
        </div>
    </div>
    `;
};

export default generateExecutiveSummary;