import React from 'react';

const ScannerInput = ({ onScan }) => {
  return (
    <input
      type="text"
      placeholder="Escanea el código de barras..."
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onScan(e.target.value);
          e.target.value = ''; // Limpiar el campo después de escanear
        }
      }}
      className="scanner-input"
    />
  );
};

export default ScannerInput;
