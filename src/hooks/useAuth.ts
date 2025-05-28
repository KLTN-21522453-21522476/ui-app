// src/hooks/useAuth.ts
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { login, logout, register, checkAuth, resetError } from '../redux/slices/authSlice';
import { Models } from 'appwrite';

export interface AuthHookResult {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  resetError: () => void;
}

export const useAuth = (): AuthHookResult => {
  const dispatch = useAppDispatch();
  const { user, loading, error, isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isInitialized,

    login: async (email: string, password: string, rememberMe?: boolean) => {
      await dispatch(login({ email, password, rememberMe })).unwrap();
    },
    
    logout: async () => {
      await dispatch(logout()).unwrap();
    },
    
    register: async (email: string, password: string, name: string, phone: string) => {
      await dispatch(register({ email, password, name, phone })).unwrap();
    },
    
    checkAuth: async () => {
      await dispatch(checkAuth()).unwrap();
    },
    
    resetError: () => {
      dispatch(resetError());
    }
  };
};
