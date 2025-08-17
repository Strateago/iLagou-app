import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Navigation } from 'lucide-react-native';

interface Route {
  id: number;
  name: string;
  startAddress: string;
  endAddress: string;
  status: 'safe' | 'warning' | 'danger';
  lastUpdate: string;
  riskLevel: number;
}

interface RouteCardProps {
  route: Route;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RouteCard({ route, onPress, onEdit, onDelete }: RouteCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return '#10B981';
      case 'warning': return '#FF6B35';
      case 'danger': return '#EF4444';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'danger': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'safe': return 'Rota Segura';
      case 'warning': return 'Risco Moderado';
      case 'danger': return 'Alto Risco';
      default: return 'Verificando...';
    }
  };

  const getRiskLevelColor = (riskLevel: number) => {
    if (riskLevel < 30) return '#10B981';
    if (riskLevel < 70) return '#FF6B35';
    return '#EF4444';
  };

  const StatusIcon = getStatusIcon(route.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.mainInfo}>
          <Text style={styles.routeName}>{route.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(route.status) + '20' }]}>
            <StatusIcon color={getStatusColor(route.status)} size={14} />
            <Text style={[styles.statusText, { color: getStatusColor(route.status) }]}>
              {getStatusText(route.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.addresses}>
        <View style={styles.addressRow}>
          <View style={styles.addressDot} />
          <Text style={styles.addressText}>{route.startAddress}</Text>
        </View>
        <View style={styles.addressConnector} />
        <View style={styles.addressRow}>
          <Navigation color="#0066CC" size={12} />
          <Text style={styles.addressText}>{route.endAddress}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.riskMeter}>
          <Text style={styles.riskLabel}>Nível de Risco</Text>
          <View style={styles.riskBarContainer}>
            <View style={styles.riskBarBg}>
              <View 
                style={[
                  styles.riskBarFill, 
                  { 
                    width: `${route.riskLevel}%`,
                    backgroundColor: getRiskLevelColor(route.riskLevel)
                  }
                ]} 
              />
            </View>
            <Text style={[styles.riskPercentage, { color: getRiskLevelColor(route.riskLevel) }]}>
              {route.riskLevel}%
            </Text>
          </View>
        </View>
        <Text style={styles.lastUpdate}>Atualizado {route.lastUpdate}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  mainInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  addresses: {
    marginBottom: 16,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  addressConnector: {
    width: 2,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginLeft: 4,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  riskMeter: {
    marginBottom: 12,
  },
  riskLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  riskBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riskBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  riskPercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#6B7280',
  },
});