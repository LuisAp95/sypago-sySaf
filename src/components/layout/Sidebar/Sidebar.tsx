import React, { useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PanelLeftOpen, PanelRightOpen, LogOut } from 'lucide-react';
import { sidebarNavConfig, type SidebarNavGroup } from './sidebarNav.config';
import { useSidebarStore } from './useSidebarStore';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { cn } from '@/utils/cn';
import logo from '../../../../public/logo.png';

export const Sidebar: React.FC = () => {
  const { isCollapsed, toggleCollapsed, setActiveItemId } = useSidebarStore();
  const { canViewModule, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Buscar qué elemento coincide con el pathname actual
  const activeItemId = useMemo(() => {
    if (location.pathname === '/logout') {
      return 'logout';
    }
    const currentItem = sidebarNavConfig
      .flatMap((group) => group.items)
      .find((item) => item.path === location.pathname);
    return currentItem ? currentItem.id : 'vista-principal';
  }, [location.pathname]);

  // Sincronizar el ID activo del store de Zustand por retrocompatibilidad
  useEffect(() => {
    setActiveItemId(activeItemId);
  }, [activeItemId, setActiveItemId]);

  // Filtrar la navegación según los permisos del usuario autenticado
  const filteredNavConfig = useMemo<SidebarNavGroup[]>(() => {
    return sidebarNavConfig
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => canViewModule(item.moduloPermiso)),
      }))
      .filter((group) => group.items.length > 0);
  }, [canViewModule]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-primary text-gray-300 transition-all duration-300 ease-in-out select-none z-30',
        isCollapsed ? 'w-20' : 'w-80'
      )}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between h-16 px-4 ">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center min-w-10 h-10 ">
            <img src={logo} alt="logo" className='object-cover' />
          </div>
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={toggleCollapsed}
          className="flex items-center justify-center p-1 text-gray-400 hover:text-white transition-colors"
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? (
            <PanelRightOpen className="w-6 h-6" />
          ) : (
            <PanelLeftOpen className="w-6 h-6" />
          )}
        </button>
      </div>
      <div className="mx-4 my-1.5 border-t border-tertiary" />

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {filteredNavConfig.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-0.5">
            {/* Separator line + Section Title */}
            {group.sectionTitle && !isCollapsed && (
              <>
                <div className="mx-1 my-1.5 border-t border-tertiary" />
                <div className="px-3 pt-1 pb-0.5 text-[11px] font-bold text-gray-500 tracking-widest uppercase">
                  {group.sectionTitle}
                </div>
              </>
            )}

            {group.sectionTitle && isCollapsed && (
              <div className="my-1.5 border-t border-tertiary" />
            )}

            {/* Section Items */}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItemId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 group relative',
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  )}
                  style={isActive ? {
                    background: 'linear-gradient(to left, #1EA291 0%, #1EA29166 15%, #1EA29130 35%, #1EA29118 55%, #1EA29110 75%, #1EA29108 100%)'
                  } : undefined}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-gray-200'
                    )}
                  />

                  {!isCollapsed && (
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] text-gray-500 font-normal ml-2 shrink-0 italic">
                          ({item.badge})
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Logout button */}
      <div className="p-2">
        <div className="mx-1 mb-1.5 border-t border-tertiary" />
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-red-400 hover:bg-secondary',
            activeItemId === 'logout' && 'bg-secondary font-semibold text-red-300'
          )}
          title={isCollapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};
