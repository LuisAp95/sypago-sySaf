import React, { useEffect, useState } from 'react';
import { Loader } from '@/components/ui/Loader';
import { api } from '../../../mocks/api';
import type { VersionRelease } from '../types/version.types';
import { VersionCard } from './VersionCard';

export const VersionsView: React.FC = () => {
  const [releases, setReleases] = useState<VersionRelease[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setIsLoading(true);
        const data = await api.getVersions();
        setReleases(data as VersionRelease[]);
      } catch (err) {
        console.error("Error al cargar las versiones:", err);
        setError("No se pudieron cargar las versiones del motor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersions();
  }, []);

  if (isLoading) {
    return <Loader text="Cargando historial de versiones..." size="md" minHeight="min-h-[300px]" />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/30 border border-red-800/50 rounded-xl text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full">
      {releases.map((release) => (
        <VersionCard key={release.id} release={release} />
      ))}
    </div>
  );
};
