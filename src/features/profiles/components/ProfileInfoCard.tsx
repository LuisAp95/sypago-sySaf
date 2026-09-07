import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface InfoFieldItem {
  label: string;
  value: React.ReactNode;
  span?: number;
}

interface ProfileInfoCardProps {
  title: string;
  icon?: React.ReactNode;
  fields: InfoFieldItem[];
  columns?: 1 | 2 | 3 | 4;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  title,
  icon,
  fields,
  columns = 2,
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  }[columns];

  const handleToggle = () => {
    if (collapsible) {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="bg-[#2A292A] border border-[#3A393C] rounded-2xl p-5 shadow-lg space-y-4">
      {/* Título de la tarjeta */}
      <div
        onClick={handleToggle}
        className={`flex items-center justify-between text-white font-bold text-base ${
          collapsible ? 'cursor-pointer select-none' : ''
        } ${!isCollapsed ? 'pb-3 border-b border-[#3A393C]' : ''}`}
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-[#1DA493]">{icon}</span>}
          <span>{title}</span>
        </div>

        {collapsible && (
          <button
            type="button"
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors focus:outline-none"
            aria-label={isCollapsed ? 'Expandir' : 'Contraer'}
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Grilla de Campos */}
      {!isCollapsed && (
        <div className={`grid ${gridCols} gap-5 animate-in fade-in duration-200`}>
          {fields.map((field, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${field.span === 2 ? 'md:col-span-2' : ''}`}
            >
              <span className="text-xs font-medium text-gray-400 tracking-wide">
                {field.label}
              </span>
              <div className="text-sm font-semibold text-white mt-1">
                {field.value ?? '—'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


