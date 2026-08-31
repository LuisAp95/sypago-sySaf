import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';

export interface ChannelItem {
  id: string;
  channel: string;
  status: string;
  group: string;
  weekday: string;
  weekend: string;
  holidays: string;
  lastModified: string;
}

export interface RuleChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: ChannelItem | null;
  onSave: (channel: ChannelItem) => void;
}

const RULE_OPTIONS = [
  { label: '001 Entre semana App - N', value: '001 Entre semana App - N' },
  { label: '002 Fin de semana Web - N', value: '002 Fin de semana Web - N' },
  { label: '003 Horario oficina App - J', value: '003 Horario oficina App - J' },
  { label: '004 Operaciones Especiales POS', value: '004 Operaciones Especiales POS' },
  { label: '005 Pagos Móviles App - N', value: '005 Pagos Móviles App - N' },
  { label: 'Sin regla asignada', value: 'Ninguna' }
];

export const RuleChannelModal: React.FC<RuleChannelModalProps> = ({
  isOpen,
  onClose,
  channel,
  onSave
}) => {
  const isNew = !channel;

  const [formData, setFormData] = useState<ChannelItem>({
    id: '',
    channel: '',
    status: 'Activo',
    group: 'Natural',
    weekday: '001 Entre semana App - N',
    weekend: '002 Fin de semana Web - N',
    holidays: '003 Horario oficina App - J',
    lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19)
  });

  useEffect(() => {
    if (channel) {
      setFormData(channel);
    } else {
      setFormData({
        id: `chn-${Date.now()}`,
        channel: '',
        status: 'Activo',
        group: 'Natural',
        weekday: '001 Entre semana App - N',
        weekend: '002 Fin de semana Web - N',
        holidays: '003 Horario oficina App - J',
        lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19)
      });
    }
  }, [channel, isOpen]);

  const handleToggleStatus = () => {
    setFormData(prev => ({
      ...prev,
      status: prev.status === 'Activo' ? 'Inactivo' : 'Activo'
    }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      channel: formData.channel.trim() || (isNew ? 'Nuevo Canal' : formData.channel),
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
            options={RULE_OPTIONS}
            value={formData[field]}
            onChange={(val) => setFormData(prev => ({ ...prev, [field]: val }))}
            className="bg-[#1F1F21] border-transparent text-sm text-gray-200 focus:ring-0 rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNew ? 'Nuevo Canal' : formData.channel}
      size="2xl"
      bodyClassName="p-8 gap-8 bg-[#1F1F21]"
      className="bg-[#1F1F21] border border-[#2b2f3d]"
    >
      <div className="flex flex-col gap-8">
        {isNew && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-[#2b2f3d]/60">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-200">Nombre del Canal</label>
              <input
                type="text"
                value={formData.channel}
                onChange={e => setFormData({ ...formData, channel: e.target.value })}
                className="bg-[#2A292A] border border-transparent text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
                placeholder="Ej. App - Natural"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-200">Grupo</label>
              <Select
                options={[
                  { label: 'Natural', value: 'Natural' },
                  { label: 'Jurídico', value: 'Jurídico' }
                ]}
                value={formData.group}
                onChange={val => setFormData({ ...formData, group: val })}
                className="bg-[#2A292A] border-transparent text-gray-200"
              />
            </div>
          </div>
        )}

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
          <h3 className="text-[15px] font-semibold text-gray-200">Reglas</h3>
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
            className="bg-[#2a2c33] hover:bg-[#343741] border border-[#363842] text-gray-300 text-sm font-semibold px-8 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            {isNew ? 'Crear' : 'Actualizar'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
