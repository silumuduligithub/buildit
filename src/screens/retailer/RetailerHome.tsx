import React from 'react';
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
import {
  Store,
  TrendingUp,
  ClipboardList,
  AlertTriangle,
  Package,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Plus,
  Truck,
  DollarSign,
  Layers,
  MapPin,
} from 'lucide-react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import NewOrderModal from '../../components/NewOrderModal';

export default function RetailerHome({ navigation }: any) {
  const {
    isStoreOpen,
    toggleStoreStatus,
    retailerProfile,
    orders,
    offers,
    updateOrderStatus,
    newOrderNotification,
    setNewOrderNotification,
    fetchOrders,
    fetchRetailerOffers,
    currentUser,
  } = useAppStore();

  React.useEffect(() => {
    fetchOrders().catch(() => {});
    fetchRetailerOffers().catch(() => {});
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'rejected'
  );
  const pendingOrders = orders.filter((o) => o.status === 'placed');
  const completedOrders = orders.filter((o) => o.status === 'delivered');
  const todaySales =
    completedOrders.reduce((sum, o) => sum + o.totalAmount, 0) + 38450;
  const lowStockCount =
    offers.filter((o) => o.stock > 0 && o.stock <= 50).length || 3;

  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, 'confirmed');
    setNewOrderNotification(null);
    Alert.alert(
      'Order Accepted',
      `Order #${orderId} confirmed! Logistics partner notified for pickup.`
    );
  };

  const handleReject = (orderId: string) => {
    updateOrderStatus(orderId, 'rejected');
    setNewOrderNotification(null);
    Alert.alert('Order Rejected', `Order #${orderId} was declined.`);
  };

  return (
    <View style={styles.root}>
      {/* ── Signature Retailer Gradient Header ── */}
      <LinearGradient
        colors={['#101924', '#1E293B', '#334155']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.storeInfoBox}>
            <View style={styles.storeLogoBox}>
              <Store size={22} color={colors.white} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeNameText} numberOfLines={1}>
                {retailerProfile.name || 'Sri Sai Hardware & Builders'}
              </Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color="rgba(255,255,255,0.7)" strokeWidth={1.8} />
                <Text style={styles.storeLocationText} numberOfLines={1}>
                  Kondapur Main Road, Hyderabad
                </Text>
              </View>
            </View>
          </View>

          {/* Store Open / Closed Switch */}
          <View style={styles.storeStatusPill}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isStoreOpen ? '#10B981' : '#EF4444' },
              ]}
            />
            <Text style={styles.statusText}>{isStoreOpen ? 'ONLINE' : 'OFFLINE'}</Text>
            <Switch
              value={isStoreOpen}
              onValueChange={toggleStoreStatus}
              trackColor={{ false: '#475569', true: '#10B981' }}
              thumbColor={colors.white}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Pending Orders Alert Banner ── */}
        {pendingOrders.length > 0 && (
          <TouchableOpacity
            style={styles.pendingAlertCard}
            onPress={() => navigation.navigate('Orders')}
            activeOpacity={0.88}
          >
            <View style={styles.pendingIconBox}>
              <Clock size={20} color={colors.white} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pendingTitle}>
                {pendingOrders.length} New Order{pendingOrders.length > 1 ? 's' : ''}{' '}
                Awaiting Acceptance!
              </Text>
              <Text style={styles.pendingSub}>
                Accept within 10 mins to maintain high fulfillment rank
              </Text>
            </View>
            <ChevronRight size={18} color={colors.white} strokeWidth={2} />
          </TouchableOpacity>
        )}

        {/* ── Business Performance Metrics Grid ── */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricIconCircle}>
              <TrendingUp size={18} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.metricValue}>
              ₹{todaySales.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.metricLabel}>Today's Sales</Text>
          </View>

          <View style={styles.metricCard}>
            <View
              style={[
                styles.metricIconCircle,
                { backgroundColor: 'rgba(59, 130, 246, 0.12)' },
              ]}
            >
              <ClipboardList size={18} color="#2563EB" strokeWidth={2} />
            </View>
            <Text style={styles.metricValue}>{activeOrders.length}</Text>
            <Text style={styles.metricLabel}>Active Orders</Text>
          </View>

          <View style={styles.metricCard}>
            <View
              style={[
                styles.metricIconCircle,
                { backgroundColor: 'rgba(239, 68, 68, 0.12)' },
              ]}
            >
              <AlertTriangle size={18} color="#DC2626" strokeWidth={2} />
            </View>
            <Text style={styles.metricValue}>{lowStockCount}</Text>
            <Text style={styles.metricLabel}>Low Stock Items</Text>
          </View>

          <View style={styles.metricCard}>
            <View
              style={[
                styles.metricIconCircle,
                { backgroundColor: 'rgba(16, 185, 129, 0.12)' },
              ]}
            >
              <CheckCircle2 size={18} color="#059669" strokeWidth={2} />
            </View>
            <Text style={styles.metricValue}>98.4%</Text>
            <Text style={styles.metricLabel}>Fulfillment Rate</Text>
          </View>
        </View>

        {/* ── Quick Actions Row ── */}
        <Text style={styles.sectionHeading}>Store Management</Text>
        <View style={styles.actionShortcutsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Inventory', { screen: 'AddProduct' })}
            activeOpacity={0.8}
          >
            <View style={styles.actionBtnIcon}>
              <Plus size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.actionBtnText}>Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Inventory')}
            activeOpacity={0.8}
          >
            <View style={styles.actionBtnIcon}>
              <Package size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.actionBtnText}>Manage Stock</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Analytics')}
            activeOpacity={0.8}
          >
            <View style={styles.actionBtnIcon}>
              <TrendingUp size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.actionBtnText}>Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('More')}
            activeOpacity={0.8}
          >
            <View style={styles.actionBtnIcon}>
              <Truck size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.actionBtnText}>Fleet</Text>
          </TouchableOpacity>
        </View>

        {/* ── Active Orders Pipeline ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Live Orders Queue</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.viewAllText}>View All ({orders.length}) →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ordersList}>
          {activeOrders.slice(0, 3).map((order) => {
            const isNew = order.status === 'placed';
            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={styles.orderId}>Order #{order.id}</Text>
                    <Text style={styles.customerName}>
                      {order.deliveryAddress?.name || 'Customer'} ·{' '}
                      {order.items.length} items
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.orderBadge,
                      isNew ? styles.orderBadgeNew : styles.orderBadgePreparing,
                    ]}
                  >
                    <Text
                      style={[
                        styles.orderBadgeText,
                        isNew ? styles.orderBadgeTextNew : styles.orderBadgeTextPrep,
                      ]}
                    >
                      {order.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Items preview */}
                <Text style={styles.itemSummary} numberOfLines={1}>
                  {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                </Text>

                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </Text>

                  {isNew ? (
                    <View style={styles.orderActions}>
                      <TouchableOpacity
                        style={styles.declineBtn}
                        onPress={() => handleReject(order.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.declineBtnText}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => handleAccept(order.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.acceptBtnText}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.manageBtn}
                      onPress={() => navigation.navigate('Orders')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.manageBtnText}>Update Status →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* New incoming order modal */}
      {newOrderNotification && (
        <NewOrderModal
          visible={!!newOrderNotification}
          order={newOrderNotification}
          onClose={() => setNewOrderNotification(null)}
          onAccept={() => handleAccept(newOrderNotification.id)}
          onReject={() => handleReject(newOrderNotification.id)}
        />
      )}
    </View>
  );
}

