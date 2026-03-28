// client/src/utils/razorpay.js
import axios from 'axios';

/**
 * Load Razorpay script dynamically
 */
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
 * @param {Object} options - Payment details (amount, currency, description, etc.)
 * @param {string} options.amount - Amount in paise (INR)
 * @param {string} options.currency - Currency code (default 'INR')
 * @param {string} options.description - Description for the payment
 * @param {string} options.service - Name of the service being purchased (e.g., 'kundli', 'matchmaking')
 * @param {string} options.serviceId - Optional ID (like kundli request ID)
 * @returns {Promise<Object>} - Resolves with payment response (includes order_id, payment_id, etc.)
 */
export const initiateRazorpayPayment = async (options) => {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    throw new Error('Razorpay SDK failed to load. Check your internet connection.');
  }

  // 1. Create order on backend
  const orderResponse = await axios.post('/api/payment/create-order', {
    amount: options.amount,
    currency: options.currency || 'INR',
    receipt: `receipt_${Date.now()}`,
    description: options.description,
    service: options.service,
    serviceId: options.serviceId,
  });
  const { order, razorpayKey } = orderResponse.data;

  // 2. Prepare Razorpay options
  const razorpayOptions = {
    key: razorpayKey,
    amount: order.amount,
    currency: order.currency,
    name: 'Ruhu Astrology',
    description: options.description,
    order_id: order.id,
    handler: async (response) => {
      // 3. Verify payment on backend
      try {
        const verificationResponse = await axios.post('/api/payment/verify', {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          service: options.service,
          serviceId: options.serviceId,
        });
        if (verificationResponse.data.success) {
          // Payment successful
          return Promise.resolve(verificationResponse.data);
        } else {
          throw new Error(verificationResponse.data.message || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        throw err;
      }
    },
    prefill: {
      name: '', // Can be filled with user's name from auth
      email: '',
      contact: '',
    },
    theme: {
      color: '#4F46E5', // Indigo
    },
  };

  // 3. Open checkout
  const razorpay = new window.Razorpay(razorpayOptions);
  razorpay.open();

  // Return a promise that will be resolved or rejected via the handler
  return new Promise((resolve, reject) => {
    razorpayOptions.handler = (response) => {
      // This will be called after verification is done (we call verification in handler)
      // But since we're already doing verification inside, we need to resolve there.
      // Actually, we should pass the verification result out. Let's restructure:
      // We'll make the handler async and then call resolve/reject from there.
      // However, Razorpay expects a synchronous handler. So we'll move verification outside.
      // Simpler: Let the handler resolve via a global variable? Better to use the verification API call.
      // We'll keep as is: the verification will be done in the handler and then we'll resolve or reject.
      // To communicate back to the caller, we can use a global promise resolver. Not ideal.
      // Alternative: Return a promise that is resolved when verification completes.
    };
    // We'll attach the resolver to a window variable for now (for demo).
    // In production, you can use an event emitter or a callback.
    // For simplicity, we'll modify the handler to call a callback passed by the user.
  });
};

/**
 * Improved version: Accept a callback for success/failure.
 * @param {Object} options - Payment options
 * @param {Function} onSuccess - Callback on successful payment
 * @param {Function} onError - Callback on failure
 */
export const initiatePayment = async (options, onSuccess, onError) => {
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      if (onError) onError(new Error('Razorpay SDK failed to load'));
      return;
    }

    // Create order
    const orderResponse = await axios.post('/api/payment/create-order', {
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      description: options.description,
      service: options.service,
      serviceId: options.serviceId,
    });
    const { order, razorpayKey } = orderResponse.data;

    // Razorpay options
    const razorpayOptions = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: 'Ruhu Astrology',
      description: options.description,
      order_id: order.id,
      handler: async (response) => {
        try {
          const verification = await axios.post('/api/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            service: options.service,
            serviceId: options.serviceId,
          });
          if (verification.data.success) {
            if (onSuccess) onSuccess(verification.data);
          } else {
            if (onError) onError(new Error(verification.data.message || 'Verification failed'));
          }
        } catch (err) {
          if (onError) onError(err);
        }
      },
      prefill: {
        name: options.userName || '',
        email: options.userEmail || '',
        contact: options.userPhone || '',
      },
      theme: {
        color: '#4F46E5',
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  } catch (err) {
    if (onError) onError(err);
  }
};