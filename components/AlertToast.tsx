// src/components/AlertToast.tsx

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useNotifications } from '@/src/contexts/NotificationContext';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native'; // 💡 Importa o hook de navegação

const getAlertColor = (severity: string) => {
  switch (severity) {
    case 'high': return '#EF4444';
    case 'medium': return '#FF6B35';
    case 'low': return '#10B981';
    default: return '#6B7280';
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'flood_warning': return AlertTriangle;
    case 'road_closed': return AlertTriangle;
    case 'heavy_rain': return AlertTriangle;
    case 'all_clear': return CheckCircle;
    default: return AlertTriangle;
  }
};

export default function AlertToast() {
  const { currentAlert, dismissCurrentAlert, markAlertAsRead } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation(); // 💡 Inicializa o hook de navegação

  useEffect(() => {
    if (currentAlert) {
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          handleDismiss();
        }, 5000); 
      });
    } else {
      setIsVisible(false);
    }
  }, [currentAlert]);

  const handleDismiss = () => {
    if (currentAlert) {
      dismissCurrentAlert();
    }
  };

  if (!isVisible || !currentAlert) {
    return null;
  }
  
  const AlertIcon = getAlertIcon(currentAlert.type);
  const alertColor = getAlertColor(currentAlert.severity);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.toast, { borderLeftColor: alertColor }]}>
        <View style={[styles.iconContainer, { backgroundColor: alertColor + '15' }]}>
          <AlertIcon color={alertColor} size={20} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentAlert.routeName}</Text>
          <Text style={styles.message}>{currentAlert.message}</Text>
        </View>
        {/* 💡 O botão de fechar agora usa a função de fechar */}
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <X color="#6B7280" size={24} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    paddingRight: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  closeButton: {
    padding: 8,
  },
});