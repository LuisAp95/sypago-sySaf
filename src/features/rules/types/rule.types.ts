export type RuleCategory = 'limits' | 'dispersion' | 'risk_entity' | 'exceptions';

export interface RuleTimeBand {
  id: string;
  enabled: boolean;
  status: 'Activo' | 'Activa' | 'Inactivo';
  startTime: string;
  endTime: string;
  opsPerMinute: number;
  maxAmount: string;
}

export interface DispersionTimeBand {
  id: string;
  enabled: boolean;
  status: 'Activo' | 'Activa' | 'Inactivo';
  startTime: string;
  endTime: string;
  maxDailyOps: number;
  minAmount: string;
}

export interface RiskEntityTimeBand {
  id: string;
  enabled: boolean;
  status: 'Activo' | 'Activa' | 'Inactivo';
  startTime: string;
  endTime: string;
  maxDailyAccumulatedAmount: string;
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
  ruleCategory?: RuleCategory;
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
  dispersionSubRules?: DispersionTimeBand[];
  riskSubRules?: RiskEntityTimeBand[];
  blacklistedBanks?: string[];
  maxOps?: number;
  maxAmt?: number;
}
