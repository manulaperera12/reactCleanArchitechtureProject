import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen 
            name="feature/presentation/screens/[userId]" 
          />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}