import { translations } from "../translations.js";

const generateBirthDetails = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const basic = data.basic || {};
    const panchang = data.panchang || {};

    // API এর ডেটা ট্রান্সলেট করার হেল্পার ফাংশন
    const translateVal = (val) => {
        if (!val) return '-';
        return t[val.toLowerCase()] || val;
    };

    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background-color: #fdfbf3; color: #4a4a4a; width: 210mm; height: 297mm; }
        .page-container { padding: 20mm; width: 100%; height: 100%; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; height: 100%; border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; }
        .intro-section { text-align: center; margin-bottom: 25mm; }
        .greeting { font-size: 24px; color: #a1493b; margin-bottom: 10px; letter-spacing: 2px; }
        .intro-text { font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.8; color: #666666; text-align: justify; }
        .gold-divider { width: 100px; height: 2px; background: linear-gradient(to right, transparent, #a1493b, transparent); margin: 20px auto; }
        .section-title { font-size: 20px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; border-left: 4px solid #a1493b; padding-left: 10px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
        .details-box { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 4px; padding: 15px; }
        .data-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-family: 'Arial', sans-serif; font-size: 13px; border-bottom: 1px dashed rgba(0, 0, 0, 0.1); padding-bottom: 5px; }
        .data-row:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
        .data-label { color: #707070; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
        .data-value { color: #4a4a4a; font-weight: bold; text-align: right; }
        .highlight-value { color: #a1493b; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            
            <div class="intro-section">
                <div class="greeting">${t.namaste}, ${basic.name || 'Seeker'}</div>
                <div class="gold-divider"></div>
                <p class="intro-text">${t.introText}</p>
            </div>

            <h3 class="section-title">${t.birthParticulars}</h3>
            <div class="details-grid">
                <div class="details-box">
                    <div class="data-row"><span class="data-label">${t.name}</span><span class="data-value">${basic.name || '-'}</span></div>
                    <div class="data-row"><span class="data-label">${t.dob}</span><span class="data-value">${basic.dob || '-'}</span></div>
                    <div class="data-row"><span class="data-label">${t.tob}</span><span class="data-value">${basic.tob || '-'}</span></div>
                    <div class="data-row"><span class="data-label">${t.pob}</span><span class="data-value">${basic.pob || '-'}</span></div>
                    <div class="data-row"><span class="data-label">${t.gender}</span><span class="data-value">${basic.gender || '-'}</span></div>
                </div>
                <div class="details-box">
                    <div class="data-row"><span class="data-label">${t.lat}</span><span class="data-value">${basic.lat || '-'}</span></div>
                    <div class="data-row"><span class="data-label">${t.lon}</span><span class="data-value">${basic.lon || '-'}</span></div>
                    <div class="data-row"><span class="data-label">${t.sunrise}</span><span class="data-value">${basic.sunrise || '-'}</span></div>
                    <div class="data-row"><span class="data-label">${t.sunset}</span><span class="data-value">${basic.sunset || '-'}</span></div>
                    <div class="data-row"><span class="data-label">${t.ayanamsa}</span><span class="data-value">${translateVal(basic.ayanamsa || 'Lahiri')}</span></div>
                </div>
            </div>

            <h3 class="section-title">${t.astroDetails}</h3>
            <div class="details-grid">
                <div class="details-box">
                    <div class="data-row"><span class="data-label">${t.ascendant}</span><span class="data-value highlight-value">${translateVal(panchang.ascendant)}</span></div>
                    <div class="data-row"><span class="data-label">${t.moonSign}</span><span class="data-value highlight-value">${translateVal(panchang.moonSign)}</span></div>
                    <div class="data-row"><span class="data-label">${t.sunSign}</span><span class="data-value">${translateVal(panchang.sunSign)}</span></div>
                    <div class="data-row"><span class="data-label">${t.nakshatra}</span><span class="data-value highlight-value">${translateVal(panchang.nakshatra)}</span></div>
                    <div class="data-row"><span class="data-label">${t.nakshatraPada}</span><span class="data-value">${translateVal(panchang.nakshatraPada)}</span></div>
                </div>
                <div class="details-box">
                    <div class="data-row"><span class="data-label">${t.varna}</span><span class="data-value">${translateVal(panchang.varna)}</span></div>
                    <div class="data-row"><span class="data-label">${t.vashya}</span><span class="data-value">${translateVal(panchang.vashya)}</span></div>
                    <div class="data-row"><span class="data-label">${t.yoni}</span><span class="data-value">${translateVal(panchang.yoni)}</span></div>
                    <div class="data-row"><span class="data-label">${t.gana}</span><span class="data-value">${translateVal(panchang.gana)}</span></div>
                    <div class="data-row"><span class="data-label">${t.nadi}</span><span class="data-value">${translateVal(panchang.nadi)}</span></div>
                </div>
            </div>

        </div>
    </div>
    `;
};

export default generateBirthDetails;