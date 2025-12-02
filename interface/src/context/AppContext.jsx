import React, { createContext, useContext, useState, useEffect } from 'react';
import { userProfile } from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedLoginState = localStorage.getItem('isLoggedIn');
    
    if (savedLoginState === 'true' && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (credentials) => {
    // Mock login - in real app, this would call an API
    // For demo purposes, we'll use the mock user profile
    setIsLoggedIn(true);
    setUser(userProfile);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userProfile));
  };

  const register = (userData) => {
    // Mock registration
    const newUser = {
      ...userProfile,
      ...userData,
      id: Date.now()
    };
    setIsLoggedIn(true);
    setUser(newUser);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    isLoggedIn,
    user,
    login,
    register,
    logout,
    updateUser,
    bookingModalOpen,
    setBookingModalOpen,
    consultModalOpen,
    setConsultModalOpen
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
