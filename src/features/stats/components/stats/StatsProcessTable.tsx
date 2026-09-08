import React from 'react';
import { Clock } from 'lucide-react';
import type { ProcessTimeRow } from '../../hooks/useStatsData';

interface StatsProcessTableProps {
  rows: ProcessTimeRow[];
}

export const StatsProcessTable: React.FC<StatsProcessTableProps> = ({ rows }) => {
  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-chart-blue" />
        <div>
          <h3 className="text-sm font-semibold text-white">Tiempos de Procesamiento</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Latencia promedio, mínima y máxima por intervalo</p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-[#2a2d35]">
        {/* Encabezado */}
        <div className="grid grid-cols-4 text-[10px] font-semibold text-gray-500 bg-[#1f232b] px-4 py-2">
          <span>Intervalo</span>
          <span className="text-right">Promedio</span>
          <span className="text-right">Mínimo</span>
          <span className="text-right">Máximo</span>
        </div>

        {/* Filas */}
        {rows.map((row, i) => (
          <div
            key={i}
            id={`stats-process-row-${i}`}
            className={`grid grid-cols-4 text-[11px] px-4 py-2.5 transition-colors duration-150 hover:bg-[#1f232b] ${
              i % 2 === 0 ? 'bg-tertiary' : 'bg-[#1a1d24]'
            } ${i < rows.length - 1 ? 'border-b border-[#2a2d35]' : ''}`}
          >
            <span className="text-gray-300 font-medium">{row.interval}</span>
            <span className="text-right text-chart-blue font-semibold tabular-nums">{row.prom}</span>
            <span className="text-right text-chart-green tabular-nums">{row.min}</span>
            <span className="text-right text-chart-orange tabular-nums">{row.max}</span>
          </div>
        ))}
      </div>

      {/* Footer informativo */}
      <p className="text-[10px] text-gray-500 mt-3 text-center">
        Los valores reflejan el procesamiento del motor de reglas SAF
      </p>
    </div>
  );
};
