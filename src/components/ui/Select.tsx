import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  'aria-label'?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  options, 
  value, 
  defaultValue,
  onChange, 
  icon,
  className,
  placeholder,
  'aria-label': ariaLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use internal state if value is not controlled, otherwise use value
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const currentValue = isControlled ? value : internalValue;

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === currentValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!options || options.length === 0) return null;

  const handleSelect = (val: string) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={ariaLabel || placeholder}
        className={cn(
          "flex w-full items-center justify-between gap-2 px-4 py-2 bg-tertiary border border-tertiary rounded-xl text-sm font-medium text-gray-200 hover:bg-[#3A393C] transition-colors focus:outline-none focus:ring-1 focus:ring-chart-menu",
          className
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {icon}
          <span className="truncate">
            {selectedOption ? selectedOption.label : (placeholder || 'Seleccionar...')}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 ml-1 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[160px] max-h-60 overflow-y-auto bg-tertiary border border-[#3A393C] rounded-xl shadow-xl z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "w-full text-left px-4 py-2 text-sm transition-colors",
                currentValue === opt.value 
                  ? 'bg-primary text-white font-semibold' 
                  : 'text-gray-300 hover:bg-[#3A393C]'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
