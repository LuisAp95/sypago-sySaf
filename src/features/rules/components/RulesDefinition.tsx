import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/mocks/api';
import { BaseRulesLayout } from './BaseRulesLayout';
import { parseRuleDetails } from './RuleDefinitionModal';
import type { RuleDefinitionItem, RuleCategory } from '../types/rule.types';
import { auditService } from '@/features/administration';

const TABS: { key: RuleCategory; label: string; description: string }[] = [
  { key: 'limits', label: 'Límites Operativos', description: 'Monto, operaciones por minuto y horario' },
  { key: 'dispersion', label: 'Control de Dispersión', description: 'Operaciones múltiples y montos sospechosos' },
  { key: 'risk_entity', label: 'Entidades de Riesgo', description: 'Bancos en lista negra y montos acumulados' },
];

export const RulesDefinition: React.FC = () => {
  const { data: initialRules, isLoading } = useQuery({
    queryKey: ['rulesViewer'],
    queryFn: api.getRulesViewer,
  });

  const [rules, setRules] = useState<RuleDefinitionItem[]>([]);
  const [activeTab, setActiveTab] = useState<RuleCategory>('limits');

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
          ruleCategory: r.ruleCategory || 'limits' as RuleCategory,
        };
      });

      setRules(normalized);
    }
  }, [initialRules]);

  const handleSaveRule = (updatedRule: RuleDefinitionItem) => {
    // Ensure the category is set
    const ruleWithCategory = {
      ...updatedRule,
      ruleCategory: updatedRule.ruleCategory || activeTab,
    };

    setRules((prevRules) => {
      const exists = prevRules.some(r => r.id === ruleWithCategory.id);
      const previous = exists ? prevRules.find(r => r.id === ruleWithCategory.id) : undefined;
      const newRules = exists 
        ? prevRules.map((r) => (r.id === ruleWithCategory.id ? ruleWithCategory : r))
        : [...prevRules, ruleWithCategory];
        
      localStorage.setItem('sypago_rules', JSON.stringify(newRules));

      auditService.logSync({
        module: 'Reglas',
        action: exists ? 'UPDATE' : 'CREATE',
        entityType: 'Regla',
        entityId: ruleWithCategory.id,
        entityName: ruleWithCategory.title || ruleWithCategory.name || ruleWithCategory.id,
        details: exists
          ? `Regla "${ruleWithCategory.title}" actualizada`
          : `Regla "${ruleWithCategory.title}" creada`,
        previousValue: previous,
        newValue: ruleWithCategory,
      });

      return newRules;
    });
  };

  // Filter rules by active tab
  const filteredRules = rules.filter(r => (r.ruleCategory || 'limits') === activeTab);

  return (
    <div className="flex flex-col h-full bg-secondary text-text-primary rounded-xl">
      {/* Category Tabs */}
      <div className="px-4 pt-4 pb-0">
        <div className="flex items-center gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = rules.filter(r => (r.ruleCategory || 'limits') === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-200 ease-out cursor-pointer
                  ${isActive
                    ? 'bg-[#1a2a2e] border border-[#52c6b4]/40 text-[#52c6b4]'
                    : 'bg-[#2A292A] border border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#333235] hover:border-tertiary/40'
                  }
                `}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52c6b4]" />
                )}
                <span>{tab.label}</span>
                {count > 0 && (
                  <span className={`
                    text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                    ${isActive
                      ? 'bg-[#52c6b4]/20 text-[#52c6b4]'
                      : 'bg-gray-700 text-gray-400'
                    }
                  `}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <BaseRulesLayout
          data={filteredRules}
          isLoading={isLoading}
          onSaveRule={handleSaveRule}
          ruleCategory={activeTab}
          renderStats={(rule, currentOps, currentAmount) => {
            if (activeTab === 'limits') {
              return (
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
              );
            }

            if (activeTab === 'dispersion') {
              const activeBands = rule.dispersionSubRules?.filter(sr => sr.enabled) || [];
              const maxOps = activeBands.length > 0 ? Math.max(...activeBands.map(sr => sr.maxDailyOps)) : 0;
              const minAmount = activeBands.length > 0 ? activeBands[0].minAmount : 'N/A';
              return (
                <div className="flex flex-col gap-2 w-full">
                  <div className="bg-[#1E1F20] rounded-xl border border-tertiary/60 py-2 px-4 text-center flex flex-col justify-center">
                    <span className="text-[11px] text-gray-400">
                      Ops. Diarias Máx.
                    </span>
                    <span className="text-base font-bold text-white">
                      {maxOps} ops/día
                    </span>
                  </div>
                  <div className="bg-[#1E1F20] rounded-xl border border-tertiary/60 py-2 px-4 text-center flex flex-col justify-center">
                    <span className="text-[11px] text-gray-400">
                      Monto Máximo Cuarentena
                    </span>
                    <span className="text-base font-bold text-white">
                      {minAmount}
                    </span>
                  </div>
                  <div className="bg-[#1E1F20] rounded-xl border border-tertiary/60 py-2 px-4 text-center flex flex-col justify-center">
                    <span className="text-[11px] text-gray-400">
                      Franjas Activas
                    </span>
                    <span className="text-base font-bold text-white">
                      {activeBands.length}
                    </span>
                  </div>
                </div>
              );
            }

            if (activeTab === 'risk_entity') {
              const banks = rule.blacklistedBanks || [];
              const activeBands = rule.riskSubRules?.filter(sr => sr.enabled) || [];
              const maxAccum = activeBands.length > 0 ? activeBands[0].maxDailyAccumulatedAmount : 'N/A';
              return (
                <div className="flex flex-col gap-2 w-full">
                  <div className="bg-[#1E1F20] rounded-xl border border-tertiary/60 py-2 px-4 text-center flex flex-col justify-center">
                    <span className="text-[11px] text-gray-400">
                      Bancos en Lista Negra
                    </span>
                    <span className="text-base font-bold text-white">
                      {banks.length} banco{banks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="bg-[#1E1F20] rounded-xl border border-tertiary/60 py-2 px-4 text-center flex flex-col justify-center">
                    <span className="text-[11px] text-gray-400">
                      Monto Acum. Diario
                    </span>
                    <span className="text-base font-bold text-white">
                      {maxAccum}
                    </span>
                  </div>
                  <div className="bg-[#1E1F20] rounded-xl border border-tertiary/60 py-2 px-4 text-center flex flex-col justify-center">
                    <span className="text-[11px] text-gray-400">
                      Franjas Activas
                    </span>
                    <span className="text-base font-bold text-white">
                      {activeBands.length}
                    </span>
                  </div>
                </div>
              );
            }

            return null;
          }}
        />
      </div>
    </div>
  );
};
