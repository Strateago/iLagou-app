// src/contexts/RouteContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { getRiskForRoute, ApiResponse } from '@/src/services/api';
import { useNotifications, Alert } from './NotificationContext'; 

export interface Route {
  id: number;
  name: string;
  startAddress: string;
  endAddress: string;
  status: 'safe' | 'warning' | 'danger' | 'Obtendo risco' | 'Falha';
  lastUpdate: string;
  riskLevel: number;
}

interface RouteContextType {
  routes: Route[];
  addRoute: (newRouteData: Omit<Route, 'id' | 'status' | 'lastUpdate' | 'riskLevel'>) => Promise<void>;
  deleteRoute: (id: number) => void;
  updateRoute: (id: number, updatedData: Partial<Omit<Route, 'id'>>) => Promise<void>;
  MAX_ROUTES: number;
}

const getStatusFromRiskLevel = (riskLevel: number): 'safe' | 'warning' | 'danger' => {
  if (riskLevel < 30) return 'safe';
  if (riskLevel < 70) return 'warning';
  return 'danger';
};

const getSeverityFromRiskLevel = (riskLevel: number): 'low' | 'medium' | 'high' => {
  if (riskLevel < 30) return 'low';
  if (riskLevel < 70) return 'medium';
  return 'high';
};

const getAlertMessageFromRisk = (riskLevel: number): string => {
  if (riskLevel < 30) return 'Condições normais. Nenhum risco de alagamento detectado.';
  if (riskLevel < 70) return 'Risco moderado de alagamento. Fique atento às atualizações.';
  return 'Alto risco de alagamento. Considere uma rota alternativa!';
};

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

const initialRoutes: Route[] = [
  {
    id: 1,
    name: 'Casa - Trabalho',
    startAddress: 'Rua das Flores, 123',
    endAddress: 'Av. Paulista, 1000',
    status: 'safe',
    lastUpdate: formatDate(new Date()),
    riskLevel: 15,
  },
];

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider = ({ children }: { children: ReactNode }) => {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const MAX_ROUTES = 2;

  const { addAlert } = useNotifications();

  const addRoute = async (newRouteData: Omit<Route, 'id' | 'status' | 'lastUpdate' | 'riskLevel'>) => {
    if (routes.length >= MAX_ROUTES) {
      alert(`Limite de ${MAX_ROUTES} rotas atingido. Exclua uma rota antes de adicionar outra.`);
      return;
    }

    const tempId = Date.now();
    const tempRoute: Route = {
      id: tempId,
      ...newRouteData,
      status: 'Obtendo risco',
      riskLevel: 0,
      lastUpdate: 'waiting',
    };
    setRoutes(currentRoutes => [...currentRoutes, tempRoute]);

    try {
      const apiData: ApiResponse = await getRiskForRoute(
        newRouteData.startAddress,
        newRouteData.endAddress
      );

      const updatedRoute: Route = {
        id: tempId,
        ...newRouteData,
        status: getStatusFromRiskLevel(apiData.probabilidade),
        riskLevel: Math.round(apiData.probabilidade),
        lastUpdate: formatDate(new Date()),
      };
      setRoutes(currentRoutes => currentRoutes.map(r => r.id === tempId ? updatedRoute : r));

      // 💡 Lógica para gerar alerta SOMENTE quando o risco não for baixo
      if (updatedRoute.status !== 'safe') {
        addAlert({
          routeName: newRouteData.name,
          type: 'flood_warning',
          message: getAlertMessageFromRisk(updatedRoute.riskLevel),
          severity: getSeverityFromRiskLevel(updatedRoute.riskLevel),
        });
      }

    } catch (error) {
      console.error('Falha ao obter dados da API:', error);
      setRoutes(currentRoutes => currentRoutes.map(r => r.id === tempId ? { ...r, status: 'Falha', lastUpdate: 'Falha na atualização' } : r));

      addAlert({
        routeName: newRouteData.name,
        type: 'unknown',
        message: 'Falha ao verificar o risco da rota. Tente novamente.',
        severity: 'high',
      });
      throw error;
    }
  };

  const deleteRoute = (id: number) => {
    setRoutes((currentRoutes) => currentRoutes.filter(route => route.id !== id));
  };

  const updateRoute = async (id: number, updatedData: Partial<Omit<Route, 'id'>>) => {
    const existingRoute = routes.find(r => r.id === id);
    if (!existingRoute) return;

    const addressesChanged = updatedData.startAddress !== existingRoute.startAddress ||
                             updatedData.endAddress !== existingRoute.endAddress;

    if (addressesChanged) {
      const tempUpdatedRoute = {
        ...existingRoute,
        ...updatedData,
        status: 'Obtendo risco' as const,
        lastUpdate: 'Aguardando...',
      };
      setRoutes(currentRoutes => currentRoutes.map(r => r.id === id ? tempUpdatedRoute : r));
      
      try {
        const apiData: ApiResponse = await getRiskForRoute(
          updatedData.startAddress || existingRoute.startAddress,
          updatedData.endAddress || existingRoute.endAddress
        );

        const updatedRoute: Route = {
          ...tempUpdatedRoute,
          status: getStatusFromRiskLevel(apiData.probabilidade),
          riskLevel: Math.round(apiData.probabilidade),
          lastUpdate: formatDate(new Date()),
        };
        setRoutes(currentRoutes => currentRoutes.map(r => r.id === id ? updatedRoute : r));

        // 💡 Lógica para gerar alerta SOMENTE quando o risco não for baixo
        if (updatedRoute.status !== 'safe') {
          addAlert({
            routeName: updatedRoute.name,
            type: 'flood_warning',
            message: getAlertMessageFromRisk(updatedRoute.riskLevel),
            severity: getSeverityFromRiskLevel(updatedRoute.riskLevel),
          });
        }
      } catch (error) {
        setRoutes(currentRoutes => currentRoutes.map(r => r.id === id ? { ...r, status: 'Falha', lastUpdate: `Falha em ${formatDate(new Date())}` } : r));
        
        addAlert({
          routeName: existingRoute.name,
          type: 'unknown',
          message: 'Falha ao verificar o risco da rota. Tente novamente.',
          severity: 'high',
        });
        throw error;
      }
    } else {
      setRoutes(currentRoutes =>
        currentRoutes.map(route =>
          route.id === id
            ? {
                ...route,
                ...updatedData,
              }
            : route
        )
      );
    }
  };

  const value = {
    routes,
    addRoute,
    deleteRoute,
    updateRoute,
    MAX_ROUTES,
  };

  return (
    <RouteContext.Provider value={value}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoutes = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoutes must be used within a RouteProvider');
  }
  return context;
};