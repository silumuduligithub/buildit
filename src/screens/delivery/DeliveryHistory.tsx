import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import AppHeader from '../../components/AppHeader';

export default function DeliveryHistory() {
  const { orders } = useAppStore();
  const delivered = orders.filter((o) => o.status === 'delivered');

  return (
    <SafeAreaView style={styles.root}>
      <AppHeader
        title="Delivery History"
        subtitle={`${delivered.length} completed`}
        accentColor={colors.delivery}
      />


      {/* Earnings Summary */}
      <View style={styles.earningsSummary}>
        <View style={styles.earningItem}>
          <Text style={styles.earningValue}>{delivered.length}</Text>
          <Text style={styles.earningLabel}>Deliveries</Text>
        </View>
        <View style={styles.earningDivider} />
        <View style={styles.earningItem}>
          <Text style={styles.earningValue}>
            ₹{delivered.reduce((s, o) => s + Math.round(o.deliveryFee * 0.75), 0)}
          </Text>
          <Text style={styles.earningLabel}>Earned</Text>
        </View>
        <View style={styles.earningDivider} />
        <View style={styles.earningItem}>
          <Text style={styles.earningValue}>4.8 ⭐</Text>
          <Text style={styles.earningLabel}>Rating</Text>
        </View>
      </View>

      <FlatList
        data={delivered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🚚</Text>
            <Text style={styles.emptyTitle}>No deliveries yet</Text>
            <Text style={styles.emptyText}>Completed deliveries will appear here</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <View style={styles.historyIconBox}>
                <Text style={styles.historyIcon}>✅</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyOrderId}>{item.id}</Text>
                <Text style={styles.historyDate}>
                  {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </Text>
              </View>
              <Text style={styles.historyEarning}>+₹{Math.round(item.deliveryFee * 0.75)}</Text>
            </View>
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
  headerTitle: { fontSize: typography.fontSizes.xl, fontWeight: typography.weights.bold, color: colors.text },
  headerSub: { fontSize: typography.fontSizes.sm, color: colors.textSecondary },

  earningsSummary: {
    flexDirection: 'row', backgroundColor: colors.delivery,
    padding: spacing.lg, justifyContent: 'space-around',
  },
  earningItem: { alignItems: 'center' },
  earningValue: { fontSize: typography.fontSizes.xxl, fontWeight: typography.weights.extrabold, color: colors.textInverse },
  earningLabel: { fontSize: typography.fontSizes.xs, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  earningDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },

  listContent: { padding: spacing.md, gap: spacing.sm },

  historyCard: {
    backgroundColor: colors.surface, borderRadius: radii.md,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.sm,
  },
  historyHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  historyIconBox: {
    width: 40, height: 40, borderRadius: radii.full,
    backgroundColor: colors.successLight, alignItems: 'center', justifyContent: 'center',
  },
  historyIcon: { fontSize: 18 },
  historyOrderId: { fontSize: typography.fontSizes.md, fontWeight: typography.weights.bold, color: colors.text },
  historyDate: { fontSize: typography.fontSizes.xs, color: colors.textSecondary },
  historyEarning: { fontSize: typography.fontSizes.lg, fontWeight: typography.weights.extrabold, color: colors.success },

  emptyState: { alignItems: 'center', paddingTop: spacing.xxxl },
  emptyIcon: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.fontSizes.xl, fontWeight: typography.weights.bold, color: colors.text },
  emptyText: { fontSize: typography.fontSizes.md, color: colors.textSecondary, marginTop: spacing.xs },
});
