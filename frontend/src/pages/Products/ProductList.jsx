import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../pages/services/productService';
import './ProductList.css'; // Asegúrate de que la ruta sea correcta

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Ocurrió un error al cargar los productos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((product) => product.id !== id));
        alert('Producto eliminado correctamente.');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Ocurrió un error al eliminar el producto.');
      }
    }
  };

  const formatToBolivianos = (price) => {
    return `${price} Bs`; // No hacemos ninguna conversión, solo agregamos "Bs"
  };

  if (loading) return <p className="loading">Cargando productos...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-panel">
      <h1>Panel Administrativo</h1>
      <div className="actions">
        <button onClick={() => navigate('/catalog')} className="btn secondary">
          Ver Catálogo
        </button>
        <button onClick={() => navigate('/products/create')} className="btn primary">
          Crear Producto
        </button>
      </div>
      <table className="product-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.nombre}</td>
                <td>{formatToBolivianos(product.precio)}</td>
                <td>{product.categoria?.nombre || 'Sin categoría'}</td>
                <td>{product.marca?.nombre || 'Sin marca'}</td>
                <td className="actions-cell">
                  <button onClick={() => navigate(`/products/${product.id}`)} className="btn info">
                    Ver
                  </button>
                  <button onClick={() => navigate(`/products/${product.id}/edit`)} className="btn warning">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="btn danger">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-products">
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
