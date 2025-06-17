export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  shopId: string;
  categoryId?: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId?: string;
  imageUrls: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  imageUrls?: string[];
}

export type ProductResponse = Product;

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  data?: Product[];
}

export interface ProductApiResponse {
  success: boolean;
  message: string;
  data?: Product;
} 
