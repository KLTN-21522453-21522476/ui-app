// src/api/authApi.ts
import axios from 'axios';
import { Models } from 'appwrite';
import { ID, account } from '../libs/appwrite';
import Cookies from 'js-cookie';
import { jwtUtils } from '../utils/jwtUtils';

interface AuthResponse {
  jwt: string;
  error?: string;
}

interface SessionResponse extends Models.Session {
  error?: string;
}

const SESSION_COOKIE_NAME = 'app_session';
const SESSION_EXPIRY_DAYS = 7; 
const LOGIN_URL = import.meta.env.VITE_PROXY_ENDPOINT + '/api/login'
const GET_TOKEN_URL = import.meta.env.VITE_PROXY_ENDPOINT + '/token'
const VALIDATE_TOKEN_URL = import.meta.env.VITE_PROXY_ENDPOINT + '/validate-token'

export const authApi = {
  getCurrentUser: async (): Promise<Models.User<Models.Preferences>> => {
    let token = jwtUtils.getTokens();
    let sessionSecret = sessionStorage.getItem('secret');
    if (!sessionSecret) {
      sessionSecret = Cookies.get(SESSION_COOKIE_NAME) ?? null;
    }

    if (!sessionSecret) {
      throw new Error('Không tìm thấy phiên đăng nhập');
    }

    // If token exists but expired
    if (!token || jwtUtils.isTokenExpired(token.jwt)) {
      const response = await axios.post<AuthResponse>(GET_TOKEN_URL, {
        secret: sessionSecret
      });

      if (response.data.error) {
        throw new Error(response.data.error || 'Failed to refresh token');
      }

      jwtUtils.setTokens(response.data.jwt);
    }

    try {
      const response = await axios.get<Models.User<Models.Preferences>>(VALIDATE_TOKEN_URL, {
        headers: {
          'Authorization': `Bearer ${jwtUtils.getTokens()?.jwt}`
        },
      });



      return response.data;
    } catch (error) {
      Cookies.remove(SESSION_COOKIE_NAME);
      jwtUtils.clearTokens();
      throw new Error('Lấy thông tin người dùng thất bại');
    }
  },

  login: async (email: string, password: string, rememberMe: boolean = false): Promise<Models.Session> => {
    // Get session
    const response = await axios.post<SessionResponse>(LOGIN_URL, {
      email: email,
      password: password,
    });

    if (response.data.error) {
      throw new Error(response.data.error || 'Đăng nhập thất bại');
    }

    const sessionData: SessionResponse = response.data;
    
    // Get JWT using session secret
    try {
      const jwtResponse = await axios.post<AuthResponse>(GET_TOKEN_URL, {
        secret: sessionData.secret
      });

      if (jwtResponse.data.error) {
        throw new Error(jwtResponse.data.error || 'Failed to get token');
      }

      jwtUtils.setTokens(jwtResponse.data.jwt, rememberMe);
    } catch (error) {
      console.error('Failed to get JWT token:', error);
      throw error;
    }
    
    if (rememberMe) {
      Cookies.set(SESSION_COOKIE_NAME, sessionData.secret, { 
        expires: SESSION_EXPIRY_DAYS,
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });
    }
    else {
      sessionStorage.setItem('secret', JSON.stringify(sessionData.secret));
    }
    
    return sessionData;
  },

  register: async (email: string, password: string, name: string): Promise<Models.User<Models.Preferences>> => {
    const newUser = await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    return newUser;
  },

  logout: async (session_id: string): Promise<void> => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_PROXY_ENDPOINT}/logout`, {
        data: { session_id }
      } as any);

      if (response.status !== 200) {
        throw new Error('Logout failed');
      }
    } finally {
      // Clear both session cookie and JWT
      Cookies.remove(SESSION_COOKIE_NAME);
      jwtUtils.clearTokens();
    }
  },

  hasSessionCookie: (): boolean => {
    return !!Cookies.get(SESSION_COOKIE_NAME) || !!jwtUtils.getTokens();
  },
  
  refreshJWT: async (secret: string): Promise<string | null> => {
    try {
      const response = await axios.post<AuthResponse>(GET_TOKEN_URL, {
        secret: secret
      });

      if (response.data.error) {
        throw new Error(response.data.error || 'Failed to refresh token');
      }

      jwtUtils.setTokens(response.data.jwt);
      return response.data.jwt;
    } catch (error) {
      console.error('Failed to refresh JWT token:', error);
      return null;
    }
  }
};
