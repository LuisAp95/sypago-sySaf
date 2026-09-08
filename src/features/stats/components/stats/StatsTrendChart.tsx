import React, { useState } from 'react';

interface Serie {
  id: string;
  label: string;
  stroke: string;
  strokeWidth: number;
  isDashed?: boolean;
  hasGlow?: boolean;
  path: string;
}

interface ChartData {
  gridLines: number[];
  xAxisLabels: string[];
  series: Serie[];
}

interface ChartLegendItem {
  label: string;
  colorClass: string;
}

interface StatsTrendChartProps {
  data: ChartData | null;
  legend: ChartLegendItem[];
}

const STROKE_MAP: Record<string, string> = {
  'bg-chart-blue':    '#12679A',
  'bg-chart-green':   '#0F9949',
  'bg-chart-orange':  '#CE6733',
  'bg-chart-blocked': '#CC3233',
  'bg-chart-yellow':  '#C8A020',
};

export const StatsTrendChart: React.FC<StatsTrendChartProps> = ({ data, legend }) => {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const toggleSerie = (id: string) => {
    setHiddenSeries(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!data) {
    return (
      <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5 flex items-center justify-center h-48">
        <span className="text-gray-500 text-sm">Sin datos de tendencia</span>
      </div>
    );
  }

  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Tendencia de Operaciones</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Evolución por estado en el período seleccionado</p>
        </div>
        {/* Leyenda interactiva */}
        <div className="flex flex-wrap gap-3 justify-end">
          {legend.map((item, i) => {
            const serieId = data.series[i]?.id || item.label.toLowerCase();
            const isHidden = hiddenSeries.has(serieId);
            const strokeColor = STROKE_MAP[item.colorClass] || '#888';
            return (
              <button
                key={item.label}
                id={`stats-legend-${serieId}`}
                onClick={() => toggleSerie(serieId)}
                className={`flex items-center gap-1.5 text-[11px] font-medium transition-opacity duration-200 ${isHidden ? 'opacity-30' : 'opacity-100'}`}
              >
                <span
                  className="inline-block w-4 h-[2px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: strokeColor }}
                />
                <span className="text-gray-300">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          viewBox="0 -10 1000 230"
          className="w-full h-48"
          preserveAspectRatio="none"
        >
          {/* Definición de gradientes */}
          <defs>
            {data.series.map(s => (
              <linearGradient key={`grad-${s.id}`} id={`grad-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.stroke} stopOpacity="0.15" />
                <stop offset="100%" stopColor={s.stroke} stopOpacity="0" />
              </linearGradient>
            ))}
            {data.series.filter(s => s.hasGlow).map(s => (
              <filter key={`glow-${s.id}`} id={`glow-${s.id}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
          </defs>

          {/* Líneas de cuadrícula */}
          {data.gridLines.map((y, i) => (
            <line
              key={i}
              x1="0" y1={y}
              x2="1000" y2={y}
              stroke="#3A393C"
              strokeWidth="0.5"
              strokeDasharray="4,4"
            />
          ))}

          {/* Series de datos */}
          {data.series.map(s => {
            if (hiddenSeries.has(s.id)) return null;
            const fillPath = s.path + ' L 1000 210 L 0 210 Z';
            return (
              <g key={s.id}>
                {/* Área de relleno */}
                <path
                  d={fillPath}
                  fill={`url(#grad-${s.id})`}
                />
                {/* Línea */}
                <path
                  d={s.path}
                  fill="none"
                  stroke={s.stroke}
                  strokeWidth={s.strokeWidth}
                  strokeDasharray={s.isDashed ? '6,4' : undefined}
                  filter={s.hasGlow ? `url(#glow-${s.id})` : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
        </svg>

        {/* Etiquetas eje X */}
        <div className="flex justify-between mt-1 px-0">
          {data.xAxisLabels.map((label, i) => (
            <span key={i} className="text-[10px] text-gray-500 font-medium">{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
