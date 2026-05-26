const generateBirthDetails = (data) => {
    // Fallback data if something is missing
    const basic = data.basic || {};
    const panchang = data.panchang || {};

    return `
    <style>
        /* A4 Print Setup */
        @page {
            size: A4;
            margin: 0;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Georgia', serif;
            background-color: #fdfbf3; /* Cream Bg */
            color: #4a4a4a; /* Dark Gray text */
            width: 210mm;
            height: 297mm;
        }

        .page-container {
            padding: 20mm;
            width: 100%;
            height: 100%;
            position: relative;
            page-break-after: always;
        }

        .content-wrapper {
            border: 2px solid #a1493b; /* Maroon border */
            padding: 15mm;
            height: 100%;
            border-radius: 4px;
            background-color: #ffffff; /* White content area */
            display: flex;
            flex-direction: column;
        }

        /* Introduction Section */
        .intro-section {
            text-align: center;
            margin-bottom: 25mm;
        }
        .greeting {
            font-size: 24px;
            color: #a1493b; /* Maroon title */
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        .intro-text {
            font-family: 'Arial', sans-serif;
            font-size: 14px;
            line-height: 1.8;
            color: #666666; /* Lighter text for para */
            text-align: justify;
        }
        .gold-divider {
            width: 100px;
            height: 2px;
            background: linear-gradient(to right, transparent, #a1493b, transparent);
            margin: 20px auto;
        }

        /* Birth Details Section */
        .section-title {
            font-size: 20px;
            color: #a1493b; /* Maroon sub-title */
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
            border-left: 4px solid #a1493b;
            padding-left: 10px;
        }

        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }

        .details-box {
            background-color: #fdfbf3; /* Light cream inside boxes */
            border: 1px solid rgba(161, 73, 59, 0.2);
            border-radius: 4px;
            padding: 15px;
        }

        .data-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-family: 'Arial', sans-serif;
            font-size: 13px;
            border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
            padding-bottom: 5px;
        }
        .data-row:last-child {
            margin-bottom: 0;
            border-bottom: none;
            padding-bottom: 0;
        }

        .data-label {
            color: #707070; /* Gray labels */
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
        }
        .data-value {
            color: #4a4a4a; /* Dark text values */
            font-weight: bold;
            text-align: right;
        }
        .highlight-value {
            color: #a1493b; /* Maroon highlights instead of gold */
        }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            
            <div class="intro-section">
                <div class="greeting">Namaste, ${basic.name || 'Seeker'}</div>
                <div class="gold-divider"></div>
                <p class="intro-text">
                    Welcome to your personalized Vedic Astrology Kundli. The ancient science of Jyotisha illuminates the cosmic map of your life, revealing the planetary energies present at the exact moment of your birth. This comprehensive report is designed to provide deep insights into your personality, career, relationships, and spiritual journey. May this knowledge guide you towards clarity, prosperity, and inner peace.
                </p>
            </div>

            <h3 class="section-title">Birth Particulars</h3>
            <div class="details-grid">
                <div class="details-box">
                    <div class="data-row">
                        <span class="data-label">Name</span>
                        <span class="data-value">${basic.name || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Date of Birth</span>
                        <span class="data-value">${basic.dob || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Time of Birth</span>
                        <span class="data-value">${basic.tob || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Place of Birth</span>
                        <span class="data-value">${basic.pob || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Gender</span>
                        <span class="data-value">${basic.gender || '-'}</span>
                    </div>
                </div>

                <div class="details-box">
                    <div class="data-row">
                        <span class="data-label">Latitude</span>
                        <span class="data-value">${basic.lat || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Longitude</span>
                        <span class="data-value">${basic.lon || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Sunrise</span>
                        <span class="data-value">${basic.sunrise || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Sunset</span>
                        <span class="data-value">${basic.sunset || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Ayanamsa</span>
                        <span class="data-value">${basic.ayanamsa || 'Lahiri'}</span>
                    </div>
                </div>
            </div>

            <h3 class="section-title">Astrological Details</h3>
            <div class="details-grid">
                <div class="details-box">
                    <div class="data-row">
                        <span class="data-label">Ascendant (Lagna)</span>
                        <span class="data-value highlight-value">${panchang.ascendant || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Moon Sign (Rashi)</span>
                        <span class="data-value highlight-value">${panchang.moonSign || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Sun Sign</span>
                        <span class="data-value">${panchang.sunSign || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Nakshatra</span>
                        <span class="data-value highlight-value">${panchang.nakshatra || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Nakshatra Pada</span>
                        <span class="data-value">${panchang.nakshatraPada || '-'}</span>
                    </div>
                </div>

                <div class="details-box">
                    <div class="data-row">
                        <span class="data-label">Varna</span>
                        <span class="data-value">${panchang.varna || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Vashya</span>
                        <span class="data-value">${panchang.vashya || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Yoni</span>
                        <span class="data-value">${panchang.yoni || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Gana</span>
                        <span class="data-value">${panchang.gana || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Nadi</span>
                        <span class="data-value">${panchang.nadi || '-'}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `;
};

export default generateBirthDetails;