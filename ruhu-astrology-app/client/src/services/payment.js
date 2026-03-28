// client/src/services/payment.js
import api from './api';

/**
 * Create a Razorpay order
 * @param {Object} data - Payment details (amount, currency, description, service, serviceId)
 * @returns {Promise} Order data from backend
 */
export const createOrder = async (data) => {
  const response = await api.post('/payment/create-order', data);
  return response.data;
};

/**
 * Verify payment (optional, could be called after payment)
 * @param {Object} verificationData - Razorpay response
 * @returns {Promise} Verification result
 */
export const verifyPayment = async (verificationData) => {
  const response = await api.post('/payment/verify', verificationData);
  return response.data;
};