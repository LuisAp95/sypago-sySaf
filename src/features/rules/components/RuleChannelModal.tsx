import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import type { ChannelRule } from '../types/channelRules.types';
import { CHANNELS, PRODUCTS } from '../mocks/channelRules.mock';
import type { RuleDefinitionItem } from '../types/rule.types';

export interface RuleChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule: ChannelRule | null;
  onSave: (rule: ChannelRule) => void;
  initialChannelId?: string; // Para cuando se crea nueva regla con canal preseleccionado
}

const FALLBACK_RULE_OPTIONS = [
  { label: '001 Entre semana App - N', value: '001 Entre semana App - N' },
  { label: '002 Fin de semana Web - N', value: '002 Fin de semana Web - N' },
  { label: '003 Horario oficina App - J', value: '003 Horario oficina App - J' },
  { label: '004 Operaciones Especiales POS', value: '004 Operaciones Especiales POS' },
  { label: '005 Pagos Móviles App - N', value: '005 Pagos Móviles App - N' },
];

export const RuleChannelModal: React.FC<RuleChannelModalProps> = ({
  isOpen,
  onClose,
  rule,
  onSave,
  initialChannelId
}) => {
  // Load rules dynamically from localStorage when modal opens
  const ruleOptions = useMemo(() => {
    if (!isOpen) return [...FALLBACK_RULE_OPTIONS, { label: 'Sin regla asignada', value: 'Ninguna' }];

    try {
      const stored = localStorage.getItem('sypago_rules');
      if (stored) {
        const parsedRules: RuleDefinitionItem[] = JSON.parse(stored);
        if (parsedRules.length > 0) {
          const options = parsedRules.map(r => ({
            label: r.title || `${r.code || ''} ${r.name || 'Regla'}`.trim(),
            value: r.title || `${r.code || ''} ${r.name || 'Regla'}`.trim(),
          }));
          return [...options, { label: 'Sin regla asignada', value: 'Ninguna' }];
        }
      }
    } catch (e) {
      // fallback to hardcoded
    }

    return [...FALLBACK_RULE_OPTIONS, { label: 'Sin regla asignada', value: 'Ninguna' }];
  }, [isOpen]);

  const isNew = !rule;
  const defaultChannelId = initialChannelId || CHANNELS[0].id;

  const [formData, setFormData] = useState<ChannelRule>({
    id: '',
    channelId: defaultChannelId,
    products: [],
    status: 'Activo',
    weekday: '001 Entre semana App - N',
    weekend: '002 Fin de semana Web - N',
    holidays: '003 Horario oficina App - J',
    lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19)
  });

  useEffect(() => {
    if (rule) {
      setFormData(rule);
    } else {
      setFormData({
        id: `rule-${Date.now()}`,
        channelId: defaultChannelId,
        products: [],
        status: 'Activo',
        weekday: '001 Entre semana App - N',
        weekend: '002 Fin de semana Web - N',
        holidays: '003 Horario oficina App - J',
        lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19)
      });
    }
  }, [rule, isOpen, defaultChannelId]);

  // Cuando cambia el canal, limpiamos los productos seleccionados
  const handleChannelChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      channelId: val,
      products: [] 
    }));
  };

  const handleToggleStatus = () => {
    setFormData(prev => ({
      ...prev,
      status: prev.status === 'Activo' ? 'Inactivo' : 'Activo'
    }));
  };

  // Manejo de productos multiples
  const availableProducts = PRODUCTS.filter(p => p.channelId === formData.channelId);
  
  const handleProductToggle = (productId: string) => {
    setFormData(prev => {
      let newProducts = [...prev.products];
      if (productId === 'Todos') {
        newProducts = newProducts.includes('Todos') ? [] : ['Todos'];
      } else {
        // si elegimos uno específico, quitamos "Todos"
        newProducts = newProducts.filter(p => p !== 'Todos');
        if (newProducts.includes(productId)) {
          newProducts = newProducts.filter(p => p !== productId);
        } else {
          newProducts.push(productId);
        }
        // si despues de agregar, estan todos los individuales marcados, lo convertimos a "Todos"?
        // El usuario dijo "cuando selecionas todos, guarda la palabra general"
        if (newProducts.length === availableProducts.length) {
          newProducts = ['Todos'];
        }
      }
      return { ...prev, products: newProducts };
    });
  };

  const handleSave = () => {
    onSave({
      ...formData,
      lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });
    onClose();
  };

  const renderRuleSelector = (
    label: string,
    field: 'weekday' | 'weekend' | 'holidays'
  ) => (
    <div className="flex items-center justify-between bg-[#2A292A] rounded-xl p-4">
      <span className="text-[15px] font-semibold text-gray-100">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300 font-medium">Regla:</span>
        <div className="w-56">
          <Select
            options={ruleOptions}
            value={formData[field]}
            onChange={(val) => setFormData(prev => ({ ...prev, [field]: val }))}
            className="bg-[#1F1F21] border-transparent text-sm text-gray-200 focus:ring-0 rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  const channelOptions = CHANNELS.map(c => ({
    label: `${c.name} (${c.type.replace('_', ' ')})`,
    value: c.id
  }));

  const selectedChannelName = CHANNELS.find(c => c.id === formData.channelId)?.name || 'Nuevo Canal';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNew ? 'Nueva Regla por Canal' : `Regla de ${selectedChannelName}`}
      size="2xl"
      bodyClassName="p-8 gap-8 bg-[#1F1F21]"
      className="bg-[#1F1F21] border border-[#2b2f3d]"
    >
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-[#2b2f3d]/60">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-200">Canal</label>
            {isNew ? (
              <Select
                options={channelOptions}
                value={formData.channelId}
                onChange={handleChannelChange}
                className="bg-[#2A292A] border-transparent text-gray-200"
              />
            ) : (
              <div className="bg-[#2A292A] border border-transparent text-gray-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed">
                {channelOptions.find(o => o.value === formData.channelId)?.label}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-200">Productos (Múltiple)</label>
            <div className="bg-[#2A292A] rounded-xl p-3 max-h-32 overflow-y-auto flex flex-col gap-2 border border-transparent focus-within:border-gray-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-600 bg-[#1F1F21] text-[#a1bfb9] focus:ring-[#a1bfb9]"
                  checked={formData.products.includes('Todos')}
                  onChange={() => handleProductToggle('Todos')}
                />
                <span className="text-sm text-gray-200">Todos</span>
              </label>
              {availableProducts.map(prod => (
                <label key={prod.id} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-600 bg-[#1F1F21] text-[#a1bfb9] focus:ring-[#a1bfb9]"
                    checked={formData.products.includes('Todos') || formData.products.includes(prod.id)}
                    onChange={() => handleProductToggle(prod.id)}
                    disabled={formData.products.includes('Todos')}
                  />
                  <span className="text-sm text-gray-200">{prod.name} (Cód: {prod.id})</span>
                </label>
              ))}
            </div>
            {formData.products.length === 0 && (
              <span className="text-xs text-red-400">Debe seleccionar al menos un producto</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6">
                <span className="text-sm font-semibold text-gray-200">Estado</span>
                <button
                    onClick={handleToggleStatus}
                    className={`flex items-center gap-2 rounded-full pl-3 pr-1 py-1 transition-colors border ${
                        formData.status === 'Activo' 
                            ? "bg-[#265e56] border-[#2c6e65]" 
                            : "bg-[#2b2f3d] border-[#393738] hover:bg-[#3b3f4d]"
                    }`}
                >
                    <span className={`text-[13px] font-medium tracking-wide ${
                        formData.status === 'Activo' ? "text-[#52c6b4]" : "text-gray-400"
                    }`}>
                        {formData.status}
                    </span>
                    <div
                        className={`w-5 h-5 rounded-full transition-transform ${
                            formData.status === 'Activo' ? "bg-[#a1bfb9]" : "bg-gray-500"
                        }`}
                    />
                </button>
            </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-[15px] font-semibold text-gray-200">Reglas Asignadas</h3>
          <div className="flex flex-col gap-3">
            {renderRuleSelector('Entre semana', 'weekday')}
            {renderRuleSelector('Fin de semana', 'weekend')}
            {renderRuleSelector('Feriados', 'holidays')}
          </div>
        </div>

        <div className="flex justify-center mt-4 pb-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={formData.products.length === 0}
            className="bg-[#2a2c33] hover:bg-[#343741] disabled:opacity-50 disabled:cursor-not-allowed border border-[#363842] text-gray-300 text-sm font-semibold px-8 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
};
