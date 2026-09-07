import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { VenezuelaMapTab } from './tabs/VenezuelaMapTab';
import { TravelingClientsTab } from './tabs/TravelingClientsTab';
import { WhitelistMapTab } from './tabs/WhitelistMapTab';

type RegionTabType = 'venezuela' | 'traveling' | 'whitelist';

const TABS: { id: RegionTabType; label: string }[] = [
  { id: 'venezuela', label: 'Mapa de Venezuela' },
  { id: 'traveling', label: 'Clientes en Viaje' },
  { id: 'whitelist', label: 'Mapa de Whitelist Global' },
];

export const RegionsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RegionTabType>('whitelist');

  return (
    <div className="flex flex-col h-full overflow-hidden gap-4">
      <div className="flex border-b border-[#3A393C] shrink-0">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-6 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer focus:outline-none',
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

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTab === 'venezuela' && <VenezuelaMapTab />}
        {activeTab === 'traveling' && <TravelingClientsTab />}
        {activeTab === 'whitelist' && <WhitelistMapTab />}
      </div>
    </div>
  );
};
