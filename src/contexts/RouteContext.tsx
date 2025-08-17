// src/contexts/RouteContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Defina a interface para os dados
export interface Route {
  id: number;
  name: string;
  startAddress: string;
  endAddress: string;
  status: 'safe' | 'warning' | 'danger';
  lastUpdate: string;
  riskLevel: number;
}

// Mock inicial, que será o único local de dados
const initialRoutes: Route[] = [
  {
    id: 1,
    name: 'Casa - Trabalho',
    startAddress: 'Rua das Flores, 123',
    endAddress: 'Av. Paulista, 1000',
    status: 'safe',
    lastUpdate: '10 min atrás',
    riskLevel: 15,
  },
  {
    id: 2,
    name: 'Shopping Eldorado',
    startAddress: 'Casa',
    endAddress: 'Shopping Eldorado',
    status: 'warning',
    lastUpdate: '5 min atrás',
    riskLevel: 65,
  },
  // {
  //   id: 3,
  //   name: 'Shopping Eldorado',
  //   startAddress: 'Casa',
  //   endAddress: 'Shopping Eldorado',
  //   status: 'warning',
  //   lastUpdate: '5 min atrás',
  //   riskLevel: 65,
  // },
  // {
  //   id: 4,
  //   name: 'Shopping Eldorado',
  //   startAddress: 'Casa',
  //   endAddress: 'Shopping Eldorado',
  //   status: 'warning',
  //   lastUpdate: '5 min atrás',
  //   riskLevel: 65,
  // },
  // {
  //   id: 5,
  //   name: 'Shopping Eldorado',
  //   startAddress: 'Casa',
  //   endAddress: 'Shopping Eldorado',
  //   status: 'warning',
  //   lastUpdate: '5 min atrás',
  //   riskLevel: 65,
  // },
];

// 2. Crie a interface para o valor do contexto
interface RouteContextType {
  routes: Route[];
  addRoute: (route: Omit<Route, 'id' | 'status' | 'lastUpdate' | 'riskLevel'>) => void;
  deleteRoute: (id: number) => void;
  updateRoute: (id: number, updatedData: Partial<Omit<Route, 'id'>>) => void;
  MAX_ROUTES: number;
  // Aqui você pode adicionar outras funções como 'updateRoute'
}

// 3. Crie o contexto
const RouteContext = createContext<RouteContextType | undefined>(undefined);

// 4. Crie o provedor do contexto
export const RouteProvider = ({ children }: { children: ReactNode }) => {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const MAX_ROUTES = 2;

  const addRoute = (newRouteData: Omit<Route, 'id' | 'status' | 'lastUpdate' | 'riskLevel'>) => {
    if (routes.length >= MAX_ROUTES) {
      alert(`Limite de ${MAX_ROUTES} rotas atingido. Exclua uma rota antes de adicionar outra.`);
      return;
    }
    const newRoute: Route = {
      id: Date.now(),
      ...newRouteData,
      status: 'safe', // Padrão
      lastUpdate: 'Agora', // Padrão
      riskLevel: 20, // Padrão
    };
    setRoutes((currentRoutes) => [...currentRoutes, newRoute]);
  };

  const deleteRoute = (id: number) => {
    setRoutes((currentRoutes) => currentRoutes.filter(route => route.id !== id));
  };

  const updateRoute = (id: number, updatedData: Partial<Omit<Route, 'id'>>) => {
    setRoutes(currentRoutes =>
      currentRoutes.map(route =>
        route.id === id ? { ...route, ...updatedData } : route
      )
    );
  };

  const value = { routes, addRoute, deleteRoute, updateRoute, MAX_ROUTES };

  return (
    <RouteContext.Provider value={value}>
      {children}
    </RouteContext.Provider>
  );
};

// 5. Crie um hook customizado para facilitar o uso
export const useRoutes = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoutes must be used within a RouteProvider');
  }
  return context;
};