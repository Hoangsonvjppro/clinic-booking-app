import api from './axiosConfig';

// Get all doctors with optional filters
export const getDoctors = async (params = {}) => {
  return api.get('/doctors', { params });
};

// Get doctor by ID
export const getDoctorById = async (id) => {
  return api.get(`/doctors/${id}`);
};

// Apply to become a doctor (with certificate upload)
export const applyAsDoctor = async (formData) => {
  return api.post('/doctors/apply', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Get application status by application ID
export const getApplicationStatus = async (applicationId) => {
  return api.get(`/doctors/applications/${applicationId}/status`);
};

// Get application by user ID
export const getApplicationByUserId = async (userId) => {
  return api.get(`/doctors/applications/user/${userId}`);
};

// Update application by user ID
export const updateApplication = async (userId, applicationData) => {
  return api.put(`/doctors/applications/user/${userId}`, applicationData);
};

// Delete application by user ID
export const deleteApplication = async (userId) => {
  return api.delete(`/doctors/applications/user/${userId}`);
};

// Get all user IDs (for internal sync)
export const getAllUserIds = async () => {
  return api.get('/doctors/userIds');
};

// Approve doctor application (admin only)
export const approveDoctor = async (applicationId) => {
  return api.post(`/doctors/${applicationId}/approve`);
};

// Search doctors with filters
export const searchDoctors = async (searchParams) => {
  return api.get('/doctors/search', { params: searchParams });
};

// Get doctor availability (if implemented on backend)
export const getDoctorAvailability = async (doctorId, date) => {
  return api.get(`/doctors/${doctorId}/availability`, { params: { date } });
};
