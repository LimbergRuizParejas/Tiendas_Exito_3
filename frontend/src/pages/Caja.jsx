// 📌 src/pages/Caja.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  listCaja,          // ⬅️ antes usabas getCaja
  createCaja,
  updateCaja,
  deleteCaja,
  getCajaResumen,     // opcional si luego quieres usarlo
  exportCajaCsv,      // exportar CSV desde el service
} from "./services/cajaService";

const TIPOS_PAGO = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
  { value: "transferencia", label: "Transferencia" },
  { value: "otro", label: "Otro" },
];

// Utils
const toNumber = (v) => (v == null || v === "" ? 0 : Number(v));
const fmtMoney = (n) => Number(n || 0).toFixed(2);
const capitalize = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

const Caja = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form alta/edición
  const [form, setForm] = useState({
    personaACargo: "",
    motivo: "",
    monto: "",
    total: "",
    tipoPago: "efectivo", // guardar en minúsculas
    categoriaId: "",
  });

  // Filtros + paginación (cliente)
  const [filters, setFilters] = useState({
    personaACargo: "",
    tipoPago: "",
    desde: "",
    hasta: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // 🔄 Cargar registros
  const fetchRegistros = async () => {
    setLoading(true);
    try {
      // Soporta tanto array como objeto paginado { items, total, ... }
      const res = await listCaja();
      const arr = Array.isArray(res) ? res : (res?.items ?? []);
      const mapped = (arr || []).map((r) => ({
        ...r,
        monto: toNumber(r.monto),
        total: toNumber(r.total),
      }));
      setRegistros(mapped);
    } catch (err) {
      console.error("❌ Error al cargar registros:", err);
      alert("No se pudieron cargar los registros de caja");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  // 🧮 Filtros en cliente
  const filtered = useMemo(() => {
    return registros.filter((r) => {
      if (
        filters.personaACargo &&
        !String(r.personaACargo || "")
          .toLowerCase()
          .includes(filters.personaACargo.toLowerCase())
      ) {
        return false;
      }
      if (filters.tipoPago && String(r.tipoPago) !== filters.tipoPago) {
        return false;
      }
      if (filters.desde) {
        const d = new Date(filters.desde + "T00:00:00");
        const fe = r.fechaEntrada ? new Date(r.fechaEntrada) : r.creadoEn ? new Date(r.creadoEn) : null;
        if (fe && fe < d) return false;
      }
      if (filters.hasta) {
        const h = new Date(filters.hasta + "T23:59:59");
        const fe = r.fechaEntrada ? new Date(r.fechaEntrada) : r.creadoEn ? new Date(r.creadoEn) : null;
        if (fe && fe > h) return false;
      }
      return true;
    });
  }, [registros, filters]);

  // 📄 Paginación en cliente
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, currentPage, limit]);

  // Totales
  const totalGlobal = useMemo(
    () => filtered.reduce((acc, r) => acc + toNumber(r.monto), 0),
    [filtered]
  );
  const totalPagina = useMemo(
    () => pageItems.reduce((acc, r) => acc + toNumber(r.monto), 0),
    [pageItems]
  );

  // 📝 Crear/Actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.personaACargo.trim()) {
      alert("La persona a cargo es obligatoria.");
      return;
    }
    if (form.monto === "" || isNaN(Number(form.monto))) {
      alert("El monto es obligatorio y debe ser numérico.");
      return;
    }
    const payload = {
      personaACargo: form.personaACargo.trim(),
      motivo: form.motivo.trim(),
      monto: toNumber(form.monto),
      total:
        form.total === "" || isNaN(Number(form.total))
          ? toNumber(form.monto)
          : toNumber(form.total),
      tipoPago: String(form.tipoPago || "efectivo").toLowerCase(),
      ...(form.categoriaId ? { categoriaId: Number(form.categoriaId) } : {}),
    };

    try {
      if (editId) {
        await updateCaja(editId, payload);
        setEditId(null);
      } else {
        await createCaja(payload);
      }
      setForm({
        personaACargo: "",
        motivo: "",
        monto: "",
        total: "",
        tipoPago: "efectivo",
        categoriaId: "",
      });
      fetchRegistros();
    } catch (err) {
      console.error("❌ Error al guardar registro:", err);
      alert("Error al guardar el registro de caja");
    }
  };

  // 🗑️ Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ ¿Seguro que deseas eliminar este registro?")) return;
    try {
      await deleteCaja(id);
      fetchRegistros();
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      alert("Error al eliminar el registro de caja");
    }
  };

  // ✏️ Editar
  const handleEdit = (r) => {
    setForm({
      personaACargo: r.personaACargo ?? "",
      motivo: r.motivo ?? "",
      monto: r.monto ?? "",
      total: r.total ?? "",
      tipoPago: String(r.tipoPago || "efectivo").toLowerCase(),
      categoriaId: r.categoriaId ?? "",
    });
    setEditId(r.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔍 Aplicar filtros
  const applyFilters = (e) => {
    e?.preventDefault?.();
    setPage(1);
  };

  // ⬇️ Exportar CSV (registros filtrados)
  const exportarCsv = () => {
    exportCajaCsv(filtered, "caja.csv");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#c3002f", marginBottom: "16px" }}>📊 Gestión de Caja</h2>

      {/* 🧮 Resumen rápido */}
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            padding: 12,
            border: "1px solid #eee",
            borderRadius: 8,
            minWidth: 220,
          }}
        >
          <div style={{ fontSize: 12, color: "#666" }}>Total (filtro actual)</div>
          <div style={{ fontSize: 20, fontWeight: "bold" }}>{fmtMoney(totalGlobal)} Bs</div>
        </div>
        <div
          style={{
            padding: 12,
            border: "1px solid #eee",
            borderRadius: 8,
            minWidth: 220,
          }}
        >
          <div style={{ fontSize: 12, color: "#666" }}>Total de la página</div>
          <div style={{ fontSize: 20, fontWeight: "bold" }}>{fmtMoney(totalPagina)} Bs</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={exportarCsv}
            style={{
              background: "#198754",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ⬇️ Exportar CSV
          </button>
          <button
            onClick={fetchRegistros}
            style={{
              background: "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            🔄 Recargar
          </button>
        </div>
      </div>

      {/* 🔍 Filtros */}
      <form
        onSubmit={applyFilters}
        style={{
          marginBottom: 16,
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        <input
          type="text"
          placeholder="Persona"
          value={filters.personaACargo}
          onChange={(e) =>
            setFilters((f) => ({ ...f, personaACargo: e.target.value }))
          }
        />
        <select
          value={filters.tipoPago}
          onChange={(e) =>
            setFilters((f) => ({ ...f, tipoPago: e.target.value }))
          }
        >
          <option value="">(Todos)</option>
          {TIPOS_PAGO.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.desde}
          onChange={(e) => setFilters((f) => ({ ...f, desde: e.target.value }))}
        />
        <input
          type="date"
          value={filters.hasta}
          onChange={(e) => setFilters((f) => ({ ...f, hasta: e.target.value }))}
        />
        <button
          type="submit"
          style={{
            background: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={() => {
            setFilters({ personaACargo: "", tipoPago: "", desde: "", hasta: "" });
            setPage(1);
          }}
          style={{
            border: "1px solid #ced4da",
            background: "#fff",
            borderRadius: 6,
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Limpiar
        </button>
      </form>

      {/* 📝 Formulario crear/editar */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 20,
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(180px, 1fr))",
          gap: 12,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Persona a cargo"
          value={form.personaACargo}
          onChange={(e) => setForm({ ...form, personaACargo: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Motivo (opcional)"
          value={form.motivo}
          onChange={(e) => setForm({ ...form, motivo: e.target.value })}
        />
        <input
          type="number"
          placeholder="Monto"
          step="0.01"
          value={form.monto}
          onChange={(e) => {
            const monto = e.target.value;
            setForm((f) => ({
              ...f,
              monto,
              total: f.total === "" ? monto : f.total,
            }));
          }}
          required
        />
        <input
          type="number"
          placeholder="Total (opcional)"
          step="0.01"
          value={form.total}
          onChange={(e) => setForm({ ...form, total: e.target.value })}
        />
        <select
          value={form.tipoPago}
          onChange={(e) =>
            setForm({ ...form, tipoPago: e.target.value.toLowerCase() })
          }
        >
          {TIPOS_PAGO.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          style={{
            background: editId ? "#0d6efd" : "#28a745",
            color: "#fff",
            padding: "10px 14px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {editId ? "Actualizar" : "Registrar"}
        </button>
      </form>

      {/* 📋 Tabla */}
      {loading ? (
        <p>Cargando registros...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            width="100%"
            style={{ borderCollapse: "collapse", textAlign: "center" }}
          >
            <thead style={{ background: "#f1f1f1" }}>
              <tr>
                <th>ID</th>
                <th>Persona a Cargo</th>
                <th>Motivo</th>
                <th>Monto</th>
                <th>Total</th>
                <th>Tipo Pago</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length > 0 ? (
                pageItems.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.personaACargo}</td>
                    <td>{r.motivo}</td>
                    <td>{fmtMoney(r.monto)} Bs</td>
                    <td>{fmtMoney(r.total)} Bs</td>
                    <td>{capitalize(String(r.tipoPago))}</td>
                    <td>
                      {r.creadoEn
                        ? new Date(r.creadoEn).toLocaleString()
                        : r.fechaEntrada
                        ? new Date(r.fechaEntrada).toLocaleString()
                        : ""}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(r)}
                        style={{
                          marginRight: 6,
                          padding: "6px 10px",
                          background: "#ffc107",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        style={{
                          padding: "6px 10px",
                          background: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">⚠️ No hay registros con los filtros actuales</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔢 Paginación */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            style={{
              padding: "6px 10px",
              border: "1px solid #ced4da",
              background: "#fff",
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
            }}
          >
            ◀︎ Anterior
          </button>
          <span>
            Página {currentPage} / {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            style={{
              padding: "6px 10px",
              border: "1px solid #ced4da",
              background: "#fff",
              cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
            }}
          >
            Siguiente ▶︎
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Por página:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Caja;
