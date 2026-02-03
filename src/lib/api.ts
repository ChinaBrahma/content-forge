// API Service Layer for Schema Forge CMS

import type { ContentData } from '@/types/content';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// JWT token management
const TOKEN_KEY = 'jwt_token';

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Generic fetch wrapper with JWT Bearer auth
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || errorData.error || `HTTP ${response.status}` };
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
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiRequest<AuthResponse>('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },

  signup: async (credentials: SignupCredentials) => {
    const response = await apiRequest<AuthResponse>('/user/register', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },

  logout: () => {
    setAuthToken(null);
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
  token: string;
  tokenInfo: ApiToken;
}

export const tokensApi = {
  listTokens: async () => {
    return apiRequest<ApiToken[]>('/user/apitokens');
  },

  createToken: async (name: string) => {
    return apiRequest<CreateTokenResponse>('/admin/apitokens', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  revokeToken: async (tokenId: string) => {
    return apiRequest<ApiToken>(`/admin/apitokens/${tokenId}`, {
      method: 'DELETE',
    });
  },

  // Alias for backwards compatibility
  deleteToken: async (tokenId: string) => {
    return tokensApi.revokeToken(tokenId);
  },
};
