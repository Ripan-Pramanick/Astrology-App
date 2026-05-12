// server/controllers/matchmakingController.js
import { getMatchmakingData } from '../services/astrologyService.js';

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
      return res.status(400).json({ 
        success: false, 
        message: 'Both persons are required.' 
      });
    }

    // Validate required fields for each person
    const requiredFields = ['name', 'gender', 'birthDate', 'birthTime', 'place'];
    for (const field of requiredFields) {
      if (!personA[field]) {
        return res.status(400).json({ 
          success: false, 
          message: `Person A: ${field} is required` 
        });
      }
      if (!personB[field]) {
        return res.status(400).json({ 
          success: false, 
          message: `Person B: ${field} is required` 
        });
      }
    }

    // Parse birth date-time strings
    const personADateTime = parseDateTime(personA.birthDate, personA.birthTime);
    const personBDateTime = parseDateTime(personB.birthDate, personB.birthTime);

    // Call astrology API for matchmaking
    const result = await getMatchmakingData({
      personA: {
        name: personA.name,
        gender: personA.gender,
        birthDateTime: personADateTime,
        place: personA.place,
        birthDate: personA.birthDate,
        birthTime: personA.birthTime,
        latitude: personA.latitude || 22.5726,
        longitude: personA.longitude || 88.3639,
        timezone: personA.timezone || 5.5
      },
      personB: {
        name: personB.name,
        gender: personB.gender,
        birthDateTime: personBDateTime,
        place: personB.place,
        birthDate: personB.birthDate,
        birthTime: personB.birthTime,
        latitude: personB.latitude || 22.5726,
        longitude: personB.longitude || 88.3639,
        timezone: personB.timezone || 5.5
      },
    });

    return res.status(200).json({
      success: true,
      data: result.data,
      message: "Matchmaking analysis completed successfully"
    });
    
  } catch (error) {
    console.error('❌ Matchmaking error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process matchmaking.',
      error: error.message 
    });
  }
};

/**
 * Helper function to parse date and time
 */
function parseDateTime(dateStr, timeStr) {
  // Handle different date formats (DD/MM/YYYY or YYYY-MM-DD)
  let day, month, year;
  
  if (dateStr.includes('/')) {
    [day, month, year] = dateStr.split('/');
  } else if (dateStr.includes('-')) {
    [year, month, day] = dateStr.split('-');
  } else {
    throw new Error('Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD');
  }
  
  // Parse time (HH:MM format)
  let hours = 0, minutes = 0;
  if (timeStr) {
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      hours = parseInt(timeMatch[1]);
      minutes = parseInt(timeMatch[2]);
    }
  }
  
  // Create date object (using UTC to avoid timezone issues)
  return new Date(Date.UTC(year, month - 1, day, hours, minutes));
}