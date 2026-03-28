// server/controllers/matchmakingController.js
import { getMatchmakingData } from '../services/astrologyService.js'; // We'll add this function

/**
 * Matchmaking endpoint
 * POST /api/matchmaking
 * Expects body: { personA, personB }
 */
export const matchmaking = async (req, res) => {
  try {
    const { personA, personB } = req.body;

    // Basic validation
    if (!personA || !personB) {
      return res.status(400).json({ message: 'Both persons are required.' });
    }

    // Prepare birth date-time objects for each person
    const personADateTime = new Date(`${personA.birthDate} ${personA.birthTime}`);
    const personBDateTime = new Date(`${personB.birthDate} ${personB.birthTime}`);

    // Call external astrology API for matchmaking
    // 🌐 TODO: [EXTERNAL ASTRO API] Replace with actual API call
    const result = await getMatchmakingData({
      personA: {
        name: personA.name,
        gender: personA.gender,
        birthDateTime: personADateTime,
        place: personA.place,
      },
      personB: {
        name: personB.name,
        gender: personB.gender,
        birthDateTime: personBDateTime,
        place: personB.place,
      },
    });

    // Save matchmaking request to Supabase (optional)
    // 🚀 TODO: [SUPABASE DB] Insert matchmaking record into 'matchmaking_requests' table

    return res.status(200).json(result);
  } catch (error) {
    console.error('Matchmaking error:', error);
    return res.status(500).json({ message: 'Failed to process matchmaking.' });
  }
};