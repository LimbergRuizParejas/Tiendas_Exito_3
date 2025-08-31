// 📌 src/pages/services/categoryService.js
import api from "./api";

/* ===========================
   Utilidades internas
=========================== */

/** Limpia y normaliza strings */
const cleanStr = (v) => (v == null ? "" : String(v).trim());

/** Extrae mensaje legible desde respuestas de error del backend (NestJS) */
function extractErrorMessage(error) {
  const data = error?.response?.data;
  if (!data) return null;

  if (Array.isArray(data.message)) return data.message.join("\n");
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;

  return null;
}

/** Manejo uniforme de errores */
function handleApiError(context, error) {
  const msg = extractErrorMessage(error) || error.message || "Error desconocido";
  console.error(`🚨 Error al ${context}:`, msg, error);
  throw new Error(`No se pudo ${context}.`);
}

/** Construye el payload correcto para el backend (solo 'nombre') */
function buildCategoryPayload(input) {
  // Admitimos distintas formas por robustez:
  // - { nombre: "Bebidas" }
  // - { name: "Bebidas" }
  // - "Bebidas"
  const nombre =
    cleanStr(
      typeof input === "string"
        ? input
        : input?.nombre ?? input?.name
    );

  if (!nombre) {
    throw new Error("El nombre es obligatorio.");
  }

  return { nombre };
}

/* ===========================
   Endpoints Categorías
=========================== */

/** GET /api/categorias */
export const getCategories = async () => {
  try {
    const { data } = await api.get("/categorias");
    return data;
  } catch (error) {
    return handleApiError("obtener las categorías", error);
  }
};

/** GET /api/categorias/:id */
export const getCategoryById = async (id) => {
  try {
    const { data } = await api.get(`/categorias/${id}`);
    return data;
  } catch (error) {
    return handleApiError(`obtener la categoría con ID ${id}`, error);
  }
};

/** POST /api/categorias  -> body: { nombre } */
export const createCategory = async (category) => {
  try {
    const payload = buildCategoryPayload(category);
    const { data } = await api.post("/categorias", payload);
    return data;
  } catch (error) {
    return handleApiError("crear la categoría", error);
  }
};

/** PUT /api/categorias/:id  -> body: { nombre? } */
export const updateCategory = async (id, category) => {
  try {
    // Permitimos update parcial: si no viene 'nombre', no lo enviamos
    let payload = {};
    if (category?.nombre != null || category?.name != null || typeof category === "string") {
      payload = buildCategoryPayload(category);
    }
    const { data } = await api.put(`/categorias/${id}`, payload);
    return data;
  } catch (error) {
    return handleApiError(`actualizar la categoría con ID ${id}`, error);
  }
};

/** DELETE /api/categorias/:id */
export const deleteCategory = async (id) => {
  try {
    await api.delete(`/categorias/${id}`);
    return true;
  } catch (error) {
    return handleApiError(`eliminar la categoría con ID ${id}`, error);
  }
};
