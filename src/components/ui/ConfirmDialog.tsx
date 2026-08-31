import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  intent?: 'danger' | 'success' | 'info' | 'warning';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  intent = 'info'
}) => {
  const isDanger = intent === 'danger';
  const isWarning = intent === 'warning';
  const isSuccess = intent === 'success';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
      className="bg-[#1A191C] border border-[#2b2f3d]"
      bodyClassName="p-6"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`p-4 rounded-full ${
          isDanger ? 'bg-[#EF4444]/10 text-[#EF4444]' : 
          isWarning ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
          isSuccess ? 'bg-[#4ADE80]/10 text-[#4ADE80]' :
          'bg-[#818CF8]/10 text-[#818CF8]'
        }`}>
          {isDanger || isWarning ? <AlertTriangle className="w-8 h-8" /> : <Info className="w-8 h-8" />}
        </div>
        
        <h3 className="text-xl font-bold text-white mt-2">{title}</h3>
        <p className="text-[#9E9D9F] text-sm px-4">{message}</p>
        
        <div className="flex w-full gap-3 mt-6">
          <Button
            variant="secondary"
            className="flex-1 bg-[#232225] border-[#333235] hover:bg-[#2A2B3D] text-white"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            className={`flex-1 ${
              isDanger 
                ? 'bg-[#EF4444] hover:bg-[#DC2626] border-transparent text-white'
                : isSuccess
                ? 'bg-[#4ADE80] hover:bg-[#22c55e] border-transparent text-black'
                : 'bg-[#818CF8] hover:bg-[#6366F1] border-transparent text-white'
            }`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
