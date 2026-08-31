import React from 'react';

export const DashboardActions: React.FC = () => {
  return (
    <div className="bg-tertiary border border-[#3A393C] rounded-2xl p-5 flex flex-col justify-between shadow-lg">
      <h3 className="text-sm font-semibold text-white tracking-wide">Acciones requeridas</h3>

      <div className="flex-1 flex items-center justify-center py-12">
        <span className="text-sm font-medium text-gray-400">Sin acciones requeridas</span>
      </div>
    </div>
  );
};
