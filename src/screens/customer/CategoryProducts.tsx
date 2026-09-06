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
import GradientAppHeader from '../../components/GradientAppHeader';
import PicklistModal, { PicklistItem } from '../../components/PicklistModal';
import AddToCartBottomSheet from '../../components/AddToCartBottomSheet';

const SORT_OPTIONS: PicklistItem[] = [
  { label: 'Relevance (Recommended)', value: 'relevance', subLabel: 'Best match for your construction requirement' },
  { label: 'Price: Low to High', value: 'price_asc', subLabel: 'Cheapest wholesale rate first' },
  { label: 'Price: High to Low', value: 'price_desc', subLabel: 'Premium grades first' },
  { label: 'Customer Rating (4.0+)', value: 'rating', subLabel: 'Highest reviewed materials', badge: 'Top Rated' },
  { label: 'Fastest Delivery', value: 'delivery', subLabel: 'Under 30 mins to site', badge: '30 MIN' },
];

const BRAND_OPTIONS: PicklistItem[] = [
  { label: 'All Brands', value: 'all', subLabel: 'Show all certified manufacturers' },
  { label: 'UltraTech Cement', value: 'UltraTech', subLabel: 'India’s No. 1 Cement' },
  { label: 'Tata Tiscon', value: 'Tata Tiscon', subLabel: 'Primary TMT Rebars 550D' },
  { label: 'Ramco Cements', value: 'Ramco', subLabel: 'Supercrete High Strength PPC' },
  { label: 'ACC Cement', value: 'ACC', subLabel: 'Concrete Plus & Suraksha' },
  { label: 'Ambuja Cement', value: 'Ambuja', subLabel: 'Giant Compressive Strength' },
  { label: 'Birla White', value: 'Birla', subLabel: 'Wall Care Putty & White Cement' },
  { label: 'Bosch Power Tools', value: 'Bosch', subLabel: 'Impact Drills & Grinders' },
];

const PACK_SIZE_OPTIONS: PicklistItem[] = [
  { label: 'All Sizes', value: 'all', subLabel: 'Show all packaging types' },
  { label: '50 Kg Bag', value: '50kg', subLabel: 'Standard packaging for cement & mortar' },
  { label: 'Tonne / Metric Ton', value: 'tonne', subLabel: 'Bulk structural steel & aggregates' },
  { label: 'Single Piece (Pcs)', value: 'piece', subLabel: 'Hardware tools, bricks & pipes' },
  { label: '20 Litre Bucket', value: '20l', subLabel: 'Exterior & interior paint emulsions' },
];

const FILTER_OPTIONS: PicklistItem[] = [
  { label: 'All Products', value: 'all', subLabel: 'Show entire catalog' },
  { label: 'In Stock Only', value: 'in_stock', subLabel: 'Ready for immediate dispatch', badge: 'IN STOCK' },
  { label: 'Express Delivery (30 mins)', value: 'express', subLabel: 'Fast bike/auto delivery', badge: '⚡ 30 MIN' },
  { label: 'Special Discount Deals', value: 'deals', subLabel: 'Wholesale promotional discounts', badge: 'OFFERS' },
];

