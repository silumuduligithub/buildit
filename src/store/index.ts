import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserRole,
  Product,
  Retailer,
  RetailerProductOffer,
  CartItem,
  Order,
  Promotion,
  DeliveryAddress,
} from '../types';
import { mockProducts, mockRetailers, mockOffers, mockSavedAddresses } from '../services/mockData';
import {
  authService,
  customerService,
  catalogService,
  retailerService,
  userService,
  mapBackendProductToProduct,
  mapBackendStoreToRetailer,
  mapBackendOfferToOffer,
  mapBackendCartToCartItems,
  mapBackendOrderToOrder,
  mapBackendAddressToDeliveryAddress,
  AUTH_STORAGE_KEYS,
  getStoredAccessToken,
  getStoredUserData,
} from '../services';

const INITIAL_RETAILER_ORDERS: Order[] = [
  {
    id: 'BK-250531-00125',
    customerId: 'c1',
    retailerId: 'r1',
    status: 'placed',
    items: [
      {
        id: 'cart-1',
        offer: mockOffers[0],
        product: mockProducts[0],
        retailer: mockRetailers[0],
        quantity: 50,
      },
    ],
    subtotal: 20500,
    gst: 3690,
    totalAmount: 24850,
    deliveryFee: 0,
    deliveryAddress: {
      label: 'Site',
      name: 'Ravi Kumar',
      phone: '9876543210',
      line1: 'Plot No. 45, Golden Heights, Kondapur Main Road',
      city: 'Hyderabad',
      pincode: '500084',
    },
    deliveryType: 'express',
    deliveryModel: 'third_party_logistics',
    estimatedDeliveryMins: 30,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    driverName: 'Mahesh Kumar',
    driverPhone: '+91 98765 00112',
    otp: '4821',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'BK-250531-00124',
    customerId: 'c2',
    retailerId: 'r1',
    status: 'preparing',
    items: [
      {
        id: 'cart-2',
        offer: mockOffers[1],
        product: mockProducts[1],
        retailer: mockRetailers[0],
        quantity: 25,
      },
    ],
    subtotal: 15500,
    gst: 2790,
    totalAmount: 18650,
    deliveryFee: 0,
    deliveryAddress: {
      label: 'Site',
      name: 'Suresh Builders',
      phone: '9848022334',
      line1: 'Tower 4, Cyber City Phase 2, Hitec City',
      city: 'Hyderabad',
      pincode: '500081',
    },
    deliveryType: 'bulk',
    deliveryModel: 'retailer_fleet',
    estimatedDeliveryMins: 45,
    paymentMethod: 'Net Banking',
    paymentStatus: 'paid',
    driverName: 'Ramesh Reddy',
    driverPhone: '+91 98481 99221',
    otp: '1904',
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
  {
    id: 'BK-250530-00123',
    customerId: 'c3',
    retailerId: 'r1',
    status: 'ready',
    items: [
      {
        id: 'cart-3',
        offer: mockOffers[2],
        product: mockProducts[4],
        retailer: mockRetailers[0],
        quantity: 2,
      },
    ],
    subtotal: 6200,
    gst: 1120,
    totalAmount: 7320,
    deliveryFee: 0,
    deliveryAddress: {
      label: 'Home',
      name: 'Ankita Sharma',
      phone: '9701122334',
      line1: 'Flat 302, Green Meadows, Madhapur',
      city: 'Hyderabad',
      pincode: '500081',
    },
    deliveryType: 'express',
    deliveryModel: 'third_party_logistics',
    estimatedDeliveryMins: 20,
    paymentMethod: 'Card',
    paymentStatus: 'paid',
    driverName: 'Kishore Yadav',
    driverPhone: '+91 97011 55667',
    otp: '6523',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'BK-250530-00122',
    customerId: 'c4',
    retailerId: 'r1',
    status: 'delivered',
    items: [
      {
        id: 'cart-4',
        offer: mockOffers[3],
        product: mockProducts[3],
        retailer: mockRetailers[0],
        quantity: 2000,
      },
    ],
    subtotal: 48000,
    gst: 7680,
    totalAmount: 55680,
    deliveryFee: 0,
    deliveryAddress: {
      label: 'Site',
      name: 'Green Infra Pvt Ltd',
      phone: '9988776655',
      line1: 'Sy No 78, Miyapur Cross Roads',
      city: 'Hyderabad',
      pincode: '500049',
    },
    deliveryType: 'bulk',
    deliveryModel: 'retailer_fleet',
    paymentMethod: 'Net Banking',
    paymentStatus: 'paid',
    driverName: 'Mahesh Kumar',
    driverPhone: '+91 98765 00112',
    otp: '8832',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
];

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo_1',
    title: 'Monsoon Construction Sale',
    productName: 'UltraTech Cement OPC 53 Grade',
    discountPct: 10,
    couponCode: 'MONSOON10',
    startDate: '01 June, 2025',
    endDate: '15 June, 2025',
    status: 'active',
  },
  {
    id: 'promo_2',
    title: 'Bulk Steel Rebate',
    productName: 'Tata Tiscon 550D TMT Rebars',
    discountPct: 5,
    couponCode: 'STEEL5',
    startDate: '10 June, 2025',
    endDate: '25 June, 2025',
    status: 'upcoming',
  },
  {
    id: 'promo_3',
    title: 'Early Bird Wall Putty',
    productName: 'Birla White Wall Care Putty',
    discountPct: 15,
    couponCode: 'WALL15',
    startDate: '01 May, 2025',
    endDate: '20 May, 2025',
    status: 'expired',
  },
];