const TOP_INSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 48;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientHeader: {
    paddingTop: TOP_INSET,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    marginRight: spacing.sm,
  },
  storeLogoBox: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeNameText: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  storeLocationText: {
    fontSize: typography.fontSizes.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  storeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: radii.full,
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 3,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },

  scrollContent: {
    padding: spacing.base,
  },

  // ── Pending Alert ──
  pendingAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: radii.xl,
    padding: spacing.base,
    gap: spacing.md,
    marginBottom: spacing.base,
    ...shadows.md,
  },
  pendingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingTitle: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  pendingSub: {
    fontSize: typography.fontSizes.caption,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 1,
  },

  // ── Metrics ──
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metricCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  metricValue: {
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  metricLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ── Section ──
  sectionHeading: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  viewAllText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },

  // ── Action Shortcuts ──
  actionShortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  actionBtn: {
    width: '23%',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionBtnIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  actionBtnText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // ── Orders List ──
  ordersList: {
    gap: spacing.sm,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  orderId: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  customerName: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  orderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  orderBadgeNew: {
    backgroundColor: '#FEF2F2',
  },
  orderBadgePreparing: {
    backgroundColor: '#EFF6FF',
  },
  orderBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  orderBadgeTextNew: {
    color: '#DC2626',
  },
  orderBadgeTextPrep: {
    color: '#2563EB',
  },
  itemSummary: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
    marginVertical: spacing.xs,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  orderTotal: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  orderActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  declineBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  declineBtnText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  acceptBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radii.sm,
    backgroundColor: colors.success,
  },
  acceptBtnText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  manageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  manageBtnText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
});
