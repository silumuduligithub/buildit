import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import NewOrderModal from '../../components/NewOrderModal';

export default function RetailerHome({ navigation }: any) {
  const {
    isStoreOpen,
    toggleStoreStatus,
    retailerProfile,
    orders,
    products,
    offers,
    updateOrderStatus,
    newOrderNotification,
    setNewOrderNotification,
  } = useAppStore();

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'rejected');
  const pendingCount = orders.filter((o) => o.status === 'placed').length;
  const completedOrders = orders.filter((o) => o.status === 'delivered');
  const todaySales = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0) + 38450;
  const lowStockCount = offers.filter((o) => o.stock > 0 && o.stock <= 50).length || 3;

  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, 'confirmed');
    setNewOrderNotification(null);
    Alert.alert('Order Accepted', `Order #${orderId} confirmed! Customer and delivery partner notified.`);
  };

  const handleReject = (orderId: string) => {
    updateOrderStatus(orderId, 'rejected');
    setNewOrderNotification(null);
    Alert.alert('Order Rejected', `Order #${orderId} was declined.`);
  };

  return (
    <View style={styles.root}>
      {/* ── 1. Signature Crimson Gradient Header ── */}
      <LinearGradient
        colors={['#140202', '#8B0000', '#D32F2F', '#E53935']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.storeInfoBox}>
            <View style={styles.storeLogoBox}>
              <Text style={styles.storeLogoEmoji}>🏪</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeNameText} numberOfLines={1}>
                {retailerProfile.name || 'Sri Sai Hardware & Builders'}
              </Text>
              <Text style={styles.storeLocationText} numberOfLines={1}>
                📍 Kondapur Main Road, Hyderabad
              </Text>
            </View>
          </View>

          {/* Store Open / Closed Switch */}
          <View style={styles.storeStatusPill}>
            <View style={[styles.statusDot, { backgroundColor: isStoreOpen ? '#10B981' : '#EF4444' }]} />
            <Text style={styles.statusText}>{isStoreOpen ? 'OPEN' : 'CLOSED'}</Text>
            <Switch
              value={isStoreOpen}
              onValueChange={toggleStoreStatus}
              trackColor={{ false: '#4B5563', true: '#059669' }}
              thumbColor={colors.white}
              style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── 2. Pending Orders Immediate Alert (If any) ── */}
        {pendingCount > 0 && (
          <TouchableOpacity
            style={styles.pendingAlertCard}
            onPress={() => navigation.navigate('Orders', { screen: 'OrdersMain', params: { filter: 'New' } })}
            activeOpacity={0.88}
          >
            <View style={styles.pendingIconBox}>
              <Text style={styles.pendingEmoji}>⚡</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pendingTitle}>{pendingCount} New Order{pendingCount > 1 ? 's' : ''} Awaiting Acceptance!</Text>
              <Text style={styles.pendingSub}>Tap to review items & dispatch to site</Text>
            </View>
            <Text style={styles.pendingArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* ── 3. Today's Key Metrics (4 Cards) ── */}
        <View style={styles.metricsGrid}>
          {/* Today's Sales */}
          <View style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Text style={{ fontSize: 18 }}>💰</Text>
            </View>
            <Text style={styles.metricLabel}>Today's Sales</Text>
            <Text style={styles.metricValue}>₹{todaySales.toLocaleString('en-IN')}</Text>
            <Text style={styles.metricTrend}>↑ 18.2% vs yesterday</Text>
          </View>

          {/* Today's Orders */}
          <View style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Text style={{ fontSize: 18 }}>🛍️</Text>
            </View>
            <Text style={styles.metricLabel}>Today's Orders</Text>
            <Text style={styles.metricValue}>{orders.length + 14}</Text>
            <Text style={styles.metricTrend}>4 Pending • 2 Active</Text>
          </View>

          {/* Total Catalog Items */}
          <View style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#F3E8FF' }]}>
              <Text style={{ fontSize: 18 }}>📦</Text>
            </View>
            <Text style={styles.metricLabel}>Active Products</Text>
            <Text style={styles.metricValue}>{products.length}</Text>
            <Text style={styles.metricSubInfo}>Across 7 categories</Text>
          </View>

          {/* Low-Stock Alert */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate('Inventory', { screen: 'InventoryMain', params: { filter: 'Low Stock' } })}
            activeOpacity={0.85}
          >
            <View style={[styles.metricIconCircle, { backgroundColor: '#FEF2F2' }]}>
              <Text style={{ fontSize: 18 }}>⚠️</Text>
            </View>
            <Text style={styles.metricLabel}>Low Stock Items</Text>
            <Text style={[styles.metricValue, { color: '#DC2626' }]}>{lowStockCount}</Text>
            <Text style={styles.metricAlertLink}>Refill now ›</Text>
          </TouchableOpacity>
        </View>

        {/* ── 4. Quick Actions ── */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsRow}>
          {/* Add Product */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('AddProduct')}
            activeOpacity={0.82}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#E0E7FF' }]}>
              <Text style={styles.actionEmoji}>➕</Text>
            </View>
            <Text style={styles.actionLabel}>Add Product</Text>
          </TouchableOpacity>

          {/* Update Inventory */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Inventory')}
            activeOpacity={0.82}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.actionEmoji}>📦</Text>
            </View>
            <Text style={styles.actionLabel}>Inventory</Text>
          </TouchableOpacity>

          {/* View Orders */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Orders')}
            activeOpacity={0.82}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.actionEmoji}>📋</Text>
            </View>
            <Text style={styles.actionLabel}>View Orders</Text>
          </TouchableOpacity>

          {/* Update Prices */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Pricing')}
            activeOpacity={0.82}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FCE7F3' }]}>
              <Text style={styles.actionEmoji}>🏷️</Text>
            </View>
            <Text style={styles.actionLabel}>Update Prices</Text>
          </TouchableOpacity>
        </View>

        {/* ── 5. Active Operational Queue ── */}
        <View style={styles.queueHeaderRow}>
          <Text style={styles.sectionTitle}>ACTIVE ORDER FULFILLMENT ({activeOrders.length})</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.viewAllText}>View all ›</Text>
          </TouchableOpacity>
        </View>

        {activeOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderTopRow}>
              <View style={styles.orderIdBadge}>
                <Text style={styles.orderIdText}>{order.id}</Text>
              </View>

              <View
                style={[
                  styles.statusTag,
                  order.status === 'placed' && { backgroundColor: '#FEF3C7' },
                  order.status === 'confirmed' && { backgroundColor: '#EFF6FF' },
                  order.status === 'preparing' && { backgroundColor: '#F3E8FF' },
                  order.status === 'ready' && { backgroundColor: '#ECFDF5' },
                ]}
              >
                <Text
                  style={[
                    styles.statusTagText,
                    order.status === 'placed' && { color: '#B45309' },
                    order.status === 'confirmed' && { color: '#1D4ED8' },
                    order.status === 'preparing' && { color: '#7E22CE' },
                    order.status === 'ready' && { color: '#047857' },
                  ]}
                >
                  {order.status === 'placed'
                    ? 'WAITING CONFIRMATION'
                    : order.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.orderCustomerRow}>
              <Text style={styles.customerNameText}>👤 {order.deliveryAddress.name}</Text>
              <Text style={styles.orderAmountText}>₹{order.totalAmount.toLocaleString('en-IN')}</Text>
            </View>

            <Text style={styles.itemsSummary} numberOfLines={1}>
              {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
            </Text>

            <Text style={styles.deliveryLocation} numberOfLines={1}>
              📍 {order.deliveryAddress.line1}
            </Text>

            {/* Stage Progression Buttons */}
            <View style={styles.orderCardActions}>
              {order.status === 'placed' && (
                <>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleReject(order.id)}
                  >
                    <Text style={styles.rejectBtnText}>✕ Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => handleAccept(order.id)}
                  >
                    <Text style={styles.acceptBtnText}>✓ Accept Order</Text>
                  </TouchableOpacity>
                </>
              )}

              {order.status === 'confirmed' && (
                <TouchableOpacity
                  style={styles.stageBtn}
                  onPress={() => {
                    updateOrderStatus(order.id, 'preparing');
                    Alert.alert('Status Updated', 'Order marked as: Preparing in Warehouse');
                  }}
                >
                  <Text style={styles.stageBtnText}>📦 Start Preparing Order →</Text>
                </TouchableOpacity>
              )}

              {order.status === 'preparing' && (
                <TouchableOpacity
                  style={[styles.stageBtn, { backgroundColor: '#059669' }]}
                  onPress={() => {
                    updateOrderStatus(order.id, 'ready');
                    Alert.alert('Status Updated', 'Order is ready! Delivery partner notified for pickup.');
                  }}
                >
                  <Text style={styles.stageBtnText}>✓ Mark as Ready for Pickup →</Text>
                </TouchableOpacity>
              )}

              {order.status === 'ready' && (
                <TouchableOpacity
                  style={[styles.stageBtn, { backgroundColor: '#2563EB' }]}
                  onPress={() => {
                    updateOrderStatus(order.id, 'out_for_delivery');
                    Alert.alert('Dispatched', 'Handed over to delivery partner: Mahesh Kumar (🛵)');
                  }}
                >
                  <Text style={styles.stageBtnText}>🚚 Dispatch with Driver →</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── New Order Instant Notification Modal ── */}
      <NewOrderModal
        visible={!!newOrderNotification}
        order={newOrderNotification}
        onAccept={handleAccept}
        onReject={handleReject}
        onClose={() => setNewOrderNotification(null)}
      />
    </View>
  );
}

