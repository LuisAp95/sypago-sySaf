import React from 'react';
import type { RetentionReason } from '../../hooks/useStatsData';

interface StatsRetentionBarsProps {
  retentionReasons: RetentionReason[];
  blockReasons: RetentionReason[];
}

function ReasonList({ title, items, baseColor }: { title: string; items: RetentionReason[]; baseColor: string }) {
  return (
    <div className="flex flex-col">
      <h4 className="text-sm font-semibold mb-5" style={{ color: baseColor }}>{title}</h4>
      <div className="space-y-5 flex-1">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] font-medium text-gray-300">{item.label}</span>
              <span className="text-[13px] font-bold tabular-nums" style={{ color: baseColor }}>
                {item.value}
              </span>
            </div>
            <div className="h-2.5 bg-[#2a2d35] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: item.percentage,
                  backgroundColor: baseColor,
                  opacity: 0.7 + i * 0.1,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const StatsRetentionBars: React.FC<StatsRetentionBarsProps> = ({ retentionReasons, blockReasons }) => {
  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-6 flex flex-col h-full min-h-[300px]">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white">Motivos de Retención y Bloqueo</h3>
        <p className="text-xs text-gray-400 mt-1">Principales causas de intervención en el período</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1">
        {retentionReasons.length > 0 && (
          <ReasonList
            title="Retención"
            items={retentionReasons}
            baseColor="#CE6733"
          />
        )}
        {blockReasons.length > 0 && (
          <ReasonList
            title="Bloqueo"
            items={blockReasons}
            baseColor="#CC3233"
          />
        )}
        {!retentionReasons.length && !blockReasons.length && (
          <p className="text-gray-500 text-sm col-span-2 text-center py-4 flex-1">Sin datos disponibles</p>
        )}
      </div>
    </div>
  );
};
