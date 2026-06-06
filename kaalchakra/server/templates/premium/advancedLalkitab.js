import { translations } from "../translations.js";

const generateAdvancedLalkitab = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    let lkData = data.lalkitab;

    // 🌟 Safe Data Handling: ক্র্যাশ ঠেকানোর জন্য ভ্যালিডেশন
    let debtsList = [];
    let remediesList = [];

    // যদি API থেকে সঠিক Object ফরম্যাটে ডেটা আসে
    if (lkData && typeof lkData === 'object' && !Array.isArray(lkData)) {
        debtsList = lkData.debts || [];
        remediesList = lkData.remedies || [];
    } else {
        // যদি API ফেইল করে বা ডেটা না থাকে, তবে Fallback
        debtsList = [
            { name: "Forefather's Debt (Pitr Rin)", indications: "Destruction of crops, financial losses without reason, or struggles with male progeny.", isPresent: true },
            { name: "Mother's Debt (Matr Rin)", indications: "Alienation from family, distress to mother, or loss of milch animals.", isPresent: false },
            { name: "Nature's Debt (Kudrati Rin)", indications: "Unforeseen calamities, sudden downfall, or health issues related to nerves.", isPresent: true }
        ];
        remediesList = [
            { planet: "Sun", remedy: "Throw copper coins in flowing water. Always maintain a good moral character." },
            { planet: "Moon", remedy: "Keep a silver piece or rice given by your mother in your wallet." },
            { planet: "Mars", remedy: "Offer sweet tandoori rotis to animals or donate blood if health permits." },
            { planet: "Rahu", remedy: "Keep a piece of solid silver with you. Avoid wearing blue or black clothes." }
        ];
    }

    // 🌟 Dynamic Loops
    const debtsHtml = debtsList.map(debt => `
        <div class="lk-card ${debt.isPresent ? 'active-debt' : 'inactive-debt'}">
            <h4 class="debt-title">${debt.name || 'Karmic Debt'}</h4>
            <div class="debt-status">${debt.isPresent ? '⚠️ Active' : '✅ Cleared / Not Present'}</div>
            <p class="debt-desc">${debt.isPresent ? (debt.indications || debt.description || '') : (t.noDebt || "No active karmic debts found in this category.")}</p>
        </div>
    `).join('');

    const remediesHtml = remediesList.map(rem => `
        <tr>
            <td class="lk-planet">${t[rem.planet?.toLowerCase()] || rem.planet || 'Planet'}</td>
            <td class="lk-remedy">${rem.remedy || rem.description || ''}</td>
        </tr>
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
        
        .lk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
        
        /* 🌟 page-break-inside: avoid; এর মাধ্যমে কার্ড বা টেবিল পেজের মাঝে অর্ধেক কাটা পড়বে না */
        .lk-card { padding: 15px; border-radius: 6px; border: 1px solid rgba(161, 73, 59, 0.2); background-color: #fdfbf3; page-break-inside: avoid; }
        .active-debt { border-left: 4px solid #b91c1c; background-color: #fef2f2; }
        .inactive-debt { border-left: 4px solid #15803d; background-color: #f0fdf4; }
        
        .debt-title { font-size: 15px; color: #4a4a4a; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
        .debt-status { font-family: 'Arial', sans-serif; font-size: 11px; font-weight: bold; margin-bottom: 10px; }
        .active-debt .debt-status { color: #b91c1c; }
        .inactive-debt .debt-status { color: #15803d; }
        .debt-desc { font-family: 'Arial', sans-serif; font-size: 13px; color: #555; line-height: 1.6; }

        .remedy-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 13.5px; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; overflow: hidden; page-break-inside: auto; }
        
        /* 🌟 টেবিলের রো যেন পেজ ব্রেক এর সময় সুন্দর করে পরের পেজে যায় */
        .remedy-table tr { page-break-inside: avoid; page-break-after: auto; }
        
        .remedy-table th { background-color: rgba(161, 73, 59, 0.08); color: #a1493b; text-transform: uppercase; letter-spacing: 1px; padding: 12px 15px; text-align: left; }
        .remedy-table td { padding: 12px 15px; border-bottom: 1px dashed rgba(0,0,0,0.1); }
        .remedy-table tr:last-child td { border-bottom: none; }
        .lk-planet { font-weight: bold; color: #a1493b; white-space: nowrap; width: 25%; }
        .lk-remedy { color: #4a4a4a; line-height: 1.6; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.lalkitabTitle || "Lalkitab Predictions & Debts"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.lalkitabDesc || "Ancient astrological wisdom focusing on planetary debts and practical remedies"}</p>
            </div>

            <h3 style="font-size: 17px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); padding-bottom: 8px;">
                🔴 ${t.lkDebts || "Lalkitab Karmic Debts (Rin)"}
            </h3>
            <div class="lk-grid">
                ${debtsHtml}
            </div>

            <h3 style="font-size: 17px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); padding-bottom: 8px; margin-top: 10px;">
                🌿 ${t.lkRemedies || "Lalkitab Planetary Remedies"}
            </h3>
            <table class="remedy-table">
                <thead>
                    <tr>
                        <th>${t.planet || "Planet"}</th>
                        <th>${t.remedy || "Remedy"}</th>
                    </tr>
                </thead>
                <tbody>
                    ${remediesHtml}
                </tbody>
            </table>

        </div>
    </div>
    `;
};

export default generateAdvancedLalkitab;