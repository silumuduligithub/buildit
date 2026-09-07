import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '../../services/user/userService';
import { mapBackendAddressToDeliveryAddress } from '../../services/mappers';
import { DeliveryAddress } from '../../types';

export interface UserState {
  savedAddresses: DeliveryAddress[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  savedAddresses: [
    {
      label: 'Site',
      name: 'Ravi Kumar',
      phone: '9876543210',
      line1: 'Plot 45, Golden Heights, Kondapur',
      city: 'Hyderabad',
      pincode: '500084',
    },
    {
      label: 'Office',
      name: 'Ravi Kumar',
      phone: '9876543210',
      line1: 'Flat 204, Sai Enclave, Madhapur',
      city: 'Hyderabad',
      pincode: '500081',
    },
  ],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchAddressesThunk = createAsyncThunk('user/fetchAddresses', async () => {
  const res = await userService.getAddresses();
  if (res.data && Array.isArray(res.data)) {
    return res.data.map(mapBackendAddressToDeliveryAddress);
  }
  return [];
});

export const addAddressThunk = createAsyncThunk(
  'user/addAddress',
  async (addressData: any, { dispatch }) => {
    const res = await userService.addAddress(addressData);
    dispatch(fetchAddressesThunk());
    return res.data;
  }
);

export const deleteAddressThunk = createAsyncThunk(
  'user/deleteAddress',
  async (addressId: string, { dispatch }) => {
    await userService.deleteAddress(addressId);
    dispatch(fetchAddressesThunk());
    return addressId;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addAddressOptimistic: (state, action: PayloadAction<DeliveryAddress>) => {
      state.savedAddresses.unshift(action.payload);
    },
    deleteAddressOptimistic: (state, action: PayloadAction<string>) => {
      state.savedAddresses = state.savedAddresses.filter((a) => a.line1 !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddressesThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length > 0) {
          state.savedAddresses = action.payload;
        }
      })
      .addCase(fetchAddressesThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addAddressOptimistic, deleteAddressOptimistic } = userSlice.actions;
export default userSlice.reducer;
