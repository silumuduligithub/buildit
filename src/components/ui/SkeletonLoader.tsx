import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, DimensionValue } from 'react-native';
import { colors, spacing, radii } from '../../theme/colors';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

function SkeletonBox({ width = '100%', height = 16, borderRadius = radii.sm, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

// ── Preset Skeletons ────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <View style={styles.productCard}>
      <SkeletonBox height={100} borderRadius={radii.md} />
      <SkeletonBox width="70%" height={12} style={{ marginTop: spacing.sm }} />
      <SkeletonBox width="50%" height={10} style={{ marginTop: spacing.xs }} />
      <View style={styles.productCardBottom}>
        <SkeletonBox width="40%" height={14} />
        <SkeletonBox width={64} height={32} borderRadius={radii.sm} />
      </View>
    </View>
  );
}

export function CategoryCardSkeleton() {
  return (
    <View style={styles.categoryCard}>
      <SkeletonBox width={48} height={48} borderRadius={radii.full} />
      <View style={{ flex: 1, gap: spacing.xs }}>
        <SkeletonBox width="60%" height={14} />
        <SkeletonBox width="80%" height={10} />
      </View>
    </View>
  );
}

export function OrderCardSkeleton() {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderCardRow}>
        <SkeletonBox width={120} height={14} />
        <SkeletonBox width={80} height={22} borderRadius={radii.sm} />
      </View>
      <SkeletonBox width="60%" height={12} style={{ marginTop: spacing.sm }} />
      <SkeletonBox width="80%" height={10} style={{ marginTop: spacing.xs }} />
      <SkeletonBox width="100%" height={38} borderRadius={radii.sm} style={{ marginTop: spacing.md }} />
    </View>
  );
}

export function DashboardMetricSkeleton() {
  return (
    <View style={styles.metricCard}>
      <SkeletonBox width={36} height={36} borderRadius={radii.md} />
      <SkeletonBox width="50%" height={10} style={{ marginTop: spacing.sm }} />
      <SkeletonBox width="70%" height={18} style={{ marginTop: spacing.xs }} />
    </View>
  );
}

export function ListItemSkeleton() {
  return (
    <View style={styles.listItem}>
      <SkeletonBox width={44} height={44} borderRadius={radii.md} />
      <View style={{ flex: 1, gap: spacing.xs }}>
        <SkeletonBox width="70%" height={13} />
        <SkeletonBox width="50%" height={10} />
      </View>
    </View>
  );
}

export { SkeletonBox };

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  productCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  orderCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.md,
  },
});
