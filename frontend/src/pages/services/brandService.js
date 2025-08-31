// 📌 src/pages/services/brandService.js
import api from "./api";

/* ===========================
   Utilidades internas
=========================== */

/** Devuelve string limpio (trim, colapsa espacios) */
const cleanStr = (s) =>
  (s ?? "")
    .toString()
    .replace(/\s+/g, " ")
    .trim();

/** Construye querystring sin keys vacías */
function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
  });
  return q.toString();
}

/** Extrae un mensaje legible desde un error de Axios/Nest */
function getApiErrorMessage(error, fallback = "Ocurrió un error") {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;

  if (Array.isArray(data.message) && data.message.length) {
    return data.message.join("\n");
  }
  if (typeof data.message === "string" && data.message) return data.message;
  if (typeof data.error === "string" && data.error) return data.error;
  return error?.message || fallback;
}

/** Normaliza la marca recibida del backend a un shape estable */
function mapBrand(b) {
  if (!b || typeof b !== "object") return b;
  return {
    id: b.id,
    nombre: cleanStr(b.nombre),
    descripcion: cleanStr(b.descripcion),
    // conserva otras props si existieran
    ...b,
  };
}

/** Prepara payload para crear/actualizar (limpia strings) */
function preparePayload(brand = {}) {
  const body = { ...brand };
  if (body.nombre !== undefined) body.nombre = cleanStr(body.nombre);
  if (body.descripcion !== undefined) body.descripcion = cleanStr(body.descripcion);
  return body;
}

const ENDPOINT = "/marcas";

/* ===========================
   Endpoints
=========================== */

/**
 * Listar marcas.
 * Soporta opcionalmente params como { page, limit, q } si tu backend los implementa.
 * Devuelve siempre { items, total?, page?, limit?, totalPages? } para consumo estable.
 */
export async function listBrands(params = {}) {
  try {
    const qs = buildQuery(params);
    const url = qs ? `${ENDPOINT}?${qs}` : ENDPOINT;

    const { data } = await api.get(url);

    if (Array.isArray(data)) {
      // backend devuelve lista simple
      return {
        items: data.map(mapBrand),
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      };
    }

    // backend devuelve paginado { items, total, page, limit, totalPages }
    return {
      ...data,
      items: (data.items || []).map(mapBrand),
    };
  } catch (error) {
    console.error("🚨 Error al obtener las marcas:", error);
    throw new Error(getApiErrorMessage(error, "No se pudieron obtener las marcas."));
  }
}

/** Alias clásico: obtener todas las marcas (sin filtros) */
export async function getBrands() {
  const { items } = await listBrands();
  return items;
}

/** Buscar marcas por término (si el backend soporta ?q=) */
export async function searchBrands(term) {
  const { items } = await listBrands({ q: term });
  return items;
}

/** Obtener una marca por ID */
export async function getBrandById(id) {
  try {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return mapBrand(data);
  } catch (error) {
    console.error(`🚨 Error al obtener la marca con ID ${id}:`, error);
    throw new Error(
      getApiErrorMessage(error, `No se pudo obtener la marca con ID ${id}.`)
    );
  }
}

/** Crear una nueva marca */
export async function createBrand(brand) {
  try {
    const body = preparePayload(brand);

    if (!body.nombre) {
      throw new Error("El nombre de la marca es obligatorio.");
    }

    const { data } = await api.post(ENDPOINT, body);
    return mapBrand(data);
  } catch (error) {
    console.error("🚨 Error al crear la marca:", error);
    throw new Error(
      getApiErrorMessage(error, "No se pudo crear la marca. Revisa los datos.")
    );
  }
}

/** Actualizar una marca por ID */
export async function updateBrand(id, brand) {
  try {
    const body = preparePayload(brand);

    if (body.nombre !== undefined && !body.nombre) {
      throw new Error("El nombre de la marca no puede estar vacío.");
    }

    const { data } = await api.put(`${ENDPOINT}/${id}`, body);
    return mapBrand(data);
  } catch (error) {
    console.error(`🚨 Error al actualizar la marca con ID ${id}:`, error);
    throw new Error(
      getApiErrorMessage(
        error,
        `No se pudo actualizar la marca con ID ${id}. Revisa los datos.`
      )
    );
  }
}

/** Eliminar una marca por ID */
export async function deleteBrand(id) {
  try {
    await api.delete(`${ENDPOINT}/${id}`);
    return true;
  } catch (error) {
    console.error(`🚨 Error al eliminar la marca con ID ${id}:`, error);
    throw new Error(
      getApiErrorMessage(error, `No se pudo eliminar la marca con ID ${id}.`)
    );
  }
}

/** Upsert de conveniencia (si trae id → update, si no → create) */
export async function upsertBrand(brand) {
  if (brand?.id) return updateBrand(brand.id, brand);
  return createBrand(brand);
}
