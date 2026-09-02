import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/store';
import { colors, spacing, typography, radii, shadows } from './src/theme/colors';
import { UserRole } from './src/types';

import CustomerNavigator from './src/navigation/CustomerNavigator';
import RetailerNavigator from './src/navigation/RetailerNavigator';
import DeliveryNavigator from './src/navigation/DeliveryNavigator';

const ROLES: { id: UserRole; label: string; emoji: string; color: string }[] = [
  { id: 'customer', label: 'Customer', emoji: '🛒', color: colors.primary },
  { id: 'retailer', label: 'Retailer', emoji: '🏪', color: colors.retailer },
  { id: 'delivery', label: 'Driver', emoji: '🚚', color: colors.delivery },
];

export default function App() {
  const { currentRole, setCurrentRole } = useAppStore();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const activeRole = ROLES.find((r) => r.id === currentRole)!;

  const renderNavigator = () => {
    switch (currentRole) {
      case 'customer':   return <CustomerNavigator />;
      case 'retailer':   return <RetailerNavigator />;
      case 'delivery':   return <DeliveryNavigator />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Main Navigation Content */}
        <View style={styles.content}>
          <NavigationContainer>{renderNavigator()}</NavigationContainer>
        </View>

      {/* Collapsible Floating Role Switcher Pill (Non-intrusive, never covers header) */}
      <View style={styles.floatingRoleContainer}>
        {showRoleSwitcher ? (
          <View style={styles.expandedRoleCard}>
            <View style={styles.roleHeaderRow}>
              <Text style={styles.roleHeaderTitle}>SWITCH ECOSYSTEM ROLE</Text>
              <TouchableOpacity onPress={() => setShowRoleSwitcher(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rolePillsRow}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  onPress={() => {
                    setCurrentRole(role.id);
                    setShowRoleSwitcher(false);
                  }}
                  style={[
                    styles.rolePill,
                    currentRole === role.id && styles.rolePillActive,
                  ]}
                >
                  <Text style={styles.roleEmoji}>{role.emoji}</Text>
                  <Text
                    style={[
                      styles.roleText,
                      currentRole === role.id && styles.roleTextActive,
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.minimizedPill}
            onPress={() => setShowRoleSwitcher(true)}
            activeOpacity={0.88}
          >
            <Text style={styles.minimizedEmoji}>{activeRole.emoji}</Text>
            <Text style={styles.minimizedText}>{activeRole.label}</Text>
            <Text style={styles.minimizedSwitchIcon}>⇄</Text>
          </TouchableOpacity>
        )}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  floatingRoleContainer: {
    position: 'absolute',
    bottom: 75,
    left: spacing.md,
    zIndex: 9999,
  },
  minimizedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
    gap: 4,
    ...shadows.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  minimizedEmoji: {
    fontSize: 12,
  },
  minimizedText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.3,
  },
  minimizedSwitchIcon: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: typography.weights.bold,
    marginLeft: 2,
  },
  expandedRoleCard: {
    backgroundColor: colors.text,
    borderRadius: radii.xl,
    padding: spacing.md,
    minWidth: 260,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  roleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  roleHeaderTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.8,
  },
  closeIcon: {
    color: colors.white,
    fontSize: 12,
    fontWeight: typography.weights.bold,
    padding: 2,
  },
  rolePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    gap: 4,
  },
  rolePillActive: {
    backgroundColor: colors.primary,
  },
  roleEmoji: {
    fontSize: 12,
  },
  roleText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.semibold,
  },
  roleTextActive: {
    color: colors.white,
    fontWeight: typography.weights.extrabold,
  },
});
