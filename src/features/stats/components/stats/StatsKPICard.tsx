import React from 'react';
import { TrendingUp, TrendingDown, Layers, AlertTriangle, ShieldAlert, Eye } from 'lucide-react';
import type { KPI } from '../../hooks/useStatsData';

const ICON_CONFIG = [
  { Icon: ShieldAlert, iconBg: 'bg-red-500/15',    iconColor: 'text-red-400',    border: 'border-red-500/30'    },
  { Icon: Layers,      iconBg: 'bg-chart-blue/15',  iconColor: 'text-chart-blue', border: 'border-chart-blue/30' },
  { Icon: Eye,         iconBg: 'bg-[#06b6d4]/15',   iconColor: 'text-[#06b6d4]',  border: 'border-[#06b6d4]/30'  },
  { Icon: AlertTriangle,iconBg:'bg-amber-500/15',   iconColor: 'text-amber-400',  border: 'border-amber-500/30'  },
];

const SPARKLINE_COLORS = [
  '#CC3233', '#12679A', '#06b6d4', '#CE6733',
];

interface Props { kpi: KPI; index: number; }

export const StatsKPICard: React.FC<Props> = ({ kpi, index }) => {
  const { Icon, iconBg, iconColor, border } = ICON_CONFIG[index] ?? ICON_CONFIG[0];
  const sparkColor = SPARKLINE_COLORS[index] ?? '#12679A';

  const trendColor = kpi.goodTrend === null
    ? 'text-gray-400'
    : kpi.goodTrend
      ? (kpi.trendDir === 'down' ? 'text-chart-green' : 'text-chart-green')
      : (kpi.trendDir === 'up'   ? 'text-chart-blocked' : 'text-chart-orange');

  const TrendIcon = kpi.trendDir === 'up' ? TrendingUp : TrendingDown;

  return (
    <div
      id={`stats-kpi-${kpi.id}`}
      className="relative bg-tertiary border border-[#3A393C] rounded-2xl p-4 overflow-hidden group
                 hover:border-[#4A494C] transition-all duration-300 flex flex-col gap-3"
    >
      {/* Glow de fondo */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 20% 20%, ${sparkColor}0a 0%, transparent 65%)` }}
      />

      {/* Fila superior: título + icono */}
      <div className="relative flex items-start justify-between gap-2">
        <span className="text-[11px] text-gray-400 font-medium leading-tight flex-1">{kpi.title}</span>
        <div className={`p-1.5 ${iconBg} ${iconColor} rounded-lg border ${border} flex-shrink-0`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Valor principal */}
      <div className="relative my-2 flex-1 flex flex-col justify-center gap-1.5">
        <div className="text-3xl font-bold text-white tracking-tight leading-none">
          {kpi.value}
        </div>
        {kpi.subValue && (
          <div className="text-lg font-semibold text-gray-200 leading-tight">{kpi.subValue}</div>
        )}
      </div>

      {/* Trend */}
      {kpi.trend && (
        <div className="relative flex items-center gap-1.5">
          <TrendIcon className={`w-3 h-3 ${trendColor}`} />
          <span className={`text-[11px] font-semibold ${trendColor}`}>{kpi.trend}</span>
          {kpi.trendLabel && (
            <span className="text-[10px] text-gray-500">{kpi.trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};
