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
import {
  Truck,
  Navigation,
  Bell,
  Wallet,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Shield,
  Award,
  ChevronRight,
  Store,
  DollarSign,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import DriverNewOrderModal from './DriverNewOrderModal';

export default function DriverHome({ navigation }: any) {
  const [isOnline, setIsOnline] = useState(true);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const { currentUser, userRoleData } = useAppStore();

  const handleAcceptOrder = () => {
    setShowNewOrderModal(false);
    navigation.navigate('OngoingDelivery', { orderId: 'BK-250531-00125' });
  };

  const handleRejectOrder = () => {
    setShowNewOrderModal(false);
    Alert.alert('Order Declined', 'Next available delivery will be routed to you.');
  };

  const driverName = currentUser?.name || 'Mahesh Kumar';
  const driverInitials = driverName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'MK';

  return (
    <View style={styles.root}>
      {/* ── Signature Driver Header ── */}
      <LinearGradient
        colors={['#101924', '#1E293B', '#334155']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.driverProfileBox}>
            <View style={styles.driverAvatarCircle}>
              <Text style={styles.avatarInitials}>{driverInitials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerDriverName}>Hello, {driverName}</Text>
              <Text style={styles.headerVehicleText}>
                {userRoleData?.vehicle_number ? `Tata Ace · ${userRoleData.vehicle_number}` : 'Tata Ace · TS 09 UB 4421'}
              </Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            <View style={[styles.onlinePill, !isOnline && styles.offlinePill]}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isOnline ? '#10B981' : '#EF4444' },
                ]}
              />
              <Text style={styles.onlineText}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </Text>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: '#475569', true: '#10B981' }}
                thumbColor={colors.white}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
              />
            </View>

            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => setShowNewOrderModal(true)}
              activeOpacity={0.8}
            >
              <Bell size={18} color={colors.white} strokeWidth={2} />
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>1</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Active Task Spotlight Card ── */}
        <View style={styles.spotlightCard}>
          <View style={styles.spotlightHeader}>
            <View style={styles.spotlightTag}>
              <Zap size={12} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.spotlightTagText}>ASSIGNED DELIVERY</Text>
            </View>
            <Text style={styles.spotlightPayout}>₹480 Payout</Text>
          </View>

          <Text style={styles.spotlightOrderId}>Order #BK-250531-00125</Text>
          <Text style={styles.spotlightPayload}>
            20 Bags UltraTech Cement + TMT Rebars (1.2 Tonnes)
          </Text>

          {/* Route Steps */}
          <View style={styles.routeBox}>
            <View style={styles.routeStep}>
              <Store size={16} color={colors.primary} strokeWidth={2} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stepLabel}>PICKUP</Text>
                <Text style={styles.stepName}>Sri Sai Hardware & Builders</Text>
                <Text style={styles.stepDistance}>1.5 km away · Ready for loading</Text>
              </View>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.routeStep}>
              <MapPin size={16} color={colors.success} strokeWidth={2} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stepLabel}>DROPOFF</Text>
                <Text style={styles.stepName}>Plot 45, Golden Heights, Kondapur</Text>
                <Text style={styles.stepDistance}>Customer: Ravi Kumar (9876543210)</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.startDeliveryBtn}
            onPress={() =>
              navigation.navigate('OngoingDelivery', {
                orderId: 'BK-250531-00125',
              })
            }
            activeOpacity={0.88}
          >
            <Text style={styles.startDeliveryText}>Start Trip & Navigation</Text>
            <Navigation size={18} color={colors.white} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* ── Today's Performance ── */}
        <Text style={styles.sectionHeading}>Today's Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <Wallet size={18} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>₹2,450</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconCircle,
                { backgroundColor: 'rgba(16, 185, 129, 0.12)' },
              ]}
            >
              <CheckCircle2 size={18} color="#059669" strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Completed Trips</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconCircle,
                { backgroundColor: 'rgba(59, 130, 246, 0.12)' },
              ]}
            >
              <Clock size={18} color="#2563EB" strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>5.5 hrs</Text>
            <Text style={styles.statLabel}>Time Online</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconCircle,
                { backgroundColor: 'rgba(245, 158, 11, 0.12)' },
              ]}
            >
              <Award size={18} color="#D97706" strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>4.9 ★</Text>
            <Text style={styles.statLabel}>Driver Rating</Text>
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <Text style={styles.sectionHeading}>Driver Hub</Text>
        <View style={styles.hubLinksCard}>
          <TouchableOpacity
            style={styles.hubRow}
            onPress={() => navigation.navigate('Earnings')}
            activeOpacity={0.75}
          >
            <View style={styles.hubIconBox}>
              <Wallet size={18} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hubTitle}>Payouts & Incentives</Text>
              <Text style={styles.hubSub}>Daily transfer to Bank Account</Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.8} />
          </TouchableOpacity>

          <View style={styles.hubDivider} />

          <TouchableOpacity
            style={styles.hubRow}
            onPress={() => navigation.navigate('Deliveries')}
            activeOpacity={0.75}
          >
            <View style={styles.hubIconBox}>
              <Clock size={18} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hubTitle}>Past Delivery History</Text>
              <Text style={styles.hubSub}>Trip invoices and proof of delivery</Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.8} />
          </TouchableOpacity>

          <View style={styles.hubDivider} />

          <TouchableOpacity
            style={styles.hubRow}
            onPress={() => navigation.navigate('Support')}
            activeOpacity={0.75}
          >
            <View style={styles.hubIconBox}>
              <Shield size={18} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hubTitle}>Emergency & Road Support</Text>
              <Text style={styles.hubSub}>24/7 dedicated helpline</Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* New Order incoming popup */}
      <DriverNewOrderModal
        visible={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        onAccept={handleAcceptOrder}
        onReject={handleRejectOrder}
      />
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
  driverProfileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  driverAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  headerDriverName: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  headerVehicleText: {
    fontSize: typography.fontSizes.caption,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radii.full,
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 3,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  offlinePill: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },

  scrollContent: {
    padding: spacing.base,
  },

  // ── Spotlight ──
  spotlightCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadows.md,
    marginBottom: spacing.lg,
  },
  spotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  spotlightTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    gap: 4,
  },
  spotlightTagText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  spotlightPayout: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  spotlightOrderId: {
    fontSize: typography.fontSizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  spotlightPayload: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  routeBox: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.lg,
    padding: spacing.md,
    position: 'relative',
    marginBottom: spacing.md,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: colors.textTertiary,
    letterSpacing: 0.8,
  },
  stepName: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  stepDistance: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  routeLine: {
    width: 2,
    height: 18,
    backgroundColor: colors.border,
    marginLeft: 7,
    marginVertical: 4,
  },
  startDeliveryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radii.full,
    gap: spacing.sm,
    ...shadows.sm,
  },
  startDeliveryText: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },

  // ── Section ──
  sectionHeading: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },

  // ── Stats ──
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ── Hub ──
  hubLinksCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  hubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  hubIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubTitle: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  hubSub: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
    marginTop: 1,
  },
  hubDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
