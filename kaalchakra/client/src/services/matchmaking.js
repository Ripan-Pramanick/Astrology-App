// client/src/services/matchmaking.js
import api from './api';

export const getMatchmakingResult = async (formData) => {
  try {
    const response = await api.post('/matchmaking/calculate', formData);
    return response.data;
  } catch (error) {
    console.error("Error in matchmaking:", error);
    throw error.response?.data || error.message;
  }
};

export const saveMatchmakingResult = async (resultData) => {
  try {
    const response = await api.post('/matchmaking/save', resultData);
    return response.data;
  } catch (error) {
    console.error("Error saving matchmaking result:", error);
    throw error.response?.data || error.message;
  }
};
