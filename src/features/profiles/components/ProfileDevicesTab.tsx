import React from 'react';
import { Smartphone, Laptop, HardDrive, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DeviceInfo } from '../../../mocks/profilesData';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import type { ColumnDef } from '@/components/ui/DataGrid';

interface ProfileDevicesTabProps {
  devices: DeviceInfo[];
}

export const ProfileDevicesTab: React.FC<ProfileDevicesTabProps> = ({ devices }) => {
  const columns: ColumnDef<DeviceInfo>[] = [
    {
      header: 'Dispositivo',
      accessorKey: 'name',
      cell: (item) => <span className="font-semibold text-[#1DA493] text-sm">{item.name}</span>,
    },
    {
      header: 'Tipo',
      accessorKey: 'type',
      cell: (item) => (
        <div className="flex items-center gap-2 text-text-primary text-sm">
          {item.type === 'Teléfono' ? (
            <Smartphone className="w-4 h-4 text-[#1DA493]" />
          ) : (
            <Laptop className="w-4 h-4 text-[#1DA493]" />
          )}
          <span>{item.type}</span>
        </div>
      ),
    },
    {
      header: 'Último Acceso',
      accessorKey: 'lastAccess',
      cell: (item) => <span className="text-text-muted text-xs font-mono">{item.lastAccess}</span>,
    },
    {
      header: 'IP Conexión',
      accessorKey: 'ip',
      cell: (item) => <span className="font-mono text-xs text-text-secondary">{item.ip}</span>,
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      className: 'text-right',
      cell: (item) => (
        <div className="flex justify-end">
          <Badge variant={item.status === 'Activo' ? 'activo' : 'inactivo'}>
            {item.status}
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col border border-table-border rounded-xl overflow-hidden bg-primary drop-shadow-2xl min-h-0">
      {/* Encabezado del DataGrid idéntico al de Reportes */}
      <div className="p-4 bg-surface border-b border-table-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 font-semibold text-text-primary">
          <HardDrive className="w-5 h-5 text-[#1DA493]" />
          <span>Dispositivos Registrados</span>
        </div>
        <span className="text-xs text-text-muted font-mono">{devices.length} registros</span>
      </div>

      {/* DataTable con fondo bg-tertiary, scroll interno y cabecera sticky bg-surface como en Reportes */}
      <DataTable
        data={devices}
        columns={columns}
        wrapperClassName="border-0 rounded-none flex-1 bg-tertiary overflow-auto custom-scrollbar"
        headerClassName="bg-surface sticky top-0 z-10"
        tableClassName="min-w-max w-full"
      />

      {/* Pie de página con paginador estilizado igual a Reportes */}
      <div className="bg-surface p-4 flex items-center justify-between text-sm font-semibold text-text-primary border-t border-table-border shrink-0">
        <div className="w-[150px]"></div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronLeft className="w-4 h-4 text-text-muted" /></Button>
          <span>1</span>
          <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronRight className="w-4 h-4 text-text-muted" /></Button>
        </div>
        <div className="text-right w-[150px]">{devices.length} Dispositivos</div>
      </div>
    </div>
  );
};


