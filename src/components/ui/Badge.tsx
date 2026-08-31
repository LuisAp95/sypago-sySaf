import React from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'success' | 'critical' | 'warning' | 'medium' | 'info' | 'inactive' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant | string;
  className?: string;
}

const getVariantColor = (variant: string) => {
  switch (variant.toLowerCase()) {
    case 'válida':
    case 'válidas':
    case 'valida':
    case 'validas':
    case 'success':
      return 'bg-[#1C3B2B] text-[#34D399] border-[#245C3E]';
    case 'activo':
    case 'info':
      return 'bg-[#1C2D3B] text-[#38BDF8] border-[#24425C]';
    case 'en proceso':
    case 'medio':
    case 'medium':
      return 'bg-[#3B351C] text-[#FACC15] border-[#5C5224]';
    case 'retenidas':
    case 'retenida':
    case 'alto':
    case 'cuarentena':
    case 'warning':
      return 'bg-[#3D2517] text-[#FB923C] border-[#5C3620]';
    case 'bloqueadas':
    case 'bloqueada':
    case 'crítico':
    case 'critico':
    case 'bloquear':
    case 'critical':
      return 'bg-[#3E1A1A] text-[#F87171] border-[#5C2424]';
    case 'inactivo':
    case 'inactive':
      return 'bg-gray-800 text-gray-400 border-gray-700';
    default:
      return 'bg-gray-800 text-gray-300 border-gray-700';
  }
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getVariantColor(variant),
        className
      )}
    >
      {children}
    </span>
  );
};
