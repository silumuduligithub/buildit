import apiRequest from '../api/apiRequest';

export const adminService = {
  /**
   * Admin: Get all Master Products
   */
  getProducts: async (params?: { q?: string; status?: string; category_id?: string; page?: number; limit?: number }) => {
    return apiRequest({
      url: '/admin/products',
      method: 'GET',
      params,
    });
  },

  /**
   * Admin: Create Master Product
   */
  createProduct: async (productData: any) => {
    return apiRequest({
      url: '/admin/products',
      method: 'POST',
      body: productData,
    });
  },

  /**
   * Admin: Update Master Product
   */
  updateProduct: async (id: string, productData: any) => {
    return apiRequest({
      url: `/admin/products/${id}`,
      method: 'PATCH',
      body: productData,
    });
  },

  /**
   * Admin: Archive Master Product
   */
  deleteProduct: async (id: string) => {
    return apiRequest({
      url: `/admin/products/${id}`,
      method: 'DELETE',
    });
  },

  /**
   * Admin: Get Retailer Product Offers for Moderation
   */
  getProductOffers: async (params?: { status?: string; page?: number; limit?: number }) => {
    return apiRequest({
      url: '/admin/product-offers',
      method: 'GET',
      params,
    });
  },

  /**
   * Admin: Update Offer Moderation Status
   */
  updateOfferStatus: async (offerId: string, status: 'APPROVED' | 'REJECTED') => {
    return apiRequest({
      url: `/admin/product-offers/${offerId}/status`,
      method: 'PATCH',
      body: { status },
    });
  },
};

export default adminService;
