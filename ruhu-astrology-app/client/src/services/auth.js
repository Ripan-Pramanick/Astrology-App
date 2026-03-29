// client/src/services/auth.js
import api from './api';

// এখানে অবশ্যই 'export' থাকতে হবে
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



const handleVerifyOTP = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const confirmationResult = window.confirmationResult;
    const result = await confirmationResult.confirm(otp);
    
    // টোকেন জেনারেট করা
    const idToken = await result.user.getIdToken();
    console.log("🔥 Sending Token to Backend:", idToken); // চেক করার জন্য

    // টোকেন এবং ফোন নম্বর—দুটোই পাঠান (আপনার সার্ভিস এখন দুটোই চায়)
    const response = await verifyPhoneToken(idToken, phoneNumber); 
    
    if (response.success) {
      navigate('/dashboard');
    }
  } catch (err) {
    console.error("Verification Error:", err);
    setError(err.message || 'OTP ভুল হয়েছে।');
  } finally {
    setLoading(false);
  }
};