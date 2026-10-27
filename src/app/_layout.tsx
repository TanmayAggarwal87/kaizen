import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KaizenProvider } from '@/context/KaizenContext';

export default function RootLayout() {
  return (
    <KaizenProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </KaizenProvider>
  );
}
