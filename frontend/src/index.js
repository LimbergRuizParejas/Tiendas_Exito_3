import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './pages/store';
import { CartProvider } from './User/CartContext';
import AppRoutes from './pages/routes/AppRoutes';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </Provider>
  </React.StrictMode>
);
