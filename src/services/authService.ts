// Authentication Service - Singleton instance
// Connects to .NET API at https://localhost:7232

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7232';

// TypeScript Interfaces
interface AuthResponse {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface GoogleAuthRequest {
  idToken: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make API calls with proper error handling
  private async makeRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (error) {
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(error.message || 'Network request failed');
      }
      throw new Error('Network request failed');
    }
  }

  // Register new user
  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      const data = await this.makeRequest<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password } as RegisterRequest),
      });

      // Save tokens to localStorage
      this.saveTokens(data);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error('Registration failed');
    }
  }

  // Login existing user
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const data = await this.makeRequest<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password } as LoginRequest),
      });

      // Save tokens to localStorage
      this.saveTokens(data);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error('Login failed');
    }
  }

  // Google authentication
  async googleAuth(idToken: string): Promise<AuthResponse> {
    try {
      const data = await this.makeRequest<AuthResponse>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ idToken } as GoogleAuthRequest),
      });

      // Save tokens to localStorage
      this.saveTokens(data);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Google authentication failed: ${error.message}`);
      }
      throw new Error('Google authentication failed');
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string | null = null): Promise<AuthResponse> {
    try {
      const token = refreshToken || this.getRefreshToken();

      if (!token) {
        throw new Error('No refresh token available');
      }

      const data = await this.makeRequest<AuthResponse>('/api/auth/refresh-token', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: token } as RefreshTokenRequest),
      });

      // Save new tokens to localStorage
      this.saveTokens(data);

      return data;
    } catch (error) {
      // Clear tokens if refresh fails
      this.clearTokens();
      if (error instanceof Error) {
        throw new Error(`Token refresh failed: ${error.message}`);
      }
      throw new Error('Token refresh failed');
    }
  }

  // Logout user
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const userId = this.getUserId();
      const accessToken = this.getAccessToken();

      if (!userId || !accessToken) {
        throw new Error('User is not authenticated');
      }

      await this.makeRequest<void>('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userId),
      });

      // Clear tokens from localStorage
      this.clearTokens();

      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      // Clear tokens even if logout request fails
      this.clearTokens();
      if (error instanceof Error) {
        throw new Error(`Logout failed: ${error.message}`);
      }
      throw new Error('Logout failed');
    }
  }

  // Helper method: Save tokens to localStorage
  saveTokens(data: AuthResponse): void {
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    if (data.userId) {
      localStorage.setItem('userId', data.userId);
    }
    if (data.email) {
      localStorage.setItem('userEmail', data.email);
    }
    if (data.expiresAt) {
      localStorage.setItem('tokenExpiresAt', data.expiresAt);
    }
  }

  // Helper method: Clear tokens from localStorage
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('tokenExpiresAt');
  }

  // Helper method: Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Helper method: Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Helper method: Get user ID
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Helper method: Get user email
  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  // Helper method: Get token expiration time
  getTokenExpiresAt(): string | null {
    return localStorage.getItem('tokenExpiresAt');
  }

  // Helper method: Check if user is authenticated
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const userId = this.getUserId();
    return !!(accessToken && userId);
  }

  // Helper method: Check if token is expired
  isTokenExpired(): boolean {
    const expiresAt = this.getTokenExpiresAt();
    if (!expiresAt) {
      return true;
    }

    try {
      const expirationTime = new Date(expiresAt).getTime();
      const currentTime = new Date().getTime();
      return currentTime >= expirationTime;
    } catch (error) {
      return true;
    }
  }

  // Helper method: Get authorization header
  getAuthHeader(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Helper method: Make authenticated request
  async makeAuthenticatedRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const authHeader = this.getAuthHeader();

    if (!authHeader.Authorization) {
      throw new Error('User is not authenticated');
    }

    // Check if token is expired and refresh if needed
    if (this.isTokenExpired()) {
      try {
        await this.refreshToken();
      } catch (error) {
        throw new Error('Session expired. Please login again.');
      }
    }

    return this.makeRequest<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        ...this.getAuthHeader(),
      },
    });
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
