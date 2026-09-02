import React from 'react';
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
import { useAppStore } from '../../store';

const PROFILE_MENU_ITEMS = [
  { id: 'p_docs', title: 'Documents', emoji: '📄', sub: 'Driving license, RC, Commercial insurance', target: 'Documents' },
  { id: 'p_earnings', title: 'Earnings & Payouts', emoji: '👛', sub: 'Bank account, payment cycle & TDS', target: 'Earnings' },
  { id: 'p_perf', title: 'My Performance', emoji: '📈', sub: 'Customer ratings, on-time score (98.4%)', target: 'Performance' },
  { id: 'p_support', title: 'Help & Support', emoji: '🎧', sub: '24x7 Driver Hotline • 1800-419-BUILD', target: 'Support' },
  { id: 'p_vehicle', title: 'Vehicle & Cargo Capacity', emoji: '🛵', sub: 'TS09 JK 1234 (Bajaj Maxima)', target: 'Vehicle' },
];

export default function DriverProfile({ navigation }: any) {
  const { setCurrentRole } = useAppStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout Driver',
      'Are you sure you want to end your delivery shift?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => setCurrentRole('customer') },
      ]
    );
  };

  return (
    <View style={styles.root}>
      {/* ── Signature Crimson Gradient Profile Header ── */}
      <LinearGradient
        colors={['#140202', '#8B0000', '#D32F2F', '#E53935']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileHeader}
      >
        <TouchableOpacity
          style={styles.editPencilBtn}
          onPress={() => Alert.alert('Edit Profile', 'Update driver details')}
        >
          <Text style={{ fontSize: 16 }}>✏️</Text>
        </TouchableOpacity>

        {/* Driver Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👨‍✈️</Text>
          </View>
        </View>

        <Text style={styles.driverName}>Mahesh Kumar</Text>
        <Text style={styles.driverPhone}>+91 98765 43210</Text>

        {/* Rating & Online Pill */}
        <View style={styles.badgeRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.ratingText}>4.8</Text>
          </View>

          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Vehicle Details Card ── */}
        <TouchableOpacity
          style={styles.vehicleCard}
          onPress={() => navigation.navigate('Vehicle')}
          activeOpacity={0.88}
        >
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleIconCircle}>
              <Text style={{ fontSize: 22 }}>🛵</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.vehiclePlate}>TS09 JK 1234</Text>
              <Text style={styles.vehicleModel}>Bajaj Maxima (Medium Capacity)</Text>
            </View>

            <View style={styles.changeLinkBox}>
              <Text style={styles.changeLink}>Manage ›</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Menu Items Card ── */}
        <View style={styles.menuCard}>
          {PROFILE_MENU_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuRow, idx === PROFILE_MENU_ITEMS.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => navigation.navigate(item.target)}
              activeOpacity={0.78}
            >
              <View style={styles.menuIconCircle}>
                <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
              </View>

              <View style={styles.menuCol}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSub} numberOfLines={1}>{item.sub}</Text>
              </View>

              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Logout Button ── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>End Shift & Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
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
  profileHeader: {
    paddingTop: topInset + 12,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    position: 'relative',
  },
  editPencilBtn: {
    position: 'absolute',
    top: topInset + 10,
    right: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    marginBottom: spacing.xs,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    ...shadows.md,
  },
  avatarEmoji: {
    fontSize: 42,
  },
  driverName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    marginTop: 4,
  },
  driverPhone: {
    fontSize: typography.fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
    gap: 4,
  },
  starIcon: {
    fontSize: 12,
  },
  ratingText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
    gap: 4,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  onlineText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  vehicleCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  vehicleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehiclePlate: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  vehicleModel: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    marginTop: 1,
  },
  changeLinkBox: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.md,
  },
  changeLink: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#EA580C',
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md - 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: spacing.sm,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: '#1F2937',
  },
  menuSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  chevron: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: spacing.sm,
    ...shadows.sm,
  },
  logoutIcon: {
    fontSize: 18,
  },
  logoutText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: '#DC2626',
  },
});
