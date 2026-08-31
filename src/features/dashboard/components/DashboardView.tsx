import React, { useState, useEffect } from 'react';
import { Loader } from '@/components/ui/Loader';
import { api } from '../../../mocks/api';

import { DashboardFilters } from './DashboardFilters';
import { DashboardChart } from './DashboardChart';
import { MetricCard } from './MetricCard';
import { DashboardNotifications } from './DashboardNotifications';
import { DashboardActions } from './DashboardActions';

export const DashboardView: React.FC = () => {
  const [filters, setFilters] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<string>('24h');
  const [selectedMetricType, setSelectedMetricType] = useState<string>('cantidades');

  const [isLoading, setIsLoading] = useState(true);

  // Cargar filtros una sola vez
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const filtersData = await api.getDashboardFilters();
        setFilters(filtersData);
        if (filtersData.periods?.length > 0) setSelectedPeriod(filtersData.periods[0].value);
        if (filtersData.metricTypes?.length > 0) setSelectedMetricType(filtersData.metricTypes[0].value);
      } catch (error) {
        console.error("Error fetching dashboard filters:", error);
      }
    };
    fetchFilters();
  }, []);

  // Cargar datos del dashboard cuando cambien los filtros
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const result = await api.getDashboardStats(selectedPeriod, selectedMetricType);
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [selectedPeriod, selectedMetricType]);

  if (!filters) {
    return <Loader text="Cargando filtros..." size="md" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <DashboardFilters
          periods={filters.periods || []}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          metricTypes={filters.metricTypes || []}
          selectedMetricType={selectedMetricType}
          onMetricTypeChange={setSelectedMetricType}
        />
        {isLoading && (
          <Loader size="sm" fullWidth={false} fullHeight={false} />
        )}
      </div>

      {data && (
        <div className={`transition-all duration-500 ${isLoading ? 'pointer-events-none' : ''}`}>
          {/* Main Chart Section: Operaciones */}
          <DashboardChart legend={data.chartLegend} data={data.chartData} />

          {/* Metrics Row: 3 Metric Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
            {data.metricCards?.map((card: any) => (
              <MetricCard key={card.id} card={card} />
            ))}
          </div>

          {/* Bottom Row: Notifications & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-6">
            <DashboardNotifications notifications={data.notifications || []} />
            <DashboardActions />
          </div>
        </div>
      )}
    </div>
  );
};
