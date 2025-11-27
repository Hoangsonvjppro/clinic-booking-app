import api from './axiosConfig';

// Get all patients with optional filters
export const getPatients = async (params = {}) => {
  return api.get('/patients', { params });
};

// Get patient by ID
export const getPatientById = async (id) => {
  return api.get(`/patients/${id}`);
};

// Create new patient
export const createPatient = async (patientData) => {
  return api.post('/patients', patientData);
};

// Update patient
export const updatePatient = async (id, patientData) => {
  return api.put(`/patients/${id}`, patientData);
};

// Delete patient
export const deletePatient = async (id) => {
  return api.delete(`/patients/${id}`);
};

// Search patients
export const searchPatients = async (searchParams) => {
  return api.get('/patients/search', { params: searchParams });
};

// Internal API - Update patient status (called from auth-service)
export const updatePatientStatus = async (userId, status) => {
  return api.post('/internal/patients/status', { userId, status });
};
