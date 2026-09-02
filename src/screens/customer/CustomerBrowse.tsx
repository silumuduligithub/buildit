import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, SafeAreaView, TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import { categoryData } from '../../services/mockData';
import { CartItem } from '../../types';

export default function CustomerBrowse({ navigation, route }: any) {
  const { products, offers, retailers, addToCart, cart, updateCartQuantity, removeFromCart } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(route?.params?.category || categoryData[0].name);
  const [search, setSearch] = useState('');

  // Get cart quantity for an offer
  const getQty = (offerId: string) => {
    const found = cart.find((i) => i.offer.id === offerId);
    return found ? found.quantity : 0;
  };

  const cartItem = (offerId: string) => cart.find((i) => i.offer.id === offerId);

  const handleAdd = (offer: typeof enrichedOffers[0]) => {
    const item: CartItem = {
      id: `cart-${offer.id}-${Date.now()}`,
      offer: offer as any,
      product: offer.product!,
      retailer: offer.retailer!,
      quantity: 1,
    };
    addToCart(item);
  };

  const handleIncrease = (offerId: string) => {
    const item = cartItem(offerId);
    if (item) updateCartQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = (offerId: string) => {
    const item = cartItem(offerId);
    if (!item) return;
    if (item.quantity <= 1) removeFromCart(item.id);
    else updateCartQuantity(item.id, item.quantity - 1);
  };

  const enrichedOffers = useMemo(() => {
    return offers.map((o) => ({
      ...o,
      product: products.find((p) => p.id === o.productId),
      retailer: retailers.find((r) => r.id === o.retailerId),
    })).filter((o) => o.product && o.retailer);
  }, [offers, products, retailers]);

  const filteredOffers = useMemo(() => {
    return enrichedOffers.filter((o) => {
      const matchCat = o.product?.category === selectedCategory;
      const matchSearch = search.length === 0
        || o.product?.name.toLowerCase().includes(search.toLowerCase())
        || o.product?.brand.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [enrichedOffers, selectedCategory, search]);

  return (
    <SafeAreaView style={s.root}>
      {/* Search Header */}
      <View style={s.searchHeader}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={s.searchBar}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoFocus={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={s.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={s.body}>
        {/* ── LEFT: Category Sidebar ── */}
        <ScrollView
          style={s.sidebar}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.sidebarContent}
        >
          {categoryData.map((cat) => {
            const active = cat.name === selectedCategory;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.name)}
                style={[s.sidebarItem, active && s.sidebarItemActive]}
              >
                {active && <View style={s.sidebarAccent} />}
                <Text style={s.sidebarEmoji}>{cat.icon}</Text>
                <Text style={[s.sidebarLabel, active && s.sidebarLabelActive]} numberOfLines={2}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── RIGHT: Products Grid ── */}
        <View style={s.productsPane}>
          <Text style={s.paneCategoryTitle}>{selectedCategory}</Text>
          {filteredOffers.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyIcon}>📦</Text>
              <Text style={s.emptyText}>No products in this category yet</Text>
            </View>
          ) : (
            <FlatList
              data={filteredOffers}
              keyExtractor={(item) => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={s.row}
              contentContainerStyle={s.grid}
              renderItem={({ item }) => {
                const qty = getQty(item.id);
                return (
                  <View style={s.productCard}>
                    {/* Image Box */}
                    <View style={s.imgBox}>
                      <Text style={s.imgEmoji}>
                        {item.product?.category === 'Structural' ? '🏗️'
                          : item.product?.category === 'Finishing' ? '🎨'
                          : item.product?.category === 'Plumbing' ? '🚿'
                          : '⚡'}
                      </Text>
                      {/* Qty stepper inline on card */}
                      <View style={s.qtyControl}>
                        {qty === 0 ? (
                          <TouchableOpacity style={s.addBtn} onPress={() => handleAdd(item)}>
                            <Text style={s.addBtnText}>+</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={s.stepper}>
                            <TouchableOpacity style={s.stepBtn} onPress={() => handleDecrease(item.id)}>
                              <Text style={s.stepBtnText}>−</Text>
                            </TouchableOpacity>
                            <Text style={s.stepQty}>{qty}</Text>
                            <TouchableOpacity style={s.stepBtn} onPress={() => handleIncrease(item.id)}>
                              <Text style={s.stepBtnText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Info */}
                    <View style={s.cardInfo}>
                      <Text style={s.cardUnit}>{item.product?.unit}</Text>
                      <Text style={s.cardName} numberOfLines={2}>{item.product?.name}</Text>
                      <Text style={s.cardBrand}>{item.product?.brand}</Text>
                      <View style={s.priceRow}>
                        <Text style={s.cardPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                        <Text style={s.delivEta}>⚡{item.estimatedDeliveryMins}m</Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  /* Search Header */
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { color: colors.white, fontSize: 18, fontWeight: typography.weights.bold },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radii.md,
    paddingHorizontal: spacing.md, gap: spacing.sm,
    borderWidth: 0,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1, paddingVertical: spacing.sm,
    fontSize: typography.fontSizes.md, color: colors.text,
  },
  clearIcon: { color: colors.textMuted, fontSize: 14, padding: 4 },

  /* Body */
  body: { flex: 1, flexDirection: 'row' },

  /* Sidebar */
  sidebar: { width: 82, backgroundColor: colors.surface, borderRightWidth: 1, borderRightColor: colors.border },
  sidebarContent: { paddingVertical: spacing.xs },
  sidebarItem: {
    flexDirection: 'column', alignItems: 'center',
    paddingVertical: spacing.md, paddingHorizontal: spacing.xs,
    position: 'relative',
  },
  sidebarItemActive: { backgroundColor: colors.background },
  sidebarAccent: {
    position: 'absolute', left: 0, top: '20%', bottom: '20%',
    width: 3, borderRadius: radii.full, backgroundColor: colors.primary,
  },
  sidebarEmoji: { fontSize: 22, marginBottom: 4 },
  sidebarLabel: {
    fontSize: 10, color: colors.textSecondary, textAlign: 'center',
    fontWeight: typography.weights.medium, lineHeight: 14,
  },
  sidebarLabelActive: { color: colors.primary, fontWeight: typography.weights.bold },

  /* Products Pane */
  productsPane: { flex: 1 },
  paneCategoryTitle: {
    fontSize: typography.fontSizes.sm, fontWeight: typography.weights.bold,
    color: colors.text, paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  grid: { padding: spacing.sm, paddingBottom: 100 },
  row: { gap: spacing.sm, marginBottom: spacing.sm },

  /* Product Card */
  productCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
    ...shadows.sm,
  },
  imgBox: {
    backgroundColor: colors.background,
    paddingTop: spacing.md,
    alignItems: 'center', justifyContent: 'center',
    height: 90, position: 'relative',
  },
  imgEmoji: { fontSize: 40 },

  /* Qty Control – overlaid bottom-right of imgBox */
  qtyControl: {
    position: 'absolute', bottom: spacing.xs, right: spacing.xs,
  },
  addBtn: {
    width: 28, height: 28, borderRadius: radii.sm,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: colors.white, fontSize: 20, fontWeight: typography.weights.extrabold, lineHeight: 26 },
  stepper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.primary, borderRadius: radii.sm,
  },
  stepBtn: {
    width: 24, height: 28, alignItems: 'center', justifyContent: 'center',
  },
  stepBtnText: { color: colors.white, fontSize: 16, fontWeight: typography.weights.extrabold },
  stepQty: {
    color: colors.white, fontWeight: typography.weights.extrabold,
    fontSize: typography.fontSizes.sm, minWidth: 20, textAlign: 'center',
  },

  /* Card Info */
  cardInfo: { padding: spacing.sm },
  cardUnit: { fontSize: 10, color: colors.textMuted, marginBottom: 2 },
  cardName: { fontSize: typography.fontSizes.sm, fontWeight: typography.weights.semibold, color: colors.text, lineHeight: 17 },
  cardBrand: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  cardPrice: { fontSize: typography.fontSizes.md, fontWeight: typography.weights.extrabold, color: colors.text },
  delivEta: { fontSize: 10, color: colors.primary, fontWeight: typography.weights.bold },

  /* Empty */
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 52 },
  emptyText: { fontSize: typography.fontSizes.md, color: colors.textSecondary, marginTop: spacing.md },
});
