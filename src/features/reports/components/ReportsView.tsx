import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/mocks/api';
import { ViewHeader } from '@/components/ui/ViewHeader';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Loader } from '@/components/ui/Loader';
import type { ColumnDef } from '@/components/ui/DataGrid';
import { maskAccountNumber } from '@/utils/formatters';

export const ReportsView: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState('todas');

  const { data: filters } = useQuery({
    queryKey: ['filters'],
    queryFn: api.getFilters
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: api.getReports
  });

  const filteredReports = useMemo(() => {
    if (!reports) return [];
    return reports.filter((r: any) => {
      let isMatch = true;
      if (selectedChannel && selectedChannel !== 'todos' && r.channel !== selectedChannel) {
        isMatch = false;
      }
      if (selectedStatus && selectedStatus !== 'todas') {
        const statusMap: Record<string, string> = {
          'en_proceso': 'En proceso',
          'validas': 'Válidas',
          'retenidas': 'Retenidas',
          'bloqueadas': 'Bloqueadas'
        };
        if (r.status !== statusMap[selectedStatus]) {
          isMatch = false;
        }
      }
      return isMatch;
    });
  }, [reports, selectedChannel, selectedStatus]);

  const columns: ColumnDef<any>[] = [
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: (item) => <Badge variant={item.status}>{item.status}</Badge>
    },
    { header: 'ID', accessorKey: 'id' },
    { header: 'Fe Creación', accessorKey: 'creationDate' },
    { header: 'Documento Emisor', accessorKey: 'issuerDocument' },
    { 
      header: 'Cuenta Emisor', 
      accessorKey: 'issuerAccount',
      cell: (item) => maskAccountNumber(item.issuerAccount)
    },
    { header: 'Documento Receptor', accessorKey: 'receiverDocument' },
    { 
      header: 'Cuenta Receptor', 
      accessorKey: 'receiverAccount',
      cell: (item) => maskAccountNumber(item.receiverAccount)
    },
    { header: 'Monto', accessorKey: 'amount' },
    { header: 'Tiempo de Proceso', accessorKey: 'processTime' }
  ];

  const handleExportCsv = () => {
    if (!filteredReports || filteredReports.length === 0) return;

    const headers = [
      'ID',
      'Tipo',
      'Estado',
      'Fecha Creación',
      'Documento Emisor',
      'Cuenta Emisor',
      'Documento Receptor',
      'Cuenta Receptor',
      'Monto',
      'Tiempo de Proceso',
      'Canal'
    ];

    const escapeField = (field: any) => {
      if (field === null || field === undefined) return '""';
      const str = String(field).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredReports.map((r: any) => [
      escapeField(r.id),
      escapeField(r.type || ''),
      escapeField(r.status || ''),
      escapeField(r.creationDate || ''),
      escapeField(r.issuerDocument || ''),
      escapeField(maskAccountNumber(r.issuerAccount)),
      escapeField(r.receiverDocument || ''),
      escapeField(maskAccountNumber(r.receiverAccount)),
      escapeField(r.amount || ''),
      escapeField(r.processTime || ''),
      escapeField(r.channel || '')
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_operaciones_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-secondary text-text-primary rounded-xl">
      <ViewHeader
        selectOptions={filters?.operationChannels || []}
        selectValue={selectedChannel}
        onSelectChange={setSelectedChannel}
        selectPlaceholder="Todos los canales"
        secondarySelectOptions={filters?.operationStatuses || []}
        secondarySelectValue={selectedStatus}
        onSecondarySelectChange={setSelectedStatus}
        secondarySelectPlaceholder="Todos los estados"
        showSearch
        showExport
        onExportClick={handleExportCsv}
      />

      <div className="flex-1 overflow-hidden flex flex-col drop-shadow-2xl">
        {isLoading ? (
          <Loader text="Cargando reportes..." size="md" />
        ) : (
          <div className="flex-1 flex flex-col border border-table-border rounded-xl overflow-hidden bg-primary">
            <DataTable 
              data={filteredReports}
              columns={columns}
              wrapperClassName="border-0 rounded-none flex-1 bg-tertiary"
              headerClassName="bg-surface sticky top-0 z-10"
            />

            {/* Pagination */}
            <div className="bg-surface p-4 flex items-center justify-between text-sm font-semibold text-text-primary border-t border-tertiary">
              <div className="w-[150px]"></div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronsLeft className="w-4 h-4" /></Button>
                <span>3</span>
                <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronsRight className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-8 h-8"><ChevronRight className="w-4 h-4" /></Button>
              </div>
              <div className="text-right w-[150px]">35.942 Operaciones</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
