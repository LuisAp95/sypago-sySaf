import React from 'react';
import { cn } from '@/utils/cn';

export type ProfileTabType = 'general' | 'devices' | 'ips' | 'regions' | 'audit';

interface ProfileDetailTabsProps {
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
}

const TABS: { id: ProfileTabType; label: string }[] = [
  { id: 'general', label: 'Información General' },
  { id: 'devices', label: 'Dispositivos Registrados' },
  { id: 'ips', label: 'IPs Permitidas' },
  { id: 'regions', label: 'Aviso de Viaje' },
  { id: 'audit', label: 'Registro de Auditoría' },
];

export const ProfileDetailTabs: React.FC<ProfileDetailTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-[#3A393C] mb-6 gap-2">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-5 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer focus:outline-none',
              isActive
                ? 'border-[#1DA493] text-[#1DA493]'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

