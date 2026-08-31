import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/mocks/api';
import { BaseRulesLayout } from './BaseRulesLayout';
import { parseRuleDetails } from './RuleDefinitionModal';
import type { RuleDefinitionItem } from '../types/rule.types';
import { auditService } from '@/features/administration';

export const RulesDefinition: React.FC = () => {
  const { data: initialRules, isLoading } = useQuery({
    queryKey: ['rulesViewer'],
    queryFn: api.getRulesViewer,
  });

  const [rules, setRules] = useState<RuleDefinitionItem[]>([]);

  useEffect(() => {
    if (initialRules) {
      const stored = localStorage.getItem('sypago_rules');
      let baseRules: RuleDefinitionItem[] = [];
      if (stored) {
        try {
          baseRules = JSON.parse(stored);
        } catch (e) {
          baseRules = initialRules as RuleDefinitionItem[];
        }
      } else {
        baseRules = initialRules as RuleDefinitionItem[];
      }

      const normalized = baseRules.map((r, idx) => {
        const details = parseRuleDetails(r, baseRules);
        const code = r.code || details.code || String(idx + 1).padStart(3, '0');
        const name = r.name || details.name;
        const channel = r.channel || details.channel;
        const computedTitle = `${code} ${name} ${channel}`;

        return {
          ...r,
          code,
          name,
          channel,
          title: r.title && r.title.startsWith(code) ? r.title : computedTitle,
        };
      });

      setRules(normalized);
    }
  }, [initialRules]);

  const handleSaveRule = (updatedRule: RuleDefinitionItem) => {
    setRules((prevRules) => {
      const exists = prevRules.some(r => r.id === updatedRule.id);
      const previous = exists ? prevRules.find(r => r.id === updatedRule.id) : undefined;
      const newRules = exists 
        ? prevRules.map((r) => (r.id === updatedRule.id ? updatedRule : r))
        : [...prevRules, updatedRule];
        
      localStorage.setItem('sypago_rules', JSON.stringify(newRules));

      auditService.logSync({
        module: 'Reglas',
        action: exists ? 'UPDATE' : 'CREATE',
        entityType: 'Regla',
        entityId: updatedRule.id,
        entityName: updatedRule.title || updatedRule.name || updatedRule.id,
        details: exists
          ? `Regla "${updatedRule.title}" actualizada`
          : `Regla "${updatedRule.title}" creada`,
        previousValue: previous,
        newValue: updatedRule,
      });

      return newRules;
    });
  };

  return (
    <BaseRulesLayout
      data={rules}
      isLoading={isLoading}
      onSaveRule={handleSaveRule}
      renderStats={(rule, currentOps, currentAmount) => (
        <div className="flex flex-col gap-2 w-full">
          <div className="bg-[#1E1F20] rounded-xl border border-tertiary/60 py-2.5 px-4 text-center flex flex-col justify-center">
            <span className="text-[11px] text-gray-400">
              Rangos no configurados
            </span>
            <span className="text-sm font-semibold text-white">
              Mantener Defaults
            </span>
          </div>
          <div className="bg-[#1E1F20] rounded-xl border border-tertiary/60 py-2 px-4 text-center flex flex-col justify-center">
            <span className="text-[11px] text-gray-400">
              Operaciones Max / Actual
            </span>
            <span className="text-base font-bold text-white">
              {rule.ops.max} Opm / {currentOps} Opm
            </span>
          </div>
          <div className="bg-[#1E1F20] rounded-xl border border-tertiary/60 py-2 px-4 text-center flex flex-col justify-center">
            <span className="text-[11px] text-gray-400">
              Monto Max / Actual
            </span>
            <span className="text-base font-bold text-white">
              {rule.amount.max.replace(/(\d)(Millo|Mil)/ig, '$1 $2')} / {currentAmount.replace(/(\d)(Millo|Mil)/ig, '$1 $2')}
            </span>
          </div>
        </div>
      )}
    />
  );
};
