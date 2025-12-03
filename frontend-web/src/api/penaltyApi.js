import api from './axiosConfig';

// ==================== USER PENALTY APIs ====================

/**
 * Get current user's active penalties
 */
export const getMyActivePenalties = () => {
  return api.get('/v1/penalties/me/active');
};

/**
 * Get current user's penalty history
 */
export const getMyPenaltyHistory = (page = 0, size = 10) => {
  return api.get('/v1/penalties/me/history', {
    params: { page, size },
  });
};

/**
 * Check if current user has any active penalty
 */
export const hasActivePenalty = () => {
  return api.get('/v1/penalties/me/has-active');
};

export default {
  getMyActivePenalties,
  getMyPenaltyHistory,
  hasActivePenalty,
};
