import React, { useMemo } from 'react';
import { Plane, Calendar, User, ShieldCheck, Navigation } from 'lucide-react';
import { InteractiveWorldMap } from '../shared/InteractiveWorldMap';
import type { MapMarker } from '../shared/InteractiveWorldMap';
import { useTravelingClients } from '../../hooks/useTravelingClients';
import type { TravelingClient } from '../../hooks/useTravelingClients';

/* ─────────────────────────────────────────────
   Card para Cliente en Viaje (Verde SysAF / GPS)
───────────────────────────────────────────── */
const TravelingClientCard: React.FC<{ client: TravelingClient }> = ({ client }) => {
  return (
    <div className="rounded-xl p-3 bg-[#1E1D1F] border border-[#1DA493]/30 shadow-md shadow-[#1DA493]/5 flex flex-col gap-2 transition-all">
      {/* Fila superior: Cliente e Icono */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-[#2A292A] border border-[#1DA493]/40 flex items-center justify-center text-[#1DA493]">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{client.clientName}</p>
            <p className="text-xs text-gray-400 font-mono truncate">{client.clientId}</p>
          </div>
        </div>

        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1DA493]/15 text-[#1DA493] border border-[#1DA493]/30 shrink-0 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1DA493] animate-pulse"></span>
          <span>{client.status}</span>
        </span>
      </div>

      {/* Ubicación destino con Bandera */}
      <div className="flex items-center gap-2 bg-[#141315] p-2 rounded-lg border border-[#2A292A]">
        <span className="text-base shrink-0">{client.flag || '🌎'}</span>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1 text-xs font-semibold text-white truncate">
            <Plane className="w-3 h-3 text-[#1DA493] shrink-0" />
            <span className="truncate">{client.city}, {client.country}</span>
          </div>
          {client.reason && (
            <span className="text-[10px] text-gray-400 truncate italic">{client.reason}</span>
          )}
        </div>
      </div>

      {/* Fila inferior: Fechas e Integración Whitelist */}
      <div className="flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1 text-gray-300">
          <Calendar className="w-3 h-3 text-[#1DA493] shrink-0" />
          <span>{client.startDate} al {client.endDate}</span>
        </div>

        <div className="flex items-center gap-1 text-emerald-400 font-medium">
          <ShieldCheck className="w-3 h-3" />
          <span>{client.autoWhitelistIp ? 'Auto-Whitelist' : 'Manual'}</span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Pestaña Clientes en Viaje (Layout 2 Columnas)
───────────────────────────────────────────── */
export const TravelingClientsTab: React.FC = () => {
  const { activeClients } = useTravelingClients();

  // Marcadores de mapa con icono GPS (Color #1DA493 corporativo)
  const mapMarkers: MapMarker[] = useMemo(() => {
    return activeClients.map((client) => ({
      id: client.id,
      coordinates: client.coordinates,
      color: '#1DA493',
      label: client.clientName.split(' ')[0],
      subLabel: `${client.city}, ${client.country}`,
      type: 'gps',
    }));
  }, [activeClients]);

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      {/* ── Barra Superior Informativa ── */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#2A292A] border border-[#3A393C] text-[#1DA493]">
            <Navigation className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Monitoreo GPS de Clientes en Viaje</h3>
            <p className="text-xs text-gray-400">
              Solo se muestran permisos de viaje con estado <span className="text-[#1DA493] font-medium">Vigente</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#1A191B] px-3 py-1.5 rounded-xl border border-[#3A393C] text-xs font-semibold text-white">
          <span className="w-2 h-2 rounded-full bg-[#1DA493] animate-ping"></span>
          <span>{activeClients.length} Viajes Activos</span>
        </div>
      </div>

      {/* ── Layout 2 Columnas: Mapa GPS | Panel Cards ── */}
      <div className="flex-1 flex gap-5 min-h-0">
        {/* Mapa — ocupa el espacio restante */}
        <div className="flex-1 min-w-0 h-full">
          <InteractiveWorldMap
            markers={mapMarkers}
            mode="traveling"
            markerType="gps"
          />
        </div>

        {/* Panel lateral de tarjetas de clientes en viaje */}
        <div className="w-80 shrink-0 flex flex-col h-full bg-[#1A191B] p-3 rounded-2xl shadow-2xl shadow-black/70 min-h-0 border border-[#2A292A]">
          {/* Cabecera del panel */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2A292A] shrink-0">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-[#1DA493]" />
              <span className="text-sm font-semibold text-white">Clientes en Viaje</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {activeClients.length} {activeClients.length === 1 ? 'cliente' : 'clientes'}
            </span>
          </div>

          {/* Cards scrollables */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2.5 min-h-0">
            {activeClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
                <Plane className="w-10 h-10 text-gray-700" />
                <p className="text-sm text-gray-500">No hay clientes con viaje vigente activo.</p>
              </div>
            ) : (
              activeClients.map((client) => (
                <TravelingClientCard key={client.id} client={client} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
