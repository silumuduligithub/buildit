import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Package, BarChart3 } from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows } from '../theme/colors';
import PriceDisplay from './ui/PriceDisplay';
import QuantitySelector from './ui/QuantitySelector';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  unit: string;
  price: number;
  mrp?: number;
  quantity: number;
  imageUrl?: string;
  inStock?: boolean;
  onPress: () => void;
  onAdd: () => void;
  onRemove: () => void;
  onCompare?: () => void;
}

function ProductCard({
  name,
  brand,
  unit,
  price,
  mrp,
  quantity,
  imageUrl,
  inStock = true,
  onPress,
  onAdd,
  onRemove,
  onCompare,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const fallbackImage = name.toLowerCase().includes('cement')
    ? 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&auto=format&fit=crop&q=80'
    : name.toLowerCase().includes('steel') || name.toLowerCase().includes('rebar') || name.toLowerCase().includes('tmt')
    ? 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=400&auto=format&fit=crop&q=80'
    : name.toLowerCase().includes('plywood') || name.toLowerCase().includes('wood')
    ? 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80'
    : name.toLowerCase().includes('paint') || name.toLowerCase().includes('putty')
    ? 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80'
    : name.toLowerCase().includes('brick')
    ? 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=400&auto=format&fit=crop&q=80';

  const finalImageUrl = imageUrl && imageUrl.trim().length > 0 ? imageUrl : fallbackImage;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityLabel={`${name} by ${brand}, ${unit}`}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {!imageError ? (
          <Image
            source={{ uri: finalImageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={(e) => {
              console.warn(`[ProductCard] Image load failed for "${name}" (URL: ${finalImageUrl}):`, e.nativeEvent);
              setImageError(true);
            }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Package size={28} color={colors.textTertiary} strokeWidth={1.2} />
          </View>
        )}

        {/* Compare Button */}
        {onCompare && (
          <TouchableOpacity
            style={styles.compareButton}
            onPress={onCompare}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Compare prices"
          >
            <BarChart3 size={14} color={colors.textSecondary} strokeWidth={1.5} />
          </TouchableOpacity>
        )}

        {/* Out of Stock Overlay */}
        {!inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of stock</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.brand} numberOfLines={1}>{brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.unit}>{unit}</Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <PriceDisplay sellingPrice={price} mrp={mrp} size="sm" />
        </View>

        {/* Add to Cart / Quantity */}
        <View style={styles.actionRow}>
          <QuantitySelector
            quantity={inStock ? quantity : 0}
            onAdd={onAdd}
            onRemove={onRemove}
            size="sm"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.sm,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1.2,
    backgroundColor: colors.surfaceSecondary,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  compareButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  infoContainer: {
    padding: spacing.md,
  },
  brand: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  name: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: typography.fontSizes.bodySmall * typography.lineHeights.normal,
    minHeight: 36,
  },
  unit: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  priceRow: {
    marginTop: spacing.sm,
  },
  actionRow: {
    marginTop: spacing.sm,
    alignItems: 'flex-start',
  },
});
