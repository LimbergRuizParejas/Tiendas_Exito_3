import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInventory, updateInventoryItem } from '../pages/services/inventoryService';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const inventory = await getInventory();
        const found = inventory.find(item => item.id === parseInt(id, 10));
        if (found) {
          setProduct(found);
          setQuantity(1);
        }
      } catch (err) {
        console.error('Error al cargar el producto:', err);
      }
    };

    loadProduct();
    setCart(JSON.parse(localStorage.getItem('cart')) || []);
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || quantity > product.cantidad) {
      alert('Stock insuficiente.');
      return;
    }

    let localCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = localCart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      localCart.push({ ...product, quantity });
    }

    try {
      await updateInventoryItem(product.id, { cantidad: product.cantidad - quantity });
      const inventory = await getInventory();
      const updated = inventory.find(item => item.id === parseInt(id, 10));
      setProduct(updated);

      localStorage.setItem('cart', JSON.stringify(localCart));
      setCart(localCart);
      setShowModal(true);

      setTimeout(() => setShowModal(false), 4000);
    } catch (err) {
      console.error('Error actualizando stock:', err);
      alert('No se pudo actualizar el stock en el servidor.');
    }
  };

  const cartSubtotal = cart
    .reduce((acc, item) => acc + (parseFloat(item.precio) || 0) * (item.quantity || 0), 0)
    .toFixed(2);

  if (!product) {
    return <p style={{ textAlign: 'center' }}>Cargando producto...</p>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image">
          <img src={product.imagen} alt={product.nombreProducto} />
        </div>
        <div className="product-info">
          <h2>{product.nombreProducto}</h2>
          <p className="sku">SKU: {product.id}</p>
          <p className="stock">
            Disponibilidad:{' '}
            <span className={product.cantidad > 0 ? 'in-stock' : 'out-stock'}>
              {product.cantidad > 0 ? `¡Solo ${product.cantidad} disponibles!` : 'Sin stock'}
            </span>
          </p>
          <div className="price">
            <span className="old-price">Bs{(parseFloat(product.precio) * 1.2).toFixed(2)}</span>
            <span className="current-price">Bs{parseFloat(product.precio).toFixed(2)}</span>
          </div>

          <div className="quantity-cart">
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              disabled={product.cantidad <= 0}
            >
              {Array.from({ length: product.cantidad }, (_, i) => i + 1).map(qty => (
                <option key={qty} value={qty}>{qty}</option>
              ))}
            </select>
            <button
              onClick={handleAddToCart}
              disabled={product.cantidad <= 0}
            >
              Añadir al carrito
            </button>
          </div>

          <div className="description">
            <h3>Descripción</h3>
            <p>{product.descripcion || 'Este producto no tiene descripción disponible.'}</p>
          </div>

          <div className="social">
            <span>Compartir:</span>
            <button onClick={() => alert('Compartir en Facebook')}>📘</button>
            <button onClick={() => alert('Compartir en Twitter')}>🐦</button>
            <button onClick={() => alert('Compartir en WhatsApp')}>💬</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-cart-confirm">
          <p>✅ Añadido a su carrito:</p>
          <div className="modal-product">
            <img src={product.imagen} alt={product.nombreProducto} />
            <div>
              <strong>{product.nombreProducto}</strong><br />
              {quantity} x Bs{parseFloat(product.precio).toFixed(2)}
            </div>
          </div>
          <p>Subtotal del carrito: Bs{cartSubtotal}</p>
          <div className="modal-actions">
            <Link to="/user/cart" className="btn-vercarrito">Ver carrito</Link>
            <Link to="/user/cart" className="btn-pagar">Ir a pagar</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
