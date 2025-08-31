// 📌 src/pages/services/cajaService.js
import api from "./api";

/* ===========================
   Utilidades internas
=========================== */

/** Convierte a número seguro (maneja null/undefined/"") */
const toNumber = (v) => (v == null || v === "" ? 0 : Number(v));

/** Convierte a Date desde string/Date; si no es válida retorna null */
const toDateOrNull = (v) => {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

/** Construye querystring limpio */
function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
  });
  return q.toString();
}

/** Sanitiza strings (trim, opcional minúsculas) */
const cleanStr = (s, lower = false) => {
  const v = (s ?? "").toString().trim();
  return lower ? v.toLowerCase() : v;
};

/** Serializa fecha a ISO (UTC) o undefined si null */
const toIsoOrUndef = (d) => (d ? new Date(d).toISOString() : undefined);

/** Asegura que ‘total’ exista (si no, igual al monto) */
const ensureTotal = (monto, total) => {
  const nMonto = toNumber(monto);
  const nTotal =
    total == null || total === "" || isNaN(Number(total))
      ? nMonto
      : toNumber(total);
  return { monto: nMonto, total: nTotal };
};

/** Normaliza un registro devuelto por la API */
function mapCaja(item) {
  return {
    ...item,
    monto: toNumber(item.monto),
    total: toNumber(item.total),
    fechaEntrada: toDateOrNull(item.fechaEntrada),
    fechaSalida: toDateOrNull(item.fechaSalida),
    creadoEn: toDateOrNull(item.creadoEn),
    actualizadoEn: toDateOrNull(item.actualizadoEn),
    tipoPago: cleanStr(item.tipoPago, true), // guardamos en minúsculas
  };
}

/** Asegura payload correcto para el backend */
function preparePayload(payload = {}) {
  const p = { ...payload };

  // strings
  p.personaACargo = cleanStr(p.personaACargo);
  p.motivo = cleanStr(p.motivo);
  p.tipoPago = cleanStr(p.tipoPago || "efectivo", true);

  // números (con default total = monto)
  const { monto, total } = ensureTotal(p.monto, p.total);
  p.monto = monto;
  p.total = total;

  // ids opcionales
  if (p.categoriaId != null && p.categoriaId !== "") {
    p.categoriaId = Number(p.categoriaId);
  } else {
    delete p.categoriaId;
  }

  // fechas opcionales (enviar ISO si existen)
  if (p.fechaEntrada) p.fechaEntrada = toIsoOrUndef(p.fechaEntrada);
  if (p.fechaSalida) p.fechaSalida = toIsoOrUndef(p.fechaSalida);

  // imagen comprobante opcional
  if (!p.imagenComprobante) delete p.imagenComprobante;

  return p;
}

/* ===========================
   Endpoints Caja
=========================== */

const ENDPOINT = "/api/caja";

/**
 * GET /caja
 * params soportados (si tu backend los implementa):
 * { page, limit, personaACargo, tipoPago, sortBy, order, desde, hasta }
 */
export async function listCaja(params = {}) {
  const qs = buildQuery(params);
  const url = qs ? `${ENDPOINT}?${qs}` : ENDPOINT;
  const { data } = await api.get(url);

  // Soporta array simple o objeto paginado { items, total, ... }
  if (Array.isArray(data)) {
    return {
      page: 1,
      limit: data.length,
      total: data.length,
      totalPages: 1,
      items: data.map(mapCaja),
    };
  }

  return {
    ...data,
    items: (data.items || []).map(mapCaja),
  };
}

/** GET /caja/:id */
export async function getCajaById(id) {
  const { data } = await api.get(`${ENDPOINT}/${id}`);
  return mapCaja(data);
}

/** POST /caja */
export async function createCaja(payload) {
  const body = preparePayload(payload);
  const { data } = await api.post(ENDPOINT, body);
  return mapCaja(data);
}

/** PUT /caja/:id */
export async function updateCaja(id, payload) {
  const body = preparePayload(payload);
  const { data } = await api.put(`${ENDPOINT}/${id}`, body);
  return mapCaja(data);
}

/** DELETE /caja/:id */
export async function deleteCaja(id) {
  await api.delete(`${ENDPOINT}/${id}`);
  return true;
}

/**
 * GET /caja/resumen?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 * (si implementas este endpoint en el backend)
 */
export async function getCajaResumen(desde, hasta) {
  const qs = buildQuery({ desde, hasta });
  const { data } = await api.get(`${ENDPOINT}/resumen?${qs}`);

  return {
    ...data,
    totalGeneral: toNumber(data.totalGeneral),
    porTipoPago: (data.porTipoPago || []).map((r) => ({
      ...r,
      totalMonto: toNumber(r.totalMonto),
      totalAcumulado: toNumber(r.totalAcumulado),
      tipoPago: cleanStr(r.tipoPago, true),
    })),
  };
}

/* ===========================
   Utilidades extra (frontend)
=========================== */

/** Suma local por tipo de pago (para tablas/resúmenes en cliente) */
export function sumByTipoPago(items = []) {
  const acc = {};
  for (const it of items) {
    const key = cleanStr(it.tipoPago, true) || "desconocido";
    if (!acc[key]) acc[key] = { tipoPago: key, cantidad: 0, monto: 0, total: 0 };
    acc[key].cantidad += 1;
    acc[key].monto += toNumber(it.monto);
    acc[key].total += toNumber(it.total);
  }
  return Object.values(acc);
}

/** Exporta a CSV un arreglo de items de caja (mapeados) */
export function exportCajaCsv(items, fileName = "caja.csv") {
  const headers = [
    "id",
    "fechaEntrada",
    "fechaSalida",
    "personaACargo",
    "motivo",
    "tipoPago",
    "monto",
    "total",
    "categoriaId",
    "creadoEn",
    "actualizadoEn",
  ];

  const rows = (items || []).map((it) => [
    it.id ?? "",
    it.fechaEntrada ? new Date(it.fechaEntrada).toISOString() : "",
    it.fechaSalida ? new Date(it.fechaSalida).toISOString() : "",
    it.personaACargo ?? "",
    String(it.motivo ?? "").replace(/\n/g, " "),
    cleanStr(it.tipoPago, true),
    toNumber(it.monto).toFixed(2),
    toNumber(it.total).toFixed(2),
    it.categoriaId ?? "",
    it.creadoEn ? new Date(it.creadoEn).toISOString() : "",
    it.actualizadoEn ? new Date(it.actualizadoEn).toISOString() : "",
  ]);

  // CSV con BOM para mejor soporte en Excel
  const csv =
    [headers.join(","), ...rows.map((r) => r.map(escapeCsv).join(","))].join(
      "\n"
    );
  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
