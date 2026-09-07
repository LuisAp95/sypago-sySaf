import React from 'react';
import type { RetentionReason } from '../../hooks/useStatsData';

interface StatsRetentionBarsProps {
  retentionReasons: RetentionReason[];
  blockReasons: RetentionReason[];
}

function ReasonList({ title, items, baseColor }: { title: string; items: RetentionReason[]; baseColor: string }) {
  return (
    <div>
      <h4 className="text-xs font-semibold mb-3" style={{ color: baseColor }}>{title}</h4>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] text-gray-300">{item.label}</span>
              <span className="text-[11px] font-semibold tabular-nums" style={{ color: baseColor }}>
                {item.value}
              </span>
            </div>
            <div className="h-1.5 bg-[#2a2d35] rounded-full overflow-hidden">
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
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">Motivos de Retención y Bloqueo</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">Principales causas de intervención en el período</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          <p className="text-gray-500 text-sm col-span-2 text-center py-4">Sin datos disponibles</p>
        )}
      </div>
    </div>
  );
};
