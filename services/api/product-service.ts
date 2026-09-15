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

const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: 'fb-prod-1',
    merchantId: 'af0ea644-2bbb-46e1-ae41-d2b46b3e57cf',
    name: 'Special Chicken Fried Rice & Chilli Paste',
    price: 950,
    unit: 'portion',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400',
    description: 'Fragrant basmati rice tossed with fresh chicken, spring onions, eggs, and homemade chilli paste.',
    isActive: true,
  },
  {
    id: 'fb-prod-2',
    merchantId: 'af0ea644-2bbb-46e1-ae41-d2b46b3e57cf',
    name: 'Cheese Kottu Roti with Roast Chicken',
    price: 1350,
    unit: 'portion',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400',
    description: 'Authentic Sri Lankan shredded godamba roti cooked on hot griddle with rich melted cheese and roast chicken.',
    isActive: true,
  },
  {
    id: 'fb-prod-3',
    merchantId: 'b62de9bc-bcbe-4c26-bd2e-a395aa8f70ab',
    name: 'Fresh Red Apples 1kg',
    price: 850,
    unit: '1 kg',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400',
    description: 'Crisp, sweet, fresh imported red apples packed with vitamins.',
    isActive: true,
  },
  {
    id: 'fb-prod-4',
    merchantId: 'b62de9bc-bcbe-4c26-bd2e-a395aa8f70ab',
    name: 'Fresh Organic Bananas 1kg',
    price: 320,
    unit: '1 kg',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=400',
    description: 'Naturally ripened Cavendish bananas, perfect for healthy daily snacks.',
    isActive: true,
  },
  {
    id: 'fb-prod-5',
    merchantId: 'b62de9bc-bcbe-4c26-bd2e-a395aa8f70ab',
    name: 'Fresh Farm Carrots 500g',
    price: 240,
    unit: '500g',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-12ef4a457939?q=80&w=400',
    description: 'Fresh crunchy Nuwara Eliya carrots rich in beta carotene.',
    isActive: true,
  },
  {
    id: 'fb-prod-6',
    merchantId: 'b62de9bc-bcbe-4c26-bd2e-a395aa8f70ab',
    name: 'Fresh Green Broccoli 500g',
    price: 650,
    unit: '500g',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=400',
    description: 'Organically grown fresh broccoli florets.',
    isActive: true,
  },
  {
    id: 'fb-prod-7',
    merchantId: 'b62de9bc-bcbe-4c26-bd2e-a395aa8f70ab',
    name: 'Fresh Dairy Farm Milk 1 Litre Tetra Pak',
    price: 480,
    unit: 'pack',
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400',
    description: 'Pure whole pasteurized milk enriched with vitamin D & calcium.',
    isActive: true,
  },
  {
    id: 'fb-prod-8',
    merchantId: 'af0ea644-2bbb-46e1-ae41-d2b46b3e57cf',
    name: 'Fresh Butter Roast Bread Loaf',
    price: 220,
    unit: 'loaf',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400',
    description: 'Oven fresh soft golden butter bread loaf baked daily.',
    isActive: true,
  },
  {
    id: 'fb-prod-9',
    merchantId: 'd04f6934-e312-4910-bf50-3a2c9b311664',
    name: 'Panadol Extra Paracetamol 500mg (10 Tablets)',
    price: 250,
    unit: 'strip',
    stock: 250,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400',
    description: 'Fast effective relief for headaches, fever, and body aches.',
    isActive: true,
  },
];

class ProductService {
  async getProducts(params?: { merchantId?: string; activeOnly?: boolean }): Promise<ProductItem[]> {
    try {
      let endpoint = '/products?activeOnly=true';
      if (params?.merchantId) {
        endpoint += `&merchantId=${encodeURIComponent(params.merchantId)}`;
      }
      const products = await apiClient.get<ProductItem[]>(endpoint);
      if (products && products.length > 0) {
        return products;
      }
      console.log('[ProductService]: Backend returned 0 products, using fallback items.');
      return FALLBACK_PRODUCTS;
    } catch (error) {
      console.warn('[ProductService Error]:', error);
      return FALLBACK_PRODUCTS;
    }
  }

  async getProductById(id: string): Promise<ProductItem | null> {
    try {
      const product = await apiClient.get<ProductItem>(`/products/${id}`);
      if (product) return product;
      return FALLBACK_PRODUCTS.find((p) => p.id === id) || FALLBACK_PRODUCTS[0];
    } catch (error) {
      console.warn(`[ProductService Error getProductById ${id}]:`, error);
      return FALLBACK_PRODUCTS.find((p) => p.id === id) || FALLBACK_PRODUCTS[0];
    }
  }
}

export const productService = new ProductService();
