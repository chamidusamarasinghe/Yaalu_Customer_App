import { apiClient } from './api-client';

export interface OrderItemPayload {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDto {
  merchantId?: string;
  customerId: string;
  customerName?: string;
  notes?: string;
  items: OrderItemPayload[];
}

export interface OrderResponse {
  id: string;
  merchantId: string;
  customerId?: string;
  customerName?: string;
  totalAmount: string | number;
  status: string;
  notes?: string;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: string | number;
    subtotal: string | number;
    imageUrl?: string;
  }[];
}

class OrderService {
  async createOrder(dto: CreateOrderDto): Promise<OrderResponse> {
    return apiClient.post<OrderResponse>('/orders', dto);
  }

  async getCustomerOrders(customerId?: string): Promise<OrderResponse[]> {
    try {
      let endpoint = '/orders';
      if (customerId) {
        endpoint += `?customerId=${encodeURIComponent(customerId)}`;
      }
      const orders = await apiClient.get<OrderResponse[]>(endpoint);
      return orders || [];
    } catch (error) {
      console.warn('[OrderService Error getCustomerOrders]:', error);
      return [];
    }
  }
}

export const orderService = new OrderService();
