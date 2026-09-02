import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import GradientAppHeader from '../../components/GradientAppHeader';
import PicklistModal, { PicklistItem } from '../../components/PicklistModal';

const TIMEFRAME_OPTIONS: PicklistItem[] = [
  { label: 'Today', value: 'Today', subLabel: '6 deliveries • ₹2,450', badge: 'TODAY' },
  { label: 'This Week', value: 'This Week', subLabel: '24 deliveries • ₹9,450', badge: 'CURRENT' },
  { label: 'Last Week', value: 'Last Week', subLabel: '28 deliveries • ₹11,200' },
  { label: 'This Month (May)', value: 'This Month', subLabel: '118 deliveries • ₹44,800' },
  { label: 'Previous Month (April)', value: 'Previous Month', subLabel: '104 deliveries • ₹39,500' },
];

export default function DriverEarnings({ navigation }: any) {
  const [timeframe, setTimeframe] = useState('This Week');
  const [showTimeframeModal, setShowTimeframeModal] = useState(false);

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Earnings & Payouts"
        subtitle={`Viewing: ${timeframe}`}
        showBack={false}
        rightIcon="📅"
        onRightPress={() => setShowTimeframeModal(true)}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Total Earnings Hero Card ── */}
        <TouchableOpacity
          style={styles.heroEarningsCard}
          onPress={() => setShowTimeframeModal(true)}
          activeOpacity={0.92}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.heroLabel}>Total Earnings</Text>
              <View style={styles.timeframePill}>
                <Text style={styles.timeframePillText}>{timeframe} ▾</Text>
              </View>
            </View>
            <Text style={styles.heroAmount}>
              {timeframe === 'Today' ? '₹2,450' : timeframe === 'This Week' ? '₹9,450' : '₹44,800'}
            </Text>
            <View style={styles.growthBadge}>
              <Text style={styles.growthText}>↑ 18% vs previous period</Text>
            </View>
          </View>

          <View style={styles.walletGraphicBox}>
            <Text style={styles.walletEmoji}>👛</Text>
          </View>
        </TouchableOpacity>

        {/* ── Deliveries & Incentives Two-Col Row ── */}
        <View style={styles.twoColRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Deliveries</Text>
            <Text style={styles.metricValue}>24</Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Incentives</Text>
            <Text style={[styles.metricValue, { color: '#059669' }]}>₹1,250</Text>
          </View>
        </View>

        {/* ── Earnings Breakdown Card ── */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Earnings Breakdown</Text>

          <View style={styles.breakdownRow}>
            <Text style={styles.itemLabel}>Delivery Earnings</Text>
            <Text style={styles.itemValue}>₹7,200</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.itemLabel}>Incentives</Text>
            <Text style={styles.itemValue}>₹1,250</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.itemLabel}>Tips</Text>
            <Text style={styles.itemValue}>₹1,000</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.itemLabel}>Other Adjustments</Text>
            <Text style={styles.itemValue}>₹0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalPayoutRow}>
            <Text style={styles.totalPayoutLabel}>Total Payout</Text>
            <Text style={styles.totalPayoutValue}>₹9,450</Text>
          </View>
        </View>

        {/* ── Recent Payouts Card ── */}
        <View style={styles.payoutsCard}>
          <View style={styles.payoutHeaderRow}>
            <Text style={styles.breakdownTitle}>Recent Payouts</Text>
            <TouchableOpacity onPress={() => Alert.alert('All Payouts', 'Bank direct deposit history')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.payoutItem}>
            <View>
              <Text style={styles.payoutDate}>Payout on 30 May 2025</Text>
              <Text style={styles.payoutBank}>HDFC Bank • A/C 4892</Text>
            </View>
            <View style={styles.payoutRightCol}>
              <Text style={styles.payoutAmount}>₹6,250</Text>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>Paid</Text>
              </View>
            </View>
          </View>

          <View style={styles.payoutItem}>
            <View>
              <Text style={styles.payoutDate}>Payout on 23 May 2025</Text>
              <Text style={styles.payoutBank}>HDFC Bank • A/C 4892</Text>
            </View>
            <View style={styles.payoutRightCol}>
              <Text style={styles.payoutAmount}>₹5,100</Text>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>Paid</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Period Selector Picklist Modal ── */}
      <PicklistModal
        visible={showTimeframeModal}
        title="Select Earnings Period"
        subtitle="Filter payout statements and delivery stats"
        options={TIMEFRAME_OPTIONS}
        selectedValue={timeframe}
        onSelect={(val) => setTimeframe(val)}
        onClose={() => setShowTimeframeModal(false)}
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
  topBar: {
    paddingTop: topInset + 6,
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
  topBarTitle: {
    fontSize: typography.fontSizes.md + 2,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  timeframeBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeframeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  heroEarningsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  heroLabel: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
  },
  timeframePill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeframePillText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  heroAmount: {
    fontSize: typography.fontSizes.xxl + 4,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginVertical: 4,
  },
  growthBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  growthText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
  },
  walletGraphicBox: {
    width: 64,
    height: 64,
    borderRadius: radii.xl,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletEmoji: {
    fontSize: 34,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  metricLabel: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
  },
  metricValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginTop: 4,
  },
  breakdownCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm + 2,
    ...shadows.sm,
  },
  breakdownTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginBottom: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: typography.fontSizes.xs + 1,
    color: '#4B5563',
  },
  itemValue: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  totalPayoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  totalPayoutLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  totalPayoutValue: {
    fontSize: typography.fontSizes.md + 2,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  payoutsCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.md,
    ...shadows.sm,
  },
  payoutHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#EA580C',
  },
  payoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  payoutDate: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  payoutBank: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  payoutRightCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  payoutAmount: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  paidBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  paidText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
});
