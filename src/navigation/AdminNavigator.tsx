import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors, typography } from '../theme/colors';

import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminRetailers from '../screens/admin/AdminRetailers';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.55 }}>{emoji}</Text>;
}

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.admin,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 58,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: typography.fontSizes.xs,
          fontWeight: typography.weights.semibold,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📈" focused={focused} /> }}
      />
      <Tab.Screen
        name="Retailers"
        component={AdminRetailers}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏪" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}
