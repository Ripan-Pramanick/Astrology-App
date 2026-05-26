const generateKundliChart = (data) => {
    // --- Constants & Coordinates ---
    const C = 100 / 350;

    const HOUSES_POLYGONS = [
        { num: 1, points: "50,2.86 73.57,26.43 50,50 26.43,26.43" },
        { num: 2, points: "2.86,2.86 50,2.86 26.43,26.43" },
        { num: 3, points: "2.86,2.86 26.43,26.43 2.86,50" },
        { num: 4, points: "2.86,50 26.43,26.43 50,50 26.43,73.57" },
        { num: 5, points: "2.86,50 26.43,73.57 2.86,97.14" },
        { num: 6, points: "2.86,97.14 26.43,73.57 50,97.14" },
        { num: 7, points: "50,97.14 26.43,73.57 50,50 73.57,73.57" },
        { num: 8, points: "50,97.14 73.57,73.57 97.14,97.14" },
        { num: 9, points: "97.14,97.14 73.57,73.57 97.14,50" },
        { num: 10, points: "97.14,50 73.57,73.57 50,50 73.57,26.43" },
        { num: 11, points: "97.14,50 73.57,26.43 97.14,2.86" },
        { num: 12, points: "97.14,2.86 73.57,26.43 50,2.86" },
    ];

    const SIGN_POSITIONS = {
        1: { x: 175 * C, y: 158.5 * C }, 2: { x: 92.5 * C, y: 76 * C },
        3: { x: 76 * C, y: 92.5 * C }, 4: { x: 158.5 * C, y: 175 * C },
        5: { x: 76 * C, y: 257.5 * C }, 6: { x: 92.5 * C, y: 274 * C },
        7: { x: 175 * C, y: 191.5 * C }, 8: { x: 257.5 * C, y: 274 * C },
        9: { x: 274 * C, y: 257.5 * C }, 10: { x: 191.5 * C, y: 175 * C },
        11: { x: 274 * C, y: 92.5 * C }, 12: { x: 257.5 * C, y: 76 * C },
    };

    const PLANET_ZONES = {
        1: { ax: 165 * C, ay: 91.9 * C, cols: 2, cw: 9, rh: 6 },
        2: { ax: 87.2 * C, ay: 33 * C, cols: 2, cw: 9, rh: 6 },
        3: { ax: 30 * C, ay: 92.5 * C, cols: 1, cw: 9, rh: 6 },
        4: { ax: 77.8 * C, ay: 175 * C, cols: 1, cw: 9, rh: 6 },
        5: { ax: 30 * C, ay: 257.5 * C, cols: 1, cw: 9, rh: 6 },
        6: { ax: 87.2 * C, ay: 304 * C, cols: 2, cw: 9, rh: 6 },
        7: { ax: 175 * C, ay: 259 * C, cols: 2, cw: 9, rh: 6 },
        8: { ax: 254.6 * C, ay: 304 * C, cols: 2, cw: 9, rh: 6 },
        9: { ax: 320 * C, ay: 257.5 * C, cols: 1, cw: 9, rh: 6 },
        10: { ax: 272 * C, ay: 175 * C, cols: 1, cw: 9, rh: 6 },
        11: { ax: 297 * C, ay: 92.5 * C, cols: 1, cw: 9, rh: 6 },
        12: { ax: 258 * C, ay: 40 * C, cols: 2, cw: 9, rh: 6 },
    };

    const ZODIAC_NUM = {
        "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4, "Leo": 5, "Virgo": 6,
        "Libra": 7, "Scorpio": 8, "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
    };

    const PLANET_SHORT = {
        "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
        "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke"
    };

    // ── Helper Functions ──
    const getSuperscriptDegree = (degree) => {
        if (!degree || isNaN(degree)) return "";
        const num = Math.floor(degree % 30);
        const superscripts = {
            '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
            '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
        };
        return String(num).split('').map(d => superscripts[d] || d).join('');
    };

    // Extract Lagna from data
    const ascendantSign = data.ascendant || "Aries";
    const ascIdx = ZODIAC_NUM[ascendantSign] || 1;

    // Group Planets by House
    const planetsByHouse = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
    
    if (data.planets && Array.isArray(data.planets)) {
        data.planets.forEach(p => {
            if (!PLANET_SHORT[p.name]) return; // Skip non-standard planets
            let houseNum = parseInt(p.house);
            if (houseNum >= 1 && houseNum <= 12) {
                planetsByHouse[houseNum].push(p);
            }
        });
    }

    // ── Build SVG Strings ──
    let svgPolygons = '';
    let svgRashiText = '';
    let svgPlanetsText = '';

    HOUSES_POLYGONS.forEach(h => {
        // Polygons - Maroon stroke on light Bg
        const isLagna = h.num === 1;
        const fillStyle = isLagna ? 'rgba(161, 73, 59, 0.1)' : 'transparent'; /* Lagna highlight with maroon tint */
        const strokeWidth = isLagna ? '0.8' : '0.5';
        
        svgPolygons += `<polygon points="${h.points}" fill="${fillStyle}" stroke="#a1493b" stroke-width="${strokeWidth}" stroke-linejoin="round" />`;

        // Rashi Numbers - Maroon color from image
        const signNum = ((ascIdx - 1 + (h.num - 1)) % 12) + 1;
        const pos = SIGN_POSITIONS[h.num];
        
        svgRashiText += `<text x="${pos.x}" y="${pos.y}" font-size="4.5" text-anchor="middle" dominant-baseline="central" fill="#a1493b" font-weight="bold">${signNum}</text>`;
        
        if (isLagna) {
            svgRashiText += `<text x="${pos.x}" y="${pos.y - 10}" font-size="4" text-anchor="middle" dominant-baseline="central" fill="#a1493b" font-weight="bold" letter-spacing="0.2">Asc</text>`;
        }

        // Planets inside Houses - Dark Gray text on light Bg
        const ps = planetsByHouse[h.num] || [];
        if (ps.length > 0) {
            const { ax, ay, cols, cw, rh } = PLANET_ZONES[h.num];
            const rows = [];
            for (let i = 0; i < ps.length; i += cols) rows.push(ps.slice(i, i + cols));

            rows.forEach((row, rowIdx) => {
                const rowY = ay + rowIdx * rh;
                const rowHalfW = ((row.length - 1) * cw) / 2;
                
                row.forEach((p, colIdx) => {
                    const shortName = PLANET_SHORT[p.name] || p.name.slice(0, 2);
                    const px = ax - rowHalfW + colIdx * cw;
                    const degreeSuperScript = getSuperscriptDegree(p.normDegree || p.degree);
                    
                    // Base text for planet - Dark gray
                    svgPlanetsText += `<text x="${px}" y="${rowY}" font-size="4" text-anchor="middle" dominant-baseline="central" fill="#4a4a4a" font-weight="bold">${shortName}${degreeSuperScript}</text>`;
                    
                    // Retrograde marker - Keep red for warning
                    if (p.retrograde) {
                        svgPlanetsText += `<text x="${px + 4.5}" y="${rowY - 2.5}" font-size="2.5" text-anchor="middle" fill="#b91c1c" font-weight="bold">R</text>`;
                    }
                });
            });
        }
    });

    // ── Final HTML Template ──
    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Georgia', serif;
            background-color: #fdfbf3; /* Cream Bg */
            color: #4a4a4a;
            width: 210mm; height: 297mm;
        }

        .page-container {
            padding: 20mm;
            width: 100%; height: 100%;
            position: relative;
            page-break-after: always;
        }

        .content-wrapper {
            border: 2px solid #a1493b; /* Maroon border */
            padding: 15mm;
            height: 100%;
            border-radius: 4px;
            background-color: #ffffff; /* White inside */
            display: flex; flex-direction: column; align-items: center;
        }

        .chart-header {
            text-align: center;
            margin-bottom: 25mm;
            width: 100%;
        }

        .om-icon { font-size: 32px; color: #a1493b; margin-bottom: 10px; }

        .chart-title {
            font-size: 28px; color: #a1493b;
            text-transform: uppercase; letter-spacing: 3px;
        }

        .chart-subtitle { font-size: 14px; color: #707070; margin-top: 5px; }

        /* SVG Chart Container - Light look */
        .chart-container {
            width: 120mm; height: 120mm;
            position: relative;
            background-color: #ffffff;
            border: 1px solid rgba(161, 73, 59, 0.2);
            padding: 5mm;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
        }

        svg { width: 100%; height: 100%; display: block; }

        .legend-container {
            margin-top: 20mm;
            display: flex; flex-wrap: wrap; justify-content: center;
            gap: 15px; width: 80%;
            border-top: 1px dashed rgba(161, 73, 59, 0.3);
            padding-top: 15mm;
        }

        .legend-item {
            font-family: 'Arial', sans-serif;
            font-size: 11px; color: #707070;
            display: flex; align-items: center;
        }

        .legend-item strong { color: #a1493b; margin-right: 5px; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            
            <div class="chart-header">
                <div class="om-icon">ॐ</div>
                <h2 class="chart-title">Lagna Kundli</h2>
                <div class="chart-subtitle">Vedic Birth Chart for ${data.name || 'Seeker'}</div>
                <div style="color: #888888; font-size: 12px; margin-top: 5px;">
                    Ascendant: <span style="color: #a1493b; font-weight: bold;">${ascendantSign}</span>
                </div>
            </div>

            <div class="chart-container">
                <svg viewBox="0 0 100 100">
                    ${svgPolygons}
                    ${svgRashiText}
                    ${svgPlanetsText}
                </svg>
            </div>

            <div class="legend-container">
                <div class="legend-item"><strong>Su</strong> Sun</div>
                <div class="legend-item"><strong>Mo</strong> Moon</div>
                <div class="legend-item"><strong>Ma</strong> Mars</div>
                <div class="legend-item"><strong>Me</strong> Mercury</div>
                <div class="legend-item"><strong>Ju</strong> Jupiter</div>
                <div class="legend-item"><strong>Ve</strong> Venus</div>
                <div class="legend-item"><strong>Sa</strong> Saturn</div>
                <div class="legend-item"><strong>Ra</strong> Rahu</div>
                <div class="legend-item"><strong>Ke</strong> Ketu</div>
                <div class="legend-item"><strong style="color: #b91c1c;">R</strong> Retrograde</div>
            </div>

        </div>
    </div>
    `;
};

export default generateKundliChart;