import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { customerService } from '../../services/customer/customerService';
import { mapBackendOrderToOrder } from '../../services/mappers';
import { Order } from '../../types';

export interface OrdersState {
  orders: Order[];
  newOrderNotification: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  newOrderNotification: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchOrdersThunk = createAsyncThunk(
  'orders/fetchOrders',
  async (status: 'all' | 'delivered' | 'cancelled' | 'active' = 'all') => {
    const res = await customerService.getOrders(status);
    if (res.data?.orders && Array.isArray(res.data.orders)) {
      return res.data.orders.map(mapBackendOrderToOrder);
    }
    return [];
  }
);

export const reorderThunk = createAsyncThunk(
  'orders/reorder',
  async (orderIdOrCode: string) => {
    const res = await customerService.reorderOrder(orderIdOrCode);
    return res.data;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrderOptimistic: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.newOrderNotification = action.payload;
    },
    updateOrderStatusLocal: (
      state,
      action: PayloadAction<{ orderId: string; status: Order['status'] }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
      }
    },
    setNewOrderNotification: (state, action: PayloadAction<Order | null>) => {
      state.newOrderNotification = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length > 0) {
          state.orders = action.payload;
        }
      })
      .addCase(fetchOrdersThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  placeOrderOptimistic,
  updateOrderStatusLocal,
  setNewOrderNotification,
} = ordersSlice.actions;
export default ordersSlice.reducer;
