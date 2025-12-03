import api from './axiosConfig';

// ============================================
// USER REPORT APIs
// ============================================

/**
 * Create a new report as a patient
 * @param {Object} reportData - { reportedId, reportType, title, description, appointmentId?, evidenceUrls? }
 */
export const createPatientReport = async (reportData) => {
  return api.post('/v1/reports/patient', reportData);
};

/**
 * Create a new report as a doctor
 * @param {Object} reportData - { reportedId, reportType, title, description, appointmentId?, evidenceUrls? }
 */
export const createDoctorReport = async (reportData) => {
  return api.post('/v1/reports/doctor', reportData);
};

/**
 * Get reports made by current user
 * @param {string} status - Optional status filter
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 */
export const getMyReports = async (status, page = 0, size = 10) => {
  const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
  if (status) params.append('status', status);
  return api.get(`/v1/reports/my-reports?${params.toString()}`);
};

/**
 * Get a specific report by ID
 * @param {string} reportId - Report UUID
 */
export const getReportById = async (reportId) => {
  return api.get(`/v1/reports/${reportId}`);
};

/**
 * Check if user can report another user for an appointment
 * @param {string} reportedId - User ID to report
 * @param {string} appointmentId - Appointment ID (optional)
 */
export const checkCanReport = async (reportedId, appointmentId = null) => {
  const params = new URLSearchParams({ reportedId });
  if (appointmentId) params.append('appointmentId', appointmentId);
  return api.get(`/v1/reports/check?${params.toString()}`);
};

/**
 * Get recent reports made by current user
 * @param {number} limit - Max number of reports
 */
export const getMyRecentReports = async (limit = 5) => {
  return api.get(`/v1/reports/my-reports/recent?limit=${limit}`);
};

// ============================================
// USER WARNING APIs
// ============================================

/**
 * Get all warnings for current user
 * @param {number} page - Page number
 * @param {number} size - Page size
 */
export const getMyWarnings = async (page = 0, size = 10) => {
  return api.get(`/v1/warnings/my-warnings?page=${page}&size=${size}`);
};

/**
 * Get unread warnings for current user
 */
export const getUnreadWarnings = async () => {
  return api.get('/v1/warnings/my-warnings/unread');
};

/**
 * Get a specific warning by ID
 * @param {string} warningId - Warning UUID
 */
export const getWarningById = async (warningId) => {
  return api.get(`/v1/warnings/${warningId}`);
};

/**
 * Mark a warning as read
 * @param {string} warningId - Warning UUID
 */
export const markWarningAsRead = async (warningId) => {
  return api.patch(`/v1/warnings/${warningId}/read`);
};

/**
 * Mark all warnings as read
 */
export const markAllWarningsAsRead = async () => {
  return api.patch('/v1/warnings/mark-all-read');
};

/**
 * Get unread notification count for badge
 */
export const getUnreadCount = async () => {
  return api.get('/v1/warnings/unread-count');
};

/**
 * Get active (non-expired) warnings
 */
export const getActiveWarnings = async () => {
  return api.get('/v1/warnings/my-warnings/active');
};

/**
 * Get recent warnings for current user
 * @param {number} limit - Max number
 */
export const getRecentWarnings = async (limit = 5) => {
  return api.get(`/v1/warnings/my-warnings/recent?limit=${limit}`);
};

// ============================================
// USER PENALTY APIs
// ============================================

/**
 * Get all penalties for current user
 * @param {number} page - Page number
 * @param {number} size - Page size
 */
export const getMyPenalties = async (page = 0, size = 10) => {
  return api.get(`/v1/penalties/my-penalties?page=${page}&size=${size}`);
};

/**
 * Get active penalties for current user
 */
export const getMyActivePenalties = async () => {
  return api.get('/v1/penalties/my-penalties/active');
};

/**
 * Get a specific penalty by ID
 * @param {string} penaltyId - Penalty UUID
 */
export const getPenaltyById = async (penaltyId) => {
  return api.get(`/v1/penalties/${penaltyId}`);
};

/**
 * Get current booking fee multiplier for user
 */
export const getBookingFeeMultiplier = async () => {
  return api.get('/v1/penalties/booking-fee-multiplier');
};

/**
 * Check if user has any active fee penalty
 */
export const hasFeePenalty = async () => {
  return api.get('/v1/penalties/has-fee-penalty');
};
