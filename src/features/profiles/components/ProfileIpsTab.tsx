import React from 'react';
import { Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AllowedIpInfo } from '../../../mocks/profilesData';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import type { ColumnDef } from '@/components/ui/DataGrid';

interface ProfileIpsTabProps {
  ips: AllowedIpInfo[];
}

export const ProfileIpsTab: React.FC<ProfileIpsTabProps> = ({ ips }) => {
  const columns: ColumnDef<AllowedIpInfo>[] = [
    {
      header: 'Dirección IP',
      accessorKey: 'ip',
      cell: (item) => <span className="font-mono text-[#1DA493] font-semibold text-sm">{item.ip}</span>,
    },
    {
      header: 'Descripción / Etiqueta',
      accessorKey: 'label',
      cell: (item) => <span className="text-text-primary font-medium text-sm">{item.label}</span>,
    },
    {
      header: 'Fecha Agregada',
      accessorKey: 'addedDate',
      cell: (item) => <span className="text-text-muted text-xs font-mono">{item.addedDate}</span>,
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      className: 'text-right',
      cell: (item) => (
        <div className="flex justify-end">
          <Badge variant={item.status === 'Permitida' ? 'valida' : 'bloqueada'}>
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
          <Globe className="w-5 h-5 text-[#1DA493]" />
          <span>IPs Permitidas / Lista Blanca</span>
        </div>
        <span className="text-xs text-text-muted font-mono">{ips.length} registros</span>
      </div>

      {/* DataTable con fondo bg-tertiary, scroll interno y cabecera sticky bg-surface como en Reportes */}
      <DataTable
        data={ips}
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
        <div className="text-right w-[150px]">{ips.length} Registros IP</div>
      </div>
    </div>
  );
};


