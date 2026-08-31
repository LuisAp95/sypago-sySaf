import { create } from 'zustand';
import { authService } from '../services/authService';
import type { AuthUser, LoginCredentials, Permisos } from '../types/auth.types';

// ─── Tipos del store ─────────────────────────────────────────────────────────

interface AuthState {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  permisos: Permisos;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => void;
  logout: () => void;
  clearError: () => void;

  /** Verifica si el usuario tiene un permiso específico en un módulo. */
  hasPermission: (modulo: string, permiso: keyof Permisos[string]) => boolean;

  /** Verifica si el usuario puede ver un módulo. */
  canViewModule: (modulo: string) => boolean;
}

// ─── Store global de autenticación ───────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => {
  // Sincronizar de forma preventiva los usuarios y roles en local storage
  authService.inicializarDatos();

  // Hidratar estado desde localStorage al inicializar
  const session = authService.getSession();

  return {
    isAuthenticated: session !== null,
    currentUser: session?.user ?? null,
    permisos: session?.permisos ?? {},
    isLoading: false,
    error: null,

    login: (credentials: LoginCredentials) => {
      set({ isLoading: true, error: null });

      const result = authService.authenticate(credentials);

      if (result.success && result.user) {
        set({
          isAuthenticated: true,
          currentUser: result.user,
          permisos: result.permisos ?? {},
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isAuthenticated: false,
          currentUser: null,
          permisos: {},
          isLoading: false,
          error: result.error ?? 'Error desconocido al iniciar sesión.',
        });
      }
    },

    logout: () => {
      authService.logout();
      set({
        isAuthenticated: false,
        currentUser: null,
        permisos: {},
        isLoading: false,
        error: null,
      });
    },

    clearError: () => {
      set({ error: null });
    },

    hasPermission: (modulo: string, permiso: string) => {
      const permisos = get().permisos;
      return permisos[modulo]?.[permiso as keyof typeof permisos[typeof modulo]] ?? false;
    },

    canViewModule: (modulo: string) => {
      const permisos = get().permisos;
      return permisos[modulo]?.ver ?? false;
    },
  };
});
