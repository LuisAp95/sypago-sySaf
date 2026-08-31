import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  headerLeft?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  full: 'max-w-[95vw] h-[95vh]',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = '4xl',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  headerLeft,
  className,
  bodyClassName,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-200"
        onClick={() => closeOnOverlayClick && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-secondary border border-[#2b2f3d] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[90vh] text-text-primary animate-in fade-in zoom-in-95 duration-200',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton || headerLeft) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2f3d]/60 relative">
            {headerLeft && (
              <div className="absolute left-5 top-3.5 flex items-center z-10">
                {headerLeft}
              </div>
            )}
            <div className="flex-1 text-center font-bold text-lg text-gray-100">
              {title}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-4 p-1.5 rounded-full text-gray-400 bg-tertiary border border-table-border hover:bg-[#393738] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className={cn('flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar', bodyClassName)}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-center px-6 py-4 border-t border-[#2b2f3d]/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
