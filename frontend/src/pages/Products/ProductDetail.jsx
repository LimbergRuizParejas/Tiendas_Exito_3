import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../pages/services/productService';
import './ProductStyles.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('No se pudo cargar el producto.');
      }
    };
    fetchProduct();
  }, [id]);

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-container">
      <h1>Detalle del Producto</h1>
      {product ? (
        <div className="product-detail">
          <p><strong>Nombre:</strong> {product.nombre}</p>
          <p><strong>Precio:</strong> {product.precio} Bs.</p>
          <p><strong>Descripción:</strong> {product.descripcion}</p>
          <p><strong>Categoría:</strong> {product.categoria?.nombre || 'Sin categoría'}</p>
          <p><strong>Marca:</strong> {product.marca?.nombre || 'Sin marca'}</p>
          {product.imagen && <img src={product.imagen} alt={product.nombre} />}
          <div className="button-group">
            <button onClick={() => navigate(`/products/${id}/edit`)} className="primary">
              Editar
            </button>
            <button onClick={() => navigate('/products')} className="secondary">
              Volver
            </button>
          </div>
        </div>
      ) : (
        <p>Cargando producto...</p>
      )}
    </div>
  );
};

export default ProductDetail;
