import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { RouteProvider } from '@/src/contexts/RouteContext';
import { NotificationsProvider } from '@/src/contexts/NotificationContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <NotificationsProvider>
        <RouteProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </RouteProvider>
      </NotificationsProvider>
      <StatusBar style="auto" />
      
    </>
  );
}