// server/controllers/aiController.js
import { generatePrediction } from '../services/aiService.js';

/**
 * Generate AI prediction
 * POST /api/ai/predict
 * Expects body: { birthDetails, kundliId }
 */
export const getPrediction = async (req, res) => {
  try {
    const { birthDetails, kundliId } = req.body;

    if (!birthDetails && !kundliId) {
      return res.status(400).json({ message: 'Either birthDetails or kundliId is required.' });
    }

    // Optionally, fetch birth details from database if kundliId is provided
    let finalBirthDetails = birthDetails;
    if (kundliId && !finalBirthDetails) {
      // 🚀 TODO: [SUPABASE DB] Fetch birth details from kundali_requests table
      // const { data } = await supabase.from('kundali_requests').select('birth_date, birth_time, place').eq('id', kundliId).single();
      // finalBirthDetails = data;
    }

    const prediction = await generatePrediction(finalBirthDetails);
    res.json(prediction);
  } catch (error) {
    console.error('AI prediction error:', error);
    res.status(500).json({ message: 'Failed to generate prediction.' });
  }
};