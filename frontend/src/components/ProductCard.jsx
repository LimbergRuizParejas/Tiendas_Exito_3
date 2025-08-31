import React from 'react';
import './ProductCard.css'; // Archivo CSS para estilos específicos de la tarjeta de producto (opcional)

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.imagen} alt={product.nombre} className="product-image" />
      <h3>{product.nombre}</h3>
      <p>{product.descripcion}</p>
      <p><strong>Precio:</strong> ${product.precio}</p>
    </div>
  );
};

export default ProductCard;
