import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/mocks/api';
import { ViewHeader } from '@/components/ui/ViewHeader';
import { Badge } from '@/components/ui/Badge';
import { DataGrid, type ColumnDef } from '@/components/ui/DataGrid';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  useRolesStore,
  useUsuariosStore,
  type Rol,
  type Usuario,
} from '../hooks/useUserRolesStore';
import { RolModal } from './RolModal';
import { UsuarioModal } from './UsuarioModal';

// ─── Tipos de vista ───────────────────────────────────────────────────────────

type ActiveView = 'usuarios' | 'roles';

// ─── Toggle Vista ─────────────────────────────────────────────────────────────

const ViewToggle: React.FC<{
  value: ActiveView;
  onChange: (v: ActiveView) => void;
}> = ({ value, onChange }) => (
  <div
    className="relative flex items-center bg-[#2A292A] border border-[#3A393C] rounded-full p-0.5 w-fit"
    role="tablist"
    aria-label="Cambiar vista"
  >
    {/* Indicador deslizante */}
    <div
      className={cn(
        'absolute top-0.5 bottom-0.5 rounded-full bg-[#162B4D] border border-[#1f3d6e] transition-all duration-300',
        value === 'usuarios' ? 'left-0.5 right-[calc(50%+0.25rem)]' : 'left-[calc(50%+0.25rem)] right-0.5'
      )}
    />
    <button
      role="tab"
      aria-selected={value === 'usuarios'}
      onClick={() => onChange('usuarios')}
      className={cn(
        'relative z-10 px-5 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer focus:outline-none',
        value === 'usuarios' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
      )}
    >
      Usuarios
    </button>
    <button
      role="tab"
      aria-selected={value === 'roles'}
      onClick={() => onChange('roles')}
      className={cn(
        'relative z-10 px-5 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer focus:outline-none',
        value === 'roles' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
      )}
    >
      Roles
    </button>
  </div>
);

// ─── Footer contador ──────────────────────────────────────────────────────────

const CountFooter: React.FC<{ count: number; label: string }> = ({ count, label }) => (
  <div className="mt-3 flex justify-end">
    <span className="text-xs text-gray-400 bg-[#2A292A] border border-[#3A393C] px-3 py-1.5 rounded-lg">
      {count} {label} encontrado{count !== 1 ? 's' : ''}
    </span>
  </div>
);

// ─── Botones de acción en fila ────────────────────────────────────────────────

const RowActions: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
}> = ({ onEdit, onDelete }) => (
  <div className="flex items-center gap-1">
    <Button
      variant="ghost"
      size="icon"
      className="w-7 h-7 rounded-lg hover:bg-[#2A3F6B]/40 hover:text-blue-400 text-gray-400 transition-all"
      onClick={(e) => { e.stopPropagation(); onEdit(); }}
      aria-label="Editar"
    >
      <Edit2 className="w-3.5 h-3.5" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="w-7 h-7 rounded-lg hover:bg-red-900/30 hover:text-red-400 text-gray-400 transition-all"
      onClick={(e) => { e.stopPropagation(); onDelete(); }}
      aria-label="Eliminar"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </Button>
  </div>
);

// ─── Vista principal ──────────────────────────────────────────────────────────

