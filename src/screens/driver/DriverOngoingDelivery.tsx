import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import GradientAppHeader from '../../components/GradientAppHeader';

// 5-Stage Delivery State Machine from BRD
type DeliveryStage =
  | 'going_to_pickup'     // Driver Accepted -> Travelling to Retailer
  | 'arrived_at_pickup'   // At Retailer -> Checking & Confirming materials
  | 'out_for_delivery'    // Pickup Confirmed -> Travelling to Customer Site
  | 'arrived_at_customer' // At Site -> Customer Verification & OTP
  | 'completed';          // Delivery Completed Screen

export default function DriverOngoingDelivery({ route, navigation }: any) {
  const [stage, setStage] = useState<DeliveryStage>('going_to_pickup');
  const [otpInput, setOtpInput] = useState('4821');
  const [itemsChecked, setItemsChecked] = useState({ item1: true, item2: true });

  const handleNextStage = () => {
    if (stage === 'going_to_pickup') {
      setStage('arrived_at_pickup');
    } else if (stage === 'arrived_at_pickup') {
      setStage('out_for_delivery');
    } else if (stage === 'out_for_delivery') {
      setStage('arrived_at_customer');
    } else if (stage === 'arrived_at_customer') {
      if (otpInput.trim() !== '4821') {
        Alert.alert('Invalid OTP', 'Please enter the 4-digit code provided by customer (4821).');
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
            <Text style={styles.completedCheckEmoji}>✓</Text>
          </View>

          <Text style={styles.completedTitle}>Delivery Completed!</Text>
          <Text style={styles.completedSub}>Materials handed over successfully.</Text>

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
              <Text style={styles.earningsLabel}>Delivery Earnings</Text>
              <Text style={styles.earningsVal}>₹680</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.nextDeliveryBtn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.88}
          >
            <Text style={styles.nextDeliveryBtnText}>Next Delivery →</Text>
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
          stage === 'going_to_pickup' ? 'Going to Pickup'
          : stage === 'arrived_at_pickup' ? 'Confirm Pickup'
          : stage === 'out_for_delivery' ? 'Ongoing Delivery'
          : 'Customer Verification'
        }
        subtitle={stage.includes('pickup') ? 'Sharma Building Materials (2.4 km)' : 'Ravi Kumar • Gokul Construction'}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        rightIcon="📞"
        onRightPress={() => Alert.alert('Call', stage.includes('pickup') ? 'Calling Retailer: +91 98480 12345' : 'Calling Customer: +91 98765 43210')}
      />

      {/* ── Stage Progress Indicator Strip ── */}
      <View style={styles.stagesStrip}>
        <View style={[styles.stageStep, styles.stageStepActive]}>
          <Text style={styles.stepNum}>1</Text>
          <Text style={styles.stepLabel}>Pickup</Text>
        </View>
        <View style={[styles.stepConnector, stage !== 'going_to_pickup' && styles.stepConnectorActive]} />

        <View style={[styles.stageStep, stage !== 'going_to_pickup' && styles.stageStepActive]}>
          <Text style={styles.stepNum}>2</Text>
          <Text style={styles.stepLabel}>Loaded</Text>
        </View>
        <View style={[styles.stepConnector, (stage === 'out_for_delivery' || stage === 'arrived_at_customer') && styles.stepConnectorActive]} />

        <View style={[styles.stageStep, (stage === 'out_for_delivery' || stage === 'arrived_at_customer') && styles.stageStepActive]}>
          <Text style={styles.stepNum}>3</Text>
          <Text style={styles.stepLabel}>Transit</Text>
        </View>
        <View style={[styles.stepConnector, stage === 'arrived_at_customer' && styles.stepConnectorActive]} />

        <View style={[styles.stageStep, stage === 'arrived_at_customer' && styles.stageStepActive]}>
          <Text style={styles.stepNum}>4</Text>
          <Text style={styles.stepLabel}>Deliver</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Simulated Interactive Map ── */}
        <View style={styles.mapContainer}>
          <View style={styles.mapRoadH1} />
          <View style={styles.mapRoadH2} />
          <View style={styles.mapRoadV1} />

          <Text style={styles.mapAreaLabel1}>Banjara Hills</Text>
          <Text style={styles.mapAreaLabel2}>Jubilee Hills</Text>
          <Text style={styles.mapAreaLabel3}>Madhapur</Text>

          <View style={styles.routePathLine} />

          <View style={styles.depotMarker}>
            <View style={styles.depotDot} />
          </View>

          <View style={styles.etaPill}>
            <Text style={styles.etaText}>
              {stage.includes('pickup') ? 'ETA 8 min' : 'ETA 15 min'}
            </Text>
          </View>

          <View style={styles.destMarker}>
            <View style={styles.destMarkerPin}>
              <Text style={{ fontSize: 16 }}>📍</Text>
            </View>
          </View>
        </View>

        {/* ── STAGE 1: Going to Pickup ── */}
        {stage === 'going_to_pickup' && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>PICKUP DETAILS</Text>
            <View style={styles.locRow}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 20 }}>🏪</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.locTitle}>Sharma Building Materials</Text>
                <Text style={styles.locSub}>Plot 45, Banjara Hills Main Rd, Hyderabad</Text>
                <Text style={styles.distanceBadge}>2.4 km away from current location</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => Alert.alert('Navigation', 'Opening Google Maps to Sharma Building Materials')}
              >
                <Text style={styles.navBtnText}>🧭 Navigate to Pickup</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleNextStage}
              >
                <Text style={styles.primaryActionBtnText}>Arrived at Pickup →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── STAGE 2: Arrived at Pickup (Confirmation Checklist) ── */}
        {stage === 'arrived_at_pickup' && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>VERIFY MATERIALS LOADED</Text>
            <Text style={styles.checkInstruction}>
              Please verify package seal and count before leaving retailer depot.
            </Text>

            <TouchableOpacity
              style={styles.checkItem}
              onPress={() => setItemsChecked({ ...itemsChecked, item1: !itemsChecked.item1 })}
            >
              <Text style={styles.checkIcon}>{itemsChecked.item1 ? '✅' : '⬜'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>UltraTech Cement OPC 53 Grade</Text>
                <Text style={styles.itemQty}>10 Bags (50 Kg each)</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkItem}
              onPress={() => setItemsChecked({ ...itemsChecked, item2: !itemsChecked.item2 })}
            >
              <Text style={styles.checkIcon}>{itemsChecked.item2 ? '✅' : '⬜'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>Tata Tiscon 550D TMT Steel 12mm</Text>
                <Text style={styles.itemQty}>20 Kg Bundle</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={handleNextStage}
            >
              <Text style={styles.primaryActionBtnText}>✓ Confirm Pickup & Start Delivery →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STAGE 3: Out for Delivery (Customer Site Navigation) ── */}
        {stage === 'out_for_delivery' && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>CUSTOMER DELIVERY SITE</Text>
            <View style={styles.locRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Text style={{ fontSize: 20 }}>🏗️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.locTitle}>Ravi Kumar</Text>
                <Text style={styles.locSub}>Site: Gokul Construction, Madhapur, Hyderabad</Text>
                <Text style={styles.distanceBadge}>5.6 km • Remaining ETA: 15 min</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => Alert.alert('GPS Navigation', 'Launching turn-by-turn route to Gokul Construction')}
              >
                <Text style={styles.navBtnText}>🧭 Navigate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleNextStage}
              >
                <Text style={styles.primaryActionBtnText}>Arrived at Site →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── STAGE 4: Arrived at Customer (OTP Verification) ── */}
        {stage === 'arrived_at_customer' && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>CUSTOMER OTP VERIFICATION</Text>
            <Text style={styles.checkInstruction}>
              Ask customer Ravi Kumar for the 4-digit delivery verification OTP.
            </Text>

            <View style={styles.otpInputWrapper}>
              <TextInput
                style={styles.otpInput}
                value={otpInput}
                onChangeText={setOtpInput}
                keyboardType="numeric"
                maxLength={4}
                placeholder="4821"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={handleNextStage}
            >
              <Text style={styles.primaryActionBtnText}>🎉 Complete Delivery (₹680)</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Order Details Mini Card */}
        <View style={styles.miniCard}>
          <View style={styles.miniRow}>
            <Text style={styles.miniLabel}>Order ID: BK-250531-00125</Text>
            <Text style={styles.miniRating}>⭐ 4.8 Rating</Text>
          </View>
          <Text style={styles.miniItems}>Items: 10 Bags, 20 Kg, +1 more</Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 44;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topBar: {
    paddingTop: topInset + 4,
    paddingBottom: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    ...shadows.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: typography.fontSizes.sm + 2,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  stagesStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stageStep: {
    alignItems: 'center',
    gap: 2,
  },
  stageStepActive: {
    opacity: 1,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF6B00',
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 22,
  },
  stepLabel: {
    fontSize: 9,
    color: '#374151',
    fontWeight: 'bold',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
    marginBottom: 10,
  },
  stepConnectorActive: {
    backgroundColor: '#FF6B00',
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  mapContainer: {
    height: 240,
    backgroundColor: '#E8EDF2',
    borderRadius: radii.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  mapRoadH1: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: colors.white,
    opacity: 0.8,
  },
  mapRoadH2: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: colors.white,
    opacity: 0.8,
  },
  mapRoadV1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 14,
    backgroundColor: colors.white,
    opacity: 0.8,
  },
  mapAreaLabel1: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 10,
    color: '#64748B',
    fontWeight: 'bold',
  },
  mapAreaLabel2: {
    position: 'absolute',
    top: 50,
    right: 20,
    fontSize: 10,
    color: '#64748B',
    fontWeight: 'bold',
  },
  mapAreaLabel3: {
    position: 'absolute',
    top: 15,
    right: 40,
    fontSize: 11,
    color: '#1E293B',
    fontWeight: typography.weights.extrabold,
  },
  routePathLine: {
    position: 'absolute',
    top: 30,
    bottom: 50,
    left: '48%',
    width: 4,
    backgroundColor: '#FF6B00',
    borderRadius: 2,
    transform: [{ rotate: '-12deg' }],
  },
  depotMarker: {
    position: 'absolute',
    bottom: 50,
    left: '44%',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  depotDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B00',
    borderWidth: 2,
    borderColor: colors.white,
  },
  etaPill: {
    position: 'absolute',
    top: '45%',
    left: '48%',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    ...shadows.sm,
  },
  etaText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  destMarker: {
    position: 'absolute',
    top: 20,
    left: '50%',
  },
  destMarkerPin: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  cardHeader: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#9CA3AF',
    letterSpacing: 0.6,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  locSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  distanceBadge: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#059669',
    marginTop: 4,
  },
  checkInstruction: {
    fontSize: typography.fontSizes.xs,
    color: '#4B5563',
    lineHeight: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: spacing.sm,
  },
  checkIcon: {
    fontSize: 18,
  },
  itemName: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  itemQty: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  navBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: radii.lg,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  navBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  primaryActionBtn: {
    flex: 1.5,
    backgroundColor: '#FF6B00',
    borderRadius: radii.lg,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  primaryActionBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
  },
  otpInputWrapper: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  otpInput: {
    width: 140,
    height: 52,
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: '#FF6B00',
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    textAlign: 'center',
    letterSpacing: 8,
    color: '#0F172A',
  },
  miniCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 2,
  },
  miniRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  miniLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#475569',
  },
  miniRating: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#D97706',
  },
  miniItems: {
    fontSize: 10,
    color: '#64748B',
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  completedCheckCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    borderWidth: 3,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  completedCheckEmoji: {
    fontSize: 40,
    color: '#059669',
    fontWeight: 'bold',
  },
  completedTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  completedSub: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  completedSummaryCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: radii.xl,
    padding: spacing.md + 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
  },
  summaryVal: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  earningsLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  earningsVal: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: '#059669',
  },
  nextDeliveryBtn: {
    width: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: radii.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  nextDeliveryBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.weights.extrabold,
  },
});
