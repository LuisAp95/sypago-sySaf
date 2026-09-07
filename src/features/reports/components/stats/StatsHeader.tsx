import React, { useRef, useState } from 'react';
import { Download, SlidersHorizontal, ChevronDown, Calendar } from 'lucide-react';

interface StatsHeaderProps {
  selectedPeriod: string;
  selectedMetricType: string;
  onPeriodChange: (v: string) => void;
  onMetricTypeChange: (v: string) => void;
}

const PERIOD_LABELS: Record<string, string> = {
  '24h': 'Últimas 24 Horas',
  '7d':  'Últimos 7 Días',
  '30d': 'Últimos 30 Días',
};

const PERIODS = [
  { label: 'Últimas 24 Horas', value: '24h' },
  { label: 'Últimos 7 Días',   value: '7d'  },
  { label: 'Últimos 30 Días',  value: '30d' },
];

const METRIC_TYPES = [
  { label: 'Cantidades', value: 'cantidades' },
  { label: 'Montos',     value: 'montos'     },
];

export const StatsHeader: React.FC<StatsHeaderProps> = ({
  selectedPeriod, selectedMetricType, onPeriodChange, onMetricTypeChange,
}) => {
  const [periodOpen, setPeriodOpen] = useState(false);
  const [metricOpen, setMetricOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      {/* Título */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Estadísticas Avanzadas</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Métricas en tiempo real sobre tasa de rechazo, volumen transaccional y falsos positivos.
        </p>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Dropdown — Período */}
        <div className="relative">
          <button
            id="stats-period-dropdown"
            onClick={() => { setPeriodOpen(p => !p); setMetricOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-[#1f232b] border border-[#3A393C] text-gray-300 hover:border-chart-blue/50 hover:text-white rounded-lg transition-all duration-200 min-w-[160px] justify-between"
          >
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-chart-blue" />
              <span>{PERIOD_LABELS[selectedPeriod] ?? 'Período'}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${periodOpen ? 'rotate-180' : ''}`} />
          </button>

          {periodOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-[#1f232b] border border-[#3A393C] rounded-xl shadow-xl z-50 overflow-hidden">
              {PERIODS.map(p => (
                <button
                  key={p.value}
                  id={`stats-period-${p.value}`}
                  onClick={() => { onPeriodChange(p.value); setPeriodOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors duration-150 ${
                    selectedPeriod === p.value
                      ? 'bg-chart-blue/20 text-chart-blue font-medium'
                      : 'text-gray-300 hover:bg-[#2a2d35] hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown — Tipo de Métrica */}
        <div className="relative">
          <button
            id="stats-metric-dropdown"
            onClick={() => { setMetricOpen(p => !p); setPeriodOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-[#1f232b] border border-[#3A393C] text-gray-300 hover:border-chart-blue/50 hover:text-white rounded-lg transition-all duration-200 min-w-[110px] justify-between"
          >
            <span>{METRIC_TYPES.find(m => m.value === selectedMetricType)?.label ?? 'Tipo'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${metricOpen ? 'rotate-180' : ''}`} />
          </button>

          {metricOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-[#1f232b] border border-[#3A393C] rounded-xl shadow-xl z-50 overflow-hidden">
              {METRIC_TYPES.map(m => (
                <button
                  key={m.value}
                  id={`stats-metric-${m.value}`}
                  onClick={() => { onMetricTypeChange(m.value); setMetricOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors duration-150 ${
                    selectedMetricType === m.value
                      ? 'bg-chart-blue/20 text-chart-blue font-medium'
                      : 'text-gray-300 hover:bg-[#2a2d35] hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exportar */}
        <button
          id="stats-export-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1f232b] border border-[#3A393C] text-gray-400 hover:text-gray-200 hover:border-gray-500 rounded-lg transition-all duration-200"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar</span>
        </button>

        {/* Filtros */}
        <button
          id="stats-filters-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1f232b] border border-[#3A393C] text-gray-400 hover:text-gray-200 hover:border-gray-500 rounded-lg transition-all duration-200"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Cerrar dropdowns al hacer click fuera */}
      {(periodOpen || metricOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setPeriodOpen(false); setMetricOpen(false); }}
        />
      )}
    </div>
  );
};
