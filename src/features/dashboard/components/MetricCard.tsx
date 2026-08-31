import React from 'react';
import { Layers, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Layers,
  AlertTriangle,
  ShieldAlert,
  Info
};

export interface MetricCardProps {
  card: any;
}

export const MetricCard: React.FC<MetricCardProps> = ({ card }) => {
  const IconComponent = ICON_MAP[card.icon] || Info;

  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5 space-y-2 shadow-lg">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 ${card.iconBg} ${card.iconColor} rounded-xl border ${card.iconBorder}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-gray-400 font-medium">{card.title}</span>
          <div className="text-xl font-bold text-white tracking-tight">
            {card.value} <span className="text-sm font-normal text-gray-400">{card.total}</span>
          </div>
        </div>
      </div>

      <div className={card.sections?.length > 1 ? "grid grid-cols-2 gap-4 text-xs pt-2 border-t border-[#3A393C]" : "space-y-2 text-xs pt-2 border-t border-[#3A393C]"}>
        {card.sections?.map((section: any, sIdx: number) => (
          <div key={sIdx} className={`${section.stacked ? "space-y-3" : "space-y-2"} ${card.sections?.length > 1 && sIdx === 0 ? "border-r border-[#3A393C] pr-2" : ""}`}>
            <span className="text-gray-400 font-medium block">{section.title}</span>
            {section.isTable ? (
              <div className="bg-tertiary border border-[#3A393C] rounded-lg p-2 text-[10px] space-y-1 shadow-md">
                <div className="grid grid-cols-4 text-gray-500 font-semibold border-b border-[#3A393C] pb-1">
                  {section.headers?.map((h: string, hIdx: number) => (
                    <span key={hIdx} className={hIdx > 0 ? "text-right" : ""}>{h}</span>
                  ))}
                </div>
                {section.rows?.map((row: any, rIdx: number) => (
                  <div key={rIdx} className="grid grid-cols-4 text-gray-300">
                    <span>{row.interval}</span>
                    <span className={`text-right ${section.highlightRows ? 'text-chart-blue' : ''}`}>{row.prom}</span>
                    <span className={`text-right ${section.highlightRows ? 'text-chart-blue' : ''}`}>{row.min}</span>
                    <span className={`text-right ${section.highlightRows ? 'text-chart-blue' : ''}`}>{row.max}</span>
                  </div>
                ))}
              </div>
            ) : section.stacked ? (
              <div className="space-y-2">
                {section.items?.map((item: any, iIdx: number) => (
                  <div key={iIdx}>
                    <span className="text-[11px] text-gray-400 block">{item.label}</span>
                    <span className="text-sm font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 mt-1">
                {section.items?.map((item: any, iIdx: number) => (
                  <div key={iIdx} className={item.barColor ? "" : "space-y-0.5"}>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">{item.label}</span>
                      <span className={item.barColor ? "text-gray-300" : "text-gray-200 font-medium"}>
                        {item.value}
                      </span>
                    </div>
                    {item.barColor && (
                      <div className="w-full bg-barra h-1.5 rounded-full overflow-hidden mt-0.5 shadow-inner">
                        <div className={`${item.barColor} h-full`} style={{ width: item.percentage }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
