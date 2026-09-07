import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import AppHeader from '../../components/AppHeader';

const SUBSCRIPTION_LABELS: Record<string, string> = {
  Basic: '🆓',
  Professional: '⭐',
  Enterprise: '💎',
};

const subscriptions = ['Basic', 'Professional', 'Enterprise'];

export default function AdminRetailers() {
  const { retailers, fetchStores } = useAppStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    fetchStores().catch(() => {});
  }, []);

  const filtered = retailers.filter((r) => {
    if (selectedFilter === 'suspended') return suspendedIds.has(r.id);
    if (selectedFilter === 'active') return !suspendedIds.has(r.id);
    return true;
  });

  const toggleSuspend = (id: string, name: string) => {
    const isSuspended = suspendedIds.has(id);
    Alert.alert(
      isSuspended ? 'Reinstate Retailer?' : 'Suspend Retailer?',
      `Are you sure you want to ${isSuspended ? 'reinstate' : 'suspend'} ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isSuspended ? 'Reinstate' : 'Suspend',
          style: isSuspended ? 'default' : 'destructive',
          onPress: () =>
            setSuspendedIds((prev) => {
              const next = new Set(prev);
              if (isSuspended) next.delete(id); else next.add(id);
              return next;
            }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <AppHeader
        title="Retailers"
        subtitle={`${retailers.length} registered`}
        accentColor={colors.admin}
        showBell
      />


      {/* Filters */}
      <View style={styles.filters}>
        {(['all', 'active', 'suspended'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setSelectedFilter(f)}
            style={[styles.filterPill, selectedFilter === f && styles.filterPillActive]}
          >
            <Text style={[styles.filterText, selectedFilter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const isSuspended = suspendedIds.has(item.id);
          const planIndex = index % 3;
          const plan = subscriptions[planIndex];

          return (
            <View style={[styles.retailerCard, isSuspended && styles.retailerCardSuspended]}>
              <View style={styles.retailerTop}>
                <View style={[styles.avatar, isSuspended && { backgroundColor: colors.errorLight }]}>
                  <Text style={[styles.avatarText, isSuspended && { color: colors.error }]}>
                    {item.name.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.retailerName}>{item.name}</Text>
                  <Text style={styles.retailerAddress}>{item.address}</Text>
                  <View style={styles.badges}>
                    <View style={[styles.badge, { backgroundColor: colors.adminLight }]}>
                      <Text style={[styles.badgeText, { color: colors.admin }]}>
                        {SUBSCRIPTION_LABELS[plan]} {plan}
                      </Text>
                    </View>
                    {isSuspended ? (
                      <View style={[styles.badge, { backgroundColor: colors.errorLight }]}>
                        <Text style={[styles.badgeText, { color: colors.error }]}>Suspended</Text>
                      </View>
                    ) : (
                      <View style={[styles.badge, { backgroundColor: colors.successLight }]}>
                        <Text style={[styles.badgeText, { color: colors.success }]}>Active</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.retailerStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>⭐ {item.rating}</Text>
                  <Text style={styles.statLbl}>Rating</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{item.distance} km</Text>
                  <Text style={styles.statLbl}>Distance</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{item.deliveryTypes.length}</Text>
                  <Text style={styles.statLbl}>Delivery Types</Text>
                </View>
              </View>

              <View style={styles.retailerActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, isSuspended ? styles.reinstateBtn : styles.suspendBtn]}
                  onPress={() => toggleSuspend(item.id, item.name)}
                >
                  <Text style={[styles.actionBtnText, { color: isSuspended ? colors.success : colors.error }]}>
                    {isSuspended ? '✓ Reinstate' : '⛔ Suspend'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => Alert.alert(item.name, `Delivery radius, commission settings, GST verification and detailed analytics for ${item.name} would appear here in production.`)}
                >
                  <Text style={styles.viewBtnText}>View Details →</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
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
  headerTitle: { fontSize: typography.fontSizes.xl, fontWeight: typography.weights.bold, color: colors.text },
  headerSub: { fontSize: typography.fontSizes.sm, color: colors.textSecondary },

  filters: {
    flexDirection: 'row', gap: spacing.sm, padding: spacing.md,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  filterPill: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: radii.full, backgroundColor: colors.background,
    borderWidth: 1, borderColor: colors.border,
  },
  filterPillActive: { backgroundColor: colors.admin, borderColor: colors.admin },
  filterText: { fontSize: typography.fontSizes.sm, color: colors.textSecondary },
  filterTextActive: { color: colors.textInverse, fontWeight: typography.weights.bold },

  listContent: { padding: spacing.md, gap: spacing.md },

  retailerCard: {
    backgroundColor: colors.surface, borderRadius: radii.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.sm,
  },
  retailerCardSuspended: { borderColor: colors.error, opacity: 0.7 },
  retailerTop: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  avatar: {
    width: 52, height: 52, borderRadius: radii.full,
    backgroundColor: colors.adminLight, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: typography.fontSizes.xl, fontWeight: typography.weights.bold, color: colors.admin },
  retailerName: { fontSize: typography.fontSizes.md, fontWeight: typography.weights.bold, color: colors.text },
  retailerAddress: { fontSize: typography.fontSizes.xs, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.xs },
  badges: { flexDirection: 'row', gap: spacing.xs },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.xs },
  badgeText: { fontSize: typography.fontSizes.xs, fontWeight: typography.weights.semibold },

  retailerStats: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: spacing.sm, borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: colors.borderLight, marginBottom: spacing.md,
  },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: typography.fontSizes.sm, fontWeight: typography.weights.bold, color: colors.text },
  statLbl: { fontSize: typography.fontSizes.xs, color: colors.textMuted },

  retailerActions: { flexDirection: 'row', gap: spacing.md },
  actionBtn: {
    flex: 1, paddingVertical: spacing.sm, borderRadius: radii.full,
    alignItems: 'center', borderWidth: 1,
  },
  suspendBtn: { borderColor: colors.error, backgroundColor: colors.errorLight },
  reinstateBtn: { borderColor: colors.success, backgroundColor: colors.successLight },
  actionBtnText: { fontWeight: typography.weights.bold, fontSize: typography.fontSizes.sm },
  viewBtn: {
    flex: 1, backgroundColor: colors.admin, borderRadius: radii.full,
    paddingVertical: spacing.sm, alignItems: 'center',
  },
  viewBtnText: { color: colors.textInverse, fontWeight: typography.weights.bold, fontSize: typography.fontSizes.sm },
});
