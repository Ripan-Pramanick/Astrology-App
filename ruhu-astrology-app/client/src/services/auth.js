// client/src/services/auth.js
import api from './api';

// এই ফাংশনটিই OTPVerify পেজ খুঁজছিল!
// এটি Firebase থেকে পাওয়া টোকেন আমাদের Node.js ব্যাকএন্ডে পাঠাবে।
export const verifyPhoneToken = async (idToken, phone) => {
  try {
    const response = await api.post('/auth/verify-phone', { 
      token: idToken,
      phone: phone 
    });
    
    // সফল হলে লোকাল স্টোরেজে টোকেন সেভ করে রাখা
    if (response.data.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error("Error verifying phone token:", error);
    throw error.response?.data || { success: false, message: error.message };
  }
};

// লগআউট করার ফাংশন (ভবিষ্যতে কাজে লাগবে)
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};