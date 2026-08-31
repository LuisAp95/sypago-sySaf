import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { 
  Hash, 
  User, 
  FileText, 
  DollarSign, 
  ShieldAlert, 
  AlertTriangle, 
  Link2, 
  Settings, 
  Globe, 
  MapPin, 
  Monitor, 
  Clock,
  Download
} from 'lucide-react';
import { exportQuarantineToPdf } from '@/utils/pdfGenerator';

export interface QuarantineItem {
  id: string;
  user: string;
  risk: 'Crítico' | 'Alto' | 'Medio' | 'Bajo' | string;
  document: string;
  reason: string;
  waitTime: string;
  amount: string;
}

export interface QuarantineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: QuarantineItem | null;
}

export const QuarantineDetailModal: React.FC<QuarantineDetailModalProps> = ({
  isOpen,
  onClose,
  item
}) => {
  if (!item) return null;

  const isCritical = item.risk === 'Crítico';

  const handleDownloadReport = () => {
    if (item) {
      exportQuarantineToPdf(item);
    }
  };

  const getReasonDescription = (reason: string) => {
    switch (reason.toLowerCase()) {
      case 'incumplimiento de reglas':
        return 'La operación fue retenida debido a que superó los límites establecidos en las reglas de transacción del canal. Específicamente, se infringió la regla de monto máximo o cantidad de operaciones permitidas.';
      case 'lista negra':
        return 'Se detectó que uno o más atributos de esta transacción coinciden con registros activos en la Lista Negra institucional, por lo que el sistema ha procedido con el bloqueo preventivo.';
      case 'ip sospechosa':
        return 'Se detectó que el registro fue creado desde una dirección IP que ha sido asociada con actividades inusuales y múltiples intentos de acceso no autorizados. Esta IP se encuentra en nuestra lista de monitoreo por comportamiento anómalo.';
      case 'dispositivo nuevo':
        return 'Se ha identificado una transacción desde un dispositivo que no está en el historial de dispositivos de confianza del usuario. Por políticas de seguridad, requiere verificación adicional.';
      default:
        return 'La transacción ha sido enviada a cuarentena tras ser evaluada por el motor de prevención de fraudes. Se requiere revisión manual para confirmar su validez.';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del Registro"
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
        <div className="grid grid-cols-4 gap-4 p-4 rounded-xl border border-[#333235] bg-[#232225]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#2A2B3D]">
              <Hash className="w-5 h-5 text-[#818CF8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#9E9D9F] font-medium">ID</span>
              <span className="text-sm font-bold text-white">{item.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#2A2B3D]">
              <User className="w-5 h-5 text-[#818CF8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#9E9D9F] font-medium">Usuario</span>
              <span className="text-sm font-bold text-white">{item.user}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#2A2B3D]">
              <FileText className="w-5 h-5 text-[#818CF8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#9E9D9F] font-medium">Documento</span>
              <span className="text-sm font-bold text-white">{item.document}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#2A2B3D]">
              <DollarSign className="w-5 h-5 text-[#818CF8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#9E9D9F] font-medium">Monto</span>
              <span className="text-sm font-bold text-white">
                {item.amount?.includes('Bs') ? item.amount : `${item.amount} Bs.`}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Level Row */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-[#333235] bg-[#232225]">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${isCritical ? 'bg-[#3D2B2B]' : 'bg-[#333235]'}`}>
            <ShieldAlert className={`w-5 h-5 ${isCritical ? 'text-[#EF4444]' : 'text-[#9E9D9F]'}`} />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-[12px] text-[#9E9D9F] font-medium">Nivel de Riesgo</span>
            <Badge variant={item.risk as any}>{item.risk}</Badge>
          </div>
        </div>

        {/* Reason Box */}
        <div className={`flex flex-col gap-3 p-5 rounded-xl border ${isCritical ? 'border-[#EF4444]/50 bg-[#EF4444]/5' : 'border-[#333235] bg-[#232225]'}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${isCritical ? 'text-[#EF4444]' : 'text-[#EAB308]'}`} />
            <span className={`text-base font-bold ${isCritical ? 'text-[#EF4444]' : 'text-[#EAB308]'}`}>Motivo del Bloqueo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#1E3A8A]/30 text-[#60A5FA] px-3 py-1 rounded-full text-sm font-medium border border-[#1E3A8A]/50">
              <Link2 className="w-4 h-4" />
              <span>{item.reason}</span>
            </div>
          </div>
          <p className="text-sm text-[#D4D4D8] leading-relaxed mt-1">
            {getReasonDescription(item.reason)}
          </p>
        </div>

        {/* Technical Details */}
        <div className="flex flex-col gap-4 p-5 rounded-xl border border-[#333235] bg-[#232225]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#818CF8]" />
            <span className="text-[15px] font-bold text-gray-200">Detalles técnicos</span>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#818CF8]" />
              <div className="flex flex-col">
                <span className="text-[12px] text-[#9E9D9F] font-medium">IP</span>
                <span className="text-sm font-bold text-white">192.168.1.XXX</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#818CF8]" />
              <div className="flex flex-col">
                <span className="text-[12px] text-[#9E9D9F] font-medium">Ubicación</span>
                <span className="text-sm font-bold text-white">[País/Ciudad]</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-[#818CF8]" />
              <div className="flex flex-col">
                <span className="text-[12px] text-[#9E9D9F] font-medium">Dispositivo</span>
                <span className="text-sm font-bold text-white">[Tipo de dispositivo]</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#818CF8]" />
              <div className="flex flex-col">
                <span className="text-[12px] text-[#9E9D9F] font-medium">Tiempo en espera</span>
                <span className="text-sm font-bold text-white">{item.waitTime}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
};
