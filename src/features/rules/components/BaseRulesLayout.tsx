import React, { useState, useEffect } from 'react';
import { ViewHeader } from '@/components/ui/ViewHeader';
import { RuleDefinitionModal } from './RuleDefinitionModal';
import { StepChart, parseHour } from './StepChart';
import type { RuleDefinitionItem } from '../types/rule.types';
import { Loader } from '@/components/ui/Loader';
import { exportRulesToPdf } from '@/utils/pdfGenerator';

export interface BaseRulesLayoutProps {
  data: RuleDefinitionItem[];
  isLoading?: boolean;
  onSaveRule: (updatedRule: RuleDefinitionItem) => void;
  renderStats: (rule: RuleDefinitionItem, currentOps: number, currentAmount: string) => React.ReactNode;
  modalTitle?: string;
  onExportPdf?: () => void;
}

export const BaseRulesLayout: React.FC<BaseRulesLayoutProps> = ({
  data,
  isLoading,
  onSaveRule,
  renderStats,
  modalTitle,
  onExportPdf,
}) => {
  const [selectedRule, setSelectedRule] = useState<RuleDefinitionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const handleOpenModal = (ruleToEdit?: RuleDefinitionItem) => {
    if (ruleToEdit) {
      setSelectedRule(ruleToEdit);
    } else {
      setSelectedRule(null);
    }
    setIsModalOpen(true);
  };

  const handleExport = () => {
    if (onExportPdf) {
      onExportPdf();
    } else {
      exportRulesToPdf(data, modalTitle || 'Definición de Reglas Antifraude');
    }
  };

  return (
    <div className="flex flex-col h-full bg-secondary text-text-primary rounded-xl">
      <ViewHeader
        selectOptions={[{ label: 'Todos los estados', value: 'todos' }]}
        showSearch
        showFilter
        showAdd
        showCopy
        onAddClick={() => handleOpenModal()}
        onCopyClick={handleExport}
      />

      <div className="flex-1 overflow-hidden flex flex-col gap-6">
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6">
          {isLoading ? (
            <Loader text="Cargando reglas..." size="md" />
          ) : (
            data.map((rule) => {
              const currentDecimalHour = currentTime.getHours() + currentTime.getMinutes() / 60;
              let currentOps = rule.ops.current || 0;
              let currentAmount = rule.amount.current || '0';

              if (rule.subRules && rule.subRules.length > 0) {
                const activeSubRule = rule.subRules.find(sr => {
                  if (!sr.enabled) return false;
                  const start = parseHour(sr.startTime);
                  const end = parseHour(sr.endTime);
                  if (start <= end) {
                    return currentDecimalHour >= start && currentDecimalHour < end;
                  } else {
                    return currentDecimalHour >= start || currentDecimalHour < end;
                  }
                });

                if (activeSubRule) {
                  currentOps = activeSubRule.opsPerMinute;
                  currentAmount = activeSubRule.maxAmount;
                } else {
                  currentOps = 0;
                  currentAmount = "0";
                }
              }

              return (
                <div
                  key={rule.id}
                  onDoubleClick={() => handleOpenModal(rule)}
                  className="bg-[#2A292A] rounded-2xl border border-tertiary p-5 hover:border-tertiary/80 transition-all cursor-pointer group relative flex flex-col md:flex-row gap-6 items-stretch"
                  title="Doble clic para editar o definir regla"
                >
                  {/* Left Column with Title at top and Cards at bottom */}
                  <div className="flex flex-col justify-between w-full md:w-60 shrink-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-blue-400 transition-colors">
                        {rule.title}
                      </h3>
                      <span className="text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity bg-tertiary px-3 py-1 rounded-full md:hidden">
                        Doble clic para editar
                      </span>
                    </div>

                    {/* Small stats cards at the bottom */}
                    <div className="mt-auto">
                      {renderStats(rule, currentOps, currentAmount)}
                    </div>
                  </div>

                  {/* Right Column: Chart area covering full height from top to bottom */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <StepChart
                      ops={rule.chartData?.ops || []}
                      amount={rule.chartData?.amount || []}
                      subRules={rule.subRules}
                      maxOps={rule.maxOps}
                      maxAmt={rule.maxAmt}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dynamic Rule Definition Modal */}
      <RuleDefinitionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rule={selectedRule}
        existingRules={data}
        onSave={onSaveRule}
        title={modalTitle}
      />
    </div>
  );
};