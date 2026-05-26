const generatePlanetTable = (data) => {
    // --- Helper Functions ---
    const getZodiacSymbol = (sign) => {
        const symbols = {
            'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
            'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
            'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
        };
        return symbols[sign] || '';
    };

    const formatDegree = (degreeVal) => {
        if (!degreeVal) return "0° 00' 00\"";
        const num = parseFloat(degreeVal);
        const deg = Math.floor(num);
        const min = Math.floor((num - deg) * 60);
        const sec = Math.floor((((num - deg) * 60) - min) * 60);
        return `${deg}° ${min.toString().padStart(2, '0')}' ${sec.toString().padStart(2, '0')}"`;
    };

    // Assuming data.planets is an array of planet objects
    let planetsHtml = '';
    
    if (data.planets && Array.isArray(data.planets)) {
        planetsHtml = data.planets.map(planet => {
            const symbol = getZodiacSymbol(planet.sign);
            const degreeText = formatDegree(planet.normDegree || planet.degree);
            const statusLabel = planet.isAscendant ? 
                '<span class="status-lagna">Lagna</span>' : 
                (planet.retrograde ? '<span class="status-retro">Retrograde (R)</span>' : '<span class="status-direct">Direct</span>');

            return `
                <tr>
                    <td class="planet-name">${planet.name}</td>
                    <td><span class="zodiac-symbol">${symbol}</span> ${planet.sign}</td>
                    <td class="text-center">${planet.house}</td>
                    <td class="font-mono">${degreeText}</td>
                    <td>${planet.lord || '-'}</td>
                    <td class="text-center">${statusLabel}</td>
                </tr>
            `;
        }).join('');
    } else {
        planetsHtml = '<tr><td colspan="6" class="text-center py-4 text-gray">Planetary data not available.</td></tr>';
    }

    // --- HTML & CSS Template ---
    return `
    <style>
        /* A4 Print Setup */
        @page {
            size: A4;
            margin: 0;
        }
        
        /* Base Reset */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Georgia', serif;
            background-color: #fdfbf3; /* Cream Bg */
            color: #4a4a4a; /* Dark text */
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

        /* Maroon Borders */
        .content-wrapper {
            border: 2px solid #a1493b;
            padding: 15mm;
            height: 100%;
            border-radius: 4px;
            background-color: #ffffff; /* White inside */
        }

        /* Header Styling */
        .section-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 1px solid rgba(161, 73, 59, 0.3);
            padding-bottom: 15px;
        }

        .section-title {
            font-size: 28px;
            color: #a1493b; /* Maroon */
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 5px;
        }

        .section-subtitle {
            font-size: 14px;
            color: #707070;
            letter-spacing: 1px;
        }

        /* Table Styling - Light Theme with Maroon headers */
        .planet-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-family: 'Arial', sans-serif;
            font-size: 13px;
        }

        .planet-table th {
            background-color: rgba(161, 73, 59, 0.1); /* Very light maroon tint */
            color: #a1493b; /* Maroon text */
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 12px 10px;
            text-align: left;
            border-bottom: 2px solid #a1493b;
            font-weight: bold;
        }

        .planet-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #e0e0e0;
            color: #4a4a4a;
        }

        .planet-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        /* Cell Styles */
        .text-center { text-align: center; }
        .font-mono { font-family: 'Courier New', monospace; letter-spacing: 0.5px; }
        .planet-name { font-weight: bold; color: #a1493b; } /* Highlighting planet name */
        .zodiac-symbol { font-size: 16px; color: #a1493b; margin-right: 5px; }
        .text-gray { color: #888888; }

        /* Status Labels - Adjusted for visibility on white */
        .status-lagna {
            color: #1e3a8a; /* Darker Blue */
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
        }
        
        .status-retro {
            color: #b91c1c; /* Darker Red */
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
        }

        .status-direct {
            color: #15803d; /* Darker Green */
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
        }

        /* Footer Note */
        .footer-note {
            margin-top: 30px;
            font-size: 11px;
            color: #666666;
            font-style: italic;
            text-align: justify;
            line-height: 1.5;
            border-top: 1px dashed rgba(161, 73, 59, 0.2);
            padding-top: 15px;
        }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            
            <div class="section-header">
                <h2 class="section-title">Planetary Positions</h2>
                <div class="section-subtitle">Detailed Astrological Coordinates</div>
            </div>

            <table class="planet-table">
                <thead>
                    <tr>
                        <th>Planet</th>
                        <th>Sign (Rashi)</th>
                        <th class="text-center">House</th>
                        <th>Degree</th>
                        <th>Lord</th>
                        <th class="text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${planetsHtml}
                </tbody>
            </table>

            <div class="footer-note">
                <span style="color: #a1493b;">✨ Note:</span> House positions are calculated relative to the Lagna (Ascendant). Degrees reflect the accurate sidereal (Nirayana) positions utilizing the Lahiri Ayanamsa. Calculations are dynamically generated for <strong>${data.name || 'Seeker'}</strong>.
            </div>

        </div>
    </div>
    `;
};

export default generatePlanetTable;