import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ReportRecord } from '../../hooks/useStatsData';

interface StatsRecentTableProps {
  data: ReportRecord[];
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Válidas':    { bg: 'bg-chart-green/10',   text: 'text-chart-green',   border: 'border-chart-green/30' },
  'Retenidas':  { bg: 'bg-chart-orange/10',  text: 'text-chart-orange',  border: 'border-chart-orange/30' },
  'Bloqueadas': { bg: 'bg-chart-blocked/10', text: 'text-chart-blocked', border: 'border-chart-blocked/30' },
  'En proceso': { bg: 'bg-chart-blue/10',    text: 'text-chart-blue',    border: 'border-chart-blue/30' },
};

const TYPE_LABELS: Record<string, string> = {
  'credito': 'Crédito',
  'debito':  'Débito',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function formatAmount(amount: string): string {
  return `Bs. ${amount}`;
}

export const StatsRecentTable: React.FC<StatsRecentTableProps> = ({ data }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? data : data.slice(0, 8);

  if (!data.length) {
    return (
      <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5 flex items-center justify-center h-32">
        <span className="text-gray-500 text-sm">Sin operaciones recientes</span>
      </div>
    );
  }

  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Operaciones Recientes</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Top 10 transacciones más recientes del sistema</p>
        </div>
        <span className="text-[10px] text-gray-500 bg-[#1f232b] border border-[#3A393C] px-2 py-1 rounded-md">
          {data.length} ops
        </span>
      </div>

      {/* Tabla */}
      <div className="rounded-xl overflow-hidden border border-[#2a2d35]">
        {/* Header */}
        <div className="grid grid-cols-6 text-[10px] font-semibold text-gray-500 bg-[#1f232b] px-4 py-2">
          <span className="col-span-2">ID Transacción</span>
          <span>Tipo</span>
          <span>Monto</span>
          <span>Canal</span>
          <span className="text-right">Estado</span>
        </div>

        {/* Filas */}
        {visible.map((op, i) => {
          const style = STATUS_STYLES[op.status] || { bg: 'bg-gray-800', text: 'text-gray-300', border: 'border-gray-700' };
          return (
            <div
              key={op.id}
              id={`stats-recent-${op.id}`}
              className={`grid grid-cols-6 items-center text-[11px] px-4 py-2.5 transition-colors duration-150 hover:bg-[#1f232b] cursor-default ${
                i % 2 === 0 ? 'bg-tertiary' : 'bg-[#1a1d24]'
              } ${i < visible.length - 1 ? 'border-b border-[#2a2d35]' : ''}`}
            >
              <span className="col-span-2 font-mono text-chart-blue text-[10px]">{op.id}</span>
              <span className="text-gray-300">{TYPE_LABELS[op.type] || op.type}</span>
              <span className="text-gray-200 font-medium tabular-nums">{formatAmount(op.amount)}</span>
              <span className="text-gray-400 truncate pr-2">{op.channel}</span>
              <div className="flex justify-end">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-semibold border ${style.bg} ${style.text} ${style.border}`}>
                  {op.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ver más */}
      {data.length > 8 && (
        <button
          id="stats-recent-show-more"
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-200 transition-colors duration-200 py-1.5"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
          {showAll ? 'Ver menos' : `Ver ${data.length - 8} más`}
        </button>
      )}
    </div>
  );
};
