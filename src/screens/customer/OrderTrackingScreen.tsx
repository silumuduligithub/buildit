import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Check,
  Truck,
  Clock,
  KeyRound,
  Store,
  ChevronRight,
  PackageCheck,
} from 'lucide-react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';

const TRACKING_STEPS = [
  { id: 'step_1', title: 'Order Confirmed', time: '10:32 AM', desc: 'Store accepted your order' },
  { id: 'step_2', title: 'Materials Packed', time: '10:45 AM', desc: 'Loaded on delivery truck' },
  { id: 'step_3', title: 'Out for Delivery', time: '11:05 AM', desc: 'Driver is on the way' },
  { id: 'step_4', title: 'Delivered to Site', time: 'ETA 11:30 AM', desc: 'OTP required at unload' },
];

export default function OrderTrackingScreen({ route, navigation }: any) {
  const orderId = route?.params?.orderId || '20003645';
  const { orders } = useAppStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(2);

  const activeOrder = orders.find((o) => o.id === orderId) || orders[0];

  const handleCallDriver = () => {
    Linking.openURL('tel:+919876500112');
  };

  const handleAdvanceSimulation = () => {
    if (currentStepIndex < TRACKING_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      Alert.alert('Delivered', 'Order marked as delivered successfully!');
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Live Order Tracking"
        subtitle={`Order #${orderId} • ETA 20 Mins`}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        rightIcon={<MessageCircle size={18} color={colors.white} strokeWidth={2} />}
        onRightPress={() => Alert.alert('Support', 'Connecting you with BuildKart site support team...')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Live Map Simulation Banner ── */}
        <View style={styles.mapCard}>
          <View style={styles.mapBg}>
            <View style={styles.routePathLine} />
            <View style={styles.storePin}>
              <Store size={14} color={colors.white} strokeWidth={2} />
            </View>
            <View style={styles.truckPin}>
              <Truck size={14} color={colors.white} strokeWidth={2} />
            </View>
            <View style={styles.destPin}>
              <MapPin size={14} color={colors.white} strokeWidth={2} />
            </View>
          </View>
          <View style={styles.mapOverlayPill}>
            <View style={styles.pulseDot} />
            <Text style={styles.mapOverlayText}>Live GPS Tracking Active</Text>
          </View>
        </View>

        {/* ── Delivery PIN / OTP Card ── */}
        <View style={styles.otpCard}>
          <View style={styles.otpLeft}>
            <View style={styles.otpIconCircle}>
              <KeyRound size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.otpLabel}>Delivery Verification PIN</Text>
              <Text style={styles.otpSub}>Share with driver upon arrival</Text>
            </View>
          </View>
          <View style={styles.otpCodeBox}>
            <Text style={styles.otpCodeText}>{activeOrder?.otp || '4821'}</Text>
          </View>
        </View>

        {/* ── Driver Contact Card ── */}
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>MK</Text>
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>
              {activeOrder?.driverName || 'Mahesh Kumar'}
            </Text>
            <Text style={styles.driverVehicle}>
              Tata Ace (Hydraulic) · TS 09 UB 4421
            </Text>
            <Text style={styles.driverPhone}>
              {activeOrder?.driverPhone || '+91 98765 00112'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.callButton}
            onPress={handleCallDriver}
            activeOpacity={0.8}
            accessibilityLabel="Call Driver"
          >
            <Phone size={18} color={colors.white} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* ── Timeline Steps ── */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineHeaderRow}>
            <Text style={styles.cardHeading}>Order Milestones</Text>
            <TouchableOpacity onPress={handleAdvanceSimulation}>
              <Text style={styles.simulateText}>Simulate Next Step →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stepsList}>
            {TRACKING_STEPS.map((step, idx) => {
              const isFinished = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isLast = idx === TRACKING_STEPS.length - 1;

              return (
                <View key={step.id} style={styles.stepRow}>
                  {/* Left node & connector */}
                  <View style={styles.nodeCol}>
                    <View
                      style={[
                        styles.nodeCircle,
                        isFinished ? styles.nodeFinished : styles.nodePending,
                      ]}
                    >
                      <Check
                        size={12}
                        color={isFinished ? colors.white : '#CBD5E1'}
                        strokeWidth={2.5}
                      />
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.connectorLine,
                          idx < currentStepIndex && styles.connectorFinished,
                        ]}
                      />
                    )}
                  </View>

                  {/* Right description */}
                  <View style={styles.stepContent}>
                    <View style={styles.stepTitleRow}>
                      <Text
                        style={[
                          styles.stepTitle,
                          isCurrent && styles.stepTitleCurrent,
                        ]}
                      >
                        {step.title}
                      </Text>
                      <Text style={styles.stepTime}>{step.time}</Text>
                    </View>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Delivery Site Address ── */}
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <MapPin size={16} color={colors.primary} strokeWidth={2} />
            <Text style={styles.addressTitle}>Site Unload Location</Text>
          </View>
          <Text style={styles.addressName}>
            {activeOrder?.deliveryAddress?.name || 'Ravi Kumar'} (
            {activeOrder?.deliveryAddress?.phone || '9876543210'})
          </Text>
          <Text style={styles.addressDetails}>
            {activeOrder?.deliveryAddress?.line1 ||
              'Plot No. 45, Golden Heights, Kondapur Main Road, Hyderabad - 500084'}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.base,
    gap: spacing.md,
  },

  // ── Map Banner ──
  mapCard: {
    height: 140,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  mapBg: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 40,
  },
  routePathLine: {
    position: 'absolute',
    height: 3,
    backgroundColor: colors.primary,
    left: 40,
    right: 40,
  },
  storePin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...shadows.sm,
  },
  truckPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    ...shadows.md,
  },
  destPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...shadows.sm,
  },
  mapOverlayPill: {
    position: 'absolute',
    bottom: spacing.sm,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  mapOverlayText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },

  // ── OTP Card ──
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.pillActiveBg,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  otpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  otpIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  otpLabel: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  otpSub: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  otpCodeBox: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  otpCodeText: {
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.bold,
    letterSpacing: 4,
    color: colors.primary,
  },

  // ── Driver Card ──
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  driverAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  driverAvatarText: {
    fontSize: typography.fontSizes.title,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  driverVehicle: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  driverPhone: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },

  // ── Timeline ──
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  cardHeading: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  simulateText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  stepsList: {
    paddingLeft: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 56,
  },
  nodeCol: {
    alignItems: 'center',
    width: 24,
    marginRight: spacing.md,
  },
  nodeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeFinished: {
    backgroundColor: colors.success,
  },
  nodePending: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  connectorFinished: {
    backgroundColor: colors.success,
  },
  stepContent: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  stepTitleCurrent: {
    color: colors.text,
    fontWeight: typography.weights.bold,
  },
  stepTime: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
  },
  stepDesc: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },

  // ── Address Card ──
  addressCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  addressTitle: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  addressName: {
    fontSize: typography.fontSizes.bodySmall,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  addressDetails: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
});
