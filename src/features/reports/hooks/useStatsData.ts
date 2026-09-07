import { useState, useEffect, useMemo } from 'react';
import { api } from '../../../mocks/api';

// ─── Tipos exportados ──────────────────────────────────────────────────────

export interface ReportRecord {
  id: string; type: string; status: string; creationDate: string;
  issuerDocument: string; receiverDocument: string;
  amount: string; processTime: string; channel: string;
}

export interface KPI {
  id: string; title: string; value: string; subValue: string;
  trend: string | null; trendDir: 'up' | 'down' | null;
  trendLabel: string | null; goodTrend: boolean | null;
  sparkline: number[];
}

export interface RuleSlice {
  label: string; pct: number; color: string; count: number;
}

export interface VolumeChartData {
  title: string;
  xAxisLabels: string[];
  yAxisLabels: string[];
  totalPath: string;
  rechazosPath: string;
}

export interface HighValueAlert {
  id: string; cliente: string; fecha: string; monto: string;
  canal: string; reglaDetonada: string; puntuacion: number; estado: string;
}

export interface ChannelStat {
  channel: string; total: number; validas: number;
  retenidas: number; bloqueadas: number; enProceso: number; pct: number;
}

export interface ProcessTimeRow { interval: string; prom: string; min: string; max: string; }
export interface RetentionReason { label: string; value: string; percentage: string; barColor: string; }

export interface StatsState {
  kpis: KPI[];
  ruleDistribution: RuleSlice[];
  volumeChart: VolumeChartData | null;
  highValueAlerts: HighValueAlert[];
  byChannel: ChannelStat[];
  retentionReasons: RetentionReason[];
  blockReasons: RetentionReason[];
  processTimes: ProcessTimeRow[];
  isLoading: boolean;
}

// ─── Sparklines sintéticos por KPI ────────────────────────────────────────
const SPARKLINES = [
  [30, 45, 35, 55, 42, 60, 48, 55, 52, 58, 50, 62],   // tasa rechazo
  [50, 60, 55, 70, 65, 80, 72, 85, 78, 90, 82, 95],   // volumen
  [80, 65, 75, 60, 70, 55, 65, 50, 60, 45, 55, 42],   // falsos positivos
  [20, 35, 25, 40, 30, 45, 35, 50, 38, 45, 40, 48],   // alto riesgo
];

// ─── Hook principal ────────────────────────────────────────────────────────
export function useStatsData(period: string, metricType: string): StatsState {
  const [raw, setRaw]         = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getStatsExtended(period, metricType)
      .then(setRaw)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [period, metricType]);

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const kpis = useMemo<KPI[]>(() => {
    if (!raw) return [];
    const { dashStats, kpiTrends, reports } = raw;
    const cards   = dashStats?.metricCards || [];
    const trends  = kpiTrends || {};
    const total   = reports?.length || 0;
    const bloq    = reports?.filter((r: ReportRecord) => r.status === 'Bloqueadas').length || 0;
    const ret     = reports?.filter((r: ReportRecord) => r.status === 'Retenidas').length || 0;
    const tasaVal = total > 0 ? ((bloq / total) * 100).toFixed(2) + '%' : '0%';

    return [
      {
        id: 'tasaRechazo', title: 'Tasa de Rechazo Global',
        value: tasaVal, subValue: `${bloq} bloqueadas de ${total} ops`,
        trend: trends.tasaRechazo?.trend ?? null,
        trendDir: trends.tasaRechazo?.trendDir ?? null,
        trendLabel: trends.tasaRechazo?.trendLabel ?? null,
        goodTrend: trends.tasaRechazo?.goodTrend ?? null,
        sparkline: SPARKLINES[0],
      },
      {
        id: 'volumen', title: 'Volumen Transaccional Total',
        value: cards[0]?.value ?? '—', subValue: cards[0]?.total ?? '',
        trend: trends.volumen?.trend ?? null,
        trendDir: trends.volumen?.trendDir ?? null,
        trendLabel: trends.volumen?.trendLabel ?? null,
        goodTrend: trends.volumen?.goodTrend ?? null,
        sparkline: SPARKLINES[1],
      },
      {
        id: 'falsosPositivos', title: 'Falsos Positivos Confirmados',
        value: cards[1]?.value ?? String(ret), subValue: cards[1]?.total ?? '',
        trend: trends.falsosPositivos?.trend ?? null,
        trendDir: trends.falsosPositivos?.trendDir ?? null,
        trendLabel: trends.falsosPositivos?.trendLabel ?? null,
        goodTrend: trends.falsosPositivos?.goodTrend ?? null,
        sparkline: SPARKLINES[2],
      },
      {
        id: 'altoRiesgo', title: 'Transacciones de Alto Riesgo',
        value: cards[2]?.value ?? String(bloq), subValue: cards[2]?.total ?? '',
        trend: null, trendDir: null, trendLabel: null, goodTrend: null,
        sparkline: SPARKLINES[3],
      },
    ];
  }, [raw]);

  // ── Distribución reglas ──────────────────────────────────────────────────
  const ruleDistribution = useMemo<RuleSlice[]>(() => raw?.ruleDistribution ?? [], [raw]);

  // ── Volume chart ─────────────────────────────────────────────────────────
  const volumeChart = useMemo<VolumeChartData | null>(() => raw?.volumeChart ?? null, [raw]);

  // ── Alertas alto valor ────────────────────────────────────────────────────
  const highValueAlerts = useMemo<HighValueAlert[]>(() => raw?.highValueAlerts ?? [], [raw]);

  // ── Por canal ─────────────────────────────────────────────────────────────
  const byChannel = useMemo<ChannelStat[]>(() => {
    const reports: ReportRecord[] = raw?.reports ?? [];
    if (!reports.length) return [];
    const map: Record<string, ChannelStat> = {};
    reports.forEach(r => {
      if (!map[r.channel]) map[r.channel] = { channel: r.channel, total: 0, validas: 0, retenidas: 0, bloqueadas: 0, enProceso: 0, pct: 0 };
      map[r.channel].total++;
      if (r.status === 'Válidas')    map[r.channel].validas++;
      if (r.status === 'Retenidas')  map[r.channel].retenidas++;
      if (r.status === 'Bloqueadas') map[r.channel].bloqueadas++;
      if (r.status === 'En proceso') map[r.channel].enProceso++;
    });
    const max = Math.max(...Object.values(map).map(c => c.total));
    return Object.values(map)
      .map(c => ({ ...c, pct: Math.round((c.total / max) * 100) }))
      .sort((a, b) => b.total - a.total);
  }, [raw]);

  // ── Motivos ───────────────────────────────────────────────────────────────
  const retentionReasons = useMemo<RetentionReason[]>(() => {
    const cards = raw?.dashStats?.metricCards ?? [];
    return cards[1]?.sections?.find((s: any) => s.title === 'Motivo de retención')?.items ?? [];
  }, [raw]);

  const blockReasons = useMemo<RetentionReason[]>(() => {
    const cards = raw?.dashStats?.metricCards ?? [];
    return cards[2]?.sections?.find((s: any) => s.title === 'Motivo de retención')?.items ?? [];
  }, [raw]);

  // ── Tiempos proceso ───────────────────────────────────────────────────────
  const processTimes = useMemo<ProcessTimeRow[]>(() => {
    const cards = raw?.dashStats?.metricCards ?? [];
    return cards[0]?.sections?.find((s: any) => s.isTable)?.rows ?? [];
  }, [raw]);

  return {
    kpis, ruleDistribution, volumeChart, highValueAlerts,
    byChannel, retentionReasons, blockReasons, processTimes,
    isLoading,
  };
}
