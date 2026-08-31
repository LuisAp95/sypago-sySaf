import React from 'react';
import { Layers, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Layers,
  AlertTriangle,
  ShieldAlert,
  Info
};

export interface NotificationItem {
  id: string | number;
  iconType: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

interface DashboardNotificationsProps {
  notifications: NotificationItem[];
}

export const DashboardNotifications: React.FC<DashboardNotificationsProps> = ({ notifications }) => {
  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5 space-y-4 shadow-lg">
      <h3 className="text-sm font-semibold text-white tracking-wide">Últimas notificaciones</h3>

      <div className="space-y-3">
        {notifications?.map((notif) => {
          const IconComp = ICON_MAP[notif.iconType] || Info;
          return (
            <div key={notif.id} className="flex items-start gap-3 p-3.5 bg-tertiary border border-[#3A393C] rounded-xl shadow-md">
              <div className={`p-2 ${notif.iconBg} ${notif.iconColor} rounded-lg shrink-0 mt-0.5`}>
                <IconComp className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-gray-200">{notif.title}</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">{notif.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
