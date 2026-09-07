import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { customerService } from '../../services/customer/customerService';
import { catalogService } from '../../services/catalog/catalogService';
import {
  mapBackendProductToProduct,
  mapBackendStoreToRetailer,
} from '../../services/mappers';
import { Product, Retailer } from '../../types';

export interface CatalogState {
  products: Product[];
  retailers: Retailer[];
  categories: any[];
  banners: any[];
  quickActions: any[];
  searchResults: {
    products: Product[];
    stores: Retailer[];
    categories: any[];
  };
  searchSuggestions: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  products: [],
  retailers: [],
  categories: [],
  banners: [],
  quickActions: [],
  searchResults: {
    products: [],
    stores: [],
    categories: [],
  },
  searchSuggestions: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchHomeFeedThunk = createAsyncThunk('catalog/fetchHomeFeed', async () => {
  const res = await customerService.getHomeFeed();
  return res.data;
});

export const fetchProductsThunk = createAsyncThunk(
  'catalog/fetchProducts',
  async (params?: { categoryId?: string; brandId?: string; q?: string; page?: number; limit?: number }) => {
    const res = await catalogService.getProducts(params);
    if (res.data?.products && Array.isArray(res.data.products)) {
      return res.data.products.map(mapBackendProductToProduct);
    }
    return [];
  }
);

export const fetchStoresThunk = createAsyncThunk('catalog/fetchStores', async () => {
  const res = await customerService.getNearbyStores();
  if (res.data && Array.isArray(res.data)) {
    return res.data.map(mapBackendStoreToRetailer);
  }
  return [];
});

export const searchOmnichannelThunk = createAsyncThunk(
  'catalog/searchOmnichannel',
  async (params: { q?: string; categoryId?: string; brandId?: string; page?: number; limit?: number }) => {
    const res = await customerService.unifiedSearch(params);
    return res.data;
  }
);

export const fetchSearchSuggestionsThunk = createAsyncThunk(
  'catalog/fetchSuggestions',
  async (query: string) => {
    const res = await customerService.getSearchSuggestions(query);
    return res.data || [];
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setRetailers: (state, action: PayloadAction<Retailer[]>) => {
      state.retailers = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = { products: [], stores: [], categories: [] };
      state.searchSuggestions = [];
    },
  },
  extraReducers: (builder) => {
    // Home Feed
    builder
      .addCase(fetchHomeFeedThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomeFeedThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          if (action.payload.banners) state.banners = action.payload.banners;
          if (action.payload.quick_actions) state.quickActions = action.payload.quick_actions;
          if (action.payload.top_stores && Array.isArray(action.payload.top_stores)) {
            state.retailers = action.payload.top_stores.map(mapBackendStoreToRetailer);
          }
        }
      })
      .addCase(fetchHomeFeedThunk.rejected, (state) => {
        state.loading = false;
      });

    // Products
    builder.addCase(fetchProductsThunk.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        state.products = action.payload;
      }
    });

    // Stores
    builder.addCase(fetchStoresThunk.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        state.retailers = action.payload;
      }
    });

    // Search
    builder.addCase(searchOmnichannelThunk.fulfilled, (state, action) => {
      if (action.payload) {
        const products = Array.isArray(action.payload.products)
          ? action.payload.products.map(mapBackendProductToProduct)
          : [];
        const stores = Array.isArray(action.payload.stores)
          ? action.payload.stores.map(mapBackendStoreToRetailer)
          : [];
        state.searchResults = {
          products,
          stores,
          categories: action.payload.categories || [],
        };
      }
    });

    // Suggestions
    builder.addCase(fetchSearchSuggestionsThunk.fulfilled, (state, action) => {
      state.searchSuggestions = action.payload;
    });
  },
});

export const { setProducts, setRetailers, clearSearch } = catalogSlice.actions;
export default catalogSlice.reducer;
