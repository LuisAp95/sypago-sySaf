import type { Channel, Product, ChannelRule } from '../types/channelRules.types';

export const CHANNELS: Channel[] = [
  { id: 'Simf', name: 'Simf', type: 'BAJO_VALOR' },
  { id: 'Sglpar', name: 'Sglpar', type: 'ALTO_VALOR' }
];

export const PRODUCTS: Product[] = [
  // Simf (Bajo Valor)
  { id: '223', name: 'Fideicomiso', channelId: 'Simf' },
  { id: '225', name: 'Pago Tarjeta de Crédito', channelId: 'Simf' },
  { id: '229', name: 'Retorno Pago Tarjeta de Crédito', channelId: 'Simf' },
  { id: '222', name: 'Pago a Proveedores', channelId: 'Simf' },
  { id: '150', name: 'Reverso Ordinario', channelId: 'Simf' },
  { id: '220', name: 'Crédito Ordinario', channelId: 'Simf' },
  { id: '221', name: 'Pago de Nómina', channelId: 'Simf' },
  { id: '224', name: 'Bonificación Patria', channelId: 'Simf' },
  // Sglpar (Alto Valor)
  { id: '410', name: 'Por Instrucciones del Cliente', channelId: 'Sglpar' },
  { id: '422', name: 'Liquidación operaciones Alto Valor', channelId: 'Sglpar' },
  { id: '462', name: 'Traspaso de Fondos Organismos Públicos', channelId: 'Sglpar' },
  { id: '548', name: 'Enteramiento Recaudado al Seniat', channelId: 'Sglpar' },
  { id: '552', name: 'Enteramiento Recaudado por el BCV al Seniat', channelId: 'Sglpar' },
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