export const UserRolesView: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // ── Datos iniciales desde la API mock ──
  const { data: rolesInitial = [], isLoading: loadingRoles } = useQuery<Rol[]>({
    queryKey: ['roles'],
    queryFn: api.getRoles as () => Promise<Rol[]>,
  });

  const { data: usuariosInitial = [], isLoading: loadingUsuarios } = useQuery<Usuario[]>({
    queryKey: ['usuarios'],
    queryFn: api.getUsuarios as () => Promise<Usuario[]>,
  });

  // ── Stores localStorage ──
  const { roles, addRol, updateRol, deleteRol } = useRolesStore(rolesInitial);
  const { usuarios, addUsuario, updateUsuario, deleteUsuario } = useUsuariosStore(usuariosInitial);

  // ── Modales ──
  const [rolModalOpen, setRolModalOpen] = useState(false);
  const [editingRol, setEditingRol] = useState<Rol | null>(null);

  const [usuarioModalOpen, setUsuarioModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

  // ── Confirmar eliminación ──
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: 'rol' | 'usuario';
    id: string;
    nombre: string;
  }>({ isOpen: false, type: 'rol', id: '', nombre: '' });

  // ── Búsqueda ──
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase();
    return roles.filter((r) => r.nombre.toLowerCase().includes(q) || r.estado.toLowerCase().includes(q));
  }, [roles, searchQuery]);

  const filteredUsuarios = useMemo(() => {
    if (!searchQuery.trim()) return usuarios;
    const q = searchQuery.toLowerCase();
    return usuarios.filter(
      (u) =>
        u.nombre.toLowerCase().includes(q) ||
        u.usuario.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.rol.toLowerCase().includes(q) ||
        u.estado.toLowerCase().includes(q)
    );
  }, [usuarios, searchQuery]);

  // ── Limpiar búsqueda al cambiar de vista ──
  useEffect(() => { setSearchQuery(''); }, [activeView]);

  // ── Handlers Roles ──
  const handleAddRol = () => { setEditingRol(null); setRolModalOpen(true); };
  const handleEditRol = (rol: Rol) => { setEditingRol(rol); setRolModalOpen(true); };
  const handleDeleteRol = (rol: Rol) =>
    setConfirmDelete({ isOpen: true, type: 'rol', id: rol.id, nombre: rol.nombre });

  const handleSaveRol = (data: Omit<Rol, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    if (editingRol) {
      updateRol(editingRol.id, data);
    } else {
      addRol(data);
    }
  };

  // ── Handlers Usuarios ──
  const handleAddUsuario = () => { setEditingUsuario(null); setUsuarioModalOpen(true); };
  const handleEditUsuario = (u: Usuario) => { setEditingUsuario(u); setUsuarioModalOpen(true); };
  const handleDeleteUsuario = (u: Usuario) =>
    setConfirmDelete({ isOpen: true, type: 'usuario', id: u.id, nombre: u.nombre });

  const handleSaveUsuario = (data: Omit<Usuario, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    if (editingUsuario) {
      updateUsuario(editingUsuario.id, data);
    } else {
      addUsuario(data);
    }
  };

  // ── Confirmar eliminación ──
  const handleConfirmDelete = () => {
    if (confirmDelete.type === 'rol') deleteRol(confirmDelete.id);
    else deleteUsuario(confirmDelete.id);
  };

  // ── Columnas para Roles ──
  const rolesColumns: ColumnDef<Rol>[] = [
    {
      header: 'Estado',
      accessorKey: 'estado',
      className: 'w-[110px] shrink-0',
      cell: (item) => <Badge variant={item.estado.toLowerCase()}>{item.estado}</Badge>,
    },
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      className: 'flex-1 min-w-0',
    },
    {
      header: 'Fecha Creación',
      accessorKey: 'fechaCreacion',
      className: 'w-[200px] shrink-0 text-gray-400 text-sm',
    },
    {
      header: 'Fecha Actualización',
      accessorKey: 'fechaActualizacion',
      className: 'w-[200px] shrink-0 text-gray-400 text-sm',
    },
    {
      header: undefined,
      className: 'w-[72px] shrink-0 items-end justify-end pr-1',
      cell: (item) => (
        <RowActions onEdit={() => handleEditRol(item)} onDelete={() => handleDeleteRol(item)} />
      ),
    },
  ];

  // ── Columnas para Usuarios ──
  const usuariosColumns: ColumnDef<Usuario>[] = [
    {
      header: 'Estado',
      accessorKey: 'estado',
      className: 'w-[110px] shrink-0',
      cell: (item) => <Badge variant={item.estado.toLowerCase()}>{item.estado}</Badge>,
    },
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      className: 'w-[180px] shrink-0',
    },
    {
      header: 'Usuario',
      accessorKey: 'usuario',
      className: 'w-[130px] shrink-0 font-mono text-gray-300',
    },
    {
      header: 'Email',
      accessorKey: 'email',
      className: 'flex-1 min-w-0 text-gray-300',
    },
    {
      header: 'Rol',
      accessorKey: 'rol',
      className: 'w-[220px] shrink-0 text-gray-300 text-sm',
    },
    {
      header: 'Fecha Creación',
      accessorKey: 'fechaCreacion',
      className: 'w-[170px] shrink-0 text-gray-400 text-sm',
    },
    {
      header: undefined,
      className: 'w-[72px] shrink-0 items-end justify-end pr-1',
      cell: (item) => (
        <RowActions onEdit={() => handleEditUsuario(item)} onDelete={() => handleDeleteUsuario(item)} />
      ),
    },
  ];

  const isLoading = activeView === 'roles' ? loadingRoles : loadingUsuarios;

  return (
    <div className="flex flex-col h-full bg-secondary text-text-primary rounded-xl">
      {/* ── Header: toggle izquierda | iconos derecha ── */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Toggle alineado a la izquierda */}
        <ViewToggle value={activeView} onChange={setActiveView} />

        {/* Iconos de acción alineados a la derecha */}
        <ViewHeader
          showSearch
          showAdd
          showFilter
          showExport
          onSearchClick={() => setShowSearch((v) => !v)}
          onAddClick={activeView === 'roles' ? handleAddRol : handleAddUsuario}
          className="mb-0"
        />
      </div>

      {/* ── Barra de búsqueda inline ── */}
      {showSearch && (
        <div className="mb-4 animate-in slide-in-from-top-2 duration-200">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeView === 'roles' ? 'Buscar rol por nombre o estado…' : 'Buscar usuario por nombre, usuario, email o rol…'}
            autoFocus
            className="w-full bg-[#2A292A] border border-[#3A393C] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-[#1DA493] focus:border-[#1DA493] transition-colors"
          />
        </div>
      )}

      {/* ── DataGrid ── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {activeView === 'roles' ? (
            <DataGrid<Rol>
              data={filteredRoles}
              columns={rolesColumns}
              isLoading={isLoading}
              keyExtractor={(item) => item.id}
              emptyMessage={
                <span className="text-gray-500">
                  {searchQuery ? `Sin resultados para "${searchQuery}"` : 'No hay roles registrados'}
                </span>
              }
            />
          ) : (
            <DataGrid<Usuario>
              data={filteredUsuarios}
              columns={usuariosColumns}
              isLoading={isLoading}
              keyExtractor={(item) => item.id}
              emptyMessage={
                <span className="text-gray-500">
                  {searchQuery ? `Sin resultados para "${searchQuery}"` : 'No hay usuarios registrados'}
                </span>
              }
            />
          )}
        </div>

        {/* Footer contador */}
        {activeView === 'roles' ? (
          <CountFooter count={filteredRoles.length} label="Rol" />
        ) : (
          <CountFooter count={filteredUsuarios.length} label="Usuario" />
        )}
      </div>

      {/* ── Modales ── */}
      <RolModal
        isOpen={rolModalOpen}
        onClose={() => { setRolModalOpen(false); setEditingRol(null); }}
        onSave={handleSaveRol}
        rolesExistentes={roles}
        editingRol={editingRol}
      />

      <UsuarioModal
        isOpen={usuarioModalOpen}
        onClose={() => { setUsuarioModalOpen(false); setEditingUsuario(null); }}
        onSave={handleSaveUsuario}
        roles={roles}
        editingUsuario={editingUsuario}
      />

      {/* ── Confirmar eliminación ── */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete((p) => ({ ...p, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={`Eliminar ${confirmDelete.type === 'rol' ? 'Rol' : 'Usuario'}`}
        message={`¿Está seguro que desea eliminar "${confirmDelete.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        intent="danger"
      />
    </div>
  );
};
