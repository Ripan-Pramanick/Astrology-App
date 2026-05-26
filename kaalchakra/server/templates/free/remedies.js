const generateRemedies = (data) => {
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

        /* Grid */
        .elements-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
        .element-card { border: 1px solid rgba(161, 73, 59, 0.2); border-radius: 6px; padding: 15px; display: flex; align-items: center; background-color: #fdfbf3; }
        .element-icon { font-size: 24px; margin-right: 15px; background-color: rgba(161, 73, 59, 0.1); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
        .element-label { font-family: 'Arial', sans-serif; font-size: 10px; color: #707070; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
        .element-value { font-size: 16px; color: #a1493b; font-weight: bold; }
        .full-width { grid-column: span 2; }

        /* Remedies Box */
        .remedy-box { border-left: 3px solid #a1493b; background-color: #fdfbf3; padding: 15px 20px; margin-bottom: 15px; display: flex; align-items: flex-start; }
        .remedy-box-icon { font-size: 24px; margin-right: 15px; }
        .remedy-title { font-size: 14px; color: #a1493b; text-transform: uppercase; font-weight: bold; margin-bottom: 5px; }
        .remedy-desc { font-family: 'Arial', sans-serif; font-size: 13px; color: #555; line-height: 1.6; text-align: justify; }
    </style>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">Auspicious Elements</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">Vibrations and elements that align with your cosmic energy</p>
            </div>

            <div class="elements-grid">
                <div class="element-card">
                    <div class="element-icon">🔢</div>
                    <div><div class="element-label">Lucky Numbers</div><div class="element-value">7, 9</div></div>
                </div>
                <div class="element-card">
                    <div class="element-icon">🎨</div>
                    <div><div class="element-label">Favorable Colors</div><div class="element-value">Saffron, Yellow</div></div>
                </div>
                <div class="element-card full-width">
                    <div class="element-icon">💎</div>
                    <div><div class="element-label">Life Gemstone</div><div class="element-value">Yellow Sapphire (Pukhraj)</div></div>
                </div>
                <div class="element-card full-width">
                    <div class="element-icon">🕉️</div>
                    <div><div class="element-label">Guiding Deity</div><div class="element-value">Lord Vishnu / Brihaspati</div></div>
                </div>
            </div>
        </div>
    </div>

    <div class="page-container">
        <div class="content-wrapper">
            <div class="section-header">
                <h2 class="section-title">Vedic Remedies</h2>
                <div class="gold-line"></div>
                <p class="section-subtitle">Practical spiritual guidance to enhance positive planetary influences</p>
            </div>

            <div class="remedy-box">
                <div class="remedy-box-icon">📿</div>
                <div>
                    <div class="remedy-title">Mantra Chanting</div>
                    <div class="remedy-desc">Chant the Guru Beej Mantra 'Om Gram Greem Groum Sah Gurave Namah' 108 times daily during the morning hours.</div>
                </div>
            </div>
            
            <div class="remedy-box">
                <div class="remedy-box-icon">🤲</div>
                <div>
                    <div class="remedy-title">Charity (Daan)</div>
                    <div class="remedy-desc">Donate yellow items such as chana dal, bananas, or yellow clothing to the needy on Thursdays to strengthen Jupiter.</div>
                </div>
            </div>

            <div class="remedy-box">
                <div class="remedy-box-icon">🌙</div>
                <div>
                    <div class="remedy-title">Fasting (Vrat)</div>
                    <div class="remedy-desc">Observe a fast on Thursdays from sunrise to sunset. Consume a single meal without salt in the evening.</div>
                </div>
            </div>
            
            <div class="remedy-box">
                <div class="remedy-box-icon">🌱</div>
                <div>
                    <div class="remedy-title">Lifestyle & Karma</div>
                    <div class="remedy-desc">Show respect to teachers, elders, and gurus. Volunteering at an educational institution will bring highly positive karmic results.</div>
                </div>
            </div>
        </div>
    </div>
    `;
};

export default generateRemedies;