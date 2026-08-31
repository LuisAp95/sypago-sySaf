import React, { useState } from 'react';
import type { ChartPoint } from '../types/rule.types';

interface RuleModalChartProps {
  opsData: ChartPoint[];
  amountData: ChartPoint[];
}

export const RuleModalChart: React.FC<RuleModalChartProps> = ({ opsData, amountData }) => {
  const [cursorX, setCursorX] = useState<number>(9.6); // ~09:36 matching reference image

  // Y-axis scales:
  // Ops: 0 to 10
  // Amount: 0 to 5 Millo Bs
  const maxOps = 10;
  const maxAmount = 5;

  const getStepPoints = (data: ChartPoint[], maxY: number) => {
    if (!data || data.length === 0) return '';
    return data
      .map((p) => {
        const x = (p.x / 24) * 1000;
        const y = 180 - (Math.min(p.y, maxY) / maxY) * 160;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const paddingLeft = 60; // Approximate left padding for Y axis ops labels
    const width = rect.width - 120; // Padding left 60px + right 60px
    const hour = Math.max(0, Math.min(24, ((relativeX - paddingLeft) / width) * 24));
    if (!isNaN(hour)) {
      setCursorX(hour);
    }
  };

  return (
    <div className="bg-tertiary rounded-xl border border-[#393738] p-4 flex flex-col gap-3 relative select-none">
      {/* Header & Legend */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-300 font-semibold text-sm">Límites operativos</span>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
            <span>Operaciones por min</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
            <span>Monto máximos</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div
        className="relative h-56 w-full cursor-crosshair"
        onMouseMove={handleMouseMove}
      >
        {/* Y Axis Left (Opm per min) */}
        <div className="absolute left-0 top-2 bottom-8 w-14 flex flex-col justify-between text-[10px] text-gray-400 text-left font-mono">
          <span>10 Opm/min</span>
          <span>8 Opm/min</span>
          <span>6 Opm/min</span>
          <span>4 Opm/min</span>
          <span>2 Opm/min</span>
          <span>0 Opm/min</span>
        </div>

        {/* Y Axis Right (Monto máximo) */}
        <div className="absolute right-0 top-2 bottom-8 w-14 flex flex-col justify-between text-[10px] text-gray-400 text-right font-mono">
          <span>5 Millo Bs</span>
          <span>4 Millo Bs</span>
          <span>3 Millo Bs</span>
          <span>2 Millo Bs</span>
          <span>1 Millo Bs</span>
          <span>0 Millo Bs</span>
        </div>

        {/* Dashed Grid Lines */}
        <div className="absolute left-14 right-14 top-4 bottom-8 flex flex-col justify-between pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-b border-gray-600 border-dashed w-full h-0"></div>
          ))}
        </div>

        {/* SVG Step Lines */}
        <svg
          className="absolute left-14 right-14 top-4 bottom-8 w-[calc(100%-7rem)] h-[calc(100%-3rem)] overflow-visible"
          viewBox="0 0 1000 180"
          preserveAspectRatio="none"
        >
          {/* Blue line: Ops */}
          <polyline
            points={getStepPoints(opsData, maxOps)}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinejoin="miter"
          />
          {/* Orange line: Amount */}
          <polyline
            points={getStepPoints(amountData, maxAmount)}
            fill="none"
            stroke="#F97316"
            strokeWidth="3"
            strokeLinejoin="miter"
          />
        </svg>

        {/* Cursor Vertical Indicator Line with Triangle Marker */}
        <div
          className="absolute top-4 bottom-8 pointer-events-none transition-all duration-75"
          style={{ left: `calc(3.5rem + (${cursorX} / 24) * (100% - 7rem))` }}
        >
          <div className="w-[1.5px] h-full bg-[#EAB308]/90 shadow-[0_0_8px_rgba(234,179,8,0.5)] relative">
            <div className="absolute -bottom-2 -left-[5px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#EAB308]"></div>
          </div>
        </div>

        {/* X Axis Time Labels */}
        <div className="absolute left-14 right-14 bottom-1 flex justify-between text-[11px] text-gray-400 font-mono">
          {['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'].map(
            (time) => (
              <span key={time}>{time}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
};
