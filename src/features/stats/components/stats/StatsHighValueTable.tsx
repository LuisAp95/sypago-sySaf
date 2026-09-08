import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { HighValueAlert } from '../../hooks/useStatsData';

interface Props { data: HighValueAlert[]; period: string; }

const ESTADO_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Bloqueada': { bg: 'bg-chart-blocked/10', text: 'text-chart-blocked', border: 'border-chart-blocked/30' },
  'Retenida':  { bg: 'bg-chart-orange/10',  text: 'text-chart-orange',  border: 'border-chart-orange/30'  },
};

const PERIOD_LABEL: Record<string, string> = {
  '24h': 'Últimas 24h', '7d': 'Últimos 7 Días', '30d': 'Últimos 30 Días',
};

const SCORE_COLOR = (s: number) =>
  s >= 9 ? 'text-chart-blocked' : s >= 8 ? 'text-chart-orange' : 'text-amber-400';

export const StatsHighValueTable: React.FC<Props> = ({ data, period }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? data : data.slice(0, 5);

  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Alertas de Transacciones de Alto Valor ({PERIOD_LABEL[period] ?? period})
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Operaciones bloqueadas o retenidas con mayor monto y puntuación de riesgo
          </p>
        </div>
        <span className="text-[10px] text-gray-500 bg-[#1f232b] border border-[#3A393C] px-2 py-1 rounded-md flex-shrink-0">
          {data.length} alertas
        </span>
      </div>

      <div className="rounded-xl overflow-hidden border border-[#2a2d35]">
        {/* Header */}
        <div className="grid grid-cols-8 text-[10px] font-semibold text-gray-500 bg-[#1f232b] px-3 py-2.5">
          <span className="col-span-2">ID Transacción</span>
          <span className="col-span-1">Cliente</span>
          <span>Fecha</span>
          <span className="text-right">Monto (Bs.)</span>
          <span>Canal</span>
          <span>Regla Detonada</span>
          <span className="text-right">Puntuación &nbsp;Estado</span>
        </div>

        {/* Filas */}
        {visible.map((alert, i) => {
          const style = ESTADO_STYLES[alert.estado] ?? { bg: 'bg-gray-800', text: 'text-gray-300', border: 'border-gray-700' };
          return (
            <div
              key={`${alert.id}-${i}`}
              id={`stats-alert-${alert.id}`}
              className={`grid grid-cols-8 items-center text-[11px] px-3 py-2.5 transition-colors duration-150 hover:bg-[#1f232b] ${
                i % 2 === 0 ? 'bg-tertiary' : 'bg-[#1a1d24]'
              } ${i < visible.length - 1 ? 'border-b border-[#2a2d35]' : ''}`}
            >
              <span className="col-span-2 font-mono text-chart-blue text-[10px]">{alert.id}</span>
              <span className="text-gray-300 truncate pr-1">{alert.cliente}</span>
              <span className="text-gray-400">{alert.fecha}</span>
              <span className="text-right text-gray-200 font-semibold tabular-nums">{alert.monto}</span>
              <span className="text-gray-400 truncate pr-1">{alert.canal}</span>
              <span className="text-gray-300">{alert.reglaDetonada}</span>
              <div className="flex items-center justify-end gap-2">
                <span className={`font-bold tabular-nums text-sm ${SCORE_COLOR(alert.puntuacion)}`}>
                  {alert.puntuacion.toFixed(1)}
                </span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold border ${style.bg} ${style.text} ${style.border}`}>
                  {alert.estado}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {data.length > 5 && (
        <button
          id="stats-alerts-show-more"
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-200 transition-colors duration-200 py-1.5"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
          {showAll ? 'Ver menos' : `Ver ${data.length - 5} más`}
        </button>
      )}
    </div>
  );
};
