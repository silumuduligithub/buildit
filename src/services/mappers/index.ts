import {
  Product,
  Retailer,
  RetailerProductOffer,
  CartItem,
  Order,
  OrderStatus,
  DeliveryAddress,
} from '../../types';

/**
 * Clean currency string or number to a number
 */
export const parseNumber = (val: any, fallback: number = 0): number => {
  if (typeof val === 'number') return val;
  if (!val) return fallback;
  const cleaned = String(val).replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Maps Backend Master Product to Mobile UI Product
 */
export const mapBackendProductToProduct = (item: any): Product => {
  if (!item) {
    return {
      id: '',
      name: '',
      brand: '',
      category: '',
      unit: 'Piece',
    };
  }

  const categoryName =
    typeof item.category === 'string'
      ? item.category
      : item.category_id?.name || item.category?.name || 'General';

  const brandName =
    typeof item.brand === 'string'
      ? item.brand
      : item.brand_id?.name || item.brand?.name || 'Standard';

  const catLower = (categoryName || '').toLowerCase();
  const nameLower = (item.name || item.product_name || '').toLowerCase();

  let fallbackImage = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80';
  if (catLower.includes('cement') || nameLower.includes('cement')) {
    fallbackImage = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('steel') || nameLower.includes('steel') || nameLower.includes('rebar') || nameLower.includes('tmt')) {
    fallbackImage = 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('sand') || nameLower.includes('sand') || nameLower.includes('aggregate')) {
    fallbackImage = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('brick') || nameLower.includes('brick') || nameLower.includes('block')) {
    fallbackImage = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('plywood') || catLower.includes('timber') || nameLower.includes('plywood') || nameLower.includes('wood')) {
    fallbackImage = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('paint') || catLower.includes('putty') || catLower.includes('coating') || nameLower.includes('paint') || nameLower.includes('putty')) {
    fallbackImage = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('electric') || catLower.includes('wire') || catLower.includes('cable') || nameLower.includes('wire')) {
    fallbackImage = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('plumb') || catLower.includes('pipe') || catLower.includes('sanitary') || nameLower.includes('pipe')) {
    fallbackImage = 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('tile') || catLower.includes('marble') || catLower.includes('floor') || nameLower.includes('tile')) {
    fallbackImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('tool') || catLower.includes('hardware') || nameLower.includes('drill') || nameLower.includes('hammer')) {
    fallbackImage = 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80';
  }

  const primaryImage =
    (typeof item.images?.[0] === 'string' ? item.images[0] : item.images?.[0]?.url) ||
    item.image_url ||
    item.imageUrl ||
    item.image ||
    fallbackImage;

  return {
    id: item._id || item.id || item.product_id || '',
    name: item.name || item.product_name || 'Product',
    brand: brandName,
    category: categoryName,
    unit: item.unit || item.specifications?.unit || '50 Kg Bag',
    imageUrl: primaryImage,
    description: item.short_description || item.description || '',
    sku: item.product_code || item.sku || '',
    isActive: item.is_active !== undefined ? item.is_active : true,
  };
};

/**
 * Maps Backend Store / Retailer to Mobile UI Retailer
 */
export const mapBackendStoreToRetailer = (store: any): Retailer => {
  if (!store) {
    return {
      id: 'store-1',
      name: 'Hardware Store',
      address: 'Hyderabad',
      distance: 1.5,
      rating: 4.5,
      isServiceable: true,
      deliveryTypes: ['express', 'scheduled'],
    };
  }

  const addressStr =
    typeof store.address === 'string'
      ? store.address
      : store.address
      ? `${store.address.address_line1 || ''}, ${store.address.city || ''}, ${store.address.state || ''}`.replace(/^, /, '')
      : 'Kondapur, Hyderabad';

  return {
    id: store._id || store.id || '',
    name: store.store_name || store.name || 'BuildKart Partner Store',
    address: addressStr || 'Hyderabad',
    distance: typeof store.distance_km === 'number' ? store.distance_km : store.distance || 1.5,
    rating: typeof store.rating === 'number' ? store.rating : 4.5,
    isServiceable: true,
    deliveryTypes: ['express', 'scheduled', 'bulk'],
    phone: store.phone || store.user_id?.phone || '+91 98765 11223',
    isOpen: store.is_open ?? true,
    operatingHours: '08:00 AM – 09:00 PM',
    deliveryRadiusKm: store.delivery?.max_delivery_radius_km || 15,
    gstin: store.gst_number || '36AABCU9603R1ZM',
  };
};

/**
 * Maps Backend Product Offer to Mobile UI Offer
 */
export const mapBackendOfferToOffer = (offer: any, defaultStoreId: string = 's_sri_sai'): RetailerProductOffer => {
  if (!offer) {
    return {
      id: 'offer-1',
      productId: '',
      retailerId: defaultStoreId,
      price: 0,
      stock: 0,
      isAvailable: false,
      estimatedDeliveryMins: 30,
    };
  }

  const retailerId =
    typeof offer.retailer_id === 'string'
      ? offer.retailer_id
      : offer.retailer_id?._id || offer.retailerId || defaultStoreId;

  const productId =
    typeof offer.product_id === 'string'
      ? offer.product_id
      : offer.product_id?._id || offer.productId || '';

  const price = parseNumber(offer.selling_price ?? offer.price, 0);
  const stock = typeof offer.available_quantity === 'number' ? offer.available_quantity : offer.stock || 0;

  return {
    id: offer._id || offer.id || offer.offerId || `offer-${Math.random().toString(36).substr(2, 9)}`,
    productId,
    retailerId,
    price,
    stock,
    isAvailable: offer.is_in_stock ?? (stock > 0),
    estimatedDeliveryMins: offer.estimated_delivery_time ? parseNumber(offer.estimated_delivery_time, 30) : 30,
  };
};

/**
 * Maps Backend Cart response to Mobile UI CartItem array
 */
export const mapBackendCartToCartItems = (backendCart: any, defaultRetailer?: Retailer): CartItem[] => {
  if (!backendCart || !Array.isArray(backendCart.items)) return [];

  return backendCart.items.map((item: any) => {
    const product = mapBackendProductToProduct(item);
    const offer: RetailerProductOffer = {
      id: item.offer_id || `offer-${item.id}`,
      productId: product.id,
      retailerId: defaultRetailer?.id || 's_sri_sai',
      price: parseNumber(item.unit_price, 0),
      stock: 100,
      isAvailable: true,
      estimatedDeliveryMins: 30,
    };

    return {
      id: item.id || item._id,
      offer,
      product,
      retailer: defaultRetailer || {
        id: 's_sri_sai',
        name: 'BuildKart Store',
        address: 'Kondapur, Hyderabad',
        distance: 1.5,
        rating: 4.8,
        isServiceable: true,
        deliveryTypes: ['express', 'scheduled'],
      },
      quantity: item.quantity || 1,
    };
  });
};

/**
 * Maps Backend User Address to Mobile UI DeliveryAddress
 */
export const mapBackendAddressToDeliveryAddress = (addr: any): DeliveryAddress => {
  if (!addr) {
    return {
      label: 'Home',
      name: 'Customer',
      phone: '9876543210',
      line1: 'Kondapur, Hyderabad',
      city: 'Hyderabad',
      pincode: '500084',
    };
  }

  return {
    label: addr.label || addr.type || 'Home',
    name: addr.name || 'Customer',
    phone: addr.phone || '',
    line1: addr.address_line1 || addr.address || addr.details || '',
    line2: addr.address_line2 || '',
    city: addr.city || 'Hyderabad',
    pincode: addr.pincode || '500084',
  };
};

/**
 * Maps Backend Order to Mobile UI Order
 */
export const mapBackendOrderToOrder = (o: any): Order => {
  if (!o) {
    return {
      id: 'BK-0000',
      customerId: '',
      retailerId: '',
      status: 'placed',
      items: [],
      subtotal: 0,
      gst: 0,
      totalAmount: 0,
      deliveryFee: 0,
      deliveryAddress: {
        label: 'Site',
        name: 'Customer',
        phone: '9876543210',
        line1: 'Hyderabad',
        city: 'Hyderabad',
        pincode: '500084',
      },
      deliveryType: 'express',
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      otp: '1234',
      createdAt: new Date().toISOString(),
    };
  }

  const mappedStatus: OrderStatus = ((): OrderStatus => {
    switch (o.order_status) {
      case 'placed':
      case 'confirmed':
      case 'preparing':
      case 'ready':
      case 'driver_assigned':
      case 'pickup':
      case 'out_for_delivery':
      case 'delivered':
      case 'rejected':
        return o.order_status as OrderStatus;
      case 'packed':
        return 'ready';
      case 'dispatched':
      case 'in_transit':
        return 'out_for_delivery';
      case 'cancelled':
        return 'rejected';
      default:
        return 'placed';
    }
  })();

  const subtotal = parseNumber(o.item_total, 0);
  const gst = parseNumber(o.tax_total, Math.round(subtotal * 0.18));
  const totalAmount = parseNumber(o.grand_total, subtotal + gst);
  const deliveryFee = parseNumber(o.delivery_charge, 0);

  const cartItems: CartItem[] = Array.isArray(o.items)
    ? o.items.map((i: any, idx: number) => {
        const prod = mapBackendProductToProduct(i);
        return {
          id: i.id || i._id || `item-${idx}`,
          product: prod,
          offer: {
            id: `offer-${idx}`,
            productId: prod.id,
            retailerId: o.retailer_id || 's_sri_sai',
            price: parseNumber(i.unit_price, 0),
            stock: 100,
            isAvailable: true,
            estimatedDeliveryMins: 30,
          },
          retailer: {
            id: 's_sri_sai',
            name: 'BuildKart Store',
            address: 'Hyderabad',
            distance: 1.5,
            rating: 4.8,
            isServiceable: true,
            deliveryTypes: ['express'],
          },
          quantity: i.quantity || 1,
        };
      })
    : [];

  return {
    id: o.order_code || o.id || o._id || 'BK-000000',
    customerId: o.customer_id || 'customer-1',
    retailerId: o.retailer_id || 's_sri_sai',
    status: mappedStatus,
    items: cartItems,
    subtotal,
    gst,
    totalAmount,
    deliveryFee,
    deliveryAddress: mapBackendAddressToDeliveryAddress(o.delivery_address || o.address_id),
    deliveryType: 'express',
    deliveryModel: 'third_party_logistics',
    estimatedDeliveryMins: 30,
    paymentMethod: o.payment_method || 'UPI',
    paymentStatus: o.payment_status || 'paid',
    driverName: o.driver_name || 'Mahesh Kumar',
    driverPhone: o.driver_phone || '+91 98765 00112',
    otp: o.otp || '4821',
    createdAt: o.created_at || o.placed_at || new Date().toISOString(),
    updatedAt: o.updated_at,
  };
};
