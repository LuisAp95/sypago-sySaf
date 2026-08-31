import React from 'react';
import { DataRow, DataCol } from './DataRow';
import { cn } from '@/utils/cn';
import { ChevronsUpDown } from 'lucide-react';
import { Loader } from './Loader';

export interface ColumnDef<T> {
  header?: string;
  accessorKey?: keyof T;
  className?: string;
  cell?: (item: T) => React.ReactNode;
  colProps?: React.HTMLAttributes<HTMLDivElement>;
}

export interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  rowClassName?: string | ((item: T) => string);
  keyExtractor?: (item: T) => string | number;
  emptyMessage?: React.ReactNode;
}

export function DataGrid<T>({
  data,
  columns,
  isLoading,
  onRowClick,
  rowClassName,
  keyExtractor = (item: any) => item.id || Math.random().toString(),
  emptyMessage = "No hay datos disponibles"
}: DataGridProps<T>) {
  
  if (isLoading) {
    return <Loader text="Cargando..." size="md" className="py-12" />;
  }

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-text-muted">{emptyMessage}</div>;
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Global Header Row */}
      <div className="flex items-center w-full px-4 py-3 mb-3 gap-6 shrink-0 bg-[#1A191C] border border-[#333235] rounded-xl shadow-sm">
        {columns.map((col, idx) => {
          const isLast = idx === columns.length - 1;
          const hasHeader = !!col.header;
          const nextHasHeader = !isLast && !!columns[idx + 1]?.header;
          const isCheckbox = idx === 0 && !hasHeader;
          const showSeparator = !isLast && (nextHasHeader || isCheckbox);
          const isRightAligned = col.className?.includes('items-end') || col.className?.includes('text-right');
          const safeHeaderClass = col.className?.replace('items-end', '') || '';
          
          return (
            <div 
              key={idx} 
              className={cn(
                "relative flex items-center gap-1.5 uppercase text-[12px] text-[#E4E4E7] font-bold tracking-wider min-w-0",
                isRightAligned ? "justify-end" : "justify-start",
                hasHeader && "cursor-pointer hover:text-white transition-colors",
                showSeparator && "after:content-[''] after:absolute after:-right-3 after:top-1/2 after:-translate-y-1/2 after:w-[1px] after:h-4 after:bg-[#333235]",
                safeHeaderClass
              )}
            >
              {hasHeader && (
                <>
                  <span className="whitespace-nowrap">{col.header}</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 shrink-0 text-[#6B6A6D]" />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Data Rows */}
      <div className="flex-1 overflow-y-auto">
        {data.map((item) => {
          const rClassName = typeof rowClassName === 'function' ? rowClassName(item) : rowClassName;
          return (
            <DataRow 
              key={keyExtractor(item)}
              className={cn(
                "gap-6 transition-colors",
                onRowClick && "cursor-pointer hover:border-[#444347]",
                rClassName
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col, colIndex) => {
                let cellContent: React.ReactNode = null;
                if (col.cell) {
                  cellContent = col.cell(item);
                } else if (col.accessorKey) {
                  cellContent = item[col.accessorKey] as React.ReactNode;
                }

                return (
                  <DataCol 
                    key={colIndex} 
                    className={col.className}
                    {...col.colProps}
                  >
                    {cellContent}
                  </DataCol>
                );
              })}
            </DataRow>
          );
        })}
      </div>
    </div>
  );
}
