import React from 'react';
import { Clock, Activity } from 'lucide-react';
import { Select } from '../../../components/ui/Select';

interface Option {
  label: string;
  value: string;
}

interface DashboardFiltersProps {
  periods: Option[];
  selectedPeriod: string;
  onPeriodChange: (val: string) => void;
  metricTypes: Option[];
  selectedMetricType: string;
  onMetricTypeChange: (val: string) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  periods,
  selectedPeriod,
  onPeriodChange,
  metricTypes,
  selectedMetricType,
  onMetricTypeChange
}) => {
  return (
    <div className="flex items-center gap-3">
      <Select 
        options={periods} 
        value={selectedPeriod} 
        onChange={onPeriodChange} 
        icon={<Clock className="w-4 h-4 text-gray-400" />}
      />
      <Select 
        options={metricTypes} 
        value={selectedMetricType} 
        onChange={onMetricTypeChange} 
        icon={<Activity className="w-4 h-4 text-gray-400" />}
      />
    </div>
  );
};
