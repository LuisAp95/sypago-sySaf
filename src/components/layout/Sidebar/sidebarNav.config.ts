import {
  LayoutGrid,
  History,
  FileText,
  XCircle,
  TrendingUp,
  Ban,
  Globe,
  Smartphone,
  Sliders,
  ArrowRightLeft,
  ShieldCheck,
  UserCheck,
  Users,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  feature: string;
  /** Nombre del módulo de permisos al que corresponde este item. */
  moduloPermiso: string;
  /** Ruta URL real de este módulo. */
  path: string;
  badge?: string;
  isDanger?: boolean;
}

export interface SidebarNavGroup {
  sectionTitle?: string;
  items: SidebarNavItem[];
}

export const sidebarNavConfig: SidebarNavGroup[] = [
  {
    items: [
      {
        id: 'vista-principal',
        label: 'Vista Principal',
        icon: LayoutGrid,
        feature: 'dashboard',
        moduloPermiso: 'Vista Principal',
        path: '/',
      },
      {
        id: 'versiones',
        label: 'Versiones',
        icon: History,
        feature: 'dashboard',
        moduloPermiso: 'Versiones',
        path: '/versiones',
      },
    ],
  },
  {
    sectionTitle: 'GENERAL',
    items: [
      {
        id: 'reportes',
        label: 'Reportes',
        icon: FileText,
        feature: 'reports',
        moduloPermiso: 'Reportes',
        path: '/reportes',
      },
      {
        id: 'cuarentena',
        label: 'Cuarentena',
        icon: XCircle,
        feature: 'quarantine',
        moduloPermiso: 'Cuarentena',
        path: '/cuarentena',
      },
      {
        id: 'estadisticas',
        label: 'Estadísticas',
        icon: TrendingUp,
        feature: 'reports',
        moduloPermiso: 'Estadísticas',
        path: '/estadisticas',
        badge: 'Proximamente',
      },
    ],
  },
  {
    sectionTitle: 'FILTROS',
    items: [
      {
        id: 'lista-negra',
        label: 'Lista Negra',
        icon: Ban,
        feature: 'filters',
        moduloPermiso: 'Lista Negra',
        path: '/lista-negra',
      },
      {
        id: 'region',
        label: 'Región',
        icon: Globe,
        feature: 'filters',
        moduloPermiso: 'Región',
        path: '/region',
        badge: 'Proximamente',
      },
      {
        id: 'perfiles',
        label: 'Perfiles',
        icon: Smartphone,
        feature: 'filters',
        moduloPermiso: 'Perfiles',
        path: '/perfiles',
        badge: 'Proximamente',
      },
    ],
  },
  {
    sectionTitle: 'CANALES',
    items: [
      {
        id: 'definicion-reglas',
        label: 'Definición de Reglas',
        icon: Sliders,
        feature: 'rules',
        moduloPermiso: 'Definición de Reglas',
        path: '/definicion-reglas',
      },
      {
        id: 'reglas-canal',
        label: 'Reglas por Canal',
        icon: ArrowRightLeft,
        feature: 'rules',
        moduloPermiso: 'Reglas por Canal',
        path: '/reglas-canal',
      },
    ],
  },
  {
    sectionTitle: 'USUARIOS',
    items: [
      {
        id: 'definicion-excepciones',
        label: 'Definición de Excepciones',
        icon: ShieldCheck,
        feature: 'exceptions',
        moduloPermiso: 'Definición de Excepciones',
        path: '/definicion-excepciones',
      },
      {
        id: 'excepciones-usuario',
        label: 'Excepciones por Usuario',
        icon: UserCheck,
        feature: 'exceptions',
        moduloPermiso: 'Excepciones por Usuario',
        path: '/excepciones-usuario',
      },
    ],
  },
  {
    sectionTitle: 'ADMINISTRACIÓN',
    items: [
      {
        id: 'usuarios-roles',
        label: 'Usuarios / Roles',
        icon: Users,
        feature: 'administration',
        moduloPermiso: 'Usuarios / Roles',
        path: '/usuarios-roles',
      },
      {
        id: 'auditoria',
        label: 'Auditoría',
        icon: ScrollText,
        feature: 'administration',
        moduloPermiso: 'Auditoría',
        path: '/auditoria',
      },
    ],
  },
];
