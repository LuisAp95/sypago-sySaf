import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/mocks/api';
import { ViewHeader } from '@/components/ui/ViewHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Eye } from 'lucide-react';
import { RuleChannelModal, type ChannelItem } from './RuleChannelModal';
import { DataGrid, type ColumnDef } from '@/components/ui/DataGrid';
import { auditService } from '@/features/administration';
import { exportChannelRulesToPdf } from '@/utils/pdfGenerator';

export const RulesChannel: React.FC = () => {
  const { data: fetchedChannels, isLoading } = useQuery({
    queryKey: ['rulesChannel'],
    queryFn: api.getRulesChannel
  });

  const [channels, setChannels] = useState<ChannelItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<ChannelItem | null>(null);

  useEffect(() => {
    if (fetchedChannels) {
      setChannels(fetchedChannels as ChannelItem[]);
    }
  }, [fetchedChannels]);

  const handleSaveChannel = (savedChannel: ChannelItem) => {
    setChannels(prev => {
      const exists = prev.some(c => c.id === savedChannel.id);
      const previous = exists ? prev.find(c => c.id === savedChannel.id) : undefined;
      if (exists) {
        const updated = prev.map(c => c.id === savedChannel.id ? savedChannel : c);
        auditService.logSync({
          module: 'Reglas Canal',
          action: 'UPDATE',
          entityType: 'Canal',
          entityId: savedChannel.id,
          entityName: savedChannel.channel || savedChannel.id,
          details: `Canal "${savedChannel.channel}" actualizado`,
          previousValue: previous,
          newValue: savedChannel,
        });
        return updated;
      }
      auditService.logSync({
        module: 'Reglas Canal',
        action: 'CREATE',
        entityType: 'Canal',
        entityId: savedChannel.id,
        entityName: savedChannel.channel || savedChannel.id,
        details: `Canal "${savedChannel.channel}" creado`,
        newValue: savedChannel,
      });
      return [savedChannel, ...prev];
    });
  };

  const handleOpenModal = (channel?: ChannelItem) => {
    setSelectedChannel(channel || null);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<ChannelItem>[] = [
    {
      header: undefined,
      className: 'w-[5%] pl-4',
      colProps: { onClick: e => e.stopPropagation() },
      cell: () => <Checkbox />
    },
    { header: 'Canal', accessorKey: 'channel', className: 'w-[15%]' },
    {
      header: 'Estado',
      accessorKey: 'status',
      className: 'w-[12%]',
      cell: (item) => <Badge variant={item.status as any}>{item.status}</Badge>
    },
    { header: 'Grupo', accessorKey: 'group', className: 'w-[12%]' },
    { header: 'Entre semana', accessorKey: 'weekday', className: 'w-[15%]' },
    { header: 'Fin de semana', accessorKey: 'weekend', className: 'w-[15%]' },
    { header: 'Feriados', accessorKey: 'holidays', className: 'w-[10%]' },
    { header: 'Última modificación', accessorKey: 'lastModified', className: 'flex-1 min-w-[150px]' },
    {
      header: undefined,
      className: 'w-[33px] shrink-0 p-0 m-0',
      cell: () => <div className="w-[1px] h-8 bg-[#333235] mx-4" />
    },
    {
      header: undefined,
      className: 'w-[8%] flex-row items-center h-full justify-center pr-2',
      colProps: { onClick: e => e.stopPropagation() },
      cell: (item) => (
        <Button 
          variant="secondary" 
          size="icon" 
          className="w-8 h-8 rounded-full bg-transparent border-transparent hover:bg-[#333235] text-[#9E9D9F] hover:text-white" 
          onClick={() => handleOpenModal(item)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-secondary text-text-primary rounded-xl">
      <ViewHeader
        selectOptions={[{ label: 'Todos los grupos', value: 'todos' }]}
        showSearch
        showFilter
        showCopy
        onCopyClick={() => exportChannelRulesToPdf(channels)}
      />

      <div className="flex-1 overflow-hidden flex flex-col gap-6">

        {/* List Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox id="selectAll" />
            <label htmlFor="selectAll" className="text-sm cursor-pointer text-text-primary">Seleccionar Todos</label>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">Editar</Button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto pr-2">
          <DataGrid
            data={channels}
            columns={columns}
            isLoading={isLoading}
            onRowClick={handleOpenModal}
          />
        </div>
      </div>

      <RuleChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        channel={selectedChannel}
        onSave={handleSaveChannel}
      />
    </div>
  );
};
