const generateYogasAndDoshas = (data) => {
    // Fallback Mock Data for Yogas
    const yogas = data.yogas || [
        {
            name: "Gajakesari Yoga", type: "Auspicious (Raj Yoga)", icon: "🐘",
            description: "Formed when Jupiter is in a Kendra (1st, 4th, 7th, or 10th house) from the Moon. This is one of the most powerful and auspicious yogas.",
            effects: "Brings wealth, intelligence, virtues, and lasting fame. You will command respect in society and overcome adversaries easily."
        },
        {
            name: "Budhaditya Yoga", type: "Auspicious (Intellectual Yoga)", icon: "☀️",
            description: "Formed by the conjunction of the Sun and Mercury in the same house.",
            effects: "Grants high intelligence, excellent communication skills, and success in education, business, or administration. You are likely to be a quick learner."
        },
        {
            name: "Ruchaka Yoga", type: "Pancha Mahapurusha Yoga", icon: "🔥",
            description: "Formed when Mars is in its own sign (Aries, Scorpio) or exalted sign (Capricorn) and placed in a Kendra house.",
            effects: "Makes you courageous, energetic, and physically strong. You will have strong leadership qualities and may achieve success in military, police, or sports."
        }
    ];

    // Fallback Mock Data for Doshas
    const doshas = data.doshas || {
        manglik: {
            isPresent: true, title: "Manglik Dosha (Kuja Dosha)", status: "Low to Moderate",
            description: "Mars is placed in the 7th house from your Ascendant. This creates a Manglik Dosha, which primarily affects marriage and partnerships.",
            remedy: "It is generally advised to marry a partner with a matching Manglik profile. Chanting the Hanuman Chalisa daily reduces its negative impacts."
        },
        sadeSati: {
            isPresent: false, title: "Shani Sade Sati", status: "Not Active",
            description: "Saturn is currently not transiting the 12th, 1st, or 2nd house from your Natal Moon.",
            remedy: "No specific Sade Sati remedies are required at this moment. Maintain good karma and discipline."
        }
    };

    const yogasHtml = yogas.map(yoga => `
        <div class="yoga-card">
            <div class="yoga-header">
                <div class="yoga-icon">${yoga.icon}</div>
                <div>
                    <h3 class="yoga-title">${yoga.name}</h3>
                    <div class="yoga-type">${yoga.type}</div>
                </div>
            </div>
            <div class="yoga-body">
                <p><strong>Formation:</strong> ${yoga.description}</p>
                <p><strong>Effects:</strong> ${yoga.effects}</p>
            </div>
        </div>
    `).join('');

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

        .section-header { text-align: center; margin-bottom: 25px; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; }

        .yoga-card {
            background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2);
            border-radius: 6px; padding: 15px; margin-bottom: 20px; page-break-inside: avoid;
        }
        .yoga-header { display: flex; align-items: center; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); padding-bottom: 10px; margin-bottom: 10px; }
        .yoga-icon { font-size: 28px; margin-right: 15px; background-color: rgba(161, 73, 59, 0.1); width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .yoga-title { font-size: 18px; color: #a1493b; text-transform: uppercase; letter-spacing: 1px; }
        .yoga-type { font-family: 'Arial', sans-serif; font-size: 12px; color: #15803d; font-weight: bold; }
        .yoga-body { font-family: 'Arial', sans-serif; font-size: 13.5px; line-height: 1.6; color: #555; text-align: justify; }
        .yoga-body p { margin-bottom: 8px; }

        .dosha-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 10px; }
        .dosha-card {
            border: 1px solid rgba(161, 73, 59, 0.3); border-radius: 6px; padding: 20px;
            background-color: #ffffff; position: relative; overflow: hidden; page-break-inside: avoid;
        }
        .dosha-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; }
        .dosha-active::before { background-color: #b91c1c; } 
        .dosha-inactive::before { background-color: #15803d; }

        .dosha-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
        .dosha-title { font-size: 18px; color: #a1493b; font-weight: bold; text-transform: uppercase; }
        .dosha-status-badge { font-family: 'Arial', sans-serif; font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
        .status-active { background-color: rgba(185, 28, 28, 0.1); color: #b91c1c; border: 1px solid rgba(185, 28, 28, 0.3); }
        .status-inactive { background-color: rgba(21, 128, 61, 0.1); color: #15803d; border: 1px solid rgba(21, 128, 61, 0.3); }

        .dosha-desc { font-family: 'Arial', sans-serif; font-size: 13.5px; line-height: 1.6; color: #555; margin-bottom: 10px; text-align: justify; }
        .dosha-remedy { font-family: 'Arial', sans-serif; font-size: 13px; background-color: #fdfbf3; padding: 10px; border-radius: 4px; border-left: 3px solid #a1493b; color: #4a4a4a; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">Planetary Yogas</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">Special planetary combinations forming unique cosmic blessings</p>
            </div>
            <div style="font-family: 'Arial', sans-serif; font-size: 14px; text-align: justify; color: #666; margin-bottom: 25px;">
                In Vedic Astrology, a 'Yoga' is a specific planetary conjunction or placement that creates powerful results. The following significant yogas have been identified in your birth chart.
            </div>
            ${yogasHtml}
        </div>
    </div>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">Astrological Doshas</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">Karmic imbalances and necessary remedies</p>
            </div>
            <div class="dosha-grid">
                <div class="dosha-card ${doshas.manglik.isPresent ? 'dosha-active' : 'dosha-inactive'}">
                    <div class="dosha-header">
                        <div class="dosha-title">${doshas.manglik.title}</div>
                        <div class="dosha-status-badge ${doshas.manglik.isPresent ? 'status-active' : 'status-inactive'}">${doshas.manglik.isPresent ? doshas.manglik.status : 'Not Present'}</div>
                    </div>
                    <div class="dosha-desc">${doshas.manglik.description}</div>
                    ${doshas.manglik.isPresent ? `<div class="dosha-remedy"><strong>Remedy:</strong> ${doshas.manglik.remedy}</div>` : ''}
                </div>
                <div class="dosha-card ${doshas.sadeSati.isPresent ? 'dosha-active' : 'dosha-inactive'}">
                    <div class="dosha-header">
                        <div class="dosha-title">${doshas.sadeSati.title}</div>
                        <div class="dosha-status-badge ${doshas.sadeSati.isPresent ? 'status-active' : 'status-inactive'}">${doshas.sadeSati.isPresent ? doshas.sadeSati.status : 'Not Active'}</div>
                    </div>
                    <div class="dosha-desc">${doshas.sadeSati.description}</div>
                    ${doshas.sadeSati.isPresent ? `<div class="dosha-remedy"><strong>Remedy:</strong> ${doshas.sadeSati.remedy}</div>` : ''}
                </div>
            </div>
        </div>
    </div>
    `;
};

export default generateYogasAndDoshas;