import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import AppHeader from '../../components/AppHeader';

const VEHICLE_TYPES = [
  { id: 'bike', label: 'Bike / 3-Wheeler', emoji: '🛵', suitedFor: 'Electrical, Plumbing, Hardware' },
  { id: 'tempo', label: 'Tata Ace / Tempo', emoji: '🚐', suitedFor: 'Cement, Tiles, Sanitaryware' },
  { id: 'truck', label: 'Truck / Tipper', emoji: '🚛', suitedFor: 'Sand, Steel, Bricks, Aggregates' },
];

export default function DeliveryTrips() {
  const { orders, updateOrderStatus } = useAppStore();
  const [selectedVehicle, setSelectedVehicle] = useState('tempo');

  // Filter orders that are ready for delivery pickup
  const availableTrips = orders.filter(
    (o) => o.status === 'driver_assigned' || o.status === 'pickup' || o.status === 'out_for_delivery'
  );

  const myActiveTrip = orders.find((o) => o.status === 'out_for_delivery');

  const statusLabel: Record<string, string> = {
    driver_assigned: 'Pickup Required',
    pickup: 'Picking Up',
    out_for_delivery: 'In Transit',
  };

  const advanceTrip = (orderId: string, currentStatus: string) => {
    if (currentStatus === 'driver_assigned') updateOrderStatus(orderId, 'pickup');
    else if (currentStatus === 'pickup') updateOrderStatus(orderId, 'out_for_delivery');
    else if (currentStatus === 'out_for_delivery') {
      Alert.prompt('Enter OTP', 'Ask the customer for their 4-digit OTP', (otp) => {
        if (otp && otp.length === 4) {
          updateOrderStatus(orderId, 'delivered');
          Alert.alert('✅ Delivery Complete!', 'Great job! Your earnings have been updated.');
        } else {
          Alert.alert('Invalid OTP', 'Please enter the correct OTP from the customer.');
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <AppHeader
        title="Available Trips"
        subtitle="Delivery Partner"
        accentColor={colors.delivery}
        rightElement={
          <View style={styles.earningsBadge}>
            <Text style={styles.earningsLabel}>Today</Text>
            <Text style={styles.earningsValue}>₹0</Text>
          </View>
        }
      />


      {/* Vehicle Selector */}
      <View style={styles.vehicleSection}>
        <Text style={styles.vehicleTitle}>My Vehicle Type</Text>
        <View style={styles.vehicleRow}>
          {VEHICLE_TYPES.map((v) => (
            <TouchableOpacity
              key={v.id}
              onPress={() => setSelectedVehicle(v.id)}
              style={[styles.vehicleCard, selectedVehicle === v.id && styles.vehicleCardActive]}
            >
              <Text style={styles.vehicleEmoji}>{v.emoji}</Text>
              <Text style={[styles.vehicleLabel, selectedVehicle === v.id && styles.vehicleLabelActive]}>
                {v.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Active Trips */}
      <FlatList
        data={availableTrips}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            {availableTrips.length > 0 ? `🚀 ${availableTrips.length} Trip${availableTrips.length > 1 ? 's' : ''} Available` : 'Waiting for Trips...'}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🕐</Text>
            <Text style={styles.emptyTitle}>No trips available</Text>
            <Text style={styles.emptyText}>New delivery assignments will appear here</Text>
            <Text style={styles.emptyHint}>
              Go to Customer portal → Place an order → Accept as Retailer to see trips here
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripId}>{item.id}</Text>
              <View style={[styles.tripStatusBadge, { backgroundColor: colors.infoLight }]}>
                <Text style={[styles.tripStatusText, { color: colors.info }]}>
                  {statusLabel[item.status] || item.status}
                </Text>
              </View>
            </View>

            <View style={styles.tripRoute}>
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: colors.warning }]} />
                <Text style={styles.routeLabel}>Pickup • Retailer Location</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: colors.success }]} />
                <Text style={styles.routeLabel}>Drop • Construction Site</Text>
              </View>
            </View>

            <View style={styles.tripInfo}>
              <View style={styles.tripInfoItem}>
                <Text style={styles.tripInfoIcon}>📦</Text>
                <Text style={styles.tripInfoText}>{item.items.length} item{item.items.length > 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.tripInfoItem}>
                <Text style={styles.tripInfoIcon}>💰</Text>
                <Text style={styles.tripInfoText}>₹{Math.round(item.deliveryFee * 0.75)} earnings</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.tripActionBtn}
              onPress={() => advanceTrip(item.id, item.status)}
            >
              <Text style={styles.tripActionText}>
                {item.status === 'driver_assigned' ? '🏪 Head to Retailer'
                  : item.status === 'pickup' ? '📦 Confirm Pickup'
                  : '✅ Deliver & Verify OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerSub: { fontSize: typography.fontSizes.xs, color: colors.textSecondary },
  headerTitle: { fontSize: typography.fontSizes.xl, fontWeight: typography.weights.bold, color: colors.text },
  earningsBadge: {
    backgroundColor: colors.deliveryLight, padding: spacing.sm, borderRadius: radii.md,
    alignItems: 'center', minWidth: 70,
  },
  earningsLabel: { fontSize: typography.fontSizes.xs, color: colors.delivery },
  earningsValue: { fontSize: typography.fontSizes.lg, fontWeight: typography.weights.extrabold, color: colors.delivery },

  vehicleSection: {
    backgroundColor: colors.surface, padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  vehicleTitle: { fontSize: typography.fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.sm, fontWeight: typography.weights.medium },
  vehicleRow: { flexDirection: 'row', gap: spacing.sm },
  vehicleCard: {
    flex: 1, alignItems: 'center', padding: spacing.sm, borderRadius: radii.md,
    backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border,
  },
  vehicleCardActive: { borderColor: colors.delivery, backgroundColor: colors.deliveryLight },
  vehicleEmoji: { fontSize: 20, marginBottom: 4 },
  vehicleLabel: { fontSize: typography.fontSizes.xs, color: colors.textSecondary, textAlign: 'center' },
  vehicleLabelActive: { color: colors.delivery, fontWeight: typography.weights.semibold },

  listContent: { padding: spacing.md, gap: spacing.md },
  sectionTitle: { fontSize: typography.fontSizes.md, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.sm },

  tripCard: {
    backgroundColor: colors.surface, borderRadius: radii.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.md,
  },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  tripId: { fontSize: typography.fontSizes.md, fontWeight: typography.weights.bold, color: colors.text },
  tripStatusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radii.full },
  tripStatusText: { fontSize: typography.fontSizes.xs, fontWeight: typography.weights.bold },

  tripRoute: { marginBottom: spacing.md },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 4 },
  routeDot: { width: 12, height: 12, borderRadius: 6 },
  routeLabel: { fontSize: typography.fontSizes.sm, color: colors.textSecondary },
  routeLine: { width: 2, height: 12, backgroundColor: colors.border, marginLeft: 5, marginVertical: 2 },

  tripInfo: {
    flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.sm,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.borderLight, marginBottom: spacing.md,
  },
  tripInfoItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  tripInfoIcon: { fontSize: 14 },
  tripInfoText: { fontSize: typography.fontSizes.sm, color: colors.textSecondary, fontWeight: typography.weights.medium },

  tripActionBtn: {
    backgroundColor: colors.delivery, borderRadius: radii.full,
    paddingVertical: spacing.md, alignItems: 'center',
  },
  tripActionText: { color: colors.textInverse, fontWeight: typography.weights.bold, fontSize: typography.fontSizes.md },

  emptyState: { alignItems: 'center', paddingTop: spacing.xxl },
  emptyIcon: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.fontSizes.xl, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.xs },
  emptyText: { fontSize: typography.fontSizes.md, color: colors.textSecondary },
  emptyHint: {
    fontSize: typography.fontSizes.xs, color: colors.textMuted,
    textAlign: 'center', marginTop: spacing.lg, paddingHorizontal: spacing.xl,
    backgroundColor: colors.background, padding: spacing.md, borderRadius: radii.md,
  },
});
