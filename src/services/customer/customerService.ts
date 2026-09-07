import apiRequest from '../api/apiRequest';

export const customerService = {
  /**
   * Get Home Feed data (Banners, Quick Actions, Popular Categories, Top Stores)
   */
  getHomeFeed: async (lat?: number, lng?: number) => {
    return apiRequest({
      url: '/customer/home',
      method: 'GET',
      params: { lat, lng },
    });
  },

  /**
   * Get 7 Master Categories Screen data with subcategories
   */
  getCategoriesScreen: async () => {
    return apiRequest({
      url: '/customer/categories',
      method: 'GET',
    });
  },

  /**
   * Get Nearby Stores with proximity and rating
   */
  getNearbyStores: async (params?: { lat?: number; lng?: number; q?: string; sort?: string }) => {
    return apiRequest({
      url: '/customer/stores',
      method: 'GET',
      params,
    });
  },

  /**
   * Get Store Details and live catalog product offers
   */
  getStoreDetails: async (storeId: string) => {
    return apiRequest({
      url: `/customer/stores/${storeId}`,
      method: 'GET',
    });
  },

  /**
   * Omnichannel Unified Search across products, categories, brands, stores
   */
  unifiedSearch: async (params: {
    q?: string;
    categoryId?: string;
    brandId?: string;
    storeId?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    return apiRequest({
      url: '/customer/search',
      method: 'GET',
      params,
    });
  },

  /**
   * Search Autocomplete Suggestions
   */
  getSearchSuggestions: async (query: string) => {
    return apiRequest({
      url: '/customer/search/suggestions',
      method: 'GET',
      params: { q: query },
    });
  },

  /**
   * Get User Cart
   */
  getCart: async () => {
    return apiRequest({
      url: '/customer/cart',
      method: 'GET',
    });
  },

  /**
   * Add Item to Cart
   */
  addItemToCart: async (payload: { product_id?: string; offer_id?: string; quantity?: number }) => {
    return apiRequest({
      url: '/customer/cart/items',
      method: 'POST',
      body: payload,
    });
  },

  /**
   * Update Cart Item Quantity
   */
  updateCartItemQuantity: async (itemId: string, quantity: number) => {
    return apiRequest({
      url: `/customer/cart/items/${itemId}`,
      method: 'PATCH',
      body: { quantity },
    });
  },

  /**
   * Remove Item from Cart
   */
  removeCartItem: async (itemId: string) => {
    return apiRequest({
      url: `/customer/cart/items/${itemId}`,
      method: 'DELETE',
    });
  },

  /**
   * Clear Cart
   */
  clearCart: async () => {
    return apiRequest({
      url: '/customer/cart',
      method: 'DELETE',
    });
  },

  /**
   * Get Customer Orders List
   */
  getOrders: async (status: 'all' | 'delivered' | 'cancelled' | 'active' = 'all', page: number = 1, limit: number = 20) => {
    return apiRequest({
      url: '/customer/orders',
      method: 'GET',
      params: { status, page, limit },
    });
  },

  /**
   * Get Order Detail by ID or Order Code
   */
  getOrderDetail: async (orderIdOrCode: string) => {
    return apiRequest({
      url: `/customer/orders/${orderIdOrCode}`,
      method: 'GET',
    });
  },

  /**
   * One-click Reorder to Cart
   */
  reorderOrder: async (orderIdOrCode: string) => {
    return apiRequest({
      url: `/customer/orders/${orderIdOrCode}/reorder`,
      method: 'POST',
    });
  },
};

export default customerService;
