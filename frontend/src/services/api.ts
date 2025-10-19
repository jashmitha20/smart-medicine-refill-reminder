import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, ApiError } from '../types/index.ts';
import { mockApi } from './mockApi.ts';

class ApiService {
  private api: AxiosInstance | null = null;
  // Default to mock mode unless explicitly disabled
  private useMock = ((process.env.REACT_APP_USE_MOCK_API ?? 'true').toLowerCase() === 'true');

  constructor() {
    if (!this.useMock) {
      this.api = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.setupInterceptors();
    }
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T>(url: string): Promise<T> {
    if (this.useMock) {
      if (url === '/auth/me') return (await mockApi.me()) as unknown as T;
      if (url === '/medicines') return (await mockApi.getMedicines()) as unknown as T;
      if (url === '/medicines/dashboard-summary') return (await mockApi.getSummary()) as unknown as T;
      throw { error: `Mock GET not implemented for ${url}` };
    }
    try {
      const response = await (this.api as AxiosInstance).get<T>(url);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any): Promise<T> {
    if (this.useMock) {
      if (url === '/auth/signin') return (await mockApi.signin(data)) as unknown as T;
      if (url === '/auth/signup') return (await mockApi.signup(data)) as unknown as T;
      if (url === '/auth/logout') return (await mockApi.logout()) as unknown as T;
      if (url === '/medicines') return (await mockApi.createMedicine(data)) as unknown as T;
      if (url.startsWith('/medicines/') && url.endsWith('/take-dose')) {
        const id = Number(url.split('/')[2]);
        return (await mockApi.takeDose(id)) as unknown as T;
      }
      if (url.startsWith('/medicines/') && url.includes('/refill')) {
        const id = Number(url.split('/')[2]);
        const qtyParam = new URLSearchParams(url.split('?')[1] || '').get('quantity');
        const qty = Number(qtyParam || 0) || (data?.quantity ?? 10);
        return (await mockApi.refill(id, qty)) as unknown as T;
      }
      throw { error: `Mock POST not implemented for ${url}` };
    }
    try {
      const response = await (this.api as AxiosInstance).post<T>(url, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any): Promise<T> {
    if (this.useMock) {
      if (url.startsWith('/medicines/')) {
        const id = Number(url.split('/')[2]);
        return (await mockApi.updateMedicine(id, data)) as unknown as T;
      }
      throw { error: `Mock PUT not implemented for ${url}` };
    }
    try {
      const response = await (this.api as AxiosInstance).put<T>(url, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string): Promise<T> {
    if (this.useMock) {
      if (url.startsWith('/medicines/')) {
        const id = Number(url.split('/')[2]);
        return (await mockApi.deleteMedicine(id)) as unknown as T;
      }
      throw { error: `Mock DELETE not implemented for ${url}` };
    }
    try {
      const response = await (this.api as AxiosInstance).delete<T>(url);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      return {
        error: message,
        message: error.response.statusText,
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        error: 'Network error',
        message: 'Unable to connect to server',
      };
    } else {
      // Something else happened
      return {
        error: 'Request failed',
        message: error.message || 'Unknown error occurred',
      };
    }
  }

  // Auth methods
  setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  removeAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export default new ApiService();