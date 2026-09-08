import { apiClient } from './api-client';

export interface ShopItem {
  id: string;
  userId: string;
  shopName: string;
  shopAddress: string;
  outletAddress?: string;
  registrationNo?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  businessType?: string;
  createdAt?: string;
}

class ShopService {
  async getShops(): Promise<ShopItem[]> {
    try {
      const shops = await apiClient.get<ShopItem[]>('/shops');
      return shops || [];
    } catch (error) {
      console.warn('[ShopService Error]:', error);
      return [];
    }
  }

  async getShopById(id: string): Promise<ShopItem | null> {
    try {
      const shop = await apiClient.get<ShopItem>(`/shops/${id}`);
      return shop || null;
    } catch (error) {
      console.warn(`[ShopService Error getShopById ${id}]:`, error);
      return null;
    }
  }

  async getShopProducts(shopId: string): Promise<any[]> {
    try {
      const products = await apiClient.get<any[]>(`/shops/${shopId}/products`);
      return products || [];
    } catch (error) {
      console.warn(`[ShopService Error getShopProducts ${shopId}]:`, error);
      return [];
    }
  }
}

export const shopService = new ShopService();
