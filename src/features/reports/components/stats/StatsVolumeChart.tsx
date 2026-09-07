import React, { useState } from 'react';
import type { VolumeChartData } from '../../hooks/useStatsData';

interface Props { data: VolumeChartData | null; }

const SERIES = [
  { key: 'total',    label: 'Volumen total',    stroke: '#06b6d4', fill: '#06b6d4' },
  { key: 'rechazos', label: 'Volumen de rechazos', stroke: '#f87171', fill: '#f87171' },
];

export const StatsVolumeChart: React.FC<Props> = ({ data }) => {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const toggle = (key: string) => setHidden(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });

  if (!data) return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5 flex items-center justify-center h-56">
      <span className="text-gray-500 text-sm">Sin datos de tendencia</span>
    </div>
  );

  const totalPath    = data.totalPath;
  const rechazosPath = data.rechazosPath;

  // Área de relleno: cerrar el path en la parte inferior
  const areaTotal    = `${totalPath}    L 1000 210 L 0 210 Z`;
  const areaRechazos = `${rechazosPath} L 1000 210 L 0 210 Z`;

  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{data.title}</h3>
        </div>
        {/* Leyenda interactiva */}
        <div className="flex items-center gap-4">
          {SERIES.map(s => (
            <button
              key={s.key}
              id={`stats-vol-legend-${s.key}`}
              onClick={() => toggle(s.key)}
              className={`flex items-center gap-2 text-[11px] font-medium transition-opacity duration-200 ${hidden.has(s.key) ? 'opacity-30' : 'opacity-100'}`}
            >
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: s.stroke }}
              />
              <span className="text-gray-300">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG */}
      <div className="flex gap-3">
        {/* Eje Y */}
        <div className="flex flex-col justify-between py-1 flex-shrink-0">
          {data.yAxisLabels.map((l, i) => (
            <span key={i} className="text-[9px] text-gray-500 text-right w-10">{l}</span>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 min-w-0">
          <svg viewBox="0 -10 1000 230" className="w-full h-44" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="gradRechazos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#f87171" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f87171" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Grid */}
            {[20, 50, 80, 110, 140, 170, 200].map(y => (
              <line key={y} x1="0" y1={y} x2="1000" y2={y}
                stroke="#2a2d35" strokeWidth="0.8" />
            ))}

            {/* Volumen total */}
            {!hidden.has('total') && (
              <g>
                <path d={areaTotal}    fill="url(#gradTotal)" />
                <path d={totalPath}    fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}

            {/* Volumen rechazos */}
            {!hidden.has('rechazos') && (
              <g>
                <path d={areaRechazos} fill="url(#gradRechazos)" />
                <path d={rechazosPath} fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </svg>

          {/* Eje X */}
          <div className="flex justify-between mt-1 px-0.5">
            {data.xAxisLabels.map((l, i) => (
              <span key={i} className="text-[9px] text-gray-500">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
