import { create } from 'zustand';
import {
  UserRole,
  Product,
  Retailer,
  RetailerProductOffer,
  CartItem,
  Order,
  Promotion,
} from '../types';
import { mockProducts, mockRetailers, mockOffers } from '../services/mockData';

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

interface AppState {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Retailer Store State
  isStoreOpen: boolean;
  toggleStoreStatus: () => void;
  retailerProfile: Retailer;
  updateRetailerProfile: (profile: Partial<Retailer>) => void;

  // Products & Offers
  products: Product[];
  retailers: Retailer[];
  offers: RetailerProductOffer[];
  addProduct: (product: Product, offer: RetailerProductOffer) => void;
  updateProduct: (product: Product) => void;
  deactivateProduct: (productId: string) => void;
  updateOfferPrice: (offerId: string, newPrice: number) => void;
  updateOfferStock: (offerId: string, newStock: number) => void;

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

  // Orders
  orders: Order[];
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Incoming Order Modal Alert for Retailer
  newOrderNotification: Order | null;
  setNewOrderNotification: (order: Order | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentRole: 'customer',
  setCurrentRole: (role) => set({ currentRole: role }),

  // Store profile
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

  // Products & Catalog
  products: mockProducts,
  retailers: mockRetailers,
  offers: mockOffers,
  addProduct: (newProd, newOffer) =>
    set((state) => ({
      products: [newProd, ...state.products],
      offers: [newOffer, ...state.offers],
    })),
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

  // Promotions
  promotions: INITIAL_PROMOTIONS,
  addPromotion: (promo) =>
    set((state) => ({ promotions: [promo, ...state.promotions] })),
  deletePromotion: (id) =>
    set((state) => ({
      promotions: state.promotions.filter((p) => p.id !== id),
    })),

  // Cart
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

  // Orders
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
