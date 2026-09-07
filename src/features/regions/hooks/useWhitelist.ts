import { useState, useEffect } from 'react';

export interface WhitelistEntry {
  id: string;
  country: string;
  city?: string;
  validationMethod: 'IP + Geolocalización' | 'Geolocalización';
  addedBy: string;
  date: string;
  status: 'Activo' | 'Inactivo';
  coordinates: [number, number];
}

const STORAGE_KEY = 'sysaf_whitelist_regions';

export const useWhitelist = () => {
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing whitelist from localStorage', e);
      }
    }
  }, []);

  const saveEntries = (newEntries: WhitelistEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const addEntry = (entry: Omit<WhitelistEntry, 'id' | 'date' | 'status' | 'addedBy' | 'validationMethod'>) => {
    const newEntry: WhitelistEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      addedBy: 'J. Pérez', // Mocked user
      status: 'Activo',
      validationMethod: entry.city ? 'Geolocalización' : 'IP + Geolocalización',
    };
    saveEntries([newEntry, ...entries]);
  };

  const removeEntry = (id: string) => {
    saveEntries(entries.filter((e) => e.id !== id));
  };

  const toggleStatus = (id: string) => {
    saveEntries(
      entries.map((e) =>
        e.id === id ? { ...e, status: e.status === 'Activo' ? 'Inactivo' : 'Activo' } : e
      )
    );
  };

  return { entries, addEntry, removeEntry, toggleStatus };
};
