import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBrand, updateBrand, getBrandById } from '../../pages/services/brandService';
import './BrandForm.css';

const BrandForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', imagen: '' });

  useEffect(() => {
    if (id) {
      const fetchBrand = async () => {
        try {
          const data = await getBrandById(id);
          setFormData({ nombre: data.nombre, imagen: data.imagen });
        } catch (error) {
          console.error('Error fetching brand:', error);
          alert('Error al cargar la marca.');
        }
      };
      fetchBrand();
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
        await updateBrand(id, formData);
        alert('Marca actualizada correctamente.');
      } else {
        await createBrand(formData);
        alert('Marca creada correctamente.');
      }
      navigate('/brands');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al guardar la marca.');
    }
  };

  return (
    <form className="brand-form" onSubmit={handleSubmit}>
      <h2>{id ? 'Editar Marca' : 'Crear Marca'}</h2>
      <div className="form-group">
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
      <div className="form-group">
        <label htmlFor="imagen">URL del Logo:</label>
        <input
          type="text"
          id="imagen"
          name="imagen"
          value={formData.imagen}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn primary">
        {id ? 'Actualizar' : 'Crear'} Marca
      </button>
    </form>
  );
};

export default BrandForm;
