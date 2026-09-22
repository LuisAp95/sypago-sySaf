import React, { useState, useEffect } from 'react';
import { ViewHeader } from '@/components/ui/ViewHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Eye } from 'lucide-react';
import { RuleChannelModal } from './RuleChannelModal';
import { DataGrid, type ColumnDef } from '@/components/ui/DataGrid';
import { auditService } from '@/features/administration';
import { exportChannelRulesToPdf } from '@/utils/pdfGenerator';
import type { ChannelRule } from '../types/channelRules.types';
import { CHANNELS } from '../mocks/channelRules.mock';
import { channelRulesService } from '../services/channelRules.service';

export const RulesChannel: React.FC = () => {
  const [rules, setRules] = useState<ChannelRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ChannelRule | null>(null);

  useEffect(() => {
    // Load from local storage
    const loadedRules = channelRulesService.getRules();
    setRules(loadedRules);
    setIsLoading(false);
  }, []);

  const handleSaveRule = (savedRule: ChannelRule) => {
    const newRules = channelRulesService.saveRule(savedRule);
    setRules(newRules);
    
    auditService.logSync({
      module: 'Reglas Canal',
      action: rules.some(r => r.id === savedRule.id) ? 'UPDATE' : 'CREATE',
      entityType: 'Regla de Canal',
      entityId: savedRule.id,
      entityName: savedRule.channelId,
      details: `Regla para el canal "${savedRule.channelId}" configurada`,
      newValue: savedRule,
    });
  };

  const handleOpenModal = (rule?: ChannelRule) => {
    setSelectedRule(rule || null);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<ChannelRule>[] = [
    { 
      header: 'Canal', 
      accessorKey: 'channelId', 
      className: 'w-[15%]',
      cell: (item) => {
        const channelName = CHANNELS.find(c => c.id === item.channelId)?.name || item.channelId;
        return <span className="font-medium text-gray-200">{channelName}</span>;
      }
    },
    {
      header: 'Productos',
      accessorKey: 'products',
      className: 'w-[15%]',
      cell: (item) => {
        if (item.products.includes('Todos')) {
          return <Badge variant="Success">General</Badge>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {item.products.map(p => (
              <Badge key={p} variant="Warning">{p}</Badge>
            ))}
          </div>
        );
      }
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      className: 'w-[10%]',
      cell: (item) => <Badge variant={item.status as any}>{item.status}</Badge>
    },
    { header: 'Entre semana', accessorKey: 'weekday', className: 'w-[15%]' },
    { header: 'Fin de semana', accessorKey: 'weekend', className: 'w-[15%]' },
    { header: 'Feriados', accessorKey: 'holidays', className: 'w-[10%]' },
    { header: 'Última modificación', accessorKey: 'lastModified', className: 'flex-1 min-w-[130px]' },
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
        showSearch
        showFilter
        showCopy
        showAdd
        onAddClick={() => handleOpenModal()}
        onCopyClick={() => exportChannelRulesToPdf(rules)}
      />

      <div className="flex-1 overflow-hidden flex flex-col gap-6">

        {/* List */}
        <div className="flex-1 overflow-y-auto pr-2 px-4 pb-4">
          <DataGrid
            data={rules}
            columns={columns}
            isLoading={isLoading}
            onRowClick={handleOpenModal}
          />
        </div>
      </div>

      <RuleChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rule={selectedRule}
        onSave={handleSaveRule}
      />
    </div>
  );
};
