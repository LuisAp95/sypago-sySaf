import db from './db.json';
import dashboardData from './dashboardData.json';
import versionsData from './versions.json';

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
  }
};

