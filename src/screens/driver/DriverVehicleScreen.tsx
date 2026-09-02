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

const VEHICLE_CATEGORIES = [
  {
    type: 'Medium Vehicle (Active)',
    name: 'Bajaj Maxima / 3-Wheeler Auto',
    capacity: 'Up to 750 Kg',
    materials: 'Cement (up to 15 bags), Tiles, Sanitaryware, Small tools',
    icon: '🛵',
    isActive: true,
  },
  {
    type: 'Heavy Vehicle',
    name: 'Tata Ace (Chhota Hathi) / Bolero',
    capacity: 'Up to 2.5 Tonnes',
    materials: 'Steel TMT rebars, Cement (up to 50 bags), Sand, Bricks',
    icon: '🚛',
    isActive: false,
  },
  {
    type: 'Small 2-Wheeler',
    name: 'Motorcycle / Scooter',
    capacity: 'Up to 40 Kg',
    materials: 'Electrical switches, Plumbing fittings, Fasteners, Tools',
    icon: '🏍️',
    isActive: false,
  },
];

export default function DriverVehicleScreen({ navigation }: any) {
  const [activeCategory, setActiveCategory] = useState('Medium Vehicle (Active)');

  const handleChangeVehicle = () => {
    Alert.alert(
      'Switch Vehicle',
      'Submit new vehicle RC and insurance for instant automated compliance verification.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Vehicle & Capacity"
        subtitle="Manage registered vehicle & cargo tiers"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Active Registered Vehicle Card */}
        <View style={styles.activeVehicleCard}>
          <Text style={styles.sectionHeader}>CURRENT ACTIVE VEHICLE</Text>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleIconCircle}>
              <Text style={{ fontSize: 26 }}>🛵</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.plateNumber}>TS09 JK 1234</Text>
              <Text style={styles.vehicleModel}>Bajaj Maxima Commercial Diesel</Text>
              <Text style={styles.rcStatus}>✓ RC & Insurance Verified</Text>
            </View>
          </View>
        </View>

        {/* Cargo Capacity & Material Eligibility (BRD Section 30) */}
        <Text style={styles.sectionHeader}>VEHICLE CAPACITY TIERS (BUILD KART FRD)</Text>
        {VEHICLE_CATEGORIES.map((cat) => (
          <View
            key={cat.type}
            style={[
              styles.tierCard,
              cat.isActive && styles.tierCardActive,
            ]}
          >
            <View style={styles.tierTopRow}>
              <Text style={{ fontSize: 22 }}>{cat.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.tierName}>{cat.type}</Text>
                <Text style={styles.tierSub}>{cat.name}</Text>
              </View>
              {cat.isActive ? (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.switchBtn}
                  onPress={handleChangeVehicle}
                >
                  <Text style={styles.switchText}>Switch</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payload Capacity:</Text>
              <Text style={styles.infoVal}>{cat.capacity}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Assigned Materials:</Text>
              <Text style={styles.infoVal} numberOfLines={2}>{cat.materials}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.registerNewBtn} onPress={handleChangeVehicle} activeOpacity={0.88}>
          <Text style={styles.registerNewText}>+ Register Additional Vehicle</Text>
        </TouchableOpacity>

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
  sectionHeader: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#9CA3AF',
    letterSpacing: 0.6,
  },
  activeVehicleCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  vehicleIconCircle: {
    width: 52,
    height: 52,
    borderRadius: radii.xl,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateNumber: {
    fontSize: typography.fontSizes.sm + 2,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  vehicleModel: {
    fontSize: typography.fontSizes.xs,
    color: '#4B5563',
    marginTop: 1,
  },
  rcStatus: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#059669',
    marginTop: 2,
  },
  tierCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    ...shadows.sm,
  },
  tierCardActive: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFFAF5',
  },
  tierTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tierName: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  tierSub: {
    fontSize: 10,
    color: '#6B7280',
  },
  activeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  activeBadgeText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
  },
  switchBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  switchText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 2,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 4,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
  },
  infoVal: {
    fontSize: 10,
    color: '#6B7280',
    flex: 1,
  },
  registerNewBtn: {
    backgroundColor: '#0F172A',
    borderRadius: radii.xl,
    paddingVertical: spacing.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    ...shadows.sm,
  },
  registerNewText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
  },
});
