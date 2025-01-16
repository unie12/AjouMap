// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import TokenManager from '../utils/tokenManager';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = TokenManager.getAccessToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { accessToken, refreshToken } = response.data;
      TokenManager.setTokens(accessToken, refreshToken);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = TokenManager.getAccessToken();
      await api.post('/auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } finally {
      TokenManager.clearTokens();
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
