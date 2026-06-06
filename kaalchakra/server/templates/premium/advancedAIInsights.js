import { translations } from "../translations.js";

const generateAdvancedAIInsights = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // Fallback data for Premium AI Insights
    const fallbackInsights = [
        {
            chapter: "Chapter 1: Karmic Debts & Life Lessons",
            icon: "⚖️",
            quote: "Karma is not a punishment, but a compass for the soul.",
            analysis: "Your chart indicates a strong karmic tie to your 4th house of home and emotional security. In previous lifetimes, there may have been an imbalance between your public duties and private life. In this lifetime, Saturn's placement suggests that your biggest lessons will revolve around establishing emotional boundaries and finding peace within, rather than seeking validation from the outside world. The early part of your life might feel restrictive, but this is merely the universe's way of building your resilience.",
            actionableAdvice: "Practice forgiveness towards maternal figures and focus on building a peaceful domestic environment. Real estate investments will be karmically favorable for you."
        },
        {
            chapter: "Chapter 2: Hidden Talents & Untapped Potential",
            icon: "🌟",
            quote: "The stars do not dictate your limits; they illuminate your possibilities.",
            analysis: "Beyond your known professional skills, Mercury's conjunction with Venus in a creative house points towards a profound, untapped talent for communication through art, writing, or digital media. You have an innate ability to take complex ideas and present them in an aesthetically pleasing and easily digestible format. This is an energy that, if channeled correctly, can become a significant secondary source of income and deep personal satisfaction.",
            actionableAdvice: "Dedicate at least two hours a week to a creative hobby that has no immediate financial goal. The creative flow will inadvertently boost your primary career."
        }
    ];

    // 🌟 Safe Check: Ensure data is an Array before using it 🌟
    const insightsData = (Array.isArray(data.aiInsights) && data.aiInsights.length > 0) 
        ? data.aiInsights 
        : fallbackInsights;

    let pagesHtml = '';

    insightsData.forEach((insight, index) => {
        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    ${index === 0 ? `
                    <div class="section-header">
                        <h2 class="section-title">${t.aiInsights || "Deep Cosmic Insights"}</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">${t.aiInsightsDesc || "Artificial Intelligence driven synthesis of your complete astrological blueprint"}</p>
                    </div>
                    ` : '<div style="height: 15mm;"></div>'}

                    <div class="insight-block">
                        <div class="insight-header">
                            <div class="insight-icon">${insight.icon}</div>
                            <h3 class="insight-chapter">${insight.chapter}</h3>
                        </div>

                        <div class="quote-box">
                            "${insight.quote}"
                        </div>

                        <div class="insight-content">
                            <h4 class="analysis-heading">${t.synthesizedAnalysis || "Synthesized Analysis"}</h4>
                            <p class="insight-text">${insight.analysis}</p>
                        </div>

                        <div class="advice-box">
                            <span class="advice-label">${t.cosmicRecommendation || "Cosmic Recommendation"}</span>
                            <p class="advice-text">${insight.actionableAdvice}</p>
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

        .insight-block { display: flex; flex-direction: column; flex-grow: 1; }
        
        .insight-header { display: flex; align-items: center; margin-bottom: 20px; border-bottom: 2px solid rgba(161, 73, 59, 0.2); padding-bottom: 15px; }
        .insight-icon { font-size: 32px; margin-right: 15px; }
        .insight-chapter { font-size: 20px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; }

        .quote-box { font-style: italic; font-size: 15.5px; color: #707070; text-align: center; margin-bottom: 25px; padding: 15px 30px; background-color: rgba(161, 73, 59, 0.04); border-radius: 4px; border-left: 3px solid #a1493b; border-right: 3px solid #a1493b; }

        .insight-content { flex-grow: 1; margin-bottom: 25px; }
        .analysis-heading { font-family: 'Arial', sans-serif; font-size: 14px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; font-weight: bold; }
        .insight-text { font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.9; color: #4a4a4a; text-align: justify; }

        .advice-box { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; padding: 20px; border-left: 5px solid #d4af37; margin-top: auto; }
        .advice-label { font-family: 'Arial', sans-serif; font-size: 12px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; display: block; margin-bottom: 8px; }
        .advice-text { font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; color: #555555; }
    </style>
    ${pagesHtml}
    `;
};

export default generateAdvancedAIInsights;