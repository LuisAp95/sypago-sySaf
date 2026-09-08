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

const firstNames = ['Alejandro', 'Juan', 'María', 'Carlos', 'Pedro', 'Luisa', 'José', 'Ana', 'Luis', 'Carmen', 'Jorge', 'Manuel', 'Rosa', 'Miguel', 'Francisco'];
const lastNames = ['Rodriguez', 'Pérez', 'García', 'Gómez', 'Pascal', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Díaz', 'Torres', 'Ruiz', 'Romero', 'Suárez', 'Mendoza'];

const generateUniqueNames = (count: number): string[] => {
  const namesSet = new Set<string>();
  while (namesSet.size < count) {
    const randomFirst = getRandomElement(firstNames);
    const randomLast = getRandomElement(lastNames);
    namesSet.add(`${randomFirst} ${randomLast}`);
  }
  return Array.from(namesSet);
};

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
  const profilesMap = new Map<string, UserProfile>();
  const uniqueNames = generateUniqueNames(count);
  let iteration = 0;
  
  // Nombres y cédulas base asignados a cada índice para garantizar unicidad
  const assignedNames: string[] = [];
  const assignedCedulas: string[] = [];
  
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      assignedNames.push('Global Tech LLC');
      assignedCedulas.push('J-00000000-1');
    } else {
      assignedNames.push(uniqueNames[i]);
      assignedCedulas.push(`V-${10000000 + i}`);
    }
  }

  // Generamos un total de count * 1.5 iteraciones para simular que algunos se conectan varias veces
  const totalIterations = Math.floor(count * 1.5);

  for (let i = 0; i < totalIterations; i++) {
    // Escogemos un usuario aleatorio de la lista de los `count` posibles, o iteramos secuencialmente
    // Para asegurar que todos los `count` se creen, los primeros `count` iteraciones serán secuenciales.
    const userIndex = i < count ? i : Math.floor(Math.random() * count);
    
    const name = assignedNames[userIndex];
    const cedula = assignedCedulas[userIndex];
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
    const username = userIndex === 0 ? 'g11c' : (nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1]}`.replace(/[^a-z0-9]/g, '')
      : `${nameParts[0]}`.replace(/[^a-z0-9]/g, ''));

    const idFormatted = userIndex === 0 ? 'usr-4' : `usr-${userIndex + 1}`;
    const primaryIp = userIndex === 0 ? '10.0.0.55' : getRandomElement(ips);
    const primaryDevice = Math.random() > 0.5 ? 'Teléfono' : 'Laptop';
    const primaryDeviceType = primaryDevice as DeviceType;

    if (profilesMap.has(cedula)) {
      // Perfil ya existe, agregar el dispositivo a la lista de dispositivos del usuario
      const existingProfile = profilesMap.get(cedula)!;
      
      const newDevice: DeviceInfo = {
        id: `dev-${existingProfile.devicesList.length + 1}-${Date.now()}`,
        name: `${primaryDevice} (Nuevo)`,
        type: primaryDeviceType,
        lastAccess: 'Justo ahora',
        ip: primaryIp,
        status: 'Activo'
      };
      
      existingProfile.devicesList.push(newDevice);
      // Actualizar la última IP y dispositivo si es necesario
      existingProfile.lastIp = primaryIp;
      existingProfile.device = primaryDeviceType;
    } else {
      // Crear nuevo perfil
      const newProfile: UserProfile = {
        id: idFormatted,
        name,
        cedula,
        profileType,
        riskScore: userIndex === 0 ? 56 : riskScore,
        lastIp: primaryIp,
        device: primaryDeviceType,
        huellaSegura,
        ipDesconocida,
        fueraDeGeolocalizacion,
        securityLevel: userIndex === 0 ? 'Medio' : securityLevel,
        username: username || `user${userIndex + 1}`,
        registrationYear: userIndex === 0 ? '2020' : getRandomElement(years),
        region: userIndex === 0 ? 'Central' : getRandomElement(regions),
        residencia: userIndex === 0 ? 'Caracas, Venezuela' : getRandomElement(residencias),
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
          { id: 'dev-1', name: `${primaryDevice} Principal`, type: primaryDeviceType, lastAccess: 'Hace 10 min', ip: primaryIp, status: 'Activo' },
          { id: 'dev-2', name: primaryDevice === 'Teléfono' ? 'Laptop Oficina' : 'Móvil Personal', type: (primaryDevice === 'Teléfono' ? 'Laptop' : 'Teléfono') as DeviceType, lastAccess: 'Ayer, 18:45', ip: getRandomElement(ips), status: 'Inactivo' },
        ],
        allowedIps: [
          { id: 'ip-1', ip: primaryIp, label: 'Red Doméstica / Oficina', addedDate: '15/01/2023', status: 'Permitida' },
          { id: 'ip-2', ip: getRandomElement(ips), label: 'VPN Corporativa', addedDate: '20/06/2023', status: 'Permitida' },
        ],
        allowedRegions: userIndex < 5 ? [
          { 
            id: `reg-${userIndex}`, 
            country: ['Estados Unidos', 'España', 'Francia', 'Japón', 'México'][userIndex], 
            city: ['Miami', 'Madrid', 'París', 'Tokio', 'Ciudad de México'][userIndex], 
            startDate: '01/09/2026', 
            endDate: '15/11/2026', 
            reason: ['Notificación de viaje de negocios', 'Vacaciones Familiares', 'Conferencia de Seguridad', 'Entrenamiento Corporativo', 'Auditoría Regional'][userIndex], 
            autoWhitelistIp: true, 
            status: 'Vigente' 
          }
        ] : [],
        auditLogs: [
          { id: 'log-1', date: '01/09/2026 14:30', action: 'Inicio de sesión exitoso', ip: primaryIp, details: 'Autenticación 2FA completada' },
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
      profilesMap.set(cedula, newProfile);
    }
  }

  return Array.from(profilesMap.values());
};

export const profilesData: UserProfile[] = generateProfiles(100);


