import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelect }) => (
  <select
    value={selectedCategory}
    onChange={(e) => onSelect(e.target.value)}
    className="category-filter"
  >
    <option value="">Todas las Categorías</option>
    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.nombre}
      </option>
    ))}
  </select>
);

export default CategoryFilter;
