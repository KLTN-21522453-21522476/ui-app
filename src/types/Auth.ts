// src/types/Auth.ts
import { Models } from 'appwrite';

export interface AuthContextProps {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<Models.Session>;
  register: (email: string, password: string, name: string) => Promise<Models.User<Models.Preferences>>;
  logout: () => Promise<void>;
  error: string | null;
  refreshUserData: () => Promise<void>;
  checkAuthStatus: () => Promise<Models.User<Models.Preferences> | null>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface LoginResponse {
  session: Models.Session;
  user: Models.User<Models.Preferences>;
}
