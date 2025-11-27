import api from './axiosConfig';

// Create MoMo payment
export const createMomoPayment = async (paymentData) => {
  return api.post('/momo/create-payment', paymentData);
};

// Get payment by ID
export const getPaymentById = async (paymentId) => {
  return api.get(`/payments/${paymentId}`);
};

// Get payment by appointment ID
export const getPaymentByAppointment = async (appointmentId) => {
  return api.get(`/payments/appointment/${appointmentId}`);
};

// Get payment history
export const getPaymentHistory = async () => {
  return api.get('/payments/history');
};

// Verify payment status
export const verifyPaymentStatus = async (orderId) => {
  return api.get(`/payments/verify/${orderId}`);
};

// Handle MoMo IPN callback (this is called by MoMo, not frontend)
// But we might need to poll for payment status
export const pollPaymentStatus = async (orderId, maxAttempts = 10) => {
  let attempts = 0;
  const interval = 2000; // 2 seconds

  return new Promise((resolve, reject) => {
    const poll = setInterval(async () => {
      attempts++;
      
      try {
        const payment = await verifyPaymentStatus(orderId);
        
        if (payment.status === 'COMPLETED' || payment.status === 'FAILED') {
          clearInterval(poll);
          resolve(payment);
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          reject(new Error('Payment verification timeout'));
        }
      } catch (error) {
        clearInterval(poll);
        reject(error);
      }
    }, interval);
  });
};
