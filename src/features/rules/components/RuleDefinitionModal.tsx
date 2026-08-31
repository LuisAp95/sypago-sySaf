import React, { useState, useEffect, useMemo } from 'react';
import { X, FileDown } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { RuleModalChart } from './RuleModalChart';
import type { RuleDefinitionItem, RuleTimeBand, ChartPoint } from '../types/rule.types';
import { Badge } from '@/components/ui/Badge';
import { exportSingleRuleToPdf } from '@/utils/pdfGenerator';

export const CHANNEL_OPTIONS = [
  'App - N',
  'Web - N',
  'Otro - N',
  'App - J',
  'Web - J',
  'Otro - J',
  'POS',
  'Pagos Móviles',
  'Todos los canales',
];

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const parseRuleDetails = (
  rule: RuleDefinitionItem | null,
  existingRules: RuleDefinitionItem[] = []
) => {
  if (!rule) {
    const numericCodes = existingRules
      .map((r) => {
        const c = r.code || r.title?.match(/^(\d+)/)?.[1];
        return c ? parseInt(c, 10) : 0;
      })
      .filter((n) => !isNaN(n) && n > 0);

    const maxCode = numericCodes.length > 0 ? Math.max(...numericCodes) : 0;
    const nextCode = String(maxCode + 1).padStart(3, '0');

    return {
      code: nextCode,
      name: '',
      channel: 'App - N',
    };
  }

  let code = rule.code;
  let name = rule.name;
  let channel = rule.channel;

  const rawTitle = rule.title || '';

  if (!code) {
    const codeMatch = rawTitle.match(/^(\d{3})\s+/);
    if (codeMatch) {
      code = codeMatch[1];
    } else {
      code = '001';
    }
  }

  if (!channel) {
    const matchedChannel = CHANNEL_OPTIONS.find((c) => rawTitle.endsWith(c));
    if (matchedChannel) {
      channel = matchedChannel;
    } else {
      channel = rawTitle.includes('Jurídico') || rawTitle.includes('Juridico') || rawTitle.includes(' - J')
        ? 'App - J'
        : 'App - N';
    }
  } else {
    channel = channel.replace(/Natural/gi, 'N').replace(/Jurídico|Juridico/gi, 'J');
  }

  if (!name) {
    let clean = rawTitle;
    if (code && clean.startsWith(code)) {
      clean = clean.slice(code.length).trim();
    }
    if (channel && clean.endsWith(channel)) {
      clean = clean.slice(0, clean.length - channel.length).trim();
    }
    name = clean.replace(/^General\s+/i, '').trim() || 'Regla';
  }

  name = capitalizeFirstLetter(name);

  return { code, name, channel };
};

interface RuleDefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule: RuleDefinitionItem | null;
  existingRules?: RuleDefinitionItem[];
  onSave?: (updatedRule: RuleDefinitionItem) => void;
  title?: string;
}

const DEFAULT_SUB_RULES: RuleTimeBand[] = [
  {
    id: 'sub-1',
    enabled: true,
    status: 'Activo',
    startTime: '23:00',
    endTime: '08:00',
    opsPerMinute: 4,
    maxAmount: '600 Mil Bs',
  },
  {
    id: 'sub-2',
    enabled: true,
    status: 'Activa',
    startTime: '08:00',
    endTime: '18:00',
    opsPerMinute: 8,
    maxAmount: '5 Millo Bs',
  },
  {
    id: 'sub-3',
    enabled: true,
    status: 'Activo',
    startTime: '18:00',
    endTime: '23:00',
    opsPerMinute: 8,
    maxAmount: '2 Millo Bs',
  },
];

