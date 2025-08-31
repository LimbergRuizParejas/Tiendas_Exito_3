import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <Navbar />

      <div className="admin-container">
        <aside className="admin-sidebar">
          <h3>Panel Admin</h3>
          <nav>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/products">Productos</Link>
            <Link to="/admin/categories">Categorías</Link>
            <Link to="/admin/brands">Marcas</Link>
          </nav>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </aside>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
