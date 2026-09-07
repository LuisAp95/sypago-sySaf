import React from 'react';
import { ChevronLeft, User } from 'lucide-react';
import type { UserProfile } from '../../../mocks/profilesData';

interface ProfileDetailHeaderProps {
  user: UserProfile;
  onBack: () => void;
}

export const ProfileDetailHeader: React.FC<ProfileDetailHeaderProps> = ({ user, onBack }) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Botón de Regresar alineado a la izquierda */}
      <div className="flex items-center justify-start">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2A292A] border border-[#3A393C] text-gray-300 hover:text-white hover:border-[#1DA493] hover:bg-[#393738] transition-all font-semibold text-sm group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-[#1DA493] group-hover:-translate-x-0.5 transition-transform" />
          <span>Regresar a Perfiles</span>
        </button>
      </div>

      {/* Banner Principal del Usuario */}
      <div className="flex items-center gap-4 p-5 bg-[#2A292A] border border-[#3A393C] rounded-2xl shadow-lg">
        <div className="relative w-14 h-14 rounded-full bg-[#131315] border border-[#3A393C] text-[#1DA493] flex items-center justify-center shrink-0">
          <User className="w-8 h-8 text-[#1DA493]" />
        </div>

        <div className="flex flex-col min-w-0">
          <h1 className="text-xl font-bold text-white tracking-tight truncate">
            {user.name} - ID: {user.id}
          </h1>
          <span className="text-xs text-gray-400 font-mono mt-0.5">
            ID: {user.id}
          </span>
        </div>
      </div>
    </div>
  );
};

