// src/utils/tokenRefresh.js
import api from '../api/axios';

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await api.post('/auth/tokens/refresh', { refreshToken });
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data.accessToken;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};
