import { translations } from "../translations.js";

const generateDasha = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const dashas = data.dashas || [];
    if (!dashas.length) return '';

    const defaultPlanets = ["Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", "Ketu", "Venus"];
    let pagesHtml = '';

    // লুপ: প্রতিটি মহাদশার জন্য
    dashas.forEach((dasha) => {
        const mahadashaPlanet = t[dasha.planet.toLowerCase()] || dasha.planet;

        // --- Page 1: মহাদশা এবং অন্তর্দশা ওভারভিউ ---
        const antardashaRows = (dasha.antardashas || []).map(ad => {
            const antardashaPlanet = t[ad.planet.toLowerCase()] || ad.planet;
            return `
            <tr>
                <td class="ad-planet">${antardashaPlanet}</td>
                <td class="text-center">${ad.start}</td>
                <td class="text-center">${ad.end}</td>
            </tr>
        `}).join('');

        pagesHtml += `
        <div class="page-container">
            <div class="content-wrapper">
                <div class="section-header">
                    <h2 class="section-title">${t.vimshottariDasha}</h2>
                    <div class="gold-line"></div>
                    <p class="section-subtitle">${mahadashaPlanet} ${t.mahadasha} ${t.timeline}</p>
                </div>
                <div class="dasha-wrapper">
                    <div class="dasha-block" style="margin-top: 15px;">
                        <div class="mahadasha-header">
                            <h3>${mahadashaPlanet} ${t.mahadasha}</h3>
                            <span class="dasha-duration">${dasha.start} ${t.to} ${dasha.end}</span>
                        </div>
                        <table class="antardasha-table">
                            <thead>
                                <tr>
                                    <th>${t.antardasha}</th>
                                    <th class="text-center">${t.startDate}</th>
                                    <th class="text-center">${t.endDate}</th>
                                </tr>
                            </thead>
                            <tbody>${antardashaRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        `;

        // --- Page 2, 3, 4... : প্রত্যন্তদশা ব্রেকডাউন (প্রতি পেজে ৩টি অন্তর্দশা) ---
        const antardashas = dasha.antardashas || [];
        for (let i = 0; i < antardashas.length; i += 3) {
            const chunk = antardashas.slice(i, i + 3);
            
            const pdBlocksHtml = chunk.map(ad => {
                const adPlanet = t[ad.planet.toLowerCase()] || ad.planet;
                
                // যদি API থেকে Pratyantardasha না আসে, তবে Fallback হিসেবে ডামি তৈরি করবে
                const pdList = ad.pratyantardashas || defaultPlanets.map(p => ({
                    planet: p, start: ad.start, end: ad.end // Fallback Data
                }));

                const pdRows = pdList.map(pd => {
                    const pdPlanetTranslated = t[pd.planet.toLowerCase()] || pd.planet;
                    return `
                    <tr>
                        <td style="color: #4a4a4a;">${pdPlanetTranslated}</td>
                        <td class="text-center">${pd.start}</td>
                        <td class="text-center">${pd.end}</td>
                    </tr>
                `}).join('');

                return `
                <div class="dasha-block" style="margin-bottom: 20px;">
                    <div class="mahadasha-header" style="background-color: rgba(161, 73, 59, 0.05);">
                        <h3 style="font-size: 14px; color:#4a4a4a;">${mahadashaPlanet} - <span style="color:#a1493b;">${adPlanet}</span> ${t.antardasha.split(' ')[0]}</h3>
                        <span class="dasha-duration" style="font-weight:normal;">${ad.start} ${t.to} ${ad.end}</span>
                    </div>
                    <table class="antardasha-table" style="font-size: 11px;">
                        <thead>
                            <tr>
                                <th style="padding: 6px 10px;">${t.pratyantardasha}</th>
                                <th class="text-center" style="padding: 6px 10px;">${t.startDate}</th>
                                <th class="text-center" style="padding: 6px 10px;">${t.endDate}</th>
                            </tr>
                        </thead>
                        <tbody>${pdRows}</tbody>
                    </table>
                </div>
                `;
            }).join('');

            pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    ${i === 0 ? `
                    <div class="section-header">
                        <h2 class="section-title" style="font-size: 22px;">${t.subPeriodBreakdown}</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">${mahadashaPlanet} ${t.mahadasha} -> ${t.pratyantardasha}</p>
                    </div>
                    ` : '<div style="height: 15mm;"></div>'}
                    <div class="dasha-wrapper">
                        ${pdBlocksHtml}
                    </div>
                </div>
            </div>
            `;
        }
    });

    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background-color: #fdfbf3; color: #4a4a4a; width: 210mm; }
        .page-container { padding: 20mm; width: 210mm; min-height: 297mm; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; min-height: calc(297mm - 40mm); border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; }
        .section-header { text-align: center; margin-bottom: 10px; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; }
        .dasha-wrapper { flex-grow: 1; display: flex; flex-direction: column; }
        .dasha-block { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; overflow: hidden; page-break-inside: avoid; }
        .mahadasha-header { background-color: rgba(161, 73, 59, 0.1); border-left: 4px solid #a1493b; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(161, 73, 59, 0.2); }
        .mahadasha-header h3 { font-size: 16px; color: #a1493b; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .dasha-duration { font-family: 'Arial', sans-serif; font-size: 12px; color: #555555; font-weight: bold; }
        .antardasha-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 13px; }
        .antardasha-table th { background-color: #fdfbf3; color: #707070; text-transform: uppercase; letter-spacing: 1px; padding: 10px; border-bottom: 1px solid rgba(161, 73, 59, 0.2); text-align: left; }
        .antardasha-table td { padding: 10px; border-bottom: 1px dashed rgba(0, 0, 0, 0.1); color: #4a4a4a; }
        .antardasha-table tr:last-child td { border-bottom: none; }
        .antardasha-table tr:nth-child(even) { background-color: #fafafa; }
        .ad-planet { font-weight: bold; color: #a1493b; }
        .text-center { text-align: center; }
    </style>
    ${pagesHtml}
    `;
};

export default generateDasha;