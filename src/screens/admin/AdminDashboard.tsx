import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';

const STATS_DATA = [
  {
    id: 's_orders',
    title: 'Total Orders',
    value: '12,842',
    growth: '+18.6%',
    sub: 'vs Apr 1 – Apr 30',
    icon: '🛍️',
    bgIcon: '#EBF4FF',
    iconColor: '#2563EB',
  },
  {
    id: 's_gmv',
    title: 'Gross Sales (GMV)',
    value: '₹2.45 Cr',
    growth: '+22.4%',
    sub: 'vs Apr 1 – Apr 30',
    icon: '₹',
    bgIcon: '#ECFDF5',
    iconColor: '#059669',
  },
  {
    id: 's_customers',
    title: 'Total Customers',
    value: '8,732',
    growth: '+16.3%',
    sub: 'vs Apr 1 – Apr 30',
    icon: '👥',
    bgIcon: '#F3E8FF',
    iconColor: '#9333EA',
  },
  {
    id: 's_retailers',
    title: 'Total Retailers',
    value: '1,245',
    growth: '+12.7%',
    sub: 'vs Apr 1 – Apr 30',
    icon: '🏪',
    bgIcon: '#FFF7ED',
    iconColor: '#EA580C',
  },
  {
    id: 's_deliveries',
    title: 'Total Deliveries',
    value: '11,214',
    growth: '+15.1%',
    sub: 'vs Apr 1 – Apr 30',
    icon: '🚚',
    bgIcon: '#ECFEFF',
    iconColor: '#0891B2',
  },
];

const RECENT_ORDERS = [
  {
    id: 'BK-250531-00125',
    date: '31 May, 10:30 AM',
    customer: 'Ravi Kumar',
    status: 'Delivered',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    amount: '₹24,850',
    emoji: '🏗️',
    item: 'UltraTech Cement 50 Bags',
  },
  {
    id: 'BK-250531-00124',
    date: '31 May, 09:15 AM',
    customer: 'Suresh Builders',
    status: 'Out for Delivery',
    statusColor: '#7C3AED',
    statusBg: '#F5F3FF',
    amount: '₹18,650',
    emoji: '🔩',
    item: 'Tata Tiscon 12mm 50 Pcs',
  },
  {
    id: 'BK-250530-00123',
    date: '30 May, 06:45 PM',
    customer: 'Ankita Sharma',
    status: 'Processing',
    statusColor: '#2563EB',
    statusBg: '#EFF6FF',
    amount: '₹7,320',
    emoji: '🎨',
    item: 'Asian Paints Apex 20L',
  },
  {
    id: 'BK-250530-00122',
    date: '30 May, 05:20 PM',
    customer: 'Green Infra Pvt Ltd',
    status: 'Delivered',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    amount: '₹55,680',
    emoji: '🧱',
    item: 'Wirecut Red Bricks 2000 Pcs',
  },
  {
    id: 'BK-250530-00121',
    date: '30 May, 03:10 PM',
    customer: 'Vikram Contractor',
    status: 'Cancelled',
    statusColor: '#DC2626',
    statusBg: '#FEF2F2',
    amount: '₹5,420',
    emoji: '📦',
    item: 'Finolex PVC Pipes & Fittings',
  },
];

const STATUS_BREAKDOWN = [
  { label: 'Delivered', count: '6,784', pct: '52.8%', color: '#10B981' },
  { label: 'Processing', count: '2,328', pct: '18.1%', color: '#3B82F6' },
  { label: 'Shipped', count: '1,942', pct: '15.1%', color: '#F59E0B' },
  { label: 'Out for Delivery', count: '1,182', pct: '9.2%', color: '#8B5CF6' },
  { label: 'Cancelled', count: '606', pct: '4.7%', color: '#EF4444' },
];

