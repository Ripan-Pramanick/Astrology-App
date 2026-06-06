import { translations } from "../translations.js";

const generateAdvancedRemedies = (data) => {
    const lang = data.language || 'en';
    const t = translations[lang] || translations.en;

    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

    let pagesHtml = '';

    planets.forEach((planet) => {
        pagesHtml += `
            <div class="page-container">
                <div class="content-wrapper">
                    <div class="section-header">
                        <h2 class="section-title">${t.remediesTitle || "Advanced Vedic Remedies"}</h2>
                        <div class="gold-line"></div>
                        <p class="section-subtitle">${planet} Propitiation (Shanti)</p>
                    </div>

                    <div class="remedy-block">
                        <h3 class="remedy-heading">Gemstone & Rudraksha for ${planet}</h3>
                        <p class="remedy-text">
                            Wearing the correct gemstone or Rudraksha associated with ${planet} can act as an energetic filter, absorbing positive cosmic rays and mitigating malefic influences. Ensure that any gemstone is properly energized (Pran Pratishtha) before wearing.
                        </p>

                        <h3 class="remedy-heading" style="margin-top: 25px;">Mantra & Chanting</h3>
                        <p class="remedy-text">
                            Sound frequencies hold immense power in Vedic astrology. Regular chanting of the Beej Mantra or Vedic Mantra for ${planet} harmonizes your personal frequency with the planetary frequency, clearing karmic blockages.
                        </p>

                        <h3 class="remedy-heading" style="margin-top: 25px;">Charity & Fasting (Daan & Vrat)</h3>
                        <p class="remedy-text">
                            The most effective way to balance the karma of ${planet} is through selfless service and donation of items associated with it on its designated day. Fasting also detoxifies the physical body, making it a better receptor for positive planetary energies.
                        </p>
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
        .section-header { text-align: center; margin-bottom: 25px; }
        .section-title { font-size: 26px; color: #a1493b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .gold-line { width: 60px; height: 2px; background-color: #a1493b; margin: 10px auto; }
        .section-subtitle { font-size: 16px; color: #707070; font-style: italic; font-weight: bold; }
        .remedy-block { padding: 30px; background-color: #fefaf5; border: 1px solid rgba(161,73,59,0.2); border-radius: 6px; flex-grow: 1; }
        .remedy-heading { font-size: 18px; color: #a1493b; margin-bottom: 12px; border-bottom: 1px dashed #ccc; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;}
        .remedy-text { font-family: 'Arial', sans-serif; font-size: 15px; line-height: 1.8; color: #555555; text-align: justify; }
    </style>
    ${pagesHtml}
    `;
};

export default generateAdvancedRemedies;