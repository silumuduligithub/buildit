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
import GradientAppHeader from '../../components/GradientAppHeader';

const TIMEFRAMES = ['7 Days', '30 Days', '3 Months', 'This Year'];

const TOP_MATERIALS = [
  { name: 'UltraTech Cement OPC 53 Grade', qty: '4,280 Bags', revenue: '₹17.55 L', growth: '+24%' },
  { name: 'Tata Tiscon 550D TMT 12mm', qty: '12.4 Tonnes', revenue: '₹8.43 L', growth: '+18%' },
  { name: 'Red Wirecut Masonry Bricks', qty: '84,000 Pcs', revenue: '₹4.87 L', growth: '+12%' },
  { name: 'Asian Paints Apex 20L', qty: '140 Buckets', revenue: '₹2.88 L', growth: '+9%' },
  { name: 'M-Sand River Equivalent', qty: '65 Tonnes', revenue: '₹1.88 L', growth: '+15%' },
];

export default function RetailerAnalytics({ navigation }: any) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30 Days');

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Store Analytics"
        subtitle="Revenue performance, top products & fulfillment trends"
        showBack={false}
        rightIcon="📥"
        onRightPress={() => Alert.alert('Export Report', 'Monthly GST sales ledger exported as Excel.')}
      />

      {/* Timeframe Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.timeframeScroll}
        contentContainerStyle={styles.timeframeContent}
      >
        {TIMEFRAMES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.timeChip, selectedTimeframe === t && styles.timeChipActive]}
            onPress={() => setSelectedTimeframe(t)}
          >
            <Text style={[styles.timeText, selectedTimeframe === t && styles.timeTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Sales Performance Card */}
        <View style={styles.kpiCard}>
          <Text style={styles.cardHeader}>TOTAL REVENUE (GMV)</Text>
          <View style={styles.revenueRow}>
            <Text style={styles.revenueValue}>₹35.61 Lakh</Text>
            <View style={styles.growthPill}>
              <Text style={styles.growthText}>↑ 22.4% vs last period</Text>
            </View>
          </View>
          <Text style={styles.revenueSub}>148 Orders fulfilled • ₹24,060 Avg Order Value</Text>
        </View>

        {/* Visual Sales Curve Simulation */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Weekly Sales Trend</Text>
          <View style={styles.chartGraph}>
            <View style={styles.chartBarCol}>
              <View style={[styles.chartBar, { height: '45%' }]} />
              <Text style={styles.barLabel}>W1</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.chartBar, { height: '65%' }]} />
              <Text style={styles.barLabel}>W2</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.chartBar, { height: '55%' }]} />
              <Text style={styles.barLabel}>W3</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.chartBarActive, { height: '90%' }]} />
              <Text style={[styles.barLabel, { fontWeight: 'bold', color: colors.primary }]}>W4</Text>
            </View>
          </View>
        </View>

        {/* Top-Selling Construction Materials */}
        <View style={styles.topProductsCard}>
          <Text style={styles.sectionTitle}>Top-Selling Materials</Text>

          {TOP_MATERIALS.map((item, idx) => (
            <View key={item.name} style={styles.productRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankNumber}>#{idx + 1}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productQty}>{item.qty} sold</Text>
              </View>

              <View style={styles.productRevCol}>
                <Text style={styles.productRevText}>{item.revenue}</Text>
                <Text style={styles.productGrowthText}>{item.growth}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Store Quality Metrics */}
        <View style={styles.qualityCard}>
          <Text style={styles.sectionTitle}>Store Performance Rating</Text>
          <View style={styles.qualityGrid}>
            <View style={styles.qualityBox}>
              <Text style={styles.qualityScore}>4.8 ⭐</Text>
              <Text style={styles.qualityLabel}>Customer Rating</Text>
            </View>
            <View style={styles.qualityBox}>
              <Text style={styles.qualityScore}>98.2%</Text>
              <Text style={styles.qualityLabel}>On-Time Fulfillment</Text>
            </View>
            <View style={styles.qualityBox}>
              <Text style={styles.qualityScore}>0.4%</Text>
              <Text style={styles.qualityLabel}>Cancellation Rate</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  timeframeScroll: {
    flexGrow: 0,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  timeframeContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  timeChip: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: 9,
    borderRadius: radii.full,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeText: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  timeTextActive: {
    color: colors.white,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  kpiCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  cardHeader: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  revenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  revenueValue: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  growthPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.xs,
  },
  growthText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
  },
  revenueSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginBottom: spacing.sm,
  },
  chartGraph: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
  },
  chartBarCol: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: 36,
  },
  chartBar: {
    width: 28,
    backgroundColor: '#93C5FD',
    borderRadius: radii.sm,
  },
  chartBarActive: {
    width: 28,
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
  },
  barLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 6,
  },
  topProductsCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rankNumber: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#4B5563',
  },
  productName: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  productQty: {
    fontSize: 10,
    color: '#6B7280',
  },
  productRevCol: {
    alignItems: 'flex-end',
  },
  productRevText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  productGrowthText: {
    fontSize: 9,
    color: '#059669',
    fontWeight: typography.weights.bold,
  },
  qualityCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  qualityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qualityBox: {
    alignItems: 'center',
    flex: 1,
  },
  qualityScore: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  qualityLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
});
