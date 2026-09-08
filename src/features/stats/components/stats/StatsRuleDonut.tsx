import React, { useState } from 'react';
import type { RuleSlice } from '../../hooks/useStatsData';

interface Props { data: RuleSlice[]; }

export const StatsRuleDonut: React.FC<Props> = ({ data }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  if (!data.length) return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5 flex items-center justify-center h-full min-h-[200px]">
      <span className="text-gray-500 text-sm">Sin datos</span>
    </div>
  );

  // SVG donut params
  const cx = 80, cy = 80, r = 58, innerR = 36;
  const circumference = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.pct, 0);
  let cumPct = 0;

  interface ArcDef { label: string; pct: number; color: string; count: number; dashArray: number; dashOffset: number; }
  const arcs: ArcDef[] = data.map(slice => {
    const dashArray  = (slice.pct / total) * circumference;
    const dashOffset = circumference - (cumPct / total) * circumference;
    cumPct += slice.pct;
    return { ...slice, dashArray, dashOffset };
  });

  const hoveredSlice = hovered ? data.find(d => d.label === hovered) : null;

  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5 flex flex-col">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white">Distribución de Rechazos por Tipo de Regla</h3>
      </div>

      {/* Leyenda de colores — arriba */}
      <div className="flex flex-wrap gap-3 mb-4">
        {data.map(slice => (
          <button
            key={slice.label}
            id={`stats-rule-legend-${slice.label.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setHovered(hovered === slice.label ? null : slice.label)}
            className={`flex items-center gap-1.5 text-[10px] font-medium transition-opacity duration-200 ${hovered && hovered !== slice.label ? 'opacity-30' : 'opacity-100'}`}
          >
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: slice.color }} />
            <span className="text-gray-300">{slice.label}</span>
          </button>
        ))}
      </div>

      {/* Donut + labels */}
      <div className="flex items-center gap-4 flex-1">
        {/* SVG Donut */}
        <div className="relative flex-shrink-0">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Fondo */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2d35" strokeWidth="18" />

            {/* Arcos */}
            {arcs.map(arc => (
              <circle
                key={arc.label}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={arc.color}
                strokeWidth={hovered === arc.label ? 22 : 16}
                strokeDasharray={`${arc.dashArray} ${circumference}`}
                strokeDashoffset={arc.dashOffset}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: `${cx}px ${cy}px`,
                  transition: 'stroke-width 0.25s ease, opacity 0.25s ease',
                  opacity: hovered && hovered !== arc.label ? 0.3 : 1,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHovered(arc.label)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}

            {/* Centro */}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
              {hoveredSlice ? `${hoveredSlice.pct}%` : `${total}%`}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="#9ca3af" fontSize="8.5">
              {hoveredSlice ? hoveredSlice.label : 'Rechazos'}
            </text>
          </svg>
        </div>

        {/* Tabla de valores */}
        <div className="flex-1 space-y-2 min-w-0">
          {data.map(slice => {
            const isHov = hovered === slice.label;
            return (
              <div
                key={slice.label}
                id={`stats-rule-row-${slice.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center justify-between gap-2 cursor-pointer transition-opacity duration-200 ${hovered && !isHov ? 'opacity-30' : 'opacity-100'}`}
                onMouseEnter={() => setHovered(slice.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="text-[11px] text-gray-300 truncate">{slice.label}</span>
                </div>
                {/* Mini barra */}
                <div className="w-20 h-1.5 bg-[#2a2d35] rounded-full overflow-hidden flex-shrink-0">
                  <div className="h-full rounded-full" style={{ width: `${slice.pct}%`, backgroundColor: slice.color }} />
                </div>
                <span className="text-[11px] font-bold tabular-nums flex-shrink-0" style={{ color: slice.color }}>
                  {slice.pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
