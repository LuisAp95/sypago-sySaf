import { useState, useEffect } from 'react';
import geoData from '../data/geoData.json';
import { profilesData } from '../../../mocks/profilesData';
import type { AllowedRegionInfo } from '../../../mocks/profilesData';

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

export const useTravelingClients = () => {
  const [activeClients, setActiveClients] = useState<TravelingClient[]>([]);

  useEffect(() => {
    const active: TravelingClient[] = [];

    // Recorrer todos los perfiles buscando regiones permitidas con status 'Vigente'
    profilesData.forEach((profile) => {
      if (profile.allowedRegions && profile.allowedRegions.length > 0) {
        profile.allowedRegions.forEach((region: AllowedRegionInfo) => {
          if (region.status === 'Vigente') {
            let coords: [number, number] = [0, 0];
            let flag = '';
            const countryData = geoData.countries.find((c) => c.name === region.country);
            if (countryData) {
              flag = countryData.flag || '';
              const cityData = countryData.cities.find((c) => c.name === region.city);
              coords = cityData
                ? (cityData.coordinates as [number, number])
                : (countryData.coordinates as [number, number]);
            }

            active.push({
              id: region.id,
              clientId: profile.cedula,
              clientName: profile.name,
              country: region.country,
              city: region.city,
              startDate: region.startDate,
              endDate: region.endDate,
              status: region.status,
              reason: region.reason,
              autoWhitelistIp: region.autoWhitelistIp,
              flag,
              coordinates: coords,
            });
          }
        });
      }
    });

    setActiveClients(active);
  }, []);

  return { activeClients };
};
