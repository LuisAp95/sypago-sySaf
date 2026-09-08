import React, { useMemo, useState } from 'react';
import { Plus, Trash2, MapPin, Globe, ShieldCheck, Edit2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { InteractiveWorldMap } from '../shared/InteractiveWorldMap';
import type { MapMarker } from '../shared/InteractiveWorldMap';
import { useWhitelist } from '../../hooks/useWhitelist';
import type { WhitelistEntry } from '../../hooks/useWhitelist';
import { useRiskZones } from '../../hooks/useRiskZones';
import type { RiskZoneEntry } from '../../hooks/useRiskZones';
import { CustomDropdownSelect } from '../shared/CustomDropdownSelect';
import type { DropdownOption } from '../shared/CustomDropdownSelect';
import geoData from '../../data/geoData.json';

/* ─────────────────────────────────────────────
   Card para entradas de Whitelist (Verde)
───────────────────────────────────────────── */
const WhitelistCard: React.FC<{
  entry: WhitelistEntry;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}> = ({ entry, onRemove, onToggle }) => {
  const isActive = entry.status === 'Activo';
  const isByCity = !!entry.city;
  const countryObj = geoData.countries.find((c) => c.name === entry.country);
  const flag = countryObj?.flag;

  return (
    <div
      className={[
        'rounded-xl p-3 flex flex-col gap-2 transition-all shadow-md',
        isActive
          ? 'bg-[#1E1D1F] border border-[#10B981]/30 shadow-[#10B981]/5'
          : 'bg-[#1A191B] border border-[#3A393C] opacity-60',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 w-7 h-7 rounded-lg bg-[#2A292A] border border-[#3A393C] flex items-center justify-center">
            {isByCity ? (
              <MapPin className="w-3.5 h-3.5 text-[#1DA493]" />
            ) : (
              <Globe className="w-3.5 h-3.5 text-[#1DA493]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {flag ? `${flag} ` : ''}{entry.country}
            </p>
            {entry.city && <p className="text-xs text-gray-400 truncate">{entry.city}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggle(entry.id)}
            title={isActive ? 'Desactivar' : 'Activar'}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-[#2A292A] hover:text-gray-200 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onRemove(entry.id)}
            title="Eliminar"
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
          <ShieldCheck className="w-3 h-3" />
          <span>{entry.validationMethod}</span>
        </div>
        <span
          className={[
            'text-[10px] font-semibold px-2 py-0.5 rounded-full',
            isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-700/40 text-gray-500',
          ].join(' ')}
        >
          {entry.status}
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Card para Zonas de Riesgo (Rojo - Lectura)
───────────────────────────────────────────── */
const RiskZoneCard: React.FC<{
  entry: RiskZoneEntry;
}> = ({ entry }) => {
  const isActive = entry.status === 'Activo';
  const isByCity = !!entry.city;
  const isCritical = entry.riskLevel === 'Crítico';
  const countryObj = geoData.countries.find((c) => c.name === entry.country);
  const flag = countryObj?.flag;

  return (
    <div
      className={[
        'rounded-xl p-3 flex flex-col gap-2 transition-all shadow-md',
        isActive
          ? 'bg-[#1E1D1F] border border-[#EF4444]/40 shadow-[#EF4444]/10'
          : 'bg-[#1A191B] border border-[#3A393C] opacity-60',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 w-7 h-7 rounded-lg bg-red-950/40 border border-red-900/50 flex items-center justify-center">
            {isByCity ? (
              <MapPin className="w-3.5 h-3.5 text-[#EF4444]" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {flag ? `${flag} ` : ''}{entry.country}
            </p>
            {entry.city && <p className="text-xs text-gray-400 truncate">{entry.city}</p>}
          </div>
        </div>

        <span
          className={[
            'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
            isCritical
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
          ].join(' ')}
        >
          {entry.riskLevel}
        </span>
      </div>

      <p className="text-[11px] text-gray-300 line-clamp-1 italic bg-[#141315] p-1.5 rounded border border-[#2A292A]">
        {entry.reason}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
          <ShieldAlert className="w-3 h-3" />
          <span>{entry.fraudCount} fraudes detectados</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">
          Detectado: {entry.date}
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Vista Principal Mapa Global (Whitelist vs Riesgo)
───────────────────────────────────────────── */
export const WhitelistMapTab: React.FC = () => {
  const [viewMode, setViewMode] = useState<'whitelist' | 'risk'>('whitelist');

  // Whitelist State
  const { entries, addEntry, removeEntry, toggleStatus } = useWhitelist();
  // Risk Zones State
  const { riskEntries, addRiskEntry } = useRiskZones();

  // Form State
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const currentCountryObj = geoData.countries.find((c) => c.name === selectedCountry);
  const cities = currentCountryObj?.cities || [];

  // Opciones formateadas con banderas para el selector de País
  const countryOptions: DropdownOption[] = useMemo(() => {
    return geoData.countries.map((c) => ({
      label: c.name,
      value: c.name,
      flag: c.flag,
    }));
  }, []);

  // Opciones para el selector de Ciudad
  const cityOptions: DropdownOption[] = useMemo(() => {
    return cities.map((city) => ({
      label: city.name,
      value: city.name,
    }));
  }, [cities]);

  const handleAdd = () => {
    if (!selectedCountry) return;
    let coords: [number, number] = [0, 0];
    if (selectedCity && currentCountryObj) {
      const cityObj = currentCountryObj.cities.find((c) => c.name === selectedCity);
      coords = cityObj
        ? (cityObj.coordinates as [number, number])
        : (currentCountryObj.coordinates as [number, number]);
    } else if (currentCountryObj) {
      coords = currentCountryObj.coordinates as [number, number];
    }

    if (viewMode === 'whitelist') {
      addEntry({ country: selectedCountry, city: selectedCity || undefined, coordinates: coords });
    } else {
      addRiskEntry({ country: selectedCountry, city: selectedCity || undefined, coordinates: coords });
    }

    setSelectedCountry('');
    setSelectedCity('');
  };

  // ── Puntos y Siluetas según el modo activo ──
  const isRisk = viewMode === 'risk';

  const activeWhitelistEntries = useMemo(() => entries.filter((e) => e.status === 'Activo'), [entries]);
  const activeRiskEntries = useMemo(() => riskEntries.filter((e) => e.status === 'Activo'), [riskEntries]);

  // Países destacados (siluetas completas)
  const highlightedCountryCodes = useMemo(() => {
    const codes: string[] = [];
    const targetList = isRisk ? activeRiskEntries : activeWhitelistEntries;

    targetList.forEach((entry) => {
      if (!entry.city) {
        const obj = geoData.countries.find((c) => c.name === entry.country);
        if (obj?.numericCode) codes.push(obj.numericCode);
      }
    });
    return codes;
  }, [isRisk, activeWhitelistEntries, activeRiskEntries]);

  // Marcadores de mapa (puntos por ciudad)
  const mapMarkers: MapMarker[] = useMemo(() => {
    const targetList = isRisk ? activeRiskEntries : activeWhitelistEntries;
    const color = isRisk ? '#EF4444' : '#10B981';

    return targetList
      .filter((e) => !!e.city)
      .map((e) => ({
        id: e.id,
        coordinates: e.coordinates,
        color,
        label: e.city!,
      }));
  }, [isRisk, activeWhitelistEntries, activeRiskEntries]);

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      {/* ── Barra superior: Toggle Switch + Selectores de Filtro ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap shrink-0">
        {/* Toggle Switch Mode */}
        <div className="flex items-center p-1 bg-[#1A191B] border border-[#3A393C] rounded-xl shadow-inner">
          <button
            onClick={() => { setViewMode('whitelist'); setSelectedCountry(''); setSelectedCity(''); }}
            className={[
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              !isRisk
                ? 'bg-[#1DA493] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200',
            ].join(' ')}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Whitelist Global</span>
          </button>
          <button
            onClick={() => { setViewMode('risk'); setSelectedCountry(''); setSelectedCity(''); }}
            className={[
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              isRisk
                ? 'bg-[#EF4444] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200',
            ].join(' ')}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Zonas de Riesgo</span>
          </button>
        </div>

        {/* Selectores estilizados de País y Ciudad + Botón Añadir */}
        <div className="flex items-center gap-2 flex-wrap">
          <CustomDropdownSelect
            options={countryOptions}
            value={selectedCountry}
            onChange={(v) => {
              setSelectedCountry(v);
              setSelectedCity('');
            }}
            placeholder={isRisk ? "País (No seleccionable)" : "Seleccionar País"}
            disabled={isRisk}
          />

          <CustomDropdownSelect
            options={cityOptions}
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="Seleccionar Ciudad"
            disabled={isRisk || !selectedCountry || cities.length === 0}
          />

          <button
            onClick={handleAdd}
            disabled={isRisk || !selectedCountry}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-[#1DA493] hover:bg-[#25c4b0] text-white font-semibold text-xs transition-all shadow-md hover:shadow-[#1DA493]/20 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir a Whitelist</span>
          </button>
        </div>
      </div>

      {/* ── Layout dos columnas: Mapa | Panel Cards ── */}
      <div className="flex-1 flex gap-5 min-h-0">
        {/* Mapa — ocupa todo el espacio restante */}
        <div className="flex-1 min-w-0 h-full">
          <InteractiveWorldMap
            markers={mapMarkers}
            highlightedCountryCodes={highlightedCountryCodes}
            mode={viewMode}
          />
        </div>

        {/* Panel lateral de tarjetas según el modo */}
        <div className="w-80 shrink-0 flex flex-col h-full bg-[#1A191B] p-3 rounded-2xl shadow-2xl shadow-black/70 min-h-0 border border-[#2A292A]">
          {/* Cabecera del panel */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2A292A] shrink-0">
            <div className="flex items-center gap-2">
              {isRisk ? (
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-[#1DA493]" />
              )}
              <span className="text-sm font-semibold text-white">
                {isRisk ? 'Zonas de Riesgo' : 'Whitelist Global'}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {isRisk ? riskEntries.length : entries.length}{' '}
              {(isRisk ? riskEntries.length : entries.length) === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {/* Cards scrollables */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2 min-h-0">
            {!isRisk ? (
              entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
                  <Globe className="w-10 h-10 text-gray-700" />
                  <p className="text-sm text-gray-500">No hay ubicaciones en la whitelist.</p>
                  <p className="text-xs text-gray-600">Selecciona un país o ciudad y pulsa "Añadir".</p>
                </div>
              ) : (
                entries.map((entry) => (
                  <WhitelistCard
                    key={entry.id}
                    entry={entry}
                    onRemove={removeEntry}
                    onToggle={toggleStatus}
                  />
                ))
              )
            ) : riskEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
                <AlertTriangle className="w-10 h-10 text-gray-700" />
                <p className="text-sm text-gray-500">No hay zonas de riesgo registradas.</p>
                <p className="text-xs text-gray-600">Monitoreo automático de fraude activo.</p>
              </div>
            ) : (
              riskEntries.map((entry) => (
                <RiskZoneCard
                  key={entry.id}
                  entry={entry}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
