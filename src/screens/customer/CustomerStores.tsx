import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { mockStores } from '../../services/mockData';
import SwiggyHeader from '../../components/SwiggyHeader';

const HARDWARE_BRANDS = [
  { name: 'Bosch', logo: '🇩🇪', tagline: 'Power Tools' },
  { name: 'Stanley', logo: '🇺🇸', tagline: 'Hand Tools' },
  { name: 'Godrej', logo: '🇮🇳', tagline: 'Locks & Security' },
  { name: 'Taparia', logo: '🇮🇳', tagline: 'Pliers & Wrenches' },
  { name: 'DeWalt', logo: '🇺🇸', tagline: 'Angle Grinders' },
  { name: 'Hilti', logo: '🇨🇭', tagline: 'Anchors & Screws' },
];

const COLLECTIONS = [
  { id: 'c1', title: 'Top Rated Power Tool Outlets', desc: 'Drills, grinders & cutter specialists', icon: '🪚', count: '4 Stores' },
  { id: 'c2', title: 'Architectural Hardware & Locks', desc: 'Godrej, Dorset & Brass mortise locks', icon: '🔐', count: '6 Stores' },
  { id: 'c3', title: 'Fasteners, Screws & Anchors', desc: 'SS304 screws, nuts & high load anchors', icon: '🔩', count: '5 Stores' },
  { id: 'c4', title: 'Electrical & Safety Hubs', desc: 'Modular switches, safety shoes & helmets', icon: '⚡', count: '8 Stores' },
];

export default function CustomerStores({ navigation }: any) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.root}>
      <SwiggyHeader
        title="Hardware Hubs"
        subtitle="Discover Authorized Stores & Brand Outlets"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Brand Spotlight (Swiggy / Zomato Brand Carousels) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>POPULAR HARDWARE BRANDS</Text>
          <Text style={styles.sectionSub}>Shop directly from certified brand distributors</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.brandScroll}
          contentContainerStyle={styles.brandContent}
        >
          {HARDWARE_BRANDS.map((brand) => {
            const isSelected = selectedBrand === brand.name;
            return (
              <TouchableOpacity
                key={brand.name}
                style={[styles.brandCard, isSelected && styles.brandCardActive]}
                onPress={() => setSelectedBrand(isSelected ? null : brand.name)}
                activeOpacity={0.8}
              >
                <View style={styles.brandFlagCircle}>
                  <Text style={styles.brandFlagText}>{brand.logo}</Text>
                </View>
                <Text style={styles.brandName}>{brand.name}</Text>
                <Text style={styles.brandTagline}>{brand.tagline}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Curated Hardware Collections */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CURATED HARDWARE COLLECTIONS</Text>
          <Text style={styles.sectionSub}>Hand-picked stores for specific job requirements</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.collectionScroll}
          contentContainerStyle={styles.collectionContent}
        >
          {COLLECTIONS.map((col) => (
            <TouchableOpacity
              key={col.id}
              style={styles.collectionCard}
              onPress={() => navigation.navigate('StoreDetail', { storeId: 'r1' })}
              activeOpacity={0.88}
            >
              <View style={styles.collectionTop}>
                <Text style={styles.collectionIcon}>{col.icon}</Text>
                <View style={styles.collectionCountBadge}>
                  <Text style={styles.collectionCountText}>{col.count}</Text>
                </View>
              </View>
              <Text style={styles.collectionTitle}>{col.title}</Text>
              <Text style={styles.collectionDesc}>{col.desc}</Text>
              <Text style={styles.collectionCta}>Explore Collection ›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* All Hardware Stores */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ALL HARDWARE STORES</Text>
          <Text style={styles.sectionSub}>Verified outlets with immediate local dispatch</Text>
        </View>

        {mockStores.map((store: any) => (
          <TouchableOpacity
            key={store.id}
            style={styles.storeListCard}
            onPress={() => navigation.navigate('StoreDetail', { storeId: store.id })}
            activeOpacity={0.88}
          >
            <View style={styles.storeLeftAvatar}>
              <Text style={styles.storeAvatarEmoji}>
                {store.id === 'r1' ? '🛠️' : store.id === 'r2' ? '🔩' : store.id === 'r3' ? '🧰' : '🔐'}
              </Text>
            </View>

            <View style={styles.storeMiddleInfo}>
              <View style={styles.storeNameRow}>
                <Text style={styles.storeNameText} numberOfLines={1}>{store.name}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingBadgeText}>★ {store.rating}</Text>
                </View>
              </View>

              <Text style={styles.storeCuisine}>{store.cuisineTag}</Text>
              <Text style={styles.storeAddress} numberOfLines={1}>{store.address}</Text>

              <View style={styles.storeBottomStrip}>
                <Text style={styles.storeDistance}>📍 {store.distance} km • {store.prepTime}</Text>
                <Text style={styles.storeDiscount}>🏷️ {store.discountBanner.split('•')[0]}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
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
  sectionHeader: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  brandScroll: {
    marginTop: spacing.sm,
  },
  brandContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  brandCard: {
    width: 105,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  brandCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  brandFlagCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  brandFlagText: {
    fontSize: 22,
  },
  brandName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  brandTagline: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  collectionScroll: {
    marginTop: spacing.sm,
  },
  collectionContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  collectionCard: {
    width: 220,
    backgroundColor: colors.text,
    borderRadius: radii.xl,
    padding: spacing.md,
    ...shadows.md,
  },
  collectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  collectionIcon: {
    fontSize: 32,
  },
  collectionCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  collectionCountText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  collectionTitle: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    lineHeight: 20,
  },
  collectionDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.fontSizes.xs,
    marginTop: 4,
    lineHeight: 16,
  },
  collectionCta: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    marginTop: spacing.md,
  },
  storeListCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  storeLeftAvatar: {
    width: 70,
    height: 70,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginRight: spacing.md,
  },
  storeAvatarEmoji: {
    fontSize: 36,
  },
  storeMiddleInfo: {
    flex: 1,
  },
  storeNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeNameText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: '#267E3E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.xs,
    marginLeft: spacing.xs,
  },
  ratingBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  storeCuisine: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  storeAddress: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  storeBottomStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  storeDistance: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  storeDiscount: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: typography.weights.extrabold,
  },
});
