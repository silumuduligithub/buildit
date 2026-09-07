import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LayoutGrid,
  Store,
  Tag,
  Truck,
  RotateCcw,
  ChevronRight,
  Star,
  MapPin,
  Clock,
} from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import ProductCard from '../../components/ProductCard';

// ── Top Categories with photo-realistic backgrounds ──
const TOP_CATEGORIES = [
  {
    id: 'cat_building',
    title: 'Building Materials',
    category: 'Structural Materials',
    imageUrl:
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat_finishing',
    title: 'Finishing Materials',
    category: 'Finishing',
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat_hardware',
    title: 'Hardware Tools',
    category: 'Hardware',
    imageUrl:
      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat_electrical',
    title: 'Electrical',
    category: 'Electrical',
    imageUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat_plumbing',
    title: 'Plumbing',
    category: 'Plumbing',
    imageUrl:
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
  },
];

// ── Product Subcategories matching mockup chips ──
const PRODUCT_CATEGORY_CHIPS = [
  { id: 'Cement', label: 'Cement' },
  { id: 'Steel', label: 'Steel' },
  { id: 'BRC', label: 'BRC' },
  { id: 'Square Tubes', label: 'Square Tubes' },
  { id: 'Paints', label: 'Paints' },
  { id: 'Bricks', label: 'Bricks' },
  { id: 'Tools', label: 'Tools' },
];

interface DisplayProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  unit: string;
  price: number;
  mrp: number;
  imageUrl: string;
}

const FEATURED_PRODUCTS_BY_CATEGORY: Record<string, DisplayProduct[]> = {
  Cement: [
    {
      id: 'p_cement_1',
      name: 'UltraTech Cement OPC 53 Grade',
      brand: 'UltraTech',
      category: 'Structural Materials',
      unit: '50 Kg Bag',
      price: 410,
      mrp: 450,
      imageUrl:
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p_cement_2',
      name: 'Ramco Supercrete PPC Cement',
      brand: 'Ramco',
      category: 'Structural Materials',
      unit: '50 Kg Bag',
      price: 395,
      mrp: 430,
      imageUrl:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p_cement_3',
      name: 'ACC Gold Water Shield Cement',
      brand: 'ACC',
      category: 'Structural Materials',
      unit: '50 Kg Bag',
      price: 405,
      mrp: 445,
      imageUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p_cement_4',
      name: 'Ambuja Kawach Waterproof Cement',
      brand: 'Ambuja',
      category: 'Structural Materials',
      unit: '50 Kg Bag',
      price: 400,
      mrp: 440,
      imageUrl:
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=500&auto=format&fit=crop&q=80',
    },
  ],
  Steel: [
    {
      id: 'p_steel_1',
      name: 'Tata Tiscon 550D TMT Rebars',
      brand: 'Tata Tiscon',
      category: 'Structural Materials',
      unit: '12mm (12 Metre)',
      price: 680,
      mrp: 750,
      imageUrl:
        'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p_steel_2',
      name: 'JSW Neosteel 550D Rebars',
      brand: 'Rainham & Palak',
      category: 'Structural Materials',
      unit: '10mm (12 Metre)',
      price: 540,
      mrp: 600,
      imageUrl:
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=80',
    },
  ],
  BRC: [
    {
      id: 'p_brc_1',
      name: 'BRC Heavy Reinforcement Mesh A142',
      brand: 'BRC Standard',
      category: 'Structural Materials',
      unit: '4.8m x 2.4m Sheet',
      price: 1850,
      mrp: 2100,
      imageUrl:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p_brc_2',
      name: 'BRC Slab Mesh Fabric A252',
      brand: 'BRC Standard',
      category: 'Structural Materials',
      unit: '4.8m x 2.4m Sheet',
      price: 2450,
      mrp: 2750,
      imageUrl:
        'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=500&auto=format&fit=crop&q=80',
    },
  ],
  'Square Tubes': [
    {
      id: 'p_tube_1',
      name: 'Tata Structura Square Hollow Section',
      brand: 'Tata Structura',
      category: 'Structural Materials',
      unit: '50x50mm 6m Length',
      price: 1420,
      mrp: 1600,
      imageUrl:
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p_tube_2',
      name: 'Apollo Structural Steel Square Tube',
      brand: 'APL Apollo',
      category: 'Structural Materials',
      unit: '40x40mm 6m Length',
      price: 1150,
      mrp: 1300,
      imageUrl:
        'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=500&auto=format&fit=crop&q=80',
    },
  ],
  Paints: [
    {
      id: 'p_paint_1',
      name: 'Asian Paints Apex Ultima Exterior',
      brand: 'Asian Paints',
      category: 'Finishing',
      unit: '20 Litre Bucket',
      price: 5450,
      mrp: 6100,
      imageUrl:
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80',
    },
  ],
  Bricks: [
    {
      id: 'p_bricks_1',
      name: 'Wirecut Red Clay Bricks (Class 1)',
      brand: 'Standard Kiln',
      category: 'Structural Materials',
      unit: '500 Pcs Trolley',
      price: 4500,
      mrp: 5000,
      imageUrl:
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=500&auto=format&fit=crop&q=80',
    },
  ],
  Tools: [
    {
      id: 'p_hardware_1',
      name: 'Bosch GSB 500W Impact Drill Kit',
      brand: 'Bosch Professional',
      category: 'Hardware',
      unit: '1 Full Kit',
      price: 3499,
      mrp: 4299,
      imageUrl:
        'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80',
    },
  ],
};

