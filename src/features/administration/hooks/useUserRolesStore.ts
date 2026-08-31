import { useState, useEffect, useCallback } from 'react';
import { auditService } from '../services/auditService';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type PermisoModulo = {
  ver: boolean;
  agregar: boolean;
  borrar: boolean;
  imprimir: boolean;
  editar: boolean;
  notificar: boolean;
  solicitar: boolean;
};

export type Permisos = Record<string, PermisoModulo>;

export interface Rol {
  id: string;
  nombre: string;
  estado: 'Activo' | 'Inactivo';
  plantilla: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  permisos: Permisos;
}

export interface Usuario {
  id: string;
  nombre: string;
  usuario: string;
  email: string;
  estado: 'Activo' | 'Inactivo';
  rol: string;
  rolId: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  ROLES: 'sysaf_roles',
  USUARIOS: 'sysaf_usuarios',
} as const;

export const MODULOS_SISTEMA = [
  'Vista Principal',
  'Versiones',
  'Reportes',
  'Cuarentena',
  'Estadísticas',
  'Lista Negra',
  'Región',
  'Perfiles',
  'Definición de Reglas',
  'Reglas por Canal',
  'Definición de Excepciones',
  'Excepciones por Usuario',
  'Usuarios / Roles',
  'Auditoría',
] as const;

export const PERMISOS_DEFAULT: PermisoModulo = {
  ver: false,
  agregar: false,
  borrar: false,
  imprimir: false,
  editar: false,
  notificar: false,
  solicitar: false,
};

export const buildDefaultPermisos = (): Permisos =>
  Object.fromEntries(MODULOS_SISTEMA.map((m) => [m, { ...PERMISOS_DEFAULT }]));

export interface PlantillaDefinicion {
  id: string;
  nombre: string;
  descripcion: string;
  getPermisos: () => Permisos;
}

export const PLANTILLAS_PREDEFINIDAS: PlantillaDefinicion[] = [
  {
    id: 'admin',
    nombre: 'Administrador',
    descripcion: 'Acceso total a todos los módulos y acciones del sistema',
    getPermisos: () =>
      Object.fromEntries(
        MODULOS_SISTEMA.map((m) => [
          m,
          {
            ver: true,
            agregar: true,
            borrar: true,
            imprimir: true,
            editar: true,
            notificar: true,
            solicitar: true,
          },
        ])
      ),
  },
  {
    id: 'auditor',
    nombre: 'Auditoría',
    descripcion: 'Permisos de consulta e impresión en todas las vistas',
    getPermisos: () =>
      Object.fromEntries(
        MODULOS_SISTEMA.map((m) => [
          m,
          {
            ver: true,
            agregar: false,
            borrar: false,
            imprimir: true,
            editar: false,
            notificar: false,
            solicitar: false,
          },
        ])
      ),
  },
  {
    id: 'operador_reglas',
    nombre: 'Operador de Reglas',
    descripcion: 'Gestión de reglas, canales, lista negra y excepciones',
    getPermisos: () => {
      const p = buildDefaultPermisos();
      const modulosOperativos = [
        'Definición de Reglas',
        'Reglas por Canal',
        'Definición de Excepciones',
        'Excepciones por Usuario',
        'Lista Negra',
        'Región',
        'Perfiles',
        'Cuarentena',
      ];
      MODULOS_SISTEMA.forEach((m) => {
        if (modulosOperativos.includes(m)) {
          p[m] = {
            ver: true,
            agregar: true,
            borrar: false,
            imprimir: true,
            editar: true,
            notificar: true,
            solicitar: true,
          };
        } else {
          p[m] = { ...PERMISOS_DEFAULT, ver: true, imprimir: true };
        }
      });
      return p;
    },
  },
  {
    id: 'analista_cuarentena',
    nombre: 'Analista de Cuarentena y Reportes',
    descripcion: 'Gestión de operaciones en cuarentena y generación de reportes',
    getPermisos: () => {
      const p = buildDefaultPermisos();
      const modulosAnalisis = ['Cuarentena', 'Reportes', 'Estadísticas'];
      MODULOS_SISTEMA.forEach((m) => {
        if (modulosAnalisis.includes(m)) {
          p[m] = {
            ver: true,
            agregar: true,
            borrar: false,
            imprimir: true,
            editar: true,
            notificar: true,
            solicitar: true,
          };
        } else {
          p[m] = { ...PERMISOS_DEFAULT, ver: true, imprimir: true };
        }
      });
      return p;
    },
  },
  {
    id: 'solo_lectura',
    nombre: 'Solo Lectura',
    descripcion: 'Únicamente visualización en todas las vistas',
    getPermisos: () =>
      Object.fromEntries(
        MODULOS_SISTEMA.map((m) => [
          m,
          {
            ver: true,
            agregar: false,
            borrar: false,
            imprimir: false,
            editar: false,
            notificar: false,
            solicitar: false,
          },
        ])
      ),
  },
  {
    id: 'limpio',
    nombre: 'Personalizado / Ninguna',
    descripcion: 'Sin permisos iniciales asignados',
    getPermisos: () => buildDefaultPermisos(),
  },
];

