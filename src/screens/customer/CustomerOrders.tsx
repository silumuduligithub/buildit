import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Check,
  ChevronRight,
  RotateCcw,
  Package,
  Clock,
  ClipboardList,
} from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import { mockProducts, mockStores, mockOffers } from '../../services/mockData';
import { customerService } from '../../services';
import GradientAppHeader from '../../components/GradientAppHeader';
import EmptyState from '../../components/ui/EmptyState';

interface OrderItemData {
  id: string;
  orderNumber: string;
  status: 'Approved' | 'Submitted' | 'In Transit' | 'Delivered' | 'Cancelled';
  date: string;
  estimatedDate: string;
  stepIndex: number; // 0: Submitted, 1: Approved, 2: In Transit, 3: Delivered
  itemsText: string;
  totalAmount: number;
  itemCount: number;
}

const ACTIVE_ORDERS: OrderItemData[] = [
  {
    id: 'ord_active_1',
    orderNumber: '20003645',
    status: 'Approved',
    date: 'Mar 7, 2023',
    estimatedDate: 'Estimated Mar 8, 2023',
    stepIndex: 1,
    itemsText: 'UltraTech Cement OPC 53 (20 Bags), TMT Rebars 12mm (5 Pcs)',
    totalAmount: 11600,
    itemCount: 2,
  },
  {
    id: 'ord_active_2',
    orderNumber: '20003646',
    status: 'Submitted',
    date: 'Mar 7, 2023',
    estimatedDate: 'Estimated Mar 9, 2023',
    stepIndex: 0,
    itemsText: 'Tata Tiscon 550D Rebars (10 Pcs), BRC Reinforcement Mesh',
    totalAmount: 9250,
    itemCount: 2,
  },
];

const COMPLETED_ORDERS: OrderItemData[] = [
  {
    id: 'ord_comp_1',
    orderNumber: '20003512',
    status: 'Delivered',
    date: 'Feb 28, 2023',
    estimatedDate: 'Delivered Feb 28, 2023',
    stepIndex: 3,
    itemsText: 'Asian Paints Apex Ultima (2 Buckets), Wirecut Bricks (500 Pcs)',
    totalAmount: 15400,
    itemCount: 3,
  },
  {
    id: 'ord_comp_2',
    orderNumber: '20003480',
    status: 'Delivered',
    date: 'Feb 21, 2023',
    estimatedDate: 'Delivered Feb 22, 2023',
    stepIndex: 3,
    itemsText: 'M-Sand for Plastering (2 Tonnes)',
    totalAmount: 3300,
    itemCount: 1,
  },
  {
    id: 'ord_comp_3',
    orderNumber: '20003421',
    status: 'Delivered',
    date: 'Feb 15, 2023',
    estimatedDate: 'Delivered Feb 16, 2023',
    stepIndex: 3,
    itemsText: 'Bosch Professional Impact Drill Kit, Fasteners & Anchors',
    totalAmount: 4650,
    itemCount: 2,
  },
];

const CANCELLED_ORDERS: OrderItemData[] = [
  {
    id: 'ord_canc_1',
    orderNumber: '20003290',
    status: 'Cancelled',
    date: 'Jan 12, 2023',
    estimatedDate: 'Cancelled on Jan 12, 2023',
    stepIndex: 0,
    itemsText: 'Ramco Supercrete PPC Cement (10 Bags)',
    totalAmount: 3950,
    itemCount: 1,
  },
];

type TabType = 'active' | 'completed' | 'cancelled';

