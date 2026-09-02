import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';

interface DriverNewOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export default function DriverNewOrderModal({
  visible,
  onClose,
  onAccept,
  onReject,
}: DriverNewOrderModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Top Crimson Header */}
          <LinearGradient
            colors={['#140202', '#8B0000', '#D32F2F', '#E53935']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalHeader}
          >
            <Text style={styles.headerTitle}>New Order</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Order ID & Time */}
            <View style={styles.orderIdCard}>
              <View>
                <Text style={styles.orderLabel}>Order ID</Text>
                <Text style={styles.orderIdValue}>BK-250531-00125</Text>
              </View>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            </View>

            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Order Time</Text>
              <Text style={styles.timeValue}>10:30 AM</Text>
            </View>

            {/* Pickup From */}
            <View style={styles.locationSection}>
              <Text style={styles.sectionHeader}>Pickup From</Text>
              <View style={styles.locationCard}>
                <View style={styles.storeIconBox}>
                  <Text style={styles.storeEmoji}>🏪</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationName}>Sharma Building Materials</Text>
                  <Text style={styles.locationSub}>Banjara Hills, Hyderabad, TS</Text>
                </View>
                <Text style={styles.distanceText}>2.4 km</Text>
              </View>
            </View>

            {/* Deliver To */}
            <View style={styles.locationSection}>
              <Text style={styles.sectionHeader}>Deliver To</Text>
              <View style={styles.locationCard}>
                <View style={[styles.storeIconBox, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={styles.storeEmoji}>📍</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationName}>Ravi Kumar</Text>
                  <Text style={styles.locationSub}>Site: Gokul Construction</Text>
                  <Text style={styles.locationSub}>Madhapur, Hyderabad, TS</Text>
                </View>
                <Text style={styles.distanceText}>5.6 km</Text>
              </View>
            </View>

            {/* Items */}
            <View style={styles.itemsSection}>
              <Text style={styles.sectionHeader}>Items</Text>
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>UltraTech Cement (50 Kg)</Text>
                <Text style={styles.itemQty}>10 Bags</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>TMT Steel 12mm</Text>
                <Text style={styles.itemQty}>20 Kg</Text>
              </View>
              <Text style={styles.moreItemsText}>+1 more item</Text>
            </View>

            {/* Payment */}
            <View style={styles.paymentSection}>
              <Text style={styles.paymentLabel}>Payment</Text>
              <View style={styles.paymentRightCol}>
                <Text style={styles.paymentAmount}>₹680</Text>
                <View style={styles.prepaidBadge}>
                  <Text style={styles.prepaidText}>Prepaid</Text>
                </View>
              </View>
            </View>

            {/* Bottom Actions: Reject & Accept Order */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.rejectBtn} onPress={onReject} activeOpacity={0.8}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn} onPress={onAccept} activeOpacity={0.88}>
                <Text style={styles.acceptText}>Accept Order</Text>
              </TouchableOpacity>
            </View>
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
    maxHeight: '92%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    color: colors.white,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  orderIdCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  orderIdValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginTop: 2,
  },
  newBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  newBadgeText: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: typography.weights.bold,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: spacing.sm,
  },
  timeLabel: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
  },
  timeValue: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  locationSection: {
    gap: 6,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
  },
  storeIconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeEmoji: {
    fontSize: 20,
  },
  locationName: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  locationSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#6B7280',
  },
  itemsSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.semibold,
    color: '#1F2937',
  },
  itemQty: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
  },
  moreItemsText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  paymentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  paymentLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  paymentRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  paymentAmount: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  prepaidBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  prepaidText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: spacing.md - 2,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rejectText: {
    color: '#4B5563',
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: '#FF6B00',
    paddingVertical: spacing.md - 2,
    borderRadius: radii.xl,
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
