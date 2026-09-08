import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Plane, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import type { AllowedRegionInfo } from '../../../mocks/profilesData';

interface TravelNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (regionData: Omit<AllowedRegionInfo, 'id' | 'status'>) => void;
}

import geoData from '../../regions/data/geoData.json';

const COUNTRY_OPTIONS = geoData.countries.map((c) => c.name).sort();
const COUNTRY_SELECT_OPTIONS = geoData.countries
  .map((c) => ({ label: c.name, value: c.name }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const TravelNotificationModal: React.FC<TravelNotificationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [country, setCountry] = useState(COUNTRY_OPTIONS[0] || 'Estados Unidos');
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [autoWhitelistIp, setAutoWhitelistIp] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    const selected = geoData.countries.find((c) => c.name === country);
    if (selected && selected.cities.length > 0) {
      // Ordenamos las ciudades alfabéticamente para mantener consistencia
      const sortedCities = [...selected.cities].sort((a, b) => a.name.localeCompare(b.name));
      setCity(sortedCities[0].name);
    } else {
      setCity('');
    }
  }, [country]);

  const cityOptions = React.useMemo(() => {
    return geoData.countries
      .find((c) => c.name === country)
      ?.cities.map((c) => ({ label: c.name, value: c.name }))
      .sort((a, b) => a.label.localeCompare(b.label)) || [];
  }, [country]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!country.trim() || !city.trim() || !startDate || !endDate) {
      setErrorMsg('Por favor completa los campos de País, Ciudad y Rango de Fechas.');
      return;
    }

    // Convertir fechas a formato DD/MM/YYYY si vienen del input date
    const formatDate = (val: string) => {
      if (val.includes('-')) {
        const [y, m, d] = val.split('-');
        return `${d}/${m}/${y}`;
      }
      return val;
    };

    onSave({
      country,
      city,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      reason: reason.trim() || 'Notificación de viaje registrada por el operador',
      autoWhitelistIp,
    });

    // Reset Form
    setCountry(COUNTRY_OPTIONS[0] || 'Estados Unidos');
    setStartDate('');
    setEndDate('');
    setReason('');
    setAutoWhitelistIp(true);
    setErrorMsg('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-white">
          <Plane className="w-5 h-5 text-[#1DA493]" />
          <span>Registrar Permiso por Notificación de Viaje</span>
        </div>
      }
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="hover:bg-[#393738] text-gray-300"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-[#1DA493] hover:bg-[#25c4b0] text-white font-semibold px-5"
          >
            Guardar Permiso de Viaje
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* País */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <GlobeIcon className="w-4 h-4 text-[#1DA493]" />
              <span>País de Destino</span>
            </label>
            <Select
              options={COUNTRY_SELECT_OPTIONS}
              value={country}
              onChange={(val) => setCountry(val)}
              placeholder="Seleccionar país..."
            />
          </div>

          {/* Ciudad / Estado */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1DA493]" />
              <span>Ciudad / Provincia / Estado</span>
            </label>
            <Select
              options={cityOptions}
              value={city}
              onChange={(val) => setCity(val)}
              placeholder="Seleccionar ciudad..."
            />
          </div>
        </div>

        {/* Fechas Desde / Hasta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#1DA493]" />
              <span>Fecha Inicio (Desde)</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#2A292A] border border-[#3A393C] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#1DA493]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#1DA493]" />
              <span>Fecha Fin (Hasta)</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#2A292A] border border-[#3A393C] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#1DA493]"
              required
            />
          </div>
        </div>

        {/* Motivo / Observaciones */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300">
            Motivo u Observación del Viaje
          </label>
          <input
            type="text"
            placeholder="Ej. Vacaciones familiares / Conferencia internacional"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-[#2A292A] border border-[#3A393C] rounded-xl px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#1DA493]"
          />
        </div>

        {/* Checkbox Inclusión Automática Lista Blanca */}
        <div className="p-3.5 rounded-xl bg-[#2A292A] border border-[#3A393C] flex items-center gap-3 mt-2">
          <input
            type="checkbox"
            id="whitelistToggle"
            checked={autoWhitelistIp}
            onChange={(e) => setAutoWhitelistIp(e.target.checked)}
            className="w-4 h-4 accent-[#1DA493] cursor-pointer rounded"
          />
          <label htmlFor="whitelistToggle" className="text-xs text-gray-200 cursor-pointer flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1DA493]" />
            <span>Permitir automáticamente IPs originadas en este país/ciudad durante el viaje</span>
          </label>
        </div>
      </form>
    </Modal>
  );
};

const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
  </svg>
);
