import { Route, Alert } from '@/types/route';

export const mockRoutes: Route[] = [
  {
    id: 1,
    name: 'Casa - Trabalho',
    startAddress: 'Rua das Flores, 123 - Vila Madalena',
    endAddress: 'Av. Paulista, 1000 - Bela Vista',
    status: 'safe',
    lastUpdate: '10 min atrás',
    riskLevel: 15,
    coordinates: {
      start: { latitude: -23.5505, longitude: -46.6333 },
      end: { latitude: -23.5614, longitude: -46.6558 },
    },
  },
  {
    id: 2,
    name: 'Shopping Eldorado',
    startAddress: 'Casa',
    endAddress: 'Shopping Eldorado - Pinheiros',
    status: 'warning',
    lastUpdate: '5 min atrás',
    riskLevel: 65,
    coordinates: {
      start: { latitude: -23.5505, longitude: -46.6333 },
      end: { latitude: -23.5629, longitude: -46.6918 },
    },
  },
  {
    id: 3,
    name: 'Escola - Ana Clara',
    startAddress: 'Casa',
    endAddress: 'Colégio Santa Maria - Jardins',
    status: 'danger',
    lastUpdate: '2 min atrás',
    riskLevel: 85,
    coordinates: {
      start: { latitude: -23.5505, longitude: -46.6333 },
      end: { latitude: -23.5489, longitude: -46.6388 },
    },
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 1,
    routeId: 3,
    routeName: 'Escola - Ana Clara',
    type: 'flood_warning',
    message: 'Possibilidade de alagamento na Av. das Nações devido à chuva intensa. Considere rota alternativa.',
    timestamp: '2 min atrás',
    severity: 'high',
    isRead: false,
  },
  {
    id: 2,
    routeId: 2,
    routeName: 'Shopping Eldorado',
    type: 'heavy_rain',
    message: 'Chuva forte prevista para os próximos 30 minutos na região. Dirija com cuidado.',
    timestamp: '15 min atrás',
    severity: 'medium',
    isRead: false,
  },
  {
    id: 3,
    routeId: 1,
    routeName: 'Casa - Trabalho',
    type: 'all_clear',
    message: 'Condições normais. Nenhum risco de alagamento detectado na sua rota.',
    timestamp: '1 hora atrás',
    severity: 'low',
    isRead: true,
  },
  {
    id: 4,
    routeId: 2,
    routeName: 'Shopping Eldorado',
    type: 'road_closed',
    message: 'Via temporariamente interditada devido ao acúmulo de água na Rua Augusta.',
    timestamp: '2 horas atrás',
    severity: 'high',
    isRead: true,
  },
];

export const getWeatherTip = () => {
  const tips = [
    {
      title: 'Chuva Forte Prevista',
      text: 'Evite vias baixas e próximas a córregos durante chuvas intensas.',
    },
    {
      title: 'Dica de Segurança',
      text: 'Mantenha sempre uma rota alternativa em mente para emergências.',
    },
    {
      title: 'Prevenção',
      text: 'Verifique os alertas antes de sair de casa, especialmente em dias chuvosos.',
    },
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
};