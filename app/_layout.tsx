import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { RouteProvider } from '@/src/contexts/RouteContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <RouteProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </RouteProvider>
      <StatusBar style="auto" />
    </>
  );
}