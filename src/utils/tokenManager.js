// src/utils/tokenManager.js
class TokenManager {
  static setTokens(accessToken, refreshToken) {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  static clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  static getAccessToken() {
    return localStorage.getItem('token');
  }

  static getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
}

export default TokenManager;
