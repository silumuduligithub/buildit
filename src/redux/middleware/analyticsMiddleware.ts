import { Middleware } from '@reduxjs/toolkit';

export interface AnalyticsEvent {
  event: string;
  params: Record<string, any>;
  timestamp: string;
}

/**
 * Analytics & Telemetry Middleware
 * Tracks key user conversion milestones (Add to Cart, Checkout, Order Placed, Search).
 */
export const analyticsMiddleware: Middleware = () => (next) => (action: any) => {
  const result = next(action);
  const actionType: string = action?.type || '';

  // 1. Add to Cart Tracking
  if (actionType.includes('addToCart')) {
    const item = action.payload?.item || action.payload;
    if (item && __DEV__) {
      console.log('📊 [Analytics Event: add_to_cart]', {
        productId: item.product?.id,
        productName: item.product?.name,
        price: item.offer?.price,
        quantity: item.quantity,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 2. Order Placed Tracking
  if (actionType.includes('placeOrder') || actionType.includes('createOrder/fulfilled')) {
    const order = action.payload;
    if (order && __DEV__) {
      console.log('🎉 [Analytics Event: purchase_completed]', {
        orderId: order.id,
        totalAmount: order.totalAmount,
        itemCount: order.items?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 3. Search Executed
  if (actionType.includes('searchOmnichannel/fulfilled')) {
    if (__DEV__) {
      console.log('🔍 [Analytics Event: search_query_executed]', {
        query: action.meta?.arg?.q || action.meta?.arg,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return result;
};

export default analyticsMiddleware;
