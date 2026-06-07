import { translations } from "../translations.js";

const generateYearlyPredictions = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const yearlyData = data.varshaphal || [];

    // 🌟 API ডেটা না দিলে আমরা অটোমেটিক ২০ বছরের ডেটা বানিয়ে নেব
    if (yearlyData.length < 20) {
        const currentYear = new Date().getFullYear();
        for(let i = yearlyData.length; i < 20; i++) {
            yearlyData.push({ year: `${currentYear + i} - ${currentYear + i + 1}`, muntha_house: (i % 12) + 1 });
        }
    }

    let pagesHtml = '';

    yearlyData.forEach((yearObj, index) => {
        const currentYear = new Date().getFullYear();
        const yearTitle = yearObj.year || `${currentYear + index} - ${currentYear + index + 1}`;
        // 🌟 Fix: undefined ঠেকানো হলো
        const munthaPosition = yearObj.muntha_house || ((index % 12) + 1); 
        
        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    <div class="section-header">
                        <h2 class="section-title">${t.yearlyPredTitle || "Advanced Yearly Predictions"}</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">${t.year || "Year"}: ${yearTitle}</p>
                    </div>

                    <div class="year-block">
                        <div class="year-header">
                            <h3 class="year-title">Varshaphal (Annual Horoscope) Analysis</h3>
                            <div class="year-theme">Muntha Position: House ${munthaPosition}</div>
                        </div>

                        <div class="year-content">
                            <h4 style="color:#a1493b; margin-bottom: 10px;">Planetary Focus for the Year</h4>
                            <p class="year-text">
                                This annual chart (Varshaphal) highlights the specific planetary energies activated during this year of your life. 
                                The placement of the Muntha (annual progressed ascendant) in house ${munthaPosition} indicates that the themes of this house will be highly prominent. 
                                Expect significant developments, lessons, and karmic unrollings related to this specific area of your life.
                            </p>
                            
                            <h4 style="color:#a1493b; margin-top: 20px; margin-bottom: 10px;">Remedial Measures & Guidance</h4>
                            <p class="year-text">
                                To maximize the positive effects and mitigate challenges this year, maintain focus on your core goals. Regular meditation and aligning your actions with your ethical values will serve as your strongest remedies.
                            </p>
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
        .section-subtitle { font-size: 15px; color: #707070; font-weight: bold; }
        .year-block { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; flex-grow: 1; }
        .year-header { background-color: rgba(161, 73, 59, 0.08); padding: 20px; border-bottom: 1px solid rgba(161, 73, 59, 0.2); text-align: center; }
        .year-title { font-size: 20px; color: #a1493b; margin-bottom: 8px; font-weight: bold; }
        .year-theme { font-family: 'Arial', sans-serif; font-size: 14px; background-color: #ffffff; color: #a1493b; padding: 5px 15px; border-radius: 20px; display: inline-block; border: 1px solid rgba(161, 73, 59, 0.2); }
        .year-content { padding: 30px; background-color: #ffffff; }
        .year-text { font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.9; color: #555555; text-align: justify; }
    </style>
    ${pagesHtml}
    `;
};

export default generateYearlyPredictions;