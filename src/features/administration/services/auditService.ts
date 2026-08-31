import type {
  AuditEntry,
  AuditLogPayload,
  AuditFilters,
  AuditStats,
  AuditSeverity,
  AuditModule,
  AuditAction,
} from '../types/audit.types';

// ─── Constantes ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'sysaf_audit_log';
const SESSION_KEY = 'sysaf_audit_session';
const IP_CACHE_KEY = 'sysaf_audit_ip';
const MAX_ENTRIES = 5000;

// ─── Helpers privados ────────────────────────────────────────────────────────

function generateId(): string {
  return `aud-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = `ses-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

function formatTimestamp(): string {
  return new Date().toISOString();
}

function safeStringify(value: unknown): string {
  if (value === undefined || value === null) return '';
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function readEntries(): AuditEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuditEntry[]) : [];
  } catch {
    return [];
  }
}

function writeEntries(entries: AuditEntry[]): void {
  try {
    // Mantener solo los últimos MAX_ENTRIES registros
    const trimmed = entries.length > MAX_ENTRIES ? entries.slice(-MAX_ENTRIES) : entries;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // quota exceeded – silently ignore
  }
}

// ─── Resolución de IP del cliente ────────────────────────────────────────────

let cachedIp: string | null = null;

async function resolveClientIp(): Promise<string> {
  if (cachedIp) return cachedIp;

  // Intentar leer del cache de sesión
  const cached = sessionStorage.getItem(IP_CACHE_KEY);
  if (cached) {
    cachedIp = cached;
    return cached;
  }

  try {
    const res = await fetch('https://api.ipify.org?format=json', {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    cachedIp = data.ip || '127.0.0.1';
  } catch {
    cachedIp = '127.0.0.1';
  }

  sessionStorage.setItem(IP_CACHE_KEY, cachedIp!);
  return cachedIp!;
}

// Pre-fetch IP al cargar el módulo
resolveClientIp();

// ─── Determinación del usuario activo ────────────────────────────────────────

function getActiveUser(): { id: string; name: string } {
  try {
    // Primero intentar leer del store de autenticación
    const authRaw = localStorage.getItem('sysaf_auth_session');
    if (authRaw) {
      const session = JSON.parse(authRaw);
      if (session?.user?.id && session?.user?.nombre) {
        return { id: session.user.id, name: session.user.nombre };
      }
    }
  } catch {
    // fallback
  }

  try {
    const raw = localStorage.getItem('sysaf_usuarios');
    if (raw) {
      const usuarios = JSON.parse(raw);
      const active = usuarios.find(
        (u: any) => u.estado === 'Activo'
      );
      if (active) {
        return { id: active.id, name: active.nombre };
      }
    }
  } catch {
    // fallback
  }
  return { id: 'admin', name: 'Administrador' };
}

// ─── Determinar severidad automática ─────────────────────────────────────────

function inferSeverity(action: AuditAction): AuditSeverity {
  switch (action) {
    case 'DELETE':
    case 'REJECT':
      return 'critical';
    case 'UPDATE':
    case 'DEACTIVATE':
      return 'warning';
    default:
      return 'info';
  }
}

// ─── Servicio público ────────────────────────────────────────────────────────

export const auditService = {
  /**
   * Registra un evento de auditoría de forma asíncrona.
   * Resuelve la IP del cliente y persiste el registro en localStorage.
   */
  async log(payload: AuditLogPayload): Promise<AuditEntry> {
    const user = getActiveUser();
    const ip = await resolveClientIp();
    const sessionId = generateSessionId();

    const entry: AuditEntry = {
      id: generateId(),
      timestamp: formatTimestamp(),
      userId: user.id,
      userName: user.name,
      userIp: ip,
      userAgent: navigator.userAgent,
      module: payload.module,
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      entityName: payload.entityName,
      details: payload.details,
      previousValue: payload.previousValue !== undefined
        ? safeStringify(payload.previousValue)
        : undefined,
      newValue: payload.newValue !== undefined
        ? safeStringify(payload.newValue)
        : undefined,
      severity: payload.severity ?? inferSeverity(payload.action),
      sessionId,
    };

    const entries = readEntries();
    entries.push(entry);
    writeEntries(entries);

    return entry;
  },

  /**
   * Registra un evento de forma síncrona (usa IP cacheada).
   * Preferir `log()` cuando sea posible.
   */
  logSync(payload: AuditLogPayload): AuditEntry {
    const user = getActiveUser();
    const sessionId = generateSessionId();

    const entry: AuditEntry = {
      id: generateId(),
      timestamp: formatTimestamp(),
      userId: user.id,
      userName: user.name,
      userIp: cachedIp || '127.0.0.1',
      userAgent: navigator.userAgent,
      module: payload.module,
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      entityName: payload.entityName,
      details: payload.details,
      previousValue: payload.previousValue !== undefined
        ? safeStringify(payload.previousValue)
        : undefined,
      newValue: payload.newValue !== undefined
        ? safeStringify(payload.newValue)
        : undefined,
      severity: payload.severity ?? inferSeverity(payload.action),
      sessionId,
    };

    const entries = readEntries();
    entries.push(entry);
    writeEntries(entries);

    return entry;
  },

  /**
   * Devuelve todos los registros ordenados del más reciente al más antiguo.
   */
  getEntries(): AuditEntry[] {
    return readEntries().reverse();
  },

  /**
   * Devuelve registros filtrados según los criterios proporcionados.
   */
  getFilteredEntries(filters: AuditFilters): AuditEntry[] {
    let entries = this.getEntries();

    if (filters.module && filters.module !== 'todos') {
      entries = entries.filter((e) => e.module === filters.module);
    }

    if (filters.action && filters.action !== 'todos') {
      entries = entries.filter((e) => e.action === filters.action);
    }

    if (filters.severity && filters.severity !== 'todos') {
      entries = entries.filter((e) => e.severity === filters.severity);
    }

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom).getTime();
      entries = entries.filter((e) => new Date(e.timestamp).getTime() >= from);
    }

    if (filters.dateTo) {
      const to = new Date(filters.dateTo).getTime() + 86400000; // incluir todo el día
      entries = entries.filter((e) => new Date(e.timestamp).getTime() <= to);
    }

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.userName.toLowerCase().includes(q) ||
          e.module.toLowerCase().includes(q) ||
          e.entityName.toLowerCase().includes(q) ||
          e.entityType.toLowerCase().includes(q) ||
          e.details.toLowerCase().includes(q) ||
          e.userIp.includes(q) ||
          e.entityId.toLowerCase().includes(q)
      );
    }

    return entries;
  },

  /**
   * Calcula estadísticas de los registros de auditoría.
   */
  getStats(): AuditStats {
    const entries = readEntries();
    const stats: AuditStats = {
      total: entries.length,
      bySeverity: { info: 0, warning: 0, critical: 0 },
      byModule: {},
      byAction: {},
    };

    for (const entry of entries) {
      stats.bySeverity[entry.severity]++;
      stats.byModule[entry.module as AuditModule] =
        (stats.byModule[entry.module as AuditModule] || 0) + 1;
      stats.byAction[entry.action as AuditAction] =
        (stats.byAction[entry.action as AuditAction] || 0) + 1;
    }

    return stats;
  },

  /**
   * Exporta los registros filtrados como CSV y descarga el archivo.
   */
  exportToCsv(filters: AuditFilters): void {
    const entries = this.getFilteredEntries(filters);

    const headers = [
      'ID',
      'Fecha/Hora',
      'Usuario',
      'IP',
      'User Agent',
      'Módulo',
      'Acción',
      'Tipo Entidad',
      'ID Entidad',
      'Nombre Entidad',
      'Detalles',
      'Severidad',
      'Session ID',
    ];

    const escapeField = (val: string) => {
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const rows = entries.map((e) =>
      [
        e.id,
        e.timestamp,
        e.userName,
        e.userIp,
        e.userAgent,
        e.module,
        e.action,
        e.entityType,
        e.entityId,
        e.entityName,
        e.details,
        e.severity,
        e.sessionId,
      ]
        .map(escapeField)
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_sysaf_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Genera datos semilla para demostración.
   * Solo se ejecuta si no hay registros previos.
   */
  seed(): void {
    const entries = readEntries();
    if (entries.length > 0) return;

    const seedData: AuditLogPayload[] = [
      {
        module: 'Sesión',
        action: 'LOGIN',
        entityType: 'Sistema',
        entityId: 'system',
        entityName: 'SySAF',
        details: 'Inicio de sesión exitoso en el sistema',
        severity: 'info',
      },
      {
        module: 'Roles',
        action: 'CREATE',
        entityType: 'Rol',
        entityId: 'role-seed-1',
        entityName: 'Analista de Fraude',
        details: 'Rol creado con permisos de visualización en todos los módulos',
        severity: 'info',
      },
      {
        module: 'Usuarios',
        action: 'CREATE',
        entityType: 'Usuario',
        entityId: 'usr-seed-1',
        entityName: 'Juan Pérez',
        details: 'Usuario creado con rol "Analista de Fraude"',
        severity: 'info',
      },
      {
        module: 'Reglas',
        action: 'UPDATE',
        entityType: 'Regla',
        entityId: 'rule-seed-1',
        entityName: '001 Entre semana App - N',
        details: 'Modificados límites de operaciones por minuto de 4 a 8',
        previousValue: { opsPerMinute: 4 },
        newValue: { opsPerMinute: 8 },
        severity: 'warning',
      },
      {
        module: 'Cuarentena',
        action: 'APPROVE',
        entityType: 'Operación',
        entityId: 'q-seed-1',
        entityName: 'TXN-2026081801',
        details: 'Operación aprobada manualmente por el administrador',
        severity: 'info',
      },
      {
        module: 'Cuarentena',
        action: 'REJECT',
        entityType: 'Operación',
        entityId: 'q-seed-2',
        entityName: 'TXN-2026081802',
        details: 'Operación rechazada - actividad sospechosa detectada',
        severity: 'critical',
      },
      {
        module: 'Lista Negra',
        action: 'ACTIVATE',
        entityType: 'Entrada',
        entityId: 'bl-seed-1',
        entityName: 'IP 192.168.1.100',
        details: 'Entrada activada en lista negra por múltiples intentos fallidos',
        severity: 'warning',
      },
      {
        module: 'Excepciones',
        action: 'CREATE',
        entityType: 'Excepción',
        entityId: 'exc-seed-1',
        entityName: '001 Horario especial 5/12',
        details: 'Excepción creada para horario especial de diciembre',
        severity: 'info',
      },
      {
        module: 'Roles',
        action: 'UPDATE',
        entityType: 'Rol',
        entityId: 'role-seed-2',
        entityName: 'Supervisor',
        details: 'Permisos actualizados: agregado acceso a módulo Reportes',
        previousValue: { reportes: { ver: false } },
        newValue: { reportes: { ver: true } },
        severity: 'warning',
      },
      {
        module: 'Usuarios',
        action: 'DELETE',
        entityType: 'Usuario',
        entityId: 'usr-seed-2',
        entityName: 'María López',
        details: 'Usuario eliminado del sistema por solicitud del supervisor',
        severity: 'critical',
      },
    ];

    for (const payload of seedData) {
      this.logSync(payload);
    }
  },
};
