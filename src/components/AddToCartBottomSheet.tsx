import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../theme/colors';

interface AddToCartBottomSheetProps {
  visible: boolean;
  itemName: string;
  itemCount: number;
  totalQuantity: number;
  onClose: () => void;
  onContinue: () => void;
  onViewCart: () => void;
}

export default function AddToCartBottomSheet({
  visible,
  itemName,
  itemCount,
  totalQuantity,
  onClose,
  onContinue,
  onViewCart,
}: AddToCartBottomSheetProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.toast} pointerEvents="auto">
        <View style={styles.badgeWrap}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓</Text>
          </View>
          <Text style={styles.message} numberOfLines={1}>
            {itemName ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} added to cart` : 'Added to cart'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.viewCartButton}
          onPress={onViewCart}
          activeOpacity={0.9}
        >
          <Text style={styles.viewCartText}>View Cart ({totalQuantity})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 100,
    pointerEvents: 'box-none',
  },
  toast: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: 78,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    ...shadows.md,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: spacing.sm,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DFF7EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  badgeText: {
    color: '#1A9E5B',
    fontSize: 16,
    fontWeight: typography.weights.extrabold,
  },
  message: {
    flex: 1,
    color: colors.text,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.bold,
  },
  viewCartButton: {
    borderWidth: 1.5,
    borderColor: '#F28A5D',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  viewCartText: {
    color: '#F26B3A',
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  closeButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#333333',
    fontSize: 22,
    lineHeight: 22,
    fontWeight: typography.weights.medium,
  },
});
