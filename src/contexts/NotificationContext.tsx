import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import { Vibration } from 'react-native';

export interface Alert {
  id: number;
  routeName: string;
  type: 'flood_warning' | 'road_closed' | 'heavy_rain' | 'all_clear' | 'unknown';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
}

interface NotificationsContextType {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  highRiskOnly: boolean;
  setHighRiskOnly: (onlyHigh: boolean) => void;
  vibrationAlerts: boolean;
  setVibrationAlerts: (vibrate: boolean) => void;
  alerts: Alert[];
  currentAlert: Alert | null;
  addAlert: (newAlert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => void;
  markAlertAsRead: (id: number) => void;
  dismissCurrentAlert: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

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
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [vibrationAlerts, setVibrationAlerts] = useState(true);
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);

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
      setCurrentAlert(alert);

      if (vibrationAlerts) {
        Vibration.vibrate();
      }
    }
  };

  const markAlertAsRead = (id: number) => {
    setAlerts(currentAlerts =>
      currentAlerts.filter(alert => alert.id !== id)
    );
  };
  
  const dismissCurrentAlert = () => {
    setCurrentAlert(null);
  };

  const value = {
    notificationsEnabled,
    setNotificationsEnabled,
    highRiskOnly,
    setHighRiskOnly,
    vibrationAlerts,
    setVibrationAlerts,
    alerts,
    currentAlert,
    addAlert,
    markAlertAsRead,
    dismissCurrentAlert,
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