export const RuleDefinitionModal: React.FC<RuleDefinitionModalProps> = ({
  isOpen,
  onClose,
  rule,
  existingRules = [],
  onSave,
}) => {
  const [code, setCode] = useState<string>('001');
  const [ruleName, setRuleName] = useState<string>('');
  const [channel, setChannel] = useState<string>('App - N');
  const [subRules, setSubRules] = useState<RuleTimeBand[]>(DEFAULT_SUB_RULES);

  useEffect(() => {
    if (isOpen) {
      const details = parseRuleDetails(rule, existingRules);
      setCode(details.code);
      setRuleName(capitalizeFirstLetter(details.name));
      setChannel(details.channel);
    }
    if (rule) {
      if (rule.subRules && rule.subRules.length > 0) {
        setSubRules(rule.subRules);
      } else {
        setSubRules(DEFAULT_SUB_RULES);
      }
    } else {
      setSubRules(DEFAULT_SUB_RULES);
    }
  }, [rule, isOpen, existingRules]);

  const formattedRuleName = capitalizeFirstLetter(ruleName.trim());
  const fullTitle = `${code} ${formattedRuleName || 'Nueva Regla'} ${channel}`;

  // Helper to convert time string "HH:MM" to numeric decimal hour (0 - 24)
  const parseHour = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) + (m || 0) / 60;
  };

  // Helper to parse max amount string like "600 Mil Bs" or "5 Millo Bs" to numeric Millon value
  const parseAmountToMillion = (amtStr: string): number => {
    if (!amtStr) return 0;
    const lower = amtStr.toLowerCase();
    const num = parseFloat(amtStr.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    if (lower.includes('millo')) {
      return num;
    }
    if (lower.includes('mil')) {
      return num / 1000;
    }
    return num;
  };

  // Calculate dynamic step chart points from active sub-rules
  const { opsPoints, amountPoints } = useMemo(() => {
    const activeRules = subRules.filter((sr) => sr.enabled);
    if (activeRules.length === 0) {
      return {
        opsPoints: rule?.chartData?.ops || [
          { x: 0, y: 0 },
          { x: 24, y: 0 },
        ],
        amountPoints: rule?.chartData?.amount || [
          { x: 0, y: 0 },
          { x: 24, y: 0 },
        ],
      };
    }

    const opsPointsArr: ChartPoint[] = [];
    const amtPointsArr: ChartPoint[] = [];

    const timePoints = new Set([0, 24]);
    activeRules.forEach((sr) => {
      timePoints.add(parseHour(sr.startTime));
      timePoints.add(parseHour(sr.endTime));
    });

    const sortedTimes = Array.from(timePoints).sort((a, b) => a - b);

    for (let i = 0; i < sortedTimes.length - 1; i++) {
      const t1 = sortedTimes[i];
      const t2 = sortedTimes[i + 1];
      const mid = (t1 + t2) / 2;

      let currentOps = 0;
      let currentAmt = 0;

      const activeBand = activeRules.find((sr) => {
        const start = parseHour(sr.startTime);
        const end = parseHour(sr.endTime);
        if (start <= end) {
          return mid >= start && mid < end;
        } else {
          return mid >= start || mid < end;
        }
      });

      if (activeBand) {
        currentOps = activeBand.opsPerMinute;
        currentAmt = parseAmountToMillion(activeBand.maxAmount);
      }

      opsPointsArr.push({ x: t1, y: currentOps });
      opsPointsArr.push({ x: t2, y: currentOps });
      amtPointsArr.push({ x: t1, y: currentAmt });
      amtPointsArr.push({ x: t2, y: currentAmt });
    }

    const sortAndFilter = (pts: ChartPoint[]) =>
      pts
        .sort((a, b) => a.x - b.x)
        .filter((pt, idx, self) => idx === 0 || self[idx - 1].x !== pt.x || self[idx - 1].y !== pt.y);

    return {
      opsPoints: sortAndFilter(opsPointsArr),
      amountPoints: sortAndFilter(amtPointsArr),
    };
  }, [subRules, rule]);

  const handleToggleBand = (id: string) => {
    setSubRules((prev) =>
      prev.map((sr) =>
        sr.id === id
          ? {
            ...sr,
            enabled: !sr.enabled,
            status: !sr.enabled ? (sr.status === 'Activa' ? 'Activa' : 'Activo') : 'Inactivo',
          }
          : sr
      )
    );
  };

  const handleUpdateBand = (id: string, field: keyof RuleTimeBand, value: any) => {
    setSubRules((prev) =>
      prev.map((sr) => (sr.id === id ? { ...sr, [field]: value } : sr))
    );
  };

  const handleAddBand = () => {
    const newId = `sub-${Date.now()}`;
    const newBand: RuleTimeBand = {
      id: newId,
      enabled: true,
      status: 'Activo',
      startTime: '09:00',
      endTime: '17:00',
      opsPerMinute: 6,
      maxAmount: '1 Millo Bs',
    };
    setSubRules((prev) => [...prev, newBand]);
  };

  const handleDeleteBand = (id: string) => {
    setSubRules((prev) => prev.filter((sr) => sr.id !== id));
  };

  const handleSave = () => {
    const activeRules = subRules.filter((sr) => sr.enabled);
    const maxOpsValue = activeRules.length > 0
      ? Math.max(...activeRules.map((sr) => sr.opsPerMinute))
      : 0;
    const maxAmountValue = activeRules.length > 0
      ? activeRules.reduce((best, sr) => {
          const current = parseAmountToMillion(sr.maxAmount);
          const bestVal = parseAmountToMillion(best);
          return current > bestVal ? sr.maxAmount : best;
        }, activeRules[0].maxAmount)
      : '0 Bs';

    const currentDecimalHour = new Date().getHours() + new Date().getMinutes() / 60;
    let currentOpsValue = 0;
    let currentAmountValue = '0 Bs';
    if (activeRules.length > 0) {
      const activeBand = activeRules.find((sr) => {
        const start = parseHour(sr.startTime);
        const end = parseHour(sr.endTime);
        if (start <= end) {
          return currentDecimalHour >= start && currentDecimalHour < end;
        } else {
          return currentDecimalHour >= start || currentDecimalHour < end;
        }
      });
      if (activeBand) {
        currentOpsValue = activeBand.opsPerMinute;
        currentAmountValue = activeBand.maxAmount;
      }
    }

    const finalRuleName = capitalizeFirstLetter(ruleName.trim()) || 'Nueva Regla';
    const finalTitle = `${code} ${finalRuleName} ${channel}`;

    const updated: RuleDefinitionItem = {
      ...(rule || {}),
      id: rule?.id || Date.now().toString(),
      code,
      name: finalRuleName,
      channel,
      title: finalTitle,
      subRules,
      ops: {
        max: maxOpsValue,
        current: currentOpsValue,
      },
      amount: {
        max: maxAmountValue,
        current: currentAmountValue,
      },
      chartData: {
        ops: opsPoints,
        amount: amountPoints,
      },
      maxOps: maxOpsValue,
      maxAmt: parseAmountToMillion(maxAmountValue)
    };
    onSave?.(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={!rule ? 'Definición de Regla' : `Definición de Regla - ${fullTitle}`}
      size="5xl"
      className="bg-secondary border border-[#2b2f3d]"
    >
      <div className="space-y-6">
        {/* Header / Rule Config Box */}
        <div className="bg-[#1E1F20] border border-tertiary/70 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium mb-1">Código</span>
              <span className="bg-[#2b2f3d] text-[#52c6b4] px-2.5 py-1 rounded-lg font-mono text-xs font-bold border border-[#3e445b] text-center shadow-inner min-w-[42px]">
                {code}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex-1 flex flex-col">
              <label className="text-[11px] text-gray-400 font-medium mb-1">
                Nombre de la regla
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(capitalizeFirstLetter(e.target.value))}
                placeholder="Ej. Entre semana"
                className="bg-[#2A292A] border border-tertiary/60 rounded-xl px-3.5 py-2 text-sm text-gray-100 font-semibold focus:outline-none focus:border-[#52c6b4] transition-colors placeholder:text-gray-500"
              />
            </div>

            <div className="w-full md:w-60 flex flex-col">
              <label className="text-[11px] text-gray-400 font-medium mb-1">
                Canal
              </label>
              <Select
                options={CHANNEL_OPTIONS.map((c) => ({ label: c, value: c }))}
                value={channel}
                onChange={(val) => setChannel(val)}
                className="bg-[#2A292A] border-tertiary/60 text-sm text-gray-100 font-semibold"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center bg-[#151618] border border-tertiary/40 rounded-xl px-4 py-2.5 min-w-[220px]">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              Nomenclatura Regla
            </span>
            <span className="text-sm font-bold text-[#52c6b4] truncate" title={fullTitle}>
              {fullTitle}
            </span>
          </div>
        </div>

        {/* Step Chart Section */}
        <RuleModalChart opsData={opsPoints} amountData={amountPoints} />

        {/* Sub-rules Section */}
        <div className="space-y-4">
          {/* Sub-rules Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-200">Reglas</h3>
            <button
              type="button"
              onClick={handleAddBand}
              className="bg-tertiary border border-table-border hover:bg-[#393738] text-gray-200 text-xs font-medium px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Agregar
            </button>
          </div>

          {/* Sub-rules List */}
          <div className="space-y-3">
            {subRules.map((sr) => (
              <div
                key={sr.id}
                className="bg-tertiary border border-[#393738] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm hover:border-gray-500 transition-colors"
              >
                {/* Toggle Switch */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleBand(sr.id)}
                    className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${sr.enabled ? 'bg-[#10B981]' : 'bg-gray-600'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${sr.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                    />
                  </button>

                  {/* Estado Badge */}
                  <div className="flex flex-col min-w-[70px]">
                    <span className="text-[11px] text-gray-400 mb-0.5">Estado</span>
                    <Badge variant={sr.enabled ? 'activo' : 'inactivo'}>
                      {sr.enabled ? sr.status || 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>

                {/* Hora inicio */}
                <div className="flex flex-col">
                  <label className="text-[11px] text-gray-400 mb-1">Hora inicio</label>
                  <input
                    type="text"
                    value={sr.startTime}
                    onChange={(e) => handleUpdateBand(sr.id, 'startTime', e.target.value)}
                    className="bg-transparent border-transparent px-3 py-1 text-sm text-gray-100 font-mono font-semibold text-center w-24 focus:outline-none focus:ring-0"
                  />
                </div>

                {/* Hora fin */}
                <div className="flex flex-col">
                  <label className="text-[11px] text-gray-400 mb-1">Hora fin</label>
                  <input
                    type="text"
                    value={sr.endTime}
                    onChange={(e) => handleUpdateBand(sr.id, 'endTime', e.target.value)}
                    className="bg-transparent border-transparent px-3 py-1 text-sm text-gray-100 font-mono font-semibold text-center w-24 focus:outline-none focus:ring-0"
                  />
                </div>

                {/* Opm por minuto */}
                <div className="flex flex-col">
                  <label className="text-[11px] text-gray-400 mb-1">Opm por minuto</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={sr.opsPerMinute}
                    onKeyDown={(e) => {
                      if (['-', '+', 'e', 'E', '.', ','].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (e.target.value === '') {
                        handleUpdateBand(sr.id, 'opsPerMinute', '' as any);
                      } else if (!isNaN(val)) {
                        handleUpdateBand(sr.id, 'opsPerMinute', Math.max(0, val));
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (isNaN(val) || val < 0) {
                        handleUpdateBand(sr.id, 'opsPerMinute', 0);
                      }
                    }}
                    className="bg-transparent border-transparent px-3 py-1 text-sm text-gray-100 font-semibold text-center w-28 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Monto máximo */}
                <div className="flex flex-col">
                  <label className="text-[11px] text-gray-400 mb-1">Monto máximo</label>
                  <input
                    type="text"
                    value={sr.maxAmount}
                    onChange={(e) => handleUpdateBand(sr.id, 'maxAmount', e.target.value)}
                    className="bg-transparent border-transparent px-3 py-1 text-sm text-gray-100 font-semibold text-center w-36 focus:outline-none focus:ring-0"
                  />
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDeleteBand(sr.id)}
                  className="w-8 h-8 rounded-full border border-table-border bg-secondary hover:bg-[#393738] text-gray-400 hover:text-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Eliminar regla"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="flex justify-center items-center gap-3 pt-2 pb-1">
          {rule && (
            <button
              type="button"
              onClick={() => exportSingleRuleToPdf({
                ...rule,
                code,
                name: ruleName,
                channel,
                title: fullTitle,
                subRules,
              })}
              className="bg-[#1E1F20] hover:bg-[#2A292A] border border-tertiary text-gray-200 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <FileDown className="w-4 h-4 text-indigo-400" />
              Descargar PDF
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#2b2f3d] hover:bg-[#3a4054] border border-[#3e445b] text-gray-200 text-sm font-semibold px-8 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-gray-900/50"
          >
            {rule ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

