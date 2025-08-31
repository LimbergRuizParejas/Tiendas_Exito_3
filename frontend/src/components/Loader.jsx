import React from 'react';
import './Loader.css'; // Archivo CSS para estilos específicos del loader (opcional)

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  );
};

export default Loader;
