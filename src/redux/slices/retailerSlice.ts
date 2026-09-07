import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { retailerService, CreateOfferPayload, UpdateOfferPayload } from '../../services/retailer/retailerService';
import { mapBackendOfferToOffer } from '../../services/mappers';
import { RetailerProductOffer } from '../../types';

export interface RetailerProfileState {
  name: string;
  phone: string;
  address: string;
  operatingHours: string;
  deliveryRadiusKm: number;
  gstin: string;
}

export interface RetailerState {
  isStoreOpen: boolean;
  offers: RetailerProductOffer[];
  retailerProfile: RetailerProfileState;
  loading: boolean;
  error: string | null;
}

const initialState: RetailerState = {
  isStoreOpen: true,
  offers: [],
  retailerProfile: {
    name: 'Sri Sai Hardware & Builders',
    phone: '+91 98480 12345',
    address: 'Plot No. 12, Main Road, Kondapur, Hyderabad, TS',
    operatingHours: '08:00 AM – 09:00 PM',
    deliveryRadiusKm: 15,
    gstin: '36AABCU9603R1ZM',
  },
  loading: false,
  error: null,
};

// Async Thunks
export const fetchRetailerOffersThunk = createAsyncThunk(
  'retailer/fetchOffers',
  async () => {
    const res = await retailerService.getOffers();
    if (res.data?.offers && Array.isArray(res.data.offers)) {
      return res.data.offers.map(mapBackendOfferToOffer);
    }
    return [];
  }
);

export const createOfferThunk = createAsyncThunk(
  'retailer/createOffer',
  async (offerData: CreateOfferPayload, { dispatch }) => {
    const res = await retailerService.createOffer(offerData);
    dispatch(fetchRetailerOffersThunk());
    return res.data;
  }
);

export const updateOfferThunk = createAsyncThunk(
  'retailer/updateOffer',
  async ({ offerId, data }: { offerId: string; data: UpdateOfferPayload }, { dispatch }) => {
    const res = await retailerService.updateOffer(offerId, data);
    dispatch(fetchRetailerOffersThunk());
    return res.data;
  }
);

export const deleteOfferThunk = createAsyncThunk(
  'retailer/deleteOffer',
  async (offerId: string, { dispatch }) => {
    const res = await retailerService.deleteOffer(offerId);
    dispatch(fetchRetailerOffersThunk());
    return res.data;
  }
);

const retailerSlice = createSlice({
  name: 'retailer',
  initialState,
  reducers: {
    toggleStoreStatus: (state) => {
      state.isStoreOpen = !state.isStoreOpen;
    },
    updateOfferStockLocal: (
      state,
      action: PayloadAction<{ offerId: string; stock: number }>
    ) => {
      const offer = state.offers.find((o) => o.id === action.payload.offerId);
      if (offer) {
        offer.stock = action.payload.stock;
        offer.isAvailable = action.payload.stock > 0;
      }
    },
    updateOfferPriceLocal: (
      state,
      action: PayloadAction<{ offerId: string; price: number }>
    ) => {
      const offer = state.offers.find((o) => o.id === action.payload.offerId);
      if (offer) {
        offer.price = action.payload.price;
      }
    },
    updateRetailerProfileLocal: (
      state,
      action: PayloadAction<Partial<RetailerProfileState>>
    ) => {
      state.retailerProfile = { ...state.retailerProfile, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRetailerOffersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRetailerOffersThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length > 0) {
          state.offers = action.payload;
        }
      })
      .addCase(fetchRetailerOffersThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  toggleStoreStatus,
  updateOfferStockLocal,
  updateOfferPriceLocal,
  updateRetailerProfileLocal,
} = retailerSlice.actions;
export default retailerSlice.reducer;
