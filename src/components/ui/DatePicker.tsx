import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DatePickerProps {
  value?: string; // Format: YYYY-MM-DD
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  align?: 'left' | 'right';
  label?: string;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAY_NAMES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

export const DatePicker: React.FC<DatePickerProps> = ({
  value = '',
  onChange,
  placeholder = 'Seleccionar fecha',
  className,
  align = 'right',
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize view date (the month/year shown in the calendar picker)
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const parsed = new Date(value + 'T00:00:00');
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  });

  // Whenever the controlled value changes, sync the calendar's internal view date if calendar is closed
  useEffect(() => {
    if (value && !isOpen) {
      const parsed = new Date(value + 'T00:00:00');
      if (!isNaN(parsed.getTime())) {
        setViewDate(parsed);
      }
    }
  }, [value, isOpen]);

  // Click outside to close calendar dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDaySelect = (dayDate: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    const y = dayDate.getFullYear();
    const m = String(dayDate.getMonth() + 1).padStart(2, '0');
    const d = String(dayDate.getDate()).padStart(2, '0');
    const formatted = `${y}-${m}-${d}`;
    onChange?.(formatted);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
  };

  // Formatting date for display: YYYY-MM-DD -> DD/MM/YYYY
  const displayValue = () => {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return value;
  };

  // Generate calendar days grid
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  // Get day of the week (0 = Sunday, 1 = Monday, etc.) and convert to Monday-first (0 = Monday, ..., 6 = Sunday)
  const firstDayIndex = (firstDayOfMonth.getDay() - 1 + 7) % 7;
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const daysGrid: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  // Previous month padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = totalDaysInPrevMonth - i;
    daysGrid.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(year, month - 1, d),
    });
  }

  // Current month days
  for (let i = 1; i <= totalDaysInMonth; i++) {
    daysGrid.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }

  // Next month padding days to reach 6 full rows (42 cells)
  const totalCells = 42;
  const nextMonthDaysCount = totalCells - daysGrid.length;
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    daysGrid.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  return (
    <div className={cn('relative flex flex-col', className)} ref={containerRef}>
      {label && <span className="text-[10px] text-gray-500 mb-0.5">{label}</span>}
      
      <div className="relative">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          className={cn(
            'flex w-full items-center gap-2 px-3 py-1.5 bg-[#2A292A] border border-[#3A393C] rounded-lg text-xs font-medium text-gray-300 hover:bg-[#393738] hover:border-[#4E4D4E] transition-colors cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-chart-menu focus:border-chart-menu',
            isOpen && 'border-chart-menu ring-1 ring-chart-menu bg-[#28272b]'
          )}
        >
          <CalendarIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className={cn('truncate flex-1 text-left', !value && 'text-gray-500')}>
            {displayValue() || placeholder}
          </span>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-[#4E4D4E] text-gray-400 hover:text-white transition-colors shrink-0"
              aria-label="Limpiar fecha"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-1.5 w-64 bg-[#2A292A] border border-[#3A393C] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg border border-[#3A393C] hover:bg-[#393738] text-gray-400 hover:text-white transition-colors"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-gray-200">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg border border-[#3A393C] hover:bg-[#393738] text-gray-400 hover:text-white transition-colors"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAY_NAMES.map((name) => (
              <span key={name} className="text-[10px] font-semibold text-gray-500 py-0.5">
                {name}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysGrid.map((item, index) => {
              const itemDateString = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, '0')}-${String(item.date.getDate()).padStart(2, '0')}`;
              const isSelected = value === itemDateString;
              const isToday = new Date().toDateString() === item.date.toDateString();

              return (
                <button
                  key={`${itemDateString}-${index}`}
                  type="button"
                  onClick={(e) => handleDaySelect(item.date, e)}
                  className={cn(
                    'h-7 w-7 text-xs rounded-lg flex items-center justify-center transition-all cursor-pointer focus:outline-none',
                    item.isCurrentMonth
                      ? 'text-gray-300 hover:bg-[#393738] hover:text-white'
                      : 'text-gray-600 hover:bg-[#393738] hover:text-gray-400',
                    isSelected
                      ? 'bg-chart-menu text-white font-semibold hover:bg-chart-menu'
                      : isToday && 'border border-chart-menu text-chart-menu font-medium'
                  )}
                >
                  {item.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