export default function CustomerOrders({ navigation }: any) {
  const { addToCart, fetchCart } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [liveOrders, setLiveOrders] = useState<OrderItemData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const statusParam = activeTab === 'completed' ? 'delivered' : activeTab === 'cancelled' ? 'cancelled' : 'active';
    setIsLoading(true);
    customerService.getOrders(statusParam).then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: OrderItemData[] = res.data.map((o: any) => {
          const stepIdx = o.order_status === 'delivered' ? 3 : o.order_status === 'in_transit' || o.order_status === 'out_for_delivery' ? 2 : o.order_status === 'confirmed' ? 1 : 0;
          const statusText = o.order_status === 'delivered' ? 'Delivered' : o.order_status === 'cancelled' ? 'Cancelled' : o.order_status === 'confirmed' ? 'Approved' : 'In Transit';
          return {
            id: o.id || o.order_code,
            orderNumber: (o.order_code || o.id || '20003645').replace(/[^0-9]/g, '').slice(-8) || '20003645',
            status: statusText as any,
            date: o.formatted_date || 'Today',
            estimatedDate: o.formatted_date || 'Delivered',
            stepIndex: stepIdx,
            itemsText: o.items_summary || 'Construction Materials',
            totalAmount: o.raw_grand_total || 2500,
            itemCount: o.item_count || 1,
          };
        });
        setLiveOrders(mapped);
      } else {
        setLiveOrders([]);
      }
    }).catch(() => {})
    .finally(() => {
      setIsLoading(false);
    });
  }, [activeTab]);

  const defaultList =
    activeTab === 'active'
      ? ACTIVE_ORDERS
      : activeTab === 'completed'
      ? COMPLETED_ORDERS
      : CANCELLED_ORDERS;

  const ordersToDisplay = liveOrders.length > 0 ? liveOrders : defaultList;

  const handleReorder = async (order: OrderItemData) => {
    try {
      await customerService.reorderOrder(order.id);
      await fetchCart();
    } catch {
      const product = mockProducts[0];
      const store = mockStores[0];
      const offer = mockOffers[0];

      addToCart({
        id: `cart-reorder-${Date.now()}`,
        offer,
        product,
        retailer: store,
        quantity: 2,
      });
    }

    Alert.alert('Added to Cart', `Items from order #${order.orderNumber} added to cart.`, [
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      { text: 'OK' },
    ]);
  };

  const getStatusBadgeStyle = (status: OrderItemData['status']) => {
    switch (status) {
      case 'Approved':
        return {
          bg: '#E5F9EE',
          text: '#0EA568',
        };
      case 'Submitted':
        return {
          bg: '#E8F4FE',
          text: '#2563EB',
        };
      case 'In Transit':
        return {
          bg: '#FFF3ED',
          text: '#DF6733',
        };
      case 'Delivered':
        return {
          bg: '#E5F9EE',
          text: '#0EA568',
        };
      case 'Cancelled':
      default:
        return {
          bg: '#FEF2F2',
          text: '#EF4444',
        };
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Signature Sunset Gradient Header with Fulfillment & Search ── */}
      <GradientAppHeader
        variant="orders"
        searchPlaceholder="Search Product"
        onSearchPress={() => navigation.navigate('SearchTab')}
        onCameraPress={() =>
          Alert.alert('Visual Search', 'Snap a photo of materials to order!')
        }
        onFilterPress={() => navigation.navigate('SearchTab')}
        onNotificationPress={() => navigation.navigate('Offers')}
        hasUnreadNotification={true}
      />

      {/* ── Horizontal Filter Pills (Mockup) ── */}
      <View style={styles.filterPillsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsScroll}
        >
          <TouchableOpacity
            style={[
              styles.pillChip,
              activeTab === 'active' ? styles.pillChipActive : styles.pillChipInactive,
            ]}
            onPress={() => setActiveTab('active')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.pillChipTitle,
                activeTab === 'active'
                  ? styles.pillChipTitleActive
                  : styles.pillChipTitleInactive,
              ]}
            >
              Active Orders
            </Text>
            <Text
              style={[
                styles.pillChipSub,
                activeTab === 'active'
                  ? styles.pillChipSubActive
                  : styles.pillChipSubInactive,
              ]}
            >
              {ACTIVE_ORDERS.length} Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pillChip,
              activeTab === 'completed'
                ? styles.pillChipActive
                : styles.pillChipInactive,
            ]}
            onPress={() => setActiveTab('completed')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.pillChipTitle,
                activeTab === 'completed'
                  ? styles.pillChipTitleActive
                  : styles.pillChipTitleInactive,
              ]}
            >
              Completed Orders
            </Text>
            <Text
              style={[
                styles.pillChipSub,
                activeTab === 'completed'
                  ? styles.pillChipSubActive
                  : styles.pillChipSubInactive,
              ]}
            >
              {COMPLETED_ORDERS.length} Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pillChip,
              activeTab === 'cancelled'
                ? styles.pillChipActive
                : styles.pillChipInactive,
            ]}
            onPress={() => setActiveTab('cancelled')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.pillChipTitle,
                activeTab === 'cancelled'
                  ? styles.pillChipTitleActive
                  : styles.pillChipTitleInactive,
              ]}
            >
              Cancelled
            </Text>
            <Text
              style={[
                styles.pillChipSub,
                activeTab === 'cancelled'
                  ? styles.pillChipSubActive
                  : styles.pillChipSubInactive,
              ]}
            >
              {CANCELLED_ORDERS.length} Orders
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Section Title (Mockup: Active Orders (2)) ── */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'active'
              ? `Active Orders (${ACTIVE_ORDERS.length})`
              : activeTab === 'completed'
              ? `Completed Orders (${COMPLETED_ORDERS.length})`
              : `Cancelled Orders (${CANCELLED_ORDERS.length})`}
          </Text>
        </View>

        {isLoading ? (
          <View style={{ paddingVertical: spacing.xl, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: spacing.sm, fontSize: typography.fontSizes.caption, color: colors.textSecondary }}>
              Loading orders...
            </Text>
          </View>
        ) : ordersToDisplay.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={28} color={colors.primary} strokeWidth={1.5} />}
            title="No orders found"
            description="You don't have any orders in this tab."
            actionLabel="Browse Catalog"
            onAction={() => navigation.navigate('Categories')}
          />
        ) : (
          <View style={styles.orderList}>
            {ordersToDisplay.map((order) => {
              const badgeColors = getStatusBadgeStyle(order.status);
              return (
                <TouchableOpacity
                  key={order.id}
                  style={styles.orderCard}
                  onPress={() =>
                    navigation.navigate('OrderTracking', { orderId: order.orderNumber })
                  }
                  activeOpacity={0.9}
                >
                  {/* Card Top: Order ID & Status Badge */}
                  <View style={styles.orderCardHeader}>
                    <Text style={styles.orderIdText}>
                      Order ID: {order.orderNumber}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: badgeColors.bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: badgeColors.text },
                        ]}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  {/* Visual Stepper Tracker (Mockup circles with checkmarks) */}
                  <View style={styles.stepperContainer}>
                    {[0, 1, 2, 3].map((step, index) => {
                      const isFinished = step <= order.stepIndex;
                      const isLast = index === 3;
                      return (
                        <React.Fragment key={step}>
                          <View
                            style={[
                              styles.stepNode,
                              isFinished
                                ? styles.stepNodeCompleted
                                : styles.stepNodePending,
                            ]}
                          >
                            <Check
                              size={12}
                              color={isFinished ? '#0EA568' : '#CBD5E1'}
                              strokeWidth={2.5}
                            />
                          </View>
                          {!isLast && (
                            <View style={styles.dashedLineContainer}>
                              <Text
                                style={[
                                  styles.dashedLine,
                                  isFinished
                                    ? styles.dashedLineActive
                                    : styles.dashedLinePending,
                                ]}
                                numberOfLines={1}
                              >
                                - - - - -
                              </Text>
                            </View>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </View>

                  {/* Dates Row (Mockup: Mar 7, 2023 ... Estimated Mar 8, 2023) */}
                  <View style={styles.datesRow}>
                    <Text style={styles.orderDate}>{order.date}</Text>
                    <Text style={styles.estimatedDate}>{order.estimatedDate}</Text>
                  </View>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Items Description & Pricing Row */}
                  <View style={styles.bottomInfoRow}>
                    <View style={styles.itemsSummaryBox}>
                      <Text style={styles.itemsSummaryText} numberOfLines={1}>
                        {order.itemCount} items · {order.itemsText}
                      </Text>
                      <Text style={styles.totalPriceText}>
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </Text>
                    </View>

                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity
                        style={styles.reorderBtn}
                        onPress={() => handleReorder(order)}
                        activeOpacity={0.8}
                      >
                        <RotateCcw size={13} color={colors.primary} strokeWidth={2} />
                        <Text style={styles.reorderBtnText}>Reorder</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.detailsChevron}
                        onPress={() =>
                          navigation.navigate('OrderTracking', {
                            orderId: order.orderNumber,
                          })
                        }
                      >
                        <ChevronRight
                          size={16}
                          color={colors.textTertiary}
                          strokeWidth={1.8}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 100 }} />
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
    paddingBottom: spacing['2xl'],
  },

  // ── Filter Pills (Mockup) ──
  filterPillsContainer: {
    paddingVertical: spacing.md,
  },
  filterPillsScroll: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  pillChip: {
    minWidth: 130,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillChipActive: {
    backgroundColor: colors.pillActiveBg,
    borderColor: colors.pillActiveBorder,
  },
  pillChipInactive: {
    backgroundColor: colors.pillInactiveBg,
    borderColor: colors.pillInactiveBorder,
  },
  pillChipTitle: {
    fontSize: typography.fontSizes.bodySmall,
  },
  pillChipTitleActive: {
    color: colors.pillActiveText,
    fontWeight: typography.weights.bold,
  },
  pillChipTitleInactive: {
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  pillChipSub: {
    fontSize: 11,
    marginTop: 2,
  },
  pillChipSubActive: {
    color: colors.pillActiveText,
    fontWeight: typography.weights.medium,
  },
  pillChipSubInactive: {
    color: colors.textTertiary,
  },

  // ── Section Title ──
  sectionTitleRow: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },

  // ── Order Cards ──
  orderList: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  orderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  orderIdText: {
    fontSize: typography.fontSizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  statusBadgeText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
  },

  // ── Stepper Visual ──
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  stepNode: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNodeCompleted: {
    borderColor: '#0EA568',
    backgroundColor: '#E5F9EE',
  },
  stepNodePending: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  dashedLineContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  dashedLine: {
    fontSize: 14,
    letterSpacing: 2,
  },
  dashedLineActive: {
    color: '#0EA568',
  },
  dashedLinePending: {
    color: '#CBD5E1',
  },

  // ── Dates Row ──
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  orderDate: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  estimatedDate: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },

  // Divider
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },

  // ── Bottom Summary Row ──
  bottomInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemsSummaryBox: {
    flex: 1,
    marginRight: spacing.sm,
  },
  itemsSummaryText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
  },
  totalPriceText: {
    fontSize: typography.fontSizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFaded,
    borderWidth: 1,
    borderColor: 'rgba(223, 103, 51, 0.2)',
  },
  reorderBtnText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  detailsChevron: {
    padding: 4,
  },
});
