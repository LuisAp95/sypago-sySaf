import React from 'react';
import { Users, ShieldAlert, Biohazard } from 'lucide-react';

interface StatCardProps {
  title: string;
  count: number;
  subtext: string;
  icon: React.ReactNode;
  trendChart?: boolean;
  colorType?: 'default' | 'warning' | 'danger';
}

function StatCard({ title, count, subtext, icon, trendChart, colorType = 'default' }: StatCardProps) {
  const getIconBg = () => {
    switch (colorType) {
      case 'warning': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'danger': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="bg-tertiary p-5 rounded-2xl border border-[#3A393C] relative overflow-hidden flex flex-col justify-between shadow-lg">
      <div className="flex items-start gap-4 z-10">
        <div className={`p-3 rounded-xl border ${getIconBg()}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-text-muted text-sm font-medium mb-1">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-primary">{count}</span>
            <span className="text-xs text-text-muted font-mono">/ {subtext}</span>
          </div>
        </div>
      </div>
      
      {trendChart && (
        <div className="absolute bottom-0 left-0 w-full h-12 opacity-30 pointer-events-none">
          <svg viewBox="0 0 100 25" preserveAspectRatio="none" className={`w-full h-full fill-current ${colorType === 'default' ? 'text-blue-500' : colorType === 'warning' ? 'text-orange-500' : 'text-red-500'}`}>
             <path d="M0,25 L0,15 Q10,10 20,15 T40,12 T60,18 T80,8 T100,10 L100,25 Z" opacity="0.3" />
             <path d="M0,15 Q10,10 20,15 T40,12 T60,18 T80,8 T100,10" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      )}
    </div>
  );
}

export const ProfileStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 flex-shrink-0">
      <StatCard 
        title="Usuarios Totales" 
        count={18} 
        subtext="1277,02 Ks." 
        icon={<Users className="w-5 h-5" />} 
        trendChart={true}
      />
      <StatCard 
        title="Usuarios en Cuarentena" 
        count={24} 
        subtext="379,02 Ks." 
        icon={<Biohazard className="w-5 h-5" />} 
        colorType="warning"
      />
      <StatCard 
        title="Usuarios de Alto Riesgo" 
        count={52} 
        subtext="192,00 Ks." 
        icon={<ShieldAlert className="w-5 h-5" />} 
        colorType="danger"
      />
    </div>
  );
};
