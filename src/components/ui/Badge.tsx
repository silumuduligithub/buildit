import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, radii } from '../../theme/colors';

type BadgeVariant = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'rejected' | 'driver_assigned' | 'pickup'
  | 'active' | 'upcoming' | 'expired'
  | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const VARIANT_CONFIG: Record<BadgeVariant, { bg: string; text: string; label: string }> = {
  placed: { bg: '#FEF3C7', text: '#92400E', label: 'Placed' },
  confirmed: { bg: '#EFF6FF', text: '#1E40AF', label: 'Confirmed' },
  preparing: { bg: '#F3E8FF', text: '#6D28D9', label: 'Preparing' },
  ready: { bg: '#ECFDF5', text: '#065F46', label: 'Ready' },
  driver_assigned: { bg: '#EFF6FF', text: '#1E40AF', label: 'Driver Assigned' },
  pickup: { bg: '#FFF7ED', text: '#9A3412', label: 'Pickup' },
  out_for_delivery: { bg: '#FFF7ED', text: '#9A3412', label: 'On the Way' },
  delivered: { bg: '#ECFDF5', text: '#065F46', label: 'Delivered' },
  rejected: { bg: '#FEF2F2', text: '#991B1B', label: 'Rejected' },
  active: { bg: '#ECFDF5', text: '#065F46', label: 'Active' },
  upcoming: { bg: '#EFF6FF', text: '#1E40AF', label: 'Upcoming' },
  expired: { bg: '#F3F4F6', text: '#6B7280', label: 'Expired' },
  success: { bg: colors.successLight, text: colors.success, label: 'Success' },
  warning: { bg: colors.warningLight, text: '#92400E', label: 'Warning' },
  error: { bg: colors.errorLight, text: colors.error, label: 'Error' },
  info: { bg: colors.infoLight, text: colors.info, label: 'Info' },
  neutral: { bg: '#F3F4F6', text: '#374151', label: '' },
};

export default function Badge({ variant, label, size = 'sm', style }: BadgeProps) {
  const config = VARIANT_CONFIG[variant];
  const displayLabel = label || config.label;

  return (
    <View style={[styles.badge, size === 'md' && styles.badgeMd, { backgroundColor: config.bg }, style]}>
      <Text
        style={[
          styles.badgeText,
          size === 'md' && styles.badgeTextMd,
          { color: config.text },
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.semibold,
    letterSpacing: 0.2,
  },
  badgeTextMd: {
    fontSize: typography.fontSizes.label,
  },
});