export default function AdminDashboard() {
  const [salesTimeframe, setSalesTimeframe] = useState('Daily');

  return (
    <View style={styles.root}>
      {/* ── 1. Crimson Gradient Top Bar ── */}
      <LinearGradient
        colors={['#140202', '#8B0000', '#D32F2F', '#E53935']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientTopHeader}
      >
        <View style={styles.topLeft}>
          <TouchableOpacity
            style={styles.menuGlassBtn}
            onPress={() => Alert.alert('Menu', 'Admin system navigation')}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <View style={styles.logoBox}>
            <View style={styles.logoBag}>
              <Text style={styles.logoEmoji}>🏗️</Text>
            </View>
            <View>
              <Text style={styles.logoTitle}>
                Build<Text style={styles.logoTitleHighlight}>Kart</Text>
              </Text>
              <Text style={styles.logoSubtitle}>Building Better Together</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.notificationGlassBtn}
          onPress={() => Alert.alert('Notifications', '8 unread platform alerts')}
        >
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>8</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── 2. Greeting & Date Picker ── */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTitle}>Hello, Admin! 👋</Text>
            <Text style={styles.greetingSubtitle}>Here's what's happening with BuildKart today.</Text>
          </View>

          <TouchableOpacity
            style={styles.datePickerBtn}
            onPress={() => Alert.alert('Date Range', 'Filter platform statistics')}
          >
            <Text style={styles.calendarEmoji}>📅</Text>
            <Text style={styles.dateText}>31 May, 2025</Text>
          </TouchableOpacity>
        </View>

        {/* ── 3. Top Row Metrics (3 Cards) ── */}
        <View style={styles.threeCardsRow}>
          {STATS_DATA.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.metricCardMini}>
              <View style={[styles.metricIconCircle, { backgroundColor: item.bgIcon }]}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
              </View>
              <Text style={styles.metricLabel}>{item.title}</Text>
              <Text style={styles.metricValue}>{item.value}</Text>
              <View style={styles.growthRow}>
                <Text style={styles.growthGreen}>↑ {item.growth.replace('+', '')}</Text>
              </View>
              <Text style={styles.metricSub}>{item.sub}</Text>
            </View>
          ))}
        </View>

        {/* ── 4. Second Row Metrics (2 Cards) ── */}
        <View style={styles.twoCardsRow}>
          {STATS_DATA.slice(3, 5).map((item) => (
            <View key={item.id} style={styles.metricCardWide}>
              <View style={styles.wideCardTop}>
                <View style={[styles.metricIconCircle, { backgroundColor: item.bgIcon }]}>
                  <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={styles.metricLabel}>{item.title}</Text>
                  <Text style={styles.metricValue}>{item.value}</Text>
                </View>
              </View>
              <View style={styles.wideCardBottom}>
                <Text style={styles.growthGreen}>↑ {item.growth.replace('+', '')}</Text>
                <Text style={styles.metricSub}>{item.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── 5. Sales Overview Chart Card ── */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Sales Overview</Text>
              <Text style={styles.chartSubLabel}>Total Sales (GMV)</Text>
              <View style={styles.chartGmvRow}>
                <Text style={styles.chartGmvValue}>₹2.45 Cr</Text>
                <View style={styles.growthPill}>
                  <Text style={styles.growthPillText}>↑ 22.4%</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.timeframeDropdown}
              onPress={() =>
                setSalesTimeframe(salesTimeframe === 'Daily' ? 'Weekly' : salesTimeframe === 'Weekly' ? 'Monthly' : 'Daily')
              }
            >
              <Text style={styles.timeframeText}>{salesTimeframe} ▾</Text>
            </TouchableOpacity>
          </View>

          {/* Line Chart */}
          <View style={styles.graphContainer}>
            <View style={styles.graphTooltip}>
              <Text style={styles.tooltipDate}>16 May 2025</Text>
              <Text style={styles.tooltipAmount}>₹14.6L</Text>
            </View>

            <View style={styles.waveGraphicBox}>
              <View style={styles.graphGridLine} />
              <View style={[styles.graphGridLine, { top: '35%' }]} />
              <View style={[styles.graphGridLine, { top: '70%' }]} />

              <View style={styles.graphCurve}>
                <View style={[styles.wavePoint, { left: '10%', bottom: '25%' }]} />
                <View style={[styles.wavePoint, { left: '25%', bottom: '55%' }]} />
                <View style={[styles.wavePoint, { left: '40%', bottom: '48%' }]} />
                <View style={[styles.wavePointActive, { left: '55%', bottom: '72%' }]} />
                <View style={[styles.wavePoint, { left: '70%', bottom: '50%' }]} />
                <View style={[styles.wavePoint, { left: '85%', bottom: '65%' }]} />
              </View>

              <View style={styles.yAxisLabels}>
                <Text style={styles.axisText}>₹20L</Text>
                <Text style={styles.axisText}>₹15L</Text>
                <Text style={styles.axisText}>₹10L</Text>
                <Text style={styles.axisText}>₹5L</Text>
                <Text style={styles.axisText}>₹0</Text>
              </View>
            </View>

            <View style={styles.xAxisRow}>
              <Text style={styles.axisText}>1 May</Text>
              <Text style={styles.axisText}>11 May</Text>
              <Text style={styles.axisText}>21 May</Text>
              <Text style={styles.axisText}>31 May</Text>
            </View>
          </View>
        </View>

        {/* ── 6. Orders by Status (Donut Chart & Breakdown) ── */}
        <View style={styles.donutCard}>
          <Text style={styles.cardSectionHeader}>Orders by Status</Text>

          <View style={styles.donutRingWrapper}>
            <View style={styles.donutRingOuter}>
              <View style={styles.donutRingInner}>
                <Text style={styles.donutCenterValue}>12,842</Text>
                <Text style={styles.donutCenterLabel}>Total Orders</Text>
              </View>
            </View>
          </View>

          <View style={styles.breakdownList}>
            {STATUS_BREAKDOWN.map((item) => (
              <View key={item.label} style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <View style={[styles.statusColorDot, { backgroundColor: item.color }]} />
                  <Text style={styles.statusLabelText}>{item.label}</Text>
                </View>
                <Text style={styles.statusCountText}>
                  {item.count} <Text style={styles.statusPctText}>({item.pct})</Text>
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.viewReportBtn}
            onPress={() => Alert.alert('Report', 'Downloading nationwide logistics & GMV report')}
          >
            <Text style={styles.viewReportText}>View full report →</Text>
          </TouchableOpacity>
        </View>

        {/* ── 7. Recent Orders ── */}
        <View style={styles.ordersSectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.cardSectionHeader}>Recent Orders</Text>
            <TouchableOpacity onPress={() => Alert.alert('All Orders', 'Viewing all recent orders')}>
              <Text style={styles.viewAllLink}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentOrdersList}>
            {RECENT_ORDERS.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderItemCard}
                onPress={() => Alert.alert(order.id, `${order.item} • ${order.amount}`)}
                activeOpacity={0.8}
              >
                <View style={styles.orderThumbBox}>
                  <Text style={styles.orderEmoji}>{order.emoji}</Text>
                </View>

                <View style={styles.orderMainCol}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderMeta}>
                    {order.date} • <Text style={styles.orderCustomer}>{order.customer}</Text>
                  </Text>
                </View>

                <View style={styles.orderRightCol}>
                  <View style={[styles.statusPill, { backgroundColor: order.statusBg }]}>
                    <Text style={[styles.statusPillText, { color: order.statusColor }]}>
                      {order.status}
                    </Text>
                  </View>
                  <Text style={styles.orderAmount}>{order.amount}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 8. Bottom Grids ── */}
        <View style={styles.bottomGridsRow}>
          <View style={styles.halfCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.halfCardTitle}>Top Selling Categories</Text>
              <TouchableOpacity onPress={() => Alert.alert('Categories', 'Category sales volume')}>
                <Text style={styles.viewAllLinkSmall}>View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categoryItem}>
              <View style={styles.catIconCircle}>
                <Text style={styles.catEmoji}>🏗️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.catNameRow}>
                  <Text style={styles.catName}>Cement</Text>
                  <Text style={styles.catSales}>₹68.2L</Text>
                </View>
                <View style={styles.catProgressTrack}>
                  <View style={[styles.catProgressBar, { width: '68%', backgroundColor: '#2563EB' }]} />
                </View>
                <Text style={styles.catPct}>27.8%</Text>
              </View>
            </View>

            <View style={[styles.categoryItem, { marginTop: spacing.sm }]}>
              <View style={styles.catIconCircle}>
                <Text style={styles.catEmoji}>🔩</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.catNameRow}>
                  <Text style={styles.catName}>Steel</Text>
                  <Text style={styles.catSales}>₹54.6L</Text>
                </View>
                <View style={styles.catProgressTrack}>
                  <View style={[styles.catProgressBar, { width: '54%', backgroundColor: '#2563EB' }]} />
                </View>
                <Text style={styles.catPct}>22.3%</Text>
              </View>
            </View>
          </View>

          <View style={styles.halfCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.halfCardTitle}>Alerts & Notifications</Text>
              <TouchableOpacity onPress={() => Alert.alert('Alerts', 'Critical platform alerts')}>
                <Text style={styles.viewAllLinkSmall}>View all</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.alertItem}
              onPress={() => Alert.alert('Low Stock Alert', '134 products running low across depots')}
            >
              <View style={[styles.alertIconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Text style={{ fontSize: 14 }}>⚠️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertText}>Low stock alert for 134 products</Text>
                <Text style={styles.alertTime}>10m ago</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.alertItem, { marginTop: spacing.sm }]}
              onPress={() => Alert.alert('Retailer Registrations', '12 new KYC documents pending approval')}
            >
              <View style={[styles.alertIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Text style={{ fontSize: 14 }}>🔔</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertText}>12 new retailer registration requests</Text>
                <Text style={styles.alertTime}>1h ago</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 110 }} />
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
  gradientTopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: topInset + 6,
    paddingBottom: spacing.sm + 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    ...shadows.md,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  menuGlassBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  logoBag: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoEmoji: {
    fontSize: 18,
  },
  logoTitle: {
    fontSize: typography.fontSizes.md + 1,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    letterSpacing: -0.3,
  },
  logoTitleHighlight: {
    color: '#FFCC00',
  },
  logoSubtitle: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: typography.weights.medium,
  },
  notificationGlassBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 18,
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFCC00',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#111',
  },
  notifBadgeText: {
    color: '#111',
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  greetingTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  greetingSubtitle: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    marginTop: 2,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 7,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    ...shadows.sm,
  },
  calendarEmoji: {
    fontSize: 13,
  },
  dateText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  threeCardsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricCardMini: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...shadows.sm,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: typography.weights.semibold,
  },
  metricValue: {
    fontSize: typography.fontSizes.md + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginTop: 2,
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  growthGreen: {
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
    color: '#059669',
  },
  metricSub: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
  },
  twoCardsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricCardWide: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...shadows.sm,
  },
  wideCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wideCardBottom: {
    marginTop: spacing.xs,
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...shadows.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chartTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  chartSubLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  chartGmvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  chartGmvValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  growthPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  growthPillText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
  },
  timeframeDropdown: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeframeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
  },
  graphContainer: {
    marginTop: spacing.md,
    height: 180,
    position: 'relative',
  },
  graphTooltip: {
    position: 'absolute',
    top: 10,
    left: '42%',
    backgroundColor: '#111827',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radii.sm,
    alignItems: 'center',
    zIndex: 10,
    ...shadows.md,
  },
  tooltipDate: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: typography.weights.medium,
  },
  tooltipAmount: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
  },
  waveGraphicBox: {
    flex: 1,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  graphGridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  graphCurve: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  wavePoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  wavePointActive: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: colors.white,
    ...shadows.md,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  axisText: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: typography.weights.medium,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingLeft: spacing.md,
  },
  donutCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...shadows.sm,
  },
  cardSectionHeader: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  donutRingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  donutRingOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 16,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: '#3B82F6',
    borderRightColor: '#F59E0B',
    borderBottomColor: '#8B5CF6',
  },
  donutRingInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  donutCenterLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: typography.weights.semibold,
  },
  breakdownList: {
    gap: spacing.xs + 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabelText: {
    fontSize: typography.fontSizes.xs,
    color: '#4B5563',
    fontWeight: typography.weights.medium,
  },
  statusCountText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  statusPctText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: typography.weights.medium,
  },
  viewReportBtn: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
  viewReportText: {
    color: '#2563EB',
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  ordersSectionCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...shadows.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  viewAllLink: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#2563EB',
  },
  recentOrdersList: {
    gap: spacing.sm,
  },
  orderItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  orderThumbBox: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orderEmoji: {
    fontSize: 22,
  },
  orderMainCol: {
    flex: 1,
  },
  orderId: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  orderMeta: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  orderCustomer: {
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  orderRightCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  orderAmount: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  bottomGridsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...shadows.sm,
  },
  halfCardTitle: {
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  viewAllLinkSmall: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#2563EB',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  catIconCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEmoji: {
    fontSize: 16,
  },
  catNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catName: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#1F2937',
  },
  catSales: {
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  catProgressTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  catProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  catPct: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  alertIconCircle: {
    width: 30,
    height: 30,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    fontSize: 10,
    fontWeight: typography.weights.semibold,
    color: '#1F2937',
    lineHeight: 14,
  },
  alertTime: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 1,
  },
});
