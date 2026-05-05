// client/src/services/kundli.js
import api from './api'; 

// Kundli generate korte backend e POST kora
export const createKundaliRequest = async (formData) => {
  try {
    const response = await api.post('/kundli/generate', formData);
    return response.data;
  } catch (error) {
    console.error("Error creating Kundli request:", error);
    throw error.response?.data || error.message;
  }
};

// Kundli result fetch kora (real API call)
export const fetchKundliResult = async (id) => {
  try {
    const response = await api.get(`/kundli/result/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Kundli result:", error);
    throw error.response?.data || error.message;
  }
};
