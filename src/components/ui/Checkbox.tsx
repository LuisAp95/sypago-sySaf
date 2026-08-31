import React from 'react';
import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onChange, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className="relative flex items-center justify-center w-5 h-5">
        <input
          type="checkbox"
          ref={ref}
          onChange={handleChange}
          className={cn(
            "peer appearance-none w-5 h-5 border border-tertiary rounded bg-primary checked:bg-chart-menu checked:border-chart-menu transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
