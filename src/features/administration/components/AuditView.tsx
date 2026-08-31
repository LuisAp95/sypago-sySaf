import React, { useState } from 'react';
import { ViewHeader } from '@/components/ui/ViewHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataGrid, type ColumnDef } from '@/components/ui/DataGrid';
import { DatePicker } from '@/components/ui/DatePicker';
import { Eye, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuditStore } from '../hooks/useAuditStore';
import { AuditDetailModal } from './AuditDetailModal';
import type { AuditEntry } from '../types/audit.types';
import {
  AUDIT_MODULES,
  AUDIT_ACTIONS,
  AUDIT_ACTION_LABELS,
  AUDIT_SEVERITY_LABELS,
} from '../types/audit.types';

// ─── Helpers de formato ──────────────────────────────────────────────────────

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

const severityVariant = (sev: string): string => {
  switch (sev) {
    case 'critical': return 'critical';
    case 'warning': return 'warning';
    default: return 'info';
  }
};

const actionVariant = (action: string): string => {
  switch (action) {
    case 'DELETE': case 'REJECT': return 'critical';
    case 'UPDATE': case 'DEACTIVATE': return 'warning';
    case 'APPROVE': case 'ACTIVATE': return 'success';
    default: return 'info';
  }
};

// ─── Opciones de filtro ──────────────────────────────────────────────────────

const MODULE_OPTIONS = [
  { label: 'Todos los módulos', value: 'todos' },
  ...AUDIT_MODULES.map((m) => ({ label: m, value: m })),
];

const ACTION_OPTIONS = [
  { label: 'Todas las acciones', value: 'todos' },
  ...AUDIT_ACTIONS.map((a) => ({
    label: AUDIT_ACTION_LABELS[a],
    value: a,
  })),
];



// ─── Tarjeta de estadística ──────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  count: number;
  colorClass: string;
  isActive: boolean;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  count,
  colorClass,
  isActive,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'bg-[#232225] border rounded-2xl p-4 flex flex-col gap-1 min-w-[140px] text-left cursor-pointer transition-all hover:border-[#4A494D] focus:outline-none',
      isActive
        ? 'border-chart-menu ring-1 ring-chart-menu bg-[#28272b]'
        : 'border-[#333235]'
    )}
  >
    <span className="text-[#9E9D9F] font-semibold text-xs">{label}</span>
    <span className={cn('text-2xl font-bold', colorClass)}>{count}</span>
  </button>
);

