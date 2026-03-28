// client/src/services/ai.js
import api from './api';

/**
 * Get AI-generated prediction based on birth details or kundli ID
 * @param {Object} params - { birthDetails, kundliId }
 * @returns {Promise} AI prediction data
 */
export const getAIPrediction = async (params) => {
  const response = await api.post('/ai/predict', params);
  return response.data;
};