// src/utils/jwtUtils.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  userId: string;
  // Add other claims from your JWT as needed
}

const TOKEN_KEY = 'auth_tokens';

export const jwtUtils = {
  // Store tokens securely
  setTokens: (jwt: string, rememberMe: boolean = false): void => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, JSON.stringify({ jwt }));
  },

  // Get stored tokens
  getTokens: () => {
    let tokenString = sessionStorage.getItem(TOKEN_KEY);
    if (!tokenString) {
      tokenString = localStorage.getItem(TOKEN_KEY);
    }
    if (!tokenString) return null;
    try {
      return JSON.parse(tokenString) as {
        jwt: string;
      };
    } catch (e) {
      return null;
    }
  },
  
  // Clear tokens on logout
  clearTokens: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem('refresh_token');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('refresh_token');
  },
  
  // Check if token is expired
  isTokenExpired: (token?: string): boolean => {
    if (!token) {
      const tokens = jwtUtils.getTokens();
      if (!tokens) return true;
      token = tokens.jwt;
    }
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // Add a small buffer (30 seconds) to account for clock differences
      return decoded.exp * 1000 < Date.now() - 30000;
    } catch {
      return true;
    }
  },
  
  // Get user ID from token
  getUserIdFromToken: (token: string): string | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.userId;
    } catch {
      return null;
    }
  },
};
