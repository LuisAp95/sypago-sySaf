import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  type Rol,
  type PermisoModulo,
  type Permisos,
  type PlantillaDefinicion,
  MODULOS_SISTEMA,
  buildDefaultPermisos,
  PERMISOS_DEFAULT,
  PLANTILLAS_PREDEFINIDAS,
} from '../hooks/useUserRolesStore';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface RolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Rol, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => void;
  rolesExistentes: Rol[];
  editingRol?: Rol | null;
}

type AccionBasica = 'ver' | 'agregar' | 'borrar' | 'imprimir' | 'editar';
type AccionEspecial = 'notificar' | 'solicitar';
type AccionPermiso = AccionBasica | AccionEspecial;

const ACCIONES_BASICAS: AccionBasica[] = ['ver', 'agregar', 'borrar', 'imprimir', 'editar'];
const ACCIONES_ESPECIALES: AccionEspecial[] = ['notificar', 'solicitar'];
const TODAS_ACCIONES: AccionPermiso[] = [...ACCIONES_BASICAS, ...ACCIONES_ESPECIALES];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

/** Círculo de permiso: activo = círculo lleno, inactivo = ícono "prohibido" */
const PermisoCircle: React.FC<{
  activo: boolean;
  onChange: (val: boolean) => void;
  label: string;
}> = ({ activo, onChange, label }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={() => onChange(!activo)}
    className={cn(
      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110',
      activo
        ? 'border-[#1DA493] bg-[#1DA493]/20'
        : 'border-[#4E4D4E] bg-transparent'
    )}
  >
    {activo ? (
      <div className="w-3 h-3 rounded-full bg-[#1DA493]" />
    ) : (
      <svg viewBox="0 0 16 16" className="w-4 h-4 text-[#4E4D4E]" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <line x1="3.5" y1="12.5" x2="12.5" y2="3.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )}
  </button>
);

/** Input de texto con label flotante y validación */
const FloatInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  list?: string;
}> = ({ id, label, value, onChange, error, list }) => (
  <div className="relative w-full">
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      list={list}
      autoComplete="off"
      placeholder=" "
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

export const RolModal: React.FC<RolModalProps> = ({
  isOpen,
  onClose,
  onSave,
  rolesExistentes,
  editingRol,
}) => {
  const isEditing = !!editingRol;

  // ── Estado del formulario ──
  const [nombre, setNombre] = useState('');
  const [plantilla, setPlantilla] = useState('');
  const [plantillaSearch, setPlantillaSearch] = useState('');
  const [activo, setActivo] = useState(true);
  const [permisos, setPermisos] = useState<Permisos>(buildDefaultPermisos());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPlantillaDropdown, setShowPlantillaDropdown] = useState(false);
  const plantillaRef = useRef<HTMLDivElement>(null);

  // Filtrar plantillas predefinidas
  const plantillaPredefinidasFiltered = PLANTILLAS_PREDEFINIDAS.filter(
    (p) =>
      !plantillaSearch.trim() ||
      p.nombre.toLowerCase().includes(plantillaSearch.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(plantillaSearch.toLowerCase())
  );

  // Filtrar roles creados existentes
  const plantillaOptions = rolesExistentes.filter((r) => r.id !== editingRol?.id);
  const plantillaRolesFiltered = plantillaOptions.filter(
    (r) =>
      !plantillaSearch.trim() ||
      r.nombre.toLowerCase().includes(plantillaSearch.toLowerCase())
  );

  // Hidratar al editar
  useEffect(() => {
    if (isOpen) {
      if (editingRol) {
        setNombre(editingRol.nombre);
        setPlantilla(editingRol.plantilla ?? '');
        setActivo(editingRol.estado === 'Activo');
        setPermisos(
          MODULOS_SISTEMA.reduce<Permisos>((acc, mod) => {
            acc[mod] = { ...PERMISOS_DEFAULT, ...(editingRol.permisos[mod] ?? {}) };
            return acc;
          }, {})
        );
      } else {
        setNombre('');
        setPlantilla('');
        setActivo(true);
        setPermisos(buildDefaultPermisos());
      }
      setPlantillaSearch('');
      setErrors({});
    }
  }, [isOpen, editingRol]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (plantillaRef.current && !plantillaRef.current.contains(e.target as Node)) {
        setShowPlantillaDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Permiso helpers ──
  const setPermiso = (modulo: string, accion: AccionPermiso, value: boolean) => {
    setPermisos((prev) => ({
      ...prev,
      [modulo]: { ...prev[modulo], [accion]: value },
    }));
  };

  const toggleAll = (modulo: string) => {
    const current = permisos[modulo];
    const allTrue = TODAS_ACCIONES.every((a) => current[a]);
    const next = TODAS_ACCIONES.reduce<PermisoModulo>(
      (acc, a) => ({ ...acc, [a]: !allTrue }),
      { ...PERMISOS_DEFAULT }
    );
    setPermisos((prev) => ({ ...prev, [modulo]: next }));
  };

  // Aplicar plantilla predefinida
  const applyPlantillaDef = (pDef: PlantillaDefinicion) => {
    setPlantilla(pDef.nombre);
    setPlantillaSearch('');
    setPermisos(pDef.getPermisos());
    setShowPlantillaDropdown(false);
  };

  // Aplicar permisos desde un rol existente
  const applyPlantillaRol = (rol: Rol) => {
    setPlantilla(rol.nombre);
    setPlantillaSearch('');
    setPermisos(
      MODULOS_SISTEMA.reduce<Permisos>((acc, mod) => {
        acc[mod] = { ...PERMISOS_DEFAULT, ...(rol.permisos[mod] ?? {}) };
        return acc;
      }, {})
    );
    setShowPlantillaDropdown(false);
  };

  // ── Validación y envío ──
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'No puede estar vacío';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({
      nombre: nombre.trim(),
      plantilla: plantilla.trim() || null,
      estado: activo ? 'Activo' : 'Inactivo',
      permisos,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Rol' : 'Agregar rol'}
      size="4xl"
      bodyClassName="space-y-0 p-0"
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
      <div className="flex flex-col gap-4 p-6">
        {/* ── Fila superior: Nombre | Plantilla | Toggle ── */}
        <div className="flex items-start gap-3">
          {/* Nombre del Rol */}
          <div className="flex-1">
            <FloatInput
              id="rol-nombre"
              label="Nombre del Rol"
              value={nombre}
              onChange={(v) => { setNombre(v); setErrors((e) => ({ ...e, nombre: '' })); }}
              error={errors.nombre}
            />
          </div>

          {/* Plantilla con dropdown */}
          <div className="flex-1 relative" ref={plantillaRef}>
            <div className="relative">
              <input
                id="rol-plantilla"
                type="text"
                value={plantilla}
                onChange={(e) => {
                  setPlantilla(e.target.value);
                  setPlantillaSearch(e.target.value);
                  setShowPlantillaDropdown(true);
                }}
                onFocus={() => {
                  setShowPlantillaDropdown(true);
                  setPlantillaSearch('');
                }}
                onClick={() => {
                  if (!showPlantillaDropdown) {
                    setShowPlantillaDropdown(true);
                    setPlantillaSearch('');
                  }
                }}
                placeholder=" "
                autoComplete="off"
                className="peer w-full bg-[#2A292A] border border-[#3A393C] rounded-xl px-4 pt-5 pb-2 text-sm text-white outline-none transition-colors focus:ring-1 focus:ring-[#1DA493] focus:border-[#1DA493] pr-9 cursor-pointer"
              />
              <label
                htmlFor="rol-plantilla"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all duration-200
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm
                  peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#1DA493]
                  peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                Plantilla
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowPlantillaDropdown((prev) => !prev);
                  setPlantillaSearch('');
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                tabIndex={-1}
                aria-label="Abrir opciones de plantilla"
              >
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    showPlantillaDropdown && 'rotate-180'
                  )}
                />
              </button>
            </div>
            {showPlantillaDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[#2A292A] border border-[#3A393C] rounded-xl shadow-2xl z-50 custom-scrollbar divide-y divide-[#3A393C]/50">
                {plantillaPredefinidasFiltered.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-[#1DA493] uppercase tracking-wider bg-[#1F1F21]">
                      Plantillas Predefinidas
                    </div>
                    {plantillaPredefinidasFiltered.map((pDef) => (
                      <button
                        key={pDef.id}
                        type="button"
                        onClick={() => applyPlantillaDef(pDef)}
                        className={cn(
                          'w-full text-left px-4 py-2.5 hover:bg-[#3A393C] transition-colors flex flex-col gap-0.5 cursor-pointer',
                          plantilla === pDef.nombre && 'bg-[#1DA493]/10'
                        )}
                      >
                        <span
                          className={cn(
                            'text-sm font-medium',
                            plantilla === pDef.nombre ? 'text-[#1DA493]' : 'text-white'
                          )}
                        >
                          {pDef.nombre}
                        </span>
                        <span className="text-xs text-gray-400">{pDef.descripcion}</span>
                      </button>
                    ))}
                  </div>
                )}
                {plantillaRolesFiltered.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-[#1F1F21]">
                      Roles Existentes
                    </div>
                    {plantillaRolesFiltered.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => applyPlantillaRol(r)}
                        className={cn(
                          'w-full text-left px-4 py-2.5 text-sm hover:bg-[#3A393C] transition-colors cursor-pointer',
                          plantilla === r.nombre
                            ? 'text-[#1DA493] bg-[#1DA493]/10 font-medium'
                            : 'text-gray-200'
                        )}
                      >
                        {r.nombre}
                      </button>
                    ))}
                  </div>
                )}
                {plantillaPredefinidasFiltered.length === 0 &&
                  plantillaRolesFiltered.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-400 text-center">
                      No se encontraron plantillas
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Toggle Activo */}
          <div className="flex items-center gap-2 mt-1 shrink-0">
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
              {activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        {/* ── Tabla de permisos ── */}
        <div className="rounded-xl overflow-hidden border border-[#3A393C]">
          <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: '52px' }} />
                {ACCIONES_BASICAS.map((a) => (
                  <col key={a} style={{ width: '72px' }} />
                ))}
                {ACCIONES_ESPECIALES.map((a) => (
                  <col key={a} style={{ width: '72px' }} />
                ))}
              </colgroup>

              {/* Header row */}
              <thead>
                <tr className="bg-[#1F1F21]">
                  <th className="px-3 py-2 text-left border-b border-[#3A393C]" />
                  <th className="px-2 py-2 text-center border-b border-[#3A393C]" />
                  <th
                    colSpan={ACCIONES_BASICAS.length}
                    className="py-2 text-xs font-bold text-gray-200 text-center border-b border-l border-[#3A393C]"
                  >
                    Acciones básicas
                  </th>
                  <th
                    colSpan={ACCIONES_ESPECIALES.length}
                    className="py-2 text-xs font-bold text-gray-200 text-center border-b border-l border-[#3A393C]"
                  >
                    Acciones especiales
                  </th>
                </tr>

                {/* Sub-header */}
                <tr className="bg-[#232323]">
                  <th className="px-3 py-2 text-left border-b border-[#3A393C]" />
                  <th className="px-1 py-2 text-center text-[10px] font-bold text-[#1DA493] border-b border-[#3A393C]">
                    Todo
                  </th>
                  {ACCIONES_BASICAS.map((a) => (
                    <th
                      key={a}
                      className="py-2 text-xs text-gray-400 text-center capitalize border-b border-l border-[#2A2929]"
                    >
                      {a}
                    </th>
                  ))}
                  {ACCIONES_ESPECIALES.map((a) => (
                    <th
                      key={a}
                      className="py-2 text-xs text-gray-400 text-center capitalize border-b border-l border-[#2A2929]"
                    >
                      {a}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body rows */}
              <tbody>
                {MODULOS_SISTEMA.map((modulo) => {
                  const p = permisos[modulo] ?? { ...PERMISOS_DEFAULT };
                  const allActive = TODAS_ACCIONES.every((a) => p[a]);
                  return (
                    <tr
                      key={modulo}
                      className="hover:bg-[#2A292A]/50 transition-colors border-b border-[#2A2929] last:border-b-0"
                    >
                      {/* Nombre módulo */}
                      <td className="px-3 py-3 text-sm text-gray-200 font-medium truncate" title={modulo}>
                        {modulo}
                      </td>

                      {/* Botón Todo */}
                      <td className="py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleAll(modulo)}
                          className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded border transition-all cursor-pointer',
                            allActive
                              ? 'border-[#1DA493] text-[#1DA493] bg-[#1DA493]/10'
                              : 'border-[#4E4D4E] text-[#6b6a6d] hover:border-[#1DA493] hover:text-[#1DA493]'
                          )}
                        >
                          Todo
                        </button>
                      </td>

                      {/* Acciones básicas */}
                      {ACCIONES_BASICAS.map((accion) => (
                        <td key={accion} className="py-3 text-center border-l border-[#2A2929]">
                          <div className="flex justify-center">
                            <PermisoCircle
                              activo={p[accion]}
                              onChange={(v) => setPermiso(modulo, accion, v)}
                              label={`${accion} ${modulo}`}
                            />
                          </div>
                        </td>
                      ))}

                      {/* Acciones especiales */}
                      {ACCIONES_ESPECIALES.map((accion) => (
                        <td key={accion} className="py-3 text-center border-l border-[#2A2929]">
                          <div className="flex justify-center">
                            <PermisoCircle
                              activo={p[accion]}
                              onChange={(v) => setPermiso(modulo, accion, v)}
                              label={`${accion} ${modulo}`}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
