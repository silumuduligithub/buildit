import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows } from '../../theme/colors';

interface QuantitySelectorProps {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  /** Minimum touch area 48dp */
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export default function QuantitySelector({
  quantity,
  onAdd,
  onRemove,
  size = 'md',
  style,
}: QuantitySelectorProps) {
  const isSmall = size === 'sm';

  if (quantity === 0) {
    return (
      <TouchableOpacity
        style={[styles.addButton, isSmall && styles.addButtonSm, style]}
        onPress={onAdd}
        activeOpacity={0.8}
        accessibilityLabel="Add to cart"
        accessibilityRole="button"
      >
        <Text style={[styles.addButtonText, isSmall && styles.addButtonTextSm]}>Add</Text>
        <Plus size={isSmall ? 12 : 14} color={colors.primary} strokeWidth={2.5} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.stepperContainer, isSmall && styles.stepperContainerSm, style]}>
      <TouchableOpacity
        style={[styles.stepperButton, isSmall && styles.stepperButtonSm]}
        onPress={onRemove}
        activeOpacity={0.7}
        accessibilityLabel="Decrease quantity"
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Minus size={isSmall ? 14 : 16} color={colors.white} strokeWidth={3} />
      </TouchableOpacity>

      <Text style={[styles.quantityText, isSmall && styles.quantityTextSm]}>
        {quantity}
      </Text>

      <TouchableOpacity
        style={[styles.stepperButton, isSmall && styles.stepperButtonSm]}
        onPress={onAdd}
        activeOpacity={0.7}
        accessibilityLabel="Increase quantity"
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Plus size={isSmall ? 14 : 16} color={colors.white} strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add button (quantity === 0)
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFaded,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.base,
    minHeight: 36,
    gap: 4,
  },
  addButtonSm: {
    paddingHorizontal: spacing.md,
    minHeight: 32,
  },
  addButtonText: {
    fontSize: typography.fontSizes.button,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  addButtonTextSm: {
    fontSize: typography.fontSizes.bodySmall,
  },

  // Stepper (quantity > 0)
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    minHeight: 36,
    overflow: 'hidden',
  },
  stepperContainerSm: {
    minHeight: 32,
  },
  stepperButton: {
    width: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonSm: {
    width: 32,
    minHeight: 32,
  },
  quantityText: {
    fontSize: typography.fontSizes.button,
    fontWeight: typography.weights.bold,
    color: colors.white,
    minWidth: 24,
    textAlign: 'center',
  },
  quantityTextSm: {
    fontSize: typography.fontSizes.bodySmall,
    minWidth: 20,
  },
});
