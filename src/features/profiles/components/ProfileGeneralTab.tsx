import React from 'react';
import { User, ShieldCheck, MapPin, Scale, Network } from 'lucide-react';
import type { UserProfile } from '../../../mocks/profilesData';
import { ProfileInfoCard } from './ProfileInfoCard';

interface ProfileGeneralTabProps {
  user: UserProfile;
}

export const ProfileGeneralTab: React.FC<ProfileGeneralTabProps> = ({ user }) => {
  const isJuridico = user.profileType === 'Jurídico' || user.name.toLowerCase().includes('llc') || user.name.toLowerCase().includes('s.a.');

  const personalFields = [
    { label: 'Nombre', value: user.name },
    { label: 'Cédula', value: <span className="font-mono text-gray-300">{user.cedula}</span> },
    { label: 'Usuario', value: <span className="font-mono text-gray-300">{user.username}</span> },
    { label: 'Residencia', value: user.residencia },
    { label: 'Email', value: <span className="text-[#1DA493] font-mono">{user.email}</span> },
    { label: 'Región', value: user.region },
    { label: 'Año de Registro', value: user.registrationYear },
    { label: 'Tipo de Perfil', value: user.profileType },
  ];

  const securityFields = [
    { 
      label: 'Huella / FaceID', 
      value: (
        <span className={user.huellaSegura ? 'text-[#1DA493] font-semibold' : 'text-gray-400'}>
          {user.huellaFaceId || 'Configurada'}
        </span>
      ) 
    },
    { 
      label: '2FA', 
      value: (
        <span className="text-white font-semibold">
          {user.twoFactorAuthDetail || 'App Authenticator (Activo)'}
        </span>
      ) 
    },
    { 
      label: 'Preguntas de Seguridad', 
      value: user.securityQuestionsCount || '3 Configuradas' 
    },
    { 
      label: 'Último Cambio Pass', 
      value: <span className="font-mono text-gray-300">{user.ultimoCambioPass || 'Hace 45 días'}</span> 
    },
  ];

  const locationFields = [
    { 
      label: 'Coordenadas', 
      value: <span className="font-mono text-gray-300">{user.coordenadas || '10.48, -66.90 (Caracas)'}</span> 
    },
    { 
      label: 'Última IP Pública', 
      value: <span className="font-mono text-gray-300">{user.lastIp || '190.202.45.12'}</span> 
    },
    { 
      label: 'Dispositivo Habitual', 
      value: user.dispositivoHabitual || 'Móvil (iOS 17.5)' 
    },
    { 
      label: 'Sesión Actual', 
      value: <span className="text-[#1DA493] font-semibold">{user.sesionActual || 'App Móvil Nativa'}</span> 
    },
  ];

  // Campos para KYB / KYC & Cumplimiento Legal
  const complianceTitle = `${isJuridico ? 'KYB' : 'KYC'} & Cumplimiento Legal (${user.name})`;
  const complianceFields = [
    { 
      label: isJuridico ? 'Razón Social' : 'Nombre Legal / Titular', 
      value: <span className="font-bold text-white tracking-wide">{user.kycKybData.razonSocial}</span> 
    },
    { 
      label: 'Estatus de Listas', 
      value: (
        <div className="text-xs space-x-1">
          <span className="font-bold text-white">UNIFICADO:</span>{' '}
          <span className="text-[#1DA493] font-semibold">Sin Sanciones</span>{' '}
          <span className="text-gray-400">/ OFAC:</span>{' '}
          <span className="text-[#1DA493] font-semibold">Limpio</span>{' '}
          <span className="text-gray-400">/ GAFI:</span>{' '}
          <span className="text-[#1DA493] font-semibold">Limpio</span>{' '}
          <span className="text-gray-400">/ Nacional:</span>{' '}
          <span className="text-[#1DA493] font-semibold">Limpio</span>
        </div>
      ) 
    },
    { 
      label: 'Actividad (CIIU)', 
      value: user.kycKybData.actividadCiiu 
    },
    { 
      label: 'PEP Status', 
      value: (
        <div className="text-xs">
          <span className="text-[#1DA493] font-semibold">No Relacionado</span>{' '}
          <span className="text-gray-400">/ Sin Coincidencias PEP</span>
        </div>
      ) 
    },
    { 
      label: isJuridico ? 'Representante Legal' : 'Documentación Identidad', 
      value: (
        <div className="text-xs">
          <span className="text-white font-semibold">{user.kycKybData.representanteLegal.split('-')[0]}</span>{' '}
          <span className="text-gray-400">-</span>{' '}
          <span className="text-[#1DA493] font-semibold">ID Confirmado</span>
        </div>
      ) 
    },
  ];

  // Campos para Dispositivo & Integridad de Red
  const networkFields = [
    { 
      label: 'Tipo de Conexión', 
      value: <span className="text-[#1DA493] font-semibold">{user.networkIntegrityData.tipoConexion}</span> 
    },
    { 
      label: 'ASN', 
      value: <span className="font-mono text-gray-300">{user.networkIntegrityData.asn}</span> 
    },
    { 
      label: 'VPN / Proxy Detectado', 
      value: (
        <div className="text-xs">
          <span className="text-[#1DA493] font-semibold">No Detectado</span>{' '}
          <span className="text-gray-400">/ Proxy SSL Limpio</span>
        </div>
      ) 
    },
    { 
      label: 'Viaje Imposible', 
      value: <span className="text-[#1DA493] font-semibold">{user.networkIntegrityData.viajeImposible}</span> 
    },
    { 
      label: 'Nivel de Trusted Device', 
      value: (
        <div className="text-xs">
          <span className="text-gray-300">Score:</span>{' '}
          <span className="text-[#1DA493] font-semibold">94 - Alto (Confiable)</span>
        </div>
      ) 
    },
    { 
      label: 'Estado del Entorno', 
      value: <span className="text-[#1DA493] font-semibold">{user.networkIntegrityData.estadoEntorno}</span> 
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Tarjeta Superior: Información Personal */}
      <ProfileInfoCard
        title="Información Personal"
        icon={<User className="w-5 h-5 text-[#1DA493]" />}
        fields={personalFields}
        columns={4}
      />

      {/* Grilla Media: Seguridad & Ubicación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileInfoCard
          title="Seguridad & Autenticación"
          icon={<ShieldCheck className="w-5 h-5 text-[#1DA493]" />}
          fields={securityFields}
          columns={2}
        />

        <ProfileInfoCard
          title="Ubicación y Dispositivo"
          icon={<MapPin className="w-5 h-5 text-[#1DA493]" />}
          fields={locationFields}
          columns={2}
        />
      </div>

      {/* Grilla Inferior: KYB/KYC & Integridad de Red (Collapsibles con flechas ^) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileInfoCard
          title={complianceTitle}
          icon={<Scale className="w-5 h-5 text-[#1DA493]" />}
          fields={complianceFields}
          columns={2}
          collapsible={true}
          defaultCollapsed={false}
        />

        <ProfileInfoCard
          title="Dispositivo & Integridad de Red"
          icon={<Network className="w-5 h-5 text-[#1DA493]" />}
          fields={networkFields}
          columns={2}
          collapsible={true}
          defaultCollapsed={false}
        />
      </div>
    </div>
  );
};


