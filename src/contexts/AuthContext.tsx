// AuthContext.tsx
import { createContext, useState, useEffect } from 'react';
import { Models } from 'appwrite';
import { authApi } from '../api/authApi';
import { AuthContextProps, AuthProviderProps } from '../types/Auth';

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Kiểm tra xem có session cookie không
        if (authApi.hasSessionCookie()) {
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const session = await authApi.login(email, password, rememberMe);
      setSessionId(session.$id);
      const userData = await authApi.getCurrentUser(session.secret);
      setUser(userData);
      return session;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await authApi.register(email, password, name);
      setUser(newUser);
      return newUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (sessionId) {
        await authApi.logout(sessionId);
      }
      setUser(null);
      setSessionId(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
