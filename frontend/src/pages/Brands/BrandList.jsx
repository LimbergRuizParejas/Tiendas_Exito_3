import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBrands, deleteBrand } from '../../pages/services/brandService';
import './BrandList.css';

const BrandList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Ocurrió un error al cargar las marcas.');
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta marca?')) {
      try {
        await deleteBrand(id);
        setBrands(brands.filter((brand) => brand.id !== id));
        alert('Marca eliminada correctamente.');
      } catch (err) {
        console.error('Error deleting brand:', err);
        alert('Ocurrió un error al eliminar la marca.');
      }
    }
  };

  return (
    <div className="brand-list">
      <h1>Gestión de Marcas</h1>
      <div className="actions">
        <button onClick={() => navigate('/brands/create')} className="btn primary">
          Crear Marca
        </button>
      </div>
      {loading ? (
        <p className="loading">Cargando marcas...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="brand-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {brands.length > 0 ? (
              brands.map((brand) => (
                <tr key={brand.id}>
                  <td>
                    {brand.imagen ? (
                      <img
                        src={brand.imagen}
                        alt={brand.nombre}
                        className="brand-logo"
                      />
                    ) : (
                      'Sin logo'
                    )}
                  </td>
                  <td>{brand.nombre}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => navigate(`/brands/${brand.id}/edit`)}
                      className="btn warning"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="btn danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-brands">
                  No hay marcas disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BrandList;
