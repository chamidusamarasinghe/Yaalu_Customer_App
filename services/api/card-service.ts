import { apiClient } from './api-client';

export interface UserCard {
  id: string;
  userId: string;
  cardholderName: string;
  cardNumberMask: string;
  expiryDate: string;
  cardType: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveCardPayload {
  userId?: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cardType?: string;
  isDefault?: boolean;
}

class CardService {
  private localCards: UserCard[] = [];

  async saveCard(payload: SaveCardPayload): Promise<UserCard> {
    try {
      const res = await apiClient.post<UserCard>('/cards', payload);
      if (res && res.id) {
        return res;
      }
    } catch (err) {
      console.warn('[CardService Error saveCard, using local fallback]:', err);
    }

    // Local fallback for offline/dev
    const last4 = (payload.cardNumber || '4242').replace(/\s+/g, '').slice(-4) || '4242';
    let cardType = payload.cardType || 'VISA';
    if (payload.cardNumber?.startsWith('5')) cardType = 'MASTERCARD';
    if (payload.cardNumber?.startsWith('3')) cardType = 'AMEX';

    const localCard: UserCard = {
      id: `local_card_${Date.now()}`,
      userId: payload.userId || 'dev_user_1',
      cardholderName: payload.cardholderName || 'Card Holder',
      cardNumberMask: `•••• •••• •••• ${last4}`,
      expiryDate: payload.expiryDate || '12/28',
      cardType,
      isDefault: payload.isDefault !== undefined ? payload.isDefault : true,
      createdAt: new Date().toISOString(),
    };

    if (localCard.isDefault) {
      this.localCards.forEach((c) => (c.isDefault = false));
    }
    this.localCards.unshift(localCard);
    return localCard;
  }

  async getUserCards(userId?: string): Promise<UserCard[]> {
    try {
      let endpoint = '/cards';
      if (userId) {
        endpoint += `?userId=${encodeURIComponent(userId)}`;
      }
      const res = await apiClient.get<UserCard[]>(endpoint);
      if (Array.isArray(res) && res.length > 0) {
        return res;
      }
    } catch (err) {
      console.warn('[CardService Error getUserCards]:', err);
    }
    return this.localCards;
  }
}

export const cardService = new CardService();