export interface AppState {
  // Auth & Profile
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  currentUser: any;
  userRoleData: any;
  savedAddresses: DeliveryAddress[];
  initAuth: () => Promise<void>;
  loginUser: (identifier: string, password?: string, role?: string) => Promise<any>;
  logoutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;

  // Retailer Store State
  activeRetailerId: string;
  setActiveRetailer: (retailerId: string) => void;
  isStoreOpen: boolean;
  toggleStoreStatus: () => void;
  retailerProfile: Retailer;
  updateRetailerProfile: (profile: Partial<Retailer>) => void;
  addCatalogProductToStore: (productId: string, price: number, stock: number) => void;

  // Products & Offers
  products: Product[];
  retailers: Retailer[];
  offers: RetailerProductOffer[];
  addProduct: (product: Product, offer: RetailerProductOffer) => void;
  updateProduct: (product: Product) => void;
  deactivateProduct: (productId: string) => void;
  updateOfferPrice: (offerId: string, newPrice: number) => void;
  updateOfferStock: (offerId: string, newStock: number) => void;

  // Async Backend Fetch Actions
  fetchHomeFeed: () => Promise<void>;
  fetchProducts: (query?: string) => Promise<void>;
  fetchCategories: () => Promise<any[]>;
  fetchStores: (query?: string) => Promise<void>;
  fetchCart: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchAddresses: () => Promise<void>;
  fetchRetailerOffers: () => Promise<void>;

  // Backend Sync Mutations
  syncAddToCart: (productId: string, offerId?: string, quantity?: number) => Promise<void>;
  syncUpdateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  syncRemoveCartItem: (itemId: string) => Promise<void>;
  syncClearCart: () => Promise<void>;
  syncCreateOffer: (offerData: any) => Promise<void>;
  syncUpdateOffer: (offerId: string, offerData: any) => Promise<void>;
  syncDeleteOffer: (offerId: string) => Promise<void>;
  syncAddAddress: (addressData: any) => Promise<void>;
  syncDeleteAddress: (addressId: string) => Promise<void>;

  // Promotions
  promotions: Promotion[];
  addPromotion: (promo: Promotion) => void;
  deletePromotion: (id: string) => void;

