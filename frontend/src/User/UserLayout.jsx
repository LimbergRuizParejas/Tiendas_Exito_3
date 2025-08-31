import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavbarUser from '../components/NavbarUser';
import ChatbotWidget from '../components/ChatbotWidget'; // si lo estás usando

const UserLayout = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
        setCartCount(count);
      } catch (e) {
        console.error('Error al leer carrito desde localStorage:', e);
        setCartCount(0);
      }
    };

    updateCartCount();
    const interval = setInterval(updateCartCount, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavbarUser cartCount={cartCount} />
      <main style={{ padding: '20px', minHeight: '80vh' }}>
        <Outlet />
      </main>
      <ChatbotWidget /> {/* Comenta o quita si no lo usas aún */}
    </>
  );
};

export default UserLayout;
