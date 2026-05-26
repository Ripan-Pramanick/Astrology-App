const generateHouseAnalysis = (data) => {
    // Fallback Mock Data for 12 Houses
    // Later, you will map this from AstrologyAPI's detailed predictions
    const housesData = data.housesAnalysis || [
        {
            num: 1, name: "First House (Tanu Bhava)", 
            aspect: "Self, Physical Body, Personality, and General Well-being",
            icon: "👤",
            content: "The 1st House, or Ascendant, represents your outward identity. Its condition determines your vitality and how the world perceives you. You naturally exude leadership and confidence. Positive planetary influences here suggest a robust physical constitution and a charismatic presence."
        },
        {
            num: 2, name: "Second House (Dhana Bhava)", 
            aspect: "Wealth, Speech, Immediate Family, and Values",
            icon: "🪙",
            content: "Governing your accumulated wealth and speech, this house indicates your financial stability. You have a knack for saving and managing resources. The presence of benefic planets here gives you a persuasive and sweet voice, helping you in family and business matters."
        },
        {
            num: 3, name: "Third House (Sahaja Bhava)", 
            aspect: "Courage, Siblings, Communication, and Short Journeys",
            icon: "🤝",
            content: "This house fuels your courage and initiatives. Your communicative abilities are highlighted here, suggesting success in writing, media, or sales. It also shows a protective and supportive relationship with younger siblings."
        },
        {
            num: 4, name: "Fourth House (Sukha Bhava)", 
            aspect: "Mother, Home, Emotions, Property, and Inner Peace",
            icon: "🏡",
            content: "Representing your roots and domestic life, the 4th house shows a deep attachment to your home environment. You seek emotional security through property and assets. A strong 4th house indicates peace of mind and a loving relationship with the mother figure."
        },
        {
            num: 5, name: "Fifth House (Putra Bhava)", 
            aspect: "Intellect, Children, Creativity, and Speculation",
            icon: "🎨",
            content: "The realm of creativity and past-life merits (Purva Punya). You possess a sharp intellect and a natural flair for the arts or education. This house also promises joy through children and potential success in speculative investments."
        },
        {
            num: 6, name: "Sixth House (Ari Bhava)", 
            aspect: "Obstacles, Enemies, Debts, Diseases, and Daily Service",
            icon: "⚖️",
            content: "Though known as a difficult house, it gives you the fighting spirit to overcome adversaries. You have a strong sense of duty and excel in service-oriented professions. Preventive healthcare is advised to maintain vitality."
        },
        {
            num: 7, name: "Seventh House (Kalatra Bhava)", 
            aspect: "Marriage, Partnerships, Business, and Public Dealings",
            icon: "💍",
            content: "This house reflects your spouse and significant partnerships. You seek harmony and balance in relationships. Strong alignments here ensure a supportive life partner and fruitful business collaborations."
        },
        {
            num: 8, name: "Eighth House (Ayu Bhava)", 
            aspect: "Longevity, Transformation, Occult, and Sudden Events",
            icon: "🔮",
            content: "The house of profound transformations and hidden knowledge. You have a natural intuition and may be drawn to research, astrology, or the occult. It also governs unearned wealth like inheritances or sudden gains."
        },
        {
            num: 9, name: "Ninth House (Dharma Bhava)", 
            aspect: "Fortune, Religion, Higher Learning, and Father",
            icon: "🕊️",
            content: "The most auspicious house, representing luck and spiritual inclinations. You are guided by strong moral principles and may undertake long pilgrimages or higher studies. It signifies blessings from elders and the father."
        },
        {
            num: 10, name: "Tenth House (Karma Bhava)", 
            aspect: "Career, Profession, Status, and Authority",
            icon: "👑",
            content: "The highest point in your chart, defining your public life and career. You are ambitious and destined for a position of authority. Your karma is linked to public service or leadership, bringing respect and honor in society."
        },
        {
            num: 11, name: "Eleventh House (Labha Bhava)", 
            aspect: "Gains, Aspirations, Elder Siblings, and Social Network",
            icon: "📈",
            content: "The house of fulfillment of desires. You benefit greatly from large social networks and influential friends. Income flows smoothly, and your long-term goals are well-supported by planetary transits here."
        },
        {
            num: 12, name: "Twelfth House (Vyaya Bhava)", 
            aspect: "Losses, Foreign Lands, Spirituality, and Liberation (Moksha)",
            icon: "🌌",
            content: "The final house completes the soul's journey. While it indicates expenses, it also opens doors to foreign travel and deep spiritual awakening. You find peace in solitude, meditation, and charitable acts."
        }
    ];

    const generateHouseHTML = (house) => `
        <div class="house-block">
            <div class="house-header">
                <div class="house-icon">${house.icon}</div>
                <div class="house-title-group">
                    <h3 class="house-title">${house.name}</h3>
                    <div class="house-aspect">${house.aspect}</div>
                </div>
                <div class="house-number">${house.num}</div>
            </div>
            <div class="house-content">
                <p class="house-text">${house.content}</p>
                <div class="house-details-grid">
                    <div class="detail-item"><strong>Resident Planets:</strong> To be calculated</div>
                    <div class="detail-item"><strong>House Lord:</strong> To be calculated</div>
                </div>
            </div>
        </div>
    `;

    // Group houses (e.g., 3 houses per page)
    let pagesHtml = '';
    for (let i = 0; i < housesData.length; i += 3) {
        const chunk = housesData.slice(i, i + 3);
        const chunkHtml = chunk.map(generateHouseHTML).join('');
        
        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    ${i === 0 ? `
                    <div class="section-header">
                        <h2 class="section-title">Bhav Phal (House Analysis)</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">Detailed predictions based on the 12 houses of your Kundli</p>
                    </div>
                    ` : '<div style="height: 15mm;"></div>'}
                    
                    <div class="houses-wrapper">
                        ${chunkHtml}
                    </div>
                </div>
            </div>
        `;
    }

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

        .section-header { text-align: center; margin-bottom: 30px; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; }

        .houses-wrapper { flex-grow: 1; display: flex; flex-direction: column; gap: 25px; }

        .house-block {
            background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2);
            border-radius: 6px; overflow: hidden; page-break-inside: avoid;
        }

        .house-header {
            display: flex; align-items: center; padding: 15px 20px;
            background-color: rgba(161, 73, 59, 0.08);
            border-bottom: 1px solid rgba(161, 73, 59, 0.2);
        }

        .house-icon { font-size: 32px; margin-right: 15px; }
        .house-title-group { flex-grow: 1; }
        .house-title { font-size: 18px; color: #a1493b; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .house-aspect { font-family: 'Arial', sans-serif; font-size: 12px; color: #666; font-style: italic; }
        
        .house-number {
            font-size: 40px; color: rgba(161, 73, 59, 0.15); font-weight: bold; font-family: 'Arial', sans-serif;
        }

        .house-content { padding: 20px; }
        .house-text {
            font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.7; color: #555; text-align: justify; margin-bottom: 15px;
        }

        .house-details-grid {
            display: grid; grid-template-columns: 1fr 1fr; gap: 15px;
            padding-top: 15px; border-top: 1px dashed rgba(161, 73, 59, 0.3);
            font-family: 'Arial', sans-serif; font-size: 12px; color: #a1493b;
        }
        .detail-item strong { color: #4a4a4a; margin-right: 5px; }
    </style>

    ${pagesHtml}
    `;
};

export default generateHouseAnalysis;