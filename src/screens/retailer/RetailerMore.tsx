import React from 'react';
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

const QUICK_ACTIONS = [
  { id: 'qa_add', label: 'Add Product', emoji: '➕', bg: '#E0E7FF', target: 'AddProduct' },
  { id: 'qa_inv', label: 'Inventory', emoji: '📦', bg: '#FEF3C7', target: 'Inventory' },
  { id: 'qa_ord', label: 'View Orders', emoji: '📋', bg: '#DCFCE7', target: 'Orders' },
  { id: 'qa_pri', label: 'Update Prices', emoji: '🏷️', bg: '#FCE7F3', target: 'Pricing' },
  { id: 'qa_prm', label: 'Promotions', emoji: '🎁', bg: '#FEF9C3', target: 'Promotions' },
  { id: 'qa_del', label: 'Delivery Fleet', emoji: '🚛', bg: '#E0F2FE', target: 'Delivery' },
  { id: 'qa_pro', label: 'Store Profile', emoji: '🏪', bg: '#F3E8FF', target: 'StoreProfile' },
  { id: 'qa_ana', label: 'Analytics', emoji: '📊', bg: '#ECFDF5', target: 'Analytics' },
];

const MORE_SECTIONS = [
  {
    header: 'STORE OPERATIONS',
    items: [
      { id: 'm_store', title: 'Store Profile & Hours', sub: 'Operating timings, depot address & delivery radius', icon: '🏪', target: 'StoreProfile' },
      { id: 'm_pricing', title: 'Pricing Management', sub: 'Quick update rates for all construction materials', icon: '🏷️', target: 'Pricing' },
      { id: 'm_inventory', title: 'Catalog & Inventory', sub: 'Stock levels, out-of-stock toggles & refilling', icon: '📦', target: 'Inventory' },
      { id: 'm_add_prod', title: 'Add New Product', sub: 'Publish new material to BuildKart catalog', icon: '➕', target: 'AddProduct' },
      { id: 'm_delivery', title: 'Delivery & Fleet Settings', sub: 'Manage drivers, Tata Ace / Bolero vehicles & 3PL', icon: '🚛', target: 'Delivery' },
      { id: 'm_promos', title: 'Promotions & Coupons', sub: 'Create discounts, coupons & volume rebates', icon: '🎁', target: 'Promotions' },
    ],
  },
  {
    header: 'PAYMENTS & BUSINESS',
    items: [
      { id: 'm_payments', title: 'Payouts & Settlement', sub: 'HDFC Bank • A/C ending 4892 (T+1 Daily Payouts)', icon: '💳', target: 'Payouts' },
      { id: 'm_gst', title: 'GST Invoices & Tax Ledger', sub: 'Download 18% ITC B2B invoices & monthly GST reports', icon: '📑', target: 'GST' },
      { id: 'm_notifs', title: 'Notification Preferences', sub: 'Order sound alarms, SMS & WhatsApp alerts', icon: '🔔', target: 'Notifications' },
      { id: 'm_analytics', title: 'Full Analytics Dashboard', sub: 'Detailed GMV revenue, category growth & trends', icon: '📊', target: 'Analytics' },
    ],
  },
  {
    header: 'PARTNER SUPPORT',
    items: [
      { id: 'm_support', title: 'Supplier Partner Desk', sub: 'Dedicated Account Manager • 24x7 Priority Support', icon: '💬', target: 'Support' },
      { id: 'm_terms', title: 'Merchant Terms & Policies', sub: 'Fulfillment SLAs, commissions & return policies', icon: '📜', target: 'Terms' },
    ],
  },
];

export default function RetailerMore({ navigation }: any) {
  const { retailerProfile, isStoreOpen } = useAppStore();

  const handleActionPress = (target: string, title?: string, sub?: string) => {
    if (target === 'StoreProfile') {
      navigation.navigate('StoreProfile');
    } else if (target === 'Pricing') {
      navigation.navigate('Pricing');
    } else if (target === 'Promotions') {
      navigation.navigate('Promotions');
    } else if (target === 'Delivery') {
      navigation.navigate('Delivery');
    } else if (target === 'AddProduct') {
      navigation.navigate('AddProduct');
    } else if (target === 'Inventory') {
      navigation.navigate('Inventory');
    } else if (target === 'Orders') {
      navigation.navigate('Orders');
    } else if (target === 'Analytics') {
      navigation.navigate('Analytics');
    } else {
      Alert.alert(title || 'Service', sub || 'Feature is active.');
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="More Services & Hub"
        subtitle={retailerProfile.name || 'Sri Sai Hardware & Builders'}
        showBack={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Store Summary Card */}
        <TouchableOpacity
          style={styles.storeSummaryCard}
          onPress={() => navigation.navigate('StoreProfile')}
          activeOpacity={0.88}
        >
          <View style={styles.storeIconBox}>
            <Text style={styles.storeEmoji}>🏪</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.storeName}>{retailerProfile.name || 'Sri Sai Hardware'}</Text>
            <Text style={styles.storeAddress}>Kondapur, Hyderabad • GSTIN: {retailerProfile.gstin}</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: isStoreOpen ? '#10B981' : '#EF4444' }]} />
              <Text style={styles.statusText}>{isStoreOpen ? 'Online & Receiving Orders' : 'Store Offline'}</Text>
            </View>
          </View>
          <Text style={styles.storeEditArrow}>›</Text>
        </TouchableOpacity>

        {/* ── QUICK ACTIONS GRID ── */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionHeader}>QUICK ACTIONS</Text>
          <View style={styles.gridContainer}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.gridBtn}
                onPress={() => handleActionPress(action.target)}
                activeOpacity={0.8}
              >
                <View style={[styles.gridIconBox, { backgroundColor: action.bg }]}>
                  <Text style={styles.gridEmoji}>{action.emoji}</Text>
                </View>
                <Text style={styles.gridLabel} numberOfLines={1}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Categorized Menu Sections ── */}
        {MORE_SECTIONS.map((section) => (
          <View key={section.header} style={styles.menuSectionContainer}>
            <Text style={styles.sectionHeader}>{section.header}</Text>
            <View style={styles.menuContainer}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuRow}
                  onPress={() => handleActionPress(item.target, item.title, item.sub)}
                  activeOpacity={0.78}
                >
                  <View style={styles.menuIconCircle}>
                    <Text style={styles.menuEmoji}>{item.icon}</Text>
                  </View>

                  <View style={styles.menuTextBox}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSub} numberOfLines={1}>{item.sub}</Text>
                  </View>

                  <Text style={styles.chevronArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* BuildKart Partner Support */}
        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>BuildKart Supplier Network</Text>
          <Text style={styles.supportSub}>Partner Hotline: 1800-BUILD-KART (24x7 Supplier Desk)</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  storeSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm + 2,
    ...shadows.sm,
  },
  storeIconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeEmoji: {
    fontSize: 24,
  },
  storeName: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  storeAddress: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  storeEditArrow: {
    fontSize: 22,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  quickActionsSection: {
    gap: spacing.xs + 2,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#9CA3AF',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  gridBtn: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: 2,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  gridIconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  gridEmoji: {
    fontSize: 20,
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#374151',
    textAlign: 'center',
  },
  menuSectionContainer: {
    gap: spacing.xs + 2,
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md - 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: spacing.sm,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuEmoji: {
    fontSize: 18,
  },
  menuTextBox: {
    flex: 1,
  },
  menuTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  menuSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  chevronArrow: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  supportBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  supportTitle: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#475569',
  },
  supportSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
});
