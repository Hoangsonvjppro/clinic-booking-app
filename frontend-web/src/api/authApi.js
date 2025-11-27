import api from './axiosConfig';

// Register new user
export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

// Login with email/password
export const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

// Refresh access token
export const refreshToken = async (refreshToken) => {
  return api.post('/auth/refresh', { refreshToken });
};

// Logout
export const logout = async () => {
  return api.post('/auth/logout');
};

// Get current user info
export const getCurrentUser = async () => {
  return api.get('/auth/me');
};

// Forgot password - send reset email
export const forgotPassword = async (email) => {
  return api.post('/auth/forgot-password', { email });
};

// Reset password with token
export const resetPassword = async (token, newPassword) => {
  return api.post('/auth/reset-password', { token, newPassword });
};

// Verify email with token
export const verifyEmail = async (token) => {
  return api.get(`/auth/verify-email?token=${token}`);
};

// OAuth2 Google login URL
export const getGoogleLoginUrl = () => {
  return `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/oauth2/authorization/google`;
};

// Handle OAuth2 callback (used in OAuthCallback page)
export const handleOAuthCallback = async () => {
  // After OAuth redirect, the backend sets token in URL or cookie
  // This function should extract and store the token
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const refreshToken = urlParams.get('refreshToken');

  if (token) {
    localStorage.setItem('accessToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    return { token, refreshToken };
  }

  throw new Error('No token found in OAuth callback');
};
