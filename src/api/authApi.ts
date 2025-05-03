// auth.ts
import { Models } from 'appwrite';
import { ID, account } from '../libs/appwrite';
import Cookies from 'js-cookie';

const SESSION_COOKIE_NAME = 'app_session';
const SESSION_EXPIRY_DAYS = 7; 

export const authApi = {
  getCurrentUser: async (secret?: string): Promise<Models.User<Models.Preferences>> => {
    const sessionSecret = secret || Cookies.get(SESSION_COOKIE_NAME);
    
    if (!sessionSecret) {
      throw new Error('Không tìm thấy phiên đăng nhập');
    }

    const userResponse = await fetch(import.meta.env.VITE_PROXY_ENDPOINT + '/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secret: sessionSecret }),
    });

    if (!userResponse.ok) {
      Cookies.remove(SESSION_COOKIE_NAME);
      const errorData = await userResponse.json();
      throw new Error(errorData.error || 'Lấy thông tin người dùng thất bại');
    }

    const userData: Models.User<Models.Preferences> = await userResponse.json();
    return userData;
  },

  login: async (email: string, password: string, rememberMe: boolean = false): Promise<Models.Session> => {
    const session = await fetch(import.meta.env.VITE_PROXY_ENDPOINT + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!session.ok) {
      const errorData = await session.json();
      throw new Error(errorData.error || 'Lấy session thất bại');
    }

    const sessionData: Models.Session = await session.json();
    
    if (rememberMe) {
      Cookies.set(SESSION_COOKIE_NAME, sessionData.secret, { 
        expires: SESSION_EXPIRY_DAYS,
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });
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
      const response = await fetch(`${import.meta.env.VITE_PROXY_ENDPOINT}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Logout failed');
      }
    } finally {
      Cookies.remove(SESSION_COOKIE_NAME);
    }
  },

  hasSessionCookie: (): boolean => {
    return !!Cookies.get(SESSION_COOKIE_NAME);
  },
};
