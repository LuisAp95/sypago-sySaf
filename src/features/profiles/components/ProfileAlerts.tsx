import React from 'react';
import { Activity, ListTodo } from 'lucide-react';

export const ProfileAlerts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 flex-shrink-0">
      <div className="bg-tertiary p-5 rounded-2xl border border-[#3A393C] shadow-lg">
        <h3 className="text-text-primary font-medium mb-4 flex items-center gap-2">
          Notificaciones de Actividad de Usuario
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-tertiary border border-table-border">
            <div className="text-blue-500">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-sm text-text-secondary">Nueva IP detectada para [User]</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-tertiary border border-table-border">
            <div className="text-red-500">
              <ListTodo className="w-4 h-4" />
            </div>
            <span className="text-sm text-text-secondary">Múltiples fallos de login</span>
          </div>
        </div>
      </div>

      <div className="bg-tertiary p-5 rounded-2xl border border-[#3A393C] shadow-lg">
        <h3 className="text-text-primary font-medium mb-4 flex items-center gap-2">
          Acciones Pendientes de Usuario
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-tertiary border border-table-border">
            <div className="text-yellow-500">
              <ListTodo className="w-4 h-4" />
            </div>
            <span className="text-sm text-text-secondary">Revisión de cuenta [User] (Alto Riesgo)</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-tertiary border border-table-border">
            <div className="text-text-muted">
              <ListTodo className="w-4 h-4" />
            </div>
            <span className="text-sm text-text-secondary">Solicitud de desbloqueo [User]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
