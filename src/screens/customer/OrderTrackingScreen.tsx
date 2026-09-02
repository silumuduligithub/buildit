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
import GradientAppHeader from '../../components/GradientAppHeader';

const TRACKING_STEPS = [
  { id: 'step_1', title: 'Order Confirmed', time: '31 May, 10:32 AM', isDone: true },
  { id: 'step_2', title: 'Preparing Your Order', time: '31 May, 10:35 AM', isDone: true },
  { id: 'step_3', title: 'Out for Delivery', time: '31 May, 11:05 AM', isDone: true },
  { id: 'step_4', title: 'Delivered', time: 'Expected by 11:25 AM', isDone: false },
];

export default function OrderTrackingScreen({ route, navigation }: any) {
  const orderId = route?.params?.orderId || 'BK-250531-00125';
  const { orders } = useAppStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(2);

  const activeOrder = orders.find((o) => o.id === orderId) || orders[0];

  const handleAdvance = () => {
    if (currentStepIndex < TRACKING_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      Alert.alert('Order Delivered', 'This order has been delivered successfully!');
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Order Tracking) ── */}
      <GradientAppHeader
        title="Live Order Tracking"
        subtitle={`Order #${orderId} • ETA 20 Mins`}
        showBack={true}
        onBackPress={() => navigation.navigate('HomeScreen')}
        rightIcon="💬"
        onRightPress={() => Alert.alert('Help', 'Support line: 1800-BUILD-KART')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Live Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeaderRow}>
            <View style={styles.livePulseDot} />
            <Text style={styles.liveStatusTitle}>
              {currentStepIndex === 3 ? '🎉 Order Delivered' : '🚚 Out for Delivery'}
            </Text>
            <Text style={styles.liveEtaPill}>ETA 20 MINS</Text>
          </View>

          {/* Vertical Tracking Steps */}
          <View style={styles.timelineContainer}>
            {TRACKING_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <View key={step.id} style={styles.timelineStep}>
                  {/* Left Indicator */}
                  <View style={styles.indicatorCol}>
                    <View
                      style={[
                        styles.stepDot,
                        isCompleted && styles.stepDotCompleted,
                        isCurrent && styles.stepDotCurrent,
                      ]}
                    >
                      {isCompleted && <Text style={styles.checkText}>✓</Text>}
                    </View>
                    {idx < TRACKING_STEPS.length - 1 && (
                      <View
                        style={[
                          styles.verticalLine,
                          idx < currentStepIndex && styles.verticalLineCompleted,
                        ]}
                      />
                    )}
                  </View>

                  {/* Right Content */}
                  <View style={styles.stepContentBox}>
                    <Text
                      style={[
                        styles.stepTitle,
                        isCompleted && styles.stepTitleCompleted,
                        isCurrent && styles.stepTitleCurrent,
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text style={styles.stepTime}>{step.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Delivery Partner Card */}
        <View style={styles.partnerCard}>
          <View style={styles.partnerAvatar}>
            <Text style={styles.partnerAvatarEmoji}>🛵</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.partnerRole}>Delivery Partner</Text>
            <Text style={styles.partnerName}>Mahesh Kumar</Text>
            <View style={styles.partnerRatingRow}>
              <Text style={styles.partnerRating}>★ 4.7</Text>
              <Text style={styles.partnerTrips}>• 1,200+ site deliveries</Text>
            </View>
          </View>

          <View style={styles.partnerActionsRow}>
            <TouchableOpacity
              style={styles.actionCircleBtn}
              onPress={() => Alert.alert('Calling Partner', 'Dialing Mahesh Kumar (+91 98765 00112)...')}
            >
              <Text style={styles.actionIconEmoji}>📞</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCircleBtn}
              onPress={() => Alert.alert('Chat', 'Opening chat with delivery partner...')}
            >
              <Text style={styles.actionIconEmoji}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Track on Map Button */}
        <TouchableOpacity
          style={styles.trackOnMapButton}
          onPress={() => Alert.alert('Live Map', 'Rider is 1.2 km away on Kondapur Main Road.')}
          activeOpacity={0.88}
        >
          <Text style={styles.mapBtnEmoji}>🗺️</Text>
          <Text style={styles.mapBtnText}>Track on Map</Text>
        </TouchableOpacity>

        {/* Order Details Box */}
        <View style={styles.orderDetailsBox}>
          <Text style={styles.orderDetailsHeader}>Order Details</Text>
          <View style={styles.orderDetailsRow}>
            <Text style={styles.orderStoreInfo}>Sri Sai Hardware • 2 Items • ₹6,750</Text>
            <TouchableOpacity onPress={() => Alert.alert('Receipt', 'Invoice sent to your email!')}>
              <Text style={styles.viewBillText}>View bill</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Advance Button */}
        <TouchableOpacity style={styles.demoAdvanceBtn} onPress={handleAdvance}>
          <Text style={styles.demoAdvanceText}>Advance Order Status (Demo) →</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
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
    padding: spacing.md,
    gap: spacing.md,
  },
  statusCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  livePulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  liveStatusTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    flex: 1,
  },
  liveEtaPill: {
    backgroundColor: colors.primaryFaded,
    color: colors.primary,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  timelineContainer: {
    paddingLeft: spacing.xs,
  },
  timelineStep: {
    flexDirection: 'row',
  },
  indicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotCompleted: {
    backgroundColor: '#267E3E',
  },
  stepDotCurrent: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  checkText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  verticalLine: {
    width: 2,
    height: 38,
    backgroundColor: colors.borderLight,
  },
  verticalLineCompleted: {
    backgroundColor: '#267E3E',
  },
  stepContentBox: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.md,
  },
  stepTitle: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
  },
  stepTitleCompleted: {
    color: colors.text,
    fontWeight: typography.weights.bold,
  },
  stepTitleCurrent: {
    color: colors.primary,
    fontWeight: typography.weights.extrabold,
  },
  stepTime: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.sm,
  },
  partnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerAvatarEmoji: {
    fontSize: 24,
  },
  partnerRole: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  partnerName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  partnerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  partnerRating: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  partnerTrips: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  partnerActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconEmoji: {
    fontSize: 16,
  },
  trackOnMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    gap: spacing.xs,
    ...shadows.md,
  },
  mapBtnEmoji: {
    fontSize: 16,
  },
  mapBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  orderDetailsBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  orderDetailsHeader: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  orderDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStoreInfo: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  viewBillText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  demoAdvanceBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  demoAdvanceText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
});