// ─── Footer Paginación ───────────────────────────────────────────────────────

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  onPrev: () => void;
  onNext: () => void;
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
  currentPage,
  totalPages,
  totalEntries,
  onPrev,
  onNext,
}) => (
  <div className="mt-3 flex items-center justify-between">
    <span className="text-xs text-gray-400 bg-[#2A292A] border border-[#3A393C] px-3 py-1.5 rounded-lg">
      {totalEntries} registro{totalEntries !== 1 ? 's' : ''} encontrado{totalEntries !== 1 ? 's' : ''}
    </span>
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        disabled={currentPage <= 1}
        className="w-8 h-8 rounded-lg bg-[#2A292A] border border-[#3A393C] hover:bg-[#393738] disabled:opacity-30"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-xs text-gray-300 font-medium px-2">
        {currentPage} / {totalPages}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="w-8 h-8 rounded-lg bg-[#2A292A] border border-[#3A393C] hover:bg-[#393738] disabled:opacity-30"
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

// ─── Vista Principal ─────────────────────────────────────────────────────────

export const AuditView: React.FC = () => {
  const {
    entries,
    stats,
    filters,
    updateFilter,
    resetFilters,
    currentPage,
    totalPages,
    totalEntries,
    nextPage,
    prevPage,
    refresh,
    exportCsv,
  } = useAuditStore();

  const [showSearch, setShowSearch] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const handleViewDetail = (entry: AuditEntry) => {
    setSelectedEntry(entry);
    setDetailModalOpen(true);
  };

  // ── Columnas del DataGrid ──
  const columns: ColumnDef<AuditEntry>[] = [
    {
      header: 'Severidad',
      className: 'w-[100px] shrink-0',
      cell: (item) => (
        <Badge variant={severityVariant(item.severity)}>
          {AUDIT_SEVERITY_LABELS[item.severity]}
        </Badge>
      ),
    },
    {
      header: 'Fecha / Hora',
      className: 'w-[160px] shrink-0 text-gray-400 text-sm font-mono',
      cell: (item) => formatDate(item.timestamp),
    },
    {
      header: 'Usuario',
      accessorKey: 'userName',
      className: 'w-[140px] shrink-0',
    },
    {
      header: 'IP',
      accessorKey: 'userIp',
      className: 'w-[120px] shrink-0 font-mono text-[#2DD4BF] text-sm',
    },
    {
      header: 'Módulo',
      accessorKey: 'module',
      className: 'w-[140px] shrink-0 text-gray-300',
    },
    {
      header: 'Acción',
      className: 'w-[110px] shrink-0',
      cell: (item) => (
        <Badge variant={actionVariant(item.action)}>
          {AUDIT_ACTION_LABELS[item.action]}
        </Badge>
      ),
    },
    {
      header: 'Entidad',
      className: 'flex-1 min-w-[180px]',
      cell: (item) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm text-gray-200 truncate">{item.entityName}</span>
          <span className="text-[11px] text-gray-500 truncate">{item.details}</span>
        </div>
      ),
    },
    {
      header: undefined,
      className: 'w-[33px] shrink-0 p-0 m-0',
      cell: () => <div className="w-[1px] h-8 bg-[#333235] mx-4" />,
    },
    {
      header: undefined,
      className: 'w-[50px] shrink-0 flex-row items-center justify-center pr-2',
      cell: (item) => (
        <Button
          variant="secondary"
          size="icon"
          className="w-8 h-8 rounded-full bg-transparent border-transparent hover:bg-[#333235] text-[#9E9D9F] hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetail(item);
          }}
          aria-label="Ver detalle"
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-secondary text-text-primary rounded-xl">
      {/* ── Barra de filtros superior ── */}
      <ViewHeader
        selectOptions={MODULE_OPTIONS}
        selectValue={filters.module}
        selectPlaceholder="Todos los módulos"
        onSelectChange={(val) => updateFilter('module', val)}
        secondarySelectOptions={ACTION_OPTIONS}
        secondarySelectValue={filters.action}
        secondarySelectPlaceholder="Todas las acciones"
        onSecondarySelectChange={(val) => updateFilter('action', val)}
        showSearch
        showExport
        showFilter
        onSearchClick={() => setShowSearch((v) => !v)}
        onExportClick={exportCsv}
        onFilterClick={resetFilters}
        actions={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Refrescar"
            onClick={refresh}
            className="rounded-full bg-tertiary border border-table-border hover:bg-[#393738]"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        }
      />

      {/* ── Barra de búsqueda ── */}
      {showSearch && (
        <div className="mb-4 animate-in slide-in-from-top-2 duration-200">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder="Buscar por usuario, módulo, entidad, IP o detalle…"
            autoFocus
            className="w-full bg-[#2A292A] border border-[#3A393C] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-[#1DA493] focus:border-[#1DA493] transition-colors"
          />
        </div>
      )}

      {/* ── Filtro de severidad + Tarjetas de estadísticas ── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <StatCard
          label="Total Eventos"
          count={stats.total}
          colorClass="text-white"
          isActive={filters.severity === 'todos'}
          onClick={() => updateFilter('severity', 'todos')}
        />
        <StatCard
          label="Info"
          count={stats.bySeverity.info}
          colorClass="text-[#38BDF8]"
          isActive={filters.severity === 'info'}
          onClick={() =>
            updateFilter('severity', filters.severity === 'info' ? 'todos' : 'info')
          }
        />
        <StatCard
          label="Advertencia"
          count={stats.bySeverity.warning}
          colorClass="text-[#FB923C]"
          isActive={filters.severity === 'warning'}
          onClick={() =>
            updateFilter('severity', filters.severity === 'warning' ? 'todos' : 'warning')
          }
        />
        <StatCard
          label="Crítico"
          count={stats.bySeverity.critical}
          colorClass="text-[#F87171]"
          isActive={filters.severity === 'critical'}
          onClick={() =>
            updateFilter('severity', filters.severity === 'critical' ? 'todos' : 'critical')
          }
        />

        {/* Filtros de fecha inline */}
        <div className="flex items-center gap-2 ml-auto">
          <DatePicker
            label="Desde"
            value={filters.dateFrom}
            onChange={(val) => updateFilter('dateFrom', val)}
            placeholder="Seleccionar desde"
            align="right"
          />
          <DatePicker
            label="Hasta"
            value={filters.dateTo}
            onChange={(val) => updateFilter('dateTo', val)}
            placeholder="Seleccionar hasta"
            align="right"
          />
        </div>
      </div>

      {/* ── DataGrid ── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <DataGrid<AuditEntry>
            data={entries}
            columns={columns}
            keyExtractor={(item) => item.id}
            onRowClick={handleViewDetail}
            emptyMessage={
              <span className="text-gray-500">
                {filters.searchQuery
                  ? `Sin resultados para "${filters.searchQuery}"`
                  : 'No hay registros de auditoría'}
              </span>
            }
          />
        </div>

        {/* ── Paginación ── */}
        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          onPrev={prevPage}
          onNext={nextPage}
        />
      </div>

      {/* ── Modal de Detalle ── */}
      <AuditDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        entry={selectedEntry}
      />
    </div>
  );
};
