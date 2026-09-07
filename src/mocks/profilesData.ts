export type DeviceType = 'Teléfono' | 'Laptop';
export type SecurityLevel = 'Seguro' | 'Medio' | 'Alto' | 'Bajo';
export type ProfileType = 'Natural' | 'Jurídico' | 'Extranjero';

export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  lastAccess: string;
  ip: string;
  status: 'Activo' | 'Inactivo';
}

export interface AllowedIpInfo {
  id: string;
  ip: string;
  label: string;
  addedDate: string;
  status: 'Permitida' | 'Bloqueada';
}

export interface AuditEventInfo {
  id: string;
  date: string;
  action: string;
  ip: string;
  details: string;
}

export interface KycKybComplianceInfo {
  razonSocial: string;
  estatusListas: string;
  actividadCiiu: string;
  pepStatus: string;
  representanteLegal: string;
}

export interface NetworkIntegrityInfo {
  tipoConexion: string;
  asn: string;
  vpnProxy: string;
  viajeImposible: string;
  trustedDeviceScore: string;
  estadoEntorno: string;
}

export interface AllowedRegionInfo {
  id: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  reason: string;
  autoWhitelistIp: boolean;
  status: 'Vigente' | 'Programado' | 'Vencido';
}

export interface UserProfile {
  id: string;
  name: string;
  cedula: string;
  profileType: ProfileType;
  riskScore: number;
  lastIp: string;
  device: DeviceType;
  huellaSegura: boolean;
  ipDesconocida: boolean;
  fueraDeGeolocalizacion: boolean;
  securityLevel: SecurityLevel;
  // Campos extendidos para la vista detallada
  username: string;
  registrationYear: string;
  region: string;
  residencia: string;
  geolocation: string;
  email: string;
  digitalFingerprintStatus: string;
  twoFactorAuth: string;
  securityQuestionsCount: string;
  huellaFaceId: string;
  twoFactorAuthDetail: string;
  ultimoCambioPass: string;
  coordenadas: string;
  dispositivoHabitual: string;
  sesionActual: string;
  devicesList: DeviceInfo[];
  allowedIps: AllowedIpInfo[];
  allowedRegions: AllowedRegionInfo[];
  auditLogs: AuditEventInfo[];
  kycKybData: KycKybComplianceInfo;
  networkIntegrityData: NetworkIntegrityInfo;
}

