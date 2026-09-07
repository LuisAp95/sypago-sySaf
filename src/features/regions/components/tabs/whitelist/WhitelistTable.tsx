import React from 'react';
import { Trash2, Edit2, ShieldCheck, MapPin } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ColumnDef } from '@/components/ui/DataGrid';
import type { WhitelistEntry } from '../../../hooks/useWhitelist';

interface WhitelistTableProps {
  entries: WhitelistEntry[];
  onRemove: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const WhitelistTable: React.FC<WhitelistTableProps> = ({ entries, onRemove, onToggleStatus }) => {
  const columns: ColumnDef<WhitelistEntry>[] = [
    {
      header: 'País/Estado',
      accessorKey: 'country',
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white text-sm">{item.country}</span>
          {item.city && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#1DA493]" />
              {item.city}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Método de Validación',
      accessorKey: 'validationMethod',
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#1DA493]" />
          <span>{item.validationMethod}</span>
        </div>
      ),
    },
    {
      header: 'Añadido Por',
      accessorKey: 'addedBy',
      cell: (item) => <span className="text-gray-300 text-xs">{item.addedBy}</span>,
    },
    {
      header: 'Fecha',
      accessorKey: 'date',
      cell: (item) => <span className="text-gray-300 text-xs">{item.date}</span>,
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: (item) => (
        <Badge variant={item.status === 'Activo' ? 'activo' : 'inactivo'}>
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      accessorKey: 'id',
      className: 'text-right',
      cell: (item) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleStatus(item.id)}
            className="w-8 h-8 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors"
            title={item.status === 'Activo' ? 'Desactivar' : 'Activar'}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="w-8 h-8 rounded-lg hover:bg-red-900/30 hover:text-red-400 text-gray-400 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-6 border border-table-border rounded-xl overflow-hidden bg-primary drop-shadow-2xl">
      <DataTable
        data={entries}
        columns={columns}
        wrapperClassName="border-0 rounded-none bg-tertiary"
        headerClassName="bg-surface"
      />
    </div>
  );
};
