import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export interface DropdownOption {
  label: string;
  value: string;
  flag?: string;
  subLabel?: string;
}

interface CustomDropdownSelectProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  searchable?: boolean;
}

export const CustomDropdownSelect: React.FC<CustomDropdownSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  searchable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable && searchTerm
    ? options.filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative min-w-[150px] max-w-[220px]" ref={containerRef}>
      {/* Botón trigger principal estilizado igual a los selects del sistema */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={[
          'w-full flex items-center justify-between gap-2 px-3 py-1.5 h-8 text-xs font-medium text-white',
          'bg-[#1E1D1F] border border-[#3A393C] rounded-lg transition-colors cursor-pointer outline-none',
          'hover:border-[#555] focus:border-[#1DA493]',
          disabled ? 'opacity-40 cursor-not-allowed' : '',
          isOpen ? 'border-[#1DA493] ring-1 ring-[#1DA493]' : '',
        ].join(' ')}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {selectedOption?.flag && (
            <span className="text-sm shrink-0 leading-none">{selectedOption.flag}</span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${
            isOpen ? 'rotate-180 text-[#1DA493]' : ''
          }`}
        />
      </button>

      {/* Menú flotante estilizado */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full min-w-[180px] max-h-60 bg-[#1E1D1F] border border-[#3A393C] rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Buscador opcional */}
          {searchable && options.length > 5 && (
            <div className="p-2 border-b border-[#2A292A] shrink-0">
              <div className="flex items-center gap-2 px-2 py-1 bg-[#141315] border border-[#2A292A] rounded-md">
                <Search className="w-3 h-3 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  autoFocus
                  className="w-full bg-transparent text-xs text-white placeholder-gray-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Opciones */}
          <div className="overflow-y-auto custom-scrollbar max-h-48 p-1 flex flex-col gap-0.5">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-gray-500">Sin resultados</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={[
                      'w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors text-left cursor-pointer',
                      isSelected
                        ? 'bg-[#1DA493]/15 text-[#1DA493] font-semibold'
                        : 'text-gray-300 hover:bg-[#2A292A] hover:text-white',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      {opt.flag && <span className="text-sm shrink-0">{opt.flag}</span>}
                      <span className="truncate">{opt.label}</span>
                    </div>
                    {opt.subLabel && (
                      <span className="text-[10px] text-gray-500 shrink-0">{opt.subLabel}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
