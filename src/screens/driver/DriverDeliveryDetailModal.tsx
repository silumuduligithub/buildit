import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';

interface DriverDeliveryDetailModalProps {
  visible: boolean;
  delivery: any | null;
  onClose: () => void;
}

export default function DriverDeliveryDetailModal({
  visible,
  delivery,
  onClose,
}: DriverDeliveryDetailModalProps) {
  if (!delivery) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Delivery Summary</Text>
              <Text style={styles.orderIdText}>{delivery.id}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Status & Earnings Card */}
            <View style={styles.statusEarningsCard}>
              <View>
                <Text style={styles.statusLabel}>Fulfillment Status</Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.statusPill, { backgroundColor: delivery.statusBg || '#ECFDF5' }]}>
                    <Text style={[styles.statusText, { color: delivery.statusColor || '#059669' }]}>
                      {delivery.status}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>{delivery.time}</Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.statusLabel}>Delivery Payout</Text>
                <Text style={styles.amountText}>{delivery.amount}</Text>
              </View>
            </View>

            {/* Pickup & Drop Details */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>ROUTE & LOCATIONS</Text>

              <View style={styles.locationItem}>
                <Text style={styles.pinEmoji}>🏪</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locName}>Sharma Building Materials</Text>
                  <Text style={styles.locSub}>Banjara Hills, Hyderabad, TS</Text>
                </View>
              </View>

              <View style={styles.routeLine} />

              <View style={styles.locationItem}>
                <Text style={styles.pinEmoji}>📍</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locName}>{delivery.customer}</Text>
                  <Text style={styles.locSub}>{delivery.location}</Text>
                </View>
              </View>
            </View>

            {/* Items Transported */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>MATERIALS TRANSPORTED</Text>
              <View style={styles.itemRow}>
                <Text style={styles.itemTitle}>UltraTech Cement OPC 53 Grade</Text>
                <Text style={styles.itemQty}>10 Bags</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemTitle}>Tata Tiscon 550D TMT Steel 12mm</Text>
                <Text style={styles.itemQty}>20 Kg</Text>
              </View>
            </View>

            {/* Customer Contact & Proof of Delivery */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>VERIFICATION</Text>
              <View style={styles.podRow}>
                <Text style={styles.podLabel}>Delivery Confirmation Mode</Text>
                <Text style={styles.podVal}>Customer OTP (4821)</Text>
              </View>
              <View style={styles.podRow}>
                <Text style={styles.podLabel}>Payment Status</Text>
                <Text style={styles.podValPaid}>Prepaid (UPI)</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.88}>
              <Text style={styles.doneBtnText}>Close Summary</Text>
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: typography.fontSizes.md + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  orderIdText: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  statusEarningsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  statusLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  amountText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: '#059669',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
  },
  cardHeader: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#9CA3AF',
    letterSpacing: 0.6,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pinEmoji: {
    fontSize: 18,
  },
  locName: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  locSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginLeft: 9,
    marginVertical: -2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: typography.fontSizes.xs,
    color: '#374151',
  },
  itemQty: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  podRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  podLabel: {
    fontSize: typography.fontSizes.xs,
    color: '#4B5563',
  },
  podVal: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  podValPaid: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#059669',
  },
  doneBtn: {
    backgroundColor: '#0F172A',
    borderRadius: radii.xl,
    paddingVertical: spacing.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    ...shadows.sm,
  },
  doneBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
  },
});