  // Customer Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Fulfillment mode (Self Collect vs Delivery)
  fulfillmentMode: 'self_collect' | 'delivery';
  setFulfillmentMode: (mode: 'self_collect' | 'delivery') => void;

  // Orders
  orders: Order[];
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Incoming Order Modal Alert for Retailer
  newOrderNotification: Order | null;
  setNewOrderNotification: (order: Order | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth state
  currentRole: 'customer',
  setCurrentRole: (role) => {
    set({ currentRole: role });
    AsyncStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_ROLE, role).catch(() => {});
  },
  isAuthLoading: true,
  isAuthenticated: false,
  currentUser: null,
  userRoleData: null,
  savedAddresses: [],

  // Auth Initialization
  initAuth: async () => {
    try {
      const [savedRole, token, userData, savedCustomProds, savedCustomOffers, savedRetailerId] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEYS.CURRENT_ROLE),
        getStoredAccessToken(),
        getStoredUserData(),
        AsyncStorage.getItem('buildit_custom_products'),
        AsyncStorage.getItem('buildit_custom_offers'),
        AsyncStorage.getItem('buildit_active_retailer_id'),
      ]);

      console.log(`📱 [AUTH INIT] SavedRole: ${savedRole}, HasToken: ${!!token}, HasUserData: ${!!userData}`);

      if (savedRole && ['customer', 'retailer', 'delivery'].includes(savedRole)) {
        set({ currentRole: savedRole as UserRole });
      }

      if (savedRetailerId) {
        get().setActiveRetailer(savedRetailerId);
      }

      if (savedCustomProds) {
        try {
          const parsedProds: Product[] = JSON.parse(savedCustomProds);
          if (Array.isArray(parsedProds) && parsedProds.length > 0) {
            set((state) => {
              const existingIds = new Set(parsedProds.map((p) => p.id));
              const others = state.products.filter((p) => !existingIds.has(p.id));
              return { products: [...parsedProds, ...others] };
            });
          }
        } catch {}
      }

      if (savedCustomOffers) {
        try {
          const parsedOffers: RetailerProductOffer[] = JSON.parse(savedCustomOffers);
          if (Array.isArray(parsedOffers) && parsedOffers.length > 0) {
            set((state) => {
              const existingIds = new Set(parsedOffers.map((o) => o.id));
              const others = state.offers.filter((o) => !existingIds.has(o.id));
              return { offers: [...parsedOffers, ...others] };
            });
          }
        } catch {}
      }

      if (token) {
        set({
          isAuthenticated: true,
          currentUser: userData || { name: 'User', phone: '9876543210' },
          isAuthLoading: false,
        });
        // Silent profile sync in background
        get().refreshProfile().catch(() => {});
      } else {
        set({ isAuthenticated: false, currentUser: null, isAuthLoading: false });
      }

      // Initial background sync
      get().fetchHomeFeed().catch(() => {});
      get().fetchCart().catch(() => {});
      get().fetchAddresses().catch(() => {});
      get().fetchProducts().catch(() => {});
    } catch (e: any) {
      console.log('❌ [AUTH INIT] Error:', e?.message);
      set({ isAuthLoading: false });
    }
  },

  loginUser: async (identifier: string, password?: string, role?: string) => {
    const res = await authService.login({ identifier, password, role });
    if (res.data?.user) {
      const targetRole = (res.data.user.role === 'driver' ? 'delivery' : res.data.user.role) as UserRole;
      set({
        isAuthenticated: true,
        currentUser: res.data.user,
        userRoleData: res.data.role_data,
        currentRole: targetRole,
        isAuthLoading: false,
      });
      AsyncStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_ROLE, targetRole).catch(() => {});
    }
    return res;
  },

  logoutUser: async () => {
    await authService.logout();
    set({
      isAuthenticated: false,
      currentUser: null,
      userRoleData: null,
      cart: [],
    });
  },

  refreshProfile: async () => {
    try {
      const res = await authService.getMe();
      if (res.data?.user) {
        set({
          isAuthenticated: true,
          currentUser: res.data.user,
          userRoleData: res.data.role_data,
        });
      }
    } catch {
      // Ignore error
    }
  },

  // Fulfillment mode
  fulfillmentMode: 'self_collect',
  setFulfillmentMode: (mode) => set({ fulfillmentMode: mode }),

  // Store profile
  activeRetailerId: 's_sri_sai',
  setActiveRetailer: (retailerId: string) => {
    const matched =
      get().retailers.find((r) => r.id === retailerId) ||
      mockRetailers.find((r) => r.id === retailerId) ||
      mockRetailers[0];

    set({
      activeRetailerId: retailerId,
      retailerProfile: {
        ...matched,
        isOpen: true,
        operatingHours: '08:00 AM – 09:00 PM',
        deliveryRadiusKm: 15,
        gstin: '36AABCU9603R1ZM',
      },
    });
    AsyncStorage.setItem('buildit_active_retailer_id', retailerId).catch(() => {});
  },
  isStoreOpen: true,
  toggleStoreStatus: () => set((state) => ({ isStoreOpen: !state.isStoreOpen })),
  retailerProfile: {
    ...mockRetailers[0],
    isOpen: true,
    operatingHours: '08:00 AM – 09:00 PM',
    deliveryRadiusKm: 15,
    gstin: '36AABCU9603R1ZM',
  },
  updateRetailerProfile: (partial) =>
    set((state) => ({
      retailerProfile: { ...state.retailerProfile, ...partial },
    })),

  addCatalogProductToStore: (productId: string, price: number, stock: number) => {
    const activeId = get().activeRetailerId || 's_sri_sai';
    const newOffer: RetailerProductOffer = {
      id: `offer_${productId}_${activeId}`,
      productId,
      retailerId: activeId,
      price,
      stock,
      isAvailable: stock > 0,
      estimatedDeliveryMins: 30,
    };

    set((state) => {
      const updatedOffers = [
        newOffer,
        ...state.offers.filter(
          (o) =>
            !(
              o.productId === productId &&
              (o.retailerId === activeId || (activeId === 's_sri_sai' && o.retailerId === 'r1'))
            )
        ),
      ];
      const customOffers = updatedOffers.filter((o) => o.id.startsWith('offer_'));
      AsyncStorage.setItem('buildit_custom_offers', JSON.stringify(customOffers)).catch(() => {});
      return { offers: updatedOffers };
    });
  },

  // Products & Catalog
  products: mockProducts,
  retailers: mockRetailers,
  offers: mockOffers,

  addProduct: (newProd, newOffer) => {
    const activeId = get().activeRetailerId || 's_sri_sai';
    const taggedOffer = {
      ...newOffer,
      retailerId: activeId,
    };

    set((state) => {
      const updatedProducts = [newProd, ...state.products.filter((p) => p.id !== newProd.id)];
      const updatedOffers = [taggedOffer, ...state.offers.filter((o) => o.id !== taggedOffer.id)];

      // Persist custom products and offers to AsyncStorage
      const customProds = updatedProducts.filter((p) => p.id.startsWith('prod_'));
      const customOffers = updatedOffers.filter((o) => o.id.startsWith('offer_'));
      AsyncStorage.setItem('buildit_custom_products', JSON.stringify(customProds)).catch(() => {});
      AsyncStorage.setItem('buildit_custom_offers', JSON.stringify(customOffers)).catch(() => {});

      return {
        products: updatedProducts,
        offers: updatedOffers,
      };
    });
  },

  updateProduct: (updatedProd) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === updatedProd.id ? updatedProd : p
      ),
    })),

  deactivateProduct: (productId) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, isActive: false } : p
      ),
      offers: state.offers.map((o) =>
        o.productId === productId ? { ...o, isAvailable: false } : o
      ),
    })),

  updateOfferPrice: (offerId, newPrice) =>
    set((state) => ({
      offers: state.offers.map((o) =>
        o.id === offerId ? { ...o, price: newPrice } : o
      ),
    })),

  updateOfferStock: (offerId, newStock) =>
    set((state) => ({
      offers: state.offers.map((o) =>
        o.id === offerId
          ? { ...o, stock: newStock, isAvailable: newStock > 0 }
          : o
      ),
    })),

  // Async Backend Fetch Actions
  fetchHomeFeed: async () => {
    try {
      const res = await customerService.getHomeFeed();
      if (res.data?.top_stores && Array.isArray(res.data.top_stores)) {
        const liveStores = res.data.top_stores.map(mapBackendStoreToRetailer);
        if (liveStores.length > 0) {
          set({ retailers: liveStores });
        }
      }
    } catch {
      // Keep existing data on offline
    }
  },

  fetchProducts: async (query?: string) => {
    try {
      const res = await catalogService.getProducts({ q: query, limit: 50 });
      if (res.data && Array.isArray(res.data)) {
        const mapped = res.data.map(mapBackendProductToProduct);
        if (mapped.length > 0) {
          set((state) => {
            const backendIds = new Set(mapped.map((p) => p.id));
            const localCustom = state.products.filter(
              (p) => !backendIds.has(p.id) && (p.id.startsWith('prod_') || p.id.startsWith('p_'))
            );
            return { products: [...localCustom, ...mapped] };
          });
        }
      }
    } catch {
      // Keep existing
    }
  },

  fetchCategories: async () => {
    try {
      const res = await customerService.getCategoriesScreen();
      return res.data || [];
    } catch {
      return [];
    }
  },

  fetchStores: async (query?: string) => {
    try {
      const res = await customerService.getNearbyStores({ q: query });
      if (res.data && Array.isArray(res.data)) {
        const liveStores = res.data.map(mapBackendStoreToRetailer);
        if (liveStores.length > 0) {
          set({ retailers: liveStores });
        }
      }
    } catch {
      // Keep existing
    }
  },

  fetchCart: async () => {
    try {
      const res = await customerService.getCart();
      if (res.data?.items) {
        const items = mapBackendCartToCartItems(res.data, get().retailers[0]);
        set({ cart: items });
      }
    } catch {
      // Keep existing
    }
  },

  fetchOrders: async () => {
    try {
      const res = await customerService.getOrders('all');
      if (res.data && Array.isArray(res.data)) {
        const liveOrders = res.data.map(mapBackendOrderToOrder);
        if (liveOrders.length > 0) {
          set({ orders: liveOrders });
        }
      }
    } catch {
      // Keep existing
    }
  },

  fetchAddresses: async () => {
    try {
      const res = await userService.getAddresses();
      if (res.data && Array.isArray(res.data)) {
        const mapped = res.data.map(mapBackendAddressToDeliveryAddress);
        if (mapped.length > 0) {
          set({ savedAddresses: mapped });
        }
      }
    } catch {
      // Keep existing
    }
  },

  fetchRetailerOffers: async () => {
    try {
      const res = await retailerService.getOffers({ limit: 50 });
      if (res.data && Array.isArray(res.data)) {
        const mappedOffers = res.data.map((o: any) => mapBackendOfferToOffer(o));
        if (mappedOffers.length > 0) {
          set((state) => {
            const backendOfferIds = new Set(mappedOffers.map((o) => o.id));
            const localCustomOffers = state.offers.filter(
              (o) => !backendOfferIds.has(o.id) && (o.id.startsWith('offer_') || o.id.startsWith('offer-'))
            );
            return { offers: [...localCustomOffers, ...mappedOffers] };
          });
        }
      }
    } catch {
      // Keep existing
    }
  },

  // Backend Sync Mutations
  syncAddToCart: async (productId: string, offerId?: string, quantity: number = 1) => {
    try {
      await customerService.addItemToCart({ product_id: productId, offer_id: offerId, quantity });
      await get().fetchCart();
    } catch {
      // Fallback to local store mutation
      const product = get().products.find((p) => p.id === productId) || mockProducts[0];
      const offer = get().offers.find((o) => o.productId === productId || o.id === offerId) || mockOffers[0];
      get().addToCart({
        id: `cart-${Date.now()}`,
        product,
        offer,
        retailer: get().retailers[0] || mockRetailers[0],
        quantity,
      });
    }
  },

  syncUpdateCartQuantity: async (itemId: string, quantity: number) => {
    try {
      await customerService.updateCartItemQuantity(itemId, quantity);
      await get().fetchCart();
    } catch {
      get().updateCartQuantity(itemId, quantity);
    }
  },

  syncRemoveCartItem: async (itemId: string) => {
    try {
      await customerService.removeCartItem(itemId);
      await get().fetchCart();
    } catch {
      get().removeFromCart(itemId);
    }
  },

  syncClearCart: async () => {
    try {
      await customerService.clearCart();
      set({ cart: [] });
    } catch {
      get().clearCart();
    }
  },

  syncCreateOffer: async (offerData: any) => {
    try {
      await retailerService.createOffer(offerData);
      await get().fetchRetailerOffers();
    } catch {
      // Local fallback
    }
  },

  syncUpdateOffer: async (offerId: string, offerData: any) => {
    try {
      await retailerService.updateOffer(offerId, offerData);
      await get().fetchRetailerOffers();
    } catch {
      if (offerData.selling_price) get().updateOfferPrice(offerId, offerData.selling_price);
      if (offerData.available_quantity) get().updateOfferStock(offerId, offerData.available_quantity);
    }
  },

  syncDeleteOffer: async (offerId: string) => {
    try {
      await retailerService.deleteOffer(offerId);
      await get().fetchRetailerOffers();
    } catch {
      set((state) => ({
        offers: state.offers.filter((o) => o.id !== offerId),
      }));
    }
  },

  syncAddAddress: async (addressData: any) => {
    try {
      await userService.addAddress(addressData);
      await get().fetchAddresses();
    } catch {
      // Local fallback
      set((state) => ({
        savedAddresses: [mapBackendAddressToDeliveryAddress(addressData), ...state.savedAddresses],
      }));
    }
  },

  syncDeleteAddress: async (addressId: string) => {
    try {
      await userService.deleteAddress(addressId);
      await get().fetchAddresses();
    } catch {
      // Local fallback
    }
  },

  // Promotions
  promotions: INITIAL_PROMOTIONS,
  addPromotion: (promo) =>
    set((state) => ({ promotions: [promo, ...state.promotions] })),
  deletePromotion: (id) =>
    set((state) => ({
      promotions: state.promotions.filter((p) => p.id !== id),
    })),

  // Cart Local Actions
  cart: [],
  addToCart: (newItem) =>
    set((state) => {
      const existingIndex = state.cart.findIndex(
        (i) => i.offer.id === newItem.offer.id
      );
      if (existingIndex >= 0) {
        const updated = [...state.cart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return { cart: updated };
      }
      return { cart: [...state.cart, newItem] };
    }),
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  updateCartQuantity: (id, quantity) =>
    set((state) => ({
      cart:
        quantity <= 0
          ? state.cart.filter((i) => i.id !== id)
          : state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
  clearCart: () => set({ cart: [] }),

  // Orders Local Actions
  orders: INITIAL_RETAILER_ORDERS,
  placeOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
      newOrderNotification: order,
    })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      ),
    })),

  // Notifications
  newOrderNotification: null,
  setNewOrderNotification: (order) => set({ newOrderNotification: order }),
}));
