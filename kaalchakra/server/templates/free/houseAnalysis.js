import { translations } from "../translations.js";

const generateHouseAnalysis = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const housesLocalizedData = {
        en: [
            { num: 1, name: "First House (Tanu Bhava)", aspect: "Self, Physical Body, Personality", icon: "👤", content: "The 1st House represents your outward identity. Its condition determines your vitality and how the world perceives you." },
            { num: 2, name: "Second House (Dhana Bhava)", aspect: "Wealth, Speech, Immediate Family", icon: "🪙", content: "Governing your accumulated wealth and speech, this house indicates your financial stability." },
            { num: 3, name: "Third House (Sahaja Bhava)", aspect: "Courage, Siblings, Communication", icon: "🤝", content: "This house fuels your courage and initiatives. Your communicative abilities are highlighted here." },
            { num: 4, name: "Fourth House (Sukha Bhava)", aspect: "Mother, Home, Emotions", icon: "🏡", content: "Representing your roots and domestic life, the 4th house shows a deep attachment to your home environment." },
            { num: 5, name: "Fifth House (Putra Bhava)", aspect: "Intellect, Children, Creativity", icon: "🎨", content: "The realm of creativity and past-life merits. You possess a sharp intellect." },
            { num: 6, name: "Sixth House (Ari Bhava)", aspect: "Obstacles, Enemies, Debts", icon: "⚖️", content: "Though known as a difficult house, it gives you the fighting spirit to overcome adversaries." },
            { num: 7, name: "Seventh House (Kalatra Bhava)", aspect: "Marriage, Partnerships, Business", icon: "💍", content: "This house reflects your spouse and significant partnerships. You seek harmony and balance." },
            { num: 8, name: "Eighth House (Ayu Bhava)", aspect: "Longevity, Transformation, Occult", icon: "🔮", content: "The house of profound transformations and hidden knowledge. You have a natural intuition." },
            { num: 9, name: "Ninth House (Dharma Bhava)", aspect: "Fortune, Religion, Higher Learning", icon: "🕊️", content: "The most auspicious house, representing luck and spiritual inclinations." },
            { num: 10, name: "Tenth House (Karma Bhava)", aspect: "Career, Profession, Status", icon: "👑", content: "The highest point in your chart, defining your public life and career." },
            { num: 11, name: "Eleventh House (Labha Bhava)", aspect: "Gains, Aspirations, Elder Siblings", icon: "📈", content: "The house of fulfillment of desires. You benefit greatly from large social networks." },
            { num: 12, name: "Twelfth House (Vyaya Bhava)", aspect: "Losses, Foreign Lands, Spirituality", icon: "🌌", content: "The final house completes the soul's journey. It opens doors to foreign travel and deep spiritual awakening." }
        ],
        bn: [
            { num: 1, name: "প্রথম ভাব (তনু ভাব)", aspect: "নিজস্ব সত্তা, শারীরিক গঠন, ব্যক্তিত্ব", icon: "👤", content: "প্রথম ভাব বা লগ্ন আপনার বাহ্যিক পরিচয়কে উপস্থাপন করে। এর অবস্থান নির্ধারণ করে আপনার জীবনীশক্তি এবং உலகம் আপনাকে কীভাবে দেখে।" },
            { num: 2, name: "দ্বিতীয় ভাব (ধন ভাব)", aspect: "সম্পদ, কথা, পরিবার", icon: "🪙", content: "আপনার সঞ্চিত সম্পদ এবং কথা বলার ধরনকে নিয়ন্ত্রণ করে এই ভাব। এটি আপনার আর্থিক স্থিতিশীলতার নির্দেশক।" },
            { num: 3, name: "তৃতীয় ভাব (সহজ ভাব)", aspect: "সাহস, ভাইবোন, যোগাযোগ", icon: "🤝", content: "এই ভাব আপনার সাহস এবং উদ্যোগকে উদ্দীপিত করে। আপনার যোগাযোগের দক্ষতা এখানে বিশেষভাবে প্রতিফলিত হয়।" },
            { num: 4, name: "চতুর্থ ভাব (সুখ ভাব)", aspect: "মাতা, গৃহ, আবেগ, সম্পত্তি", icon: "🏡", content: "আপনার শেকড় এবং পারিবারিক জীবনের প্রতিনিধিত্বকারী, ৪র্থ ভাব আপনার বাড়ির পরিবেশের প্রতি গভীর অনুরাগ দেখায়।" },
            { num: 5, name: "পঞ্চম ভাব (পুত্র ভাব)", aspect: "বুদ্ধিমত্তা, সন্তান, সৃজনশীলতা", icon: "🎨", content: "সৃজনশীলতা এবং পূর্ব-জন্মের পুণ্যের ক্ষেত্র। আপনি তীক্ষ্ণ বুদ্ধিমত্তা এবং শিল্প বা শিক্ষার প্রতি স্বাভাবিক আকর্ষণ ধারণ করেন।" },
            { num: 6, name: "ষষ্ঠ ভাব (অরি ভাব)", aspect: "বাধা, শত্রু, ঋণ, রোগ", icon: "⚖️", content: "যদিও এটি একটি কঠিন ভাব হিসেবে পরিচিত, তবে এটি আপনাকে শত্রুদের পরাস্ত করার লড়াইয়ের মানসিকতা দেয়।" },
            { num: 7, name: "সপ্তম ভাব (কলত্র ভাব)", aspect: "বিবাহ, অংশীদারিত্ব, ব্যবসা", icon: "💍", content: "এই ভাব আপনার জীবনসঙ্গী এবং গুরুত্বপূর্ণ অংশীদারিত্বকে প্রতিফলিত করে। আপনি সম্পর্কে সম্প্রীতি ও ভারসাম্য খোঁজেন।" },
            { num: 8, name: "অষ্টম ভাব (আয়ু ভাব)", aspect: "দীর্ঘায়ু, রূপান্তর, গুপ্তবিদ্যা", icon: "🔮", content: "গভীর রূপান্তর এবং গুপ্ত জ্ঞানের ভাব। আপনার মধ্যে স্বাভাবিক অন্তর্দৃষ্টি রয়েছে এবং গবেষণা বা জ্যোতিষশাস্ত্রের প্রতি আকৃষ্ট হতে পারেন।" },
            { num: 9, name: "নবম ভাব (ধর্ম ভাব)", aspect: "ভাগ্য, ধর্ম, উচ্চশিক্ষা", icon: "🕊️", content: "সবচেয়ে শুভ ভাব, যা ভাগ্য এবং আধ্যাত্মিক প্রবণতার প্রতিনিধিত্ব করে। আপনি শক্তিশালী নৈতিক নীতি দ্বারা পরিচালিত হন।" },
            { num: 10, name: "দশম ভাব (কর্ম ভাব)", aspect: "কর্মজীবন, পেশা, মর্যাদা", icon: "👑", content: "আপনার চার্টের সর্বোচ্চ বিন্দু, যা আপনার কর্মজীবনকে সংজ্ঞায়িত করে। আপনি উচ্চাকাঙ্ক্ষী এবং সমাজে সম্মানের অধিকারী হবেন।" },
            { num: 11, name: "একাদশ ভাব (লাভ ভাব)", aspect: "লাভ, আকাঙ্ক্ষা, বড় ভাইবোন", icon: "📈", content: "ইচ্ছা পূরণের ভাব। আপনি বৃহত্তর সামাজিক নেটওয়ার্ক এবং প্রভাবশালী বন্ধুদের থেকে ব্যাপকভাবে লাভবান হন।" },
            { num: 12, name: "দ্বাদশ ভাব (ব্যয় ভাব)", aspect: "ক্ষতি, বিদেশ যাত্রা, আধ্যাত্মিকতা", icon: "🌌", content: "চূড়ান্ত ভাব যা আত্মার যাত্রাকে সম্পূর্ণ করে। এটি আধ্যাত্মিক জাগরণ এবং মোক্ষলাভের নির্দেশক।" }
        ],
        hi: [
            { num: 1, name: "प्रथम भाव (तनु भाव)", aspect: "स्वयं, शारीरिक संरचना, व्यक्तित्व", icon: "👤", content: "प्रथम भाव या लग्न आपकी बाहरी पहचान का प्रतिनिधित्व करता है। इसकी स्थिति आपकी जीवन शक्ति निर्धारित करती है।" },
            { num: 2, name: "द्वितीय भाव (धन भाव)", aspect: "धन, वाणी, परिवार", icon: "🪙", content: "आपके संचित धन और वाणी को नियंत्रित करते हुए, यह भाव आपकी वित्तीय स्थिरता को दर्शाता है।" },
            { num: 3, name: "तृतीय भाव (सहज भाव)", aspect: "साहस, भाई-बहन, संचार", icon: "🤝", content: "यह भाव आपके साहस और पहल को बढ़ावा देता है। आपकी संचार क्षमताएं यहां उजागर होती हैं।" },
            { num: 4, name: "चतुर्थ भाव (सुख भाव)", aspect: "माता, घर, भावनाएं, संपत्ति", icon: "🏡", content: "आपकी जड़ों और घरेलू जीवन का प्रतिनिधित्व करते हुए, चौथा भाव आपके घर के माहौल के प्रति गहरा लगाव दिखाता है।" },
            { num: 5, name: "पंचम भाव (पुत्र भाव)", aspect: "बुद्धि, संतान, रचनात्मकता", icon: "🎨", content: "रचनात्मकता और पूर्व-जन्म के गुणों का क्षेत्र। आप तेज बुद्धि और कला के प्रति स्वाभाविक आकर्षण रखते हैं।" },
            { num: 6, name: "षष्ठ भाव (अरि भाव)", aspect: "बाधाएं, शत्रु, ऋण, रोग", icon: "⚖️", content: "हालांकि यह एक कठिन भाव के रूप में जाना जाता है, यह आपको विरोधियों पर काबू पाने की लड़ने की भावना देता है।" },
            { num: 7, name: "सप्तम भाव (कलत्र भाव)", aspect: "विवाह, साझेदारी, व्यापार", icon: "💍", content: "यह भाव आपके जीवनसाथी और महत्वपूर्ण साझेदारी को दर्शाता है। आप रिश्तों में सद्भाव और संतुलन चाहते हैं।" },
            { num: 8, name: "अष्टम भाव (आयु भाव)", aspect: "दीर्घायु, परिवर्तन, रहस्य", icon: "🔮", content: "गहरे परिवर्तनों और छिपे हुए ज्ञान का भाव। आपके पास एक स्वाभाविक अंतर्ज्ञान है और आप ज्योतिष की ओर आकर्षित हो सकते हैं।" },
            { num: 9, name: "नवम भाव (धर्म भाव)", aspect: "भाग्य, धर्म, उच्च शिक्षा", icon: "🕊️", content: "सबसे शुभ भाव, जो भाग्य और आध्यात्मिक झुकाव का प्रतिनिधित्व करता है। आप मजबूत नैतिक सिद्धांतों द्वारा निर्देशित होते हैं।" },
            { num: 10, name: "दशम भाव (कर्म भाव)", aspect: "करियर, पेशा, स्थिति", icon: "👑", content: "आपके चार्ट का उच्चतम बिंदु, जो आपके सार्वजनिक जीवन और करियर को परिभाषित करता है।" },
            { num: 11, name: "एकादश भाव (लाभ भाव)", aspect: "लाभ, आकांक्षाएं, बड़े भाई-बहन", icon: "📈", content: "इच्छाओं की पूर्ति का भाव। आप बड़े सामाजिक नेटवर्क और प्रभावशाली मित्रों से बहुत लाभान्वित होते हैं।" },
            { num: 12, name: "द्वादश भाव (व्यय भाव)", aspect: "नुकसान, विदेश यात्रा, आध्यात्मिकता", icon: "🌌", content: "अंतिम भाव आत्मा की यात्रा को पूरा करता है। यह विदेशी यात्रा और आध्यात्मिक जागृति के द्वार खोलता है।" }
        ]
    };

    const housesData = housesLocalizedData[lang] || housesLocalizedData['en'];

    // 🌟 1 house per page
    let pagesHtml = '';
    housesData.forEach((house, index) => {
        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    ${index === 0 ? `
                    <div class="section-header">
                        <h2 class="section-title">${t.bhavPhal}</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">${t.bhavPhalDesc}</p>
                    </div>
                    ` : '<div style="height: 15mm;"></div>'}
                    
                    <div class="house-block" style="height: 100%; display:flex; flex-direction:column; justify-content:center;">
                        <div class="house-header" style="padding: 30px; text-align:center; flex-direction:column;">
                            <div class="house-icon" style="font-size: 60px; margin-bottom:15px;">${house.icon}</div>
                            <h3 class="house-title" style="font-size: 24px;">${house.name}</h3>
                            <div class="house-aspect" style="font-size: 16px; color:#666;">${house.aspect}</div>
                            <div class="house-number" style="font-size: 80px; position:absolute; top:20px; right:30px;">${house.num}</div>
                        </div>
                        <div class="house-content" style="padding: 40px;">
                            <p class="house-text" style="font-size: 18px; line-height: 2; text-align:center;">${house.content}</p>
                            <div class="house-details-grid" style="margin-top: 40px; font-size: 16px;">
                                <div class="detail-item"><strong>${t.residentPlanets}:</strong> To be calculated</div>
                                <div class="detail-item"><strong>${t.houseLord}:</strong> To be calculated</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    return `
    <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background-color: #fdfbf3; color: #4a4a4a; width: 210mm; }
        .page-container { padding: 20mm; width: 210mm; min-height: 297mm; position: relative; page-break-after: always; }
        .content-wrapper { border: 2px solid #a1493b; padding: 15mm; min-height: calc(297mm - 40mm); border-radius: 4px; background-color: #ffffff; display: flex; flex-direction: column; }
        .section-header { text-align: center; margin-bottom: 30px; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 13px; color: #707070; font-style: italic; }
        .house-block { background-color: #fdfbf3; border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; overflow: hidden; position:relative; }
        .house-header { background-color: rgba(161, 73, 59, 0.08); border-bottom: 1px solid rgba(161, 73, 59, 0.2); }
        .house-title { color: #a1493b; text-transform: uppercase; letter-spacing: 1px; }
        .house-number { color: rgba(161, 73, 59, 0.1); font-weight: bold; font-family: 'Arial', sans-serif; }
        .house-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding-top: 15px; border-top: 1px dashed rgba(161, 73, 59, 0.3); font-family: 'Arial', sans-serif; color: #a1493b; text-align:center; }
        .detail-item strong { color: #4a4a4a; margin-right: 5px; }
    </style>
    ${pagesHtml}
    `;
};

export default generateHouseAnalysis;