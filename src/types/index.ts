export type UserRole = 'customer' | 'retailer' | 'delivery';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  unit: string;
  imageUrl?: string;
  description?: string;
  sku?: string;
  isActive?: boolean;
}

export interface Retailer {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  isServiceable: boolean;
  deliveryTypes: DeliveryType[];
  phone?: string;
  isOpen?: boolean;
  operatingHours?: string;
  deliveryRadiusKm?: number;
  gstin?: string;
}

export type DeliveryType = 'express' | 'scheduled' | 'bulk';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'driver_assigned'
  | 'pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'rejected';

export interface RetailerProductOffer {
  id: string;
  productId: string;
  retailerId: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  estimatedDeliveryMins: number;
}

export interface CartItem {
  id: string;
  offer: RetailerProductOffer;
  product: Product;
  retailer: Retailer;
  quantity: number;
}

export interface DeliveryAddress {
  id?: string;
  label: string;          // "Home" | "Site" | "Office"
  name: string;           // Recipient name
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  details?: string;
  address?: string;
  tag?: string;
  deliveryTime?: string;
}

export interface Order {
  id: string;
  customerId: string;
  retailerId: string;
  status: OrderStatus;
  items: CartItem[];

  // Pricing
  subtotal: number;
  gst: number;
  totalAmount: number;
  deliveryFee: number;

  // Delivery
  deliveryAddress: DeliveryAddress;
  deliveryType: DeliveryType;
  deliveryModel?: 'retailer_fleet' | 'third_party_logistics';
  estimatedDeliveryMins?: number;
  scheduledSlot?: string;           // e.g. "Tomorrow, 10 AM – 12 PM"

  // Payment
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'COD';
  paymentStatus: 'pending' | 'paid' | 'refunded';

  // Logistics
  driverName?: string;
  driverPhone?: string;
  otp: string;

  // Meta
  createdAt: string;
  updatedAt?: string;
}

export interface Promotion {
  id: string;
  title: string;
  productName: string;
  discountPct: number;
  couponCode: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'expired';
}

export interface DeliveryPartner {
  id: string;
  name: string;
  vehicleType: 'bike' | 'tempo' | 'truck';
  phone: string;
  status: 'idle' | 'on_delivery';
}
