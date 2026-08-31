import db from '@/mocks/db.json';
import { auditService } from '@/features/administration/services/auditService';
import type {
  LoginCredentials,
  AuthUser,
  AuthSession,
  AuthResult,
  Permisos,
} from '../types/auth.types';


const SESSION_STORAGE_KEY = 'sysaf_auth_session';


function generateSessionId(): string {
  return `ses-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

function writeSession(session: AuthSession): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
  }
}

function clearSessionStorage(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * Proyecta un usuario del JSON a un AuthUser seguro (sin password ni teléfono).
 */
function toAuthUser(raw: (typeof db.usuarios)[number]): AuthUser {
  return {
    id: raw.id,
    nombre: raw.nombre,
    usuario: raw.usuario,
    email: raw.email,
    rol: raw.rol,
    rolId: raw.rolId,
  };
}


function resolvePermisos(rolId: string): Permisos {
  try {
    const raw = localStorage.getItem('sysaf_roles');
    if (raw) {
      const roles = JSON.parse(raw) as Array<{ id: string; permisos: Permisos }>;
      const found = roles.find((r) => r.id === rolId);
      if (found?.permisos) return found.permisos;
    }
  } catch {
    // fallback al JSON estático
  }

  // Fallback: leer del JSON estático
  const role = (db as any).roles?.find((r: any) => r.id === rolId);
  return role?.permisos ?? {};
}

// ─── Servicio de autenticación ───────────────────────────────────────────────

export const authService = {

  inicializarDatos(): void {
    try {
      const storedRoles = localStorage.getItem('sysaf_roles');
      if (storedRoles) {
        let roles = JSON.parse(storedRoles) as any[];
        let updated = false;

        const rolesMap = new Map<string, any>(roles.map((r: any) => [r.id, r]));

        db.roles.forEach((dbRol: any) => {
          const storedRol = rolesMap.get(dbRol.id);
          if (storedRol) {
            const dbRolPermsStr = JSON.stringify(dbRol.permisos);
            const storedRolPermsStr = JSON.stringify(storedRol.permisos);

            const hasChanges =
              storedRol.nombre !== dbRol.nombre ||
              storedRol.estado !== dbRol.estado ||
              storedRol.plantilla !== dbRol.plantilla ||
              storedRolPermsStr !== dbRolPermsStr;

            if (hasChanges) {
              storedRol.nombre = dbRol.nombre;
              storedRol.estado = dbRol.estado;
              storedRol.plantilla = dbRol.plantilla;
              storedRol.permisos = dbRol.permisos;
              storedRol.fechaActualizacion = dbRol.fechaActualizacion || new Date().toISOString();
              updated = true;
            }
          } else {
            roles.push(dbRol);
            updated = true;
          }
        });

        if (updated || roles.length === 0) {
          localStorage.setItem('sysaf_roles', JSON.stringify(roles));
        }
      } else {
        localStorage.setItem('sysaf_roles', JSON.stringify(db.roles));
      }

      // 2. Validar y sincronizar usuarios
      const storedUsers = localStorage.getItem('sysaf_usuarios');
      if (storedUsers) {
        let users = JSON.parse(storedUsers);
        const hasPasswords = users.length > 0 && users.every((u: any) => u.password !== undefined);

        if (users.length === 0 || !hasPasswords) {
          localStorage.setItem('sysaf_usuarios', JSON.stringify(db.usuarios));
        } else {
          // Fusionar cambios de db.json en localStorage (para que las modificaciones manuales en desarrollo tomen efecto)
          let updated = false;
          const usersMap = new Map<string, any>(users.map((u: any) => [u.id, u]));

          db.usuarios.forEach((dbUser: any) => {
            const storedUser = usersMap.get(dbUser.id);
            if (storedUser) {
              const hasChanges =
                storedUser.password !== dbUser.password ||
                storedUser.usuario !== dbUser.usuario ||
                storedUser.email !== dbUser.email ||
                storedUser.nombre !== dbUser.nombre ||
                storedUser.estado !== dbUser.estado ||
                storedUser.rolId !== dbUser.rolId ||
                storedUser.rol !== dbUser.rol;

              if (hasChanges) {
                storedUser.password = dbUser.password;
                storedUser.usuario = dbUser.usuario;
                storedUser.email = dbUser.email;
                storedUser.nombre = dbUser.nombre;
                storedUser.estado = dbUser.estado;
                storedUser.rolId = dbUser.rolId;
                storedUser.rol = dbUser.rol;
                storedUser.fechaActualizacion = dbUser.fechaActualizacion || new Date().toISOString();
                updated = true;
              }
            } else {
              users.push(dbUser);
              updated = true;
            }
          });

          if (updated) {
            localStorage.setItem('sysaf_usuarios', JSON.stringify(users));
          }
        }
      } else {
        localStorage.setItem('sysaf_usuarios', JSON.stringify(db.usuarios));
      }
    } catch (e) {
      // ignorar errores de almacenamiento
    }
  },

  authenticate(credentials: LoginCredentials): AuthResult {
    // Sincronizar datos por si local storage contiene datos sin contraseñas
    this.inicializarDatos();

    // Intentar buscar los usuarios de local storage (donde se actualizan/persisten en runtime)
    let activeUsers = db.usuarios;
    try {
      const stored = localStorage.getItem('sysaf_usuarios');
      if (stored) {
        activeUsers = JSON.parse(stored);
      }
    } catch (e) {
      // fallback
    }

    const user = activeUsers.find(
      (u) => u.usuario === credentials.usuario
    );

    if (!user) {
      return {
        success: false,
        error: 'Verifique sus credenciales.',
      };
    }

    if (user.password !== credentials.password) {
      return {
        success: false,
        error: 'Verifique sus credenciales.',
      };
    }

    if (user.estado !== 'Activo') {
      return {
        success: false,
        error: 'Su cuenta se encuentra inactiva. Contacte al administrador.',
      };
    }

    const authUser = toAuthUser(user);
    const permisos = resolvePermisos(authUser.rolId);

    const session: AuthSession = {
      user: authUser,
      permisos,
      loginTimestamp: new Date().toISOString(),
      sessionId: generateSessionId(),
    };

    writeSession(session);

    // Registrar en auditoría
    auditService.logSync({
      module: 'Sesión',
      action: 'LOGIN',
      entityType: 'Sistema',
      entityId: authUser.id,
      entityName: authUser.nombre,
      details: `Inicio de sesión exitoso — Usuario: ${authUser.usuario}, Rol: ${authUser.rol}`,
      severity: 'info',
    });

    return { success: true, user: authUser, permisos };
  },

  /**
   * Cierra la sesión activa y registra en auditoría.
   */
  logout(): void {
    const session = readSession();

    if (session) {
      auditService.logSync({
        module: 'Sesión',
        action: 'LOGOUT',
        entityType: 'Sistema',
        entityId: session.user.id,
        entityName: session.user.nombre,
        details: `Cierre de sesión — Usuario: ${session.user.usuario}`,
        severity: 'info',
      });
    }

    clearSessionStorage();
  },

  /**
   * Obtiene la sesión actual (si existe).
   */
  getSession(): AuthSession | null {
    return readSession();
  },

  /**
   * Verifica si hay una sesión activa.
   */
  isAuthenticated(): boolean {
    return readSession() !== null;
  },

  /**
   * Obtiene el usuario de la sesión activa.
   */
  getCurrentUser(): AuthUser | null {
    const session = readSession();
    return session?.user ?? null;
  },
};
