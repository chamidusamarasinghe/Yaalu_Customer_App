import { apiClient } from './api-client';

export interface ProductItem {
  id: string;
  merchantId: string;
  name: string;
  price: string | number;
  unit: string;
  stock: number;
  imageUrl?: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class ProductService {
  async getProducts(params?: { merchantId?: string; activeOnly?: boolean }): Promise<ProductItem[]> {
    try {
      let endpoint = '/products?activeOnly=true';
      if (params?.merchantId) {
        endpoint += `&merchantId=${encodeURIComponent(params.merchantId)}`;
      }
      const products = await apiClient.get<ProductItem[]>(endpoint);
      return products || [];
    } catch (error) {
      console.warn('[ProductService Error]:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<ProductItem | null> {
    try {
      const product = await apiClient.get<ProductItem>(`/products/${id}`);
      return product || null;
    } catch (error) {
      console.warn(`[ProductService Error getProductById ${id}]:`, error);
      return null;
    }
  }
}

export const productService = new ProductService();
