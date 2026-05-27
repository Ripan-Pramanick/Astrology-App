import { translations } from "../translations.js";

const generateConclusion = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    // Localized Dos and Don'ts Database
    const guidelines = {
        en: {
            dos: [
                "Wake up before sunrise and practice meditation to align with cosmic energies.",
                "Wear your recommended lucky colors during important meetings or events.",
                "Donate to educational charities on Thursdays to strengthen Jupiter.",
                "Maintain a daily journal to channel your Moon's emotional energy constructively.",
                "Trust your intuition when making major financial or career decisions."
            ],
            donts: [
                "Avoid making major impulsive decisions during the retrograde phases of Mercury.",
                "Do not engage in unnecessary arguments on Tuesdays (Mars influence).",
                "Avoid starting completely new long-term ventures on Saturdays.",
                "Stay away from negative environments that drain your emotional energy.",
                "Do not ignore your physical health and dietary routines."
            ]
        },
        bn: {
            dos: [
                "সূর্যোদয়ের আগে ঘুম থেকে উঠুন এবং মহাজাগতিক শক্তির সাথে যুক্ত হতে ধ্যান করুন।",
                "গুরুত্বপূর্ণ কাজের সময় আপনার শুভ রঙের পোশাক পরিধান করুন।",
                "বৃহস্পতি গ্রহকে শক্তিশালী করতে বৃহস্পতিবার শিক্ষামূলক প্রতিষ্ঠানে দান করুন।",
                "মানসিক শক্তি বাড়াতে ডায়েরি লেখার অভ্যাস করুন।",
                "আর্থিক বা পেশাগত সিদ্ধান্তে নিজের অন্তর্দৃষ্টির ওপর ভরসা রাখুন।"
            ],
            donts: [
                "বুধের বক্রী দশায় বড় কোনো আবেগময় বা তাড়াহুড়ো করে সিদ্ধান্ত নেওয়া এড়িয়ে চলুন।",
                "মঙ্গল গ্রহের প্রভাবে মঙ্গলবারে অপ্রয়োজনীয় তর্কে জড়াবেন না।",
                "শনিবার সম্পূর্ণ নতুন কোনো দীর্ঘমেয়াদী উদ্যোগ শুরু করা থেকে বিরত থাকুন।",
                "নেতিবাচক পরিবেশ থেকে দূরে থাকুন যা আপনার মানসিক শক্তি নষ্ট করে।",
                "নিজের শারীরিক স্বাস্থ্য এবং খাদ্যাভ্যাসকে অবহেলা করবেন না।"
            ]
        },
        hi: {
            dos: [
                "सूर्योदय से पहले उठें और ब्रह्मांडीय ऊर्जा के साथ जुड़ने के लिए ध्यान का अभ्यास करें।",
                "महत्वपूर्ण बैठकों या घटनाओं के दौरान अपने अनुशंसित शुभ रंगों को पहनें।",
                "बृहस्पति को मजबूत करने के लिए गुरुवार को शैक्षिक दान करें।",
                "चंद्रमा की भावनात्मक ऊर्जा को चैनलाइज़ करने के लिए दैनिक डायरी बनाए रखें।",
                "प्रमुख वित्तीय या करियर संबंधी निर्णय लेते समय अपने अंतर्ज्ञान पर भरोसा करें।"
            ],
            donts: [
                "बुध के वक्री चरणों के दौरान बड़े आवेगपूर्ण निर्णय लेने से बचें।",
                "मंगलवार (मंगल का प्रभाव) को अनावश्यक तर्कों में शामिल न हों।",
                "शनिवार को पूरी तरह से नए दीर्घकालिक उद्यम शुरू करने से बचें।",
                "नकारात्मक वातावरण से दूर रहें जो आपकी भावनात्मक ऊर्जा को खत्म करते हैं।",
                "अपने शारीरिक स्वास्थ्य और आहार दिनचर्या को अनदेखा न करें।"
            ]
        }
    };

    const currentGuide = guidelines[lang] || guidelines.en;
    const dos = data.dos || currentGuide.dos;
    const donts = data.donts || currentGuide.donts;

    const dosHtml = dos.map(item => `<div class="list-item do-item"><div class="item-icon">✓</div><div class="item-text">${item}</div></div>`).join('');
    const dontsHtml = donts.map(item => `<div class="list-item dont-item"><div class="item-icon">✕</div><div class="item-text">${item}</div></div>`).join('');

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
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; }
        .split-layout { display: flex; gap: 20px; margin-top: 20px; flex-grow: 1; }
        .half-column { flex: 1; background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.15); border-radius: 6px; padding: 20px; }
        .column-title { text-align: center; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px dashed rgba(161, 73, 59, 0.3); }
        .do-title { color: #15803d; } .dont-title { color: #b91c1c; }
        .list-item { display: flex; align-items: flex-start; margin-bottom: 15px; font-family: 'Arial', sans-serif; font-size: 13.5px; line-height: 1.6; }
        .item-icon { font-weight: bold; margin-right: 12px; font-size: 16px; margin-top: -2px; }
        .do-item .item-icon { color: #15803d; } .dont-item .item-icon { color: #b91c1c; }
        .item-text { color: #555555; text-align: justify; }
        
        .back-cover-wrapper { justify-content: center; align-items: center; text-align: center; border: 3px solid #a1493b; background-color: #fdfbf3; }
        .om-symbol-large { font-size: 50px; color: #a1493b; margin-bottom: 20px; }
        .conclusion-text { font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.8; color: #4a4a4a; max-width: 80%; margin: 0 auto 40px auto; text-align: justify; text-align-last: center; }
        .disclaimer-box { background-color: #f5f5f5; border: 1px solid #e0e0e0; padding: 15px; font-family: 'Arial', sans-serif; font-size: 11px; color: #777777; line-height: 1.5; max-width: 90%; margin: 0 auto; text-align: justify; }
        .brand-footer { margin-top: auto; padding-top: 30px; width: 100%; }
        .brand-name { font-size: 20px; color: #a1493b; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 5px; font-weight: bold; }
        .brand-website { font-family: 'Arial', sans-serif; font-size: 12px; color: #707070; letter-spacing: 1px; }
    </style>

    <!-- Dos & Don'ts Page -->
    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">${t.karmicGuidelines || "Karmic Guidelines"}</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">${t.favorableUnfavorable || "Favorable and unfavorable actions based on your planetary alignments"}</p>
            </div>
            <div class="split-layout">
                <div class="half-column">
                    <h3 class="column-title do-title">${t.dos || "Dos (করণীয়)"}</h3>
                    ${dosHtml}
                </div>
                <div class="half-column">
                    <h3 class="column-title dont-title">${t.donts || "Don'ts (বর্জনীয়)"}</h3>
                    ${dontsHtml}
                </div>
            </div>
        </div>
    </div>

    <!-- Final Page -->
    <div class="page-container">
        <div class="content-wrapper back-cover-wrapper">
            <div class="om-symbol-large">ॐ</div>
            <h2 class="section-title" style="font-size: 32px; margin-bottom: 20px;">${t.mayStarsGuide || "May The Stars Guide You"}</h2>
            
            <p class="conclusion-text">
                ${t.conclusionPrefix || "Dear"} <strong>${data.name || 'Seeker'}</strong>, ${t.conclusionMessage || "this astrological blueprint is a map of your cosmic potential."}
            </p>

            <div class="disclaimer-box">
                <strong>${t.disclaimerTitle || "Disclaimer"}:</strong> ${t.disclaimerText || "This report is generated for guidance purposes."}
            </div>

            <div class="brand-footer">
                <div class="brand-name">KAALCHAKRA</div>
                <div class="brand-website">www.kaalchakra.com | contact@kaalchakra.com</div>
            </div>
        </div>
    </div>
    `;
};

export default generateConclusion;