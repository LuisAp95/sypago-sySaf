import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import geoData from '../../../data/geoData.json';

interface WhitelistFormProps {
  onAdd: (data: { country: string; city?: string; coordinates: [number, number] }) => void;
}

export const WhitelistForm: React.FC<WhitelistFormProps> = ({ onAdd }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const currentCountryObj = geoData.countries.find((c) => c.name === selectedCountry);
  const cities = currentCountryObj?.cities || [];

  const handleAdd = () => {
    if (!selectedCountry) return;

    let coords: [number, number] = [0, 0];
    if (selectedCity && currentCountryObj) {
      const cityObj = currentCountryObj.cities.find(c => c.name === selectedCity);
      coords = cityObj ? (cityObj.coordinates as [number, number]) : (currentCountryObj.coordinates as [number, number]);
    } else if (currentCountryObj) {
      coords = currentCountryObj.coordinates as [number, number];
    }

    onAdd({
      country: selectedCountry,
      city: selectedCity || undefined,
      coordinates: coords,
    });

    setSelectedCountry('');
    setSelectedCity('');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-surface rounded-xl border border-table-border">
      {/* Label país */}
      <span className="text-xs font-semibold text-text-muted whitespace-nowrap">País:</span>
      <select
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          setSelectedCity('');
        }}
        className="bg-[#2A292A] border border-[#3A393C] text-white text-xs rounded-lg px-2 py-1.5 h-7 focus:ring-[#1DA493] focus:border-[#1DA493] outline-none cursor-pointer min-w-[140px] max-w-[180px]"
      >
        <option value="">Seleccione un país...</option>
        {geoData.countries.map((c) => (
          <option key={c.code} value={c.name}>{c.name}</option>
        ))}
      </select>

      {/* Label estado/ciudad */}
      <span className="text-xs font-semibold text-text-muted whitespace-nowrap">Estado/Ciudad:</span>
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        disabled={!selectedCountry || cities.length === 0}
        className="bg-[#2A292A] border border-[#3A393C] text-white text-xs rounded-lg px-2 py-1.5 h-7 focus:ring-[#1DA493] focus:border-[#1DA493] outline-none disabled:opacity-40 cursor-pointer min-w-[140px] max-w-[180px]"
      >
        <option value="">Seleccione una ciudad...</option>
        {cities.map((city) => (
          <option key={city.name} value={city.name}>{city.name}</option>
        ))}
      </select>

      <button
        onClick={handleAdd}
        disabled={!selectedCountry}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-lg bg-[#1DA493] hover:bg-[#25c4b0] text-white font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Añadir</span>
      </button>
    </div>
  );
};
