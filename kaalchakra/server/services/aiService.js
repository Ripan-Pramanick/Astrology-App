// server/services/aiService.js

// ❌ ভুল: import api from './api'; 
// ✅ সঠিক: ফাইলের নামের শেষে .js দিতে হবে
// (যদি api.js ফাইলটি আপনার এই ফোল্ডারে থাকে তবেই এটি রাখুন, নাহলে ডিলিট করে দিন)
// import api from './api.js'; 

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generate AI Prediction using Gemini
 */
export const generatePrediction = async (birthDetails) => {
    try {
        // এখানে আপনার Gemini AI এর লজিক থাকবে
        // উদাহরণস্বরূপ:
        /*
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Astrology prediction for: ${JSON.stringify(birthDetails)}`;
        const result = await model.generateContent(prompt);
        return result.response.text();
        */

        // আপাতত সার্ভার ক্র্যাশ ঠেকানোর জন্য একটি ডামি রেসপন্স:
        return {
            insight: "The stars are aligning in your favor. A great opportunity is coming soon!",
            details: birthDetails
        };
    } catch (error) {
        console.error("Error in aiService:", error);
        throw error; // Controller-এর catch ব্লকে এরর পাঠানোর জন্য
    }
};