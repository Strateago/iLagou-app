export interface Route {
  id: number;
  name: string;
  startAddress: string;
  endAddress: string;
  status: 'safe' | 'warning' | 'danger';
  lastUpdate: string;
  riskLevel: number;
  coordinates?: {
    start: { latitude: number; longitude: number };
    end: { latitude: number; longitude: number };
  };
}

export interface Alert {
  id: number;
  routeId: number;
  routeName: string;
  type: 'flood_warning' | 'road_closed' | 'heavy_rain' | 'all_clear';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  highRiskOnly: boolean;
  autoRefresh: boolean;
}