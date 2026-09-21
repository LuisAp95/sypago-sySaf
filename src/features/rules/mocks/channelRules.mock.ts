import type { Channel, Product, ChannelRule } from '../types/channelRules.types';

export const CHANNELS: Channel[] = [
  { id: 'Simf', name: 'Simf', type: 'BAJO_VALOR' },
  { id: 'Sglpar', name: 'Sglpar', type: 'ALTO_VALOR' }
];

export const PRODUCTS: Product[] = [
  // Simf (Bajo Valor) - PROD-01 to PROD-05, we just use 01 to 05 as requested
  { id: '01', name: 'Producto 01', channelId: 'Simf' },
  { id: '02', name: 'Producto 02', channelId: 'Simf' },
  { id: '03', name: 'Producto 03', channelId: 'Simf' },
  { id: '04', name: 'Producto 04', channelId: 'Simf' },
  { id: '05', name: 'Producto 05', channelId: 'Simf' },
  // Sglpar (Alto Valor) - 06 to 11
  { id: '06', name: 'Producto 06', channelId: 'Sglpar' },
  { id: '07', name: 'Producto 07', channelId: 'Sglpar' },
  { id: '08', name: 'Producto 08', channelId: 'Sglpar' },
  { id: '09', name: 'Producto 09', channelId: 'Sglpar' },
  { id: '10', name: 'Producto 10', channelId: 'Sglpar' },
  { id: '11', name: 'Producto 11', channelId: 'Sglpar' },
];

export const INITIAL_CHANNEL_RULES: ChannelRule[] = [
  {
    id: 'rule-001',
    channelId: 'Simf',
    products: ['Todos'], // General assignment for Simf
    status: 'Activo',
    weekday: '001 Entre semana App - N',
    weekend: '002 Fin de semana Web - N',
    holidays: '003 Horario oficina App - J',
    lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19)
  }
];
