import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';

// Async thunks
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const categories = await getCategories();
  return categories;
});

export const addCategory = createAsyncThunk('categories/addCategory', async (category) => {
  const newCategory = await createCategory(category);
  return newCategory;
});

export const updateCategoryThunk = createAsyncThunk('categories/updateCategory', async ({ id, category }) => {
  const updatedCategory = await updateCategory(id, category);
  return updatedCategory;
});

export const deleteCategoryThunk = createAsyncThunk('categories/deleteCategory', async (id) => {
  await deleteCategory(id);
  return id;
});

// Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default categorySlice.reducer;
