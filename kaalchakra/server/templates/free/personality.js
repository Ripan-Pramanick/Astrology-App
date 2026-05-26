const generatePersonalityAnalysis = (data) => {
    // Fallbacks
    const ascendant = data.ascendant || 'Aries';
    const moonSign = data.moonSign || 'Aries';
    const name = data.name || 'Seeker';
    
    // Injected AI paragraphs
    const lagnaAnalysis = data.lagnaAnalysis || "Your Ascendant represents your physical body, outward personality, and how the world perceives you. People with this rising sign are often known for their dynamic energy and unique approach to life.";
    const rashiAnalysis = data.rashiAnalysis || "The Moon governs your mind, emotions, and inner self. Your Moon sign indicates a deep well of emotional intelligence, a strong connection to your roots, and intuitive decision-making abilities.";
    const corePersonality = data.corePersonality || "You possess a balanced blend of practical wisdom and creative vision. Throughout your life, you are driven by a pursuit of truth and harmony, often finding success when you trust your inner voice.";

    return `
    <style>
        /* A4 Print Setup */
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
            border: 2px solid #a1493b; /* Maroon Border */
            padding: 15mm;
            height: 100%;
            border-radius: 4px;
            background-color: #ffffff; /* White inside */
            display: flex; flex-direction: column;
        }

        /* Section Header */
        .section-header {
            text-align: center;
            margin-bottom: 20mm;
        }
        .section-title {
            font-size: 26px; color: #a1493b;
            text-transform: uppercase; letter-spacing: 2px;
            margin-bottom: 10px;
        }
        .section-subtitle { font-size: 14px; color: #707070; font-style: italic; }
        .gold-line {
            width: 60px; height: 2px;
            background-color: #a1493b; /* Maroon line instead of gold */
            margin: 10px auto;
        }

        /* Analysis Blocks */
        .analysis-block {
            margin-bottom: 25px;
            background-color: #fdfbf3; /* Cream inside blocks */
            border: 1px solid rgba(161, 73, 59, 0.15);
            border-radius: 6px;
            padding: 20px;
            position: relative;
        }

        .block-header {
            display: flex; align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px dashed rgba(161, 73, 59, 0.3);
            padding-bottom: 10px;
        }

        .block-icon {
            font-size: 24px; margin-right: 15px;
            background-color: rgba(161, 73, 59, 0.1); /* Maroon tint */
            width: 40px; height: 40px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%;
            color: #a1493b; /* Maroon icon */
        }

        .block-title {
            font-size: 18px; color: #4a4a4a;
            font-weight: bold; letter-spacing: 1px;
        }

        .sign-highlight {
            color: #a1493b; /* Maroon highlight instead of gold */
            font-style: italic;
        }

        .block-text {
            font-family: 'Arial', sans-serif;
            font-size: 14px; line-height: 1.7;
            color: #555555; /* Mid-gray for readability */
            text-align: justify;
        }

        /* Traits Grid */
        .traits-grid {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 15px; margin-top: 15px;
        }
        
        .trait-item {
            display: flex; align-items: center;
            font-family: 'Arial', sans-serif;
            font-size: 13px; color: #666666;
        }
        
        .trait-bullet { color: #a1493b; margin-right: 8px; font-size: 16px; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            
            <div class="section-header">
                <h2 class="section-title">Personality Analysis</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">A deep dive into the cosmic blueprint of ${name}</p>
            </div>

            <div class="analysis-block">
                <div class="block-header">
                    <div class="block-icon">🌅</div>
                    <div class="block-title">Ascendant (Lagna) Profile: <span class="sign-highlight">${ascendant}</span></div>
                </div>
                <p class="block-text">${lagnaAnalysis}</p>
                <div class="traits-grid">
                    <div class="trait-item"><span class="trait-bullet">✦</span> Outward Behavior & Persona</div>
                    <div class="trait-item"><span class="trait-bullet">✦</span> Physical Constitution</div>
                </div>
            </div>

            <div class="analysis-block">
                <div class="block-header">
                    <div class="block-icon">🌙</div>
                    <div class="block-title">Moon Sign (Rashi) Profile: <span class="sign-highlight">${moonSign}</span></div>
                </div>
                <p class="block-text">${rashiAnalysis}</p>
                <div class="traits-grid">
                    <div class="trait-item"><span class="trait-bullet">✦</span> Emotional Intelligence</div>
                    <div class="trait-item"><span class="trait-bullet">✦</span> Subconscious Mind</div>
                </div>
            </div>

            <div class="analysis-block" style="border-left: 4px solid #a1493b; background-color: #ffffff;">
                <div class="block-header">
                    <div class="block-icon" style="background: transparent;">✨</div>
                    <div class="block-title">Core Identity & Synthesis</div>
                </div>
                <p class="block-text">${corePersonality}</p>
            </div>

        </div>
    </div>
    `;
};

export default generatePersonalityAnalysis;