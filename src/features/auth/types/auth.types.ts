// ─── Tipos del módulo de autenticación ──────────────────────────────────────

/**
 * Credenciales de inicio de sesión.
 */
export interface LoginCredentials {
  usuario: string;
  password: string;
}

/**
 * Permisos individuales de un módulo.
 */
export interface PermisoModulo {
  ver: boolean;
  agregar: boolean;
  borrar: boolean;
  imprimir: boolean;
  editar: boolean;
  notificar: boolean;
  solicitar: boolean;
}

/**
 * Mapa de permisos por nombre de módulo.
 */
export type Permisos = Record<string, PermisoModulo>;

/**
 * Usuario autenticado expuesto a la aplicación.
 * Excluye intencionalmente password y teléfono por seguridad.
 */
export interface AuthUser {
  id: string;
  nombre: string;
  usuario: string;
  email: string;
  rol: string;
  rolId: string;
}

/**
 * Sesión persistida en localStorage.
 */
export interface AuthSession {
  user: AuthUser;
  permisos: Permisos;
  loginTimestamp: string;
  sessionId: string;
}

/**
 * Resultado de un intento de autenticación.
 */
export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  permisos?: Permisos;
  error?: string;
}
