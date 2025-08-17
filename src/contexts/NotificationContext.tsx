import React, { createContext, useState, useContext, ReactNode } from 'react';

// Interfaces importadas ou definidas aqui, se necessário
export interface Alert {
  id: number;
  routeName: string;
  type: 'flood_warning' | 'road_closed' | 'heavy_rain' | 'all_clear' | 'unknown';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
}

const initialAlerts: Alert[] = [
    {
      id: 1,
      routeName: 'Escola - Ana Clara',
      type: 'flood_warning',
      message: 'Possibilidade de alagamento na Av. das Nações devido à chuva intensa.',
      timestamp: '2 min atrás',
      severity: 'high',
      isRead: false,
    },
    {
      id: 2,
      routeName: 'Shopping Eldorado',
      type: 'heavy_rain',
      message: 'Chuva forte prevista para os próximos 30 minutos na região.',
      timestamp: '15 min atrás',
      severity: 'medium',
      isRead: false,
    },
    {
      id: 3,
      routeName: 'Casa - Trabalho',
      type: 'all_clear',
      message: 'Condições normais. Nenhum risco de alagamento detectado.',
      timestamp: '1 hora atrás',
      severity: 'low',
      isRead: true,
    },
    {
      id: 4,
      routeName: 'Shopping Eldorado',
      type: 'road_closed',
      message: 'Via temporariamente interditada devido ao acúmulo de água.',
      timestamp: '2 horas atrás',
      severity: 'high',
      isRead: true,
    },
  ];

interface NotificationsContextType {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  highRiskOnly: boolean;
  setHighRiskOnly: (onlyHigh: boolean) => void;
  alerts: Alert[];
  addAlert: (newAlert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => void;
  markAlertAsRead: (id: number) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Função auxiliar para formatar a data
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const addAlert = (newAlert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => {
    if (!notificationsEnabled) return;

    const shouldNotify = highRiskOnly ? newAlert.severity === 'high' : true;

    if (shouldNotify) {
      const alert: Alert = {
        id: Date.now(),
        ...newAlert,
        timestamp: formatDate(new Date()),
        isRead: false,
      };
      setAlerts(currentAlerts => [alert, ...currentAlerts]);
    }
  };

  const markAlertAsRead = (id: number) => {
    setAlerts(currentAlerts =>
      currentAlerts.map(alert => (alert.id === id ? { ...alert, isRead: true } : alert))
    );
  };

  const value = {
    notificationsEnabled,
    setNotificationsEnabled,
    highRiskOnly,
    setHighRiskOnly,
    alerts,
    addAlert,
    markAlertAsRead,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};