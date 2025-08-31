// 📌 src/pages/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import UserLayout from '../../User/UserLayout';

// Admin: páginas
import ProductList from '../Products/ProductList';
import ProductForm from '../Products/ProductForm';
import ProductDetail from '../Products/ProductDetail';
import CategoryList from '../Categories/CategoryList';
import CategoryForm from '../Categories/CategoryForm';
import BrandList from '../Brands/BrandList';
import BrandForm from '../Brands/BrandForm';
import InventoryList from '../Inventory/InventoryList';
import Caja from '../Caja'; // 👈 Página de Caja

// Público (catálogo institucional)
import Catalog from '../Catalog';

// E-commerce público
import UserCatalogPage from '../../User/CatalogPage';
import ProductDetailPage from '../../User/ProductDetailPage';
import CartPage from '../../User/CartPage';

// Páginas de autenticación
import AdminLogin from '../AdminLogin';
import UserLogin from '../UserLogin';
import UserRegister from '../UserRegister';

// 404
import NotFound from '../NotFound';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* 👉 Redirección principal */}
        <Route path="/" element={<Navigate to="/user/catalog" replace />} />

        {/* 🔑 Rutas de autenticación */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />

        {/* 🌐 Catálogo institucional */}
        <Route element={<MainLayout />}>
          <Route path="/catalog" element={<Catalog />} />
        </Route>

        {/* 🛒 E-commerce público */}
        <Route element={<UserLayout />}>
          <Route path="/user/catalog" element={<UserCatalogPage />} />
          <Route path="/user/product/:id" element={<ProductDetailPage />} />
          <Route path="/user/cart" element={<CartPage />} />
        </Route>

        {/* ⚙️ Área administrativa */}
        <Route element={<AdminLayout />}>
          <Route path="/inventory" element={<InventoryList />} />

          {/* Productos */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/create" element={<ProductForm />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />

          {/* Categorías */}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/create" element={<CategoryForm />} />
          <Route path="/categories/:id/edit" element={<CategoryForm />} />

          {/* Marcas */}
          <Route path="/brands" element={<BrandList />} />
          <Route path="/brands/create" element={<BrandForm />} />
          <Route path="/brands/:id/edit" element={<BrandForm />} />

          {/* Caja */}
          <Route path="/admin/caja" element={<Caja />} />
        </Route>

        {/* ❌ Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
