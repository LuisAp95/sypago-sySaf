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

const STORAGE_KEY = 'sysaf_risk_zones_v2';

const INITIAL_RISK_ZONES: RiskZoneEntry[] = [
  {
    id: 'risk-1',
    country: 'Colombia',
    riskLevel: 'Alto',
    fraudCount: 114,
    addedBy: 'Sistema Antifraude',
    date: '02/09/2026',
    status: 'Activo',
    coordinates: [-74.2973, 4.5709],
    reason: 'Alertas tempranas de clonación de credenciales e IPs de alto riesgo',
  },
  {
    id: 'risk-2',
    country: 'Puerto Rico',
    riskLevel: 'Crítico',
    fraudCount: 86,
    addedBy: 'Analista de Riesgo',
    date: '29/08/2026',
    status: 'Activo',
    coordinates: [-66.5901, 18.2208],
    reason: 'Tráfico no autorizado y patrones de transacciones fraudulentas',
  },
  {
    id: 'risk-3',
    country: 'Japón',
    city: 'Tokio',
    riskLevel: 'Crítico',
    fraudCount: 142,
    addedBy: 'Monitor Automatizado',
    date: '18/08/2026',
    status: 'Activo',
    coordinates: [139.6917, 35.6895],
    reason: 'Ataques masivos de fuerza bruta y botnets distribuidas',
  },
  {
    id: 'risk-4',
    country: 'España',
    city: 'Madrid',
    riskLevel: 'Alto',
    fraudCount: 68,
    addedBy: 'Sistema Antifraude',
    date: '15/08/2026',
    status: 'Activo',
    coordinates: [-3.7038, 40.4168],
    reason: 'Tráfico inusual de proxies comerciales y suplantación de identidad',
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
