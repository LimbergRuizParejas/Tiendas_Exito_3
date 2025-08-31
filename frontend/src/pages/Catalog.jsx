// 📂 frontend/src/pages/Catalog.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getProducts } from './services/productService';
import '../components/Catalog.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PER_PAGE = {
  flyer: 18,    // 3 héroes izq + 15 mosaico der
  grouped: 24,  // aprox. 4x6 cards (ajústalo si quieres)
};

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('flyer'); // 'flyer' | 'grouped'
  const [page, setPage] = useState(1);

  // ==============================
  // 🔹 Cargar productos
  // ==============================
  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        alert('No se pudo cargar el catálogo.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Resetear a página 1 si cambia vista o cambia el listado
  useEffect(() => { setPage(1); }, [viewMode, products.length]);

  // ==============================
  // 🔹 Helpers
  // ==============================
  const priceParts = (n) => {
    const [int, dec = '00'] = Number(n ?? 0).toFixed(2).split('.');
    return { int, dec };
  };

  const paginate = (arr, size) => {
    const pages = [];
    for (let i = 0; i < arr.length; i += size) pages.push(arr.slice(i, i + size));
    return pages;
  };

  const unitFor = (p) => p?.unidad || p?.unidadMedida || '/unidad';

  // Fechas vigencia (semana actual)
  const today = new Date();
  const start = new Date(today); start.setDate(today.getDate() - today.getDay());
  const end = new Date(start);  end.setDate(start.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString();

  // Orden estable: por categoría, marca, nombre (para que la paginación sea coherente)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const ac = a?.categoria?.nombre || 'Sin Categoría';
      const bc = b?.categoria?.nombre || 'Sin Categoría';
      if (ac !== bc) return ac.localeCompare(bc);
      const am = a?.marca?.nombre || 'Sin Marca';
      const bm = b?.marca?.nombre || 'Sin Marca';
      if (am !== bm) return am.localeCompare(bm);
      const an = a?.nombre || '';
      const bn = b?.nombre || '';
      return an.localeCompare(bn);
    });
  }, [products]);

  // Total de páginas según vista
  const perPage = PER_PAGE[viewMode];
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / perPage));

  // Productos para página actual
  const startIdx = (page - 1) * perPage;
  const endIdx = startIdx + perPage;
  const pageItems = sortedProducts.slice(startIdx, endIdx);

  // Agrupado solo con items de esta página (para vista grouped)
  const groupedProducts = useMemo(() => {
    return pageItems.reduce((acc, product) => {
      const category = product?.categoria?.nombre || 'Sin Categoría';
      const brand = product?.marca?.nombre || 'Sin Marca';
      if (!acc[category]) acc[category] = {};
      if (!acc[category][brand]) acc[category][brand] = [];
      acc[category][brand].push(product);
      return acc;
    }, {});
  }, [pageItems]);

  // ==============================
  // 🔹 Exportaciones
  // ==============================
  const downloadAsPDF = async () => {
    const element = document.getElementById('catalog');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      scrollX: 0,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    pdf.save('catalogo.pdf');
  };

  const downloadAsImage = async () => {
    const element = document.getElementById('catalog');
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      scrollX: 0,
      scrollY: -window.scrollY,
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.download = 'catalogo.jpg';
    link.click();
  };

  const downloadAsWord = () => {
    const element = document.getElementById('catalog');
    const catalogContent = element.outerHTML;
    const styles = `
      <style>
        body{font-family:Segoe UI, Arial, sans-serif}
        img{max-width:100%}
      </style>`;
    const sourceHTML =
      `<html xmlns:o="urn:schemas-microsoft-com:office:office" ` +
      `xmlns:w="urn:schemas-microsoft-com:office:word" ` +
      `xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Catálogo</title>${styles}</head><body>` +
      catalogContent +
      `</body></html>`;

    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'catalogo.doc';
    link.click();
  };

  // ==============================
  // 🔹 UI Paginación
  // ==============================
  const goTo = (n) => {
    const target = Math.min(Math.max(1, n), totalPages);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageList = (total, current) => {
    // Muestra 1 … (c-2) (c-1) c (c+1) (c+2) … total
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
    const arr = [...pages].filter(n => n >= 1 && n <= total).sort((a, b) => a - b);
    // Inserta '…'
    const withDots = [];
    for (let i = 0; i < arr.length; i++) {
      withDots.push(arr[i]);
      if (i < arr.length - 1 && arr[i + 1] - arr[i] > 1) withDots.push('…');
    }
    return withDots;
  };

  const Pager = () => (
    <div className="actions" style={{ gap: 8, flexWrap: 'wrap' }}>
      <button className="btn ghost" onClick={() => goTo(page - 1)} disabled={page === 1}>
        ⟨ Anterior
      </button>
      {getPageList(totalPages, page).map((p, idx) =>
        p === '…' ? (
          <span key={`dot-${idx}`} style={{ padding: '10px 8px', color: '#888' }}>…</span>
        ) : (
          <button
            key={p}
            className="btn ghost"
            onClick={() => goTo(p)}
            aria-current={p === page ? 'page' : undefined}
            style={p === page ? { background: '#d32f2f', color: '#fff' } : {}}
            title={`Página ${p}`}
          >
            {p}
          </button>
        )
      )}
      <button className="btn ghost" onClick={() => goTo(page + 1)} disabled={page === totalPages}>
        Siguiente ⟩
      </button>
    </div>
  );

  // ==============================
  // 🔹 Render
  // ==============================
  return (
    <div id="catalog" className="catalog">
      <h1>Catálogo de Ofertas</h1>

      {/* Selector de vista */}
      <div className="filters" style={{ marginTop: -6 }}>
        <label style={{ fontWeight: 700, color: '#444' }}>Vista:</label>
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          aria-label="Cambiar vista"
        >
          <option value="flyer">Folleto (promos estilo supermercado)</option>
          <option value="grouped">Catálogo agrupado (Categoría → Marca)</option>
        </select>
      </div>

      {/* Paginador arriba (opcional) */}
      {(!loading && totalPages > 1) && <Pager />}

      {loading ? (
        <p className="loading">⏳ Cargando catálogo…</p>
      ) : viewMode === 'flyer' ? (
        // =========================
        // VISTA FOLLETO (solo página actual)
        // =========================
        (() => {
          const pageProducts = pageItems;                 // productos de esta página
          const heroes = pageProducts.slice(0, 3);
          const grid = pageProducts.slice(3);

          return (
            <div className="flyer">
              <section className="flyer-page">
                <div className="page-badge">Caduca el {fmt(end)}</div>

                <div className="flyer-columns">
                  {/* Izquierda: Héroes */}
                  <div className="flyer-col-left">
                    <div className="left-hero">
                      {heroes.map((p, i) => {
                        const { int, dec } = priceParts(p.precio);
                        return (
                          <article className="hero" key={p.id ?? `h-${page}-${i}`}>
                            <div className="pic">
                              {p?.imagen ? (
                                <img
                                  src={p.imagen}
                                  alt={p.nombre}
                                  loading="lazy"
                                  crossOrigin="anonymous"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      'data:image/svg+xml;utf8,' +
                                      encodeURIComponent(
                                        `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="190"><rect width="100%" height="100%" fill="#fafafa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="14">Sin imagen</text></svg>`
                                      );
                                  }}
                                />
                              ) : null}
                            </div>

                            <div className="info">
                              <div className="sticker">
                                <div className="n">
                                  <span className="int">{int}</span>
                                  <span className="dec">.{dec}</span>
                                  <span className="cur"> Bs</span>
                                </div>
                                <span className="unit">{unitFor(p)}</span>
                              </div>

                              <div className="title">{p?.nombre ?? 'Producto'}</div>
                              {p?.descripcion && <div className="note">{p.descripcion}</div>}
                              {p?.promo && <div className="ribbon">{p.promo}</div>}
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    <div className="flyer-footer">
                      Oferta válida del {fmt(start)} al {fmt(end)}
                    </div>
                  </div>

                  {/* Derecha: Mosaico */}
                  <div className="flyer-col-right">
                    {grid.map((p, i) => {
                      const { int, dec } = priceParts(p.precio);
                      return (
                        <article className="card" key={p.id ?? `g-${page}-${i}`}>
                          <div className="pic">
                            {p?.imagen ? (
                              <img
                                src={p.imagen}
                                alt={p.nombre}
                                loading="lazy"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    'data:image/svg+xml;utf8,' +
                                    encodeURIComponent(
                                      `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="140"><rect width="100%" height="100%" fill="#fafafa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="12">Sin imagen</text></svg>`
                                    );
                                }}
                              />
                            ) : null}
                          </div>

                          <div className="name">{p?.nombre ?? 'Producto'}</div>

                          <div className="badge" style={{ right: 8, left: 'auto' }}>
                            <div className="n">
                              <span className="int">{int}</span>
                              <span className="dec">.{dec}</span>
                              <span className="cur"> Bs</span>
                            </div>
                            <span className="unit">{unitFor(p)}</span>
                          </div>

                          {p?.descuento && <div className="ribbon">-{p.descuento}%</div>}
                        </article>
                      );
                    })}
                  </div>
                </div>

                <div className="flyer-footer">Página {page} de {totalPages}</div>
              </section>
            </div>
          );
        })()
      ) : (
        // =========================
        // VISTA AGRUPADA (solo items de esta página)
        // =========================
        Object.entries(groupedProducts).map(([category, brands]) => (
          <div key={category} className="category">
            <h2>📂 {category}</h2>
            {Object.entries(brands).map(([brand, items]) => (
              <div key={brand} className="brand">
                <h3>🏷️ {brand}</h3>
                <ul className="product-list">
                  {items.map((product) => {
                    const price = Number(product?.precio ?? 0);
                    return (
                      <li key={product?.id ?? product?.nombre} className="product-item">
                        {product?.imagen && (
                          <img
                            src={product.imagen}
                            alt={`Imagen de ${product.nombre}`}
                            className="product-image"
                            loading="lazy"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              e.currentTarget.src =
                                'data:image/svg+xml;utf8,' +
                                encodeURIComponent(
                                  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="200"><rect width="100%" height="100%" fill="#fafafa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="12">Sin imagen</text></svg>`
                                );
                            }}
                          />
                        )}

                        <strong>{product?.nombre ?? 'Producto'}</strong>
                        <p className="price">{isNaN(price) ? 'N/D' : price.toFixed(2)} Bs</p>
                        {product?.descripcion && <p>{product.descripcion}</p>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Paginador abajo */}
      {(!loading && totalPages > 1) && <Pager />}

      {/* Botones de descarga */}
      <div className="actions">
        <button onClick={downloadAsPDF} className="btn" aria-label="Descargar catálogo en PDF">
          📄 Descargar PDF
        </button>
        <button onClick={downloadAsImage} className="btn secondary" aria-label="Descargar catálogo como Imagen">
          🖼️ Descargar Imagen
        </button>
        <button onClick={downloadAsWord} className="btn ghost" aria-label="Descargar catálogo en Word">
          📝 Descargar Word
        </button>
      </div>

      {/* Footer */}
      <footer className="catalog-footer">
        <p>© {new Date().getFullYear()} Tiendas Éxito — Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Catalog;
