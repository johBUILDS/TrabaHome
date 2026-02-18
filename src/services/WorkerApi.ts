import axios from 'axios';
import { getWorkerAuthToken } from '../utils/workerAuth.ts';

const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string> }).env;
const API_BASE_URL = viteEnv?.VITE_API_BASE_URL || 'http://localhost:8000/api';
const DEFAULT_WORKER_ROUTE_PREFIXES = ['/worker', '/workers'];
const REGISTER_ROUTE_PREFIXES = ['/workers', '/worker'];

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getWorkerAuthToken();
  if (token) {
    const headers = (config.headers ?? {}) as Record<string, string>;
    headers.Authorization = `Bearer ${token}`;
    config.headers = headers as typeof config.headers;
  }
  return config;
});

type WorkerRouteSuffix =
  | '/register'
  | '/signin'
  | '/login/verify-otp'
  | '/me'
  | '/logout';

interface WorkerLoginPayload {
  email: string;
  password: string;
}

interface WorkerLoginOtpPayload {
  email: string;
  code: string;
}

interface WorkerSessionResponse {
  token?: string;
  worker?: Record<string, unknown>;
  email?: string;
  message?: string;
  otpRequired?: boolean;
}

const isAxios404 = (error: unknown): boolean => {
  return axios.isAxiosError(error) && error.response?.status === 404;
};

const postWorkerWithFallback = async <TResponse>(
  suffix: WorkerRouteSuffix,
  payload: unknown,
  prefixes: string[] = DEFAULT_WORKER_ROUTE_PREFIXES
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

const getWorkerWithFallback = async <TResponse>(suffix: WorkerRouteSuffix): Promise<TResponse> => {
  let fallbackError: unknown = null;

  for (let index = 0; index < DEFAULT_WORKER_ROUTE_PREFIXES.length; index += 1) {
    const prefix = DEFAULT_WORKER_ROUTE_PREFIXES[index];
    try {
      const response = await apiClient.get<TResponse>(`${prefix}${suffix}`);
      return response.data;
    } catch (error) {
      const isLastPrefix = index === DEFAULT_WORKER_ROUTE_PREFIXES.length - 1;
      if (!isAxios404(error) || isLastPrefix) {
        throw error;
      }
      fallbackError = error;
    }
  }

  throw fallbackError;
};

export const workerAPI = {
  register: async (formData: FormData) => {
    return postWorkerWithFallback<{ message?: string; email?: string }>(
      '/register',
      formData,
      REGISTER_ROUTE_PREFIXES
    );
  },

  login: async (payload: WorkerLoginPayload): Promise<WorkerSessionResponse> => {
    return postWorkerWithFallback<WorkerSessionResponse>('/signin', payload);
  },

  verifyLoginOtp: async (payload: WorkerLoginOtpPayload): Promise<WorkerSessionResponse> => {
    return postWorkerWithFallback<WorkerSessionResponse>('/login/verify-otp', payload);
  },

  me: async (): Promise<{ worker?: Record<string, unknown> }> => {
    return getWorkerWithFallback<{ worker?: Record<string, unknown> }>('/me');
  },

  logout: async (): Promise<{ message?: string }> => {
    return postWorkerWithFallback<{ message?: string }>('/logout', {});
  },
};
