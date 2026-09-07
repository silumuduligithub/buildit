import apiRequest from '../api/apiRequest';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  profile_image?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  bio?: string;
}

export interface AddAddressPayload {
  type?: 'home' | 'work' | 'site' | 'other';
  label?: string;
  name?: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state?: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
}

export const userService = {
  /**
   * Update current user profile
   */
  updateProfile: async (payload: UpdateProfilePayload) => {
    return apiRequest({
      url: '/users/profile',
      method: 'PUT',
      body: payload,
    });
  },

  /**
   * Get all saved addresses of current user
   */
  getAddresses: async () => {
    return apiRequest({
      url: '/users/addresses',
      method: 'GET',
    });
  },

  /**
   * Add new delivery / site address
   */
  addAddress: async (payload: AddAddressPayload) => {
    return apiRequest({
      url: '/users/addresses',
      method: 'POST',
      body: payload,
    });
  },

  /**
   * Delete saved address
   */
  deleteAddress: async (addressId: string) => {
    return apiRequest({
      url: `/users/addresses/${addressId}`,
      method: 'DELETE',
    });
  },
};

export default userService;
