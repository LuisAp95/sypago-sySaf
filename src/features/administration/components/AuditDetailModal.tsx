import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Download } from 'lucide-react';
import { exportAuditDetailToPdf } from '@/utils/pdfGenerator';
import type { AuditEntry } from '../types/audit.types';
import { AUDIT_ACTION_LABELS, AUDIT_SEVERITY_LABELS } from '../types/audit.types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
    case 'critical':
      return 'critical';
    case 'warning':
      return 'warning';
    default:
      return 'info';
  }
};

const actionVariant = (action: string): string => {
  switch (action) {
    case 'DELETE':
    case 'REJECT':
      return 'critical';
    case 'UPDATE':
    case 'DEACTIVATE':
      return 'warning';
    case 'APPROVE':
    case 'ACTIVATE':
      return 'success';
    default:
      return 'info';
  }
};

// ─── Diff Visual ─────────────────────────────────────────────────────────────

const DiffViewer: React.FC<{ previous?: string; current?: string }> = ({
  previous,
  current,
}) => {
  if (!previous && !current) return null;

  const formatJson = (raw: string | undefined): string => {
    if (!raw) return '—';
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
      {previous && (
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-red-400 uppercase mb-1.5 tracking-wider">
            Valor Anterior
          </span>
          <pre className="bg-[#1a0a0a] border border-red-900/40 rounded-xl p-3 text-xs text-red-300 font-mono whitespace-pre-wrap break-all overflow-auto max-h-48">
            {formatJson(previous)}
          </pre>
        </div>
      )}
      {current && (
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-green-400 uppercase mb-1.5 tracking-wider">
            Valor Nuevo
          </span>
          <pre className="bg-[#0a1a0a] border border-green-900/40 rounded-xl p-3 text-xs text-green-300 font-mono whitespace-pre-wrap break-all overflow-auto max-h-48">
            {formatJson(current)}
          </pre>
        </div>
      )}
    </div>
  );
};

// ─── Fila de detalle ─────────────────────────────────────────────────────────

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2.5 border-b border-[#2b2f3d]/40 last:border-0">
    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-36 shrink-0">
      {label}
    </span>
    <span className="text-sm text-gray-200 break-all">{value}</span>
  </div>
);

// ─── Componente Principal ────────────────────────────────────────────────────

interface AuditDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: AuditEntry | null;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  isOpen,
  onClose,
  entry,
}) => {
  if (!entry) return null;

  const handleDownloadReport = () => {
    if (entry) {
      exportAuditDetailToPdf(entry);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de Evento de Auditoría"
      size="4xl"
      headerLeft={
        <button
          type="button"
          onClick={handleDownloadReport}
          className="p-1.5 rounded-full text-gray-400 bg-tertiary border border-table-border hover:bg-[#393738] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 cursor-pointer"
          title="Descargar reporte PDF"
          aria-label="Descargar reporte PDF"
        >
          <Download className="w-5 h-5" />
        </button>
      }
      className="bg-secondary border border-[#2b2f3d]"
    >
      <div className="space-y-1">
        {/* Header con badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={severityVariant(entry.severity)}>
            {AUDIT_SEVERITY_LABELS[entry.severity]}
          </Badge>
          <Badge variant={actionVariant(entry.action)}>
            {AUDIT_ACTION_LABELS[entry.action]}
          </Badge>
          <span className="text-xs text-gray-500 font-mono ml-auto">
            {entry.id}
          </span>
        </div>

        {/* Información del evento */}
        <div className="bg-[#1E1F20] border border-tertiary/60 rounded-xl p-4">
          <DetailRow label="Fecha / Hora" value={formatDate(entry.timestamp)} />
          <DetailRow label="Usuario" value={`${entry.userName} (${entry.userId})`} />
          <DetailRow
            label="Dirección IP"
            value={<span className="font-mono text-[#2DD4BF]">{entry.userIp}</span>}
          />
          <DetailRow label="Módulo" value={entry.module} />
          <DetailRow
            label="Acción"
            value={AUDIT_ACTION_LABELS[entry.action]}
          />
          <DetailRow label="Tipo de Entidad" value={entry.entityType} />
          <DetailRow
            label="ID Entidad"
            value={<span className="font-mono text-gray-300">{entry.entityId}</span>}
          />
          <DetailRow label="Nombre Entidad" value={entry.entityName} />
          <DetailRow label="Detalles" value={entry.details} />
          <DetailRow
            label="Session ID"
            value={<span className="font-mono text-gray-500 text-xs">{entry.sessionId}</span>}
          />
        </div>

        {/* User Agent */}
        <div className="bg-[#1E1F20] border border-tertiary/60 rounded-xl p-4 mt-3">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            User Agent
          </span>
          <p className="text-xs text-gray-500 font-mono mt-1 break-all leading-relaxed">
            {entry.userAgent}
          </p>
        </div>

        {/* Diff de valores */}
        {(entry.previousValue || entry.newValue) && (
          <div className="bg-[#1E1F20] border border-tertiary/60 rounded-xl p-4 mt-3">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Cambios en Valores
            </span>
            <DiffViewer previous={entry.previousValue} current={entry.newValue} />
          </div>
        )}
      </div>
    </Modal>
  );
};
