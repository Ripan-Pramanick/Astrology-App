const generateConclusion = (data) => {
    // Fallback data for Dos and Don'ts
    const dos = data.dos || [
        "Wake up before sunrise and practice meditation to align with cosmic energies.",
        "Wear your recommended lucky colors during important meetings or events.",
        "Donate to educational charities on Thursdays to strengthen Jupiter.",
        "Maintain a daily journal to channel your Moon's emotional energy constructively.",
        "Trust your intuition when making major financial or career decisions."
    ];

    const donts = data.donts || [
        "Avoid making major impulsive decisions during the retrograde phases of Mercury.",
        "Do not engage in unnecessary arguments on Tuesdays (Mars influence).",
        "Avoid starting completely new long-term ventures on Saturdays.",
        "Stay away from negative environments that drain your emotional energy.",
        "Do not ignore your physical health and dietary routines."
    ];

    const dosHtml = dos.map(item => `
        <div class="list-item do-item">
            <div class="item-icon">✓</div>
            <div class="item-text">${item}</div>
        </div>
    `).join('');

    const dontsHtml = donts.map(item => `
        <div class="list-item dont-item">
            <div class="item-icon">✕</div>
            <div class="item-text">${item}</div>
        </div>
    `).join('');

    return `
    <style>
        /* A4 Print Setup */
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Georgia', serif;
            background-color: #fdfbf3; /* Cream Bg */
            color: #4a4a4a;
            width: 210mm;
        }

        .page-container {
            padding: 20mm;
            width: 210mm; min-height: 297mm;
            position: relative;
            page-break-after: always;
        }

        .content-wrapper {
            border: 2px solid #a1493b; /* Maroon Border */
            padding: 15mm;
            min-height: calc(297mm - 40mm);
            border-radius: 4px;
            background-color: #ffffff; /* White Content */
            display: flex; flex-direction: column;
        }

        /* Section Headers */
        .section-header { text-align: center; margin-bottom: 25px; }
        .section-title {
            font-size: 26px; color: #a1493b;
            text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;
        }
        .gold-line {
            width: 60px; height: 2px;
            background-color: #a1493b; /* Maroon Line */
            margin: 10px auto;
        }
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; }

        /* Dos and Don'ts Layout - Light style */
        .split-layout { display: flex; gap: 20px; margin-top: 20px; flex-grow: 1; }
        .half-column {
            flex: 1;
            background-color: #fdfbf3; /* Cream inside boxes */
            border: 1px solid rgba(161, 73, 59, 0.15);
            border-radius: 6px; padding: 20px;
        }
        .column-title {
            text-align: center; font-size: 18px; text-transform: uppercase;
            letter-spacing: 1px; margin-bottom: 20px; padding-bottom: 10px;
            border-bottom: 1px dashed rgba(161, 73, 59, 0.3);
        }
        .do-title { color: #15803d; } /* Keep Green for Dos */
        .dont-title { color: #b91c1c; } /* Keep Red for Don'ts */

        .list-item {
            display: flex; align-items: flex-start; margin-bottom: 15px;
            font-family: 'Arial', sans-serif; font-size: 13.5px; line-height: 1.6;
        }
        .item-icon { font-weight: bold; margin-right: 12px; font-size: 16px; margin-top: -2px; }
        
        /* Adjusted colors for light background */
        .do-item .item-icon { color: #15803d; }
        .dont-item .item-icon { color: #b91c1c; }
        .item-text { color: #555555; text-align: justify; }

        /* Conclusion & Back Cover - Maroon style */
        .back-cover-wrapper {
            justify-content: center; align-items: center; text-align: center;
            border: 3px solid #a1493b; /* Thick Maroon border */
            background-color: #fdfbf3; /* Cream Bg for whole back cover */
        }
        .om-symbol-large { font-size: 50px; color: #a1493b; margin-bottom: 20px; }
        
        .conclusion-text {
            font-family: 'Arial', sans-serif;
            font-size: 15px; line-height: 1.8; color: #4a4a4a;
            max-width: 80%; margin: 0 auto 40px auto;
        }
        
        /* Disclaimer Box */
        .disclaimer-box {
            background-color: #f5f5f5; /* Very light gray */
            border: 1px solid #e0e0e0;
            padding: 15px; font-family: 'Arial', sans-serif;
            font-size: 11px; color: #777777; line-height: 1.5;
            max-width: 90%; margin: 0 auto; text-align: justify;
        }
        
        .brand-footer { margin-top: auto; padding-top: 30px; width: 100%; }
        .brand-name {
            font-size: 20px; color: #a1493b; /* Maroon brand name */
            letter-spacing: 3px; text-transform: uppercase; margin-bottom: 5px; font-weight: bold;
        }
        .brand-website {
            font-family: 'Arial', sans-serif; font-size: 12px;
            color: #707070; letter-spacing: 1px;
        }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            
            <div class="section-header">
                <h2 class="section-title">Karmic Guidelines</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">Favorable and unfavorable actions based on your planetary alignments</p>
            </div>

            <div class="split-layout">
                <div class="half-column">
                    <h3 class="column-title do-title">Dos (করণীয়)</h3>
                    ${dosHtml}
                </div>
                <div class="half-column">
                    <h3 class="column-title dont-title">Don'ts (বর্জনীয়)</h3>
                    ${dontsHtml}
                </div>
            </div>

        </div>
    </div>

    <div class="page-container">
        <div class="content-wrapper back-cover-wrapper">
            
            <div class="om-symbol-large">ॐ</div>
            <h2 class="section-title" style="font-size: 32px; margin-bottom: 20px;">May The Stars Guide You</h2>
            
            <p class="conclusion-text">
                Dear <strong>${data.name || 'Seeker'}</strong>, this astrological blueprint is a map of your cosmic potential. The planets incline, but they do not bind. Through conscious effort, spiritual remedies, and positive karma, you hold the power to shape your own destiny. May you find peace, prosperity, and purpose on your journey ahead.
            </p>

            <div class="disclaimer-box">
                <strong>Disclaimer:</strong> This Kundli and astrological report is generated for guidance and entertainment purposes based on the ancient principles of Vedic Astrology. Astrology is a study of planetary probabilities, not an absolute deterministic science. The predictions, remedies, and suggestions provided herein should not be treated as a substitute for professional medical, legal, financial, or psychological advice. The creators and publishers of this report are not responsible for any actions taken based on this information.
            </div>

            <div class="brand-footer">
                <div class="brand-name">YourAstrologyBrand</div>
                <div class="brand-website">www.yourastrologybrand.com | contact@yourastrologybrand.com</div>
            </div>

        </div>
    </div>
    `;
};

export default generateConclusion;