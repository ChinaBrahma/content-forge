import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, getAuthToken, setAuthToken } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, confirmPassword: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        const response = await authApi.getCurrentUser();
        if (response.data) {
          setUser(response.data);
        } else {
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    if (response.error) {
      return { error: response.error };
    }
    if (response.data?.user) {
      setUser(response.data.user);
    }
    return {};
  };

  const signup = async (email: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' };
    }
    const response = await authApi.signup({ email, password, confirmPassword });
    if (response.error) {
      return { error: response.error };
    }
    if (response.data?.user) {
      setUser(response.data.user);
    }
    return {};
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
