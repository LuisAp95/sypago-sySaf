import React, { useState } from 'react';
import { Plane, Plus, MapPin, ChevronLeft, ChevronRight, Trash2, ShieldCheck } from 'lucide-react';
import type { AllowedRegionInfo } from '../../../mocks/profilesData';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import type { ColumnDef } from '@/components/ui/DataGrid';
import { TravelNotificationModal } from './TravelNotificationModal';

interface ProfileRegionsTabProps {
  regions: AllowedRegionInfo[];
  onAddRegion: (newRegion: Omit<AllowedRegionInfo, 'id' | 'status'>) => void;
  onRemoveRegion: (id: string) => void;
}

export const ProfileRegionsTab: React.FC<ProfileRegionsTabProps> = ({
  regions,
  onAddRegion,
  onRemoveRegion,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDef<AllowedRegionInfo>[] = [
    {
      header: 'País / Ciudad',
      accessorKey: 'country',
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#2A292A] border border-[#3A393C] text-[#1DA493] shrink-0">
            <Plane className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white text-sm">{item.country}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#1DA493]" />
              {item.city}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Rango de Fechas',
      accessorKey: 'startDate',
      cell: (item) => (
        <span className="font-mono text-xs text-gray-300">
          {item.startDate} al {item.endDate}
        </span>
      ),
    },
    {
      header: 'Lista Blanca IPs',
      accessorKey: 'autoWhitelistIp',
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#1DA493]" />
          <span>{item.autoWhitelistIp ? 'Automático en Lista Blanca' : 'Manual'}</span>
        </div>
      ),
    },
    {
      header: 'Motivo / Observaciones',
      accessorKey: 'reason',
      cell: (item) => <span className="text-gray-300 text-xs">{item.reason}</span>,
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: (item) => {
        const variantMap: Record<string, string> = {
          Vigente: 'valida',
          Programado: 'activo',
          Vencido: 'inactivo',
        };
        return <Badge variant={variantMap[item.status] || 'default'}>{item.status}</Badge>;
      },
    },
    {
      header: 'Acción',
      accessorKey: 'id',
      className: 'text-right',
      cell: (item) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveRegion(item.id)}
            className="w-8 h-8 rounded-lg hover:bg-red-900/30 hover:text-red-400 text-gray-400 transition-colors"
            title="Revocar / Eliminar permiso de viaje"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col border border-table-border rounded-xl overflow-hidden bg-primary drop-shadow-2xl min-h-0">
      {/* Encabezado del DataGrid con botón de acción */}
      <div className="p-4 bg-surface border-b border-table-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 font-semibold text-text-primary">
          <Plane className="w-5 h-5 text-[#1DA493]" />
          <span>Regiones Permitidas y Notificaciones de Viaje</span>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1DA493] hover:bg-[#25c4b0] text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Notificación de Viaje</span>
        </button>
      </div>

      {/* DataTable con fondo bg-tertiary, scroll interno y cabecera sticky bg-surface */}
      <DataTable
        data={regions}
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
        <div className="text-right w-[150px]">{regions.length} Permisos</div>
      </div>

      {/* Modal de Notificación de Viaje */}
      <TravelNotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddRegion}
      />
    </div>
  );
};