const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 44;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  gradientHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: topInset + 6,
    paddingBottom: spacing.md + 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    ...shadows.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
    gap: spacing.sm,
  },
  storeLogoBox: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  storeLogoEmoji: {
    fontSize: 22,
  },
  storeNameText: {
    fontSize: typography.fontSizes.sm + 2,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
  },
  storeLocationText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
  },
  storeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  pendingAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    gap: spacing.sm,
    ...shadows.sm,
  },
  pendingIconBox: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingEmoji: {
    fontSize: 20,
  },
  pendingTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#92400E',
  },
  pendingSub: {
    fontSize: 10,
    color: '#B45309',
    marginTop: 1,
  },
  pendingArrow: {
    fontSize: 20,
    color: '#92400E',
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metricCard: {
    width: '48.5%',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  metricIconCircle: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: typography.weights.bold,
  },
  metricValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginTop: 2,
  },
  metricTrend: {
    fontSize: 9,
    color: '#059669',
    fontWeight: typography.weights.bold,
    marginTop: 4,
  },
  metricSubInfo: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 4,
  },
  metricAlertLink: {
    fontSize: 9,
    color: '#DC2626',
    fontWeight: typography.weights.extrabold,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
    color: '#6B7280',
    letterSpacing: 0.6,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    width: '23%',
    alignItems: 'center',
  },
  actionIconBox: {
    width: 52,
    height: 52,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...shadows.sm,
  },
  actionEmoji: {
    fontSize: 22,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#374151',
    textAlign: 'center',
  },
  queueHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  viewAllText: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.extrabold,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.xs + 2,
    ...shadows.sm,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  orderIdText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#1F2937',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  statusTagText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  orderCustomerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  customerNameText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  orderAmountText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  itemsSummary: {
    fontSize: typography.fontSizes.xs,
    color: '#4B5563',
  },
  deliveryLocation: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  orderCardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  rejectBtnText: {
    color: '#DC2626',
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: '#059669',
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  acceptBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  stageBtn: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  stageBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
  },
});
