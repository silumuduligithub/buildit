import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../theme/colors';
import { useAppStore } from '../store';

interface FloatingCartBarProps {
  onPress: () => void;
}

export default function FloatingCartBar({ onPress }: FloatingCartBarProps) {
  const { cart } = useAppStore();

  if (cart.length === 0) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.offer.price * item.quantity, 0);
  const retailerName = cart[0]?.retailer?.name || 'Hardware Mart';

  return (
    <TouchableOpacity style={styles.cartBarContainer} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.leftInfo}>
        <View style={styles.badgeWrapper}>
          <Text style={styles.itemCountText}>{totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.priceText}>₹{totalPrice.toLocaleString('en-IN')}</Text>
        </View>
        <Text style={styles.storeNameText} numberOfLines={1}>From {retailerName}</Text>
      </View>

      <View style={styles.rightAction}>
        <Text style={styles.viewCartText}>View Cart</Text>
        <Text style={styles.arrowIcon}>🛒 ›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cartBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    ...shadows.lg,
  },
  leftInfo: {
    flex: 1,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  itemCountText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  dotSeparator: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
  },
  priceText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
  },
  storeNameText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 1,
    fontWeight: typography.weights.medium,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.sm,
  },
  viewCartText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  arrowIcon: {
    color: colors.white,
    fontSize: 14,
    fontWeight: typography.weights.bold,
  },
});
