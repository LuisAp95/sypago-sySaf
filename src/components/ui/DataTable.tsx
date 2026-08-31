import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
import type { ColumnDef } from './DataGrid';
import { cn } from '@/utils/cn';
import { Loader } from './Loader';

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  wrapperClassName?: string;
  tableClassName?: string;
  headerClassName?: string;
  emptyMessage?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  onRowClick,
  wrapperClassName,
  tableClassName,
  headerClassName,
  emptyMessage = "No hay datos disponibles"
}: DataTableProps<T>) {
  return (
    <Table wrapperClassName={wrapperClassName} className={tableClassName}>
      <TableHeader className={headerClassName}>
        <TableRow className="border-0">
          {columns.map((col, index) => (
            <TableHead key={index} className={col.className}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="py-12">
              <Loader text="Cargando..." size="md" />
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-8 text-text-muted">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, rowIndex) => (
            <TableRow 
              key={(item as any).id || rowIndex}
              onClick={() => onRowClick?.(item)}
              className={cn(onRowClick && "cursor-pointer hover:bg-tertiary/80")}
            >
              {columns.map((col, colIndex) => {
                let cellContent: React.ReactNode = null;
                if (col.cell) {
                  cellContent = col.cell(item);
                } else if (col.accessorKey) {
                  cellContent = item[col.accessorKey] as React.ReactNode;
                }
                return (
                  <TableCell key={colIndex} className={col.className}>
                    {cellContent}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
