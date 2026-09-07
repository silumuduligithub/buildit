import apiRequest from '../api/apiRequest';

export const catalogService = {
  /**
   * Get Master Products Catalog
   */
  getProducts: async (params?: {
    categoryId?: string;
    brandId?: string;
    q?: string;
    page?: number;
    limit?: number;
  }) => {
    return apiRequest({
      url: '/products',
      method: 'GET',
      params,
    });
  },

  /**
   * Get Product Detail by ID
   */
  getProductById: async (productId: string) => {
    return apiRequest({
      url: `/products/${productId}`,
      method: 'GET',
    });
  },

  /**
   * Get Multi-Retailer Product Offers (Price & Stock Comparison)
   */
  getProductOffers: async (productId: string, sort: string = 'recommended') => {
    return apiRequest({
      url: `/products/${productId}/offers`,
      method: 'GET',
      params: { sort },
    });
  },

  /**
   * Get Categories
   */
  getCategories: async () => {
    return apiRequest({
      url: '/categories',
      method: 'GET',
    });
  },

  /**
   * Get Category by Slug
   */
  getCategoryBySlug: async (slug: string) => {
    return apiRequest({
      url: `/categories/${slug}`,
      method: 'GET',
    });
  },

  /**
   * Get Products by Category ID
   */
  getCategoryProducts: async (categoryId: string) => {
    return apiRequest({
      url: `/categories/${categoryId}/products`,
      method: 'GET',
    });
  },

  /**
   * Get Brands
   */
  getBrands: async () => {
    return apiRequest({
      url: '/brands',
      method: 'GET',
    });
  },

  /**
   * Get Product Reviews & Ratings Breakdown
   */
  getProductReviews: async (productId: string) => {
    return apiRequest({
      url: `/products/${productId}/reviews`,
      method: 'GET',
    });
  },

  /**
   * Submit Customer Review
   */
  submitProductReview: async (
    productId: string,
    data: {
      rating: number;
      title?: string;
      comment: string;
      userName?: string;
      userRole?: string;
    }
  ) => {
    return apiRequest({
      url: `/products/${productId}/reviews`,
      method: 'POST',
      body: data,
    });
  },
};

export default catalogService;
