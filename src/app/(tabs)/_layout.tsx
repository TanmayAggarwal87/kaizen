import React from 'react';
import { Tabs } from 'expo-router';
import { Text, StyleSheet, View } from 'react-native';
import { KaizenTheme } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: KaizenTheme.redPrimary,
        tabBarInactiveTintColor: KaizenTheme.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>◉</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>☑</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="apps"
        options={{
          title: 'Apps',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>⊞</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="pressure"
        options={{
          title: 'Pressure',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>⚡</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>⚙</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderTopColor: KaizenTheme.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tabIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
});
