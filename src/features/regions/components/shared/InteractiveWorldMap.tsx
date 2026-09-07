import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Plus, Minus, Move } from 'lucide-react';

const geoUrl = "/world-countries.json";

export interface MapMarker {
  id: string;
  coordinates: [number, number];
  color: string;
  label: string;
  subLabel?: string;
  type?: 'dot' | 'gps';
}

interface InteractiveWorldMapProps {
  markers: MapMarker[];
  /** Códigos numéricos ISO 3166-1 de países a resaltar */
  highlightedCountryCodes?: string[];
  /** Modo de visualización: whitelist (verde marca), risk (rojo) o traveling (verde marca GPS) */
  mode?: 'whitelist' | 'risk' | 'traveling';
  markerType?: 'dot' | 'gps';
}

export const InteractiveWorldMap: React.FC<InteractiveWorldMapProps> = ({
  markers,
  highlightedCountryCodes = [],
  mode = 'whitelist',
  markerType,
}) => {
  const highlightedSet = new Set(highlightedCountryCodes);
  const [position, setPosition] = React.useState({ coordinates: [0, 10] as [number, number], zoom: 1 });

  const isRiskMode = mode === 'risk';
  const isTravelingMode = mode === 'traveling';

  // Colores corporativos SysAF
  let fillColor = 'rgba(29, 164, 147, 0.45)';
  let fillHoverColor = 'rgba(29, 164, 147, 0.65)';
  let strokeColor = '#1DA493';

  if (isRiskMode) {
    fillColor = 'rgba(239, 68, 68, 0.45)';
    fillHoverColor = 'rgba(239, 68, 68, 0.65)';
    strokeColor = '#EF4444';
  }

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.3 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 0.8) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.3 }));
  };

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setPosition(newPosition);
  };

  return (
    <div className="w-full h-full bg-[#1A191B] rounded-2xl overflow-hidden relative shadow-2xl shadow-black/70 flex items-center justify-center group cursor-grab active:cursor-grabbing select-none">
      {/* Botones flotantes de Zoom */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-[#1E1D1F]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#3A393C]/60 shadow-lg">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#2A292A] hover:bg-[#3A393C] text-white transition-colors"
          title="Acercar mapa (+)"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#2A292A] hover:bg-[#3A393C] text-white transition-colors"
          title="Alejar mapa (-)"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Indicador discreto para arrastrar en esquina inferior */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E1D1F]/80 backdrop-blur-md text-[11px] text-gray-400 border border-[#3A393C]/40 pointer-events-none">
        <Move
          className={`w-3 h-3 ${
            isRiskMode ? 'text-[#EF4444]' : 'text-[#1DA493]'
          }`}
        />
        <span>Arrastra para mover el mapa (360°)</span>
      </div>

      {/* Badge indicador de modo */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1E1D1F]/90 backdrop-blur-md border border-[#3A393C]/60 text-xs font-semibold shadow-lg">
        <span
          className={`w-2 h-2 rounded-full ${
            isRiskMode
              ? 'bg-[#EF4444] animate-pulse'
              : 'bg-[#1DA493] animate-pulse'
          }`}
        ></span>
        <span
          className={
            isRiskMode ? 'text-red-400' : 'text-[#1DA493]'
          }
        >
          {isRiskMode
            ? 'Modo Zonas de Riesgo'
            : isTravelingMode
            ? 'Geolocalización GPS - Clientes en Viaje'
            : 'Modo Whitelist Global'}
        </span>
      </div>

      <ComposableMap
        projectionConfig={{ scale: 200, center: [0, 10] }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={0.8}
          maxZoom={5}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHighlighted = highlightedSet.has(String(geo.id));
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHighlighted ? fillColor : '#2A292A'}
                    stroke={isHighlighted ? strokeColor : '#3A393C'}
                    strokeWidth={isHighlighted ? 1 : 0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: {
                        fill: isHighlighted ? fillHoverColor : '#353436',
                        outline: 'none',
                      },
                      pressed: { fill: isHighlighted ? strokeColor : '#454447', outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {markers.map((marker) => {
            const isGps = markerType === 'gps' || marker.type === 'gps' || isTravelingMode;

            if (isGps) {
              return (
                <Marker key={marker.id} coordinates={marker.coordinates}>
                  {/* Anillo de pulso GPS con color corporativo #1DA493 */}
                  <circle
                    r={12}
                    fill="rgba(29, 164, 147, 0.25)"
                    className="animate-ping pointer-events-none"
                  />
                  <circle
                    r={6}
                    fill="rgba(29, 164, 147, 0.5)"
                    stroke="#1DA493"
                    strokeWidth={1.5}
                  />
                  {/* Pin de ubicación GPS */}
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    fill="#1DA493"
                    stroke="#1A191B"
                    strokeWidth={1.2}
                    transform="translate(-12, -22) scale(0.95)"
                    className="drop-shadow-lg"
                  />
                  <text
                    textAnchor="middle"
                    y={-24}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      fill: '#FFFFFF',
                      fontWeight: 600,
                    }}
                    className="pointer-events-none drop-shadow-md"
                  >
                    {marker.label}
                  </text>
                  {marker.subLabel && (
                    <text
                      textAnchor="middle"
                      y={16}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '8px',
                        fill: '#1DA493',
                        fontWeight: 500,
                      }}
                      className="pointer-events-none drop-shadow-md"
                    >
                      {marker.subLabel}
                    </text>
                  )}
                </Marker>
              );
            }

            return (
              <Marker key={marker.id} coordinates={marker.coordinates}>
                <circle
                  r={5}
                  fill={marker.color || '#1DA493'}
                  stroke="#1A191B"
                  strokeWidth={2}
                  className="drop-shadow-lg"
                />
                <text
                  textAnchor="middle"
                  y={-12}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    fill: '#D1D5DB',
                    fontWeight: 600,
                  }}
                  className="pointer-events-none drop-shadow-md"
                >
                  {marker.label}
                </text>
                {marker.subLabel && (
                  <text
                    textAnchor="middle"
                    y={20}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '8px',
                      fill: '#9CA3AF',
                    }}
                    className="pointer-events-none drop-shadow-md"
                  >
                    {marker.subLabel}
                  </text>
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};
