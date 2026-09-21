import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { DispersionTimeBand } from '../types/rule.types';

interface DispersionRuleFormProps {
  subRules: DispersionTimeBand[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, field: keyof DispersionTimeBand, value: any) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export const DispersionRuleForm: React.FC<DispersionRuleFormProps> = ({
  subRules,
  onToggle,
  onUpdate,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {/* Sub-rules Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-gray-200">Reglas de Dispersión</h3>
          <span className="text-[11px] text-gray-500 mt-0.5">
            Cualquier condición que se cumpla envía la operación a cuarentena
          </span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="bg-tertiary border border-table-border hover:bg-[#393738] text-gray-200 text-xs font-medium px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          Agregar
        </button>
      </div>

      {/* Quarantine Info Banner */}
      <div className="bg-[#1a2332] border border-[#2a3a4f] rounded-xl px-4 py-3 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold text-amber-300/90">Lógica de cuarentena</span>
          <span className="text-[11px] text-gray-400 leading-relaxed">
            Si el cliente alcanza el máximo de operaciones diarias, cualquier operación adicional entra en cuarentena.
            Si una operación supera el monto mínimo, entra en cuarentena. Ambas condiciones son independientes.
          </span>
        </div>
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
                onClick={() => onToggle(sr.id)}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  sr.enabled ? 'bg-[#10B981]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    sr.enabled ? 'translate-x-6' : 'translate-x-0'
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
                value="00:00"
                readOnly
                className="bg-transparent border-transparent px-3 py-1 text-sm text-gray-500 font-mono font-semibold text-center w-24 focus:outline-none focus:ring-0 cursor-not-allowed"
              />
            </div>

            {/* Hora fin */}
            <div className="flex flex-col">
              <label className="text-[11px] text-gray-400 mb-1">Hora fin</label>
              <input
                type="text"
                value="23:59"
                readOnly
                className="bg-transparent border-transparent px-3 py-1 text-sm text-gray-500 font-mono font-semibold text-center w-24 focus:outline-none focus:ring-0 cursor-not-allowed"
              />
            </div>

            {/* Operaciones diarias */}
            <div className="flex flex-col">
              <label className="text-[11px] text-gray-400 mb-1">Ops. diarias máx.</label>
              <input
                type="number"
                min="0"
                step="1"
                value={sr.maxDailyOps}
                onKeyDown={(e) => {
                  if (['-', '+', 'e', 'E', '.', ','].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (e.target.value === '') {
                    onUpdate(sr.id, 'maxDailyOps', '' as any);
                  } else if (!isNaN(val)) {
                    onUpdate(sr.id, 'maxDailyOps', Math.max(0, val));
                  }
                }}
                onBlur={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (isNaN(val) || val < 0) {
                    onUpdate(sr.id, 'maxDailyOps', 0);
                  }
                }}
                className="bg-transparent border-transparent px-3 py-1 text-sm text-gray-100 font-semibold text-center w-28 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Monto mínimo */}
            <div className="flex flex-col">
              <label className="text-[11px] text-gray-400 mb-1">Monto máximo</label>
              <input
                type="text"
                value={sr.minAmount}
                onChange={(e) => onUpdate(sr.id, 'minAmount', e.target.value)}
                className="bg-transparent border-transparent px-3 py-1 text-sm text-gray-100 font-semibold text-center w-36 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Delete button */}
            <button
              type="button"
              onClick={() => onDelete(sr.id)}
              className="w-8 h-8 rounded-full border border-table-border bg-secondary hover:bg-[#393738] text-gray-400 hover:text-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Eliminar regla"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
