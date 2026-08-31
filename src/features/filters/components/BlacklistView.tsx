import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/mocks/api';
import { ViewHeader } from '@/components/ui/ViewHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { DataGrid, type ColumnDef } from '@/components/ui/DataGrid';
import { Eye } from 'lucide-react';
import { BlacklistDetailModal } from './BlacklistDetailModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { auditService } from '@/features/administration';

interface BlacklistItem {
  id: string;
  status: 'Activo' | 'Inactivo' | string;
  field: string;
  value: string;
  action: string;
  lastModified: string;
  eventsRegistered: number;
}

const STATUS_OPTIONS = [
  { label: 'Todos los estados', value: 'todos' },
  { label: 'Activo', value: 'Activo' },
  { label: 'Inactivo', value: 'Inactivo' }
];

export const BlacklistView: React.FC = () => {
  const { data: initialBlacklist, isLoading } = useQuery<BlacklistItem[]>({
    queryKey: ['blacklist'],
    queryFn: api.getBlacklist
  });

  const [items, setItems] = useState<BlacklistItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<BlacklistItem | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'activate' | 'deactivate';
    ids: string[];
  }>({ isOpen: false, type: 'activate', ids: [] });

  useEffect(() => {
    if (initialBlacklist) {
      setItems(initialBlacklist);
    }
  }, [initialBlacklist]);

  const filteredData = useMemo(() => {
    if (statusFilter === 'todos') {
      return items;
    }
    return items.filter(
      item => item.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [items, statusFilter]);

  const allFilteredSelected =
    filteredData.length > 0 &&
    filteredData.every(item => selectedIds.includes(item.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      const visibleIdSet = new Set(filteredData.map(item => item.id));
      setSelectedIds(prev => prev.filter(id => !visibleIdSet.has(id)));
    } else {
      const visibleIds = filteredData.map(item => item.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleActivate = () => {
    if (selectedIds.length === 0) return;
    setConfirmDialog({ isOpen: true, type: 'activate', ids: selectedIds });
  };

  const handleDeactivate = () => {
    if (selectedIds.length === 0) return;
    setConfirmDialog({ isOpen: true, type: 'deactivate', ids: selectedIds });
  };

  const handleConfirmAction = () => {
    const { type, ids } = confirmDialog;
    const newStatus = type === 'activate' ? 'Activo' : 'Inactivo';
    
    setItems(prev =>
      prev.map(item =>
        ids.includes(item.id) ? { ...item, status: newStatus } : item
      )
    );
    setSelectedIds(prev => prev.filter(id => !ids.includes(id)));

    // Registrar auditoría para cada entrada
    for (const id of ids) {
      const item = items.find(i => i.id === id);
      auditService.logSync({
        module: 'Lista Negra',
        action: type === 'activate' ? 'ACTIVATE' : 'DEACTIVATE',
        entityType: 'Entrada de Lista Negra',
        entityId: id,
        entityName: item ? `${item.field}: ${item.value}` : id,
        details: type === 'activate'
          ? `Entrada "${item?.value}" activada en lista negra`
          : `Entrada "${item?.value}" desactivada en lista negra`,
        previousValue: { status: item?.status },
        newValue: { status: newStatus },
      });
    }
  };

  const columns: ColumnDef<BlacklistItem>[] = [
    {
      header: undefined,
      className: 'w-[5%] pl-4',
      cell: (item) => (
        <Checkbox
          checked={selectedIds.includes(item.id)}
          onCheckedChange={() => handleToggleSelectRow(item.id)}
          onClick={(e) => e.stopPropagation()}
        />
      )
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      className: 'w-[12%]',
      cell: (item) => <Badge variant={item.status as any}>{item.status}</Badge>
    },
    { header: 'Campo', accessorKey: 'field', className: 'w-[15%]' },
    { header: 'Valor', accessorKey: 'value', className: 'w-[18%] font-mono' },
    {
      header: 'Acción',
      accessorKey: 'action',
      className: 'w-[15%]',
      cell: (item) => <Badge variant={item.action as any}>{item.action}</Badge>
    },
    {
      header: 'Última modificación',
      accessorKey: 'lastModified',
      className: 'w-[18%] min-w-[190px]'
    },
    {
      header: 'Eventos registrados',
      accessorKey: 'eventsRegistered',
      className: 'flex-1 min-w-[190px] items-end pr-6 whitespace-nowrap'
    },
    {
      header: undefined,
      className: 'w-[33px] shrink-0 p-0 m-0',
      cell: () => <div className="w-[1px] h-8 bg-[#333235] mx-4" />
    },
    {
      header: undefined,
      className: 'w-[8%] flex-row items-center h-full justify-center pr-2',
      cell: (item) => (
        <Button
          variant="secondary"
          size="icon"
          className="w-8 h-8 rounded-full bg-transparent border-transparent hover:bg-[#333235] text-[#9E9D9F] hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedItemForDetail(item);
            setIsDetailModalOpen(true);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-secondary text-text-primary rounded-xl">
      <ViewHeader
        selectOptions={STATUS_OPTIONS}
        selectValue={statusFilter}
        onSelectChange={setStatusFilter}
        showSearch
        showFilter
        showAdd
        showCopy
      />

      <div className="flex-1 overflow-hidden flex flex-col gap-6">
        {/* List Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              id="selectAll"
              checked={allFilteredSelected}
              onCheckedChange={handleToggleSelectAll}
            />
            <label
              htmlFor="selectAll"
              className="text-sm cursor-pointer text-text-primary select-none"
            >
              Seleccionar Todos
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleActivate}
              disabled={selectedIds.length === 0}
              className="bg-tertiary border border-tertiary hover:bg-[#3A393C] text-gray-200 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Activar
            </Button>
            <Button
              variant="secondary"
              onClick={handleDeactivate}
              disabled={selectedIds.length === 0}
              className="bg-tertiary border border-tertiary hover:bg-[#3A393C] text-gray-200 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Inactivar
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto pr-2">
          <DataGrid
            data={filteredData}
            columns={columns}
            isLoading={isLoading}
            onRowClick={(item) => handleToggleSelectRow(item.id)}
            emptyMessage="No se encontraron registros en la lista negra"
          />
        </div>
      </div>

      <BlacklistDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={selectedItemForDetail}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmDialog.type === 'activate' ? 'Activar Regla' : 'Inactivar Regla'}
        message={
          confirmDialog.ids.length > 1
            ? `¿Está seguro que desea ${confirmDialog.type === 'activate' ? 'activar' : 'inactivar'} las ${confirmDialog.ids.length} reglas seleccionadas en la lista negra?`
            : `¿Está seguro que desea ${confirmDialog.type === 'activate' ? 'activar' : 'inactivar'} esta regla de la lista negra?`
        }
        confirmText={confirmDialog.type === 'activate' ? 'Sí, activar' : 'Sí, inactivar'}
        intent={confirmDialog.type === 'activate' ? 'success' : 'warning'}
      />
    </div>
  );
};
