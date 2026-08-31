import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: React.ReactNode;
  className?: string;
  spinnerClassName?: string;
  textClassName?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
  minHeight?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text,
  className,
  spinnerClassName,
  textClassName,
  fullWidth = true,
  fullHeight = true,
  minHeight,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2.5 text-gray-400 font-medium',
        fullWidth && 'w-full',
        fullHeight && 'h-full flex-1',
        minHeight,
        className
      )}
    >
      <Loader2
        className={cn(
          'animate-spin text-[#00d2b5] shrink-0',
          sizeMap[size],
          spinnerClassName
        )}
      />
      {text && (
        <span className={cn('text-sm text-gray-400', textClassName)}>
          {text}
        </span>
      )}
    </div>
  );
};
