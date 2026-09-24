import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Download } from 'lucide-react';
import { exportBlacklistToPdf } from '@/utils/pdfGenerator';

export interface BlacklistItem {
  id: string;
  status: 'Activo' | 'Inactivo' | string;
  field: string;
  value: string;
  action: string;
  lastModified: string;
  eventsRegistered: number;
  description?: string;
}

export interface BlacklistDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BlacklistItem | null;
}

export const BlacklistDetailModal: React.FC<BlacklistDetailModalProps> = ({
  isOpen,
  onClose,
  item
}) => {
  if (!item) return null;



  const handleDownloadReport = () => {
    if (item) {
      exportBlacklistToPdf(item);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de Lista Negra"
      size="2xl"
      headerLeft={
        <button
          type="button"
          onClick={handleDownloadReport}
          className="p-1.5 rounded-full text-gray-400 bg-tertiary border border-table-border hover:bg-[#393738] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 cursor-pointer"
          title="Descargar reporte PDF"
          aria-label="Descargar reporte PDF"
        >
          <Download className="w-5 h-5" />
        </button>
      }
      bodyClassName="p-6 gap-6 bg-[#1A191C]"
      className="bg-[#1A191C] border border-[#2b2f3d]"
    >
      <div className="flex flex-col gap-4">
        {/* Top Info Row */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl border border-[#333235] bg-[#232225]">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[12px] text-[#9E9D9F] font-medium">ID</span>
              <span className="text-sm font-bold text-white">{item.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[12px] text-[#9E9D9F] font-medium">{item.field}</span>
              <span className="text-sm font-bold text-white font-mono">{item.value}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-start gap-1">
              <span className="text-[12px] text-[#9E9D9F] font-medium">Acción a tomar</span>
              <Badge variant={item.action as any}>{item.action}</Badge>
            </div>
          </div>
        </div>

        {/* Status Row */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-[#333235] bg-[#232225]">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[12px] text-[#9E9D9F] font-medium">Estado de la regla</span>
            <Badge variant={item.status as any}>{item.status}</Badge>
          </div>
        </div>

        {/* Description Row */}
        {item.description && (
          <div className="flex flex-col gap-2 p-4 rounded-xl border border-[#333235] bg-[#232225]">
            <span className="text-[12px] text-[#9E9D9F] font-medium">Descripción</span>
            <p className="text-sm text-gray-300">{item.description}</p>
          </div>
        )}

        {/* Technical Details */}
        {/*<div className="flex flex-col gap-4 p-5 rounded-xl border border-[#333235] bg-[#232225]">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-gray-200">Detalles técnicos</span>
          </div>
          {<div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[12px] text-[#9E9D9F] font-medium">Última modificación</span>
                <span className="text-sm font-bold text-white">{item.lastModified}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[12px] text-[#9E9D9F] font-medium">Eventos registrados</span>
                <span className="text-sm font-bold text-white">{item.eventsRegistered} intervenciones</span>
              </div>
            </div>
          </div>}
        </div>*/}

      </div>
    </Modal>
  );
};
