const generateLifePredictions = (data) => {
    // Prediction data fallback
    const predictions = data.predictions || {};

    const categories = [
        {
            key: 'career', title: 'Career & Professional Life',
            subtitle: 'Wealth creation, professional growth, and karmic path',
            icon: '💼',
            content: predictions.career || 'Your career path indicates a steady rise with opportunities for leadership. The planetary alignments suggest success in fields requiring strategic planning and communication.',
            highlights: predictions.careerHighlights || ['Leadership Potential', 'Strategic Growth', 'Public Recognition']
        },
        {
            key: 'relationship', title: 'Love & Relationships',
            subtitle: 'Romance, marriage, and emotional connections',
            icon: '❤️',
            content: predictions.relationship || 'Venus strongly influences your emotional bonds, bringing harmony and deep connections. Open communication will be the key to overcoming any minor misunderstandings in partnerships.',
            highlights: predictions.relationshipHighlights || ['Deep Empathy', 'Harmonious Bonds', 'Loyal Partnerships']
        },
        {
            key: 'health', title: 'Health & Well-being',
            subtitle: 'Physical vitality and mental peace',
            icon: '🧘',
            content: predictions.health || 'Overall vitality is strong. However, planetary transits advise you to maintain a balanced diet and incorporate meditation into your daily routine to manage stress levels effectively.',
            highlights: predictions.healthHighlights || ['Mental Resilience', 'Need for Routine', 'Holistic Balance']
        },
        {
            key: 'finance', title: 'Financial Summary',
            subtitle: 'Wealth accumulation, assets, and prosperity',
            icon: '🪙',
            content: predictions.finance || 'Jupiter’s aspect brings financial stability and the potential for long-term investments. Caution is advised during speculative ventures, but steady savings will yield great results.',
            highlights: predictions.financeHighlights || ['Steady Accumulation', 'Wise Investments', 'Asset Protection']
        }
    ];

    const pagesHtml = categories.map(cat => {
        const highlightsHtml = cat.highlights.map(h => `
            <div class="highlight-pill"><span class="pill-dot">✦</span> ${h}</div>
        `).join('');

        return `
        <div class="page-container">
            <div class="content-wrapper">
                
                <div class="category-header">
                    <div class="category-icon">${cat.icon}</div>
                    <h2 class="category-title">${cat.title}</h2>
                    <div class="gold-line"></div>
                    <p class="category-subtitle">${cat.subtitle}</p>
                </div>

                <div class="prediction-content">
                    <p class="prediction-text">${cat.content}</p>
                </div>

                <div class="highlights-section">
                    <h4 class="highlights-title">Key Planetary Indications</h4>
                    <div class="highlights-container">
                        ${highlightsHtml}
                    </div>
                </div>

            </div>
        </div>
        `;
    }).join('');

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
            background-color: #ffffff; /* White content */
            display: flex; flex-direction: column;
        }

        /* Header */
        .category-header { text-align: center; margin-bottom: 25px; }
        .category-icon { font-size: 36px; margin-bottom: 10px; }
        .category-title {
            font-size: 28px; color: #a1493b;
            text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;
        }
        .gold-line {
            width: 80px; height: 2px;
            background-color: #a1493b; /* Maroon Line */
            margin: 0 auto 10px auto;
        }
        .category-subtitle { font-size: 14px; color: #707070; font-style: italic; }

        /* Content Text (AI Predictions) - Adjusted for readability on light */
        .prediction-content { flex-grow: 1; margin-bottom: 30px; }
        .prediction-text {
            font-family: 'Arial', sans-serif;
            font-size: 15px; line-height: 1.8;
            color: #555555;
            text-align: justify;
            white-space: pre-wrap;
        }

        /* Highlights Box - Maroon style */
        .highlights-section {
            background-color: #fdfbf3; /* Cream Bg inside box */
            border: 1px solid rgba(161, 73, 59, 0.3);
            border-radius: 4px;
            padding: 20px;
            margin-top: auto;
        }
        .highlights-title {
            color: #a1493b;
            font-size: 14px; text-transform: uppercase;
            letter-spacing: 1px; margin-bottom: 15px; text-align: center;
        }
        .highlights-container { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        
        .highlight-pill {
            background-color: rgba(161, 73, 59, 0.1); /* Light maroon tint */
            border: 1px solid rgba(161, 73, 59, 0.3);
            color: #a1493b; /* Maroon text */
            padding: 8px 16px;
            border-radius: 20px;
            font-family: 'Arial', sans-serif;
            font-size: 13px;
            display: flex; align-items: center;
            font-weight: bold;
        }
        .pill-dot { color: #a1493b; margin-right: 6px; }
    </style>

    ${pagesHtml}
    `;
};

export default generateLifePredictions;