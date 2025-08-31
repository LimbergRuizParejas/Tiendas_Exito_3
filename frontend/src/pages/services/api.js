// 📌 frontend/src/pages/services/api.js
import axios from "axios";

/**
 * Base y prefijo:
 * - REACT_APP_API_BASE_URL (p.ej. http://localhost:3000)
 * - REACT_APP_API_PREFIX   (p.ej. /api)  ← por defecto /api
 *
 * Resultado por defecto: http://localhost:3000/api
 */
function resolveBaseURL() {
  const base = (process.env.REACT_APP_API_BASE_URL || "http://localhost:3000")
    .replace(/\/+$/, "");

  const rawPrefix =
    process.env.REACT_APP_API_PREFIX !== undefined
      ? process.env.REACT_APP_API_PREFIX
      : "/api";

  const prefix = (rawPrefix || "")
    .replace(/^\/?/, "/")
    .replace(/\/+$/, "");

  return (base + prefix).replace(/\/+$/, "");
}

export const BASE_URL = resolveBaseURL();

/* ===== Reintentos básicos para 502/503/504 ===== */
const RETRY_MAX = 2;
const RETRY_STATUS = new Set([502, 503, 504]);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* ===== Hooks / Helpers de auth (opcionales) ===== */
let onUnauthorized = null;
export function setOnUnauthorizedCallback(fn) {
  onUnauthorized = typeof fn === "function" ? fn : null;
}
export function setAuthToken(token) {
  if (token) localStorage.setItem("adminToken", token);
}
export function clearAuthToken() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("userToken");
}

/* ===== Utilidad para extraer mensajes de error de Nest ===== */
function extractErrorMessage(data) {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (Array.isArray(data?.message)) return data.message.join("\n");
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;
  return null;
}

/* ===== Instancia principal de Axios ===== */
const api = axios.create({
  baseURL: BASE_URL, // ← p.ej. http://localhost:3000/api
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

/* ========== REQUEST ========== */
api.interceptors.request.use(
  (config) => {
    config.meta = config.meta || {};

    // 🔐 Token
    const token =
      localStorage.getItem("adminToken") || localStorage.getItem("userToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // ♻️ Reintentos
    config.__retryCount = 0;
    config.__retryMax = Number.isFinite(config.meta.retryMax)
      ? Math.max(0, config.meta.retryMax)
      : RETRY_MAX;

    // 🧠 CLAVE: si el body es FormData, eliminamos el header JSON para que el navegador ponga multipart/form-data con boundary
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers && config.headers["Content-Type"]) {
        delete config.headers["Content-Type"];
      }
    }

    if (process.env.NODE_ENV !== "production" && !config.__loggedBaseUrl) {
      config.__loggedBaseUrl = true;
      console.info("🌐 API baseURL:", BASE_URL);
    }

    return config;
  },
  (error) => {
    console.error("❌ Error al preparar la solicitud:", error?.message || error);
    return Promise.reject(error);
  }
);

/* ========== RESPONSE ========== */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const cfg = error.config || {};
    const silence = !!cfg.meta?.silenceErrors;

    // Sin response → timeout / red / CORS
    if (!error.response) {
      const isTimeout = error.code === "ECONNABORTED";
      const canRetry = cfg.__retryCount < cfg.__retryMax;

      if (process.env.NODE_ENV !== "production") {
        console.error("❌ Sin respuesta del servidor:", error?.message || error);
      }

      if (canRetry) {
        cfg.__retryCount += 1;
        await delay(300 * Math.pow(2, cfg.__retryCount - 1));
        return api(cfg);
      }

      if (!silence) {
        alert(
          isTimeout
            ? "La solicitud excedió el tiempo de espera. Intenta nuevamente."
            : "No se pudo conectar con el servidor. Revisa tu conexión."
        );
      }
      return Promise.reject(error);
    }

    // Con response → HTTP error
    const { status, data } = error.response;
    const msg = extractErrorMessage(data) || "Ocurrió un error inesperado.";

    if (process.env.NODE_ENV !== "production") {
      console.groupCollapsed(
        `❌ API ${cfg?.method?.toUpperCase?.()} ${cfg?.url} → ${status}`
      );
      console.log("BaseURL:", BASE_URL);
      console.log("Request:", {
        method: cfg?.method,
        url: `${BASE_URL}${cfg?.url}`,
        params: cfg?.params,
        data: cfg?.data,
        headers: cfg?.headers,
      });
      console.log("Response:", { status, data });
      console.groupEnd();
    }

    // Reintentos para 502/503/504
    const canRetry =
      cfg.__retryCount < cfg.__retryMax && RETRY_STATUS.has(status);
    if (canRetry) {
      cfg.__retryCount += 1;
      await delay(300 * Math.pow(2, cfg.__retryCount - 1));
      return api(cfg);
    }

    if (!silence) {
      switch (status) {
        case 400:
          alert(msg || "Solicitud inválida. Revisa los datos.");
          break;
        case 401:
          alert(msg || "No autorizado. Por favor, inicia sesión.");
          if (onUnauthorized) {
            try { await onUnauthorized(); } catch {}
          }
          break;
        case 403:
          alert(msg || "Acceso prohibido. No tienes permisos suficientes.");
          break;
        case 404:
          alert(msg || "El recurso solicitado no fue encontrado.");
          break;
        default:
          if (status >= 500) {
            alert(msg || "Error del servidor. Intenta más tarde.");
          } else {
            alert(msg);
          }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
