import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../theme/colors';
import { useAppStore } from '../store';

interface CartBarProps {
  onPress: () => void;
}

export default function CartBar({ onPress }: CartBarProps) {
  const { cart } = useAppStore();

  if (cart.length === 0) return null;

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.offer.price * i.quantity, 0);

  return (
    <TouchableOpacity style={styles.bar} onPress={onPress} activeOpacity={0.92}>
      <View style={styles.left}>
        <View style={styles.itemsBadge}>
          <Text style={styles.itemsBadgeText}>{totalItems}</Text>
        </View>
        <Text style={styles.itemsLabel}>
          {totalItems} item{totalItems > 1 ? 's' : ''} added
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.total}>₹{totalPrice.toLocaleString('en-IN')}</Text>
        <Text style={styles.viewCart}>View Cart  ›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.text,        // near-black
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    ...shadows.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemsBadge: {
    backgroundColor: colors.primary,
    width: 26, height: 26,
    borderRadius: radii.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsBadgeText: {
    color: colors.white,
    fontWeight: typography.weights.extrabold,
    fontSize: typography.fontSizes.sm,
  },
  itemsLabel: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.medium,
  },
  right: {
    alignItems: 'flex-end',
  },
  total: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
  },
  viewCart: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    marginTop: 1,
  },
});
