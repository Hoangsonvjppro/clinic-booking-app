import api from './axiosConfig';

// Send generic email
export const sendEmail = async (emailData) => {
  return api.post('/email/send', emailData);
};

// Send appointment confirmation email
export const sendAppointmentConfirmation = async (appointmentId) => {
  return api.post('/notifications/appointment/confirm', { appointmentId });
};

// Send appointment reminder email
export const sendAppointmentReminder = async (appointmentId) => {
  return api.post('/notifications/appointment/remind', { appointmentId });
};

// Send appointment cancellation email
export const sendAppointmentCancellation = async (appointmentId) => {
  return api.post('/notifications/appointment/cancel', { appointmentId });
};