export default function CategoryProducts({ route, navigation }: any) {
  const categoryName = route?.params?.category || 'Structural Materials';
  const subCategoryName = route?.params?.sub || 'Cement';
  const { cart, addToCart, updateCartQuantity, removeFromCart } = useAppStore();

  // Active Filter Picklist Modals
  const [activePicklist, setActivePicklist] = useState<'sort' | 'brand' | 'pack_size' | 'filter' | null>(null);

  // Selected values
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedPackSize, setSelectedPackSize] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [showAddSheet, setShowAddSheet] = useState(false);

  // Filter and Sort Products
  let filteredProducts = mockProducts.filter((p) => {
    const matchesCat =
      categoryName === 'Structural Materials'
        ? p.category === 'Structural Materials' || p.category.toLowerCase().includes('structural')
        : p.category.toLowerCase().includes(categoryName.toLowerCase());

    const matchesBrand =
      selectedBrand === 'all' || p.brand.toLowerCase().includes(selectedBrand.toLowerCase());

    return matchesCat && matchesBrand;
  });

  if (selectedSort === 'price_asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => (a.name.length > b.name.length ? 1 : -1));
  }

  const getSortLabel = () => {
    const item = SORT_OPTIONS.find((s) => s.value === selectedSort);
    return item && selectedSort !== 'relevance' ? item.label.split(' ')[0] + ' ▾' : 'Sort ▾';
  };

  const getBrandLabel = () => {
    return selectedBrand !== 'all' ? selectedBrand + ' ▾' : 'Brand ▾';
  };

  const getPackSizeLabel = () => {
    const item = PACK_SIZE_OPTIONS.find((s) => s.value === selectedPackSize);
    return item && selectedPackSize !== 'all' ? item.label + ' ▾' : 'Pack Size ▾';
  };

  const getFilterLabel = () => {
    const item = FILTER_OPTIONS.find((s) => s.value === selectedFilter);
    return item && selectedFilter !== 'all' ? item.label.split(' ')[0] + ' ▾' : 'Filter ▾';
  };

  const getProductQuantity = (productId: string) =>
    cart
      .filter((item) => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);

  const handleAddProduct = (product: (typeof mockProducts)[number], price: number) => {
    const store = mockStores[0];
    const offer =
      mockOffers.find((o) => o.productId === product.id && o.retailerId === store.id) || {
        id: `offer-${product.id}-${store.id}`,
        productId: product.id,
        retailerId: store.id,
        price,
        stock: 500,
        isAvailable: true,
        estimatedDeliveryMins: 30,
      };

    addToCart({
      id: `cart-${offer.id}-${Date.now()}`,
      offer,
      product,
      retailer: store,
      quantity: 1,
    });
    setSelectedProductName(product.name);
    setShowAddSheet(true);
  };

  const handleDecreaseProduct = (product: (typeof mockProducts)[number]) => {
    const matching = cart.filter((item) => item.product.id === product.id);
    if (!matching.length) return;

    const item = matching[0];
    if (item.quantity <= 1) removeFromCart(item.id);
    else updateCartQuantity(item.id, item.quantity - 1);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Category Products) ── */}
      <GradientAppHeader
        title={subCategoryName || 'Materials'}
        subtitle="Compare verified local store rates"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        rightIcon="🔍"
        onRightPress={() => navigation.navigate('SearchTab')}
      />

      {/* ── Filter Chips Bar with Interactive Picklists ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {/* 1. Sort Picklist Button */}
        <TouchableOpacity
          style={[styles.filterChip, selectedSort !== 'relevance' && styles.filterChipActive]}
          onPress={() => setActivePicklist('sort')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterChipText, selectedSort !== 'relevance' && styles.filterChipTextActive]}>
            {getSortLabel()}
          </Text>
        </TouchableOpacity>

        {/* 2. Brand Picklist Button */}
        <TouchableOpacity
          style={[styles.filterChip, selectedBrand !== 'all' && styles.filterChipActive]}
          onPress={() => setActivePicklist('brand')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterChipText, selectedBrand !== 'all' && styles.filterChipTextActive]}>
            {getBrandLabel()}
          </Text>
        </TouchableOpacity>

        {/* 3. Pack Size Picklist Button */}
        <TouchableOpacity
          style={[styles.filterChip, selectedPackSize !== 'all' && styles.filterChipActive]}
          onPress={() => setActivePicklist('pack_size')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterChipText, selectedPackSize !== 'all' && styles.filterChipTextActive]}>
            {getPackSizeLabel()}
          </Text>
        </TouchableOpacity>

        {/* 4. Filter Picklist Button */}
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter !== 'all' && styles.filterChipActive]}
          onPress={() => setActivePicklist('filter')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterChipText, selectedFilter !== 'all' && styles.filterChipTextActive]}>
            {getFilterLabel()}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Products List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.productGrid}>
          {filteredProducts.map((product) => {
            const price = product.name.includes('UltraTech')
              ? 410
              : product.name.includes('Ramco')
              ? 395
              : product.name.includes('ACC')
              ? 405
              : product.name.includes('Ambuja')
              ? 400
              : product.name.includes('Steel')
              ? 680
              : 340;
            const quantity = getProductQuantity(product.id);

            return (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                activeOpacity={0.88}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.productImageBox}>
                    <Text style={styles.productEmoji}>
                      {product.name.includes('Cement') ? '🏗️'
                        : product.name.includes('Steel') ? '🔩'
                        : product.name.includes('Sand') ? '⏳'
                        : product.name.includes('Brick') ? '🧱'
                        : product.name.includes('Paint') ? '🎨'
                        : '📦'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('StoreCompare', { productId: product.id, productName: product.name })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.iconButtonText}>▣</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.productTitle} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.productMeta}>{product.unit}</Text>
                <Text style={styles.productPrice}>₹{price}</Text>

                <View style={styles.cardBottomRow}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    activeOpacity={0.8}
                    onPress={() => handleDecreaseProduct(product)}
                  >
                    <Text style={styles.stepBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepQty}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    activeOpacity={0.8}
                    onPress={() => handleAddProduct(product, price)}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <AddToCartBottomSheet
        visible={showAddSheet}
        itemName={selectedProductName}
        itemCount={cart.length}
        totalQuantity={totalItems}
        onClose={() => setShowAddSheet(false)}
        onContinue={() => {
          setShowAddSheet(false);
          navigation.navigate('Cart');
        }}
        onViewCart={() => {
          setShowAddSheet(false);
          navigation.navigate('Cart');
        }}
      />

      {/* ── 1. Sort Picklist Modal ── */}
      <PicklistModal
        visible={activePicklist === 'sort'}
        title="Sort Materials By"
        subtitle="Select sorting preference for prices & delivery"
        options={SORT_OPTIONS}
        selectedValue={selectedSort}
        onSelect={(val) => setSelectedSort(val)}
        onClose={() => setActivePicklist(null)}
      />

      {/* ── 2. Brand Picklist Modal ── */}
      <PicklistModal
        visible={activePicklist === 'brand'}
        title="Filter by Manufacturer Brand"
        subtitle="Select certified construction material brand"
        options={BRAND_OPTIONS}
        selectedValue={selectedBrand}
        onSelect={(val) => setSelectedBrand(val)}
        onClose={() => setActivePicklist(null)}
      />

      {/* ── 3. Pack Size Picklist Modal ── */}
      <PicklistModal
        visible={activePicklist === 'pack_size'}
        title="Select Packaging & Pack Size"
        subtitle="Filter by standard bag, bundle or metric quantity"
        options={PACK_SIZE_OPTIONS}
        selectedValue={selectedPackSize}
        onSelect={(val) => setSelectedPackSize(val)}
        onClose={() => setActivePicklist(null)}
      />

      {/* ── 4. General Filter Picklist Modal ── */}
      <PicklistModal
        visible={activePicklist === 'filter'}
        title="Filter Materials"
        subtitle="Stock availability, express transit & special offers"
        options={FILTER_OPTIONS}
        selectedValue={selectedFilter}
        onSelect={(val) => setSelectedFilter(val)}
        onClose={() => setActivePicklist(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterScroll: {
    flexGrow: 0,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: 7,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    includeFontPadding: false,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  productImageBox: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  productEmoji: {
    fontSize: 30,
  },
  iconButton: {
    width: 24,
    height: 24,
    borderRadius: radii.sm,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: typography.weights.bold,
  },
  productTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    lineHeight: 18,
    minHeight: 36,
  },
  productMeta: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  productPrice: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginTop: spacing.sm,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: radii.md,
    marginTop: spacing.sm,
    paddingVertical: 4,
    gap: 8,
  },
  stepBtn: {
    width: 24,
    height: 24,
    borderRadius: radii.sm,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: typography.weights.bold,
    lineHeight: 18,
  },
  stepQty: {
    color: colors.text,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    minWidth: 18,
    textAlign: 'center',
  },
});
