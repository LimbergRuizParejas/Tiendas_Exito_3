// Función para formatear precios
export const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP',
    }).format(price);
  };
  
  // Función para manejar errores
  export const handleApiError = (error) => {
    console.error('API Error:', error);
    return error.response?.data?.message || 'Ocurrió un error inesperado.';
  };
  