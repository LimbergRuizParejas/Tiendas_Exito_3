// src/pages/services/useCaja.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import { listCaja, createCaja, updateCaja, deleteCaja, getCajaResumen } from './cajaService';

export function useCaja(initialQuery = { page: 1, limit: 10 }) {
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState({ items: [], page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await listCaja(query);
      setData(res);
    } catch (e) {
      setError(e?.message || 'Error cargando caja');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { fetch(); }, [fetch]);

  const actions = useMemo(() => ({
    reload: fetch,
    setQuery,
    async create(payload) { await createCaja(payload); await fetch(); },
    async update(id, payload) { await updateCaja(id, payload); await fetch(); },
    async remove(id) { await deleteCaja(id); await fetch(); },
    resumen: getCajaResumen,
  }), [fetch]);

  return { query, setQuery, data, loading, error, ...actions };
}
