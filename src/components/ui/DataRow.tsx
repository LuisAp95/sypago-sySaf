import React from 'react';
import { cn } from '@/utils/cn';

interface DataRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DataRow = React.forwardRef<HTMLDivElement, DataRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center w-full bg-tertiary border border-[#333235] rounded-2xl py-2 px-4 mb-2 transition-colors shadow-lg hover:border-[#444347]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DataRow.displayName = 'DataRow';

// Utilidad para columnas dentro del DataRow
interface DataColProps extends React.HTMLAttributes<HTMLDivElement> {
  // label ya no se utiliza aquí, se renderiza a nivel global en DataGrid
}

export const DataCol = ({ children, className, ...props }: DataColProps) => (
  <div className={cn("flex flex-col justify-center min-w-0", className)} {...props}>
    <div className="text-[15px] font-bold text-white flex items-center h-full min-h-[32px] min-w-0">
      {children}
    </div>
  </div>
);
