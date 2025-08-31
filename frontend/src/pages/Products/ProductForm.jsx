import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../../pages/services/productService';
import { getCategories } from '../../pages/services/categoryService';
import { getBrands } from '../../pages/services/brandService';
import './ProductForm.css';
const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    imagen: '',
    categoriaId: '',
    marcaId: '',
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, brandsData] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);

        if (id) {
          const productData = await getProductById(id);
          setProduct({
            ...productData,
            categoriaId: productData.categoria?.id || '',
            marcaId: productData.marca?.id || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('No se pudieron cargar los datos. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.nombre || !product.precio || !product.descripcion || !product.categoriaId || !product.marcaId) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    try {
      setSaving(true);
      if (id) {
        await updateProduct(id, product);
        alert('Producto actualizado correctamente.');
      } else {
        await createProduct(product);
        alert('Producto creado correctamente.');
      }
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error.response?.data || error.message);
      alert('Ocurrió un error al guardar el producto. Revisa los datos e inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  // Manejo del cambio en los campos del formulario
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h1>{id ? 'Editar Producto' : 'Crear Producto'}</h1>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          <input
            type="text"
            name="nombre"
            value={product.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
            disabled={saving}
          />
          <input
            type="number"
            name="precio"
            value={product.precio}
            onChange={handleChange}
            placeholder="Precio"
            required
            disabled={saving}
          />
          <textarea
            name="descripcion"
            value={product.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            required
            disabled={saving}
          />
          <input
            type="text"
            name="imagen"
            value={product.imagen}
            onChange={handleChange}
            placeholder="URL de la Imagen"
            required
            disabled={saving}
          />
          <select
            name="categoriaId"
            value={product.categoriaId}
            onChange={handleChange}
            required
            disabled={saving}
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <select
            name="marcaId"
            value={product.marcaId}
            onChange={handleChange}
            required
            disabled={saving}
          >
            <option value="">Seleccione una marca</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.nombre}
              </option>
            ))}
          </select>
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      )}
    </form>
  );
};

export default ProductForm;
