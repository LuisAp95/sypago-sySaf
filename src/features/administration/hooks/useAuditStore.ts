import { useState, useEffect, useMemo, useCallback } from 'react';
import { auditService } from '../services/auditService';
import type {
  AuditEntry,
  AuditFilters,
  AuditStats,
} from '../types/audit.types';
import { EMPTY_FILTERS } from '../types/audit.types';

// ─── Constantes ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuditStore() {
  const [filters, setFilters] = useState<AuditFilters>(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // Seed datos de demostración en el primer montaje
  useEffect(() => {
    auditService.seed();
  }, []);

  // Obtener todos los entries filtrados
  const allFilteredEntries = useMemo<AuditEntry[]>(
    () => auditService.getFilteredEntries(filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, refreshKey]
  );

  // Estadísticas globales (sin filtros)
  const stats = useMemo<AuditStats>(
    () => auditService.getStats(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey]
  );

  // Paginación
  const totalEntries = allFilteredEntries.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedEntries = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return allFilteredEntries.slice(start, start + PAGE_SIZE);
  }, [allFilteredEntries, safePage]);

  // Reset página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Acciones
  const updateFilter = useCallback(
    <K extends keyof AuditFilters>(key: K, value: AuditFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  }, []);

  const exportCsv = useCallback(() => {
    auditService.exportToCsv(filters);
  }, [filters]);

  return {
    // Datos
    entries: paginatedEntries,
    allFilteredEntries,
    stats,

    // Filtros
    filters,
    updateFilter,
    resetFilters,

    // Paginación
    currentPage: safePage,
    totalPages,
    totalEntries,
    pageSize: PAGE_SIZE,
    goToPage,
    nextPage,
    prevPage,

    // Acciones
    refresh,
    exportCsv,
  };
}
