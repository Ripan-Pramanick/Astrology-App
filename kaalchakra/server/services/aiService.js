import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to identify language
const getLanguageName = (langCode) => {
    const langs = {
        'en': 'English',
        'bn': 'Bengali',
        'hi': 'Hindi'
    };
    return langs[langCode] || 'English'; // Default to English
};

// 1. For PDF Report Generation (Multi-language Support)
export const generateAIPredictions = async (astroData) => {
  try {
    const langName = getLanguageName(astroData.language);

    const prompt = `
      You are an expert Vedic Astrologer with 30 years of experience. 
      I will provide you with a person's basic astrological details. 
      Your task is to generate a highly personalized, deep, and empathetic astrological reading for them.
      Make it sound profound, accurate, and uplifting.

      IMPORTANT INSTRUCTION: Write the entire response strictly in ${langName} language. Ensure all paragraphs and highlight arrays are translated beautifully into ${langName}. However, keep the JSON keys strictly in English.

      User Details:
      - Name: ${astroData.name}
      - Ascendant (Lagna): ${astroData.ascendant}
      - Moon Sign (Rashi): ${astroData.moonSign}
      - Sun Sign: ${astroData.sunSign}

      Please provide the analysis strictly in the following JSON format. Ensure the JSON is valid and contains no markdown formatting like \`\`\`json.
      
      {
        "lagnaAnalysis": "Write a detailed paragraph analyzing their outward personality and physical traits based on their Ascendant.",
        "rashiAnalysis": "Write a detailed paragraph analyzing their emotional intelligence and subconscious mind based on their Moon Sign.",
        "corePersonality": "Write a 3-4 sentence synthesis of their core identity.",
        "career": "Write 2-3 detailed paragraphs (approx 150-200 words) deeply analyzing their career path, wealth creation, and leadership potential based on their astrological signs. Use formatting like paragraphs (\\n\\n).",
        "careerHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
        "relationship": "Write 2-3 detailed paragraphs (approx 150-200 words) deeply analyzing their love life, marriage potential, and emotional connections. Use formatting like paragraphs (\\n\\n).",
        "relationshipHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
        "health": "Write 2-3 detailed paragraphs (approx 150-200 words) analyzing their physical vitality and mental peace, suggesting routine or meditation. Use formatting like paragraphs (\\n\\n).",
        "healthHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
        "finance": "Write 2-3 detailed paragraphs (approx 150-200 words) deeply analyzing their financial luck, wealth accumulation, and investment potential based on their chart. Use formatting like paragraphs (\\n\\n).",
        "financeHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional Vedic Astrologer. You output only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content.trim();
    const jsonString = aiResponse.replace(/```json/g, '').replace(/```/g, '');
    
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("OpenAI Error (PDF):", error.message);
    // Fallback data
    return {
      lagnaAnalysis: `As a ${astroData.ascendant} ascendant, you possess a dynamic outward personality.`,
      rashiAnalysis: `With your Moon in ${astroData.moonSign}, you have a deep emotional well.`,
      corePersonality: `You balance practical wisdom with creative vision perfectly.`,
      career: `Your career path indicates steady growth and leadership potential. Focus on your strengths to achieve long-term success.`,
      careerHighlights: ["Leadership", "Growth", "Focus"],
      relationship: `You value deep, harmonious connections in relationships. Communication and trust will be your strongest pillars.`,
      relationshipHighlights: ["Empathy", "Loyalty", "Harmony"],
      health: `Maintain a balanced routine for optimal vitality. Regular meditation will keep your stress levels in check.`,
      healthHighlights: ["Balance", "Routine", "Peace"],
      finance: `Planetary alignments suggest steady financial growth. It is highly advised to focus on long-term wealth accumulation rather than short-term gains.`,
      financeHighlights: ["Steady Accumulation", "Wise Investments", "Asset Protection"]
    };
  }
};

// 2. For your existing aiController (General Prompting - Prevents Crash)
export const generatePrediction = async (promptText) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful Vedic Astrologer." },
        { role: "user", content: promptText }
      ],
      temperature: 0.7,
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI Error (General):", error.message);
    throw new Error("Failed to generate AI response.");
  }
};