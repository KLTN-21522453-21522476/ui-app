// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Models } from 'appwrite';
import { ID, account } from '../libs/appwrite';

interface AuthContextProps {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Models.Session>;
  register: (email: string, password: string, name: string) => Promise<Models.User<Models.Preferences>>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
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
      const newUser = await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
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
      await account.deleteSession('current');
      setUser(null);
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

  return <AuthContext.Provider value={value}>{children} </AuthContext.Provider>;
};
