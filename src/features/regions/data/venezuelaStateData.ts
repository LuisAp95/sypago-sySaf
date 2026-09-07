export interface VenezuelaStateData {
  name: string;
  /** Nombre alternativo que puede aparecer en el GeoJSON */
  geoName?: string;
  capital: string;
  transactions: number;
  fraudRatio: number;   // porcentaje
  fraudCount: number;
  risk: 'Crítico' | 'Alto' | 'Medio' | 'Bajo';
}

export const VENEZUELA_STATES: VenezuelaStateData[] = [
  { name: 'Distrito Capital', geoName: 'Distrito Federal', capital: 'Caracas',        transactions: 48200, fraudRatio: 2.5, fraudCount: 18, risk: 'Crítico' },
  { name: 'Zulia',                                         capital: 'Maracaibo',       transactions: 39400, fraudRatio: 2.1, fraudCount: 14, risk: 'Crítico' },
  { name: 'Miranda',                                       capital: 'Los Teques',      transactions: 29800, fraudRatio: 1.3, fraudCount: 5,  risk: 'Alto'    },
  { name: 'Carabobo',                                      capital: 'Valencia',        transactions: 32100, fraudRatio: 1.9, fraudCount: 11, risk: 'Crítico' },
  { name: 'Aragua',                                        capital: 'Maracay',         transactions: 26500, fraudRatio: 1.6, fraudCount: 8,  risk: 'Alto'    },
  { name: 'Lara',                                          capital: 'Barquisimeto',    transactions: 21800, fraudRatio: 1.5, fraudCount: 7,  risk: 'Alto'    },
  { name: 'Anzoátegui',                                    capital: 'Barcelona',       transactions: 19200, fraudRatio: 1.4, fraudCount: 6,  risk: 'Alto'    },
  { name: 'Bolívar',                                       capital: 'Ciudad Bolívar',  transactions: 18900, fraudRatio: 1.7, fraudCount: 9,  risk: 'Alto'    },
  { name: 'La Guaira',                                     capital: 'La Guaira',       transactions: 16800, fraudRatio: 1.8, fraudCount: 7,  risk: 'Alto'    },
  { name: 'Táchira',                                       capital: 'San Cristóbal',   transactions: 15400, fraudRatio: 1.2, fraudCount: 4,  risk: 'Medio'   },
  { name: 'Mérida',                                        capital: 'Mérida',          transactions: 13200, fraudRatio: 1.1, fraudCount: 3,  risk: 'Medio'   },
  { name: 'Nueva Esparta',                                 capital: 'La Asunción',     transactions: 9200,  fraudRatio: 0.8, fraudCount: 2,  risk: 'Medio'   },
  { name: 'Monagas',                                       capital: 'Maturín',         transactions: 12100, fraudRatio: 0.9, fraudCount: 3,  risk: 'Medio'   },
  { name: 'Sucre',                                         capital: 'Cumaná',          transactions: 9800,  fraudRatio: 0.8, fraudCount: 2,  risk: 'Medio'   },
  { name: 'Portuguesa',                                    capital: 'Guanare',         transactions: 8700,  fraudRatio: 0.7, fraudCount: 2,  risk: 'Bajo'    },
  { name: 'Barinas',                                       capital: 'Barinas',         transactions: 7600,  fraudRatio: 0.6, fraudCount: 2,  risk: 'Bajo'    },
  { name: 'Trujillo',                                      capital: 'Trujillo',        transactions: 6900,  fraudRatio: 0.5, fraudCount: 1,  risk: 'Bajo'    },
  { name: 'Falcón',                                        capital: 'Coro',            transactions: 6500,  fraudRatio: 0.5, fraudCount: 1,  risk: 'Bajo'    },
  { name: 'Yaracuy',                                       capital: 'San Felipe',      transactions: 5800,  fraudRatio: 0.4, fraudCount: 1,  risk: 'Bajo'    },
  { name: 'Guárico',                                       capital: 'Calabozo',        transactions: 5200,  fraudRatio: 0.4, fraudCount: 1,  risk: 'Bajo'    },
  { name: 'Cojedes',                                       capital: 'San Carlos',      transactions: 3800,  fraudRatio: 0.3, fraudCount: 1,  risk: 'Bajo'    },
  { name: 'Apure',                                         capital: 'San Fernando',    transactions: 2900,  fraudRatio: 0.2, fraudCount: 0,  risk: 'Bajo'    },
  { name: 'Amazonas',                                      capital: 'Puerto Ayacucho', transactions: 1800,  fraudRatio: 0.1, fraudCount: 0,  risk: 'Bajo'    },
  { name: 'Delta Amacuro',                                 capital: 'Tucupita',        transactions: 1400,  fraudRatio: 0.1, fraudCount: 0,  risk: 'Bajo'    },
  { name: 'Zona en Reclamación',                           capital: 'Tumeremo',        transactions: 0,     fraudRatio: 0,   fraudCount: 0,  risk: 'Bajo'    },
];

