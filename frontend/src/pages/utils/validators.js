// Validar si un campo está vacío
export const isEmpty = (value) => {
    return value.trim().length === 0;
  };
  
  // Validar precio como número positivo
  export const isValidPrice = (value) => {
    const number = parseFloat(value);
    return !isNaN(number) && number > 0;
  };
  
  // Validar URL de imagen
  export const isValidImageUrl = (url) => {
    const regex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/i;
    return regex.test(url);
  };
  