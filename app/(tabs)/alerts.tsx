import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Bell, BellOff, MapPin, Calendar, Volume2 } from 'lucide-react-native';
import { useNotifications } from '@/src/contexts/NotificationContext';

interface Alert {
  id: number;
  routeName: string;
  type: 'flood_warning' | 'road_closed' | 'heavy_rain' | 'all_clear';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
}

export default function AlertsScreen() {
  const { alerts, markAlertAsRead } = useNotifications();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'flood_warning': return AlertTriangle;
      case 'road_closed': return AlertTriangle;
      case 'heavy_rain': return AlertTriangle;
      case 'all_clear': return CheckCircle;
      default: return Clock;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#FF6B35';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Alta Prioridade';
      case 'medium': return 'Média Prioridade';
      case 'low': return 'Baixa Prioridade';
      default: return 'Normal';
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Alertas</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>Notificações sobre suas rotas</Text>
      </View>

      <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
        {alerts.map((alert) => {
          const AlertIcon = getAlertIcon(alert.type);
          return (
            <TouchableOpacity 
              key={alert.id} 
              style={[
                styles.alertCard,
                !alert.isRead && styles.unreadAlert
              ]}
              onPress={() => markAlertAsRead(alert.id)}
            >
              <View style={styles.alertHeader}>
                <View style={styles.alertIconContainer}>
                  <AlertIcon color={getAlertColor(alert.severity)} size={20} />
                </View>
                <View style={styles.alertMainContent}>
                  <View style={styles.alertTitleRow}>
                    <MapPin color="#6B7280" size={16} />
                    <Text style={styles.alertRoute}>{alert.routeName}</Text>
                    <View style={[styles.severityBadge, { backgroundColor: getAlertColor(alert.severity) + '20' }]}>
                      <Text style={[styles.severityText, { color: getAlertColor(alert.severity) }]}>
                        {getSeverityText(alert.severity)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <View style={styles.alertFooter}>
                    <Calendar color="#6B7280" size={14} />
                    <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
                  </View>
                </View>
              </View>
              {!alert.isRead && <View style={styles.unreadIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {alerts.length === 0 && (
        <View style={styles.emptyState}>
          <BellOff color="#6B7280" size={48} />
          <Text style={styles.emptyTitle}>Nenhum alerta</Text>
          <Text style={styles.emptyText}>
            Você receberá notificações sobre suas rotas aqui.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  settingsContainer: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  alertsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  unreadAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  alertHeader: {
    flexDirection: 'row',
  },
  alertIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  alertMainContent: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertRoute: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  alertMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  unreadIndicator: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0066CC',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});