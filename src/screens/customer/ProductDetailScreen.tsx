import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { mockProducts, mockStores, mockOffers } from '../../services/mockData';
import { useAppStore } from '../../store';
import { CartItem } from '../../types';
import GradientAppHeader from '../../components/GradientAppHeader';

export default function ProductDetailScreen({ route, navigation }: any) {
  const productId = route?.params?.productId || 'p_cement_1';
  const { addToCart } = useAppStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const product = mockProducts.find((p) => p.id === productId) || mockProducts[0];
  const store = mockStores[0];
  const offer = mockOffers.find((o) => o.productId === product.id) || {
    id: `offer_${product.id}`,
    productId: product.id,
    retailerId: store.id,
    price: 410,
    stock: 450,
    isAvailable: true,
    estimatedDeliveryMins: 25,
  };

  const handleAddToCart = () => {
    const item: CartItem = {
      id: `cart-${offer.id}-${Date.now()}`,
      offer,
      product,
      retailer: store,
      quantity: 1,
    };
    addToCart(item);
    Alert.alert('Added to Cart', `${product.name} added to your cart!`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const handleBuyNow = () => {
    const item: CartItem = {
      id: `cart-${offer.id}-${Date.now()}`,
      offer,
      product,
      retailer: store,
      quantity: 1,
    };
    addToCart(item);
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Product Details) ── */}
      <GradientAppHeader
        title="Product Details"
        subtitle={product.brand}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        rightIcon={isFavorite ? '❤️' : '🤍'}
        onRightPress={() => setIsFavorite(!isFavorite)}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Large Product Image Box */}
        <View style={styles.imageContainer}>
          <View style={styles.imageBox}>
            <Text style={styles.productLargeEmoji}>
              {product.name.includes('Cement') ? '🏗️'
                : product.name.includes('Steel') ? '🔩'
                : product.name.includes('Sand') ? '⏳'
                : product.name.includes('Brick') ? '🧱'
                : product.name.includes('Paint') ? '🎨'
                : '📦'}
            </Text>
            <View style={styles.bagBrandBadge}>
              <Text style={styles.bagBrandText}>{product.brand}</Text>
            </View>
          </View>
        </View>

        {/* Product Details Header */}
        <View style={styles.detailsCard}>
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.productUnitSubtitle}>{product.unit}</Text>

          {/* Star Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingStarBox}>
              <Text style={styles.ratingStarText}>★ 4.6</Text>
            </View>
            <Text style={styles.ratingCountText}>(1,364+ Reviews)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.priceValue}>₹{offer.price}</Text>
            <Text style={styles.priceUnitText}>/ {product.unit.split(' ')[1] || 'bag'}</Text>
            <View style={styles.taxPill}>
              <Text style={styles.taxText}>Inclusive of all taxes</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Specifications Table */}
          <Text style={styles.sectionTitle}>Product Details</Text>

          <View style={styles.specGrid}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Brand</Text>
              <Text style={styles.specValue}>{product.brand}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Pack Size</Text>
              <Text style={styles.specValue}>{product.unit}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Category</Text>
              <Text style={styles.specValue}>{product.category}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Usage</Text>
              <Text style={styles.specValue}>Construction & Masonry</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText} numberOfLines={showFullDesc ? undefined : 3}>
              {product.description} Standard specification conformance with maximum compressive strength and rapid hardening. Suitable for RCC columns, beams, slabs, plastering, and commercial infrastructure.
            </Text>
            <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
              <Text style={styles.viewMoreText}>{showFullDesc ? 'View less ▴' : 'View more ▾'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={handleBuyNow}
          activeOpacity={0.88}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  imageContainer: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  imageBox: {
    width: 170,
    height: 190,
    borderRadius: radii.xl,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E6BE00',
    position: 'relative',
    ...shadows.lg,
  },
  productLargeEmoji: {
    fontSize: 68,
  },
  bagBrandBadge: {
    position: 'absolute',
    bottom: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  bagBrandText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  productTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    lineHeight: 24,
  },
  productUnitSubtitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.sm,
  },
  ratingStarBox: {
    backgroundColor: '#267E3E',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  ratingStarText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
  },
  ratingCountText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: spacing.md,
  },
  priceValue: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  priceUnitText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.bold,
  },
  taxPill: {
    marginLeft: spacing.sm,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  taxText: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  specGrid: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.xs + 2,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  specValue: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  descriptionBox: {
    marginTop: spacing.md,
  },
  descriptionLabel: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  viewMoreText: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.bold,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.md,
    ...shadows.lg,
  },
  addToCartButton: {
    flex: 1,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: colors.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  buyNowText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
});
