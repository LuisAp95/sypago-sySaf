import React, { useState } from 'react';
import type { UserProfile, AllowedRegionInfo } from '../../../mocks/profilesData';
import { ProfileDetailHeader } from './ProfileDetailHeader';
import { ProfileDetailTabs, type ProfileTabType } from './ProfileDetailTabs';
import { ProfileGeneralTab } from './ProfileGeneralTab';
import { ProfileDevicesTab } from './ProfileDevicesTab';
import { ProfileIpsTab } from './ProfileIpsTab';
import { ProfileRegionsTab } from './ProfileRegionsTab';
import { ProfileAuditTab } from './ProfileAuditTab';

interface UserProfileDetailViewProps {
  user: UserProfile;
  onBack: () => void;
}

export const UserProfileDetailView: React.FC<UserProfileDetailViewProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<ProfileTabType>('general');
  const [regionsList, setRegionsList] = useState<AllowedRegionInfo[]>(user.allowedRegions || []);

  const handleAddRegion = (newRegionData: Omit<AllowedRegionInfo, 'id' | 'status'>) => {
    const createdRegion: AllowedRegionInfo = {
      ...newRegionData,
      id: `reg-${Date.now()}`,
      status: 'Vigente',
    };
    setRegionsList((prev) => [createdRegion, ...prev]);
  };

  const handleRemoveRegion = (id: string) => {
    setRegionsList((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-secondary text-text-primary p-6 rounded-xl overflow-hidden">
      {/* Cabecera con botón de regresar */}
      <ProfileDetailHeader user={user} onBack={onBack} />

      {/* Navegación por pestañas */}
      <ProfileDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenido dinámico según la pestaña seleccionada que ocupa todo el espacio sobrante */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {activeTab === 'general' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <ProfileGeneralTab user={user} />
          </div>
        )}
        {activeTab === 'devices' && <ProfileDevicesTab devices={user.devicesList || []} />}
        {activeTab === 'ips' && <ProfileIpsTab ips={user.allowedIps || []} />}
        {activeTab === 'regions' && (
          <ProfileRegionsTab
            regions={regionsList}
            onAddRegion={handleAddRegion}
            onRemoveRegion={handleRemoveRegion}
          />
        )}
        {activeTab === 'audit' && <ProfileAuditTab logs={user.auditLogs || []} />}
      </div>
    </div>
  );
};
