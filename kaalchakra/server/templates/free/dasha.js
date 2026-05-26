const generateDasha = (data) => {
    const dashas = data.dashas || [];
    if (!dashas.length) return '';

    // Pagination Logic: প্রতি পেজে ১টি করে দশা (Overlap বন্ধ করার জন্য)
    const chunkedDashas = [];
    for (let i = 0; i < dashas.length; i += 1) {
        chunkedDashas.push(dashas.slice(i, i + 1));
    }

    let pagesHtml = '';

    chunkedDashas.forEach((chunk, index) => {
        const dashaBlocksHtml = chunk.map(dasha => {
            const antardashaRows = (dasha.antardashas || []).map(ad => `
                <tr>
                    <td class="ad-planet">${ad.planet}</td>
                    <td class="text-center">${ad.start}</td>
                    <td class="text-center">${ad.end}</td>
                </tr>
            `).join('');

            return `
                <div class="dasha-block" style="margin-top: 15px;">
                    <div class="mahadasha-header">
                        <h3>${dasha.planet} Mahadasha</h3>
                        <span class="dasha-duration">${dasha.start} to ${dasha.end}</span>
                    </div>
                    <table class="antardasha-table">
                        <thead>
                            <tr>
                                <th>Antardasha (Sub-period)</th>
                                <th class="text-center">Start Date</th>
                                <th class="text-center">End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${antardashaRows}
                        </tbody>
                    </table>
                </div>
            `;
        }).join('');

        pagesHtml += `
        <div class="page-container">
            <div class="content-wrapper">
                <div class="section-header">
                    <h2 class="section-title">Vimshottari Dasha</h2>
                    <div class="gold-line"></div>
                    <p class="section-subtitle">${chunk[0].planet} Mahadasha Timeline</p>
                </div>
                
                <div class="dasha-wrapper">
                    ${dashaBlocksHtml}
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

        .page-container {
            padding: 20mm; width: 210mm; min-height: 297mm; position: relative; page-break-after: always; 
        }

        .content-wrapper {
            border: 2px solid #a1493b; padding: 15mm; min-height: calc(297mm - 40mm); border-radius: 4px;
            background-color: #ffffff; display: flex; flex-direction: column;
        }

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