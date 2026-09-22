import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface AddBlacklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const AddBlacklistModal: React.FC<AddBlacklistModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [docType, setDocType] = useState('V');
  const [docNumber, setDocNumber] = useState('');
  const [action, setAction] = useState('Bloqueada');
  const [description, setDescription] = useState('');

  const docTypeOptions = [
    { label: 'V', value: 'V' },
    { label: 'E', value: 'E' },
    { label: 'J', value: 'J' },
    { label: 'G', value: 'G' },
    { label: 'P', value: 'P' },
  ];

  const actionOptions = [
    { label: 'Bloqueada', value: 'Bloqueada' }
  ];

  useEffect(() => {
    if (isOpen) {
      setDocType('V');
      setDocNumber('');
      setAction('Bloqueada');
      setDescription('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!docNumber.trim() || !description.trim()) return;
    onSave({
      field: 'Documento',
      value: `${docType}-${docNumber}`,
      action,
      description
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar a Lista Negra"
      size="md"
      bodyClassName="p-6 gap-6 bg-[#1A191C]"
      className="bg-[#1A191C] border border-[#2b2f3d]"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-gray-400">Documento</label>
          <div className="flex items-center gap-2">
            <div className="w-[80px] shrink-0">
              <Select
                options={docTypeOptions}
                value={docType}
                onChange={setDocType}
                className="bg-[#232225] border-[#333235] text-white"
              />
            </div>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="Ingrese el número..."
              className="flex-1 bg-[#232225] border border-[#333235] text-white px-4 py-2 rounded-xl focus:outline-none focus:border-[#52c6b4] transition-colors text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-gray-400">Acción a tomar</label>
          <Select
            options={actionOptions}
            value={action}
            onChange={setAction}
            className="bg-[#232225] border-[#333235] text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-gray-400">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Razón de ingreso a la lista negra..."
            rows={3}
            className="w-full bg-[#232225] border border-[#333235] text-white px-4 py-2 rounded-xl focus:outline-none focus:border-[#52c6b4] transition-colors resize-none text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            className="bg-transparent border border-[#333235] text-gray-300 hover:bg-[#333235] px-6"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!docNumber.trim() || !description.trim()}
            className="bg-[#2a2c33] hover:bg-[#343741] border border-[#363842] text-gray-300 px-6 disabled:opacity-50"
          >
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
