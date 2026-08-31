import React from 'react';

interface ChartLegendItem {
  label: string;
  colorClass: string;
}

interface ChartSeries {
  id: string;
  label: string;
  colorClass: string;
  stroke: string;
  strokeWidth: number;
  isDashed: boolean;
  hasGlow?: boolean;
  path: string;
}

interface ChartData {
  gridLines: number[];
  xAxisLabels: string[];
  series: ChartSeries[];
}

interface DashboardChartProps {
  legend: ChartLegendItem[];
  data: ChartData;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ legend, data }) => {
  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-6 shadow-xl space-y-2">
      {/* Chart Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white tracking-wide">Operaciones</h2>

        {/* Legend using exact theme chart colors */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
          {legend?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.colorClass}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Visual Representation */}
      <div className="relative w-full h-72 bg-tertiary border border-[#3A393C] shadow-inner rounded-xl p-4 flex flex-col justify-between overflow-hidden">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none opacity-20">
          {data?.gridLines?.map((_, idx) => (
            <div key={idx} className="w-full border-b border-dashed border-gray-600" />
          ))}
        </div>

        {/* Wave Chart SVG using chart colors */}
        <div className="relative flex-1 min-h-0 w-full flex items-center justify-center mb-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="glow-validas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(15, 153, 73, 0.3)" />
                <stop offset="100%" stopColor="rgba(15, 153, 73, 0)" />
              </linearGradient>
            </defs>
            {data?.series?.map((serie) => (
              <g key={serie.id}>
                {serie.hasGlow && (
                  <path
                    d={`${serie.path} L 1000 200 L 0 200 Z`}
                    fill="url(#glow-validas)"
                    stroke="none"
                    className="transition-all duration-700 ease-in-out"
                  />
                )}
                <path
                  d={serie.path}
                  fill="none"
                  stroke={serie.stroke}
                  strokeWidth={serie.strokeWidth}
                  strokeDasharray={serie.isDashed ? "4 4" : "none"}
                  className={`transition-all duration-700 ease-in-out ${serie.hasGlow ? "drop-shadow-[0_0_8px_rgba(15,153,73,0.6)]" : ""}`}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* X Axis Time Labels */}
        <div className="flex justify-between text-[10px] md:text-[11px] text-gray-400 font-mono pt-2 border-t border-[#3A393C] relative z-10 shrink-0 min-w-full px-1 bg-tertiary">
          {data?.xAxisLabels?.map((label, idx) => (
            <span key={idx} className="text-center select-none">{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
