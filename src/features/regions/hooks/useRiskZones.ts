import { useState, useEffect } from 'react';

export interface RiskZoneEntry {
  id: string;
  country: string;
  city?: string;
  riskLevel: 'Crítico' | 'Alto' | 'Medio';
  fraudCount: number;
  addedBy: string;
  date: string;
  status: 'Activo' | 'Inactivo';
  coordinates: [number, number];
  reason: string;
}

const STORAGE_KEY = 'sysaf_risk_zones';

const INITIAL_RISK_ZONES: RiskZoneEntry[] = [
  {
    id: 'risk-1',
    country: 'Nigeria',
    city: 'Lagos',
    riskLevel: 'Crítico',
    fraudCount: 142,
    addedBy: 'Sistema Antifraude',
    date: '01/09/2026',
    status: 'Activo',
    coordinates: [3.3792, 6.5244],
    reason: 'Fichas de suplantación masiva detectadas',
  },
  {
    id: 'risk-2',
    country: 'Rusia',
    riskLevel: 'Alto',
    fraudCount: 98,
    addedBy: 'Analista de Riesgo',
    date: '28/08/2026',
    status: 'Activo',
    coordinates: [105.3188, 61.5240],
    reason: 'Tráfico inusual de proxies y botnets',
  },
  {
    id: 'risk-3',
    country: 'China',
    city: 'Shanghái',
    riskLevel: 'Alto',
    fraudCount: 67,
    addedBy: 'Monitor Automatizado',
    date: '15/08/2026',
    status: 'Activo',
    coordinates: [121.4737, 31.2304],
    reason: 'Intentos repetidos de ataques Brute Force',
  },
];

export const useRiskZones = () => {
  const [riskEntries, setRiskEntries] = useState<RiskZoneEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRiskEntries(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing risk zones from localStorage', e);
        setRiskEntries(INITIAL_RISK_ZONES);
      }
    } else {
      setRiskEntries(INITIAL_RISK_ZONES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RISK_ZONES));
    }
  }, []);

  const saveEntries = (newEntries: RiskZoneEntry[]) => {
    setRiskEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const addRiskEntry = (entry: { country: string; city?: string; coordinates: [number, number]; riskLevel?: 'Crítico' | 'Alto' | 'Medio'; reason?: string }) => {
    const newEntry: RiskZoneEntry = {
      id: crypto.randomUUID(),
      country: entry.country,
      city: entry.city,
      coordinates: entry.coordinates,
      riskLevel: entry.riskLevel || 'Alto',
      fraudCount: Math.floor(Math.random() * 50) + 15,
      addedBy: 'J. Pérez',
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      status: 'Activo',
      reason: entry.reason || 'Zona reportada con índice de fraude elevado',
    };
    saveEntries([newEntry, ...riskEntries]);
  };

  const removeRiskEntry = (id: string) => {
    saveEntries(riskEntries.filter((e) => e.id !== id));
  };

  const toggleRiskStatus = (id: string) => {
    saveEntries(
      riskEntries.map((e) =>
        e.id === id ? { ...e, status: e.status === 'Activo' ? 'Inactivo' : 'Activo' } : e
      )
    );
  };

  return { riskEntries, addRiskEntry, removeRiskEntry, toggleRiskStatus };
};
