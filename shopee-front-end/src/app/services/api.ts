import {
  LoginRequest,
  BuyerRegistrationRequest,
  ShopRegistrationRequest,
  ApiResponse,
  LoginResponse,
  BuyerResponse,
  ShopResponse,
} from '../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      let data: ApiResponse<T>;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textData = await response.text();
        data = {
          success: response.ok,
          message: textData || 'An error occurred',
          data: undefined,
        };
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async registerBuyer(data: BuyerRegistrationRequest): Promise<ApiResponse<BuyerResponse>> {
    return this.makeRequest<BuyerResponse>('/auth/register/buyer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async registerShop(data: ShopRegistrationRequest): Promise<ApiResponse<ShopResponse>> {
    return this.makeRequest<ShopResponse>('/auth/register/shop', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Utility methods
  setAuthToken(token: string) {
    localStorage.setItem('token', token);
  }

  clearAuthToken() {
    localStorage.removeItem('token');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const apiService = new ApiService(); 