export const MAX_TRANSACTIONS = Math.max(...VENEZUELA_STATES.map(s => s.transactions));
export const MAX_FRAUD_RATIO   = Math.max(...VENEZUELA_STATES.map(s => s.fraudRatio));

/* Interpolación lineal de un canal de color */
function lerp(t: number, a: number, b: number): number {
  return Math.round(a + (b - a) * Math.max(0, Math.min(1, t)));
}

export function getStateColor(
  state: VenezuelaStateData | undefined,
  mode: 'transaccional' | 'riesgo' | 'ambos',
  hover = false
): string {
  // Base background for unselected/low activity: Theme Dark Grey
  const darkR = 42, darkG = 41, darkB = 42; 
  
  if (!state) {
    return hover ? '#353436' : `rgb(${darkR}, ${darkG}, ${darkB})`;
  }

  const txRatio = Math.max(0, Math.min(1, state.transactions / MAX_TRANSACTIONS));
  const rrRatio = Math.max(0, Math.min(1, state.fraudRatio   / MAX_FRAUD_RATIO));
  
  const hBoost = hover ? 30 : 0;
  const clamp = (v: number) => Math.round(Math.min(255, Math.max(0, v)));

  // Escala Turquesa/Teal (Transacciones de la app)
  const getTealColor = (t: number) => {
    // #2A292A -> #1DA493 (29, 164, 147)
    return `rgb(${clamp(lerp(t, darkR, 29) + hBoost)},${clamp(lerp(t, darkG, 164) + hBoost)},${clamp(lerp(t, darkB, 147) + hBoost)})`;
  };

  if (mode === 'transaccional' || mode === 'ambos') {
    return getTealColor(txRatio);
  }

  if (mode === 'riesgo') {
    // Para riesgo, usar colores directos según el nivel para que coincida con la leyenda
    if (state.risk === 'Crítico') return hover ? '#F87171' : '#EF4444'; // Red
    if (state.risk === 'Alto')    return hover ? '#FB923C' : '#F97316'; // Orange
    if (state.risk === 'Medio')   return hover ? '#FCD34D' : '#FBBF24'; // Yellow
    return hover ? '#353436' : `rgb(${darkR}, ${darkG}, ${darkB})`;
  }

  return `rgb(${darkR}, ${darkG}, ${darkB})`;
}

export function getStrokeColor(
  state: VenezuelaStateData | undefined,
  mode: 'transaccional' | 'riesgo' | 'ambos'
): string {
  if (!state) return 'rgba(255, 255, 255, 0.05)';
  
  if (mode === 'riesgo' || mode === 'ambos') {
    if (state.risk === 'Crítico') return 'rgba(239, 68, 68, 1)'; // Red
    if (state.risk === 'Alto')    return 'rgba(249, 115, 22, 1)'; // Orange
    if (state.risk === 'Medio')   return 'rgba(251, 191, 36, 0.4)'; // Yellow
    return 'rgba(255, 255, 255, 0.15)';
  }
  
  return 'rgba(255, 255, 255, 0.2)'; 
}
