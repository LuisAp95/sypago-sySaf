import React, { useState } from 'react';
import type { ChannelBar } from '../../hooks/useStatsData';

interface StatsChannelBarsProps {
  data: ChannelBar[];
}

const CHANNEL_COLORS: Record<string, string> = {
  'App - Natural':    '#12679A',
  'Web - Natural':    '#0F9949',
  'Otro - Natural':   '#1a8a6a',
  'App - Jurídico':   '#CE6733',
  'Web - Jurídico':   '#CC3233',
  'Otro - Jurídico':  '#8B2FC9',
};

export const StatsChannelBars: React.FC<StatsChannelBarsProps> = ({ data }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  if (!data.length) {
    return (
      <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5 flex items-center justify-center h-64">
        <span className="text-gray-500 text-sm">Sin datos de canales</span>
      </div>
    );
  }

  const max = Math.max(...data.map(d => d.total));

  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">Distribución por Canal</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">Volumen de operaciones por canal de origen</p>
      </div>

      <div className="space-y-3">
        {data.map(channel => {
          const color = CHANNEL_COLORS[channel.channel] || '#6b7280';
          const isHovered = hovered === channel.channel;
          const barWidth = max > 0 ? (channel.total / max) * 100 : 0;

          return (
            <div
              key={channel.channel}
              id={`stats-channel-${channel.channel.toLowerCase().replace(/[\s-]+/g, '-')}`}
              className={`transition-opacity duration-200 ${hovered && !isHovered ? 'opacity-40' : 'opacity-100'}`}
              onMouseEnter={() => setHovered(channel.channel)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Label + conteos */}
              <div className="flex items-center justify-between mb-1 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[11px] text-gray-300 truncate">{channel.channel}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 text-[10px]">
                  {channel.retenidas > 0 && (
                    <span className="text-chart-orange">{channel.retenidas} ret.</span>
                  )}
                  {channel.bloqueadas > 0 && (
                    <span className="text-chart-blocked">{channel.bloqueadas} bloq.</span>
                  )}
                  <span className="text-gray-300 font-semibold tabular-nums">{channel.total}</span>
                </div>
              </div>

              {/* Barra de progreso con desglose */}
              <div className="h-2 bg-[#2a2d35] rounded-full overflow-hidden flex">
                {/* Válidas */}
                {channel.validas > 0 && (
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(channel.validas / channel.total) * barWidth}%`,
                      backgroundColor: '#0F9949',
                    }}
                  />
                )}
                {/* En proceso */}
                {channel.enProceso > 0 && (
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(channel.enProceso / channel.total) * barWidth}%`,
                      backgroundColor: '#12679A',
                    }}
                  />
                )}
                {/* Retenidas */}
                {channel.retenidas > 0 && (
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(channel.retenidas / channel.total) * barWidth}%`,
                      backgroundColor: '#CE6733',
                    }}
                  />
                )}
                {/* Bloqueadas */}
                {channel.bloqueadas > 0 && (
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(channel.bloqueadas / channel.total) * barWidth}%`,
                      backgroundColor: '#CC3233',
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini leyenda de colores de estado */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-[#3A393C]">
        {[
          { label: 'Válidas', color: '#0F9949' },
          { label: 'En proceso', color: '#12679A' },
          { label: 'Retenidas', color: '#CE6733' },
          { label: 'Bloqueadas', color: '#CC3233' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
