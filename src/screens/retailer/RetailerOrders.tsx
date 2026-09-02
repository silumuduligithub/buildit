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
import { OrderStatus } from '../../types';
import GradientAppHeader from '../../components/GradientAppHeader';

const ORDER_FILTERS = ['All', 'New', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Rejected'];

export default function RetailerOrders({ route, navigation }: any) {
  const initialFilter = route?.params?.filter || 'All';
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const { orders, updateOrderStatus } = useAppStore();

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'New') return o.status === 'placed';
    if (selectedFilter === 'Accepted') return o.status === 'confirmed';
    if (selectedFilter === 'Preparing') return o.status === 'preparing';
    if (selectedFilter === 'Ready') return o.status === 'ready';
    if (selectedFilter === 'Completed') return o.status === 'delivered';
    if (selectedFilter === 'Rejected') return o.status === 'rejected';
    return true;
  });

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus);
    Alert.alert('Status Updated', `Order #${orderId} moved to ${nextStatus.replace(/_/g, ' ').toUpperCase()}`);
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Order Management"
        subtitle={`${orders.length} total site fulfillment orders`}
        showBack={false}
        rightIcon="🔍"
        onRightPress={() => Alert.alert('Search Orders', 'Search by Order ID, Customer, or Phone')}
      />

      {/* ── Order Filters Bar ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {ORDER_FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Orders List ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>No {selectedFilter} Orders</Text>
            <Text style={styles.emptySub}>Orders matching this status will appear here in real-time.</Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const timeAgo = Math.max(1, Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000));
            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Header */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.idBox}>
                    <Text style={styles.idText}>{order.id}</Text>
                    <Text style={styles.timeText}>{timeAgo}m ago</Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      order.status === 'placed' && { backgroundColor: '#FEF3C7' },
                      order.status === 'confirmed' && { backgroundColor: '#EFF6FF' },
                      order.status === 'preparing' && { backgroundColor: '#F3E8FF' },
                      order.status === 'ready' && { backgroundColor: '#ECFDF5' },
                      order.status === 'delivered' && { backgroundColor: '#DCFCE7' },
                      order.status === 'rejected' && { backgroundColor: '#FEE2E2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        order.status === 'placed' && { color: '#B45309' },
                        order.status === 'confirmed' && { color: '#1D4ED8' },
                        order.status === 'preparing' && { color: '#7E22CE' },
                        order.status === 'ready' && { color: '#047857' },
                        order.status === 'delivered' && { color: '#15803D' },
                        order.status === 'rejected' && { color: '#DC2626' },
                      ]}
                    >
                      {order.status === 'placed' ? 'NEW ORDER' : order.status.replace(/_/g, ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Customer & Location */}
                <View style={styles.customerStrip}>
                  <Text style={styles.customerName}>👤 {order.deliveryAddress.name} ({order.deliveryAddress.phone})</Text>
                  <Text style={styles.deliveryLocation} numberOfLines={1}>
                    📍 {order.deliveryAddress.line1}
                  </Text>
                </View>

                {/* Products List */}
                <View style={styles.itemsList}>
                  {order.items.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                      <Text style={styles.itemEmoji}>
                        {item.product.name.includes('Cement') ? '🏗️'
                          : item.product.name.includes('Steel') ? '🔩'
                          : item.product.name.includes('Brick') ? '🧱'
                          : '📦'}
                      </Text>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.product.name}
                      </Text>
                      <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                      <Text style={styles.itemPrice}>
                        ₹{(item.offer.price * item.quantity).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Total & Logistics Row */}
                <View style={styles.totalRow}>
                  <View>
                    <Text style={styles.totalLabel}>Total Value</Text>
                    <Text style={styles.totalAmount}>₹{order.totalAmount.toLocaleString('en-IN')}</Text>
                  </View>

                  <View style={styles.logisticsBox}>
                    <Text style={styles.logisticsLabel}>
                      {order.deliveryModel === 'retailer_fleet' ? '🚛 Own Fleet' : '🛵 3PL Partner'}
                    </Text>
                    <Text style={styles.driverInfo}>
                      {order.driverName ? `Driver: ${order.driverName}` : 'Driver Pending'}
                    </Text>
                  </View>
                </View>

                {/* Workflow Actions */}
                <View style={styles.actionsRow}>
                  {order.status === 'placed' && (
                    <>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => handleStatusChange(order.id, 'rejected')}
                      >
                        <Text style={styles.rejectText}>✕ Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => handleStatusChange(order.id, 'confirmed')}
                      >
                        <Text style={styles.acceptText}>✓ Accept Order</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {order.status === 'confirmed' && (
                    <TouchableOpacity
                      style={styles.progressBtn}
                      onPress={() => handleStatusChange(order.id, 'preparing')}
                    >
                      <Text style={styles.progressBtnText}>📦 Start Preparing →</Text>
                    </TouchableOpacity>
                  )}

                  {order.status === 'preparing' && (
                    <TouchableOpacity
                      style={[styles.progressBtn, { backgroundColor: '#059669' }]}
                      onPress={() => handleStatusChange(order.id, 'ready')}
                    >
                      <Text style={styles.progressBtnText}>✓ Mark as Ready for Pickup →</Text>
                    </TouchableOpacity>
                  )}

                  {order.status === 'ready' && (
                    <TouchableOpacity
                      style={[styles.progressBtn, { backgroundColor: '#2563EB' }]}
                      onPress={() => handleStatusChange(order.id, 'out_for_delivery')}
                    >
                      <Text style={styles.progressBtnText}>🚚 Dispatch with Driver →</Text>
                    </TouchableOpacity>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <TouchableOpacity
                      style={[styles.progressBtn, { backgroundColor: '#16A34A' }]}
                      onPress={() => handleStatusChange(order.id, 'delivered')}
                    >
                      <Text style={styles.progressBtnText}>🎉 Confirm Delivery (OTP: {order.otp}) →</Text>
                    </TouchableOpacity>
                  )}

                  {order.status === 'delivered' && (
                    <TouchableOpacity
                      style={styles.viewInvoiceBtn}
                      onPress={() => Alert.alert('Invoice', `Tax invoice for ${order.id} downloaded.`)}
                    >
                      <Text style={styles.viewInvoiceText}>📄 View Tax Invoice</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}

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
  filtersScroll: {
    flexGrow: 0,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
    includeFontPadding: false,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  idText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  timeText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  customerStrip: {
    backgroundColor: '#F9FAFB',
    borderRadius: radii.md,
    padding: spacing.sm,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  customerName: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#1F2937',
  },
  deliveryLocation: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  itemsList: {
    gap: 4,
    marginVertical: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  itemName: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.semibold,
    color: '#374151',
    flex: 1,
  },
  itemQty: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#6B7280',
    marginRight: spacing.sm,
  },
  itemPrice: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
  totalAmount: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  logisticsBox: {
    alignItems: 'flex-end',
  },
  logisticsLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#2563EB',
  },
  driverInfo: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
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
  rejectText: {
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
  acceptText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  progressBtn: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  progressBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  viewInvoiceBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  viewInvoiceText: {
    color: '#374151',
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 54,
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
