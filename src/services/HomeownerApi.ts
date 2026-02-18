import axios from 'axios';

const HOMEOWNER_AUTH_STORAGE_KEY = 'trabahome_homeowner_auth';

const getHomeownerAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(HOMEOWNER_AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { token?: unknown };
    if (parsed && typeof parsed.token === 'string' && parsed.token.trim()) {
      return parsed.token;
    }
  } catch {
    if (raw.trim()) return raw;
  }

  return null;
};

const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string> }).env;
const API_BASE_URL = viteEnv?.VITE_API_BASE_URL || 'http://localhost:8000/api';

const DEFAULT_HOMEOWNER_ROUTE_PREFIXES = ['/homeowners', '/homeowner'];

const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = getHomeownerAuthToken();
  if (token) {
    const headers = (config.headers ?? {}) as Record<string, string>;
    headers.Authorization = `Bearer ${token}`;
    config.headers = headers as typeof config.headers;
  }
  return config;
});

type HomeownerRouteSuffix =
  | '/register'
  | '/login'
  | '/login/verify-otp'
  | '/me'
  | '/logout';

export interface HomeownerRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  city: string;
  barangay: string;
  password: string;
  confirmPassword?: string;
  [key: string]: unknown;
}

export interface HomeownerLoginPayload {
  email: string;
  password: string;
}

export interface HomeownerLoginOtpPayload {
  email: string;
  code: string;
}

export interface HomeownerSessionResponse {
  token?: string;
  homeowner?: Record<string, unknown>;
  email?: string;
  message?: string;
  otpRequired?: boolean;
}

const isAxios404 = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 404;

const postHomeownerWithFallback = async <TResponse>(
  suffix: HomeownerRouteSuffix,
  payload: unknown,
  prefixes: string[] = DEFAULT_HOMEOWNER_ROUTE_PREFIXES
): Promise<TResponse> => {
  let fallbackError: unknown = null;

  for (let index = 0; index < prefixes.length; index += 1) {
    const prefix = prefixes[index];
    try {
      const response = await apiClient.post<TResponse>(`${prefix}${suffix}`, payload);
      return response.data;
    } catch (error) {
      const isLastPrefix = index === prefixes.length - 1;
      if (!isAxios404(error) || isLastPrefix) {
        throw error;
      }
      fallbackError = error;
    }
  }

  throw fallbackError;
};

const getHomeownerWithFallback = async <TResponse>(
  suffix: HomeownerRouteSuffix
): Promise<TResponse> => {
  let fallbackError: unknown = null;

  for (let index = 0; index < DEFAULT_HOMEOWNER_ROUTE_PREFIXES.length; index += 1) {
    const prefix = DEFAULT_HOMEOWNER_ROUTE_PREFIXES[index];
    try {
      const response = await apiClient.get<TResponse>(`${prefix}${suffix}`);
      return response.data;
    } catch (error) {
      const isLastPrefix = index === DEFAULT_HOMEOWNER_ROUTE_PREFIXES.length - 1;
      if (!isAxios404(error) || isLastPrefix) {
        throw error;
      }
      fallbackError = error;
    }
  }

  throw fallbackError;
};

export const homeownerAPI = {
  register: async (payload: FormData | HomeownerRegisterPayload) =>
    postHomeownerWithFallback<{ message?: string; homeowner?: Record<string, unknown> }>(
      '/register',
      payload
    ),

  login: async (payload: HomeownerLoginPayload): Promise<HomeownerSessionResponse> =>
    postHomeownerWithFallback<HomeownerSessionResponse>('/login', payload),

  verifyLoginOtp: async (payload: HomeownerLoginOtpPayload): Promise<HomeownerSessionResponse> =>
    postHomeownerWithFallback<HomeownerSessionResponse>('/login/verify-otp', payload),

  me: async (): Promise<{ homeowner?: Record<string, unknown> }> =>
    getHomeownerWithFallback<{ homeowner?: Record<string, unknown> }>('/me'),

  logout: async (): Promise<{ message?: string }> =>
    postHomeownerWithFallback<{ message?: string }>('/logout', {}),
};

export { HOMEOWNER_AUTH_STORAGE_KEY, getHomeownerAuthToken };
