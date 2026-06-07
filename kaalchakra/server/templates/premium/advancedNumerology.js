import { translations } from "../translations.js";

const generateAdvancedNumerology = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // 🌟 Bulletproof Validation: ডেটা না থাকলে বা undefined হলে ডিফল্ট ডেটা বসবে
    const numData = (data.numerology && data.numerology.radical_number) ? data.numerology : {
        radical_number: 9, radical_ruler: "Mars",
        destiny_number: 5, destiny_ruler: "Mercury",
        name_number: 3,
        fav_color: "Red, Yellow", fav_day: "Tuesday",
        fav_stone: "Coral", friendly_num: "1, 2, 3, 9",
        fav_god: "Lord Hanuman", fav_mantra: "Om Mangalaya Namah"
    };

    let pagesHtml = `
        <div class="page-container">
            <div class="content-wrapper">
                <div class="section-header">
                    <h2 class="section-title">Numerology Analysis</h2>
                    <div class="gold-line"></div>
                    <p class="section-subtitle">Radical / Psychic Number (Moolank)</p>
                </div>
                <div class="num-box">
                    <h3 class="num-value">Radical Number: ${numData.radical_number}</h3>
                    <p class="num-ruler">Ruling Planet: ${numData.radical_ruler}</p>
                    <div class="num-desc">
                        Your Radical Number (Moolank) is the core of your personality. It governs your daily behavior, basic characteristics, and how you interact with the world around you. Ruled by ${numData.radical_ruler}, this number brings specific cosmic vibrations into your daily life.
                    </div>
                </div>
            </div>
        </div>

        <div class="page-container">
            <div class="content-wrapper">
                <div class="section-header">
                    <h2 class="section-title">Numerology Analysis</h2>
                    <div class="gold-line"></div>
                    <p class="section-subtitle">Destiny / Life Path Number (Bhagyank)</p>
                </div>
                <div class="num-box">
                    <h3 class="num-value">Destiny Number: ${numData.destiny_number}</h3>
                    <p class="num-ruler">Ruling Planet: ${numData.destiny_ruler}</p>
                    <div class="num-desc">
                        Your Destiny Number (Bhagyank) reveals the path your life will take. While your Radical number shows who you are, your Destiny number shows what you are meant to do. It becomes highly active in the later part of your life and guides your karmic journey.
                    </div>
                </div>
            </div>
        </div>

        <div class="page-container">
            <div class="content-wrapper">
                <div class="section-header">
                    <h2 class="section-title">Numerology Analysis</h2>
                    <div class="gold-line"></div>
                    <p class="section-subtitle">Name Number (Namank)</p>
                </div>
                <div class="num-box">
                    <h3 class="num-value">Name Number: ${numData.name_number}</h3>
                    <p class="num-ruler">Name Impact Analysis</p>
                    <div class="num-desc">
                        Your Name Number carries the vibrational frequency of the name you use daily. A harmonious Name Number that resonates well with your Radical and Destiny numbers brings immense luck, wealth, and smooth progress in life.
                    </div>
                </div>
            </div>
        </div>

        <div class="page-container">
            <div class="content-wrapper">
                <div class="section-header">
                    <h2 class="section-title">Numerological Remedies</h2>
                    <div class="gold-line"></div>
                    <p class="section-subtitle">Favorable Elements for Success</p>
                </div>
                <div class="num-box" style="padding: 20px;">
                    <div class="fav-grid">
                        <div class="fav-item"><span class="fav-label">Friendly Numbers</span><span class="fav-value">${numData.friendly_num || "N/A"}</span></div>
                        <div class="fav-item"><span class="fav-label">Lucky Colors</span><span class="fav-value">${numData.fav_color || "N/A"}</span></div>
                        <div class="fav-item"><span class="fav-label">Lucky Days</span><span class="fav-value">${numData.fav_day || "N/A"}</span></div>
                        <div class="fav-item"><span class="fav-label">Lucky Gemstone</span><span class="fav-value">${numData.fav_stone || "N/A"}</span></div>
                        <div class="fav-item"><span class="fav-label">Favorable God/Deity</span><span class="fav-value">${numData.fav_god || "Shiva"}</span></div>
                        <div class="fav-item"><span class="fav-label">Powerful Mantra</span><span class="fav-value">${numData.fav_mantra || "Om Namah Shivaya"}</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background-color: #fdfbf3; color: #4a4a4a; width: 210mm; }
        .page-container { padding: 20mm; width: 210mm; min-height: 297mm; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; min-height: calc(297mm - 40mm); border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; }
        .section-header { text-align: center; margin-bottom: 25px; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 16px; color: #707070; font-style: italic; font-weight: bold; }
        .num-box { padding: 40px; background-color: #fcfcfc; border: 1px solid rgba(161,73,59,0.2); border-radius: 6px; flex-grow: 1; text-align: center; display: flex; flex-direction: column; justify-content: center;}
        .num-value { font-size: 40px; color: #a1493b; margin-bottom: 10px; }
        .num-ruler { font-size: 18px; color: #707070; margin-bottom: 25px; font-weight: bold; text-transform: uppercase; border-bottom: 1px dashed #ccc; padding-bottom: 15px; }
        .num-desc { font-family: 'Arial', sans-serif; font-size: 16px; line-height: 1.9; color: #4a4a4a; text-align: justify; }
        .fav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left; }
        .fav-item { background: #fff; padding: 15px; border: 1px solid rgba(161,73,59,0.1); border-radius: 4px; }
        .fav-label { font-family: 'Arial', sans-serif; font-size: 11px; color: #707070; text-transform: uppercase; display: block; margin-bottom: 5px; font-weight: bold; }
        .fav-value { font-size: 15px; color: #a1493b; font-weight: bold; }
    </style>
    ${pagesHtml}
    `;
};

export default generateAdvancedNumerology;