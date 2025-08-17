import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, MapPin, Calendar } from 'lucide-react-native';

interface Alert {
  id: number;
  routeName: string;
  type: 'flood_warning' | 'road_closed' | 'heavy_rain' | 'all_clear';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
}

interface AlertCardProps {
  alert: Alert;
  onPress?: () => void;
}

export default function AlertCard({ alert, onPress }: AlertCardProps) {
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
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  const AlertIcon = getAlertIcon(alert.type);

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        !alert.isRead && styles.unreadCard
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.alertIconContainer}>
          <AlertIcon color={getAlertColor(alert.severity)} size={20} />
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <MapPin color="#6B7280" size={16} />
            <Text style={styles.routeName}>{alert.routeName}</Text>
            <View style={[styles.severityBadge, { backgroundColor: getAlertColor(alert.severity) + '20' }]}>
              <Text style={[styles.severityText, { color: getAlertColor(alert.severity) }]}>
                {getSeverityText(alert.severity)}
              </Text>
            </View>
          </View>
          <Text style={styles.message}>{alert.message}</Text>
          <View style={styles.timestamp}>
            <Calendar color="#6B7280" size={14} />
            <Text style={styles.timestampText}>{alert.timestamp}</Text>
          </View>
        </View>
      </View>
      {!alert.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  header: {
    flexDirection: 'row',
  },
  alertIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeName: {
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
  message: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampText: {
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
});