const QUICK_ACTIONS = [
  { id: 'qa_cat', label: 'Categories', Icon: LayoutGrid, screen: 'Categories' },
  { id: 'qa_stores', label: 'Stores', Icon: Store, screen: 'Stores' },
  { id: 'qa_offers', label: 'Offers', Icon: Tag, screen: 'Offers' },
  { id: 'qa_bulk', label: 'Bulk Order', Icon: Truck, screen: 'Stores' },
  { id: 'qa_reorder', label: 'Reorder', Icon: RotateCcw, screen: 'Orders' },
];

export default function CustomerHome({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Cement');

  const {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    syncAddToCart,
    syncUpdateCartQuantity,
    syncRemoveCartItem,
    fetchHomeFeed,
    fetchCart,
    products,
    offers,
    retailers,
  } = useAppStore();

  useEffect(() => {
    fetchHomeFeed().catch(() => {});
    fetchCart().catch(() => {});
  }, []);

  const cartQuantityMap = useMemo(() => {
    const map = new Map<string, number>();
    cart.forEach((item) => {
      const current = map.get(item.product.id) || 0;
      map.set(item.product.id, current + item.quantity);
    });
    return map;
  }, [cart]);

  const displayedProducts =
    FEATURED_PRODUCTS_BY_CATEGORY[selectedCategory] ||
    FEATURED_PRODUCTS_BY_CATEGORY['Cement'];

  const handleAddProduct = (prod: DisplayProduct) => {
    const existing = cart.find((i) => i.product.id === prod.id);
    if (existing) {
      syncUpdateCartQuantity(existing.id, existing.quantity + 1);
      return;
    }

    syncAddToCart(prod.id, undefined, 1);
  };

  const handleRemoveProduct = (prodId: string) => {
    const existing = cart.find((i) => i.product.id === prodId);
    if (existing) {
      if (existing.quantity > 1) {
        syncUpdateCartQuantity(existing.id, existing.quantity - 1);
      } else {
        syncRemoveCartItem(existing.id);
      }
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Signature Gradient Header with Fulfillment Switcher ── */}
      <GradientAppHeader
        variant="home"
        searchPlaceholder="Search Product"
        onSearchPress={() => navigation.navigate('SearchTab')}
        onCameraPress={() =>
          Alert.alert('Visual Search', 'Snap a photo of any material or tool to identify & order instantly!')
        }
        onFilterPress={() => navigation.navigate('SearchTab')}
        onNotificationPress={() => navigation.navigate('Offers')}
        hasUnreadNotification={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── SECTION 1: Top Categories (Reference Design Mockup) ── */}
        <SectionHeader
          title="Top Categories"
          actionLabel="Browse All"
          onAction={() => navigation.navigate('Categories')}
          style={styles.sectionHeader}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topCategoriesScroll}
        >
          {TOP_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() =>
                navigation.navigate('CategoryProducts', {
                  category: cat.category,
                })
              }
              activeOpacity={0.88}
            >
              <ImageBackground
                source={{ uri: cat.imageUrl }}
                style={styles.categoryCardBg}
                imageStyle={styles.categoryCardImage}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.75)']}
                  style={styles.categoryOverlay}
                >
                  <Text style={styles.categoryCardTitle} numberOfLines={2}>
                    {cat.title}
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── SECTION 2: Top Products by Category ── */}
        <SectionHeader
          title="Top Products by Category"
          style={[styles.sectionHeader, { marginTop: spacing.xl }]}
        />

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {PRODUCT_CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                style={[
                  styles.filterChip,
                  isSelected ? styles.filterChipActive : styles.filterChipInactive,
                ]}
                onPress={() => setSelectedCategory(chip.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected
                      ? styles.filterChipTextActive
                      : styles.filterChipTextInactive,
                  ]}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Product Cards Grid */}
        <View style={styles.productGrid}>
          {displayedProducts.map((prod) => {
            const qty = cartQuantityMap.get(prod.id) || 0;
            return (
              <ProductCard
                key={prod.id}
                id={prod.id}
                name={prod.name}
                brand={prod.brand}
                unit={prod.unit}
                price={prod.price}
                mrp={prod.mrp}
                quantity={qty}
                imageUrl={prod.imageUrl}
                onPress={() =>
                  navigation.navigate('ProductDetail', { productId: prod.id })
                }
                onAdd={() => handleAddProduct(prod)}
                onRemove={() => handleRemoveProduct(prod.id)}
                onCompare={() =>
                  navigation.navigate('StoreCompare', { productId: prod.id })
                }
              />
            );
          })}
        </View>

        {/* ── SECTION 3: Quick Actions ── */}
        <View style={styles.quickActionContainer}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.quickActionItem}
              onPress={() => {
                if (item.screen === 'Offers') navigation.navigate('Offers');
                else if (item.screen === 'Categories')
                  navigation.navigate('Categories');
                else if (item.screen === 'Orders')
                  navigation.navigate('Orders');
                else navigation.navigate('Stores');
              }}
              activeOpacity={0.75}
              accessibilityLabel={item.label}
            >
              <View style={styles.quickActionCircle}>
                <item.Icon size={20} color={colors.primary} strokeWidth={1.5} />
              </View>
              <Text style={styles.quickActionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── SECTION 4: Top Stores Near You ── */}
        <SectionHeader
          title="Top Stores Near You"
          actionLabel="View all"
          onAction={() => navigation.navigate('Stores')}
          style={[styles.sectionHeader, { marginTop: spacing.xl }]}
        />
        <View style={styles.storesList}>
          {retailers.slice(0, 3).map((store) => (
            <TouchableOpacity
              key={store.id}
              style={styles.storeCard}
              onPress={() =>
                navigation.navigate('StoreDetail', { storeId: store.id })
              }
              activeOpacity={0.88}
            >
              <View style={styles.storeIconBox}>
                <Store size={22} color={colors.primary} strokeWidth={1.5} />
              </View>
              <View style={styles.storeInfo}>
                <Text style={styles.storeName} numberOfLines={1}>
                  {store.name}
                </Text>
                <View style={styles.storeMetaRow}>
                  <Star
                    size={12}
                    color={colors.accent}
                    strokeWidth={2}
                    fill={colors.accent}
                  />
                  <Text style={styles.storeRating}>{store.rating}</Text>
                  <Text style={styles.storeMetaDot}>•</Text>
                  <MapPin size={11} color={colors.textTertiary} strokeWidth={1.5} />
                  <Text style={styles.storeDistance}>{store.distance} km</Text>
                  <Text style={styles.storeMetaDot}>•</Text>
                  <Clock size={11} color={colors.textTertiary} strokeWidth={1.5} />
                  <Text style={styles.storeTime}>25-30 min</Text>
                </View>
                <Text style={styles.storeAddress} numberOfLines={1}>
                  {store.address}
                </Text>
              </View>
              <ChevronRight
                size={16}
                color={colors.textTertiary}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom spacer for bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  sectionHeader: {
    paddingHorizontal: spacing.base,
  },

  // ── Top Categories Carousel (Mockup) ──
  topCategoriesScroll: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  categoryCard: {
    width: 140,
    height: 90,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  categoryCardBg: {
    width: '100%',
    height: '100%',
  },
  categoryCardImage: {
    borderRadius: radii.lg,
  },
  categoryOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.sm,
  },
  categoryCardTitle: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.white,
    lineHeight: 16,
  },

  // ── Chips Row (Mockup Style) ──
  chipsScroll: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: colors.pillActiveBg,
    borderColor: colors.pillActiveBorder,
  },
  filterChipInactive: {
    backgroundColor: colors.pillInactiveBg,
    borderColor: colors.pillInactiveBorder,
  },
  filterChipText: {
    fontSize: typography.fontSizes.bodySmall,
  },
  filterChipTextActive: {
    color: colors.pillActiveText,
    fontWeight: typography.weights.bold,
  },
  filterChipTextInactive: {
    color: colors.pillInactiveText,
    fontWeight: typography.weights.medium,
  },

  // ── Products Grid ──
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },

  // ── Quick Actions ──
  quickActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    marginHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  quickActionItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickActionCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },

  // ── Stores List ──
  storesList: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  storeIconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 4,
  },
  storeRating: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  storeMetaDot: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
  },
  storeDistance: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
  },
  storeTime: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
  },
  storeAddress: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
});
