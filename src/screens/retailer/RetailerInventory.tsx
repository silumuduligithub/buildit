import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';

const INVENTORY_FILTERS = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

export default function RetailerInventory({ route, navigation }: any) {
  const initialFilter = route?.params?.filter || 'All';
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const { products, offers, updateOfferStock, updateOfferPrice } = useAppStore();

  const inventoryItems = products.map((product) => {
    const offer = offers.find((o) => o.productId === product.id) || {
      id: `offer_${product.id}`,
      productId: product.id,
      retailerId: 'r1',
      price: 410,
      stock: product.id === 'p_plumbing_1' ? 0 : 120,
      isAvailable: product.id !== 'p_plumbing_1',
      estimatedDeliveryMins: 30,
    };

    const stockStatus =
      offer.stock <= 0
        ? 'Out of Stock'
        : offer.stock <= 50
        ? 'Low Stock'
        : 'In Stock';

    return {
      product,
      offer,
      stockStatus,
    };
  });

  const filteredItems = inventoryItems.filter((item) => {
    const matchesFilter =
      selectedFilter === 'All' || item.stockStatus === selectedFilter;

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleStockAdjust = (offerId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    updateOfferStock(offerId, newStock);
  };

  const handleToggleOutOfStock = (offerId: string, currentStock: number) => {
    if (currentStock > 0) {
      updateOfferStock(offerId, 0);
      Alert.alert('Marked Out of Stock', 'Customers will not be able to order this item until restocked.');
    } else {
      updateOfferStock(offerId, 100);
      Alert.alert('Restocked', 'Item marked in stock with 100 units.');
    }
  };

  const handleQuickRestock = (offerId: string, qty: number = 100) => {
    updateOfferStock(offerId, qty);
    Alert.alert('Restock Successful', `Added +${qty} units to inventory.`);
  };

  const handleEditPrice = (offerId: string, currentPrice: number, productName: string) => {
    if (Alert.prompt) {
      Alert.prompt(
        'Update Price',
        `Enter new selling price for ${productName}:`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Save',
            onPress: (val?: string) => {
              const parsed = parseInt(val || '0', 10);
              if (parsed > 0) updateOfferPrice(offerId, parsed);
            },
          },
        ],
        'plain-text',
        currentPrice.toString()
      );
    } else {
      navigation.navigate('Pricing');
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Inventory & Stock"
        subtitle={`${products.length} catalog items • Quick Stock Controls`}
        showBack={false}
        rightIcon="➕"
        onRightPress={() => navigation.navigate('AddProduct')}
      />

      {/* ── Search Bar ── */}
      <View style={styles.searchBarContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search materials by name, SKU, or category..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Filter Chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {INVENTORY_FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter;
          const count = inventoryItems.filter(
            (i) => filter === 'All' || i.stockStatus === filter
          ).length;

          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                {filter} {count > 0 ? `(${count})` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Inventory Products List ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredItems.length === 0 ? (
          /* Empty State when 0 items match filter */
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>
              {selectedFilter === 'Out of Stock' ? '🎉' : '📦'}
            </Text>
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'Out of Stock'
                ? 'No Out of Stock Items!'
                : `No ${selectedFilter} Products Found`}
            </Text>
            <Text style={styles.emptySub}>
              {selectedFilter === 'Out of Stock'
                ? 'Great news! All your construction materials are currently in stock and available for site delivery.'
                : 'Try adjusting your search query or view all catalog items.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyActionBtn}
              onPress={() => {
                setSelectedFilter('All');
                setSearchQuery('');
              }}
            >
              <Text style={styles.emptyActionText}>View All Inventory</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredItems.map(({ product, offer, stockStatus }) => {
            const isOutOfStock = stockStatus === 'Out of Stock';

            return (
              <View
                key={product.id}
                style={[
                  styles.productCard,
                  isOutOfStock && styles.productCardOutOfStock,
                ]}
              >
                {/* Top Row: Thumbnail, Title, Stock Pill */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.productThumb, isOutOfStock && styles.productThumbOutOfStock]}>
                    <Text style={styles.productEmoji}>
                      {product.name.includes('Cement') ? '🏗️'
                        : product.name.includes('Steel') ? '🔩'
                        : product.name.includes('Sand') ? '⏳'
                        : product.name.includes('Brick') ? '🧱'
                        : product.name.includes('Paint') ? '🎨'
                        : '📦'}
                    </Text>
                  </View>

                  <View style={styles.productInfoCol}>
                    <Text
                      style={[styles.productName, isOutOfStock && styles.productNameMuted]}
                      numberOfLines={2}
                    >
                      {product.name}
                    </Text>
                    <Text style={styles.productMeta}>
                      Brand: {product.brand} • SKU: {product.sku || `SKU-${product.id.toUpperCase()}`}
                    </Text>
                    <Text style={styles.productCategory}>{product.category} • {product.unit}</Text>
                  </View>

                  <View
                    style={[
                      styles.stockBadge,
                      stockStatus === 'In Stock' && { backgroundColor: '#ECFDF5' },
                      stockStatus === 'Low Stock' && { backgroundColor: '#FEF3C7' },
                      stockStatus === 'Out of Stock' && { backgroundColor: '#FEE2E2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stockBadgeText,
                        stockStatus === 'In Stock' && { color: '#059669' },
                        stockStatus === 'Low Stock' && { color: '#B45309' },
                        stockStatus === 'Out of Stock' && { color: '#DC2626' },
                      ]}
                    >
                      {stockStatus.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Middle Row: Price & Inline Quick Stock Adjustment */}
                <View style={[styles.middleControlsRow, isOutOfStock && styles.middleRowOutOfStock]}>
                  <TouchableOpacity
                    style={styles.priceBox}
                    onPress={() => handleEditPrice(offer.id, offer.price, product.name)}
                  >
                    <Text style={styles.priceLabel}>Price</Text>
                    <View style={styles.priceEditRow}>
                      <Text style={styles.priceValue}>₹{offer.price}</Text>
                      <Text style={styles.editPencil}>✏️</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Stock Controls */}
                  <View style={styles.stepperContainer}>
                    <Text style={styles.stockLabel}>Available Quantity</Text>
                    <View style={styles.stepperControls}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => handleStockAdjust(offer.id, offer.stock, -25)}
                      >
                        <Text style={styles.stepBtnText}>-25</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => handleStockAdjust(offer.id, offer.stock, -5)}
                      >
                        <Text style={styles.stepBtnText}>-5</Text>
                      </TouchableOpacity>

                      <Text
                        style={[
                          styles.currentStockQty,
                          isOutOfStock && { color: '#DC2626' },
                        ]}
                      >
                        {offer.stock}
                      </Text>

                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => handleStockAdjust(offer.id, offer.stock, +5)}
                      >
                        <Text style={styles.stepBtnText}>+5</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => handleStockAdjust(offer.id, offer.stock, +25)}
                      >
                        <Text style={styles.stepBtnText}>+25</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Bottom Actions Row */}
                <View style={styles.bottomActionsRow}>
                  {isOutOfStock ? (
                    <TouchableOpacity
                      style={styles.quickRestockBtn}
                      onPress={() => handleQuickRestock(offer.id, 100)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.quickRestockText}>⚡ Quick Restock (+100 Units)</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.toggleStockBtn}
                      onPress={() => handleToggleOutOfStock(offer.id, offer.stock)}
                    >
                      <Text style={styles.toggleStockText}>🔴 Mark Out of Stock</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.promoBtn}
                    onPress={() => navigation.navigate('Promotions')}
                  >
                    <Text style={styles.promoBtnText}>🏷️ Promotion</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Product FAB */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('AddProduct')}
        activeOpacity={0.88}
      >
        <Text style={styles.fabEmoji}>➕</Text>
        <Text style={styles.fabText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.fontSizes.xs,
    color: '#111827',
  },
  clearIcon: {
    fontSize: 14,
    color: '#9CA3AF',
    padding: 4,
  },
  filterScroll: {
    flexGrow: 0,
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm,
  },
  filterContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
  },
  filterChipActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  filterText: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
    includeFontPadding: false,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  productCardOutOfStock: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFBFB',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productThumb: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productThumbOutOfStock: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  productEmoji: {
    fontSize: 26,
  },
  productInfoCol: {
    flex: 1,
  },
  productName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    lineHeight: 18,
  },
  productNameMuted: {
    color: '#374151',
  },
  productMeta: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  productCategory: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: typography.weights.bold,
    marginTop: 1,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  stockBadgeText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  middleControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  middleRowOutOfStock: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  priceBox: {
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  priceLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
  },
  priceEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  priceValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#0F172A',
  },
  editPencil: {
    fontSize: 11,
  },
  stepperContainer: {
    flex: 1,
    paddingLeft: spacing.md,
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
  },
  stepBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#334155',
  },
  currentStockQty: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#0F172A',
    minWidth: 36,
    textAlign: 'center',
  },
  bottomActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  quickRestockBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.md,
    ...shadows.sm,
  },
  quickRestockText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  toggleStockBtn: {
    paddingVertical: 4,
  },
  toggleStockText: {
    fontSize: typography.fontSizes.xs,
    color: '#4B5563',
    fontWeight: typography.weights.bold,
  },
  promoBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  promoBtnText: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#92400E',
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  emptyEmoji: {
    fontSize: 54,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  emptySub: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  emptyActionBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.lg,
    marginTop: spacing.lg,
  },
  emptyActionText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.full,
    gap: 6,
    ...shadows.lg,
  },
  fabEmoji: {
    fontSize: 16,
  },
  fabText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
});
