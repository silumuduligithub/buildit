import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../theme/colors';
import { Order } from '../types';

interface NewOrderModalProps {
  visible: boolean;
  order: Order | null;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onClose: () => void;
}

export default function NewOrderModal({
  visible,
  order,
  onAccept,
  onReject,
  onClose,
}: NewOrderModalProps) {
  if (!order) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.alertIconCircle}>
              <Text style={styles.alertIconEmoji}>🔔</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>New Order Received!</Text>
              <Text style={styles.modalOrderId}>Order #{order.id}</Text>
            </View>
            <View style={styles.livePulsePill}>
              <Text style={styles.livePulseText}>INCOMING</Text>
            </View>
          </View>

          {/* Customer & Delivery Strip */}
          <View style={styles.customerBox}>
            <View style={styles.customerRow}>
              <Text style={styles.customerName}>👤 {order.deliveryAddress.name}</Text>
              <Text style={styles.customerPhone}>📞 {order.deliveryAddress.phone}</Text>
            </View>
            <Text style={styles.addressLine} numberOfLines={2}>
              📍 {order.deliveryAddress.line1}, {order.deliveryAddress.city}
            </Text>
          </View>

          {/* Order Items Preview */}
          <View style={styles.itemsBox}>
            <Text style={styles.itemsHeader}>ORDER ITEMS ({order.items.length})</Text>
            {order.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  ₹{(item.offer.price * item.quantity).toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
          </View>

          {/* Total Amount & Delivery Badge */}
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total Order Value</Text>
              <Text style={styles.totalValue}>₹{order.totalAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.deliveryModelPill}>
              <Text style={styles.deliveryModelText}>
                {order.deliveryType === 'express' ? '⚡ Express 30m' : '🚛 Bulk Transit'}
              </Text>
            </View>
          </View>

          {/* Action Buttons: Accept / Reject */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => onReject(order.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.rejectText}>✕ Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => onAccept(order.id)}
              activeOpacity={0.88}
            >
              <Text style={styles.acceptText}>✓ Accept Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md + 4,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  alertIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIconEmoji: {
    fontSize: 22,
  },
  modalTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  modalOrderId: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  livePulsePill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  livePulseText: {
    color: '#DC2626',
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  customerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  customerName: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#1E293B',
  },
  customerPhone: {
    fontSize: typography.fontSizes.xs,
    color: '#64748B',
  },
  addressLine: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14,
  },
  itemsBox: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
    gap: 6,
  },
  itemsHeader: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: typography.fontSizes.xs,
    color: '#1E293B',
    fontWeight: typography.weights.semibold,
    flex: 1,
    marginRight: spacing.sm,
  },
  itemQty: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#64748B',
    marginRight: spacing.sm,
  },
  itemPrice: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#0F172A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  totalValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    color: '#0F172A',
    marginTop: 2,
  },
  deliveryModelPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  deliveryModelText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: typography.weights.bold,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  rejectText: {
    color: '#DC2626',
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#059669',
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  acceptText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
});
