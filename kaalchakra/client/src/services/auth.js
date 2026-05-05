// client/src/services/auth.js
import api from './api';

export const verifyPhoneToken = async (idToken, phone) => {
  try {
    const response = await api.post('/auth/verify-phone', { 
      token: idToken,
      phone: phone 
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying phone token:", error);
    throw error.response?.data || { success: false, message: error.message };
  }
};

export const verifyEmailToken = async (idToken, email, name) => {
  try {
    const response = await api.post('/auth/verify-email', {
      token: idToken,
      email: email,
      name: name
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying email token:", error);
    throw error.response?.data || { success: false, message: error.message };
  }
};
