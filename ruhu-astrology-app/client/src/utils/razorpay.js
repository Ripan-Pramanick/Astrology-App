// client/src/utils/razorpay.js
import { createOrder, verifyPayment } from '../services/payment';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initiate Razorpay payment
 * @param {Object} options - Payment options (amount, currency, description, service, serviceId, prefill)
 * @param {Function} onSuccess - Callback after successful payment
 * @param {Function} onError - Callback on failure
 */
export const initiatePayment = async (options, onSuccess, onError) => {
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      if (onError) onError(new Error('Razorpay SDK failed to load'));
      return;
    }

    // Create order on backend
    const orderData = await createOrder({
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt || `receipt_${Date.now()}`,
      description: options.description,
      service: options.service,
      serviceId: options.serviceId,
    });

    const { order, razorpayKey } = orderData;

    const razorpayOptions = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: 'Ruhu Astrology',
      description: options.description,
      order_id: order.id,
      handler: async (response) => {
        // Verify payment with backend
        try {
          const verification = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            service: options.service,
            serviceId: options.serviceId,
          });
          if (verification.success) {
            if (onSuccess) onSuccess(verification);
          } else {
            if (onError) onError(new Error(verification.message || 'Verification failed'));
          }
        } catch (err) {
          if (onError) onError(err);
        }
      },
      prefill: options.prefill || {},
      theme: {
        color: '#4F46E5', // Indigo
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  } catch (err) {
    if (onError) onError(err);
  }
};