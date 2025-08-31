import api from './api';

// Obtener todos los productos con sus relaciones
export const getProducts = async () => {
  try {
    const response = await api.get('/productos');
    // No se realiza ninguna conversión de precio
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error('No se pudo obtener la lista de productos.');
  }
};

// Obtener un producto específico por ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/productos/${id}`);
    // No se realiza ninguna conversión de precio
    return response.data;
  } catch (error) {
    console.error(`Error al obtener producto con ID ${id}:`, error);
    throw new Error('No se pudo obtener el producto.');
  }
};

// Crear un nuevo producto con relaciones
export const createProduct = async (product) => {
  try {
    const payload = {
      ...product,
      categoria: { id: product.categoriaId },
      marca: { id: product.marcaId },
    };
    const response = await api.post('/productos', payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error.response?.data || error.message);
    throw new Error('No se pudo crear el producto.');
  }
};

// Actualizar un producto existente
export const updateProduct = async (id, product) => {
  try {
    const payload = {
      ...product,
      categoria: { id: product.categoriaId },
      marca: { id: product.marcaId },
    };
    const response = await api.put(`/productos/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar producto con ID ${id}:`, error.response?.data || error.message);
    throw new Error('No se pudo actualizar el producto.');
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    await api.delete(`/productos/${id}`);
  } catch (error) {
    console.error(`Error al eliminar producto con ID ${id}:`, error.response?.data || error.message);
    throw new Error('No se pudo eliminar el producto.');
  }
};
