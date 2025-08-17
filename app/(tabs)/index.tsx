import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Plus, Droplets } from 'lucide-react-native';
import { Image , Alert } from 'react-native';
import RoutesScreen from './routes';
import { useRoutes } from '@/src/contexts/RouteContext';

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

export default function HomeScreen() {
  const navigation = useNavigation();
  const { routes, MAX_ROUTES } = useRoutes();
  const isLimitReached = routes.length == MAX_ROUTES;
  const safeRoutes = routes.filter(route => route.status === 'safe').length;
  const warningRoutes = routes.filter(route => route.status === 'warning').length;
  const dangerRoutes = routes.filter(route => route.status === 'danger').length;
  const totalAlertRoutes = warningRoutes + dangerRoutes;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0066CC', '#4A90E2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>iLagou</Text>
          </View>
          <Text style={styles.subtitle}>Prevendo alagamentos, protegendo você.</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suas Rotas</Text>
            <TouchableOpacity 
              style={[styles.addButton, isLimitReached && { opacity: 0.5 }]} 
              onPress={() => {
              if(!isLimitReached) {navigation.navigate('routes', {bool: true})}
              else {Alert.alert("Limite de Rotas Atingido", `Você já atingiu o limite de ${MAX_ROUTES} rotas.`)}}}
            >
              <Plus color={isLimitReached ? '#737373' : '#0066CC'} size={20} />
              <Text style={[styles.addButtonText, isLimitReached && { color:'#737373' }]}>Nova Rota</Text>
            </TouchableOpacity>
          </View>

          {routes.map((route) => {
            const StatusIcon = getStatusIcon(route.status);
            return (
              <TouchableOpacity key={route.id} style={styles.routeCard} onPress={() => navigation.navigate('routes')}>
                <View style={styles.routeHeader}>
                  <View style={styles.routeInfo}>
                    <MapPin color="#666" size={20} />
                    <Text style={styles.routeName}>{route.name}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(route.status) + '20' }]}>
                    <StatusIcon color={getStatusColor(route.status)} size={16} />
                    <Text style={[styles.statusText, { color: getStatusColor(route.status) }]}>
                      {getStatusText(route.status)}
                    </Text>
                  </View>
                </View>
                <View style={styles.routeFooter}>
                  <Text style={styles.lastUpdate}>Última atualização: {route.lastUpdate}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Dia</Text>
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, { backgroundColor: '#10B981' + '15' }]}>
              <CheckCircle color="#10B981" size={24} />
              <Text style={styles.summaryNumber}>{safeRoutes}</Text>
              <Text style={styles.summaryLabel}>Rotas Seguras</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#FF6B35' + '15' }]}>
              <AlertTriangle color="#FF6B35" size={24} />
              <Text style={styles.summaryNumber}>{totalAlertRoutes}</Text>
              <Text style={styles.summaryLabel}>Com Alerta</Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dicas de Segurança</Text>
          <View style={styles.tipCard}>
            <Droplets color="#4A90E2" size={24} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Chuva Forte Prevista</Text>
              <Text style={styles.tipText}>
                Evite vias baixas e próximas a córregos durante chuvas intensas.
              </Text>
            </View>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC' + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#0066CC',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  routeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  routeFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});