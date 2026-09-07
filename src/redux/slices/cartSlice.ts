import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { customerService } from '../../services/customer/customerService';
import { mapBackendCartToCartItems } from '../../services/mappers';
import { CartItem } from '../../types';

export interface CartState {
  items: CartItem[];
  fulfillmentMode: 'self_collect' | 'delivery';
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  fulfillmentMode: 'delivery',
  loading: false,
  error: null,
};

// Async Thunks
export const fetchCartThunk = createAsyncThunk('cart/fetchCart', async () => {
  const res = await customerService.getCart();
  if (res.data) {
    return mapBackendCartToCartItems(res.data);
  }
  return [];
});

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (
    { item, backendOfferId, productId }: { item: CartItem; backendOfferId?: string; productId?: string },
    { dispatch }
  ) => {
    try {
      if (backendOfferId) {
        await customerService.addItemToCart({ offer_id: backendOfferId, quantity: item.quantity || 1 });
      } else if (productId) {
        await customerService.addItemToCart({ product_id: productId, quantity: item.quantity || 1 });
      }
      dispatch(fetchCartThunk());
    } catch {
      // Retain optimistic update
    }
    return item;
  }
);

export const updateCartQuantityThunk = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { dispatch }) => {
    try {
      await customerService.updateCartItemQuantity(itemId, quantity);
      dispatch(fetchCartThunk());
    } catch {
      // Retain optimistic update
    }
    return { itemId, quantity };
  }
);

export const removeCartItemThunk = createAsyncThunk(
  'cart/removeItem',
  async (itemId: string, { dispatch }) => {
    try {
      await customerService.removeCartItem(itemId);
      dispatch(fetchCartThunk());
    } catch {
      // Retain optimistic update
    }
    return itemId;
  }
);

export const clearCartThunk = createAsyncThunk('cart/clearCart', async () => {
  try {
    await customerService.clearCart();
  } catch {
    // Ignore error
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartOptimistic: (state, action: PayloadAction<CartItem>) => {
      const existingIndex = state.items.findIndex(
        (i) => i.offer.id === action.payload.offer.id
      );
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += action.payload.quantity || 1;
      } else {
        state.items.push(action.payload);
      }
    },
    updateQuantityOptimistic: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      } else {
        const item = state.items.find((i) => i.id === action.payload.id);
        if (item) item.quantity = action.payload.quantity;
      }
    },
    removeItemOptimistic: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCartOptimistic: (state) => {
      state.items = [];
    },
    setFulfillmentMode: (state, action: PayloadAction<'self_collect' | 'delivery'>) => {
      state.fulfillmentMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchCartThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const {
  addToCartOptimistic,
  updateQuantityOptimistic,
  removeItemOptimistic,
  clearCartOptimistic,
  setFulfillmentMode,
} = cartSlice.actions;
export default cartSlice.reducer;
