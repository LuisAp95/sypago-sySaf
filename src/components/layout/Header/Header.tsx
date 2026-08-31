import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useSidebarStore } from '../Sidebar/useSidebarStore';

export const Header: React.FC = () => {
  const { activeItemId } = useSidebarStore();

  const getPageTitle = (id: string) => {
    const titles: Record<string, string> = {
      'vista-principal': 'Vista Principal',
      'versiones': 'Historial de Versiones del Motor',
      'visor-reglas': 'Visor de Reglas Antifraude',
      'reportes': 'Generación de Reportes',
      'cuarentena': 'Bandeja de Transacciones en Cuarentena',
      'estadisticas': 'Estadísticas Avanzadas',
      'lista-negra': 'Filtros: Lista Negra de Entidades Bloqueadas',
      'region': 'Filtros por Región Geográfica',
      'perfiles': 'Perfiles Comportamentales de Riesgo',
      'definicion-reglas': 'Definición de Reglas Antifraude',
      'reglas-canal': 'Ponderación de Reglas por Canal',
      'definicion-excepciones': 'Definición de Reglas de Excepción',
      'excepciones-usuario': 'Excepciones por Usuario / Cliente',
      'usuarios-roles': 'Administración de Usuarios y Roles (RBAC)',
      'auditoria': 'Log Inmutable de Auditoría de Sistema',
    };
    return titles[id] || 'SySAF Antifraude';
  };

  return (
    <header className="h-16 bg-[#111317] border-b border-[#1f232b] px-6 flex items-center justify-between text-gray-200 sticky top-0 z-20">
      {/* Title & Path */}
      <div>
        <h1 className="text-lg font-semibold text-white tracking-wide">
          {getPageTitle(activeItemId)}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar regla, IP, transacción..."
            className="bg-[#181b22] border border-[#262b37] rounded-xl pl-9 pr-4 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00df8f] transition-colors w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-[#181b22] hover:bg-[#222731] border border-[#262b37] text-gray-400 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00df8f] animate-pulse" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#262b37]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00df8f]/20 to-[#00b894]/40 border border-[#00df8f]/30 flex items-center justify-center text-[#00df8f]">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-medium text-white leading-tight">
              Operador Antifraude
            </span>
            <span className="text-[10px] text-gray-400">Analista Senior</span>
          </div>
        </div>
      </div>
    </header>
  );
};
