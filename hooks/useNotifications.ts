import { useState, useEffect } from 'react';
import { Alert } from '@/types/route';

export interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  highRiskOnly: boolean;
  autoRefresh: boolean;
}

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    highRiskOnly: false,
    autoRefresh: true,
  });

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const shouldShowAlert = (alert: Alert): boolean => {
    if (!settings.pushEnabled) return false;
    if (settings.highRiskOnly && alert.severity !== 'high') return false;
    return true;
  };

  const triggerNotification = (alert: Alert) => {
    if (!shouldShowAlert(alert)) return;

    // Here you would integrate with expo-notifications
    // For now, we'll just log the notification
    console.log('Notification triggered:', alert.message);
  };

  return {
    settings,
    updateSetting,
    shouldShowAlert,
    triggerNotification,
  };
}