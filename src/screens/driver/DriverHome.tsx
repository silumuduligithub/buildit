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
import DriverNewOrderModal from './DriverNewOrderModal';

export default function DriverHome({ navigation }: any) {
  const [isOnline, setIsOnline] = useState(true);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  const handleAcceptOrder = () => {
    setShowNewOrderModal(false);
    navigation.navigate('OngoingDelivery', { orderId: 'BK-250531-00125' });
  };

  const handleRejectOrder = () => {
    setShowNewOrderModal(false);
    Alert.alert('Order Declined', 'The next available order will be assigned to you.');
  };

  return (
    <View style={styles.root}>
      {/* ── Signature Crimson Gradient Header ── */}
      <LinearGradient
        colors={['#140202', '#8B0000', '#D32F2F', '#E53935']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.driverProfileBox}>
            <View style={styles.driverAvatarCircle}>
              <Text style={{ fontSize: 22 }}>👨‍✈️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerDriverName}>Good Morning, Mahesh 👋</Text>
              <Text style={styles.headerVehicleText}>TS09 JK 1234 • Bajaj Maxima</Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            <View style={[styles.onlinePill, !isOnline && styles.offlinePill]}>
              <View style={[styles.statusDot, !isOnline && { backgroundColor: '#EF4444' }]} />
              <Text style={styles.onlineText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: '#4B5563', true: '#059669' }}
                thumbColor={colors.white}
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              />
            </View>

            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => setShowNewOrderModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.bellEmoji}>🔔</Text>
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Today's Overview Dark Card ── */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeaderRow}>
            <Text style={styles.overviewTitle}>Today's Overview</Text>
            <TouchableOpacity style={styles.dropdownBtn}>
              <Text style={styles.dropdownText}>Today ▾</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Deliveries</Text>
              <Text style={styles.statValue}>6</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Earnings</Text>
              <Text style={styles.statValue}>₹2,450</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Time Online</Text>
              <Text style={styles.statValue}>5h 30m</Text>
            </View>
          </View>
        </View>

        {/* ── New Orders Alert Banner ── */}
        <TouchableOpacity
          style={styles.alertBanner}
          onPress={() => setShowNewOrderModal(true)}
          activeOpacity={0.88}
        >
          <View style={styles.alertIconBox}>
            <Text style={styles.alertEmoji}>🛵</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>You have 2 new orders</Text>
            <Text style={styles.alertSub}>Tap to view</Text>
          </View>
          <Text style={styles.alertArrow}>›</Text>
        </TouchableOpacity>

        {/* ── Next Delivery Section ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Next Delivery</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Deliveries')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Order Card */}
        <View style={styles.orderCard}>
          <View style={styles.orderCardHeader}>
            <View style={styles.orderIdBox}>
              <Text style={styles.boxEmoji}>📦</Text>
              <Text style={styles.orderIdText}>BK-250531-00125</Text>
            </View>
            <View style={styles.newPill}>
              <Text style={styles.newPillText}>New</Text>
            </View>
          </View>

          <View style={styles.locationDetails}>
            <View style={styles.locationLine}>
              <Text style={styles.locationPinEmoji}>📍</Text>
              <Text style={styles.pickupText}>Sharma Building Materials</Text>
            </View>
            <View style={styles.locationLine}>
              <Text style={styles.locationPinEmoji}>👤</Text>
              <Text style={styles.dropText}>Ravi Kumar</Text>
            </View>
          </View>

          <View style={styles.distancePriceRow}>
            <View style={styles.distanceBox}>
              <Text style={styles.distanceArrow}>⇣</Text>
              <Text style={styles.distanceValue}>2.4 km</Text>
            </View>
            <Text style={styles.priceValue}>₹680</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.orderActionsRow}>
            <TouchableOpacity
              style={styles.acceptOrderBtn}
              onPress={handleAcceptOrder}
              activeOpacity={0.88}
            >
              <Text style={styles.acceptOrderText}>Accept Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectOrderBtn}
              onPress={handleRejectOrder}
              activeOpacity={0.8}
            >
              <Text style={styles.rejectOrderText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Today's Progress ── */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressScore}>6/10</Text>
          </View>
          <Text style={styles.progressSub}>Deliveries Completed</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '60%' }]} />
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {/* Go Online */}
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => setIsOnline(!isOnline)}
          >
            <View style={[styles.qaIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.qaEmoji, { color: '#10B981' }]}>⏻</Text>
            </View>
            <Text style={styles.qaLabel}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
          </TouchableOpacity>

          {/* My Deliveries */}
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => navigation.navigate('Deliveries')}
          >
            <View style={[styles.qaIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.qaEmoji}>📅</Text>
            </View>
            <Text style={styles.qaLabel}>My Deliveries</Text>
          </TouchableOpacity>

          {/* Earnings */}
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => navigation.navigate('Earnings')}
          >
            <View style={[styles.qaIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.qaEmoji}>👛</Text>
            </View>
            <Text style={styles.qaLabel}>Earnings</Text>
          </TouchableOpacity>

          {/* Support */}
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => Alert.alert('Driver Support', 'Calling Driver Helpline: 1800-419-BUILD')}
          >
            <View style={[styles.qaIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Text style={styles.qaEmoji}>🎧</Text>
            </View>
            <Text style={styles.qaLabel}>Support</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── New Order Modal ── */}
      <DriverNewOrderModal
        visible={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        onAccept={handleAcceptOrder}
        onReject={handleRejectOrder}
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
    paddingBottom: spacing.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    ...shadows.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverProfileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
    gap: spacing.sm,
  },
  driverAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerDriverName: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
  },
  headerVehicleText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  bellEmoji: {
    fontSize: 16,
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  onlinePill: {
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
  offlinePill: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
  },
  overviewCard: {
    backgroundColor: '#0B1528',
    borderRadius: radii.xl,
    padding: spacing.md + 2,
    ...shadows.md,
  },
  overviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  overviewTitle: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  dropdownBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  dropdownText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: typography.weights.medium,
  },
  statValue: {
    color: colors.white,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: spacing.sm,
    ...shadows.sm,
  },
  alertIconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertEmoji: {
    fontSize: 20,
  },
  alertTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#065F46',
  },
  alertSub: {
    fontSize: 10,
    color: '#047857',
    marginTop: 1,
  },
  alertArrow: {
    fontSize: 20,
    color: '#065F46',
    fontWeight: 'bold',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  viewAllText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#EA580C',
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boxEmoji: {
    fontSize: 14,
  },
  orderIdText: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  newPill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  newPillText: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  locationDetails: {
    gap: 4,
  },
  locationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationPinEmoji: {
    fontSize: 12,
  },
  pickupText: {
    fontSize: typography.fontSizes.xs,
    color: '#4B5563',
  },
  dropText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  distancePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  distanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  distanceValue: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  orderActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
  },
  acceptOrderBtn: {
    flex: 2,
    backgroundColor: '#FF6B00',
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptOrderText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
  },
  rejectOrderBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectOrderText: {
    color: '#6B7280',
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  progressScore: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#059669',
  },
  progressSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: radii.full,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionBtn: {
    width: '23%',
    alignItems: 'center',
  },
  qaIconBox: {
    width: 52,
    height: 52,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...shadows.sm,
  },
  qaEmoji: {
    fontSize: 20,
  },
  qaLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#374151',
    textAlign: 'center',
  },
});