// ─── Helpers localStorage ─────────────────────────────────────────────────────

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded – silently ignore
  }
}

export function nowTimestamp(): string {
  const d = new Date();
  const pad = (n: number, l = 2) => String(n).padStart(l, '0');
  return (
    `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, '0')}`
  );
}

// ─── Hook: Roles ──────────────────────────────────────────────────────────────

export function useRolesStore(initialData: Rol[] = []) {
  const [roles, setRoles] = useState<Rol[]>(() =>
    readStorage<Rol[]>(STORAGE_KEYS.ROLES, [])
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!hydrated && initialData.length > 0) {
      const stored = readStorage<Rol[]>(STORAGE_KEYS.ROLES, []);
      
      // Si no hay roles guardados O si los roles guardados tienen todos los permisos en false
      // (lo cual ocurre por el seed viejo que ponía todos los permisos en false por defecto)
      const hasAnyPermissionActive = stored.some(rol => 
        Object.values(rol.permisos || {}).some(perm => perm.ver)
      );

      if (stored.length === 0 || !hasAnyPermissionActive) {
        setRoles(initialData);
        writeStorage(STORAGE_KEYS.ROLES, initialData);
      }
      setHydrated(true);
    }
  }, [initialData, hydrated]);

  const persist = useCallback((next: Rol[]) => {
    setRoles(next);
    writeStorage(STORAGE_KEYS.ROLES, next);
  }, []);

  const addRol = useCallback(
    (data: Omit<Rol, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
      const now = nowTimestamp();
      const newRol: Rol = {
        ...data,
        id: `role-${Date.now()}`,
        fechaCreacion: now,
        fechaActualizacion: now,
        permisos: data.permisos ?? buildDefaultPermisos(),
      };
      persist([...roles, newRol]);
      auditService.logSync({
        module: 'Roles',
        action: 'CREATE',
        entityType: 'Rol',
        entityId: newRol.id,
        entityName: newRol.nombre,
        details: `Rol "${newRol.nombre}" creado con estado ${newRol.estado}`,
        newValue: newRol,
      });
      return newRol;
    },
    [roles, persist]
  );

  const updateRol = useCallback(
    (id: string, patch: Partial<Omit<Rol, 'id' | 'fechaCreacion'>>) => {
      const previous = roles.find((r) => r.id === id);
      const now = nowTimestamp();
      const next = roles.map((r) =>
        r.id === id ? { ...r, ...patch, fechaActualizacion: now } : r
      );
      persist(next);
      const updated = next.find((r) => r.id === id);
      auditService.logSync({
        module: 'Roles',
        action: 'UPDATE',
        entityType: 'Rol',
        entityId: id,
        entityName: updated?.nombre || previous?.nombre || id,
        details: `Rol "${updated?.nombre}" actualizado`,
        previousValue: previous,
        newValue: updated,
      });
    },
    [roles, persist]
  );

  const deleteRol = useCallback(
    (id: string) => {
      const deleted = roles.find((r) => r.id === id);
      persist(roles.filter((r) => r.id !== id));
      if (deleted) {
        auditService.logSync({
          module: 'Roles',
          action: 'DELETE',
          entityType: 'Rol',
          entityId: id,
          entityName: deleted.nombre,
          details: `Rol "${deleted.nombre}" eliminado del sistema`,
          previousValue: deleted,
        });
      }
    },
    [roles, persist]
  );

  return { roles, addRol, updateRol, deleteRol };
}

