import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography } from '../../theme/colors';

interface PriceDisplayProps {
  sellingPrice: number;
  mrp?: number;
  /** Show "₹" prefix — default true */
  showCurrency?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export default function PriceDisplay({
  sellingPrice,
  mrp,
  showCurrency = true,
  size = 'md',
  style,
}: PriceDisplayProps) {
  const hasDiscount = mrp && mrp > sellingPrice;
  const discountPct = hasDiscount ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const prefix = showCurrency ? '₹' : '';

  const fontConfig = SIZE_CONFIG[size];

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.sellingPrice, { fontSize: fontConfig.price }]}>
        {prefix}{sellingPrice.toLocaleString('en-IN')}
      </Text>

      {hasDiscount && (
        <>
          <Text style={[styles.mrp, { fontSize: fontConfig.mrp }]}>
            {prefix}{mrp.toLocaleString('en-IN')}
          </Text>
          <View style={styles.discountBadge}>
            <Text style={[styles.discountText, { fontSize: fontConfig.discount }]}>
              {discountPct}% OFF
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const SIZE_CONFIG = {
  sm: { price: 13, mrp: 10, discount: 9 },
  md: { price: typography.fontSizes.price, mrp: typography.fontSizes.priceStrike, discount: 10 },
  lg: { price: 20, mrp: 14, discount: 11 },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  sellingPrice: {
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  mrp: {
    fontWeight: typography.weights.regular,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  discountText: {
    fontWeight: typography.weights.semibold,
    color: colors.success,
  },
});
