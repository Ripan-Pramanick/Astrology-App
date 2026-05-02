// client/src/services/ai.js
import api from './api';

export const getAIPrediction = async (data) => {
  try {
    const response = await api.post('/ai/interpret', {
      planets: data.planets || [],
      basic: {
        ascendant: data.birthDetails?.lagna || data.basicInfo?.ascendant || 'Unknown',
        sign: data.birthDetails?.rasi || data.basicInfo?.sign || 'Unknown',
        Naksahtra: data.birthDetails?.nakshatra || data.basicInfo?.Naksahtra || 'Unknown',
        name: data.birthDetails?.name || 'Client',
        dob: data.birthDetails?.dob || 'Unknown',
        tob: data.birthDetails?.tob || 'Unknown',
        pob: data.birthDetails?.pob || 'Unknown'
      },
      kundliId: data.kundliId
    });
    
    if (response.data.success) {
      return {
        summary: response.data.interpretation,
        insights: [],
        ...response.data
      };
    }
    
    throw new Error(response.data.message || 'Failed to get prediction');
    
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};

export const getRemedySuggestion = async (planets) => {
  try {
    const response = await api.post('/ai/remedies', { planets });
    return response.data;
  } catch (error) {
    console.error('Remedy suggestion error:', error);
    throw error;
  }
};