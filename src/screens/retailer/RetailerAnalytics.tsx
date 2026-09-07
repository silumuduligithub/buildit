import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Platform,
} from 'react-native';
import {
  BarChart3,
  ShoppingBag,
  Package,
  Calendar,
  Search,
  Camera,
  ChevronDown,
  ChevronRight,
  Target,
  FileText,
  Layers,
  Award,
  Store,
  X,
  TrendingUp,
  Check,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import { showFlashMessage } from '../../components/ui/FlashMessage';

const TIMEFRAMES = ['7 Days', '30 Days', '3 Months', 'This Year', 'Custom 📅'];

interface AnalyticsDataPoint {
  label: string;
  revenueLakh: number;
  orders: number;
}

interface TimeframeData {
  gmv: string;
  gmvGrowth: string;
  orders: string;
  ordersGrowth: string;
  aov: string;
  aovGrowth: string;
  topCatName: string;
  topCatPct: number;
  fastestCatName: string;
  fastestCatGrowth: string;
  maxRevenueLakh: number;
  maxOrders: number;
  chartPoints: AnalyticsDataPoint[];
  materials: {
    rank: number;
    name: string;
    category: string;
    unit: string;
    image: string;
    unitsSold: string;
    revenue: string;
    growth: string;
  }[];
}

const TIMEFRAME_DATA_MAP: Record<string, TimeframeData> = {
  '7 Days': {
    gmv: '₹8.42 Lakh',
    gmvGrowth: '↑ 14.2%',
    orders: '38',
    ordersGrowth: '↑ 11.5%',
    aov: '₹22,150',
    aovGrowth: '↑ 8.4%',
    topCatName: 'Cement',
    topCatPct: 46,
    fastestCatName: 'Paints & Coatings',
    fastestCatGrowth: '↑ 42%',
    maxRevenueLakh: 2.5,
    maxOrders: 15,
    chartPoints: [
      { label: 'Sep 15', revenueLakh: 1.15, orders: 5 },
      { label: 'Sep 16', revenueLakh: 0.95, orders: 4 },
      { label: 'Sep 17', revenueLakh: 1.85, orders: 8 },
      { label: 'Sep 18', revenueLakh: 1.20, orders: 6 },
      { label: 'Sep 19', revenueLakh: 1.05, orders: 5 },
      { label: 'Sep 20', revenueLakh: 1.40, orders: 7 },
      { label: 'Sep 21', revenueLakh: 2.10, orders: 9 },
    ],
    materials: [
      {
        rank: 1,
        name: 'UltraTech Cement OPC 53 Grade',
        category: 'Cement',
        unit: '50 Kg Bag',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop&q=80',
        unitsSold: '1,050',
        revenue: '₹4.30 L',
        growth: '↑ 16%',
      },
      {
        rank: 2,
        name: 'Tata Tiscon 550D TMT 12mm',
        category: 'Steel',
        unit: '12 mm',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=200&auto=format&fit=crop&q=80',
        unitsSold: '3.1 T',
        revenue: '₹2.10 L',
        growth: '↑ 12%',
      },
      {
        rank: 3,
        name: 'Red Wirecut Masonry Bricks',
        category: 'Bricks',
        unit: 'Standard',
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=200&auto=format&fit=crop&q=80',
        unitsSold: '22,000',
        revenue: '₹1.25 L',
        growth: '↑ 9%',
      },
      {
        rank: 4,
        name: 'Asian Paints Apex 20L',
        category: 'Paints',
        unit: '20 L',
        image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&auto=format&fit=crop&q=80',
        unitsSold: '35',
        revenue: '₹72,000',
        growth: '↑ 18%',
      },
      {
        rank: 5,
        name: 'M-Sand River Equivalent',
        category: 'Sand',
        unit: 'Per Tonne',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80',
        unitsSold: '18 T',
        revenue: '₹54,000',
        growth: '↑ 11%',
      },
    ],
  },
  '30 Days': {
    gmv: '₹35.61 Lakh',
    gmvGrowth: '↑ 22.4%',
    orders: '148',
    ordersGrowth: '↑ 18.2%',
    aov: '₹24,060',
    aovGrowth: '↑ 12.6%',
    topCatName: 'Cement',
    topCatPct: 42,
    fastestCatName: 'Paints & Coatings',
    fastestCatGrowth: '↑ 38%',
    maxRevenueLakh: 4.0,
    maxOrders: 50,
    chartPoints: [
      { label: 'Aug 25', revenueLakh: 1.1, orders: 15 },
      { label: 'Aug 27', revenueLakh: 1.4, orders: 18 },
      { label: 'Aug 29', revenueLakh: 1.2, orders: 16 },
      { label: 'Aug 31', revenueLakh: 1.8, orders: 22 },
      { label: 'Sep 2', revenueLakh: 1.3, orders: 19 },
      { label: 'Sep 4', revenueLakh: 1.5, orders: 20 },
      { label: 'Sep 6', revenueLakh: 1.7, orders: 23 },
      { label: 'Sep 8', revenueLakh: 1.4, orders: 21 },
      { label: 'Sep 10', revenueLakh: 2.4, orders: 29 },
      { label: 'Sep 12', revenueLakh: 2.1, orders: 28 },
      { label: 'Sep 14', revenueLakh: 2.6, orders: 34 },
      { label: 'Sep 16', revenueLakh: 2.8, orders: 36 },
      { label: 'Sep 18', revenueLakh: 3.24, orders: 42 },
      { label: 'Sep 21', revenueLakh: 3.45, orders: 46 },
    ],
    materials: [
      {
        rank: 1,
        name: 'UltraTech Cement OPC 53 Grade',
        category: 'Cement',
        unit: '50 Kg Bag',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop&q=80',
        unitsSold: '4,280',
        revenue: '₹17.55 L',
        growth: '↑ 24%',
      },
      {
        rank: 2,
        name: 'Tata Tiscon 550D TMT 12mm',
        category: 'Steel',
        unit: '12 mm',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=200&auto=format&fit=crop&q=80',
        unitsSold: '12.4 T',
        revenue: '₹8.43 L',
        growth: '↑ 18%',
      },
      {
        rank: 3,
        name: 'Red Wirecut Masonry Bricks',
        category: 'Bricks',
        unit: 'Standard',
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=200&auto=format&fit=crop&q=80',
        unitsSold: '84,000',
        revenue: '₹4.87 L',
        growth: '↑ 12%',
      },
      {
        rank: 4,
        name: 'Asian Paints Apex 20L',
        category: 'Paints',
        unit: '20 L',
        image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&auto=format&fit=crop&q=80',
        unitsSold: '140',
        revenue: '₹2.88 L',
        growth: '↑ 9%',
      },
      {
        rank: 5,
        name: 'M-Sand River Equivalent',
        category: 'Sand',
        unit: 'Per Tonne',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80',
        unitsSold: '65 T',
        revenue: '₹1.96 L',
        growth: '↑ 15%',
      },
    ],
  },
  '3 Months': {
    gmv: '₹1.08 Crore',
    gmvGrowth: '↑ 28.6%',
    orders: '445',
    ordersGrowth: '↑ 24.1%',
    aov: '₹24,270',
    aovGrowth: '↑ 15.3%',
    topCatName: 'Steel & Rebar',
    topCatPct: 39,
    fastestCatName: 'Structural Materials',
    fastestCatGrowth: '↑ 31%',
    maxRevenueLakh: 12.0,
    maxOrders: 60,
    chartPoints: [
      { label: 'W1', revenueLakh: 6.8, orders: 28 },
      { label: 'W2', revenueLakh: 7.4, orders: 31 },
      { label: 'W3', revenueLakh: 8.2, orders: 34 },
      { label: 'W4', revenueLakh: 7.9, orders: 33 },
      { label: 'W5', revenueLakh: 9.1, orders: 38 },
      { label: 'W6', revenueLakh: 8.7, orders: 36 },
      { label: 'W7', revenueLakh: 10.4, orders: 42 },
      { label: 'W8', revenueLakh: 9.8, orders: 40 },
      { label: 'W9', revenueLakh: 11.2, orders: 47 },
      { label: 'W10', revenueLakh: 10.9, orders: 45 },
      { label: 'W11', revenueLakh: 11.8, orders: 49 },
      { label: 'W12', revenueLakh: 12.5, orders: 52 },
    ],
    materials: [
      {
        rank: 1,
        name: 'UltraTech Cement OPC 53 Grade',
        category: 'Cement',
        unit: '50 Kg Bag',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop&q=80',
        unitsSold: '13,200',
        revenue: '₹54.12 L',
        growth: '↑ 29%',
      },
      {
        rank: 2,
        name: 'Tata Tiscon 550D TMT 12mm',
        category: 'Steel',
        unit: '12 mm',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=200&auto=format&fit=crop&q=80',
        unitsSold: '38.5 T',
        revenue: '₹26.18 L',
        growth: '↑ 22%',
      },
      {
        rank: 3,
        name: 'Red Wirecut Masonry Bricks',
        category: 'Bricks',
        unit: 'Standard',
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=200&auto=format&fit=crop&q=80',
        unitsSold: '260,000',
        revenue: '₹14.30 L',
        growth: '↑ 17%',
      },
      {
        rank: 4,
        name: 'Asian Paints Apex 20L',
        category: 'Paints',
        unit: '20 L',
        image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&auto=format&fit=crop&q=80',
        unitsSold: '450',
        revenue: '₹9.20 L',
        growth: '↑ 14%',
      },
      {
        rank: 5,
        name: 'M-Sand River Equivalent',
        category: 'Sand',
        unit: 'Per Tonne',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80',
        unitsSold: '210 T',
        revenue: '₹6.30 L',
        growth: '↑ 19%',
      },
    ],
  },
  'This Year': {
    gmv: '₹4.25 Crore',
    gmvGrowth: '↑ 34.2%',
    orders: '1,780',
    ordersGrowth: '↑ 31.0%',
    aov: '₹23,875',
    aovGrowth: '↑ 16.8%',
    topCatName: 'Cement & Concrete',
    topCatPct: 44,
    fastestCatName: 'Finishing & Paints',
    fastestCatGrowth: '↑ 45%',
    maxRevenueLakh: 50.0,
    maxOrders: 200,
    chartPoints: [
      { label: 'Jan', revenueLakh: 26.5, orders: 110 },
      { label: 'Feb', revenueLakh: 28.2, orders: 118 },
      { label: 'Mar', revenueLakh: 34.1, orders: 142 },
      { label: 'Apr', revenueLakh: 36.8, orders: 154 },
      { label: 'May', revenueLakh: 39.4, orders: 165 },
      { label: 'Jun', revenueLakh: 42.0, orders: 176 },
      { label: 'Jul', revenueLakh: 44.5, orders: 185 },
      { label: 'Aug', revenueLakh: 47.2, orders: 198 },
      { label: 'Sep', revenueLakh: 51.0, orders: 212 },
    ],
    materials: [
      {
        rank: 1,
        name: 'UltraTech Cement OPC 53 Grade',
        category: 'Cement',
        unit: '50 Kg Bag',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop&q=80',
        unitsSold: '54,000',
        revenue: '₹2.21 Cr',
        growth: '↑ 36%',
      },
      {
        rank: 2,
        name: 'Tata Tiscon 550D TMT 12mm',
        category: 'Steel',
        unit: '12 mm',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=200&auto=format&fit=crop&q=80',
        unitsSold: '155 T',
        revenue: '₹1.05 Cr',
        growth: '↑ 28%',
      },
      {
        rank: 3,
        name: 'Red Wirecut Masonry Bricks',
        category: 'Bricks',
        unit: 'Standard',
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=200&auto=format&fit=crop&q=80',
        unitsSold: '1,050,000',
        revenue: '₹57.8 L',
        growth: '↑ 21%',
      },
      {
        rank: 4,
        name: 'Asian Paints Apex 20L',
        category: 'Paints',
        unit: '20 L',
        image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&auto=format&fit=crop&q=80',
        unitsSold: '1,800',
        revenue: '₹36.9 L',
        growth: '↑ 19%',
      },
      {
        rank: 5,
        name: 'M-Sand River Equivalent',
        category: 'Sand',
        unit: 'Per Tonne',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80',
        unitsSold: '850 T',
        revenue: '₹25.5 L',
        growth: '↑ 24%',
      },
    ],
  },
};

export default function RetailerAnalytics({ navigation }: any) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30 Days');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders'>('revenue');
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const [showStorePicker, setShowStorePicker] = useState(false);
  const [selectedStore, setSelectedStore] = useState('All Stores');
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [targetAmount, setTargetAmount] = useState('45.00');

  const { retailers, setActiveRetailer } = useAppStore();

  // Resolve current active data for the selected timeframe
  const currentDataKey = selectedTimeframe === 'Custom 📅' ? '30 Days' : selectedTimeframe;
  const currentData = TIMEFRAME_DATA_MAP[currentDataKey] || TIMEFRAME_DATA_MAP['30 Days'];

  // Filter materials by search query
  const filteredMaterials = useMemo(() => {
    if (!searchQuery.trim()) return currentData.materials;
    const q = searchQuery.toLowerCase();
    return currentData.materials.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.unit.toLowerCase().includes(q)
    );
  }, [searchQuery, currentData]);

  // Selected bar detail
  const activePoint =
    selectedBarIndex !== null && currentData.chartPoints[selectedBarIndex]
      ? currentData.chartPoints[selectedBarIndex]
      : currentData.chartPoints[currentData.chartPoints.length - 1];

  const handleDownloadReport = () => {
    showFlashMessage({
      type: 'success',
      message: `${selectedTimeframe} GST Analytics & Sales Report exported as PDF.`,
    });
  };

  const handleSaveTarget = () => {
    setTargetModalVisible(false);
    showFlashMessage({
      type: 'success',
      message: `Monthly sales target set to ₹${targetAmount} Lakh!`,
    });
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header with Store Dropdown ── */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#C2410C', '#EA580C', '#1E293B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Top Title & Store Dropdown Row */}
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>Store Analytics</Text>
              <Text style={styles.headerSubtitle}>Insights that help your business grow</Text>
            </View>

            {/* Store Dropdown Button */}
            <TouchableOpacity
              style={styles.storeDropdownBtn}
              onPress={() => setShowStorePicker(true)}
              activeOpacity={0.85}
            >
              <Store size={14} color="#FFEDD5" />
              <Text style={styles.storeDropdownText} numberOfLines={1}>
                {selectedStore}
              </Text>
              <ChevronDown size={14} color="#FFEDD5" />
            </TouchableOpacity>
          </View>

          {/* Search Bar with Camera Scan Icon */}
          <View style={styles.headerSearchWrap}>
            <Search size={16} color="#9CA3AF" />
            <TextInput
              style={styles.headerSearchInput}
              placeholder="Search products, brands or categories..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              onPress={() =>
                showFlashMessage({
                  type: 'info',
                  message: 'Material / SKU Barcode Scanner ready',
                })
              }
            >
              <Camera size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── 1. Date Range Filter Pills ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeframeScroll}
          contentContainerStyle={styles.timeframeContent}
        >
          {TIMEFRAMES.map((t) => {
            const isSelected = selectedTimeframe === t;
            return (
              <TouchableOpacity
                key={t}
                style={[
                  styles.timeframeChip,
                  isSelected ? styles.timeframeChipActive : styles.timeframeChipInactive,
                ]}
                onPress={() => {
                  setSelectedTimeframe(t);
                  setSelectedBarIndex(null);
                  showFlashMessage({
                    type: 'info',
                    message: `Filtered analytics for ${t}`,
                  });
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.timeframeText,
                    isSelected ? styles.timeframeTextActive : styles.timeframeTextInactive,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── 2. Top 3 KPI Metric Cards ── */}
        <View style={styles.kpiRow}>
          {/* Card 1: Total Revenue (GMV) */}
          <View style={[styles.kpiCard, { backgroundColor: '#FFF7ED', borderColor: '#FFEDD5' }]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#FFEDD5' }]}>
              <BarChart3 size={18} color={colors.primary} />
            </View>
            <Text style={styles.kpiLabel}>Total Revenue (GMV)</Text>
            <Text style={styles.kpiValue}>{currentData.gmv}</Text>
            <View style={styles.kpiGrowthRow}>
              <Text style={styles.kpiGrowthText}>{currentData.gmvGrowth}</Text>
              <Text style={styles.kpiGrowthSub}>vs last period</Text>
            </View>
          </View>

          {/* Card 2: Total Orders */}
          <View style={[styles.kpiCard, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#DBEAFE' }]}>
              <ShoppingBag size={18} color="#2563EB" />
            </View>
            <Text style={styles.kpiLabel}>Total Orders</Text>
            <Text style={styles.kpiValue}>{currentData.orders}</Text>
            <View style={styles.kpiGrowthRow}>
              <Text style={styles.kpiGrowthText}>{currentData.ordersGrowth}</Text>
              <Text style={styles.kpiGrowthSub}>vs last period</Text>
            </View>
          </View>

          {/* Card 3: Avg. Order Value */}
          <View style={[styles.kpiCard, { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' }]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#D1FAE5' }]}>
              <Package size={18} color="#059669" />
            </View>
            <Text style={styles.kpiLabel}>Avg. Order Value</Text>
            <Text style={styles.kpiValue}>{currentData.aov}</Text>
            <View style={styles.kpiGrowthRow}>
              <Text style={styles.kpiGrowthText}>{currentData.aovGrowth}</Text>
              <Text style={styles.kpiGrowthSub}>vs last period</Text>
            </View>
          </View>
        </View>

        {/* ── 3. Revenue Trend Interactive Chart Card ── */}
        <View style={styles.chartCard}>
          {/* Card Header */}
          <View style={styles.chartCardHeader}>
            <View style={styles.chartTitleGroup}>
              <View style={styles.chartIconBadge}>
                <TrendingUp size={16} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.chartTitle}>Revenue Trend</Text>
                <Text style={styles.chartSubtitle}>
                  {selectedTimeframe} revenue and order performance
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.chartMetricSelector}
              onPress={() =>
                setSelectedMetric((prev) => (prev === 'revenue' ? 'orders' : 'revenue'))
              }
              activeOpacity={0.8}
            >
              <Text style={styles.chartMetricSelectorText}>
                {selectedMetric === 'revenue' ? 'Revenue (₹)' : 'Orders'}
              </Text>
              <ChevronDown size={12} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Active Highlight Banner */}
          {activePoint && (
            <View style={styles.activePointBanner}>
              <Text style={styles.activePointDate}>📍 {activePoint.label}:</Text>
              <Text style={styles.activePointRevenue}>
                ₹{activePoint.revenueLakh >= 10 ? `${activePoint.revenueLakh.toFixed(1)} Lakh` : `₹${activePoint.revenueLakh.toFixed(2)} Lakh`}
              </Text>
              <Text style={styles.activePointDot}>•</Text>
              <Text style={styles.activePointOrders}>{activePoint.orders} Orders</Text>
            </View>
          )}

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EA580C' }]} />
              <Text style={styles.legendText}>Revenue (₹)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.legendText}>Orders</Text>
            </View>
          </View>

          {/* Visual Dual-Axis Graph Container */}
          <View style={styles.graphWrapper}>
            {/* Left Y-Axis (Revenue Scale) */}
            <View style={styles.leftYAxis}>
              <Text style={styles.axisLabel}>{currentData.maxRevenueLakh}L</Text>
              <Text style={styles.axisLabel}>{(currentData.maxRevenueLakh * 0.75).toFixed(1)}L</Text>
              <Text style={styles.axisLabel}>{(currentData.maxRevenueLakh * 0.5).toFixed(1)}L</Text>
              <Text style={styles.axisLabel}>{(currentData.maxRevenueLakh * 0.25).toFixed(1)}L</Text>
              <Text style={styles.axisLabel}>0</Text>
            </View>

            {/* Main Bars + Line Canvas */}
            <View style={styles.chartCanvasArea}>
              {/* Background horizontal grid lines */}
              <View style={styles.gridLinesContainer}>
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
              </View>

              {/* Bars Row */}
              <View style={styles.barsFlexRow}>
                {currentData.chartPoints.map((item, index) => {
                  const isSelected =
                    selectedBarIndex === index ||
                    (selectedBarIndex === null && index === currentData.chartPoints.length - 1);

                  // Normalized height for revenue bar (max 130px)
                  const barHeight = Math.min(
                    130,
                    Math.max(14, (item.revenueLakh / currentData.maxRevenueLakh) * 130)
                  );

                  // Normalized top position for blue order node dot (max 125px)
                  const lineTop =
                    130 - Math.min(125, (item.orders / currentData.maxOrders) * 125);

                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.barColumn}
                      onPress={() => setSelectedBarIndex(index)}
                      activeOpacity={0.75}
                    >
                      {/* Order Point (Blue Dot) */}
                      <View
                        style={[
                          styles.lineNodeDot,
                          { top: Math.max(0, lineTop) },
                          isSelected && styles.lineNodeDotSelected,
                        ]}
                      />

                      {/* Revenue Bar */}
                      <View
                        style={[
                          styles.singleBar,
                          {
                            height: barHeight,
                            backgroundColor: isSelected ? '#C2410C' : '#FB923C',
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Right Y-Axis (Orders Scale) */}
            <View style={styles.rightYAxis}>
              <Text style={styles.axisLabel}>{currentData.maxOrders}</Text>
              <Text style={styles.axisLabel}>{Math.round(currentData.maxOrders * 0.75)}</Text>
              <Text style={styles.axisLabel}>{Math.round(currentData.maxOrders * 0.5)}</Text>
              <Text style={styles.axisLabel}>{Math.round(currentData.maxOrders * 0.25)}</Text>
              <Text style={styles.axisLabel}>0</Text>
            </View>
          </View>

          {/* X-Axis Date Labels */}
          <View style={styles.xAxisLabelsRow}>
            {currentData.chartPoints.map((p, idx) => {
              // Show evenly spaced labels to prevent crowding
              const showLabel =
                currentData.chartPoints.length <= 7 ||
                idx === 0 ||
                idx === Math.floor(currentData.chartPoints.length / 2) ||
                idx === currentData.chartPoints.length - 1 ||
                idx % 3 === 0;

              return (
                <Text key={idx} style={styles.xAxisLabel}>
                  {showLabel ? p.label : ''}
                </Text>
              );
            })}
          </View>
        </View>

        {/* ── 4. Category Performance Split Cards (2 Columns) ── */}
        <View style={styles.categoryPerformanceRow}>
          {/* Left Card: Top Category */}
          <View style={styles.categoryPerfCard}>
            <View style={styles.catCardTop}>
              <View style={[styles.catIconWrap, { backgroundColor: '#FFF7ED' }]}>
                <Layers size={18} color="#EA580C" />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.catCardLabel}>Top Category</Text>
                <Text style={styles.catCardName}>{currentData.topCatName}</Text>
                <Text style={styles.catCardSub}>
                  {currentData.topCatPct}% of total sales
                </Text>
              </View>

              {/* Donut Progress Ring graphic */}
              <View style={styles.donutContainer}>
                <View style={styles.donutRingOuter}>
                  <View style={styles.donutRingInner}>
                    <Text style={styles.donutPercentText}>{currentData.topCatPct}%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Right Card: Fastest Growing Category */}
          <View style={styles.categoryPerfCard}>
            <View style={styles.catCardTop}>
              <View style={[styles.catIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <TrendingUp size={18} color="#059669" />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.catCardLabel}>Fastest Growing Category</Text>
                <Text style={styles.catCardName}>{currentData.fastestCatName}</Text>
                <Text style={styles.catGrowthText}>
                  {currentData.fastestCatGrowth}{' '}
                  <Text style={styles.catCardSub}>vs last period</Text>
                </Text>
              </View>

              {/* Mini Sparkline Graphic */}
              <View style={styles.sparklineContainer}>
                <View style={[styles.sparkBar, { height: 10 }]} />
                <View style={[styles.sparkBar, { height: 16 }]} />
                <View style={[styles.sparkBar, { height: 22 }]} />
                <View style={[styles.sparkBar, { height: 32 }]} />
              </View>
            </View>
          </View>
        </View>

        {/* ── 5. Top-Selling Materials Table Card ── */}
        <View style={styles.topSellingCard}>
          {/* Table Header */}
          <View style={styles.tableCardHeader}>
            <View style={styles.tableTitleRow}>
              <Award size={18} color="#EA580C" />
              <Text style={styles.tableTitle}>Top-Selling Materials</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Inventory')}
              style={styles.viewAllBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Table Column Headers */}
          <View style={styles.tableColumnHeaderRow}>
            <Text style={[styles.tableColHeader, { width: 26 }]}>#</Text>
            <Text style={[styles.tableColHeader, { flex: 1 }]}>Product</Text>
            <Text style={[styles.tableColHeader, { width: 70, textAlign: 'right' }]}>
              Units Sold
            </Text>
            <Text style={[styles.tableColHeader, { width: 75, textAlign: 'right' }]}>
              Revenue
            </Text>
            <Text style={[styles.tableColHeader, { width: 55, textAlign: 'right' }]}>
              Growth
            </Text>
          </View>

          {/* Table Rows */}
          {filteredMaterials.map((item) => (
            <View key={item.name} style={styles.tableRow}>
              {/* Rank */}
              <View
                style={[
                  styles.tableRankBadge,
                  item.rank <= 3
                    ? styles.tableRankBadgeHighlight
                    : styles.tableRankBadgeMuted,
                ]}
              >
                <Text
                  style={[
                    styles.tableRankText,
                    item.rank <= 3 && { color: '#EA580C' },
                  ]}
                >
                  {item.rank}
                </Text>
              </View>

              {/* Product Thumbnail & Details */}
              <View style={styles.tableProductInfo}>
                <Image source={{ uri: item.image }} style={styles.tableProductThumb} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.tableProductName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.tableProductSub}>
                    {item.category} • {item.unit}
                  </Text>
                </View>
              </View>

              {/* Units Sold */}
              <Text style={styles.tableUnitsText}>{item.unitsSold}</Text>

              {/* Revenue */}
              <Text style={styles.tableRevenueText}>{item.revenue}</Text>

              {/* Growth */}
              <Text style={styles.tableGrowthText}>{item.growth}</Text>
            </View>
          ))}
        </View>

        {/* ── 6. Bottom Action Cards Row ── */}
        <View style={styles.actionCardsRow}>
          {/* Card 1: Set Sales Target */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setTargetModalVisible(true)}
            activeOpacity={0.85}
          >
            <View style={[styles.actionCardIconWrap, { backgroundColor: '#FFF7ED' }]}>
              <Target size={20} color="#EA580C" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.actionCardTitle}>Set Sales Target</Text>
              <Text style={styles.actionCardSub}>
                Track your progress and hit new milestones
              </Text>
            </View>
            <ChevronRight size={16} color="#EA580C" />
          </TouchableOpacity>

          {/* Card 2: Download Report */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleDownloadReport}
            activeOpacity={0.85}
          >
            <View style={[styles.actionCardIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <FileText size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.actionCardTitle}>Download Report</Text>
              <Text style={styles.actionCardSub}>
                Get detailed analytics report
              </Text>
            </View>
            <ChevronRight size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Store Switcher Modal ── */}
      <Modal visible={showStorePicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowStorePicker(false)}
        >
          <View style={styles.storePickerCard}>
            <Text style={styles.storePickerTitle}>Filter Analytics by Store</Text>
            <Text style={styles.storePickerSub}>Select store location to aggregate metrics</Text>

            <TouchableOpacity
              style={[
                styles.storeOptionRow,
                selectedStore === 'All Stores' && styles.storeOptionRowActive,
              ]}
              onPress={() => {
                setSelectedStore('All Stores');
                setShowStorePicker(false);
              }}
            >
              <Store size={18} color={selectedStore === 'All Stores' ? colors.primary : '#4B5563'} />
              <Text
                style={[
                  styles.storeOptionText,
                  selectedStore === 'All Stores' && styles.storeOptionTextActive,
                ]}
              >
                All Stores (Aggregated)
              </Text>
            </TouchableOpacity>

            {retailers.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[
                  styles.storeOptionRow,
                  selectedStore === r.name && styles.storeOptionRowActive,
                ]}
                onPress={() => {
                  setSelectedStore(r.name);
                  setActiveRetailer(r.id);
                  setShowStorePicker(false);
                }}
              >
                <Store size={18} color={selectedStore === r.name ? colors.primary : '#4B5563'} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.storeOptionText,
                      selectedStore === r.name && styles.storeOptionTextActive,
                    ]}
                  >
                    {r.name}
                  </Text>
                  <Text style={styles.storeOptionAddress}>{r.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Set Sales Target Modal ── */}
      <Modal visible={targetModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.targetModalCard}>
            <Text style={styles.targetModalTitle}>🎯 Set Monthly Sales Target</Text>
            <Text style={styles.targetModalSub}>Enter your target Gross Merchandise Value (GMV)</Text>

            <View style={styles.targetInputWrap}>
              <Text style={styles.targetCurrencyPrefix}>₹</Text>
              <TextInput
                style={styles.targetInput}
                keyboardType="numeric"
                value={targetAmount}
                onChangeText={setTargetAmount}
                placeholder="45.00"
              />
              <Text style={styles.targetLakhSuffix}>Lakh</Text>
            </View>

            <View style={styles.targetModalButtons}>
              <TouchableOpacity
                style={styles.targetCancelBtn}
                onPress={() => setTargetModalVisible(false)}
              >
                <Text style={styles.targetCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.targetSaveBtn} onPress={handleSaveTarget}>
                <Text style={styles.targetSaveBtnText}>Set Target</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    backgroundColor: '#1E293B',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 48 : 36,
    paddingBottom: 16,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  storeDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.full,
    gap: 5,
    maxWidth: 140,
  },
  storeDropdownText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  headerSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    height: 42,
    gap: spacing.sm,
    ...shadows.sm,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  timeframeScroll: {
    flexGrow: 0,
    marginTop: 2,
  },
  timeframeContent: {
    gap: 8,
    alignItems: 'center',
  },
  timeframeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
  },
  timeframeChipActive: {
    backgroundColor: '#EA580C',
    ...shadows.sm,
  },
  timeframeChipInactive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeframeText: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
  },
  timeframeTextActive: {
    color: colors.white,
    fontWeight: typography.weights.extrabold,
  },
  timeframeTextInactive: {
    color: '#4B5563',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    borderRadius: radii.xl,
    padding: 12,
    borderWidth: 1,
    ...shadows.sm,
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 9.5,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
    lineHeight: 12,
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginVertical: 4,
  },
  kpiGrowthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 2,
  },
  kpiGrowthText: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#059669',
  },
  kpiGrowthSub: {
    fontSize: 8.5,
    color: '#6B7280',
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  chartCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chartTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  chartSubtitle: {
    fontSize: 10,
    color: '#6B7280',
  },
  chartMetricSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.md,
    gap: 4,
  },
  chartMetricSelectorText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  activePointBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: radii.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
    gap: 6,
  },
  activePointDate: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#C2410C',
  },
  activePointRevenue: {
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  activePointDot: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  activePointOrders: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#2563EB',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
  },
  graphWrapper: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
  },
  leftYAxis: {
    width: 26,
    height: 130,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rightYAxis: {
    width: 22,
    height: 130,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  axisLabel: {
    fontSize: 8.5,
    color: '#9CA3AF',
    fontWeight: typography.weights.medium,
  },
  chartCanvasArea: {
    flex: 1,
    height: 130,
    position: 'relative',
    marginHorizontal: 4,
  },
  gridLinesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  gridLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  barsFlexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    position: 'relative',
  },
  singleBar: {
    width: 8,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  lineNodeDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#3B82F6',
    borderWidth: 1.2,
    borderColor: colors.white,
    zIndex: 2,
  },
  lineNodeDotSelected: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#1D4ED8',
    borderColor: '#EA580C',
    borderWidth: 2,
  },
  xAxisLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 28,
    paddingRight: 24,
    marginTop: 8,
  },
  xAxisLabel: {
    fontSize: 8.5,
    color: '#9CA3AF',
  },
  categoryPerformanceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryPerfCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  catCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catCardLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: typography.weights.medium,
  },
  catCardName: {
    fontSize: 13,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginTop: 1,
  },
  catCardSub: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },
  catGrowthText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#059669',
    marginTop: 2,
  },
  donutContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutRingOuter: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 4,
    borderColor: '#EA580C',
    borderLeftColor: '#FED7AA',
    borderBottomColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutRingInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPercentText: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  sparklineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 36,
  },
  sparkBar: {
    width: 4,
    backgroundColor: '#34D399',
    borderRadius: 2,
  },
  topSellingCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  tableCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tableTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tableTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  tableColumnHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableColHeader: {
    fontSize: 9.5,
    fontWeight: typography.weights.bold,
    color: '#9CA3AF',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  tableRankBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRankBadgeHighlight: {
    backgroundColor: '#FFF7ED',
  },
  tableRankBadgeMuted: {
    backgroundColor: '#F3F4F6',
  },
  tableRankText: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#4B5563',
  },
  tableProductInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  tableProductThumb: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  tableProductName: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  tableProductSub: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 1,
  },
  tableUnitsText: {
    width: 70,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  tableRevenueText: {
    width: 75,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  tableGrowthText: {
    width: 55,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#059669',
  },
  actionCardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  actionCardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCardTitle: {
    fontSize: 11.5,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  actionCardSub: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  storePickerCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
    ...shadows.lg,
    gap: 8,
  },
  storePickerTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  storePickerSub: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
  },
  storeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    gap: 10,
  },
  storeOptionRowActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
  },
  storeOptionText: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  storeOptionTextActive: {
    color: colors.primary,
  },
  storeOptionAddress: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  targetModalCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 340,
    ...shadows.lg,
  },
  targetModalTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  targetModalSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: spacing.md,
  },
  targetInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
  },
  targetCurrencyPrefix: {
    fontSize: 18,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginRight: 6,
  },
  targetInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  targetLakhSuffix: {
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: '#6B7280',
  },
  targetModalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  targetCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.lg,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  targetCancelBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
  },
  targetSaveBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  targetSaveBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
});
