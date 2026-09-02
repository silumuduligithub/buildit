import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import GradientAppHeader from '../../components/GradientAppHeader';
import DriverDeliveryDetailModal from './DriverDeliveryDetailModal';

const DELIVERY_TABS = ['All', 'Ongoing', 'Completed', 'Cancelled'];

const ALL_DELIVERIES = {
  today: [
    {
      id: 'BK-250531-00125',
      customer: 'Ravi Kumar',
      location: 'Madhapur, Hyderabad',
      time: '11:25 AM',
      amount: '₹680',
      status: 'Delivered',
      statusColor: '#059669',
      statusBg: '#ECFDF5',
      dotColor: '#10B981',
    },
    {
      id: 'BK-250531-00124',
      customer: 'Suresh Builder',
      location: 'Jubilee Hills, Hyderabad',
      time: '10:15 AM',
      amount: '₹520',
      status: 'Ongoing',
      statusColor: '#EA580C',
      statusBg: '#FFF7ED',
      dotColor: '#F97316',
    },
    {
      id: 'BK-250531-00123',
      customer: 'Anil Kumar',
      location: 'Kondapur, Hyderabad',
      time: '09:30 AM',
      amount: '₹450',
      status: 'Ongoing',
      statusColor: '#EA580C',
      statusBg: '#FFF7ED',
      dotColor: '#F97316',
    },
  ],
  yesterday: [
    {
      id: 'BK-250530-00122',
      customer: 'Vikram Infra',
      location: 'Banjara Hills, Hyderabad',
      time: '06:40 PM',
      amount: '₹780',
      status: 'Delivered',
      statusColor: '#059669',
      statusBg: '#ECFDF5',
      dotColor: '#10B981',
    },
    {
      id: 'BK-250530-00121',
      customer: 'Ramesh Constructions',
      location: 'Kondapur, Hyderabad',
      time: '05:20 PM',
      amount: '₹620',
      status: 'Delivered',
      statusColor: '#059669',
      statusBg: '#ECFDF5',
      dotColor: '#10B981',
    },
  ],
};

export default function DriverDeliveries({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);

  const filterList = (list: typeof ALL_DELIVERIES.today) => {
    if (activeTab === 'All') return list;
    if (activeTab === 'Ongoing') return list.filter((i) => i.status === 'Ongoing');
    if (activeTab === 'Completed') return list.filter((i) => i.status === 'Delivered');
    if (activeTab === 'Cancelled') return [];
    return list;
  };

  const todayList = filterList(ALL_DELIVERIES.today);
  const yesterdayList = filterList(ALL_DELIVERIES.yesterday);

  const handleDeliveryPress = (item: any) => {
    if (item.status === 'Ongoing') {
      navigation.navigate('OngoingDelivery', { orderId: item.id });
    } else {
      setSelectedDelivery(item);
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="My Deliveries"
        subtitle="Fulfillment history & active drop-offs"
        showBack={false}
      />

      {/* ── Tabs Bar ── */}
      <View style={styles.tabsRow}>
        {DELIVERY_TABS.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Today Section */}
        {todayList.length > 0 && (
          <View style={styles.dateGroup}>
            <Text style={styles.dateHeader}>Today</Text>
            <View style={styles.cardContainer}>
              {todayList.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.deliveryRow, idx === todayList.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => handleDeliveryPress(item)}
                  activeOpacity={0.78}
                >
                  <View style={[styles.timelineDot, { backgroundColor: item.dotColor }]} />

                  <View style={styles.middleInfo}>
                    <Text style={styles.orderId}>{item.id}</Text>
                    <Text style={styles.customerName}>{item.customer}</Text>
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>

                  <View style={styles.rightCol}>
                    <View style={[styles.statusPill, { backgroundColor: item.statusBg }]}>
                      <Text style={[styles.statusText, { color: item.statusColor }]}>
                        {item.status}
                      </Text>
                    </View>
                    <Text style={styles.amountText}>{item.amount}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Yesterday Section */}
        {yesterdayList.length > 0 && (
          <View style={styles.dateGroup}>
            <Text style={styles.dateHeader}>Yesterday</Text>
            <View style={styles.cardContainer}>
              {yesterdayList.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.deliveryRow, idx === yesterdayList.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => handleDeliveryPress(item)}
                  activeOpacity={0.78}
                >
                  <View style={[styles.timelineDot, { backgroundColor: item.dotColor }]} />

                  <View style={styles.middleInfo}>
                    <Text style={styles.orderId}>{item.id}</Text>
                    <Text style={styles.customerName}>{item.customer}</Text>
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>

                  <View style={styles.rightCol}>
                    <View style={[styles.statusPill, { backgroundColor: item.statusBg }]}>
                      <Text style={[styles.statusText, { color: item.statusColor }]}>
                        {item.status}
                      </Text>
                    </View>
                    <Text style={styles.amountText}>{item.amount}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {todayList.length === 0 && yesterdayList.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 44, marginBottom: 8 }}>📦</Text>
            <Text style={styles.emptyTitle}>No {activeTab} Deliveries</Text>
            <Text style={styles.emptySub}>Deliveries matching this status will appear here.</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Delivery Detail Modal */}
      <DriverDeliveryDetailModal
        visible={!!selectedDelivery}
        delivery={selectedDelivery}
        onClose={() => setSelectedDelivery(null)}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: typography.fontSizes.md + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#FF6B00',
  },
  tabText: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.semibold,
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FF6B00',
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  dateGroup: {
    gap: spacing.xs + 2,
  },
  dateHeader: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginLeft: 4,
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: spacing.sm,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  middleInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  customerName: {
    fontSize: typography.fontSizes.xs,
    color: '#4B5563',
    marginTop: 1,
  },
  locationText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  amountText: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginTop: 2,
  },
  timeText: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  emptySub: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    marginTop: 4,
  },
});
