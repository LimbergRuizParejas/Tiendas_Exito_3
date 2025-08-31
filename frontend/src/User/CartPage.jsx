import React, { useState, useEffect } from 'react';
import { updateInventoryItem, getInventory } from '../pages/services/inventoryService';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const removeItem = async (id) => {
    const itemToRemove = cart.find(item => item.id === id);
    if (!itemToRemove) return;

    setUpdatingId(id);

    try {
      const inventory = await getInventory();
      const productInInventory = inventory.find(prod => prod.id === id);

      if (!productInInventory) {
        alert('Producto no encontrado en inventario.');
        return;
      }

      // Devolver el stock al inventario
      await updateInventoryItem(id, { cantidad: productInInventory.cantidad + itemToRemove.quantity });

      // Actualizar carrito local
      const updatedCart = cart.filter(item => item.id !== id);
      setCart(updatedCart);
      if (updatedCart.length === 0) {
        localStorage.removeItem('cart');
      } else {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }

    } catch (err) {
      console.error('Error actualizando inventario:', err);
      alert('No se pudo devolver el stock al inventario.');
    } finally {
      setUpdatingId(null);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.precio) || 0) * (item.quantity || 0), 0);

  return (
    <div className="cart-page">
      <h1>🛒 Mi Carrito</h1>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <span>{item.nombreProducto} - {item.quantity} x {parseFloat(item.precio).toFixed(2)} Bs</span>
                <button 
                  onClick={() => removeItem(item.id)}
                  disabled={updatingId === item.id}
                  className="remove-btn"
                >
                  {updatingId === item.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </li>
            ))}
          </ul>
          <h3>Subtotal: {isNaN(subtotal) ? '0.00' : subtotal.toFixed(2)} Bs</h3>
        </>
      )}
    </div>
  );
};

export default CartPage;
