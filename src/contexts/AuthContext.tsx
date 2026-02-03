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

const USER_KEY = 'user_data';

// Helper to decode JWT payload
function parseJwt(token: string): { sub?: string; email?: string; exp?: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing JWT session
    const token = getAuthToken();
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (token && storedUser) {
      // Verify token hasn't expired
      const payload = parseJwt(token);
      if (payload?.exp && payload.exp * 1000 > Date.now()) {
        setUser(JSON.parse(storedUser));
      } else {
        // Token expired, clear it
        setAuthToken(null);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    
    if (response.error) {
      return { error: response.error };
    }
    
    if (response.data?.token) {
      // Extract user info from JWT or response
      const payload = parseJwt(response.data.token);
      const userData: User = response.data.user || {
        id: payload?.sub || crypto.randomUUID(),
        email: payload?.email || email,
        name: email.split('@')[0],
      };
      
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
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
    
    if (response.data?.token) {
      const payload = parseJwt(response.data.token);
      const userData: User = response.data.user || {
        id: payload?.sub || crypto.randomUUID(),
        email: payload?.email || email,
        name: email.split('@')[0],
      };
      
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
    
    return {};
  };

  const logout = async () => {
    authApi.logout();
    setUser(null);
    localStorage.removeItem(USER_KEY);
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
