// 📌 frontend/src/pages/services/inventoryService.js
import api from "./api";

/* =========================================================================
   Helpers
   ========================================================================= */

// número o undefined (''/null/undefined → undefined)
const numOrUndef = (v) => {
  if (v === null || v === undefined) return undefined;
  if (typeof v === "string" && v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// número seguro con default
const toNum = (v, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

// YYYY-MM-DD local (evita desfasar por zona horaria)
const toYMDLocal = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// normaliza a YYYY-MM-DD
const toISODate = (v) => {
  if (!v) return undefined;
  try {
    if (typeof v === "string") {
      const s = v.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
      const d = new Date(s);
      if (!Number.isFinite(d.getTime())) return undefined;
      return toYMDLocal(d);
    }
    if (v instanceof Date && Number.isFinite(v.getTime())) {
      return toYMDLocal(v);
    }
  } catch {}
  return undefined;
};

// ¿archivo tipo File/Blob?
const isFileLike = (f) => {
  if (!f) return false;
  if (typeof File !== "undefined" && f instanceof File) return true;
  if (typeof Blob !== "undefined" && f instanceof Blob) return true;
  return false;
};

// decimales de un número (acepta string/number)
const decimalPlaces = (v) => {
  const s = String(v);
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
};

// log bonito de FormData en dev
const logFormData = (title, fd) => {
  if (process.env.NODE_ENV === "production") return;
  console.groupCollapsed(title);
  for (const [k, v] of fd.entries()) {
    if (typeof File !== "undefined" && v instanceof File) {
      console.log(k, `File(${v.name}, ${v.type}, ${v.size}B)`);
    } else {
      console.log(k, v);
    }
  }
  console.groupEnd();
};

// valida código de barras (solo dígitos, 3–64)
const isValidBarcode = (s) => /^\d{3,64}$/.test(String(s).trim() || "");

/* =========================================================================
   Normalización del ítem recibido del backend
   ========================================================================= */

function normalizeItem(raw = {}) {
  return {
    ...raw,
    cantidad: toNum(raw.cantidad),
    precio: toNum(raw.precio),
    codigoBarras: raw.codigoBarras ?? "",
  };
}

/* =========================================================================
   Builders de FormData
   ========================================================================= */

function buildCreateFormData(input = {}) {
  // ⚠️ Asumimos que validateCreatePayload() ya pasó
  const fd = new FormData();

  const nombreProducto = String(input.nombreProducto ?? "").trim();
  const cantidad = Number(input.cantidad);
  const precio = Number(input.precio);
  const categoriaId = Number(input.categoriaId ?? input.categoria?.id ?? input.categoriaID);
  const marcaId = Number(input.marcaId ?? input.marca?.id ?? input.marcaID);

  fd.append("nombreProducto", nombreProducto);
  fd.append("cantidad", String(cantidad));
  fd.append("precio", String(precio));
  fd.append("categoriaId", String(categoriaId));
  fd.append("marcaId", String(marcaId));

  // código de barras (opcional)
  const codigoBarras = String(input.codigoBarras ?? "").trim();
  if (codigoBarras) fd.append("codigoBarras", codigoBarras);

  // fecha (opcional)
  const cad = toISODate(input.fechaCaducidad);
  if (cad) fd.append("fechaCaducidad", cad);

  // imagen (opcional)
  const file = input.imagenFile ?? input.imagen;
  if (isFileLike(file)) fd.append("imagen", file);

  return fd;
}

function buildUpdateFormData(input = {}) {
  const fd = new FormData();

  if (input.nombreProducto !== undefined) {
    const v = String(input.nombreProducto).trim();
    if (v) fd.append("nombreProducto", v);
  }

  if (input.cantidad !== undefined) {
    const n = numOrUndef(input.cantidad);
    if (Number.isInteger(n) && n >= 0) fd.append("cantidad", String(n));
  }

  if (input.precio !== undefined) {
    const n = numOrUndef(input.precio);
    if (Number.isFinite(n) && n >= 0) fd.append("precio", String(n));
  }

  // IDs relacionales
  const categoriaId = input.categoriaId ?? input.categoria?.id ?? input.categoriaID;
  if (categoriaId !== undefined) {
    const n = numOrUndef(categoriaId);
    if (Number.isInteger(n) && n > 0) fd.append("categoriaId", String(n));
  }

  const marcaId = input.marcaId ?? input.marca?.id ?? input.marcaID;
  if (marcaId !== undefined) {
    const n = numOrUndef(marcaId);
    if (Number.isInteger(n) && n > 0) fd.append("marcaId", String(n));
  }

  // fechaCaducidad:
  // - si viene string válida -> se envía YYYY-MM-DD
  // - si quiere limpiar: enviar '' o setear flag clearFechaCaducidad
  if (input.fechaCaducidad !== undefined) {
    const cad = toISODate(input.fechaCaducidad);
    if (cad) fd.append("fechaCaducidad", cad);
    else if (
      input.fechaCaducidad === "" ||
      input.fechaCaducidad === null ||
      input.clearFechaCaducidad
    ) {
      fd.append("fechaCaducidad", "");
    }
  }

  // código de barras (opcional)
  if (input.codigoBarras !== undefined) {
    const v = String(input.codigoBarras ?? "").trim();
    if (v) fd.append("codigoBarras", v);
    // si v == '' no lo enviamos para no borrar accidentalmente
  }

  // imagen (opcional)
  const file = input.imagenFile ?? input.imagen;
  if (isFileLike(file)) fd.append("imagen", file);

  return fd;
}

/* =========================================================================
   Validación previa (lado cliente)
   ========================================================================= */

function validateCreatePayload(item = {}) {
  const errors = [];

  const nombre = String(item.nombreProducto ?? "").trim();
  if (!nombre) errors.push("El nombre del producto es obligatorio.");

  const cantidad = numOrUndef(item.cantidad);
  if (!Number.isInteger(cantidad) || cantidad < 0)
    errors.push("La cantidad debe ser un entero >= 0.");

  const precio = numOrUndef(item.precio);
  if (!(typeof precio === "number") || precio < 0)
    errors.push("El precio debe ser numérico y >= 0.");
  else if (decimalPlaces(precio) > 2)
    errors.push("El precio admite hasta 2 decimales.");

  const categoriaId = numOrUndef(item.categoriaId ?? item?.categoria?.id);
  if (!Number.isInteger(categoriaId) || categoriaId < 1)
    errors.push("categoriaId debe ser un entero >= 1.");

  const marcaId = numOrUndef(item.marcaId ?? item?.marca?.id);
  if (!Number.isInteger(marcaId) || marcaId < 1)
    errors.push("marcaId debe ser un entero >= 1.");

  // código de barras (opcional, solo dígitos 3–64)
  if (item.codigoBarras !== undefined && String(item.codigoBarras).trim() !== "") {
    if (!isValidBarcode(item.codigoBarras)) {
      errors.push("El código de barras debe ser numérico (3 a 64 dígitos).");
    }
  }

  if (errors.length) {
    const msg = errors.join("\n");
    throw new Error(msg);
  }
}

function validateUpdatePayload(item = {}) {
  const errors = [];

  if (item.cantidad !== undefined) {
    const n = numOrUndef(item.cantidad);
    if (!Number.isInteger(n) || n < 0) errors.push("La cantidad debe ser un entero >= 0.");
  }
  if (item.precio !== undefined) {
    const n = numOrUndef(item.precio);
    if (!(typeof n === "number") || n < 0) errors.push("El precio debe ser numérico y >= 0.");
    else if (decimalPlaces(n) > 2) errors.push("El precio admite hasta 2 decimales.");
  }
  if (item.categoriaId !== undefined) {
    const id = numOrUndef(item.categoriaId ?? item?.categoria?.id);
    if (!Number.isInteger(id) || id < 1) errors.push("categoriaId debe ser un entero >= 1.");
  }
  if (item.marcaId !== undefined) {
    const id = numOrUndef(item.marcaId ?? item?.marca?.id);
    if (!Number.isInteger(id) || id < 1) errors.push("marcaId debe ser un entero >= 1.");
  }
  if (item.codigoBarras !== undefined) {
    const v = String(item.codigoBarras ?? "").trim();
    if (v && !isValidBarcode(v)) {
      errors.push("El código de barras debe ser numérico (3 a 64 dígitos).");
    }
  }

  if (errors.length) {
    const msg = errors.join("\n");
    throw new Error(msg);
  }
}

/* =========================================================================
   Manejo de errores (propaga mensaje real del backend)
   ========================================================================= */

function handleApiError(error, fallbackMessage) {
  const data = error?.response?.data;
  const cfg = error?.config || {};
  const silence = !!cfg.meta?.silenceErrors;

  let readable = fallbackMessage;
  if (data) {
    if (Array.isArray(data.message) && data.message.length) readable = data.message.join("\n");
    else if (typeof data.message === "string") readable = data.message;
    else if (typeof data.error === "string") readable = data.error;
  }

  // 👇 Mostrar alerta SOLO si NO está silenciado
  if (!silence) {
    alert(readable);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("🚨 API error:", {
      url: cfg?.url,
      method: cfg?.method,
      status: error?.response?.status,
      response: data,
      message: readable,
    });
  }

  throw new Error(readable);
}

/* =========================================================================
   API pública
   ========================================================================= */

export async function getInventory() {
  try {
    const { data } = await api.get("/inventory");
    return Array.isArray(data) ? data.map(normalizeItem) : [];
  } catch (error) {
    return handleApiError(error, "No se pudo obtener el inventario.");
  }
}

export async function addInventoryItem(item) {
  try {
    validateCreatePayload(item);

    const formData = buildCreateFormData(item);
    logFormData("🧾 addInventoryItem → FormData", formData);

    const { data } = await api.post("/inventory", formData, {
      meta: { silenceErrors: true },
    });
    return normalizeItem(data);
  } catch (error) {
    return handleApiError(error, "No se pudo agregar el producto.");
  }
}

export async function updateInventoryItem(id, partialItem) {
  try {
    validateUpdatePayload(partialItem);

    const formData = buildUpdateFormData(partialItem);

    // evitar request vacío (sin crear variable no usada)
    const hasEntries = !formData.keys().next().done;
    if (!hasEntries) throw new Error("No hay cambios válidos para actualizar.");

    logFormData("🧹 updateInventoryItem → FormData", formData);

    const { data } = await api.put(`/inventory/${id}`, formData, {
      meta: { silenceErrors: true },
    });
    return normalizeItem(data);
  } catch (error) {
    return handleApiError(error, "No se pudo actualizar el producto.");
  }
}

export async function updateInventoryStock(id, cantidad) {
  try {
    const n = numOrUndef(cantidad);
    if (!Number.isInteger(n) || n < 0) {
      throw new Error("La cantidad debe ser un entero >= 0.");
    }
    const { data } = await api.patch(
      `/inventory/${id}/stock`,
      { cantidad: n },
      { meta: { silenceErrors: true } }
    );
    return normalizeItem(data);
  } catch (error) {
    return handleApiError(error, "No se pudo actualizar el stock.");
  }
}

export async function deleteInventoryItem(id) {
  try {
    await api.delete(`/inventory/${id}`, { meta: { silenceErrors: true } });
    return true;
  } catch (error) {
    return handleApiError(error, "No se pudo eliminar el producto.");
  }
}

/* =========================================================================
   Extras
   ========================================================================= */

export async function getInventorySummary() {
  try {
    const { data } = await api.get("/inventory/summary");
    return data;
  } catch (error) {
    return handleApiError(error, "No se pudo obtener el resumen del inventario.");
  }
}

export async function getInventoryGrouped() {
  try {
    const { data } = await api.get("/inventory/grouped");
    return data;
  } catch (error) {
    return handleApiError(error, "No se pudo agrupar el inventario.");
  }
}

// 👉 Buscar producto por código de barras (para la “maquinita”/scanner)
export async function getByBarcode(code) {
  try {
    const codigo = String(code ?? "").trim();
    if (!codigo) throw new Error("Código de barras vacío.");
    const { data } = await api.get(`/inventory/by-barcode/${encodeURIComponent(codigo)}`, {
      meta: { silenceErrors: true },
    });
    return data ? normalizeItem(data) : null;
  } catch (error) {
    return handleApiError(error, "No se pudo buscar el producto por código de barras.");
  }
}
