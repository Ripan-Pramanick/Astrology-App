// server/services/paymentService.js
import { supabase } from '../utils/supabase.js';

/**
 * Save payment record to database
 * @param {Object} paymentData - Payment details
 * @returns {Promise} Saved record
 */
export const savePaymentRecord = async (paymentData) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select()
    .single();

  if (error) throw new Error('Failed to save payment record');
  return data;
};

/**
 * Update payment record after successful payment
 * @param {string} orderId - Razorpay order ID
 * @param {Object} updateData - Data to update (payment_id, status, etc.)
 */
export const updatePaymentRecord = async (orderId, updateData) => {
  const { error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('order_id', orderId);

  if (error) throw new Error('Failed to update payment record');
};

/**
 * Update service request (e.g., kundali_requests) after payment success
 * @param {string} service - Service type ('kundli', 'matchmaking', etc.)
 * @param {string} serviceId - ID of the service request
 */
export const updateServicePaymentStatus = async (service, serviceId) => {
  let table;
  if (service === 'kundli') table = 'kundali_requests';
  else if (service === 'matchmaking') table = 'matchmaking_requests';
  else throw new Error('Unknown service');

  const { error } = await supabase
    .from(table)
    .update({ payment_status: 'paid' })
    .eq('id', serviceId);

  if (error) throw new Error('Failed to update service payment status');
};