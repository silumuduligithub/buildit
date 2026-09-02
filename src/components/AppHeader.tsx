import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../theme/colors';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  rightElement?: React.ReactNode;
  showBell?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  accentColor = colors.primary,
  rightElement,
  showBell = false,
}: AppHeaderProps) {
  const initials = title.substring(0, 2).toUpperCase();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
        <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
      </View>

      <View style={styles.right}>
        {rightElement}
        {showBell && (
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: accentColor + '18' }]}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  left: {
    flex: 1,
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    letterSpacing: -0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: 18,
  },
});
