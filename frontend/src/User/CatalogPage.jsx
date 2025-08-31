import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInventory } from '../pages/services/inventoryService';
import { getCategories } from '../pages/services/categoryService';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import HomeCarousel from '../components/HomeCarousel';
import './CatalogPage.css';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Cargar inventario y categorías
    const fetchData = async () => {
      try {
        const [inventoryData, categoriesData] = await Promise.all([
          getInventory(),
          getCategories().catch(() => []),
        ]);
        setProducts(inventoryData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('❌ Error al cargar datos:', err);
        alert('No se pudo cargar el catálogo.');
      }
    };
    fetchData();

    // ✅ Obtener usuario logueado desde localStorage
    const storedUser =
      localStorage.getItem('userEmail') || localStorage.getItem('adminUser');

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed.nombre || parsed.email || storedUser);
      } catch {
        setUser(storedUser);
      }
    }
  }, []);

  const handleLogout = () => {
    // ✅ Limpiar todo el localStorage relacionado al login
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');

    setUser(null);

    // ✅ Redirigir al catálogo público
    navigate('/user/catalog', { replace: true });
  };

  // ✅ Filtrar productos por búsqueda + categoría
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nombreProducto?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === '' ||
      parseInt(p.categoriaId, 10) === parseInt(selectedCategory, 10);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="catalog-page">
      {/* 🟢 Barra de usuario */}
      <div
        className="user-bar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '10px 15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd',
          borderRadius: '6px',
        }}
      >
        {user ? (
          <>
            <span style={{ fontWeight: 'bold', color: '#c3002f' }}>
              👋 Bienvenido, {user}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 15px',
                backgroundColor: '#c3002f',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#555' }}>⚠️ No has iniciado sesión</span>
            <button
              onClick={() => navigate('/user/login')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate('/user/register')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Registrarse
            </button>
          </div>
        )}
      </div>

      {/* 🔍 Buscador + filtros */}
      <div className="filters top-filters">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar productos..."
        />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* 🎠 Carrusel */}
      <div className="carousel-wrapper">
        <HomeCarousel />
      </div>

      {/* 📦 Lista de productos */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div key={item.id} className="product-card">
              <Link to={`/user/product/${item.id}`}>
                <img
                  src={item.imagen}
                  alt={item.nombreProducto}
                  style={{ maxHeight: '150px', objectFit: 'contain' }}
                />
                <h3>{item.nombreProducto}</h3>
              </Link>
              <p>💲 Precio: {parseFloat(item.precio).toFixed(2)} Bs</p>
              <p>📦 Stock: {item.cantidad}</p>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No hay productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
