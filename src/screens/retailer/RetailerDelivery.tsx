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

const ACTIVE_DRIVERS = [
  { id: 'd1', name: 'Mahesh Kumar', vehicle: 'Tata Ace (1.5 Tonne)', status: 'On Delivery', orders: 3, phone: '+91 98765 00112' },
  { id: 'd2', name: 'Ramesh Reddy', vehicle: 'Mahindra Bolero Pickup', status: 'Available', orders: 0, phone: '+91 98481 99221' },
  { id: 'd3', name: 'Sanjay Verma', vehicle: 'Bajaj Maxima Auto', status: 'Available', orders: 0, phone: '+91 97011 33445' },
];

export default function RetailerDelivery({ navigation }: any) {
  const [selectedModel, setSelectedModel] = useState<'both' | 'fleet' | '3pl'>('both');

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Delivery & Fleet Logistics"
        subtitle="Configure fulfillment channels & active vehicles"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Delivery Model Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>DELIVERY FULFILLMENT MODEL</Text>
          <Text style={styles.sectionSub}>Select how orders from your store are dispatched to customer sites.</Text>

          <View style={styles.modelOptions}>
            <TouchableOpacity
              style={[styles.modelCard, selectedModel === 'both' && styles.modelCardActive]}
              onPress={() => setSelectedModel('both')}
            >
              <Text style={styles.modelEmoji}>🚛 + 🛵</Text>
              <Text style={styles.modelTitle}>Hybrid (Fleet + 3PL)</Text>
              <Text style={styles.modelDesc}>Bulk materials via own trucks, express small items via 3PL riders.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modelCard, selectedModel === 'fleet' && styles.modelCardActive]}
              onPress={() => setSelectedModel('fleet')}
            >
              <Text style={styles.modelEmoji}>🚛</Text>
              <Text style={styles.modelTitle}>Own Store Fleet</Text>
              <Text style={styles.modelDesc}>Deliver all materials using your dedicated shop drivers.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modelCard, selectedModel === '3pl' && styles.modelCardActive]}
              onPress={() => setSelectedModel('3pl')}
            >
              <Text style={styles.modelEmoji}>🛵</Text>
              <Text style={styles.modelTitle}>Third-Party Logistics (3PL)</Text>
              <Text style={styles.modelDesc}>BuildKart automated network handles driver assignment & pickups.</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Assigned Drivers / Vehicles */}
        <View style={styles.sectionCard}>
          <View style={styles.headerWithBtn}>
            <Text style={styles.sectionHeader}>STORE DRIVERS & VEHICLES ({ACTIVE_DRIVERS.length})</Text>
            <TouchableOpacity onPress={() => Alert.alert('Add Driver', 'Register new driver & vehicle registration.')}>
              <Text style={styles.addDriverText}>+ Add Driver</Text>
            </TouchableOpacity>
          </View>

          {ACTIVE_DRIVERS.map((driver) => (
            <View key={driver.id} style={styles.driverItem}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverEmoji}>🚚</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverVehicle}>{driver.vehicle}</Text>
                <Text style={styles.driverPhone}>{driver.phone}</Text>
              </View>

              <View style={styles.driverRightCol}>
                <View
                  style={[
                    styles.driverStatusPill,
                    driver.status === 'Available' ? { backgroundColor: '#ECFDF5' } : { backgroundColor: '#EFF6FF' },
                  ]}
                >
                  <Text
                    style={[
                      styles.driverStatusText,
                      driver.status === 'Available' ? { color: '#059669' } : { color: '#2563EB' },
                    ]}
                  >
                    {driver.status}
                  </Text>
                </View>
                {driver.orders > 0 && (
                  <Text style={styles.activeTripsText}>{driver.orders} Active Drops</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Rates & Free Threshold */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>SHIPPING CHARGES</Text>

          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Express Delivery (under 50 Kg)</Text>
            <Text style={styles.feeValue}>₹49 / order</Text>
          </View>

          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Heavy Transit (over 500 Kg)</Text>
            <Text style={styles.feeValue}>₹250 / Tonne</Text>
          </View>

          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Free Delivery Threshold</Text>
            <Text style={styles.feeValueFree}>Orders above ₹2,000</Text>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    marginTop: -2,
    lineHeight: 16,
  },
  modelOptions: {
    gap: spacing.sm,
    marginTop: 4,
  },
  modelCard: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  modelCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  modelEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  modelTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  modelDesc: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },
  headerWithBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addDriverText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: spacing.sm,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverEmoji: {
    fontSize: 22,
  },
  driverName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  driverVehicle: {
    fontSize: 10,
    color: '#4B5563',
    marginTop: 1,
  },
  driverPhone: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 1,
  },
  driverRightCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  driverStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  driverStatusText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
  },
  activeTripsText: {
    fontSize: 9,
    color: '#2563EB',
    fontWeight: typography.weights.bold,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  feeLabel: {
    fontSize: typography.fontSizes.xs,
    color: '#4B5563',
  },
  feeValue: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  feeValueFree: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#059669',
  },
});
