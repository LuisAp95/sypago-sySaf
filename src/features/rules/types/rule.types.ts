export interface RuleTimeBand {
  id: string;
  enabled: boolean;
  status: 'Activo' | 'Activa' | 'Inactivo';
  startTime: string;
  endTime: string;
  opsPerMinute: number;
  maxAmount: string;
}

export interface ChartPoint {
  x: number;
  y: number;
}

export interface RuleDefinitionItem {
  id: string;
  code?: string;
  name?: string;
  channel?: string;
  title: string;
  ops: {
    max: number;
    current: number;
  };
  amount: {
    max: string;
    current: string;
  };
  chartData: {
    ops: ChartPoint[];
    amount: ChartPoint[];
  };
  subRules?: RuleTimeBand[];
  maxOps?: number;
  maxAmt?: number;
}
