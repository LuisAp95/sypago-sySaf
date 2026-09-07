import React, { useState } from 'react';
import type { StatusSlice } from '../../hooks/useStatsData';

interface StatsDonutChartProps {
  data: StatusSlice[];
}

const STROKE_BY_STATUS: Record<string, string> = {
  'Válidas':    '#0F9949',
  'Retenidas':  '#CE6733',
  'Bloqueadas': '#CC3233',
  'En proceso': '#12679A',
};

export const StatsDonutChart: React.FC<StatsDonutChartProps> = ({ data }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  if (!data.length) {
    return (
      <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5 flex items-center justify-center h-64">
        <span className="text-gray-500 text-sm">Sin datos</span>
      </div>
    );
  }

  // Calcular arcos SVG
  const cx = 60, cy = 60, r = 45, innerR = 28;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  const arcs = data.map(slice => {
    const stroke = STROKE_BY_STATUS[slice.label] || '#6b7280';
    const dashArray = (slice.percentage / 100) * circumference;
    const dashOffset = circumference - cumulative * circumference / 100;
    const arc = {
      label: slice.label,
      count: slice.count,
      percentage: slice.percentage,
      stroke,
      dashArray,
      dashOffset,
    };
    cumulative += slice.percentage;
    return arc;
  });

  const total = data.reduce((s, d) => s + d.count, 0);
  const hoveredSlice = hovered ? data.find(d => d.label === hovered) : null;

  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white">Distribución por Estado</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">Basado en {total} operaciones del período</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut SVG */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Fondo */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2d35" strokeWidth="14" />

            {/* Arcos */}
            {arcs.map((arc, i) => (
              <circle
                key={arc.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={arc.stroke}
                strokeWidth={hovered === arc.label ? 16 : 12}
                strokeDasharray={`${arc.dashArray} ${circumference}`}
                strokeDashoffset={arc.dashOffset}
                strokeLinecap="round"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: `${cx}px ${cy}px`,
                  transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                  opacity: hovered && hovered !== arc.label ? 0.35 : 1,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHovered(arc.label)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}

            {/* Centro */}
            <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              {hoveredSlice ? hoveredSlice.percentage : total > 999 ? `${(total / 1000).toFixed(1)}k` : total}
            </text>
            <text x={cx} y={cy + 9} textAnchor="middle" fill="#9ca3af" fontSize="7">
              {hoveredSlice ? hoveredSlice.label : 'Total'}
            </text>
          </svg>
        </div>

        {/* Leyenda */}
        <div className="flex-1 space-y-2 min-w-0">
          {data.map(slice => {
            const stroke = STROKE_BY_STATUS[slice.label] || '#6b7280';
            const isHovered = hovered === slice.label;
            return (
              <div
                key={slice.label}
                id={`stats-donut-${slice.label.toLowerCase().replace(' ', '-')}`}
                className={`flex items-center justify-between gap-2 cursor-pointer transition-opacity duration-200 ${hovered && !isHovered ? 'opacity-40' : 'opacity-100'}`}
                onMouseEnter={() => setHovered(slice.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stroke }} />
                  <span className="text-[11px] text-gray-300 truncate">{slice.label}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-gray-400">{slice.count}</span>
                  <span
                    className="text-[11px] font-semibold tabular-nums"
                    style={{ color: stroke }}
                  >
                    {slice.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
