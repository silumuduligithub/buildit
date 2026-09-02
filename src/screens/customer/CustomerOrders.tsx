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
import { mockProducts, mockStores, mockOffers } from '../../services/mockData';
import GradientAppHeader from '../../components/GradientAppHeader';

const ORDER_TABS = ['All', 'Delivered', 'Cancelled'];

const PAST_ORDERS = [
  {
    id: 'BK-250529-00098',
    date: '29 May, 10:20 AM',
    total: 3210,
    itemCount: 2,
    itemsText: 'UltraTech Cement (5 Bags), Tata TMT 12mm (2 Pcs)',
    status: 'Delivered',
  },
  {
    id: 'BK-250527-00076',
    date: '27 May, 02:15 PM',
    total: 5650,
    itemCount: 3,
    itemsText: 'Asian Paints Apex (1 Bucket), Wirecut Bricks (500 Pcs)',
    status: 'Delivered',
  },
  {
    id: 'BK-250525-00052',
    date: '25 May, 11:40 AM',
    total: 2890,
    itemCount: 1,
    itemsText: 'M-Sand for Concrete (1 Tonne)',
    status: 'Delivered',
  },
];

export default function CustomerOrders({ navigation }: any) {
  const { addToCart } = useAppStore();
  const [activeTab, setActiveTab] = useState('Delivered');

  const handleReorder = (order: typeof PAST_ORDERS[0]) => {
    const product = mockProducts[0];
    const store = mockStores[0];
    const offer = mockOffers[0];

    addToCart({
      id: `cart-reorder-${Date.now()}`,
      offer,
      product,
      retailer: store,
      quantity: 2,
    });

    Alert.alert('Reorder Added', 'Items from this past order have been added to your cart.', [
      { text: 'Later', style: 'cancel' },
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Orders) ── */}
      <GradientAppHeader
        title="My Orders"
        subtitle="Track active & past construction deliveries"
        showBack={false}
        rightIcon="🔍"
        onRightPress={() => navigation.navigate('SearchTab')}
      />

      {/* Tabs */}
      <View style={styles.tabsBar}>
        {ORDER_TABS.map((tab) => {
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
        {PAST_ORDERS.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderCardTop}>
              <View style={styles.cementBagIconBox}>
                <Text style={styles.cementBagEmoji}>🏗️</Text>
              </View>

              <View style={styles.orderInfo}>
                <Text style={styles.orderIdText}>{order.id}</Text>
                <Text style={styles.orderDateText}>Delivered on {order.date}</Text>
                <Text style={styles.orderAmountText}>
                  ₹{order.total.toLocaleString('en-IN')}{' '}
                  <Text style={styles.orderItemsCount}>• {order.itemCount} Items</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={styles.reorderButton}
                onPress={() => handleReorder(order)}
                activeOpacity={0.8}
              >
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <Text style={styles.orderItemsSummary} numberOfLines={1}>
              {order.itemsText}
            </Text>
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
  orderCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  orderCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cementBagIconBox: {
    width: 50,
    height: 50,
    borderRadius: radii.lg,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#E6BE00',
  },
  cementBagEmoji: {
    fontSize: 26,
  },
  orderInfo: {
    flex: 1,
  },
  orderIdText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  orderDateText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  orderAmountText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginTop: 2,
  },
  orderItemsCount: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  reorderButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  reorderButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  orderItemsSummary: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
});
