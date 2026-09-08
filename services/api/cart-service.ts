import { ProductItem } from './product-service';

export interface CartItem {
  id: string;
  productId: string;
  merchantId?: string;
  title: string;
  unitPriceStr: string;
  unitLabel: string;
  priceValue: number;
  quantity: number;
  imageUrl?: string;
}

type CartListener = (items: CartItem[]) => void;

class CartService {
  private items: CartItem[] = [];
  private listeners: CartListener[] = [];

  getItems(): CartItem[] {
    return this.items;
  }

  subscribe(listener: CartListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l([...this.items]));
  }

  addItem(product: ProductItem) {
    const priceVal = typeof product.price === 'number' ? product.price : parseFloat(product.price as string) || 0;
    const existingIndex = this.items.findIndex((item) => item.productId === product.id);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        productId: product.id,
        merchantId: product.merchantId,
        title: product.name,
        unitPriceStr: `LKR ${priceVal.toFixed(2)}`,
        unitLabel: product.unit ? `/${product.unit}` : '',
        priceValue: priceVal,
        quantity: 1,
        imageUrl: product.imageUrl,
      });
    }
    this.notify();
  }

  updateQuantity(productId: string, delta: number) {
    const existingIndex = this.items.findIndex((item) => item.productId === productId);
    if (existingIndex > -1) {
      const newQty = this.items[existingIndex].quantity + delta;
      if (newQty <= 0) {
        this.items.splice(existingIndex, 1);
      } else {
        this.items[existingIndex].quantity = newQty;
      }
      this.notify();
    }
  }

  removeItem(productId: string) {
    this.items = this.items.filter((item) => item.productId !== productId);
    this.notify();
  }

  clearCart() {
    this.items = [];
    this.notify();
  }

  getQuantity(productId: string): number {
    const item = this.items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  }

  getTotalCount(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  getSubtotal(): number {
    return this.items.reduce((sum, i) => sum + i.priceValue * i.quantity, 0);
  }
}

export const cartService = new CartService();
