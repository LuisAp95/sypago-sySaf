import { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, LoginView, LogoutNotice } from './features/auth';
import { MainLayout } from './components/layout/MainLayout';
import { Loader } from './components/ui/Loader';

// Vistas
import { DashboardView, VersionsView } from '@/features/dashboard';
import { RulesDefinition, RulesChannel } from '@/features/rules';
import { QuarantineView } from '@/features/quarantine';
import { BlacklistView, RegionView, ProfilesView } from '@/features/filters';
import { ExceptionsDefinition, UserExceptions } from '@/features/exceptions';
import { ReportsView, StatsView } from '@/features/reports';
import { UserRolesView, AuditView } from '@/features/administration';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutos de caché por defecto
    },
  },
});

// ─── Componente Protector de Rutas (Autenticación y Roles RBAC) ─────────────────
interface ProtectedRouteProps {
  children: React.ReactNode;
  moduloPermiso: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, moduloPermiso }) => {
  const { isAuthenticated, canViewModule, logout } = useAuthStore();

  if (!isAuthenticated) {
    // Redirige al login sin guardar la ruta previa para que siempre cargue la vista principal al iniciar sesión
    return <Navigate to="/login" replace />;
  }

  // Verifica si el rol del usuario tiene permiso de ver este módulo
  if (!canViewModule(moduloPermiso)) {
    // Si no tiene acceso al layout base (Vista Principal), forzamos la desautenticación para evitar bucles infinitos de redirección
    if (moduloPermiso === "Vista Principal") {
      logout();
      return <Navigate to="/login" replace />;
    }
    // Si no tiene acceso a una subruta, lo redirige de vuelta a la página principal
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// ─── Componente para Rutas Públicas (Login) ────────────────────────────────────
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    // Redirige siempre a la vista principal (/) al iniciar sesión
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// ─── Transición suave con Loader global tras autenticación exitosa ───────────────
interface AuthTransitionWrapperProps {
  children: React.ReactNode;
}

const AuthTransitionWrapper: React.FC<AuthTransitionWrapperProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const wasAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
    // Si el estado cambia de no autenticado a autenticado (login exitoso)
    if (isAuthenticated && !wasAuthenticated.current) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1200);
      wasAuthenticated.current = true;
      return () => clearTimeout(timer);
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  if (isTransitioning) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-primary">
        <Loader size="lg" text="Cargando sistema…" />
      </div>
    );
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Ruta Pública (Login) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginView />
          </PublicRoute>
        }
      />

      {/* Rutas Privadas (dentro de MainLayout con Outlet) */}
      <Route
        path="/"
        element={
          <ProtectedRoute moduloPermiso="Vista Principal">
            <AuthTransitionWrapper>
              <MainLayout />
            </AuthTransitionWrapper>
          </ProtectedRoute>
        }
      >
        {/* Subrutas hijas */}
        <Route index element={<DashboardView />} />
        
        <Route
          path="versiones"
          element={
            <ProtectedRoute moduloPermiso="Versiones">
              <VersionsView />
            </ProtectedRoute>
          }
        />
        <Route
          path="reportes"
          element={
            <ProtectedRoute moduloPermiso="Reportes">
              <ReportsView />
            </ProtectedRoute>
          }
        />
        <Route
          path="cuarentena"
          element={
            <ProtectedRoute moduloPermiso="Cuarentena">
              <QuarantineView />
            </ProtectedRoute>
          }
        />
        <Route
          path="estadisticas"
          element={
            <ProtectedRoute moduloPermiso="Estadísticas">
              <StatsView />
            </ProtectedRoute>
          }
        />
        <Route
          path="lista-negra"
          element={
            <ProtectedRoute moduloPermiso="Lista Negra">
              <BlacklistView />
            </ProtectedRoute>
          }
        />
        <Route
          path="region"
          element={
            <ProtectedRoute moduloPermiso="Región">
              <RegionView />
            </ProtectedRoute>
          }
        />
        <Route
          path="perfiles"
          element={
            <ProtectedRoute moduloPermiso="Perfiles">
              <ProfilesView />
            </ProtectedRoute>
          }
        />
        <Route
          path="definicion-reglas"
          element={
            <ProtectedRoute moduloPermiso="Definición de Reglas">
              <RulesDefinition />
            </ProtectedRoute>
          }
        />
        <Route
          path="reglas-canal"
          element={
            <ProtectedRoute moduloPermiso="Reglas por Canal">
              <RulesChannel />
            </ProtectedRoute>
          }
        />
        <Route
          path="definicion-excepciones"
          element={
            <ProtectedRoute moduloPermiso="Definición de Excepciones">
              <ExceptionsDefinition />
            </ProtectedRoute>
          }
        />
        <Route
          path="excepciones-usuario"
          element={
            <ProtectedRoute moduloPermiso="Excepciones por Usuario">
              <UserExceptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="usuarios-roles"
          element={
            <ProtectedRoute moduloPermiso="Usuarios / Roles">
              <UserRolesView />
            </ProtectedRoute>
          }
        />
        <Route
          path="auditoria"
          element={
            <ProtectedRoute moduloPermiso="Auditoría">
              <AuditView />
            </ProtectedRoute>
          }
        />
        <Route path="logout" element={<LogoutNotice />} />
      </Route>

      {/* Redirección por defecto para cualquier ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
