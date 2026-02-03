// API Service Layer for Schema Forge CMS
// Replace BASE_URL with your actual backend URL

import type { ContentData } from '@/types/content';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Auth token management
let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const getAuthToken = () => authToken;

// Generic fetch wrapper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

// ============ Authentication API ============

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },

  signup: async (credentials: SignupCredentials) => {
    const response = await apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },

  logout: async () => {
    await apiRequest('/auth/logout', { method: 'POST' });
    setAuthToken(null);
  },

  getCurrentUser: async () => {
    return apiRequest<AuthResponse['user']>('/auth/me');
  },
};

// ============ Content API ============

export type { ContentData };

export interface ContentApiResponse {
  data: ContentData;
}

export const contentApi = {
  getContent: async () => {
    return apiRequest<ContentApiResponse>('/content');
  },

  updateContent: async (content: ContentData) => {
    return apiRequest<ContentApiResponse>('/content', {
      method: 'PUT',
      body: JSON.stringify({ data: content }),
    });
  },
};

// ============ Tokens API ============

export interface ApiToken {
  id: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'revoked';
}

export interface CreateTokenResponse {
  token: string; // The actual token value (shown once)
  tokenInfo: ApiToken;
}

export const tokensApi = {
  listTokens: async () => {
    return apiRequest<ApiToken[]>('/tokens');
  },

  createToken: async (name: string) => {
    return apiRequest<CreateTokenResponse>('/tokens', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  deleteToken: async (tokenId: string) => {
    return apiRequest<void>(`/tokens/${tokenId}`, {
      method: 'DELETE',
    });
  },

  revokeToken: async (tokenId: string) => {
    return apiRequest<ApiToken>(`/tokens/${tokenId}/revoke`, {
      method: 'POST',
    });
  },
};
