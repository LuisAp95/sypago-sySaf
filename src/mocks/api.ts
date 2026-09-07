import db from './db.json';
import dashboardData from './dashboardData.json';
import versionsData from './versions.json';
import statsData from './statsData.json';


// Simular latencia de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  getReports: async () => {
    await delay(500);
    return db.reports;
  },
  
  getFilters: async () => {
    await delay(200);
    return {
      operationChannels: db.operationChannels,
      operationStatuses: db.operationStatuses
    };
  },
  
  getQuarantine: async () => {
    await delay(500);
    return db.quarantine;
  },

  getRiskStats: async () => {
    await delay(500);
    return db.riskStats;
  },

  getBlacklist: async () => {
    await delay(500);
    return db.blacklist;
  },

  getRulesViewer: async () => {
    await delay(500);
    return db.rulesViewer;
  },

  getRulesChannel: async () => {
    await delay(500);
    return db.rulesChannel;
  },

  getUserExceptions: async () => {
    await delay(500);
    return db.userExceptions;
  },

  getDashboardFilters: async () => {
    await delay(200);
    return dashboardData.filters;
  },
  getDashboardStats: async (period: string = '24h', metricType: string = 'cantidades') => {
    await delay(500);
    const key = `${period}_${metricType}`;
    return (dashboardData.stats as any)[key] || (dashboardData.stats as any)['24h_cantidades'];
  },

  getRoles: async () => {
    await delay(300);
    return db.roles;
  },

  getUsuarios: async () => {
    await delay(300);
    return db.usuarios;
  },

  getVersions: async () => {
    await delay(300);
    return versionsData;
  },

  getStatsData: async (period: string = '24h', metricType: string = 'cantidades') => {
    await delay(400);
    const key = `${period}_${metricType}`;
    const stats = (dashboardData.stats as any)[key] || (dashboardData.stats as any)['24h_cantidades'];
    return { stats, reports: db.reports, blacklist: db.blacklist };
  },

  getBlacklistStats: async () => {
    await delay(200);
    return db.blacklist;
  },

  getStatsExtended: async (period: string = '30d', metricType: string = 'cantidades') => {
    await delay(400);
    const key = `${period}_${metricType}`;
    const dashStats = (dashboardData.stats as any)[key] || (dashboardData.stats as any)['24h_cantidades'];
    const kpiTrends = (statsData.kpiTrends as any)[period]     || statsData.kpiTrends['30d'];
    const ruleDist  = (statsData.ruleDistribution as any)[period] || statsData.ruleDistribution['30d'];
    const volChart  = (statsData.volumeTrendChart as any)[period] || statsData.volumeTrendChart['30d'];
    const alerts    = (statsData.highValueAlerts as any)[period]  || statsData.highValueAlerts['30d'];
    return {
      dashStats,
      kpiTrends,
      ruleDistribution: ruleDist,
      volumeChart: volChart,
      highValueAlerts: alerts,
      reports: db.reports,
    };
  },
};

