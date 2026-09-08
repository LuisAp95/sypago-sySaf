import React, { useState } from 'react';
import { Loader } from '@/components/ui/Loader';
import { useStatsData } from '../hooks/useStatsData';

// ─── Componentes del panel ─────────────────────────────────────────────────
import { StatsHeader } from './stats/StatsHeader';
import { StatsKPICard } from './stats/StatsKPICard';
import { StatsVolumeChart } from './stats/StatsVolumeChart';
import { StatsRuleDonut } from './stats/StatsRuleDonut';
import { StatsHighValueTable } from './stats/StatsHighValueTable';
import { StatsChannelBars } from './stats/StatsChannelBars';
import { StatsRetentionBars } from './stats/StatsRetentionBars';
import { StatsProcessTable } from './stats/StatsProcessTable';

export const StatsView: React.FC = () => {
  // ── Estado de filtros — controla TODOS los paneles ──────────────────────
  const [period, setPeriod] = useState('30d');
  const [metricType, setMetric] = useState('cantidades');

  // ── Un solo hook, un solo call al cambiar filtros ───────────────────────
  const {
    kpis, ruleDistribution, volumeChart, highValueAlerts,
    byChannel, retentionReasons, blockReasons, processTimes,
    isLoading,
  } = useStatsData(period, metricType);

  return (
    <div className="space-y-4">

      {/* ── Header (filtros globales) ──────────────────────────────────── */}
      <StatsHeader
        selectedPeriod={period}
        selectedMetricType={metricType}
        onPeriodChange={setPeriod}
        onMetricTypeChange={setMetric}
      />

      {/* ── Loader global ─────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader size="md" text="Calculando métricas…" />
        </div>
      ) : (
        <div
          id="stats-dashboard-content"
          className="space-y-4"
          style={{ animation: 'statsIn 0.35s ease both' }}
        >
          {/* ── Fila 1: 4 KPI Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map((kpi, i) => (
              <StatsKPICard key={kpi.id} kpi={kpi} index={i} />
            ))}
          </div>

          {/* ── Fila 2: Gráfico volumen (60%) + Donut (40%) ─────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <StatsVolumeChart data={volumeChart} />
            </div>
            <div className="lg:col-span-2">
              <StatsRuleDonut data={ruleDistribution} />
            </div>
          </div>

          {/* ── Fila 3: Tabla de alertas de alto valor ───────────────── 
          <StatsHighValueTable data={highValueAlerts} period={period} />*/}

          {/* ── Fila 4: Canales + Motivos de retención/bloqueo ──────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <StatsChannelBars data={byChannel} />
            <StatsRetentionBars
              retentionReasons={retentionReasons}
              blockReasons={blockReasons}
            />
          </div>

          {/* ── Fila 5: Tiempos de procesamiento ────────────────────── */}
          {/*<StatsProcessTable rows={processTimes} /> */}
        </div>
      )}

      {/* ── Animación CSS ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes statsIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
