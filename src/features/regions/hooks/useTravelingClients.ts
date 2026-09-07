import { useState, useEffect } from 'react';
import geoData from '../data/geoData.json';

export interface TravelingClient {
  id: string;
  clientId: string;
  clientName: string;
  country: string;
  city: string;
  flag?: string;
  startDate: string;
  endDate: string;
  status: 'Vigente' | 'Programado' | 'Vencido';
  coordinates: [number, number];
  reason?: string;
  autoWhitelistIp: boolean;
}

const MOCK_TRAVELING_CLIENTS: Omit<TravelingClient, 'coordinates'>[] = [
  {
    id: 't1',
    clientId: 'V-18492011',
    clientName: 'Juan Carlos Pérez',
    country: 'Estados Unidos',
    city: 'Miami',
    startDate: '10/10/2026',
    endDate: '25/10/2026',
    status: 'Vigente',
    reason: 'Viaje de Negocios y Conferencia Tech',
    autoWhitelistIp: true,
  },
  {
    id: 't2',
    clientId: 'V-20194822',
    clientName: 'María Alejandra García',
    country: 'España',
    city: 'Madrid',
    startDate: '15/10/2026',
    endDate: '05/11/2026',
    status: 'Vigente',
    reason: 'Vacaciones Familiares y Turismo',
    autoWhitelistIp: true,
  },
  {
    id: 't3',
    clientId: 'V-15940284',
    clientName: 'Carlos Eduardo López',
    country: 'Francia',
    city: 'París',
    startDate: '01/09/2026',
    endDate: '10/09/2026',
    status: 'Vigente',
    reason: 'Asistencia a Cumbre Anual de Seguridad',
    autoWhitelistIp: false,
  },
  {
    id: 't4',
    clientId: 'V-23849102',
    clientName: 'Ana Sofía Mendoza',
    country: 'Japón',
    city: 'Tokio',
    startDate: '18/10/2026',
    endDate: '02/11/2026',
    status: 'Vigente',
    reason: 'Entrenamiento Ejecutivo Corporativo',
    autoWhitelistIp: true,
  },
  {
    id: 't5',
    clientId: 'V-19302911',
    clientName: 'Roberto Antonio Silva',
    country: 'México',
    city: 'Ciudad de México',
    startDate: '05/10/2026',
    endDate: '20/10/2026',
    status: 'Vigente',
    reason: 'Auditoría Regional de Canales',
    autoWhitelistIp: true,
  },
  {
    id: 't6',
    clientId: 'V-14920193',
    clientName: 'Gabriel Enrique Rivas',
    country: 'Reino Unido',
    city: 'Londres',
    startDate: '12/08/2026',
    endDate: '28/08/2026',
    status: 'Vencido',
    reason: 'Viaje Personal',
    autoWhitelistIp: false,
  },
];

export const useTravelingClients = () => {
  const [activeClients, setActiveClients] = useState<TravelingClient[]>([]);

  useEffect(() => {
    // Filtrar únicamente los viajes vigentes (activos) y obtener coordenadas y banderas
    const active = MOCK_TRAVELING_CLIENTS.filter((c) => c.status === 'Vigente').map((client) => {
      let coords: [number, number] = [0, 0];
      let flag = '🌎';
      const countryData = geoData.countries.find((c) => c.name === client.country);
      if (countryData) {
        flag = countryData.flag || '🌎';
        const cityData = countryData.cities.find((c) => c.name === client.city);
        coords = cityData
          ? (cityData.coordinates as [number, number])
          : (countryData.coordinates as [number, number]);
      }
      return { ...client, flag, coordinates: coords };
    });

    setActiveClients(active);
  }, []);

  return { activeClients };
};
