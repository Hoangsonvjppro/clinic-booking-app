import api from './axiosConfig';

// Create new appointment
export const createAppointment = async (appointmentData) => {
  return api.post('/appointments', appointmentData);
};

// Get appointment by ID
export const getAppointmentById = async (id) => {
  return api.get(`/appointments/${id}`);
};

// Get appointments by patient ID
export const getAppointmentsByPatient = async (patientId) => {
  return api.get(`/appointments/patient/${patientId}`);
};

// Get appointments by doctor ID
export const getAppointmentsByDoctor = async (doctorId) => {
  return api.get(`/appointments/doctor/${doctorId}`);
};

// Update appointment status
export const updateAppointmentStatus = async (id, status, notes = '') => {
  return api.put(`/appointments/${id}/status`, { status, notes });
};

// Cancel appointment
export const cancelAppointment = async (id, reason = '') => {
  return api.delete(`/appointments/${id}/cancel`, { data: { reason } });
};

// Get upcoming appointments
export const getUpcomingAppointments = async () => {
  return api.get('/appointments/upcoming');
};

// Get appointment history
export const getAppointmentHistory = async () => {
  return api.get('/appointments/history');
};

// Get all appointments with filters
export const getAppointments = async (params = {}) => {
  return api.get('/appointments', { params });
};
