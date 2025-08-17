import React, { useState, useCallback } from 'react';
import { useFocusEffect, useRoute, useNavigation} from '@react-navigation/native';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Plus, Search, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Trash2, CreditCard as Edit3, Navigation } from 'lucide-react-native';
import {useRoutes} from '@/src/contexts/RouteContext';

interface Route {
  id: number;
  name: string;
  startAddress: string;
  endAddress: string;
  status: 'safe' | 'warning' | 'danger';
  lastUpdate: string;
  riskLevel: number;
}

export default function RoutesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params:{bool?: boolean} = route.params || {};
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    startAddress: '',
    endAddress: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const { routes, addRoute, deleteRoute, updateRoute, MAX_ROUTES } = useRoutes();
  const isLimitReached = routes.length == MAX_ROUTES;

  useFocusEffect(
    useCallback(() => {
      // Se houver o parâmetro openModal, abre o modal
      if (params.bool) {
        setShowAddModal(true);
        // Ao entrar na aba, limpa o parâmetro para não abrir de novo
        navigation.setParams({ bool: false });
      }
    }, [route, params.bool])
  );

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

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchText.toLowerCase()) ||
    route.startAddress.toLowerCase().includes(searchText.toLowerCase()) ||
    route.endAddress.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddRoute = () => {
    if (newRoute.name && newRoute.startAddress && newRoute.endAddress) {
      addRoute(newRoute); // Chama a função do contexto
      setNewRoute({ name: '', startAddress: '', endAddress: '' });
      setShowAddModal(false);
    }
  };

  const handleDeleteRoute = (id: number) => {
    deleteRoute(id); // Chama a função do contexto
  };
  
  const handleOpenEditModal = (routeToEdit: Route) => {
    setEditingRoute(routeToEdit);
    setShowEditModal(true);
  };

  const handleSaveEditedRoute = () => {
    if (editingRoute) {
      updateRoute(editingRoute.id, {
        name: editingRoute.name,
        startAddress: editingRoute.startAddress,
        endAddress: editingRoute.endAddress
      });
      setEditingRoute(null);
      setShowEditModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Rotas</Text>
        <Text style={styles.subtitle}>Gerencie suas rotas favoritas</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar rotas..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#6B7280"
          />
        </View>
        <TouchableOpacity 
          style={[styles.addRouteButton, isLimitReached && { backgroundColor: '#D1D5DB', opacity: 0.5 }]}
          onPress={() => {
            if (!isLimitReached) {setShowAddModal(true)}
            else{Alert.alert("Limite de Rotas Atingido", `Você já atingiu o limite de ${MAX_ROUTES} rotas.`)}
          }}
        >
          <Plus color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.routesList} showsVerticalScrollIndicator={false}>
        {filteredRoutes.map((route) => {
          const StatusIcon = getStatusIcon(route.status);
          return (
            <View key={route.id} style={styles.routeCard}>
              <View style={styles.routeCardHeader}>
                <View style={styles.routeMainInfo}>
                  <Text style={styles.routeName}>{route.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(route.status) + '20' }]}>
                    <StatusIcon color={getStatusColor(route.status)} size={14} />
                    <Text style={[styles.statusText, { color: getStatusColor(route.status) }]}>
                      {getStatusText(route.status)}
                    </Text>
                  </View>
                </View>
                <View style={styles.routeActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenEditModal(route)}>
                    <Edit3 color="#6B7280" size={18} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteRoute(route.id)}
                  >
                    <Trash2 color="#EF4444" size={18} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.routeAddresses}>
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

              <View style={styles.routeFooter}>
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
            </View>
          );
        })}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Rota</Text>
            <TouchableOpacity onPress={handleAddRoute}>
              <Text style={styles.saveButton}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da Rota</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Casa - Trabalho"
                value={newRoute.name}
                onChangeText={(text) => setNewRoute({...newRoute, name: text})}
                placeholderTextColor="#6B7280"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Endereço de Origem</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o endereço de partida"
                value={newRoute.startAddress}
                onChangeText={(text) => setNewRoute({...newRoute, startAddress: text})}
                placeholderTextColor="#6B7280"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Endereço de Destino</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o endereço de chegada"
                value={newRoute.endAddress}
                onChangeText={(text) => setNewRoute({...newRoute, endAddress: text})}
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Rota</Text>
            <TouchableOpacity onPress={handleSaveEditedRoute}>
              <Text style={styles.saveButton}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da Rota</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Casa - Trabalho"
                value={editingRoute?.name}
                onChangeText={(text) =>
                  setEditingRoute(old => old ? { ...old, name: text } : null)
                }
                placeholderTextColor="#6B7280"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Endereço de Origem</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o endereço de partida"
                value={editingRoute?.startAddress}
                onChangeText={(text) =>
                  setEditingRoute(old => old ? { ...old, startAddress: text } : null)
                }
                placeholderTextColor="#6B7280"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Endereço de Destino</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o endereço de chegada"
                value={editingRoute?.endAddress}
                onChangeText={(text) =>
                  setEditingRoute(old => old ? { ...old, endAddress: text } : null)
                }
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  addRouteButton: {
    backgroundColor: '#0066CC',
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  routesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  routeCard: {
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
  routeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  routeMainInfo: {
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
  routeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  routeAddresses: {
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
  routeFooter: {
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveButton: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});