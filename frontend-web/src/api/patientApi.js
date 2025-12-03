import api from './axiosConfig';

// Get all patients with optional filters
export const getPatients = async (params = {}) => {
  return api.get('/v1/patients', { params });
};

// Get patient by ID
export const getPatientById = async (id) => {
  return api.get(`/v1/patients/${id}`);
};

// Create new patient
export const createPatient = async (patientData) => {
  return api.post('/v1/patients', patientData);
};

// Update patient
export const updatePatient = async (id, patientData) => {
  return api.put(`/v1/patients/${id}`, patientData);
};

// Delete patient
export const deletePatient = async (id) => {
  return api.delete(`/v1/patients/${id}`);
};

// Search patients
export const searchPatients = async (searchParams) => {
  return api.get('/v1/patients/search', { params: searchParams });
};

// Internal API - Update patient status (called from auth-service)
export const updatePatientStatus = async (userId, status) => {
  return api.post('/internal/patients/status', { userId, status });
};
