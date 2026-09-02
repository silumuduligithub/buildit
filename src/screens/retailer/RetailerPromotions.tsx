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
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';

const PROMO_TABS = ['Active', 'Upcoming', 'Expired'];

export default function RetailerPromotions({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('Active');
  const { promotions, addPromotion, deletePromotion } = useAppStore();

  const filteredPromos = promotions.filter(
    (p) => p.status.toLowerCase() === activeTab.toLowerCase()
  );

  const handleCreatePromo = () => {
    Alert.alert('Create Promotion', 'Launch 10% discount on Ramco Super Cement?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Create',
        onPress: () => {
          addPromotion({
            id: `promo_${Date.now()}`,
            title: 'Flash Cement Discount',
            productName: 'Ramco Supercrete PPC Cement',
            discountPct: 10,
            couponCode: 'RAMCO10',
            startDate: 'Today',
            endDate: '30 June, 2025',
            status: 'active',
          });
          Alert.alert('Promotion Live', 'Discount is now visible to customers.');
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Promotions & Discounts"
        subtitle="Boost wholesale orders with custom store coupons"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        rightIcon="➕"
        onRightPress={handleCreatePromo}
      />

      {/* ── Tabs ── */}
      <View style={styles.tabsBar}>
        {PROMO_TABS.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, isSelected && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredPromos.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🏷️</Text>
            <Text style={styles.emptyTitle}>No {activeTab} Promotions</Text>
            <Text style={styles.emptySub}>Tap + at the top to create a limited-time coupon or price discount.</Text>
          </View>
        ) : (
          filteredPromos.map((promo) => (
            <View key={promo.id} style={styles.promoCard}>
              <View style={styles.promoTopRow}>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>{promo.couponCode}</Text>
                </View>

                <View style={styles.discountPill}>
                  <Text style={styles.discountText}>{promo.discountPct}% OFF</Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deletePromotion(promo.id)}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.promoTitle}>{promo.title}</Text>
              <Text style={styles.productName}>Applied to: {promo.productName}</Text>

              <View style={styles.divider} />

              <View style={styles.datesRow}>
                <Text style={styles.datesText}>
                  Valid: {promo.startDate} – {promo.endDate}
                </Text>
                <Text style={styles.statusIndicator}>
                  {promo.status === 'active' ? '🟢 Live' : promo.status === 'upcoming' ? '🟡 Scheduled' : '🔴 Ended'}
                </Text>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  tabsBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.semibold,
    color: '#6B7280',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  promoCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.xs,
    ...shadows.sm,
  },
  promoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  codeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#1D4ED8',
    letterSpacing: 1,
  },
  discountPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  discountText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 16,
  },
  promoTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  productName: {
    fontSize: typography.fontSizes.xs,
    color: '#4B5563',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: spacing.xs,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datesText: {
    fontSize: 10,
    color: '#6B7280',
  },
  statusIndicator: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
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
    marginTop: 4,
  },
});