const names = ['Alejandro Rodriguez', 'Juan Pérez', 'María García', 'Acme Corporation S.A.', 'John Doe', 'María Mantez', 'Carlos Gómez', 'Pedro Pascal', 'Inversiones C.A.', 'Luisa Fernández', 'Global Tech LLC'];
const cedulas = ['V-12345678', 'V-87654321', 'J-00000000-1', 'E-11223344', 'V-99887766', 'J-12345678-9', 'E-55667788', 'V-22334455', 'V-11223344', 'J-98765432-1'];
const ips = ['192.168.1.10', '10.0.0.55', '203.0.113.4', '172.16.0.1', '192.168.1.10', '172.16.11.2', '203.0.11.1', '10.1.2.3', '192.168.2.20', '8.8.8.8'];
const regions = ['Central', 'Capital', 'Occidente', 'Oriente', 'Los Andes', 'Zuliana'];
const residencias = ['Caracas, Venezuela', 'Valencia, Venezuela', 'Maracaibo, Venezuela', 'Barquisimeto, Venezuela', 'Maracay, Venezuela'];
const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
const ciiuOptions = [
  '6202 - Consultoría en informática',
  '4711 - Comercio al por menor en comercios no especializados',
  '6419 - Otros tipos de intermediación monetaria',
  '7020 - Actividades de consultoría de gestión',
  '8690 - Otras actividades de atención de la salud humana'
];
const asns = [
  'AS8048 - CANTV Servicio de Internet',
  'AS26466 - NetUno Corporation',
  'AS27882 - Corporation Digitel C.A.',
  'AS8053 - Movistar Venezuela (Telefónica)'
];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateProfiles = (count: number = 100): UserProfile[] => {
  return Array.from({ length: count }, (_, index) => {
    const name = index === 0 ? 'Global Tech LLC' : getRandomElement(names);
    const cedula = index === 0 ? 'E-55667788' : getRandomElement(cedulas);
    const huellaSegura = Math.random() > 0.3;
    const ipDesconocida = Math.random() > 0.5;
    const fueraDeGeolocalizacion = Math.random() > 0.8;

    let securityLevel: SecurityLevel;
    let riskScore: number;

    if (fueraDeGeolocalizacion) {
      securityLevel = 'Alto';
      riskScore = Math.floor(Math.random() * 20) + 80;
    } else if (ipDesconocida) {
      if (huellaSegura) {
        securityLevel = 'Medio';
        riskScore = Math.floor(Math.random() * 20) + 50;
      } else {
        securityLevel = 'Alto';
        riskScore = Math.floor(Math.random() * 15) + 75;
      }
    } else {
      if (huellaSegura) {
        securityLevel = 'Seguro';
        riskScore = Math.floor(Math.random() * 15) + 5;
      } else {
        securityLevel = 'Bajo';
        riskScore = Math.floor(Math.random() * 20) + 25;
      }
    }

    const isJuridico = name.toLowerCase().includes('llc') || name.toLowerCase().includes('s.a.') || name.toLowerCase().includes('c.a.') || cedula.startsWith('J');
    const profileType: ProfileType = isJuridico ? 'Jurídico' : (riskScore > 75 ? 'Extranjero' : 'Natural');

    // Generar username basado en nombre
    const nameParts = name.toLowerCase().split(' ');
    const username = index === 0 ? 'g11c' : (nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1]}`.replace(/[^a-z0-9]/g, '')
      : `${nameParts[0]}`.replace(/[^a-z0-9]/g, ''));

    const idFormatted = index === 0 ? 'usr-4' : `usr-${index + 1}`;
    const primaryIp = index === 0 ? '10.0.0.55' : getRandomElement(ips);
    const primaryDevice = Math.random() > 0.5 ? 'Teléfono' : 'Laptop';

    return {
      id: idFormatted,
      name,
      cedula,
      profileType,
      riskScore: index === 0 ? 56 : riskScore,
      lastIp: primaryIp,
      device: primaryDevice as DeviceType,
      huellaSegura,
      ipDesconocida,
      fueraDeGeolocalizacion,
      securityLevel: index === 0 ? 'Medio' : securityLevel,
      // Campos de detalle
      username: username || `user${index + 1}`,
      registrationYear: index === 0 ? '2020' : getRandomElement(years),
      region: index === 0 ? 'Central' : getRandomElement(regions),
      residencia: index === 0 ? 'Caracas, Venezuela' : getRandomElement(residencias),
      geolocation: '10.48, -66.90',
      email: `${username || 'usuario'}@example.com`,
      digitalFingerprintStatus: huellaSegura ? 'Configurada' : 'No Configurada',
      twoFactorAuth: huellaSegura ? 'Activado' : 'Desactivado',
      securityQuestionsCount: '3 Configuradas',
      huellaFaceId: huellaSegura ? 'Configurada' : 'No Configurada',
      twoFactorAuthDetail: 'App Authenticator (Activo)',
      ultimoCambioPass: 'Hace 45 días',
      coordenadas: '10.48, -66.90 (Caracas)',
      dispositivoHabitual: primaryDevice === 'Teléfono' ? 'Móvil (iOS 17.5)' : 'Laptop (macOS Sonoma)',
      sesionActual: 'App Móvil Nativa',
      devicesList: [
        { id: 'dev-1', name: `${primaryDevice} Principal`, type: primaryDevice as DeviceType, lastAccess: 'Hace 10 min', ip: primaryIp, status: 'Activo' },
        { id: 'dev-2', name: primaryDevice === 'Teléfono' ? 'Laptop Oficina' : 'Móvil Personal', type: (primaryDevice === 'Teléfono' ? 'Laptop' : 'Teléfono') as DeviceType, lastAccess: 'Ayer, 18:45', ip: getRandomElement(ips), status: 'Inactivo' },
        { id: 'dev-3', name: 'Tablet Secundaria', type: 'Teléfono', lastAccess: 'Hace 3 días', ip: getRandomElement(ips), status: 'Inactivo' },
        { id: 'dev-4', name: 'PC de Escritorio - Hogar', type: 'Laptop', lastAccess: 'Hace 1 semana', ip: getRandomElement(ips), status: 'Inactivo' },
        { id: 'dev-5', name: 'Móvil de Trabajo', type: 'Teléfono', lastAccess: 'Hace 2 semanas', ip: getRandomElement(ips), status: 'Inactivo' },
        { id: 'dev-6', name: 'Laptop Viajes', type: 'Laptop', lastAccess: 'Hace 1 mes', ip: getRandomElement(ips), status: 'Inactivo' },
        { id: 'dev-7', name: 'Teléfono Antiguo', type: 'Teléfono', lastAccess: 'Hace 2 meses', ip: getRandomElement(ips), status: 'Inactivo' },
        { id: 'dev-8', name: 'Estación de Trabajo', type: 'Laptop', lastAccess: 'Hace 3 meses', ip: getRandomElement(ips), status: 'Inactivo' },
      ],
      allowedIps: [
        { id: 'ip-1', ip: primaryIp, label: 'Red Doméstica / Oficina', addedDate: '15/01/2023', status: 'Permitida' },
        { id: 'ip-2', ip: getRandomElement(ips), label: 'VPN Corporativa', addedDate: '20/06/2023', status: 'Permitida' },
        { id: 'ip-3', ip: getRandomElement(ips), label: 'Sucursal Altamira', addedDate: '10/08/2023', status: 'Permitida' },
        { id: 'ip-4', ip: getRandomElement(ips), label: 'Servidor Staging', addedDate: '01/11/2023', status: 'Permitida' },
        { id: 'ip-5', ip: getRandomElement(ips), label: 'IP Dinámica Residencial', addedDate: '05/02/2024', status: 'Permitida' },
        { id: 'ip-6', ip: getRandomElement(ips), label: 'Acceso Remoto Contabilidad', addedDate: '14/04/2024', status: 'Permitida' },
        { id: 'ip-7', ip: getRandomElement(ips), label: 'IP Bloqueada Sospechosa', addedDate: '19/07/2024', status: 'Bloqueada' },
        { id: 'ip-8', ip: getRandomElement(ips), label: 'Gateway Backup', addedDate: '22/09/2024', status: 'Permitida' },
      ],
      allowedRegions: [
        { id: 'reg-1', country: 'Estados Unidos', city: 'Miami, Florida', startDate: '01/09/2026', endDate: '15/09/2026', reason: 'Notificación de viaje de negocios', autoWhitelistIp: true, status: 'Vigente' },
        { id: 'reg-2', country: 'España', city: 'Madrid', startDate: '20/10/2026', endDate: '05/11/2026', reason: 'Vacaciones familiares programadas', autoWhitelistIp: true, status: 'Programado' },
        { id: 'reg-3', country: 'Colombia', city: 'Bogotá', startDate: '10/05/2026', endDate: '20/05/2026', reason: 'Conferencia técnica internacional', autoWhitelistIp: true, status: 'Vencido' },
        { id: 'reg-4', country: 'Panamá', city: 'Ciudad de Panamá', startDate: '12/02/2026', endDate: '18/02/2026', reason: 'Reunión comercial de sucursal', autoWhitelistIp: true, status: 'Vencido' },
      ],
      auditLogs: [
        { id: 'log-1', date: '01/09/2026 14:30', action: 'Inicio de sesión exitoso', ip: primaryIp, details: 'Autenticación 2FA completada' },
        { id: 'log-2', date: '31/08/2026 09:15', action: 'Cambio de contraseña', ip: primaryIp, details: 'Actualización periódica requerida' },
        { id: 'log-3', date: '28/08/2026 18:02', action: 'Validación de huella', ip: primaryIp, details: 'Dispositivo verificado correctamente' },
        { id: 'log-4', date: '25/08/2026 11:20', action: 'Registro de nueva IP permitida', ip: primaryIp, details: 'IP agregada a lista blanca' },
        { id: 'log-5', date: '20/08/2026 16:45', action: 'Consulta de saldo de cuenta', ip: primaryIp, details: 'Verificación de fondos disponible' },
        { id: 'log-6', date: '15/08/2026 10:10', action: 'Actualización de datos personales', ip: primaryIp, details: 'Dirección de correo confirmada' },
        { id: 'log-7', date: '10/08/2026 08:30', action: 'Cierre de sesión seguro', ip: primaryIp, details: 'Sesión finalizada por el usuario' },
        { id: 'log-8', date: '05/08/2026 19:12', action: 'Intento de acceso bloqueado', ip: getRandomElement(ips), details: 'Intento desde IP desconocida' },
      ],
      kycKybData: {
        razonSocial: name.toUpperCase(),
        estatusListas: 'UNIFICADO: Sin Sanciones / OFAC: Limpio / GAFI: Limpio / Nacional: Limpio',
        actividadCiiu: getRandomElement(ciiuOptions),
        pepStatus: 'No Relacionado / Sin Coincidencias PEP',
        representanteLegal: isJuridico ? 'Néstor Rodríguez - ID Confirmado' : `${name} - ID Confirmado`
      },
      networkIntegrityData: {
        tipoConexion: 'Fija - Residencial',
        asn: getRandomElement(asns),
        vpnProxy: 'No Detectado / Proxy SSL Limpio',
        viajeImposible: 'Velocidad Normal: Caracas -> Maracay',
        trustedDeviceScore: 'Score: 94 - Alto (Confiable)',
        estadoEntorno: 'Nativo / Seguro / No Rooteado / No Emulador'
      }
    };
  });
};

export const profilesData: UserProfile[] = generateProfiles(100);


