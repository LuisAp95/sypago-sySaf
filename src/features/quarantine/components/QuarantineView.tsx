import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/mocks/api';
import { ViewHeader } from '@/components/ui/ViewHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { DataGrid, type ColumnDef } from '@/components/ui/DataGrid';
import { Check, X, Eye } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { auditService } from '@/features/administration';
import { QuarantineDetailModal } from './QuarantineDetailModal';

interface QuarantineItem {
  id: string;
  user: string;
  risk: 'Crítico' | 'Alto' | 'Medio' | 'Bajo' | string;
  document: string;
  reason: string;
  waitTime: string;
  amount: string;
}

// Configuración de las tarjetas de estadísticas de riesgo
const RISK_STATS_CONFIG = [
  { key: 'critical', riskValue: 'Crítico', label: 'Riesgo Crítico', colorClass: 'text-[#E4E4E7]' },
  { key: 'high', riskValue: 'Alto', label: 'Riesgo Alto', colorClass: 'text-[#EF4444]' },
  { key: 'medium', riskValue: 'Medio', label: 'Riesgo Medio', colorClass: 'text-[#F97316]' },
  { key: 'low', riskValue: 'Bajo', label: 'Riesgo Bajo', colorClass: 'text-[#EAB308]' },
] as const;

const DEFAULT_REASON_OPTIONS = [
  { label: 'Todos los motivos', value: 'todos' },
  { label: 'Incumplimiento de reglas', value: 'Incumplimiento de reglas' },
  { label: 'Lista negra', value: 'Lista negra' },
  { label: 'IP sospechosa', value: 'IP sospechosa' },
  { label: 'Dispositivo nuevo', value: 'Dispositivo nuevo' }
];

