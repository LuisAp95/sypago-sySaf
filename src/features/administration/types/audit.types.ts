// ─── Enums y Constantes ──────────────────────────────────────────────────────

export const AUDIT_ACTIONS = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'ACTIVATE',
  'DEACTIVATE',
  'APPROVE',
  'REJECT',
  'LOGIN',
  'LOGOUT',
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: 'Crear',
  UPDATE: 'Actualizar',
  DELETE: 'Eliminar',
  ACTIVATE: 'Activar',
  DEACTIVATE: 'Desactivar',
  APPROVE: 'Aprobar',
  REJECT: 'Rechazar',
  LOGIN: 'Inicio de sesión',
  LOGOUT: 'Cierre de sesión',
};

export const AUDIT_MODULES = [
  'Roles',
  'Usuarios',
  'Reglas',
  'Excepciones',
  'Excepciones Usuario',
  'Cuarentena',
  'Lista Negra',
  'Reglas Canal',
  'Sesión',
] as const;

export type AuditModule = (typeof AUDIT_MODULES)[number];

export type AuditSeverity = 'info' | 'warning' | 'critical';

export const AUDIT_SEVERITY_LABELS: Record<AuditSeverity, string> = {
  info: 'Info',
  warning: 'Advertencia',
  critical: 'Crítico',
};

// ─── Registro de Auditoría ───────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userIp: string;
  userAgent: string;
  module: AuditModule;
  action: AuditAction;
  entityType: string;
  entityId: string;
  entityName: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  severity: AuditSeverity;
  sessionId: string;
}

// ─── Filtros ─────────────────────────────────────────────────────────────────

export interface AuditFilters {
  module: string;
  action: string;
  severity: string;
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
}

export const EMPTY_FILTERS: AuditFilters = {
  module: 'todos',
  action: 'todos',
  severity: 'todos',
  searchQuery: '',
  dateFrom: '',
  dateTo: '',
};

// ─── Payload para registrar un evento ────────────────────────────────────────

export interface AuditLogPayload {
  module: AuditModule;
  action: AuditAction;
  entityType: string;
  entityId: string;
  entityName: string;
  details: string;
  previousValue?: unknown;
  newValue?: unknown;
  severity?: AuditSeverity;
}

// ─── Estadísticas ────────────────────────────────────────────────────────────

export interface AuditStats {
  total: number;
  bySeverity: Record<AuditSeverity, number>;
  byModule: Partial<Record<AuditModule, number>>;
  byAction: Partial<Record<AuditAction, number>>;
}