// ─── Hook: Usuarios ───────────────────────────────────────────────────────────

export function useUsuariosStore(initialData: Usuario[] = []) {
  const [usuarios, setUsuarios] = useState<Usuario[]>(() =>
    readStorage<Usuario[]>(STORAGE_KEYS.USUARIOS, [])
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!hydrated && initialData.length > 0) {
      const stored = readStorage<any[]>(STORAGE_KEYS.USUARIOS, []);
      
      // Si no hay usuarios guardados O si los usuarios guardados no tienen password definido
      // (lo cual ocurre por ejecuciones viejas que no tenían la clave password)
      const hasPasswords = stored.length > 0 && stored.every(u => u.password !== undefined);

      if (stored.length === 0 || !hasPasswords) {
        setUsuarios(initialData);
        writeStorage(STORAGE_KEYS.USUARIOS, initialData);
      }
      setHydrated(true);
    }
  }, [initialData, hydrated]);

  const persist = useCallback((next: Usuario[]) => {
    setUsuarios(next);
    writeStorage(STORAGE_KEYS.USUARIOS, next);
  }, []);

  const addUsuario = useCallback(
    (data: Omit<Usuario, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
      const now = nowTimestamp();
      const newUser: Usuario = {
        ...data,
        id: `usr-${Date.now()}`,
        fechaCreacion: now,
        fechaActualizacion: now,
      };
      persist([...usuarios, newUser]);
      auditService.logSync({
        module: 'Usuarios',
        action: 'CREATE',
        entityType: 'Usuario',
        entityId: newUser.id,
        entityName: newUser.nombre,
        details: `Usuario "${newUser.nombre}" creado con rol "${newUser.rol}"`,
        newValue: newUser,
      });
      return newUser;
    },
    [usuarios, persist]
  );

  const updateUsuario = useCallback(
    (id: string, patch: Partial<Omit<Usuario, 'id' | 'fechaCreacion'>>) => {
      const previous = usuarios.find((u) => u.id === id);
      const now = nowTimestamp();
      const next = usuarios.map((u) =>
        u.id === id ? { ...u, ...patch, fechaActualizacion: now } : u
      );
      persist(next);
      const updated = next.find((u) => u.id === id);
      auditService.logSync({
        module: 'Usuarios',
        action: 'UPDATE',
        entityType: 'Usuario',
        entityId: id,
        entityName: updated?.nombre || previous?.nombre || id,
        details: `Usuario "${updated?.nombre}" actualizado`,
        previousValue: previous,
        newValue: updated,
      });
    },
    [usuarios, persist]
  );

  const deleteUsuario = useCallback(
    (id: string) => {
      const deleted = usuarios.find((u) => u.id === id);
      persist(usuarios.filter((u) => u.id !== id));
      if (deleted) {
        auditService.logSync({
          module: 'Usuarios',
          action: 'DELETE',
          entityType: 'Usuario',
          entityId: id,
          entityName: deleted.nombre,
          details: `Usuario "${deleted.nombre}" eliminado del sistema`,
          previousValue: deleted,
        });
      }
    },
    [usuarios, persist]
  );

  return { usuarios, addUsuario, updateUsuario, deleteUsuario };
}
