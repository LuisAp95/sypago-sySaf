import React, { useState, useCallback } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import logo from '../../../../public/Logo.png';
import fondo from '../../../../public/SySaf_Fondo1.png'

// ─── Componente de campo de entrada ─────────────────────────────────────────

interface LoginFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  rightAction?: React.ReactNode;
}

const LoginField: React.FC<LoginFieldProps> = ({
  id,
  label,
  type,
  value,
  placeholder,
  icon,
  onChange,
  autoFocus,
  rightAction,
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[13px] font-semibold text-[#d1d5db] tracking-wide">
      {label}
    </label>
    <div className="relative flex items-center group">
      <span className="absolute left-3.5 w-4.5 h-4.5 text-[#6b7280] pointer-events-none transition-colors duration-200 group-focus-within:text-chart-menu">
        {icon}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete={type === 'password' ? 'current-password' : 'username'}
        className="w-full py-3 pl-11 pr-10 bg-login-input border border-chart-menu/20 rounded-xl text-[#f3f4f6] text-[15px] outline-none transition-all duration-200 placeholder:text-[#6b7280] focus:border-chart-menu focus:shadow-[0_0_0_3px_rgba(29,164,147,0.15)]"
      />
      {rightAction}
    </div>
  </div>
);

// ─── Componente principal de Login ──────────────────────────────────────────

export const LoginView: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = usuario.trim().length > 0 && password.length > 0 && !isLoading;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
      login({ usuario: usuario.trim(), password });
    },
    [canSubmit, login, usuario, password]
  );

  const handleFieldChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (value: string) => {
        setter(value);
        if (error) clearError();
      },
    [error, clearError]
  );

  return (
    <div className="relative z-0  w-full h-screen flex items-center justify-center min-h-screen  overflow-hidden bg-[linear-gradient(145deg,#0d0d0f_0%,#131315_40%,#1a1a1e_100%)]">
      {/* Background Image */}
      <img
        src={fondo}
        alt="Fondo SySAF"
        className="absolute inset-0 w-full h-full -object-fill object-cover -z-10 pointer-events-none"
      />

      {/*<div className=" flex absolute top-10 left-25 w-[200px] h-25  ">
          <img src={logo} alt="SySAF Logo" className="h-auto object-fill mb-10 -ml-2 " />
        </div>*/}

      {/* Decorative background orbs */}
      <div className="absolute -top-[20%] -right-[10%] w-100 h-100 bg-[radial-gradient(circle,rgba(29,164,147,0.08)_0%,transparent_70%)] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[15%] -left-[5%] w-100 h-100 bg-[radial-gradient(circle,rgba(29,164,147,0.05)_0%,transparent_70%)] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-105 p-10 bg-login-card backdrop-blur-[1px] border border-chart-menu/30 rounded-3xl shadow-[0_0_40px_rgba(29,164,147,0.15),0_4px_6px_-1px_rgba(0,0,0,0.3),0_10px_30px_-5px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.03)] animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center justify-center mb-2">
          <img src={logo} alt="SySAF Logo" className="w-40 h-auto object-contain mb-10 -ml-2 " />
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <LoginField
            id="login-usuario"
            label="Usuario"
            type="text"
            value={usuario}
            placeholder="Ingrese su nombre de usuario"
            icon={<User className="w-4.5 h-4.5" />}
            onChange={handleFieldChange(setUsuario)}
            autoFocus
          />

          <LoginField
            id="login-password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="Ingrese su contraseña"
            icon={<Lock className="w-4.5 h-4.5" />}
            onChange={handleFieldChange(setPassword)}
            rightAction={
              <button
                type="button"
                className="absolute right-3 bg-transparent border-none text-[#6b7280] p-1 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:text-[#d1d5db] focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            }
          />

          {/* Mensaje de error */}
          {error && (
            <div className="flex items-center gap-2 py-3 px-4 bg-critical/12 border border-critical/25 rounded-xl text-[#f87171] text-[13px] font-medium animate-error-in" role="alert">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3.5 mt-2 bg-linear-to-br from-chart-menu to-[#178a7c] text-white text-[15px] font-semibold rounded-xl cursor-pointer transition-all duration-250 hover:enabled:from-[#22b8a5] hover:enabled:to-chart-menu hover:enabled:shadow-[0_4px_16px_rgba(29,164,147,0.3)] hover:enabled:-translate-y-0.5 active:enabled:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-[spin_0.6s_linear_infinite]" />
                Iniciando sesión…
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#6b7280]">
          © {new Date().getFullYear()} SySAF — Sistema de Análisis de Fraude
        </p>
      </div>
    </div>
  );
};
