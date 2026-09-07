import React, { useState, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { Plus, Minus, Move, BarChart2, ShieldAlert, Layers } from 'lucide-react';
import {
  VENEZUELA_STATES,
  MAX_TRANSACTIONS,
  getStateColor,
  getStrokeColor,
} from '../../data/venezuelaStateData';
import type { VenezuelaStateData } from '../../data/venezuelaStateData';

/* ─── GeoJSON local (ahora usando amCharts) ──────────────────────── */
const VE_GEO_URL = '/venezuela-states.geojson';

/* ─── Tipos ──────────────────────────────────────────────────────── */
type MapMode = 'transaccional' | 'riesgo' | 'ambos';

/* ─── Utilidades ─────────────────────────────────────────────────── */
function findState(name: string): VenezuelaStateData | undefined {
  const n = name.trim().toLowerCase();
  // Manejar tildes y nombres especiales si es necesario
  return VENEZUELA_STATES.find(s => 
    s.name.toLowerCase() === n ||
    s.name.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u') === n
  );
}

function fmtNum(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/* ─── Badge riesgo ───────────────────────────────────────────────── */
const RISK_CLS: Record<string, string> = {
  Crítico: 'bg-red-500/20 text-red-400 border border-red-500/30',
  Alto:    'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  Medio:   'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Bajo:    'bg-[#1DA493]/15 text-[#1DA493] border border-[#1DA493]/30',
};
const RiskBadge: React.FC<{ risk: VenezuelaStateData['risk'] }> = ({ risk }) => (
  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${RISK_CLS[risk]}`}>{risk}</span>
);

/* ─── Toggle capas ───────────────────────────────────────────────── */
const ToggleBar: React.FC<{ mode: MapMode; onChange: (m: MapMode) => void }> = ({ mode, onChange }) => {
  const opts: { id: MapMode; label: string; icon: React.ReactNode }[] = [
    { id: 'transaccional', label: 'Tráfico Transaccional', icon: <BarChart2  className="w-3.5 h-3.5" /> },
    { id: 'riesgo',        label: 'Riesgo y Fraude',       icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { id: 'ambos',         label: 'Ambos',                  icon: <Layers     className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="flex items-center p-1 bg-[#1A191B] border border-[#3A393C] rounded-xl gap-0.5 shadow-inner">
      {opts.map(o => {
        const active = mode === o.id;
        const cls = active
          ? o.id === 'riesgo' ? 'bg-[#EF4444] text-white shadow-md'
          : o.id === 'ambos'  ? 'bg-gradient-to-r from-[#1DA493] to-[#EF4444] text-white shadow-md'
          :                     'bg-[#1DA493] text-white shadow-md'
          : 'text-gray-400 hover:text-gray-200 hover:bg-[#252425]';
        return (
          <button key={o.id} onClick={() => onChange(o.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${cls}`}>
            {o.icon}<span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
};

/* ─── Leyenda ────────────────────────────────────────────────────── */
const MapLegend: React.FC<{ mode: MapMode }> = ({ mode }) => {
  const swatches =
    mode === 'transaccional'
      ? ['#2A292A', 'rgba(29,164,147,0.4)', 'rgba(29,164,147,0.7)', 'rgba(29,164,147,1)']
      : mode === 'riesgo'
      ? ['#2A292A', 'rgba(251,191,36,0.6)', 'rgba(249,115,22,0.8)', 'rgba(239,68,68,1)']
      : ['#2A292A', 'rgba(29,164,147,0.7)', 'rgba(249,115,22,0.8)', 'rgba(239,68,68,1)'];
  const label = mode === 'transaccional' ? 'Bajo → Alto volumen' : 'Bajo → Crítico';
  return (
    <div className="absolute bottom-3 right-3 z-10 bg-[#141316]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-[#2A292A]/80 flex items-center gap-2 pointer-events-none shadow-md">
      {swatches.map((c, i) => <div key={i} className="w-5 h-3 rounded-sm border border-white/5" style={{ background: c }} />)}
      <span className="text-[10px] text-gray-400 ml-1">{label}</span>
    </div>
  );
};

/* ─── Mapa interactivo ────────────────────────────────────────────── */
const VenezuelaMap: React.FC<{
  mode: MapMode;
  selectedState: string | null;
  onSelectState: (name: string | null) => void;
}> = ({ mode, selectedState, onSelectState }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [zoom, setZoom]       = useState(1);
  const [center, setCenter]   = useState<[number, number]>([-66.5, 7]); // Centro de Vzla

  const modeLabel = mode === 'transaccional' ? 'Tráfico Transaccional' : mode === 'riesgo' ? 'Riesgo y Fraude' : 'Tráfico + Riesgo';
  const modeDot   = mode === 'riesgo' ? 'bg-[#EF4444]' : 'bg-[#1DA493]';
  const modeTxt   = mode === 'riesgo' ? 'text-red-400'  : 'text-[#1DA493]';

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGPathElement>, text: string) => {
    const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement);
    const rect = svg.getBoundingClientRect();
    setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 30, text });
  }, []);

  return (
    <div className="w-full h-full bg-[#1A191B] rounded-2xl overflow-hidden relative shadow-2xl shadow-black/70 cursor-grab active:cursor-grabbing select-none">
      
      {/* Badge modo */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1E1D1F]/90 backdrop-blur-md border border-[#3A393C]/60 text-xs font-semibold shadow-lg">
        <span className={`w-2 h-2 rounded-full ${modeDot} animate-pulse`} />
        <span className={modeTxt}>{modeLabel}</span>
      </div>

      {/* Zoom */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-[#1E1D1F]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#3A393C]/60 shadow-lg">
        <button onClick={() => setZoom(z => Math.min(z * 1.4, 12))}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#2A292A] hover:bg-[#3A393C] text-white transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom(z => Math.max(z / 1.4, 0.85))}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#2A292A] hover:bg-[#3A393C] text-white transition-colors cursor-pointer">
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Drag hint */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E1D1F]/80 backdrop-blur-md text-[11px] text-gray-400 border border-[#3A393C]/40 pointer-events-none">
        <Move className="w-3 h-3 text-[#1DA493]" />
        <span>Arrastra · Zoom con scroll</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute z-20 pointer-events-none px-2.5 py-1.5 rounded-lg bg-[#1A191B] border border-[#3A393C] text-xs text-white shadow-xl whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}

      <MapLegend mode={mode} />

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 3200 }}
        width={800}
        height={800}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ zoom: z, coordinates }) => { setZoom(z); setCenter(coordinates); }}
          minZoom={0.85}
          maxZoom={12}
        >
          <Geographies geography={VE_GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const rawName: string = geo.properties?.name || '';
                // Ignoramos paises/islas vecinas del dataset amcharts (Aruba, Curacao, etc)
                if (['Aruba', 'Curaçao', 'Bonaire, Saint Eustachius and Saba', 'Trinidad and Tobago'].includes(rawName)) return null;

                const stateData  = findState(rawName);
                const isSelected = selectedState === (stateData?.name ?? rawName);

                const fillDef    = getStateColor(stateData, mode);
                const fillHover  = getStateColor(stateData, mode, true);
                const strokeDef  = isSelected ? '#FFFFFF' : getStrokeColor(stateData, mode);
                const sw         = isSelected ? 1.8 / zoom : 0.7 / zoom;

                let shadowVal = 'none';
                if ((mode === 'riesgo' || mode === 'ambos') && stateData) {
                   if (stateData.risk === 'Crítico') shadowVal = 'drop-shadow(0px 0px 8px rgba(239, 68, 68, 0.9))';
                   else if (stateData.risk === 'Alto') shadowVal = 'drop-shadow(0px 0px 6px rgba(249, 115, 22, 0.7))';
                   else if (stateData.risk === 'Medio') shadowVal = 'drop-shadow(0px 0px 4px rgba(251, 191, 36, 0.4))';
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: fillDef,   stroke: strokeDef, strokeWidth: sw,         outline: 'none', transition: 'all 250ms', filter: shadowVal },
                      hover:   { fill: fillHover, stroke: '#FFFFFF', strokeWidth: 1.2 / zoom, outline: 'none', cursor: 'pointer', transition: 'all 250ms', filter: shadowVal },
                      pressed: { fill: fillHover, stroke: '#FFFFFF', strokeWidth: 1.5 / zoom, outline: 'none', filter: shadowVal },
                    }}
                    onClick={() => onSelectState(isSelected ? null : (stateData?.name ?? rawName))}
                    onMouseMove={e => {
                      const extra = stateData
                        ? ` · ${fmtNum(stateData.transactions)} tx · ${stateData.fraudRatio}% fraude`
                        : '';
                      handleMouseMove(e as unknown as React.MouseEvent<SVGPathElement>,
                        `${stateData?.name ?? rawName}${extra}`);
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

/* ─── Card de estado ─────────────────────────────────────────────── */
const StateCard: React.FC<{
  state: VenezuelaStateData; rank: number; mode: MapMode; isSelected: boolean; onClick: () => void;
}> = ({ state, rank, mode, isSelected, onClick }) => {
  const txPct = Math.round((state.transactions / MAX_TRANSACTIONS) * 100);
  return (
    <button onClick={onClick}
      className={`w-full text-left rounded-xl p-3 flex flex-col gap-2 transition-all shadow-md border cursor-pointer ${
        isSelected ? 'bg-[#252425] border-[#1DA493]/60 ring-1 ring-[#1DA493]/30' : 'bg-[#1E1D1F] border-[#2A292A] hover:border-[#3A393C]'
      }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 w-5 h-5 rounded-full bg-[#2A292A] border border-[#3A393C] flex items-center justify-center text-[10px] font-bold text-gray-400">
            {rank}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{state.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{state.capital}</p>
          </div>
        </div>
        <RiskBadge risk={state.risk} />
      </div>
      <div className="flex items-center gap-3">
        {(mode === 'transaccional' || mode === 'ambos') && (
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><BarChart2 className="w-2.5 h-2.5 text-[#1DA493]" /> Transacciones</span>
              <span className="font-mono text-[#1DA493] font-semibold">{fmtNum(state.transactions)}</span>
            </div>
            <div className="h-1 rounded-full bg-[#2A292A] overflow-hidden">
              <div className="h-full rounded-full bg-[#1DA493] transition-all" style={{ width: `${txPct}%` }} />
            </div>
          </div>
        )}
        {(mode === 'riesgo' || mode === 'ambos') && (
          <div className="flex flex-col items-end gap-0.5 shrink-0">
            <span className="text-[10px] text-gray-400">Fraude</span>
            <span className="text-xs font-bold text-red-400 font-mono">{state.fraudRatio}%</span>
          </div>
        )}
      </div>
    </button>
  );
};

/* ─── Vista principal ────────────────────────────────────────────── */
export const VenezuelaMapTab: React.FC = () => {
  const [mapMode, setMapMode]         = useState<MapMode>('transaccional');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const sortedStates = [...VENEZUELA_STATES].sort((a, b) =>
    mapMode === 'riesgo' ? b.fraudRatio - a.fraudRatio : b.transactions - a.transactions
  );
  const selectedData = VENEZUELA_STATES.find(s => s.name === selectedState);

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      {/* Cabecera */}
      <div className="flex items-center justify-between gap-3 flex-wrap shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#2A292A] border border-[#3A393C] text-[#1DA493]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Mapa Transaccional de Venezuela</h3>
            <p className="text-xs text-gray-400">Actividad por estado · Datos en tiempo real simulado</p>
          </div>
        </div>
        <ToggleBar mode={mapMode} onChange={m => { setMapMode(m); setSelectedState(null); }} />
      </div>

      {/* 2 columnas */}
      <div className="flex-1 flex gap-5 min-h-0">
        {/* Mapa SVG interactivo */}
        <div className="flex-1 min-w-0 h-full">
          <VenezuelaMap mode={mapMode} selectedState={selectedState} onSelectState={setSelectedState} />
        </div>

        {/* Panel derecho */}
        <div className="w-80 shrink-0 flex flex-col h-full bg-[#1A191B] p-3 rounded-2xl shadow-2xl shadow-black/70 min-h-0 border border-[#2A292A]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2A292A] shrink-0">
            <div className="flex items-center gap-2">
              {mapMode === 'riesgo'
                ? <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                : <BarChart2   className="w-4 h-4 text-[#1DA493]" />}
              <span className="text-sm font-semibold text-white">
                {mapMode === 'riesgo' ? 'Mayor Riesgo' : mapMode === 'transaccional' ? 'Mayor Actividad' : 'Ranking Combinado'}
              </span>
            </div>
            <span className="text-xs text-gray-400">{VENEZUELA_STATES.length} estados</span>
          </div>

          {/* Detalle seleccionado */}
          {selectedData && (
            <div className="mb-3 p-3 rounded-xl bg-[#252425] border border-[#1DA493]/40 shrink-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm font-bold text-white">{selectedData.name}</p>
                  <p className="text-xs text-gray-400">Capital: {selectedData.capital}</p>
                </div>
                <RiskBadge risk={selectedData.risk} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Transacciones', val: fmtNum(selectedData.transactions), cls: 'text-[#1DA493]' },
                  { label: '% Fraude',      val: `${selectedData.fraudRatio}%`,      cls: 'text-red-400'   },
                  { label: 'Alertas',       val: String(selectedData.fraudCount),    cls: 'text-orange-400'},
                ].map(({ label, val, cls }) => (
                  <div key={label} className="bg-[#1A191B] rounded-lg p-1.5">
                    <p className="text-[10px] text-gray-500">{label}</p>
                    <p className={`text-sm font-bold ${cls}`}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2 min-h-0">
            {sortedStates.map((s, i) => (
              <StateCard
                key={s.name}
                state={s}
                rank={i + 1}
                mode={mapMode}
                isSelected={selectedState === s.name}
                onClick={() => setSelectedState(p => p === s.name ? null : s.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
