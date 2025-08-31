import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
import logo from '../assets/images/logo_Exito.PNG';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo de la tienda */}
        <Link to="/catalog" className="navbar-logo">
          <img src={logo} alt="Tienda Éxito" className="navbar-logo-img" />
        </Link>

        {/* Menú de navegación */}
        <ul className="navbar-menu">
          <li>
            <Link to="/user/catalog">Ir a eCommerce</Link>
          </li>
          <li>
            <Link to="/catalog">Catálogo</Link>
          </li>
          <li>
            <Link to="/products">Productos</Link>
          </li>
          <li>
            <Link to="/categories">Categorías</Link>
          </li>
          <li>
            <Link to="/brands">Marcas</Link>
          </li>
          <li>
            <Link to="/inventory">Inventario</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
