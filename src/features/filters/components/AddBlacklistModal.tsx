import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import type { BlacklistItem } from './BlacklistDetailModal';

export interface AddBlacklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: BlacklistItem) => void;
}

const FIELD_OPTIONS = [
  { label: 'Documento', value: 'Documento' },
  { label: 'Cuenta', value: 'Cuenta' },
  { label: 'Cliente', value: 'Cliente' },
  { label: 'Email', value: 'Email' },
  { label: 'Teléfono', value: 'Teléfono' },
];

const ACTION_OPTIONS = [
  { label: 'Bloquear', value: 'Bloquear' },
  { label: 'Revisión', value: 'Revisión' },
  { label: 'Desafío', value: 'Desafío' },
];

export const AddBlacklistModal: React.FC<AddBlacklistModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [field, setField] = useState('Documento');
  const [value, setValue] = useState('');
  const [action, setAction] = useState('Bloquear');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const newItem: BlacklistItem = {
      id: `BL-${Math.floor(Math.random() * 10000)}`,
      status: 'Activo',
      field,
      value,
      action,
      lastModified: new Date().toISOString().split('T')[0].split('-').reverse().join('/'),
      eventsRegistered: 0
    };

    onAdd(newItem);
    setField('Documento');
    setValue('');
    setAction('Bloquear');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar a Lista Negra"
      size="md"
      bodyClassName="p-6 bg-[#1A191C]"
      className="bg-[#1A191C] border border-[#2b2f3d]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Campo</label>
          <Select
            options={FIELD_OPTIONS}
            value={field}
            onChange={setField}
            placeholder="Seleccione un campo"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Valor</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ingrese el valor..."
            className="w-full bg-[#232225] border border-table-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Acción a tomar</label>
          <Select
            options={ACTION_OPTIONS}
            value={action}
            onChange={setAction}
            placeholder="Seleccione una acción"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="bg-tertiary border border-table-border hover:bg-[#393738] text-gray-300"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="bg-primary hover:bg-primary-hover text-white"
            disabled={!value.trim()}
          >
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
};
