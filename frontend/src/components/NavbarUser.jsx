import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarUser.css';

const NavbarUser = ({ cartCount = 0 }) => {
  return (
    <nav className="navbar-user">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/user/catalog">
            🛍 <span className="logo-text">Tienda Éxito</span>
          </Link>
        </div>
        <div className="navbar-cart">
          <Link to="/user/cart">
            🛒
            <span className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUser;
