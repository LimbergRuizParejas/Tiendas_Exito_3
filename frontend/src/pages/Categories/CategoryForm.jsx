import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, updateCategory, getCategoryById } from '../services/categoryService';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '' });

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const data = await getCategoryById(id);
          setFormData({ nombre: data.nombre });
        } catch (error) {
          console.error('Error fetching category:', error);
          alert('Error al cargar la categoría.');
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateCategory(id, formData);
        alert('Categoría actualizada correctamente.');
      } else {
        await createCategory(formData);
        alert('Categoría creada correctamente.');
      }
      navigate('/categories');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al guardar la categoría.');
    }
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h1>{id ? 'Editar Categoría' : 'Crear Categoría'}</h1>
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">{id ? 'Actualizar' : 'Crear'} Categoría</button>
    </form>
  );
};

export default CategoryForm;
