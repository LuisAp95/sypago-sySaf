import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { RiskEntityTimeBand } from '../types/rule.types';
import { BANKS } from '../mocks/banks.mock';

interface RiskEntityRuleFormProps {
  subRules: RiskEntityTimeBand[];
  blacklistedBanks: string[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, field: keyof RiskEntityTimeBand, value: any) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onBanksChange: (banks: string[]) => void;
}

export const RiskEntityRuleForm: React.FC<RiskEntityRuleFormProps> = ({
  subRules,
  blacklistedBanks,
  onToggle,
  onUpdate,
  onAdd,
  onDelete,
  onBanksChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleBank = (bankId: string) => {
    if (blacklistedBanks.includes(bankId)) {
      onBanksChange(blacklistedBanks.filter(id => id !== bankId));
    } else {
      onBanksChange([...blacklistedBanks, bankId]);
    }
  };

  const handleRemoveBank = (bankId: string) => {
    onBanksChange(blacklistedBanks.filter(id => id !== bankId));
  };

  const filteredBanks = BANKS.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.code.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      {/* Banks Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-gray-200">Entidades en Lista Negra</h3>
            <span className="text-[11px] text-gray-500 mt-0.5">
              Bancos que serán monitoreados por esta regla
            </span>
          </div>
          <span className="text-xs text-gray-500 bg-[#1E1F20] px-3 py-1 rounded-full border border-tertiary/40">
            {blacklistedBanks.length} seleccionado{blacklistedBanks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Selected Banks Chips */}
        {blacklistedBanks.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {blacklistedBanks.map(bankId => {
              const bank = BANKS.find(b => b.id === bankId);
              return (
                <div
                  key={bankId}
                  className="flex items-center gap-1.5 bg-[#2b2233] border border-[#4a3a5f] text-purple-300 text-xs font-medium pl-3 pr-1.5 py-1.5 rounded-lg"
                >
                  <span className="text-purple-400/70 font-mono text-[10px]">{bank?.code}</span>
                  <span>{bank?.name || bankId}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBank(bankId)}
                    className="w-5 h-5 rounded-full hover:bg-purple-500/20 flex items-center justify-center transition-colors ml-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Dropdown Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-[#2A292A] border border-tertiary/60 rounded-xl px-4 py-2.5 text-sm text-gray-300 font-medium flex items-center justify-between hover:border-gray-500 transition-colors cursor-pointer"
          >
            <span>Seleccionar bancos...</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-50 mt-2 w-full bg-[#1E1F20] border border-[#393738] rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Search */}
              <div className="p-3 border-b border-[#393738]">
                <div className="flex items-center gap-2 bg-[#2A292A] rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar banco..."
                    className="bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none flex-1"
                  />
                </div>
              </div>

              {/* Bank List */}
              <div className="max-h-48 overflow-y-auto p-2">
                {filteredBanks.map(bank => {
                  const isSelected = blacklistedBanks.includes(bank.id);
                  return (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => handleToggleBank(bank.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#2b2233] text-purple-300'
                          : 'text-gray-300 hover:bg-[#2A292A]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-600'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-gray-500">{bank.code}</span>
                      <span className="font-medium">{bank.name}</span>
                    </button>
                  );
                })}
                {filteredBanks.length === 0 && (
                  <div className="text-center py-4 text-sm text-gray-500">No se encontraron bancos</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-[#393738]/60 my-2" />

      {/* Sub-rules Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-gray-200">Franjas Horarias</h3>
            <span className="text-[11px] text-gray-500 mt-0.5">
              Monto acumulativo diario permitido por franja
            </span>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="bg-tertiary border border-table-border hover:bg-[#393738] text-gray-200 text-xs font-medium px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Agregar
          </button>
        </div>

        {/* Sub-rules List */}
        <div className="space-y-3">
          {subRules.map((sr) => (
            <div
              key={sr.id}
              className="bg-tertiary border border-[#393738] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm hover:border-gray-500 transition-colors"
            >
              {/* Toggle Switch */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onToggle(sr.id)}
                  className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    sr.enabled ? 'bg-[#10B981]' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      sr.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>

                {/* Estado Badge */}
                <div className="flex flex-col min-w-[70px]">
                  <span className="text-[11px] text-gray-400 mb-0.5">Estado</span>
                  <Badge variant={sr.enabled ? 'activo' : 'inactivo'}>
                    {sr.enabled ? sr.status || 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>

              {/* Hora inicio */}
              <div className="flex flex-col">
                <label className="text-[11px] text-gray-400 mb-1">Hora inicio</label>
                <input
                  type="text"
                  value="00:00"
                  readOnly
                  className="bg-transparent border-transparent px-3 py-1 text-sm text-gray-500 font-mono font-semibold text-center w-24 focus:outline-none focus:ring-0 cursor-not-allowed"
                />
              </div>

              {/* Hora fin */}
              <div className="flex flex-col">
                <label className="text-[11px] text-gray-400 mb-1">Hora fin</label>
                <input
                  type="text"
                  value="23:59"
                  readOnly
                  className="bg-transparent border-transparent px-3 py-1 text-sm text-gray-500 font-mono font-semibold text-center w-24 focus:outline-none focus:ring-0 cursor-not-allowed"
                />
              </div>

              {/* Monto acumulativo diario */}
              <div className="flex flex-col">
                <label className="text-[11px] text-gray-400 mb-1">Monto acum. diario</label>
                <input
                  type="text"
                  value={sr.maxDailyAccumulatedAmount}
                  onChange={(e) => onUpdate(sr.id, 'maxDailyAccumulatedAmount', e.target.value)}
                  className="bg-transparent border-transparent px-3 py-1 text-sm text-gray-100 font-semibold text-center w-36 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => onDelete(sr.id)}
                className="w-8 h-8 rounded-full border border-table-border bg-secondary hover:bg-[#393738] text-gray-400 hover:text-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Eliminar regla"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