export const QuarantineView: React.FC = () => {
  const { data: quarantineList, isLoading: loadingList } = useQuery<QuarantineItem[]>({
    queryKey: ['quarantine'],
    queryFn: api.getQuarantine
  });

  const { data: riskStats, isLoading: loadingStats } = useQuery({
    queryKey: ['riskStats'],
    queryFn: api.getRiskStats
  });

  const [items, setItems] = useState<QuarantineItem[]>([]);
  const [reasonFilter, setReasonFilter] = useState<string>('todos');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionedItems, setActionedItems] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<QuarantineItem | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    ids: string[];
  }>({ isOpen: false, type: 'approve', ids: [] });

  useEffect(() => {
    if (quarantineList) {
      setItems(quarantineList);
    }
  }, [quarantineList]);

  const reasonOptions = useMemo(() => {
    if (!items || items.length === 0) return DEFAULT_REASON_OPTIONS;

    const existingValues = new Set(DEFAULT_REASON_OPTIONS.map(o => o.value));
    const extraOptions: { label: string; value: string }[] = [];

    items.forEach(item => {
      if (item.reason && !existingValues.has(item.reason)) {
        existingValues.add(item.reason);
        extraOptions.push({ label: item.reason, value: item.reason });
      }
    });

    return [...DEFAULT_REASON_OPTIONS, ...extraOptions];
  }, [items]);

  const filteredData = useMemo(() => {
    if (reasonFilter === 'todos') {
      return items;
    }
    const normalizedFilter = reasonFilter.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return items.filter(item => {
      const itemReason = (item.reason || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return itemReason === normalizedFilter;
    });
  }, [items, reasonFilter]);

  const allFilteredSelected =
    filteredData.length > 0 &&
    filteredData.every(item => selectedIds.includes(item.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      const visibleIds = new Set(filteredData.map(item => item.id));
      setSelectedIds(prev => prev.filter(id => !visibleIds.has(id)));
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

  const handleApproveSelected = () => {
    if (selectedIds.length === 0) return;
    setConfirmDialog({ isOpen: true, type: 'approve', ids: selectedIds });
  };

  const handleRejectSelected = () => {
    if (selectedIds.length === 0) return;
    setConfirmDialog({ isOpen: true, type: 'reject', ids: selectedIds });
  };

  const handleApproveSingle = (id: string) => {
    setConfirmDialog({ isOpen: true, type: 'approve', ids: [id] });
  };

  const handleRejectSingle = (id: string) => {
    setConfirmDialog({ isOpen: true, type: 'reject', ids: [id] });
  };

  const handleConfirmAction = () => {
    const { type, ids } = confirmDialog;
    setActionedItems(prev => {
      const next = { ...prev };
      ids.forEach(id => next[id] = type === 'approve' ? 'approved' : 'rejected');
      return next;
    });
    setSelectedIds(prev => prev.filter(id => !ids.includes(id)));

    // Registrar auditoría para cada operación
    for (const id of ids) {
      const item = items.find(i => i.id === id);
      auditService.logSync({
        module: 'Cuarentena',
        action: type === 'approve' ? 'APPROVE' : 'REJECT',
        entityType: 'Operación',
        entityId: id,
        entityName: item ? `${item.user} - ${item.id}` : id,
        details: type === 'approve'
          ? `Operación ${id} aprobada manualmente (monto: ${item?.amount || 'N/A'})`
          : `Operación ${id} rechazada (motivo: ${item?.reason || 'N/A'})`,
        newValue: { status: type === 'approve' ? 'approved' : 'rejected', ...item },
      });
    }
  };

  const columns: ColumnDef<QuarantineItem>[] = [
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
      header: 'ID',
      className: 'w-[15%]',
      cell: (item) => {
        const status = actionedItems[item.id];
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-200">{item.id}</span>
            {status === 'approved' && (
              <span className="text-[10px] uppercase font-bold text-[#4ADE80] mt-0.5">Aprobado</span>
            )}
            {status === 'rejected' && (
              <span className="text-[10px] uppercase font-bold text-[#F87171] mt-0.5">Rechazado</span>
            )}
          </div>
        );
      }
    },
    { header: 'Usuario', accessorKey: 'user', className: 'w-[15%]' },
    {
      header: 'Riesgo',
      accessorKey: 'risk',
      className: 'w-[10%]',
      cell: (item) => <Badge variant={item.risk as any}>{item.risk}</Badge>
    },
    { header: 'Documento', accessorKey: 'document', className: 'w-[15%]' },
    { header: 'Motivo', accessorKey: 'reason', className: 'w-[15%]' },
    {
      header: 'Tiempo en Espera',
      accessorKey: 'waitTime',
      className: 'w-[12%] text-[#2DD4BF] font-semibold'
    },
    { header: 'Monto', accessorKey: 'amount', className: 'flex-1 text-white font-bold min-w-[100px]' },
    {
      header: undefined,
      className: 'w-[33px] shrink-0 p-0 m-0',
      cell: () => <div className="w-[1px] h-8 bg-[#333235] mx-4" />
    },
    {
      header: undefined,
      className: 'w-[15%] flex-row items-center h-full justify-center pr-2',
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="icon"
            aria-label="Aprobar"
            className="w-8 h-8 rounded-full bg-transparent border-transparent hover:bg-[#333235] text-[#9E9D9F] hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleApproveSingle(item.id);
            }}
          >
            <Check className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Rechazar"
            className="w-8 h-8 rounded-full bg-transparent border-transparent hover:bg-[#333235] text-[#9E9D9F] hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleRejectSingle(item.id);
            }}
          >
            <X className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Ver detalles"
            className="w-8 h-8 rounded-full bg-transparent border-transparent hover:bg-[#333235] text-[#9E9D9F] hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItemForDetail(item);
              setIsDetailModalOpen(true);
            }}
          >
            <Eye className="w-5 h-5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full text-text-primary rounded-xl">
      <ViewHeader
        selectOptions={reasonOptions}
        selectValue={reasonFilter}
        selectPlaceholder="Todos los motivos"
        onSelectChange={setReasonFilter}
        showSearch
        showExport
      />

      <div className="flex-1 overflow-hidden flex flex-col gap-6 mt-2">
        {/* Risk Stats Cards */}
        {!loadingStats && riskStats && (
          <div className="flex flex-wrap gap-4">
            {RISK_STATS_CONFIG.map((stat) => {
              const data = (riskStats as any)[stat.key];
              if (!data) return null;

              return (
                <div
                  key={stat.key}
                  className="bg-[#232225] border border-[#333235] rounded-2xl p-4 flex flex-col gap-1 w-52 text-left"
                >
                  <span className="text-[#9E9D9F] font-semibold text-sm">{stat.label}</span>
                  <div className="flex items-end gap-1.5">
                    <span className="text-xl font-bold text-white">{data.count}</span>
                    <span className="text-[#6B6A6D] font-bold mx-0.5">/</span>
                    <span className={`text-lg font-bold ${stat.colorClass}`}>
                      {data.amount?.includes('Bs') ? data.amount : `${data.amount} Bs.`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List Actions */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <Checkbox
              id="selectAll"
              checked={allFilteredSelected}
              onCheckedChange={handleToggleSelectAll}
            />
            <label
              htmlFor="selectAll"
              className="text-sm font-medium cursor-pointer text-[#D4D4D8] select-none"
            >
              Seleccionar Todos
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleApproveSelected}
              disabled={selectedIds.length === 0}
              className="bg-tertiary border border-tertiary hover:bg-[#3A393C] text-gray-200 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Aprobar
            </Button>
            <Button
              variant="secondary"
              onClick={handleRejectSelected}
              disabled={selectedIds.length === 0}
              className="bg-tertiary border border-tertiary hover:bg-[#3A393C] text-gray-200 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rechazar
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto pr-1">
          <DataGrid
            data={filteredData}
            columns={columns}
            isLoading={loadingList}
            onRowClick={(item) => handleToggleSelectRow(item.id)}
            emptyMessage="No hay operaciones en cuarentena para el motivo seleccionado"
            rowClassName={(item) => {
              const status = actionedItems[item.id];
              if (status === 'approved') return "bg-[#4ADE80]/5 border-[#4ADE80]/20 hover:border-[#4ADE80]/40";
              if (status === 'rejected') return "bg-[#F87171]/5 border-[#F87171]/20 hover:border-[#F87171]/40";
              return "hover:border-[#4A494D]";
            }}
          />
        </div>
      </div>

      <QuarantineDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={selectedItemForDetail}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmDialog.type === 'approve' ? 'Aprobar Operación' : 'Rechazar Operación'}
        message={
          confirmDialog.ids.length > 1
            ? `¿Está seguro que desea ${confirmDialog.type === 'approve' ? 'aprobar' : 'rechazar'} las ${confirmDialog.ids.length} operaciones seleccionadas?`
            : `¿Está seguro que desea ${confirmDialog.type === 'approve' ? 'aprobar' : 'rechazar'} esta operación?`
        }
        confirmText={confirmDialog.type === 'approve' ? 'Sí, aprobar' : 'Sí, rechazar'}
        intent={confirmDialog.type === 'approve' ? 'success' : 'danger'}
      />
    </div>
  );
};

