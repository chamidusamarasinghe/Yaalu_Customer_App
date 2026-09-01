import { apiClient } from './api-client';

export interface ProductItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
  storeId?: string;
}

export const productService = {
  async getAllProducts(): Promise<ProductItem[]> {
    try {
      return await apiClient.get<ProductItem[]>('/products');
    } catch (error) {
      console.warn('[productService] Falling back to default products catalog:', error);
      return [
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'Red Apple 1kg',
          description: 'Freshly picked crisp red apples',
          price: 650.0,
          category: 'Fruits',
          stock: 100,
          storeId: 'Green Mart',
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'Banana 500g',
          description: 'Local sweet Cavendish bananas',
          price: 280.0,
          category: 'Fruits',
          stock: 150,
          storeId: 'Green Mart',
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          name: 'Broccoli 250g',
          description: 'Imported quality farm fresh broccoli',
          price: 420.0,
          category: 'Vegetables',
          stock: 80,
          storeId: 'Fresh Basket',
        },
        {
          id: '44444444-4444-4444-4444-444444444444',
          name: 'Fresh Milk 1L',
          description: 'Pure Highland pasteurized milk',
          price: 550.0,
          category: 'Dairy',
          stock: 120,
          storeId: 'Daily Picks',
        },
      ];
    }
  },

  async getProductById(id: string): Promise<ProductItem> {
    try {
      return await apiClient.get<ProductItem>(`/products/${id}`);
    } catch (error) {
      console.warn(`[productService] Fallback for product ${id}:`, error);
      const all = await this.getAllProducts();
      return all.find((p) => p.id === id) || all[0];
    }
  },
};
