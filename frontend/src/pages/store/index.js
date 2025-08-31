import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import brandReducer from './slices/brandSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    brands: brandReducer,
  },
});

export default store;
