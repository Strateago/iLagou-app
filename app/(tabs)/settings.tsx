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
import { Bell, MapPin, Shield, Info, CircleHelp as HelpCircle, Star, ChevronRight, Volume2, Vibrate, Moon, Smartphone } from 'lucide-react-native';

interface SettingSection {
  title: string;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'toggle' | 'navigation';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [vibrationAlerts, setVibrationAlerts] = useState(true);
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const settingSections: SettingSection[] = [
    {
      title: 'Notificações',
      items: [
        {
          id: 'push',
          title: 'Notificações Push',
          subtitle: 'Receba alertas em tempo real',
          icon: Bell,
          type: 'toggle',
          value: pushNotifications,
          onToggle: setPushNotifications,
        },
        {
          id: 'sound',
          title: 'Som dos Alertas',
          subtitle: 'Alertas sonoros para emergências',
          icon: Volume2,
          type: 'toggle',
          value: soundAlerts,
          onToggle: setSoundAlerts,
        },
        {
          id: 'vibration',
          title: 'Vibração',
          subtitle: 'Feedback tátil para alertas',
          icon: Vibrate,
          type: 'toggle',
          value: vibrationAlerts,
          onToggle: setVibrationAlerts,
        },
        {
          id: 'high-risk',
          title: 'Apenas Alto Risco',
          subtitle: 'Receber apenas alertas de alta prioridade',
          icon: Shield,
          type: 'toggle',
          value: highRiskOnly,
          onToggle: setHighRiskOnly,
        },
      ],
    },
    {
      title: 'Aplicativo',
      items: [
        {
          id: 'auto-refresh',
          title: 'Atualização Automática',
          subtitle: 'Verificar rotas a cada 5 minutos',
          icon: Smartphone,
          type: 'toggle',
          value: autoRefresh,
          onToggle: setAutoRefresh,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingLeft}>
          <View style={styles.iconContainer}>
            <IconComponent color="#0066CC" size={20} />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        <View style={styles.settingRight}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#E5E7EB', true: '#0066CC' }}
              thumbColor="#fff"
            />
          ) : (
            <ChevronRight color="#6B7280" size={20} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Personalize sua experiência</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            iLagou v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Prevendo alagamentos, protegendo você.
          </Text>
        </View>
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
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 20,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0066CC' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  settingRight: {
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    padding: 40,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});