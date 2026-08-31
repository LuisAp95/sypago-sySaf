import React from 'react';
import { Search, FileText, Filter, Plus, FileDown } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';

interface ViewHeaderProps {
  selectOptions?: { label: string; value: string }[];
  selectValue?: string;
  selectPlaceholder?: string;
  onSelectChange?: (val: string) => void;
  secondarySelectOptions?: { label: string; value: string }[];
  secondarySelectValue?: string;
  secondarySelectPlaceholder?: string;
  onSecondarySelectChange?: (val: string) => void;
  showSearch?: boolean;
  showExport?: boolean;
  showFilter?: boolean;
  showAdd?: boolean;
  showCopy?: boolean;
  onAddClick?: () => void;
  onFilterClick?: () => void;
  onSearchClick?: () => void;
  onCopyClick?: () => void;
  onExportClick?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export const ViewHeader: React.FC<ViewHeaderProps> = ({
  selectOptions,
  selectValue,
  selectPlaceholder = "Todos los estados",
  onSelectChange,
  secondarySelectOptions,
  secondarySelectValue,
  secondarySelectPlaceholder = "Seleccionar...",
  onSecondarySelectChange,
  showSearch = true,
  showExport = false,
  showFilter = false,
  showAdd = false,
  showCopy = false,
  onAddClick,
  onFilterClick,
  onSearchClick,
  onCopyClick,
  onExportClick,
  actions,
  className,
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 mb-6 ${className ?? ''}`}>
      <div className="flex items-center gap-3">
        {selectOptions && selectOptions.length > 0 && (
          <div className="w-48">
            <Select
              options={selectOptions}
              value={selectValue}
              placeholder={selectPlaceholder}
              onChange={(val) => onSelectChange?.(val)}
            />
          </div>
        )}
        {secondarySelectOptions && secondarySelectOptions.length > 0 && (
          <div className="w-48">
            <Select
              options={secondarySelectOptions}
              value={secondarySelectValue}
              placeholder={secondarySelectPlaceholder}
              onChange={(val) => onSecondarySelectChange?.(val)}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {showSearch && (
          <Button variant="ghost" size="icon" aria-label="Buscar" onClick={onSearchClick} className="rounded-full bg-tertiary border border-table-border hover:bg-[#393738]">
            <Search className="w-5 h-5" />
          </Button>
        )}
        {showFilter && (
          <Button variant="ghost" size="icon" aria-label="Filtrar" onClick={onFilterClick} className="rounded-full bg-tertiary border border-table-border hover:bg-[#393738]">
            <Filter className="w-5 h-5" />
          </Button>
        )}
        {showAdd && (
          <Button variant="ghost" size="icon" aria-label="Agregar" onClick={onAddClick} className="rounded-full bg-tertiary border border-table-border hover:bg-[#393738]">
            <Plus className="w-5 h-5" />
          </Button>
        )}
        {showCopy && (
          <Button variant="ghost" size="icon" aria-label="Descargar reporte" onClick={onCopyClick} className="rounded-full bg-tertiary border border-table-border hover:bg-[#393738]">
            <FileDown className="w-5 h-5" />
          </Button>
        )}
        {showExport && (
          <Button variant="ghost" size="icon" aria-label="Exportar" onClick={onExportClick} className="rounded-full bg-tertiary border border-table-border hover:bg-[#393738]">
            <FileText className="w-5 h-5" />
          </Button>
        )}
        {actions}
      </div>
    </div>
  );
};
