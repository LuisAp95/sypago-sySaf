import React from 'react';

export const StatsView: React.FC = () => {
  return (
    <div className="p-6 bg-[#161920] border border-[#1f232b] rounded-xl text-white">
      <h2 className="text-xl font-bold mb-2">Estadísticas Avanzadas</h2>
      <p className="text-gray-400">Métricas en tiempo real sobre tasa de rechazo, volumen transaccional y falsos positivos.</p>
    </div>
  );
};
