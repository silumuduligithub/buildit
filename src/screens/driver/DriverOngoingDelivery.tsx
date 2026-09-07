import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import {
  Navigation,
  Phone,
  MapPin,
  Store,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  PackageCheck,
  Check,
  ChevronRight,
  Truck,
  ArrowRight,
} from 'lucide-react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import GradientAppHeader from '../../components/GradientAppHeader';

type DeliveryStage =
  | 'going_to_pickup'
  | 'arrived_at_pickup'
  | 'out_for_delivery'
  | 'arrived_at_customer'
  | 'completed';

export default function DriverOngoingDelivery({ route, navigation }: any) {
  const [stage, setStage] = useState<DeliveryStage>('going_to_pickup');
  const [otpInput, setOtpInput] = useState('4821');
  const [itemsChecked, setItemsChecked] = useState({ item1: true, item2: true });

  const handleOpenMaps = () => {
    Linking.openURL('https://maps.google.com/?q=Kondapur+Hyderabad');
  };

  const handleCallCustomer = () => {
    Linking.openURL('tel:+919876543210');
  };

  const handleNextStage = () => {
    if (stage === 'going_to_pickup') {
      setStage('arrived_at_pickup');
    } else if (stage === 'arrived_at_pickup') {
      setStage('out_for_delivery');
    } else if (stage === 'out_for_delivery') {
      setStage('arrived_at_customer');
    } else if (stage === 'arrived_at_customer') {
      if (otpInput.trim() !== '4821') {
        Alert.alert(
          'Invalid PIN',
          'Please enter the 4-digit code provided by the site engineer (4821).'
        );
        return;
      }
      setStage('completed');
    }
  };

  if (stage === 'completed') {
    return (
      <View style={styles.root}>
        <View style={styles.completedContainer}>
          <View style={styles.completedCheckCircle}>
            <CheckCircle2 size={54} color={colors.success} strokeWidth={2} />
          </View>

          <Text style={styles.completedTitle}>Delivery Completed!</Text>
          <Text style={styles.completedSub}>
            Materials verified & handed over at site.
          </Text>

          <View style={styles.completedSummaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Order ID</Text>
              <Text style={styles.summaryVal}>BK-250531-00125</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Customer</Text>
              <Text style={styles.summaryVal}>Ravi Kumar</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Time</Text>
              <Text style={styles.summaryVal}>11:25 AM</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.earningsLabel}>Trip Earnings</Text>
              <Text style={styles.earningsVal}>₹480</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.nextDeliveryBtn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.88}
          >
            <Text style={styles.nextDeliveryBtnText}>Back to Dashboard</Text>
            <ArrowRight size={18} color={colors.white} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title={
          stage === 'going_to_pickup'
            ? 'Going to Pickup'
            : stage === 'arrived_at_pickup'
            ? 'Confirm Material Pickup'
            : stage === 'out_for_delivery'
            ? 'Out for Site Delivery'
            : 'Verify & Complete Delivery'
        }
        subtitle={
          stage.includes('pickup')
            ? 'Sri Sai Hardware (1.5 km)'
            : 'Ravi Kumar · Kondapur Site'
        }
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Live Step Progression Bar ── */}
        <View style={styles.stageTrackerCard}>
          <View style={styles.stageTrackRow}>
            <View
              style={[
                styles.stagePill,
                stage === 'going_to_pickup' && styles.stagePillActive,
              ]}
            >
              <Text style={styles.stageText}>1. Pickup</Text>
            </View>
            <View style={styles.stageLine} />
            <View
              style={[
                styles.stagePill,
                stage === 'out_for_delivery' && styles.stagePillActive,
              ]}
            >
              <Text style={styles.stageText}>2. Transit</Text>
            </View>
            <View style={styles.stageLine} />
            <View
              style={[
                styles.stagePill,
                stage === 'arrived_at_customer' && styles.stagePillActive,
              ]}
            >
              <Text style={styles.stageText}>3. Dropoff</Text>
            </View>
          </View>
        </View>

        {/* ── Address & Navigation Spotlight ── */}
        <View style={styles.targetCard}>
          <View style={styles.targetHeader}>
            <View style={styles.targetTag}>
              <Text style={styles.targetTagText}>
                {stage.includes('pickup') ? 'SUPPLIER STORE' : 'CUSTOMER SITE'}
              </Text>
            </View>
            <Text style={styles.targetDistance}>
              {stage.includes('pickup') ? '1.5 km away' : '2.3 km away'}
            </Text>
          </View>

          <Text style={styles.targetName}>
            {stage.includes('pickup')
              ? 'Sri Sai Hardware & Builders Depot'
              : 'Golden Heights Site, Plot 45'}
          </Text>
          <Text style={styles.targetAddress}>
            {stage.includes('pickup')
              ? 'Near RTO Office, Main Road, Kondapur, Hyderabad'
              : 'Opp. Metro Pillar 825, Kondapur Main Road, Hyderabad'}
          </Text>

          <View style={styles.targetActionsRow}>
            <TouchableOpacity
              style={styles.navActionBtn}
              onPress={handleOpenMaps}
              activeOpacity={0.85}
            >
              <Navigation size={18} color={colors.white} strokeWidth={2} />
              <Text style={styles.navActionText}>Turn-by-Turn GPS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callActionBtn}
              onPress={handleCallCustomer}
              activeOpacity={0.8}
            >
              <Phone size={18} color={colors.primary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Materials Checklist Card ── */}
        <View style={styles.manifestCard}>
          <Text style={styles.manifestHeading}>Materials Manifest</Text>
          <View style={styles.manifestRow}>
            <PackageCheck size={18} color={colors.primary} strokeWidth={2} />
            <View style={{ flex: 1 }}>
              <Text style={styles.manifestItemName}>
                UltraTech Cement OPC 53 Grade
              </Text>
              <Text style={styles.manifestQty}>20 Bags (1,000 kg)</Text>
            </View>
            <CheckCircle2 size={18} color={colors.success} strokeWidth={2} />
          </View>

          <View style={styles.manifestDivider} />

          <View style={styles.manifestRow}>
            <PackageCheck size={18} color={colors.primary} strokeWidth={2} />
            <View style={{ flex: 1 }}>
              <Text style={styles.manifestItemName}>
                Tata Tiscon 550D TMT Rebars (12mm)
              </Text>
              <Text style={styles.manifestQty}>5 Bundles (200 kg)</Text>
            </View>
            <CheckCircle2 size={18} color={colors.success} strokeWidth={2} />
          </View>
        </View>

        {/* ── Customer Verification OTP Box (if at site) ── */}
        {stage === 'arrived_at_customer' && (
          <View style={styles.otpCard}>
            <View style={styles.otpHeader}>
              <KeyRound size={20} color={colors.primary} strokeWidth={2} />
              <Text style={styles.otpHeading}>Enter Customer 4-Digit PIN</Text>
            </View>
            <Text style={styles.otpInstructions}>
              Ask the receiving engineer at site for their 4-digit code.
            </Text>
            <TextInput
              style={styles.otpInput}
              value={otpInput}
              onChangeText={setOtpInput}
              keyboardType="numeric"
              maxLength={4}
              placeholder="4821"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Bottom Sticky Stage CTA ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.stageActionBtn}
          onPress={handleNextStage}
          activeOpacity={0.88}
        >
          <Text style={styles.stageActionBtnText}>
            {stage === 'going_to_pickup'
              ? 'Arrived at Store ✓'
              : stage === 'arrived_at_pickup'
              ? 'Confirm Loading & Start Trip →'
              : stage === 'out_for_delivery'
              ? 'Arrived at Site ✓'
              : 'Verify PIN & Complete Delivery'}
          </Text>
        </TouchableOpacity>
      </View>
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

  // ── Stage Track ──
  stageTrackerCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  stageTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stagePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceSecondary,
  },
  stagePillActive: {
    backgroundColor: colors.primary,
  },
  stageText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  stageLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },

  // ── Target Card ──
  targetCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  targetTag: {
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  targetTagText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  targetDistance: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  targetName: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  targetAddress: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  targetActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  navActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.sm,
  },
  navActionText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  callActionBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryFaded,
    borderWidth: 1,
    borderColor: 'rgba(223, 103, 51, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Manifest ──
  manifestCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  manifestHeading: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  manifestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  manifestItemName: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  manifestQty: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  manifestDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },

  // ── OTP Card ──
  otpCard: {
    backgroundColor: colors.pillActiveBg,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  otpHeading: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  otpInstructions: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  otpInput: {
    width: 160,
    height: 52,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: typography.weights.bold,
    letterSpacing: 8,
    color: colors.text,
  },

  // ── Completed State ──
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  completedCheckCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5F9EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  completedTitle: {
    fontSize: typography.fontSizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  completedSub: {
    fontSize: typography.fontSizes.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.xl,
  },
  completedSummaryCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.sm,
    ...shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: typography.fontSizes.bodySmall,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 4,
  },
  earningsLabel: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  earningsVal: {
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  nextDeliveryBtn: {
    marginTop: spacing.xl,
    width: '100%',
    height: 50,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.md,
  },
  nextDeliveryBtnText: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },

  // ── Bottom Bar ──
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  stageActionBtn: {
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageActionBtnText: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
});
