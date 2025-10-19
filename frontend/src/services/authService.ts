import apiService from './api.ts';
import { AuthResponse, LoginRequest, SignUpRequest, User } from '../types/index.ts';
import { mockApi } from './mockApi.ts';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/signin', credentials);
      // Store auth token and user data
      apiService.setAuthToken(response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      // Fallback to mock API if mock mode is enabled
      if ((process.env.REACT_APP_USE_MOCK_API || '').toLowerCase() === 'true') {
        const response = await mockApi.signin({ email: credentials.email, password: credentials.password });
        apiService.setAuthToken(response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
      }
      throw error;
    }
  }

  async signup(userData: SignUpRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/signup', userData);
    
    // Store auth token and user data
    apiService.setAuthToken(response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Even if logout request fails, clear local storage
      console.warn('Logout request failed, but clearing local storage');
    } finally {
      apiService.removeAuthToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    return await apiService.get<User>('/auth/me');
  }

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    const useMock = (process.env.REACT_APP_USE_MOCK_API || '').toLowerCase() === 'true';
    const hasToken = !!apiService.getAuthToken();
    const hasUser = !!this.getCurrentUserFromStorage();
    if (useMock) {
      // In mock mode, allow if either token or user exists to prevent unnecessary redirects
      return hasToken || hasUser;
    }
    // In real mode, token presence is sufficient
    return hasToken;
  }

  clearAuth(): void {
    apiService.removeAuthToken();
  }
}

export default new AuthService();