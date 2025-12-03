import api from './axiosConfig';

// Get all doctors with optional filters
export const getDoctors = async (params = {}) => {
  return api.get('/v1/doctors', { params });
};

// Get doctor by ID
export const getDoctorById = async (id) => {
  return api.get(`/v1/doctors/${id}`);
};

// Apply to become a doctor (with certificate upload)
export const applyAsDoctor = async (formData) => {
  return api.post('/doctor/apply', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Get application status by application ID
export const getApplicationStatus = async (applicationId) => {
  return api.get(`/doctor/status/${applicationId}`);
};

// Get application by user ID
export const getApplicationByUserId = async (userId) => {
  return api.get(`/doctor/user/${userId}`);
};

// Update application by user ID
export const updateApplication = async (userId, applicationData) => {
  return api.put(`/doctor/user/${userId}`, applicationData);
};

// Delete application by user ID
export const deleteApplication = async (userId) => {
  return api.delete(`/doctor/user/${userId}`);
};

// Get all user IDs (for internal sync)
export const getAllUserIds = async () => {
  return api.get('/doctor/all-users');
};

// Approve doctor application (admin only)
export const approveDoctor = async (applicationId) => {
  return api.put(`/doctor/approve?id=${applicationId}`);
};

// Search doctors with filters
export const searchDoctors = async (searchParams) => {
  return api.get('/v1/doctors/search', { params: searchParams });
};

// Get doctor availability (if implemented on backend)
export const getDoctorAvailability = async (doctorId, date) => {
  return api.get(`/v1/doctors/${doctorId}/schedules`, { params: { date } });
};
