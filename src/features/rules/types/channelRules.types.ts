export type ChannelType = 'BAJO_VALOR' | 'ALTO_VALOR';

export interface Channel {
  id: string; // 'Simf' | 'Sglpar'
  name: string;
  type: ChannelType;
}

export interface Product {
  id: string; // e.g. '01', '02', '03'
  name: string;
  channelId: string; // 'Simf' | 'Sglpar'
}

export interface ChannelRule {
  id: string;
  channelId: string; // 'Simf' | 'Sglpar'
  products: string[]; // e.g. ['01', '02'] or ['Todos']
  status: 'Activo' | 'Inactivo';
  weekday: string;
  weekend: string;
  holidays: string;
  lastModified: string;
}
