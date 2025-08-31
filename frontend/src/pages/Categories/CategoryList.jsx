import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, deleteCategory } from '../../pages/services/categoryService';
import './CategoryList.css';

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error al obtener las categorías:', err);
        setError('No se pudieron cargar las categorías.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter((category) => category.id !== id));
        alert('Categoría eliminada correctamente.');
      } catch (err) {
        console.error('Error al eliminar la categoría:', err);
        alert('Ocurrió un error al eliminar la categoría.');
      }
    }
  };

  return (
    <div className="category-management">
      <h1>Gestión de Categorías</h1>
      <div className="actions">
        <button onClick={() => navigate('/categories/create')} className="btn primary">
          Crear Categoría
        </button>
      </div>
      {loading ? (
        <p>Cargando categorías...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.nombre}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/categories/${category.id}/edit`)}
                      className="btn warning"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="btn danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-categories">
                  No hay categorías disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryList;
