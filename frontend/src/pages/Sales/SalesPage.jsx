import React, { useState } from 'react';
import ScannerInput from './ScannerInput';
import SalesList from './SalesList';

const SalesPage = () => {
  const [sales, setSales] = useState([]);

  const handleScan = (barcode) => {
    // Lógica para buscar el producto en el backend y añadirlo a las ventas
    const newProduct = {
      id: barcode, // Ejemplo: Usar código como ID
      nombreProducto: 'Producto Escaneado', // Simular datos
      cantidad: 1,
      precio: 10.0,
      descuento: 0,
    };
    setSales([...sales, newProduct]);
  };

  return (
    <div className="sales-page">
      <h1>Área de Ventas</h1>
      <ScannerInput onScan={handleScan} />
      <SalesList sales={sales} />
    </div>
  );
};

export default SalesPage;
