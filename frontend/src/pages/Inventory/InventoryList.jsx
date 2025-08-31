// 📌 frontend/src/pages/Inventory/InventoryList.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getByBarcode,
} from '../services/inventoryService';
import { getCategories } from '../services/categoryService';
import { getBrands } from '../services/brandService';
import './InventoryList.css';

// Base para servir imágenes estáticas del backend (quita /api si existe)
const ASSET_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// Aplana un item que puede venir con relaciones { categoria: {id}, marca: {id} }
const toEditable = (item = {}) => ({
  ...item,
  categoriaId: item.categoriaId ?? item?.categoria?.id ?? '',
  marcaId: item.marcaId ?? item?.marca?.id ?? '',
  codigoBarras: item.codigoBarras ?? '',
  imagenFile: null,
});

const MAX_MB = 5;
const ACCEPTED_MIME = /image\/(png|jpe?g|webp|gif)$/i;

const InventoryList = () => {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [summary, setSummary] = useState({ totalProducts: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);

  const [newItem, setNewItem] = useState({
    nombreProducto: '',
    cantidad: '',
    precio: '',
    categoriaId: '',
    marcaId: '',
    codigoBarras: '',       // ← NUEVO
    fechaCaducidad: '',     // YYYY-MM-DD (opcional)
    imagenFile: null,
  });

  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Escaneo/búsqueda rápida por código de barras
  const [scanCode, setScanCode] = useState('');
  const [highlightId, setHighlightId] = useState(null);

  // refs para limpiar inputs file
  const createFileRef = useRef(null);
  const editFileRef = useRef(null);

  // Mapa id->nombre para resolver nombres en O(1)
  const catMap = useMemo(
    () => Object.fromEntries((categories || []).map((c) => [String(c.id), c.nombre])),
    [categories]
  );
  const brandMap = useMemo(
    () => Object.fromEntries((brands || []).map((b) => [String(b.id), b.nombre])),
    [brands]
  );

  // Recalcula el resumen a partir de un arreglo de inventario
  const recalcSummary = useCallback((items) => {
    const totalProducts = items.reduce((sum, it) => sum + safeNum(it.cantidad), 0);
    const totalValue = items.reduce(
      (sum, it) => sum + safeNum(it.cantidad) * safeNum(it.precio),
      0
    );
    setSummary({ totalProducts, totalValue });
  }, []);

  // Carga todo
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [inventoryData, categoryData, brandData] = await Promise.all([
        getInventory(),
        getCategories(),
        getBrands(),
      ]);
      setInventory(inventoryData);
      recalcSummary(inventoryData);
      setCategories(categoryData);
      setBrands(brandData);
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      alert(error?.message || 'Error al cargar datos.');
    } finally {
      setLoading(false);
    }
  }, [recalcSummary]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /* =========================
     Manejadores del formulario
  ========================== */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewItem((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateAndSetFile = (file, setState) => {
    if (!file) {
      setState((prev) => ({ ...prev, imagenFile: null, imagen: null }));
      return;
    }
    if (!ACCEPTED_MIME.test(file.type)) {
      alert('El archivo debe ser una imagen (png, jpg, jpeg, webp o gif).');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`La imagen no puede superar ${MAX_MB}MB.`);
      return;
    }
    setState((prev) => ({ ...prev, imagenFile: file, imagen: file }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (editingItem) {
      validateAndSetFile(file, setEditingItem);
    } else {
      validateAndSetFile(file, setNewItem);
    }
  };

  const resetCreateForm = () => {
    setNewItem({
      nombreProducto: '',
      cantidad: '',
      precio: '',
      categoriaId: '',
      marcaId: '',
      codigoBarras: '',
      fechaCaducidad: '',
      imagenFile: null,
    });
    if (createFileRef.current) createFileRef.current.value = '';
  };

  const cancelEdit = () => {
    setEditingItem(null);
    if (editFileRef.current) editFileRef.current.value = '';
  };

  /* =========================
     CRUD
  ========================== */

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await addInventoryItem(newItem); // el servicio arma FormData + valida
      resetCreateForm();
      await loadAll();
      alert('✅ Producto agregado con éxito');
    } catch (error) {
      console.error('Error al agregar producto:', error);
      alert(error?.message || 'Error al agregar el producto.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      setSaving(true);
      await updateInventoryItem(editingItem.id, editingItem);
      cancelEdit();
      await loadAll();
      alert('✅ Producto actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert(error?.message || 'Error al actualizar el producto.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('¿Deseas eliminar este producto?')) return;
    try {
      setDeletingId(id);
      await deleteInventoryItem(id);
      await loadAll();
      alert('🗑️ Producto eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert(error?.message || 'Error al eliminar el producto.');
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================
     Scan / Búsqueda por código
  ========================== */

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    const code = String(scanCode || '').trim();
    if (!code) return;
    try {
      const item = await getByBarcode(code);
      if (!item) {
        alert('No se encontró un producto con ese código de barras.');
        return;
      }
      // Resalta fila y abre edición directa
      setHighlightId(item.id);
      setTimeout(() => setHighlightId(null), 1500);
      setEditingItem(toEditable(item));
      setShowForm(true);
    } catch (err) {
      console.error('Scan error:', err);
      alert(err?.message || 'Error buscando por código de barras.');
    } finally {
      setScanCode('');
    }
  };

  /* =========================
     Filtros y derivados
  ========================== */

  const filteredInventory = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    return inventory.filter((item) => {
      const byName = (item?.nombreProducto || '').toLowerCase().includes(q);
      const byBarcode = (item?.codigoBarras || '').toLowerCase().includes(q);
      const matchesSearch = q === '' ? true : (byName || byBarcode);
      const matchesCategory =
        selectedCategory === '' || String(item.categoriaId) === String(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchQuery, selectedCategory]);

  return (
    <div className="inventory">
      <div className="header">
        <h1>Gestión de Inventario</h1>
        <button className="catalog-btn" onClick={() => navigate('/catalog')}>
          Ir al Inicio
        </button>
      </div>

      {loading ? (
        <p className="loading">Cargando...</p>
      ) : (
        <>
          <div className="inventory-summary">
            <h2>Resumen del Inventario</h2>
            <p>Total de Productos: {summary.totalProducts}</p>
            <p>Valor Total: {Number(summary.totalValue || 0).toFixed(2)} Bs</p>
          </div>

          <div className="category-bar">
            <input
              type="text"
              className="search-bar"
              placeholder="Buscar por nombre o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar productos"
            />
            <select
              className="category-dropdown"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filtrar por categoría"
            >
              <option value="">Todas las Categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.nombre}
                </option>
              ))}
            </select>

            {/* Barra de escaneo/código rápido */}
            <form className="scan-form" onSubmit={handleScanSubmit}>
              <input
                type="text"
                className="scan-input"
                placeholder="Escanear/pegar código de barras…"
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
                inputMode="numeric"
                aria-label="Escanear código de barras"
              />
              <button className="scan-btn" type="submit">Buscar</button>
            </form>
          </div>

          <button
            className="toggle-form-btn"
            onClick={() => setShowForm((s) => !s)}
          >
            {showForm ? 'Ocultar Formulario' : 'Agregar/Editar Producto'}
          </button>

          {showForm && (
            <form
              onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              className="inventory-form"
            >
              <h3>{editingItem ? 'Editar Producto' : 'Agregar Producto'}</h3>

              <label>
                <span>Nombre del Producto</span>
                <input
                  type="text"
                  name="nombreProducto"
                  placeholder="Ej. Arroz 1kg"
                  value={editingItem ? editingItem.nombreProducto ?? '' : newItem.nombreProducto}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                <span>Código de Barras (opcional)</span>
                <input
                  type="text"
                  name="codigoBarras"
                  placeholder="Solo dígitos (3–64)"
                  value={editingItem ? (editingItem.codigoBarras ?? '') : newItem.codigoBarras}
                  onChange={handleInputChange}
                  pattern="\d{3,64}"
                  title="Solo dígitos, entre 3 y 64 caracteres"
                  inputMode="numeric"
                />
              </label>

              <label>
                <span>Cantidad</span>
                <input
                  type="number"
                  name="cantidad"
                  placeholder="0"
                  value={editingItem ? (editingItem.cantidad ?? '') : newItem.cantidad}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  required
                />
              </label>

              <label>
                <span>Precio</span>
                <input
                  type="number"
                  name="precio"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={editingItem ? (editingItem.precio ?? '') : newItem.precio}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                <span>Categoría</span>
                <select
                  name="categoriaId"
                  value={
                    editingItem
                      ? (editingItem.categoriaId ?? editingItem?.categoria?.id ?? '')
                      : newItem.categoriaId
                  }
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar Categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Marca</span>
                <select
                  name="marcaId"
                  value={
                    editingItem
                      ? (editingItem.marcaId ?? editingItem?.marca?.id ?? '')
                      : newItem.marcaId
                  }
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar Marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={String(brand.id)}>
                      {brand.nombre}
                    </option>
                  ))}
                </select>
              </label>

              {/* Fecha de caducidad (opcional) */}
              <label>
                <span>Fecha de Caducidad (opcional)</span>
                <input
                  type="date"
                  name="fechaCaducidad"
                  placeholder="YYYY-MM-DD"
                  value={editingItem ? (editingItem.fechaCaducidad ?? '') : newItem.fechaCaducidad}
                  onChange={handleInputChange}
                />
              </label>

              {/* Imagen (upload) */}
              <div className="file-row">
                <label>
                  <span>Imagen (opcional)</span>
                  <input
                    ref={editingItem ? editFileRef : createFileRef}
                    type="file"
                    name="imagen"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChange}
                  />
                </label>

                <div className="image-preview">
                  {editingItem ? (
                    editingItem.imagenFile ? (
                      <img
                        alt="preview"
                        src={URL.createObjectURL(editingItem.imagenFile)}
                        onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                      />
                    ) : editingItem.imagenPath ? (
                      <img
                        alt="actual"
                        src={`${ASSET_BASE}${editingItem.imagenPath}`}
                      />
                    ) : null
                  ) : newItem.imagenFile ? (
                    <img
                      alt="preview"
                      src={URL.createObjectURL(newItem.imagenFile)}
                      onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                    />
                  ) : null}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="add-btn" disabled={saving}>
                  {saving
                    ? (editingItem ? 'Actualizando…' : 'Agregando…')
                    : (editingItem ? 'Actualizar Producto' : 'Agregar Producto')}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={cancelEdit}
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}

          <table className="inventory-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Código</th>{/* ← NUEVO */}
                <th>Stock</th>
                <th>Precio (Bs)</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Caducidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => {
                const price = Number(item.precio || 0);
                const catName =
                  catMap[String(item.categoriaId)] ||
                  item?.categoria?.nombre ||
                  '—';
                const brandName =
                  brandMap[String(item.marcaId)] ||
                  item?.marca?.nombre ||
                  '—';

                const rowClass =
                  highlightId === item.id ? 'highlight-row' : '';

                return (
                  <tr key={item.id} className={rowClass}>
                    <td>{item.id}</td>
                    <td className="cell-image">
                      {item.imagenPath ? (
                        <img
                          alt={item.nombreProducto}
                          src={`${ASSET_BASE}${item.imagenPath}`}
                        />
                      ) : (
                        <span className="no-image">—</span>
                      )}
                    </td>
                    <td>{item.nombreProducto}</td>
                    <td>{item.codigoBarras || '—'}</td>
                    <td>{safeNum(item.cantidad)}</td>
                    <td>{price.toFixed(2)}</td>
                    <td>{catName}</td>
                    <td>{brandName}</td>
                    <td>{item.fechaCaducidad || '—'}</td>
                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditingItem(toEditable(item));
                          setShowForm(true);
                        }}
                        disabled={saving}
                      >
                        Editar
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={deletingId === item.id || saving}
                      >
                        {deletingId === item.id ? 'Eliminando…' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '1rem' }}>
                    No hay resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default InventoryList;
