import React, { useState, useEffect } from 'react';
import { BaseRulesLayout } from '@/features/rules/components/BaseRulesLayout';
import type { RuleDefinitionItem } from '@/features/rules/types/rule.types';
import { auditService } from '@/features/administration';

const mockExceptions: RuleDefinitionItem[] = [
  {
    id: '1',
    code: '001',
    name: 'Horario especial 5/12',
    channel: 'App - N',
    title: '001 Horario especial 5/12 App - N',
    ops: { max: 0, current: 0 },
    amount: { max: '0 Bs', current: '0 Bs' },
    chartData: {
      ops: [{x: 0, y: 0}, {x: 24, y: 0}],
      amount: [{x: 0, y: 0}, {x: 24, y: 0}]
    },
    maxOps: 10,
    maxAmt: 5,
    subRules: []
  },
  {
    id: '2',
    code: '002',
    name: 'No laborable',
    channel: 'Web - N',
    title: '002 No laborable Web - N',
    ops: { max: 0, current: 0 },
    amount: { max: '0 Bs', current: '0 Bs' },
    chartData: {
      ops: [{x: 0, y: 0}, {x: 24, y: 0}],
      amount: [{x: 0, y: 0}, {x: 24, y: 0}]
    },
    maxOps: 5,
    maxAmt: 3,
    subRules: []
  },
  {
    id: '3',
    code: '003',
    name: 'Cliente especial',
    channel: 'App - J',
    title: '003 Cliente especial App - J',
    ops: { max: 100, current: 100 },
    amount: { max: '200 Millo Bs', current: '200 Millo Bs' },
    chartData: {
      ops: [{x: 0, y: 100}, {x: 24, y: 100}],
      amount: [{x: 0, y: 200}, {x: 24, y: 200}]
    },
    maxOps: 100,
    maxAmt: 200,
    subRules: []
  }
];

export const ExceptionsDefinition: React.FC = () => {
  const [exceptions, setExceptions] = useState<RuleDefinitionItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('exceptionsDefinition');
    if (saved) {
      setExceptions(JSON.parse(saved));
    } else {
      setExceptions(mockExceptions);
      localStorage.setItem('exceptionsDefinition', JSON.stringify(mockExceptions));
    }
  }, []);

  const handleSaveException = (updatedRule: RuleDefinitionItem) => {
    setExceptions((prev) => {
      const exists = prev.some(r => r.id === updatedRule.id);
      const previous = exists ? prev.find(r => r.id === updatedRule.id) : undefined;
      const newExceptions = exists
        ? prev.map((r) => (r.id === updatedRule.id ? updatedRule : r))
        : [...prev, updatedRule];
      
      localStorage.setItem('exceptionsDefinition', JSON.stringify(newExceptions));

      auditService.logSync({
        module: 'Excepciones',
        action: exists ? 'UPDATE' : 'CREATE',
        entityType: 'Excepción',
        entityId: updatedRule.id,
        entityName: updatedRule.title || updatedRule.name || updatedRule.id,
        details: exists
          ? `Excepción "${updatedRule.title}" actualizada`
          : `Excepción "${updatedRule.title}" creada`,
        previousValue: previous,
        newValue: updatedRule,
      });

      return newExceptions;
    });
  };

  return (
    <BaseRulesLayout
      data={exceptions}
      onSaveRule={handleSaveException}
      renderStats={(rule) => (
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
              Operaciones Max
            </span>
            <span className="text-base font-bold text-white">
              {rule.ops.max} Opm
            </span>
          </div>
          <div className="bg-[#1E1F20] rounded-xl border border-tertiary/60 py-2 px-4 text-center flex flex-col justify-center">
            <span className="text-[11px] text-gray-400">
              Monto Max
            </span>
            <span className="text-base font-bold text-white">
              {rule.amount.max.replace(/(\d)(Millo|Mil)/ig, '$1 $2')}
            </span>
          </div>
        </div>
      )}
    />
  );
};
