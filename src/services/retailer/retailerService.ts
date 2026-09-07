import apiRequest from '../api/apiRequest';

export interface CreateOfferPayload {
  product_id: string;
  sku?: string;
  unit?: string;
  pack_size?: number;
  selling_price: number;
  mrp?: number;
  available_quantity: number;
  min_order_quantity?: number;
  max_order_quantity?: number;
  is_active?: boolean;
}

export interface UpdateOfferPayload {
  sku?: string;
  unit?: string;
  pack_size?: number;
  selling_price?: number;
  mrp?: number;
  available_quantity?: number;
  min_order_quantity?: number;
  max_order_quantity?: number;
  is_active?: boolean;
}

export const retailerService = {
  /**
   * Get Authenticated Retailer's Offers / Inventory
   */
  getOffers: async (params?: { is_active?: boolean; is_in_stock?: boolean; page?: number; limit?: number }) => {
    return apiRequest({
      url: '/retailer/product-offers',
      method: 'GET',
      params,
    });
  },

  /**
   * Get Single Retailer Offer
   */
  getOfferById: async (id: string) => {
    return apiRequest({
      url: `/retailer/product-offers/${id}`,
      method: 'GET',
    });
  },

  /**
   * Create new Retailer Product Offer
   */
  createOffer: async (payload: CreateOfferPayload) => {
    return apiRequest({
      url: '/retailer/product-offers',
      method: 'POST',
      body: payload,
    });
  },

  /**
   * Update Retailer Product Offer (Price, Stock, SKU, Status)
   */
  updateOffer: async (id: string, payload: UpdateOfferPayload) => {
    return apiRequest({
      url: `/retailer/product-offers/${id}`,
      method: 'PATCH',
      body: payload,
    });
  },

  /**
   * Soft-delete / deactivate Retailer Offer
   */
  deleteOffer: async (id: string) => {
    return apiRequest({
      url: `/retailer/product-offers/${id}`,
      method: 'DELETE',
    });
  },
};

export default retailerService;
