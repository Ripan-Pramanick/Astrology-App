import { translations } from "../translations.js";

const generateAdvancedHouseAnalysis = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const houses = [
        { id: 1, name: "First House (Lagna)", theme: "Self, Physical Body, Personality" },
        { id: 2, name: "Second House", theme: "Wealth, Speech, Immediate Family" },
        { id: 3, name: "Third House", theme: "Courage, Siblings, Communication" },
        { id: 4, name: "Fourth House", theme: "Mother, Home, Happiness, Properties" },
        { id: 5, name: "Fifth House", theme: "Intellect, Children, Creativity" },
        { id: 6, name: "Sixth House", theme: "Enemies, Debts, Diseases, Service" },
        { id: 7, name: "Seventh House", theme: "Marriage, Partnerships, Business" },
        { id: 8, name: "Eighth House", theme: "Longevity, Transformation, Hidden Things" },
        { id: 9, name: "Ninth House", theme: "Dharma, Father, Luck, Higher Knowledge" },
        { id: 10, name: "Tenth House", theme: "Career, Karma, Public Reputation" },
        { id: 11, name: "Eleventh House", theme: "Gains, Desires, Elder Siblings" },
        { id: 12, name: "Twelfth House", theme: "Losses, Foreign Lands, Spirituality" }
    ];

    let pagesHtml = '';

    houses.forEach((house) => {
        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    <div class="section-header">
                        <h2 class="section-title">${t.advancedBhavPhal || "In-Depth House Analysis"}</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">${house.name} - ${house.theme}</p>
                    </div>

                    <div class="house-detail-box">
                        <h3 style="color:#a1493b; font-size: 18px; margin-bottom:15px; border-bottom: 1px dashed #ccc; padding-bottom:5px;">Astrological Significance</h3>
                        <p style="font-family:'Arial', sans-serif; font-size:15px; line-height:1.8; color:#555; text-align:justify; margin-bottom:20px;">
                            The ${house.name} represents ${house.theme}. The planets occupying or aspecting this house, along with the dignity of the house lord, dictate how these areas of life will unfold for you. 
                            Positive influences here bring growth and stability, while afflictions may indicate karmic lessons that require patience and remedies.
                        </p>

                        <div style="background-color:rgba(161,73,59,0.05); padding:15px; border-left:4px solid #a1493b; border-radius:4px; font-family:'Arial', sans-serif;">
                            <strong>Note:</strong> Comprehensive manifestation of this house's results depends on the corresponding Mahadasha and planetary transits over your lifetime.
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
        /* 🌟 প্রতিটি ভাব একটি নতুন পেজে প্রিন্ট হবে */
        .page-container { padding: 20mm; width: 210mm; min-height: 297mm; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; min-height: calc(297mm - 40mm); border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; }
        .section-header { text-align: center; margin-bottom: 25px; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 16px; color: #707070; font-style: italic; font-weight:bold; }
        .house-detail-box { padding: 25px; background-color: #fdfbf3; border: 1px solid rgba(161,73,59,0.2); border-radius: 6px; flex-grow: 1;}
    </style>
    ${pagesHtml}
    `;
};

export default generateAdvancedHouseAnalysis;