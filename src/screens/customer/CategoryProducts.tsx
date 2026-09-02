import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { mockProducts } from '../../services/mockData';
import GradientAppHeader from '../../components/GradientAppHeader';
import PicklistModal, { PicklistItem } from '../../components/PicklistModal';

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

  // Active Filter Picklist Modals
  const [activePicklist, setActivePicklist] = useState<'sort' | 'brand' | 'pack_size' | 'filter' | null>(null);

  // Selected values
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedPackSize, setSelectedPackSize] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');

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

          return (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
              activeOpacity={0.88}
            >
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

              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.productMeta}>Brand: {product.brand} • {product.unit}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingText}>★ 4.6</Text>
                  <Text style={styles.soldText}>1.1k+ sold</Text>
                </View>
                <Text style={styles.productPrice}>₹{price} <Text style={styles.unitText}>/ {product.unit.split(' ')[0]}</Text></Text>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('StoreCompare', { productId: product.id, productName: product.name })}
                activeOpacity={0.85}
              >
                <Text style={styles.addButtonText}>+ ADD</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

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
    gap: spacing.md,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm + 2,
    ...shadows.sm,
  },
  productImageBox: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  productEmoji: {
    fontSize: 34,
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  productTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    lineHeight: 18,
  },
  productMeta: {
    fontSize: 10,
    color: colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
    color: '#D97706',
  },
  soldText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  productPrice: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginTop: 2,
  },
  unitText: {
    fontSize: 10,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
  addButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.xs + 3,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  addButtonText: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
});
