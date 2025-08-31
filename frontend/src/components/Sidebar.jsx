import React from 'react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/products">Productos</a></li>
        <li><a href="/categories">Categorías</a></li>
        <li><a href="/brands">Marcas</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
