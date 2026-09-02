import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import GradientAppHeader from '../../components/GradientAppHeader';

export default function DriverPerformanceScreen({ navigation }: any) {
  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Driver Performance"
        subtitle="Operational metrics, rating & SLAs"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Rating Hero Card */}
        <View style={styles.ratingHeroCard}>
          <Text style={styles.ratingScore}>4.8 ⭐</Text>
          <Text style={styles.ratingTitle}>Excellent Driver Score</Text>
          <Text style={styles.ratingSub}>Based on 118 customer reviews</Text>
        </View>

        {/* 4 Performance Metric Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>124</Text>
            <Text style={styles.metricLabel}>Total Assigned</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: '#059669' }]}>118</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: '#2563EB' }]}>98.4%</Text>
            <Text style={styles.metricLabel}>On-Time SLA</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: '#DC2626' }]}>0.4%</Text>
            <Text style={styles.metricLabel}>Cancellation Rate</Text>
          </View>
        </View>

        {/* Tier Benefits Card */}
        <View style={styles.tierCard}>
          <Text style={styles.tierHeader}>DIAMOND TIER DRIVER</Text>
          <Text style={styles.tierBenefitTitle}>✓ Priority High-Value Order Allocation</Text>
          <Text style={styles.tierBenefitSub}>You receive first priority for cement & steel bulk transit trips.</Text>
          <Text style={styles.tierBenefitTitle}>✓ +15% Peak Hour Surge Bonus</Text>
          <Text style={styles.tierBenefitSub}>Applied automatically during morning construction rush hours.</Text>
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
  ratingHeroCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  ratingScore: {
    fontSize: 40,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  ratingTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.weights.extrabold,
    color: '#059669',
    marginTop: 4,
  },
  ratingSub: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metricCard: {
    width: '48.5%',
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    ...shadows.sm,
  },
  metricVal: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  metricLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  tierCard: {
    backgroundColor: '#0B1528',
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.xs + 2,
    ...shadows.md,
  },
  tierHeader: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#F59E0B',
    letterSpacing: 0.8,
  },
  tierBenefitTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    marginTop: 4,
  },
  tierBenefitSub: {
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 14,
  },
});
