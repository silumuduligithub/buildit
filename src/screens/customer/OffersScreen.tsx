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
import { mockCoupons } from '../../services/mockData';
import GradientAppHeader from '../../components/GradientAppHeader';

const OFFER_TABS = ['All Offers', 'Bank Offers', 'Store Offers'];

export default function OffersScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('All Offers');

  const handleCopyCode = (code: string) => {
    Alert.alert('Coupon Copied!', `Code "${code}" copied to clipboard. Apply it at checkout!`);
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Offers) ── */}
      <GradientAppHeader
        title="Offers & Discounts"
        subtitle="Save on bulk materials & delivery"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Tabs */}
      <View style={styles.tabsBar}>
        {OFFER_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {mockCoupons.map((coupon) => (
          <View key={coupon.code} style={styles.couponCard}>
            <View style={styles.couponTopRow}>
              <View style={styles.codeBadge}>
                <Text style={styles.codeText}>{coupon.code}</Text>
              </View>

              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() => handleCopyCode(coupon.code)}
              >
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.couponTitle}>{coupon.title}</Text>
            <Text style={styles.couponSub}>{coupon.sub}</Text>

            <View style={styles.divider} />

            <View style={styles.validityRow}>
              <Text style={styles.validityText}>{coupon.validity}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                <Text style={styles.applyNowText}>Shop Now ›</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

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
  tabsBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
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
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  couponCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  couponTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  codeBadge: {
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    letterSpacing: 1,
  },
  copyBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyIcon: {
    fontSize: 16,
  },
  couponTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  couponSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  validityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  validityText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  applyNowText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
});
