// API Request types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface BuyerRegistrationRequest {
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
  fullName?: string;
  address?: string;
}

export interface ShopRegistrationRequest {
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
  businessName: string;
  shopName: string;
  taxCode: string;
  businessAddress?: string;
  businessDescription?: string;
  businessType?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  token: string;
  userType: 'BUYER' | 'SHOP';
  username: string;
}

export interface BuyerResponse {
  id?: string;
  username: string;
  email: string;
  phoneNumber?: string;
  fullName?: string;
  address?: string;
  createdAt: string;
  isActive: boolean;
}

export interface ShopResponse {
  id?: string;
  username: string;
  email: string;
  phoneNumber?: string;
  businessName: string;
  shopName: string;
  taxCode: string;
  businessAddress?: string;
  businessDescription?: string;
  businessType?: string;
  createdAt: string;
  isActive: boolean;
}

// User context types
export interface User {
  username: string;
  userType: 'BUYER' | 'SHOP';
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
} 
