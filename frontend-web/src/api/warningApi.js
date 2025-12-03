import api from './axiosConfig';

// ==================== USER WARNING APIs ====================

/**
 * Get current user's warnings
 */
export const getMyWarnings = (includeExpired = false, page = 0, size = 10) => {
  return api.get('/v1/warnings/me', {
    params: { includeExpired, page, size },
  });
};

/**
 * Get count of unread warnings for current user
 */
export const getUnreadWarningCount = () => {
  return api.get('/v1/warnings/me/unread-count');
};

/**
 * Mark a warning as read
 */
export const markWarningAsRead = (warningId) => {
  return api.put(`/v1/warnings/${warningId}/read`);
};

/**
 * Mark all warnings as read
 */
export const markAllWarningsAsRead = () => {
  return api.put('/v1/warnings/me/read-all');
};

export default {
  getMyWarnings,
  getUnreadWarningCount,
  markWarningAsRead,
  markAllWarningsAsRead,
};
