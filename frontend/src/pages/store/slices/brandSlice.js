import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../../services/brandService';

// Async thunks
export const fetchBrands = createAsyncThunk('brands/fetchBrands', async () => {
  const brands = await getBrands();
  return brands;
});

export const addBrand = createAsyncThunk('brands/addBrand', async (brand) => {
  const newBrand = await createBrand(brand);
  return newBrand;
});

export const updateBrandThunk = createAsyncThunk('brands/updateBrand', async ({ id, brand }) => {
  const updatedBrand = await updateBrand(id, brand);
  return updatedBrand;
});

export const deleteBrandThunk = createAsyncThunk('brands/deleteBrand', async (id) => {
  await deleteBrand(id);
  return id;
});

// Slice
const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchBrands.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBrands.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default brandSlice.reducer;
