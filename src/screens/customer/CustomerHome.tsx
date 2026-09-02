import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { buildKartCategories, mockStores } from '../../services/mockData';
import GradientAppHeader from '../../components/GradientAppHeader';

const QUICK_ACTIONS = [
  { id: 'qa_cat', label: 'Categories', icon: '🗂️', screen: 'Categories' },
  { id: 'qa_stores', label: 'Stores', icon: '🏪', screen: 'Stores' },
  { id: 'qa_offers', label: 'Offers', icon: '🏷️', screen: 'Offers' },
  { id: 'qa_bulk', label: 'Bulk Order', icon: '🚛', screen: 'Stores' },
  { id: 'qa_reorder', label: 'Reorder', icon: '🔄', screen: 'Orders' },
];

const POPULAR_CATEGORIES = [
  { id: 'pc_cement', name: 'Cement', icon: '🏗️', category: 'Structural Materials' },
  { id: 'pc_steel', name: 'Steel', icon: '🔩', category: 'Structural Materials' },
  { id: 'pc_sand', name: 'Sand', icon: '⏳', category: 'Structural Materials' },
  { id: 'pc_bricks', name: 'Bricks', icon: '🧱', category: 'Structural Materials' },
  { id: 'pc_paint', name: 'Paints', icon: '🎨', category: 'Finishing' },
  { id: 'pc_more', name: 'More', icon: '📦', category: 'Hardware' },
];

export default function CustomerHome({ navigation }: any) {
  return (
    <View style={styles.root}>
      {/* ── 1. FIXED Non-scrollable Gradient Header at Top ── */}
      <GradientAppHeader
        variant="home"
        locationName="Kondapur, Hyderabad"
        onLocationPress={() => navigation.navigate('LocationSelect')}
        onNotificationPress={() => navigation.navigate('Offers')}
        onSearchPress={() => navigation.navigate('SearchTab')}
        hasUnreadNotification={true}
      />

      {/* ── 2. Scrollable Body Content ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── UltraTech Hero Banner ── */}
        <View style={styles.heroBanner}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroBrandName}>UltraTech Cement</Text>
            <Text style={styles.heroSubtitle}>The Engineer's Choice</Text>
            <View style={styles.heroDiscountPill}>
              <Text style={styles.heroDiscountText}>UP TO 10% OFF</Text>
            </View>
            <TouchableOpacity
              style={styles.heroOrderButton}
              onPress={() => navigation.navigate('CategoryProducts', { category: 'Structural Materials', sub: 'Cement' })}
              activeOpacity={0.85}
            >
              <Text style={styles.heroOrderText}>ORDER NOW</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroRightBag}>
            <View style={styles.bagBox}>
              <Text style={styles.bagEmoji}>🏗️</Text>
              <Text style={styles.bagLabel}>UltraTech</Text>
            </View>
          </View>
        </View>

        {/* ── Quick Action Grid ── */}
        <View style={styles.quickActionGrid}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.quickActionItem}
              onPress={() => {
                if (item.screen === 'Offers') {
                  navigation.navigate('Offers');
                } else if (item.screen === 'Categories') {
                  navigation.navigate('Categories');
                } else if (item.screen === 'Orders') {
                  navigation.navigate('Orders');
                } else {
                  navigation.navigate('Stores');
                }
              }}
              activeOpacity={0.75}
            >
              <View style={styles.quickActionCircle}>
                <Text style={styles.quickActionIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.quickActionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Popular Categories ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {POPULAR_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.popularCatCard}
              onPress={() => navigation.navigate('CategoryProducts', { category: cat.category, sub: cat.name })}
              activeOpacity={0.8}
            >
              <View style={styles.popularCatCircle}>
                <Text style={styles.popularCatIcon}>{cat.icon}</Text>
              </View>
              <Text style={styles.popularCatName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Top Stores Near You ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Stores Near You</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Stores')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.storesListContainer}>
          {mockStores.map((store) => (
            <TouchableOpacity
              key={store.id}
              style={styles.storeCard}
              onPress={() => navigation.navigate('StoreDetail', { storeId: store.id })}
              activeOpacity={0.88}
            >
              <View style={styles.storeIconBox}>
                <Text style={styles.storeEmoji}>🏪</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.storeName} numberOfLines={1}>{store.name}</Text>
                <Text style={styles.storeMetaText}>
                  ★ {store.rating} • {store.distance} km • 25-30 min
                </Text>
                <Text style={styles.storeAddress} numberOfLines={1}>{store.address}</Text>
              </View>

              <Text style={styles.storeArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

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
    paddingBottom: spacing.xxl,
  },
  heroBanner: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.md + 4,
    ...shadows.md,
  },
  heroLeft: {
    flex: 1,
  },
  heroBrandName: {
    color: colors.white,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.fontSizes.xs,
    marginTop: 2,
  },
  heroDiscountPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
    marginTop: spacing.sm,
  },
  heroDiscountText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  heroOrderButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFCC00',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.sm,
    marginTop: spacing.sm + 2,
  },
  heroOrderText: {
    color: '#111111',
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
  },
  heroRightBag: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagBox: {
    width: 76,
    height: 86,
    borderRadius: radii.md,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E6BE00',
    ...shadows.md,
  },
  bagEmoji: {
    fontSize: 32,
  },
  bagLabel: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    color: '#000',
    marginTop: 2,
  },
  quickActionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  quickActionItem: {
    alignItems: 'center',
    width: '20%',
  },
  quickActionCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  quickActionIcon: {
    fontSize: 20,
  },
  quickActionLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  viewAllText: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  categoriesScroll: {
    marginTop: spacing.sm,
  },
  categoriesContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm + 4,
  },
  popularCatCard: {
    alignItems: 'center',
    width: 68,
  },
  popularCatCircle: {
    width: 58,
    height: 58,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    marginBottom: spacing.xs,
    ...shadows.sm,
  },
  popularCatIcon: {
    fontSize: 26,
  },
  popularCatName: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  storesListContainer: {
    marginHorizontal: spacing.md,
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
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.sm,
  },
  storeIconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeEmoji: {
    fontSize: 24,
  },
  storeName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  storeMetaText: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  storeAddress: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  storeArrow: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: typography.weights.bold,
  },
});
