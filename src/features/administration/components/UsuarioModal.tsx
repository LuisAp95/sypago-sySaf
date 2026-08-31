import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { type Usuario, type Rol } from '../hooks/useUserRolesStore';

// ─── Props ────────────────────────────────────────────────────────────────────

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Usuario, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => void;
  roles: Rol[];
  editingUsuario?: Usuario | null;
}

// ─── Input flotante ───────────────────────────────────────────────────────────

const FloatInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}> = ({ id, label, value, onChange, error, type = 'text' }) => (
  <div className="relative w-full">
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      autoComplete="off"
      className={cn(
        'peer w-full bg-[#2A292A] border rounded-xl px-4 pt-5 pb-2 text-sm text-white outline-none transition-colors focus:ring-1',
        error
          ? 'border-red-500 focus:ring-red-500'
          : 'border-[#3A393C] focus:ring-[#1DA493] focus:border-[#1DA493]'
      )}
    />
    <label
      htmlFor={id}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all duration-200
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm
        peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#1DA493]
        peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:text-xs"
    >
      {label}
    </label>
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────

export const UsuarioModal: React.FC<UsuarioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  roles,
  editingUsuario,
}) => {
  const isEditing = !!editingUsuario;

  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [rolId, setRolId] = useState('');
  const [activo, setActivo] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (editingUsuario) {
        setNombre(editingUsuario.nombre);
        setUsuario(editingUsuario.usuario);
        setEmail(editingUsuario.email);
        setRolId(editingUsuario.rolId);
        setActivo(editingUsuario.estado === 'Activo');
      } else {
        setNombre('');
        setUsuario('');
        setEmail('');
        setRolId('');
        setActivo(true);
      }
      setErrors({});
    }
  }, [isOpen, editingUsuario]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (!usuario.trim()) errs.usuario = 'El usuario es requerido';
    if (!email.trim()) errs.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email inválido';
    if (!rolId) errs.rolId = 'Debe seleccionar un rol';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const selectedRol = roles.find((r) => r.id === rolId);
    onSave({
      nombre: nombre.trim(),
      usuario: usuario.trim(),
      email: email.trim(),
      estado: activo ? 'Activo' : 'Inactivo',
      rol: selectedRol?.nombre ?? '',
      rolId,
    });
    onClose();
  };

  const rolesActivos = roles.filter((r) => r.estado === 'Activo');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Usuario' : 'Agregar Usuario'}
      size="md"
      footer={
        <Button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-[#162B4D] hover:bg-[#1a3460] border border-[#1f3d6e] text-white px-8 py-2.5 rounded-xl font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          {isEditing ? 'Guardar cambios' : 'Crear'}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Nombre completo */}
        <FloatInput id="usr-nombre" label="Nombre completo" value={nombre} onChange={(v) => { setNombre(v); setErrors((e) => ({ ...e, nombre: '' })); }} error={errors.nombre} />

        {/* Usuario y Email */}
        <div className="flex gap-3">
          <FloatInput id="usr-usuario" label="Usuario" value={usuario} onChange={(v) => { setUsuario(v); setErrors((e) => ({ ...e, usuario: '' })); }} error={errors.usuario} />
          <FloatInput id="usr-email" label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: '' })); }} error={errors.email} />
        </div>

        {/* Rol */}
        <div className="relative w-full">
          <select
            id="usr-rol"
            value={rolId}
            onChange={(e) => { setRolId(e.target.value); setErrors((er) => ({ ...er, rolId: '' })); }}
            className={cn(
              'w-full bg-[#2A292A] border rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors focus:ring-1 appearance-none cursor-pointer',
              errors.rolId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-[#3A393C] focus:ring-[#1DA493] focus:border-[#1DA493]',
              !rolId && 'text-gray-400'
            )}
          >
            <option value="" disabled className="text-gray-400 bg-[#2A292A]">Seleccionar Rol</option>
            {rolesActivos.map((r) => (
              <option key={r.id} value={r.id} className="text-white bg-[#2A292A]">{r.nombre}</option>
            ))}
          </select>
          {errors.rolId && <p className="mt-1 text-xs text-red-400">{errors.rolId}</p>}
        </div>

        {/* Toggle Estado */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            role="switch"
            aria-checked={activo}
            onClick={() => setActivo(!activo)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1DA493] focus:ring-offset-2 focus:ring-offset-[#2A292A] cursor-pointer',
              activo ? 'bg-[#162B4D]' : 'bg-[#3A393C]'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300',
                activo ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
          <span className="text-sm font-medium text-gray-200">
            {activo ? 'Usuario Activo' : 'Usuario Inactivo'}
          </span>
        </div>
      </div>
    </Modal>
  );
};
