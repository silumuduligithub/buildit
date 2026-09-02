import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import { mockStores } from '../../services/mockData';
import { CartItem } from '../../types';

export default function HardwareStoreDetail({ route, navigation }: any) {
  const storeId = route?.params?.storeId || 'r1';
  const { products, offers, retailers, cart, addToCart, updateCartQuantity, removeFromCart } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchMenu, setSearchMenu] = useState('');

  const store: any = mockStores.find((s) => s.id === storeId) || mockStores[0];

  // Store offers
  const storeOffers = offers
    .filter((o) => o.retailerId === store.id)
    .map((o) => ({
      ...o,
      product: products.find((p) => p.id === o.productId),
    }))
    .filter((o) => o.product);

  const categories = ['All', ...Array.from(new Set(storeOffers.map((o) => o.product?.category || 'Hardware')))];

  const filteredOffers = storeOffers.filter((o) => {
    const matchesCategory = activeCategory === 'All' || o.product?.category === activeCategory;
    const matchesSearch =
      searchMenu.length === 0 ||
      o.product?.name.toLowerCase().includes(searchMenu.toLowerCase()) ||
      o.product?.brand.toLowerCase().includes(searchMenu.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartQuantity = (offerId: string) => {
    const item = cart.find((i) => i.offer.id === offerId);
    return item ? item.quantity : 0;
  };

  const handleAddItem = (offer: typeof storeOffers[0]) => {
    const newItem: CartItem = {
      id: `cart-${offer.id}-${Date.now()}`,
      offer: offer as any,
      product: offer.product!,
      retailer: store,
      quantity: 1,
    };
    addToCart(newItem);
  };

  const handleIncrease = (offerId: string) => {
    const item = cart.find((i) => i.offer.id === offerId);
    if (item) updateCartQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = (offerId: string) => {
    const item = cart.find((i) => i.offer.id === offerId);
    if (!item) return;
    if (item.quantity <= 1) removeFromCart(item.id);
    else updateCartQuantity(item.id, item.quantity - 1);
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>{store.name}</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareIcon}>🔗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Store Info Card (Swiggy / Zomato Restaurant Header Card) */}
        <View style={styles.storeCard}>
          <View style={styles.storeHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeCuisine}>{store.cuisineTag}</Text>
              <Text style={styles.storeAddress}>{store.address}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStars}>★ {store.rating}</Text>
              <Text style={styles.ratingCount}>{store.totalReviews}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Time & Distance & Authorized Dealer */}
          <View style={styles.storeMetaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⚡</Text>
              <Text style={styles.metaText}>{store.prepTime}</Text>
            </View>
            <Text style={styles.metaDot}>•</Text>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={styles.metaText}>{store.distance} km away</Text>
            </View>
            <Text style={styles.metaDot}>•</Text>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🏷️</Text>
              <Text style={styles.metaText}>{store.costForTwo}</Text>
            </View>
          </View>

          {store.isAuthorizedDealer && (
            <View style={styles.authorizedTag}>
              <Text style={styles.shieldIcon}>🛡️</Text>
              <Text style={styles.authorizedText}>100% Genuine & Authorized Hardware Dealer</Text>
            </View>
          )}

          {/* Discount Strip */}
          <View style={styles.discountStrip}>
            <Text style={styles.discountIcon}>🏷️</Text>
            <Text style={styles.discountText}>{store.discountBanner}</Text>
          </View>
        </View>

        {/* Search within Menu */}
        <View style={styles.searchMenuContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchMenuInput}
            placeholder="Search tools, hardware & accessories..."
            placeholderTextColor={colors.textMuted}
            value={searchMenu}
            onChangeText={setSearchMenu}
          />
        </View>

        {/* Category Pills Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Menu Section Header */}
        <View style={styles.menuSectionHeader}>
          <Text style={styles.menuSectionTitle}>
            {activeCategory} ({filteredOffers.length})
          </Text>
          <Text style={styles.menuSectionSub}>Hardware catalogue & direct stock</Text>
        </View>

        {/* Items List (Swiggy / Zomato Menu Item Style) */}
        {filteredOffers.map((item) => {
          const qty = getCartQuantity(item.id);
          return (
            <View key={item.id} style={styles.menuItemCard}>
              <View style={styles.menuItemLeft}>
                {/* Hardware indicator icon (like veg/non-veg icon) */}
                <View style={styles.hardwareIndicator}>
                  <View style={styles.hardwareIndicatorDot} />
                </View>

                <Text style={styles.bestsellerTag}>★ BESTSELLER</Text>
                <Text style={styles.itemName}>{item.product?.name}</Text>
                <Text style={styles.itemBrand}>Brand: {item.product?.brand} • {item.product?.unit}</Text>
                <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                <Text style={styles.itemDesc} numberOfLines={2}>{item.product?.description}</Text>

                <View style={styles.stockBadge}>
                  <Text style={styles.stockBadgeText}>In Stock: {item.stock} units</Text>
                </View>
              </View>

              <View style={styles.menuItemRight}>
                <View style={styles.itemImageBox}>
                  <Text style={styles.itemImageEmoji}>
                    {item.product?.category === 'Power Tools' ? '🪚'
                      : item.product?.category === 'Hand Tools' ? '🔨'
                      : item.product?.category === 'Fasteners & Screws' ? '🔩'
                      : item.product?.category === 'Door & Lock Fittings' ? '🔐'
                      : item.product?.category === 'Plumbing Hardware' ? '🔧'
                      : item.product?.category === 'Safety Gear' ? '🦺'
                      : '⚡'}
                  </Text>
                </View>

                {/* Swiggy / Zomato Floating + ADD Button on Image */}
                <View style={styles.addButtonWrapper}>
                  {qty === 0 ? (
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={() => handleAddItem(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.addBtnText}>ADD</Text>
                      <Text style={styles.addBtnPlus}>+</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.stepperContainer}>
                      <TouchableOpacity
                        style={styles.stepperButton}
                        onPress={() => handleDecrease(item.id)}
                      >
                        <Text style={styles.stepperButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.stepperValue}>{qty}</Text>
                      <TouchableOpacity
                        style={styles.stepperButton}
                        onPress={() => handleIncrease(item.id)}
                      >
                        <Text style={styles.stepperButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  topBarTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  storeCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  storeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  storeName: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  storeCuisine: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 3,
    fontWeight: typography.weights.medium,
  },
  storeAddress: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: colors.text,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  ratingStars: {
    color: colors.white,
    fontWeight: typography.weights.extrabold,
    fontSize: typography.fontSizes.sm,
  },
  ratingCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm + 4,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaIcon: {
    fontSize: 12,
  },
  metaText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  metaDot: {
    fontSize: 10,
    color: colors.textMuted,
  },
  authorizedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.sm,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  shieldIcon: {
    fontSize: 12,
  },
  authorizedText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  discountStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginTop: spacing.sm,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  discountIcon: {
    fontSize: 13,
  },
  discountText: {
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  searchMenuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchMenuInput: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    color: colors.text,
    padding: 0,
  },
  categoryScroll: {
    marginTop: spacing.md,
  },
  categoryContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  categoryPillText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  categoryPillTextActive: {
    color: colors.white,
    fontWeight: typography.weights.bold,
  },
  menuSectionHeader: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  menuSectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  menuSectionSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  menuItemCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  menuItemLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  hardwareIndicator: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  hardwareIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  bestsellerTag: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  itemName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: 20,
  },
  itemBrand: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginTop: 4,
  },
  itemDesc: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    lineHeight: 16,
    marginTop: 4,
  },
  stockBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.xs,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stockBadgeText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  menuItemRight: {
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  itemImageBox: {
    width: 100,
    height: 95,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  itemImageEmoji: {
    fontSize: 44,
  },
  addButtonWrapper: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: 4,
    minWidth: 84,
    ...shadows.md,
  },
  addBtnText: {
    color: colors.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  addBtnPlus: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: typography.weights.extrabold,
    lineHeight: 18,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    overflow: 'hidden',
    ...shadows.md,
    minWidth: 84,
  },
  stepperButton: {
    width: 28,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: typography.weights.extrabold,
  },
  stepperValue: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    minWidth: 24,
    textAlign: 'center',
  },
});
