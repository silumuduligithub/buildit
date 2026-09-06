import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { mockProducts, mockStores, mockOffers } from '../../services/mockData';
import { useAppStore } from '../../store';
import { CartItem } from '../../types';
import AddToCartBottomSheet from '../../components/AddToCartBottomSheet';

export default function ProductDetailScreen({ route, navigation }: any) {
  const productId = route?.params?.productId || 'p_cement_1';
  const { cart, addToCart, updateCartQuantity, removeFromCart } = useAppStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);

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
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartItem = cart.find((item) => item.offer.id === offer.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    const item: CartItem = {
      id: `cart-${offer.id}-${Date.now()}`,
      offer,
      product,
      retailer: store,
      quantity: 1,
    };
    addToCart(item);
    setShowAddSheet(true);
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

  const decreaseQuantity = () => {
    if (!cartItem) return;
    if (quantity <= 1) removeFromCart(cartItem.id);
    else updateCartQuantity(cartItem.id, quantity - 1);
  };

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topIcon} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.topIcon} onPress={() => setIsFavorite(!isFavorite)}>
            <Text style={styles.actionIcon}>{isFavorite ? '♥' : '♡'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topIcon}>
            <Text style={styles.actionIcon}>♧</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.productHero}>
          <View style={styles.imageBox}>
            {product.name.includes('Cement') ? (
              <>
                <View style={styles.cementBag}>
                  <Text style={styles.bagBrand}>UltraTech</Text>
                  <Text style={styles.bagLabel}>CEMENT</Text>
                  <Text style={styles.bagGrade}>53</Text>
                  <Text style={styles.bagGradeLabel}>GRADE</Text>
                  <Text style={styles.bagWeight}>50 kg</Text>
                </View>
                <View style={styles.cementPile} />
              </>
            ) : (
              <Text style={styles.productLargeEmoji}>
                {product.name.includes('Steel') ? '🔩'
                  : product.name.includes('Sand') ? '⏳'
                  : product.name.includes('Brick') ? '🧱'
                  : product.name.includes('Paint') ? '🎨'
                  : '📦'}
              </Text>
            )}
          </View>
          <View style={styles.heroInfo}>
            <View style={styles.bestSeller}><Text style={styles.bestSellerText}>Best Seller</Text></View>
            <Text style={styles.productTitle}>{product.name}</Text>
            <Text style={styles.productUnitSubtitle}>{product.unit}</Text>
            <View style={styles.ratingRow}>
              <View style={styles.ratingStarBox}><Text style={styles.ratingStarText}>★ 4.6</Text></View>
              <Text style={styles.ratingCountText}>(1,364+ reviews)</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>₹{offer.price}</Text>
              <Text style={styles.priceUnitText}>/ {product.unit.split(' ')[1] || 'bag'}</Text>
            </View>
            <View style={styles.taxPill}><Text style={styles.taxText}>Inclusive of all taxes</Text></View>
            <Text style={styles.stockText}>In Stock</Text>
          </View>
        </View>

        <View style={styles.specGrid}>
          <View style={styles.specCell}><Text style={styles.specLabel}>Brand</Text><Text style={styles.specValue}>{product.brand}</Text></View>
          <View style={styles.specCell}><Text style={styles.specLabel}>Grade</Text><Text style={styles.specValue}>OPC 53</Text></View>
          <View style={styles.specCell}><Text style={styles.specLabel}>Pack Size</Text><Text style={styles.specValue}>{product.unit}</Text></View>
          <View style={styles.specCell}><Text style={styles.specLabel}>Type</Text><Text style={styles.specValue}>Cement</Text></View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>About this product</Text>
          <Text style={styles.descriptionText} numberOfLines={showFullDesc ? undefined : 4}>
            {product.description} A high strength cement suitable for all types of construction. It provides superior workability, faster setting time and high early strength.
          </Text>
          <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}><Text style={styles.viewMoreText}>{showFullDesc ? 'Read less' : 'Read more'} ▾</Text></TouchableOpacity>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresGrid}>
            {['High early strength', 'Minimum shrinkage', 'Better workability', 'Corrosion resistance', 'Low heat of hydration', 'Long lasting durability'].map((feature) => (
              <View style={styles.featureItem} key={feature}><Text style={styles.featureIcon}>♧</Text><Text style={styles.featureText}>{feature}</Text></View>
            ))}
          </View>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.reviewHeader}><Text style={styles.sectionTitle}>Customer Reviews (1,364+)</Text><Text style={styles.viewAll}>View all ›</Text></View>
          <View style={styles.reviewSummary}>
            <Text style={styles.reviewScore}>4.6</Text>
            <Text style={styles.stars}>★★★★★</Text>
            <View style={styles.ratingBars}>
              {['5  ███████████ 78%', '4  ██ 15%', '3  █ 4%', '2  █ 2%', '1  █ 1%'].map((bar) => <Text style={styles.ratingBar} key={bar}>{bar}</Text>)}
            </View>
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.expertButton}
          onPress={() => {}}
          activeOpacity={0.85}
        >
          <Text style={styles.expertText}>♧ Chat with Expert</Text>
        </TouchableOpacity>
        <View style={styles.quantityControl}>
          <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}><Text style={styles.quantityText}>−</Text></TouchableOpacity>
          <Text style={styles.quantityValue}>{quantity || 1}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={handleAddToCart}><Text style={styles.quantityText}>+</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleAddToCart} activeOpacity={0.88}>
          <Text style={styles.buyNowText}>🛒 Add to Cart</Text>
        </TouchableOpacity>
      </View>

      <AddToCartBottomSheet
        visible={showAddSheet}
        itemName={product.name}
        itemCount={cart.length}
        totalQuantity={totalItems}
        onClose={() => setShowAddSheet(false)}
        onContinue={() => setShowAddSheet(false)}
        onViewCart={() => {
          setShowAddSheet(false);
          navigation.navigate('Cart');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    height: 58,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
  },
  topActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  topIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: colors.text,
    fontSize: 36,
    lineHeight: 34,
    fontWeight: typography.weights.regular,
  },
  actionIcon: {
    color: colors.text,
    fontSize: 27,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  productHero: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  heroInfo: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  bestSeller: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD800',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestSellerText: {
    color: colors.text,
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
  },
  stockText: {
    color: '#2A9D55',
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
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
    width: 160,
    height: 188,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cementBag: {
    width: 82,
    height: 142,
    backgroundColor: '#F5C400',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9A900',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    shadowColor: '#8B6A00',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  bagBrand: {
    color: '#173B2C',
    fontSize: 13,
    fontWeight: typography.weights.extrabold,
    fontStyle: 'italic',
  },
  bagLabel: {
    color: '#173B2C',
    fontSize: 8,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 1,
  },
  bagGrade: {
    color: '#173B2C',
    fontSize: 25,
    lineHeight: 27,
    fontWeight: typography.weights.extrabold,
  },
  bagGradeLabel: {
    color: '#173B2C',
    fontSize: 7,
    fontWeight: typography.weights.extrabold,
  },
  bagWeight: {
    color: '#5A4300',
    fontSize: 7,
    marginTop: spacing.md,
  },
  cementPile: {
    position: 'absolute',
    bottom: 16,
    left: 12,
    width: 70,
    height: 22,
    backgroundColor: '#777777',
    borderRadius: 35,
    transform: [{ rotate: '-8deg' }],
    opacity: 0.88,
  },
  productLargeEmoji: {
    fontSize: 72,
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
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  specCell: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
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
    textAlign: 'center',
  },
  contentSection: {
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.sm,
  },
  featureItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureIcon: {
    color: colors.primary,
    fontSize: 15,
  },
  featureText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  reviewSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  reviewScore: {
    fontSize: 30,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  stars: {
    color: '#FFC400',
    fontSize: 15,
  },
  ratingBars: {
    flex: 1,
    gap: 1,
  },
  ratingBar: {
    color: colors.textSecondary,
    fontSize: 9,
    letterSpacing: 0,
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
    bottom: 78,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.sm,
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
  expertButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: '#FFB18D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expertText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  quantityButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: colors.text,
    fontSize: 23,
    lineHeight: 24,
  },
  quantityValue: {
    color: colors.text,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    minWidth: 16,
    textAlign: 'center',
  },
  buyNowButton: {
    flex: 1.15,
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
