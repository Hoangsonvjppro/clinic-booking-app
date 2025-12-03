import api from './axiosConfig';

// ============================================
// ADMIN REPORT APIs
// ============================================

/**
 * Get all reports with optional status filter
 */
export const getAllReports = async (status, page = 0, size = 20) => {
  const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
  if (status) params.append('status', status);
  return api.get(`/v1/admin/reports?${params.toString()}`);
};

/**
 * Get pending reports for review queue
 */
export const getPendingReports = async (page = 0, size = 20) => {
  return api.get(`/v1/admin/reports/pending?page=${page}&size=${size}`);
};

/**
 * Get a specific report by ID
 */
export const getReportById = async (reportId) => {
  return api.get(`/v1/admin/reports/${reportId}`);
};

/**
 * Start reviewing a report
 */
export const reviewReport = async (reportId) => {
  return api.post(`/v1/admin/reports/${reportId}/start-review`);
};

/**
 * Resolve a report with admin decision
 */
export const resolveReport = async (reportId, resolution) => {
  return api.post(`/v1/admin/reports/${reportId}/resolve`, resolution);
};

/**
 * Get reports received by a specific user
 */
export const getReportsAgainstUser = async (userId, page = 0, size = 20) => {
  return api.get(`/v1/admin/reports/user/${userId}/received?page=${page}&size=${size}`);
};

/**
 * Get reports made by a specific user
 */
export const getReportsByUser = async (userId, page = 0, size = 20) => {
  return api.get(`/v1/admin/reports/user/${userId}/made?page=${page}&size=${size}`);
};

// ============================================
// ADMIN WARNING APIs
// ============================================

/**
 * Get all warnings with optional filters
 */
export const getAllWarnings = async (warningType, severity, page = 0, size = 20) => {
  const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
  if (warningType) params.append('warningType', warningType);
  if (severity) params.append('severity', severity);
  return api.get(`/v1/admin/warnings?${params.toString()}`);
};

/**
 * Get a specific warning by ID
 */
export const getWarningById = async (warningId) => {
  return api.get(`/v1/admin/warnings/${warningId}`);
};

/**
 * Create/send a warning to a user
 */
export const createWarning = async (warningData) => {
  return api.post('/v1/admin/warnings', warningData);
};

/**
 * Delete a warning
 */
export const deleteWarning = async (warningId) => {
  return api.delete(`/v1/admin/warnings/${warningId}`);
};

/**
 * Get warnings for a specific user
 */
export const getWarningsByUser = async (userId, page = 0, size = 20) => {
  return api.get(`/v1/admin/warnings/user/${userId}?page=${page}&size=${size}`);
};

// ============================================
// ADMIN PENALTY APIs
// ============================================

/**
 * Get all penalties with optional filters
 */
export const getAllPenalties = async (penaltyType, activeOnly = false, page = 0, size = 20) => {
  const params = new URLSearchParams({ page: page.toString(), size: size.toString(), activeOnly: activeOnly.toString() });
  if (penaltyType) params.append('penaltyType', penaltyType);
  return api.get(`/v1/admin/penalties?${params.toString()}`);
};

/**
 * Get a specific penalty by ID
 */
export const getPenaltyById = async (penaltyId) => {
  return api.get(`/v1/admin/penalties/${penaltyId}`);
};

/**
 * Create/apply a penalty to a user
 */
export const createPenalty = async (penaltyData) => {
  return api.post('/v1/admin/penalties', penaltyData);
};

/**
 * Revoke a penalty
 */
export const revokePenalty = async (penaltyId) => {
  return api.post(`/v1/admin/penalties/${penaltyId}/revoke`);
};

/**
 * Get penalties for a specific user
 */
export const getPenaltiesByUser = async (userId, page = 0, size = 20) => {
  return api.get(`/v1/admin/penalties/user/${userId}?page=${page}&size=${size}`);
};

/**
 * Get active penalties for a specific user
 */
export const getActivePenaltiesByUser = async (userId) => {
  return api.get(`/v1/admin/penalties/user/${userId}/active`);
};

// ============================================
// ADMIN USER MANAGEMENT APIs
// ============================================

/**
 * Get all users with optional filters
 */
export const getAllUsers = async (role, status, page = 0, size = 20) => {
  const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
  if (role) params.append('role', role);
  if (status) params.append('status', status);
  return api.get(`/v1/admin/users?${params.toString()}`);
};

/**
 * Get user details by ID
 */
export const getUserDetails = async (userId) => {
  return api.get(`/v1/admin/users/${userId}`);
};

/**
 * Update user account status
 * @param {string} userId - User UUID
 * @param {string} accountStatus - ACTIVE, WARNED, SUSPENDED, BANNED
 * @param {string} reason - Reason for status change
 */
export const updateUserStatus = async (userId, accountStatus, reason) => {
  return api.put(`/v1/admin/users/${userId}/status`, { accountStatus, reason });
};

// ============================================
// ADMIN STATISTICS APIs
// ============================================

/**
 * Get comprehensive dashboard statistics
 */
export const getDashboardStatistics = async (period = 'week') => {
  return api.get(`/v1/admin/statistics/dashboard?period=${period}`);
};

/**
 * Get report-specific statistics
 */
export const getReportStatistics = async (period = 'week') => {
  return api.get(`/v1/admin/statistics/reports?period=${period}`);
};

/**
 * Get statistics for a specific user
 */
export const getUserStatistics = async (userId) => {
  return api.get(`/v1/admin/statistics/user/${userId}`);
};

/**
 * Get top users with most no-shows
 */
export const getTopNoShowUsers = async (userType, limit = 10) => {
  return api.get(`/v1/admin/statistics/top-no-shows?userType=${userType}&limit=${limit}`);
};

/**
 * Get top users with most warnings
 */
export const getTopWarnedUsers = async (userType, limit = 10) => {
  return api.get(`/v1/admin/statistics/top-warned?userType=${userType}&limit=${limit}`);
};

export default {
  // Reports
  getAllReports,
  getPendingReports,
  getReportById,
  reviewReport,
  resolveReport,
  getReportsAgainstUser,
  getReportsByUser,
  // Warnings
  getAllWarnings,
  getWarningById,
  createWarning,
  deleteWarning,
  getWarningsByUser,
  // Penalties
  getAllPenalties,
  getPenaltyById,
  createPenalty,
  revokePenalty,
  getPenaltiesByUser,
  getActivePenaltiesByUser,
  // Users
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  // Statistics
  getDashboardStatistics,
  getReportStatistics,
  getUserStatistics,
  getTopNoShowUsers,
  getTopWarnedUsers,
};
