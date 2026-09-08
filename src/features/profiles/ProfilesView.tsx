import React, { useState, useMemo } from 'react';
import { Smartphone, Laptop, Fingerprint, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight, Search } from 'lucide-react';
import { profilesData } from '../../mocks/profilesData';
import type { UserProfile } from '../../mocks/profilesData';

import { ViewHeader } from '@/components/ui/ViewHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import type { ColumnDef } from '@/components/ui/DataGrid';
import { UserProfileDetailView } from './components/UserProfileDetailView';

const STATUS_OPTIONS = [
  { label: 'Todos los estados', value: 'todos' },
  { label: 'Activo', value: 'Activo' },
  { label: 'Inactivo', value: 'Inactivo' }
];

export const ProfilesView: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'Seguro': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Medio': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Alto': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Bajo': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const filteredData = useMemo(() => {
    return profilesData.filter(user => {
      if (statusFilter !== 'todos') {
        const isActivo = user.huellaSegura;
        if (statusFilter === 'Activo' && !isActivo) return false;
        if (statusFilter === 'Inactivo' && isActivo) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = user.name.toLowerCase().includes(query);
        const matchCedula = user.cedula.toLowerCase().includes(query);
        const matchIp = user.lastIp.toLowerCase().includes(query);
        const matchDevice = user.device.toLowerCase().includes(query);
        if (!matchName && !matchCedula && !matchIp && !matchDevice) return false;
      }
      return true;
    });
  }, [statusFilter, searchQuery]);

  const columns: ColumnDef<UserProfile>[] = [
    { 
      header: 'Nombre', 
      accessorKey: 'name',
      cell: (item) => (
        <button
          onClick={() => setSelectedUser(item)}
          className="font-semibold text-[#1DA493] hover:text-[#25c4b0] hover:underline cursor-pointer text-left focus:outline-none transition-colors"
          title="Ver detalle del perfil"
        >
          {item.name}
        </button>
      )
    },
    { 
      header: 'Cédula', 
      accessorKey: 'cedula',
      cell: (item) => <span className="font-mono text-sm">{item.cedula}</span>
    },
    { 
      header: 'Tipo de Perfil', 
      accessorKey: 'profileType',
      cell: (item) => <span className="text-sm">{item.profileType}</span>
    },
    {
      header: 'Dispositivo',
      accessorKey: 'device',
      cell: (item) => (
        <div className="flex items-center gap-2">
          {item.device === 'Teléfono' ? (
            <Smartphone className="w-4 h-4 text-text-muted" />
          ) : (
            <Laptop className="w-4 h-4 text-text-muted" />
          )}
          <span className="text-sm">{item.device}</span>
        </div>
      )
    },
    {
      header: 'Huella',
      accessorKey: 'huellaSegura',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Fingerprint className={`w-4 h-4 ${item.huellaSegura ? 'text-emerald-500' : 'text-text-muted'}`} />
          <span className={`text-sm ${item.huellaSegura ? 'text-emerald-500' : 'text-text-muted'}`}>
            {item.huellaSegura ? 'Segura' : 'No Segura'}
          </span>
        </div>
      )
    },
    {
      header: 'Última IP / Seguridad',
      accessorKey: 'lastIp',
      className: 'text-right',
      cell: (item) => (
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-sm text-text-secondary">{item.lastIp}</span>
          <span className={`text-[10px] uppercase font-bold tracking-wider ${getSecurityColor(item.securityLevel).split(' ')[0]}`}>
            {item.securityLevel}
          </span>
        </div>
      )
    }
  ];

  // Si hay un usuario seleccionado, se despliega la vista detallada del perfil
  if (selectedUser) {
    return (
      <UserProfileDetailView 
        user={selectedUser} 
        onBack={() => setSelectedUser(null)} 
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-secondary text-text-primary rounded-xl overflow-hidden">
      <ViewHeader
        selectOptions={STATUS_OPTIONS}
        selectValue={statusFilter}
        onSelectChange={setStatusFilter}
        showSearch
        showFilter
        showCopy
      />

      {/* Área Flexible para la Tabla */}
      <div className="flex-1 overflow-hidden flex flex-col gap-6">
        
        {/* Contenedor del DataGrid con Scroll */}
        <div className="flex-1 flex flex-col border border-table-border rounded-xl overflow-hidden bg-primary drop-shadow-2xl">
          <div className="p-4 bg-surface border-b border-table-border flex items-center justify-between">
            <h2 className="font-semibold text-text-primary">Usuarios de Perfil</h2>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar por Nombre, Cédula o IP"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-tertiary border border-table-border rounded-lg pl-9 pr-4 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
          
          <DataTable 
            data={filteredData}
            columns={columns}
            wrapperClassName="border-0 rounded-none flex-1 bg-tertiary overflow-auto"
            headerClassName="bg-surface sticky top-0 z-10"
            tableClassName="min-w-max w-full"
          />

          {/* Pagination */}
          <div className="bg-surface p-4 flex items-center justify-between text-sm font-semibold text-text-primary border-t border-table-border">
            <div className="w-[150px]"></div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronsLeft className="w-4 h-4" /></Button>
              <span>1</span>
              <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronsRight className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronRight className="w-4 h-4" /></Button>
            </div>
            <div className="text-right w-[150px]">{filteredData.length} Usuarios</div>
          </div>
        </div>
      </div>
    </div>
  );
};


