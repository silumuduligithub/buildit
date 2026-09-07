import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, RotateCcw } from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows } from '../theme/colors';
import Badge from './ui/Badge';
import { OrderStatus } from '../types';

interface OrderCardProps {
  id: string;
  status: OrderStatus;
  customerName: string;
  totalAmount: number;
  itemsSummary: string;
  date: string;
  itemCount: number;
  onPress?: () => void;
  onReorder?: () => void;
  /** For retailer view */
  showActions?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onAdvanceStatus?: () => void;
  advanceLabel?: string;
}

function OrderCard({
  id,
  status,
  customerName,
  totalAmount,
  itemsSummary,
  date,
  itemCount,
  onPress,
  onReorder,
  showActions = false,
  onAccept,
  onReject,
  onAdvanceStatus,
  advanceLabel,
}: OrderCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      disabled={!onPress}
      accessibilityLabel={`Order ${id}`}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.idContainer}>
          <Text style={styles.orderId}>{id}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Badge variant={status} />
      </View>

      {/* Customer + Amount Row */}
      <View style={styles.detailRow}>
        <Text style={styles.customerName} numberOfLines={1}>{customerName}</Text>
        <Text style={styles.amount}>₹{totalAmount.toLocaleString('en-IN')}</Text>
      </View>

      {/* Items Summary */}
      <Text style={styles.itemsSummary} numberOfLines={1}>
        {itemCount} item{itemCount > 1 ? 's' : ''} · {itemsSummary}
      </Text>

      {/* Retailer Action Buttons */}
      {showActions && status === 'placed' && onAccept && onReject && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.rejectButton} onPress={onReject} activeOpacity={0.8}>
            <Text style={styles.rejectText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept} activeOpacity={0.8}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {showActions && status !== 'placed' && status !== 'delivered' && status !== 'rejected' && onAdvanceStatus && (
        <TouchableOpacity style={styles.advanceButton} onPress={onAdvanceStatus} activeOpacity={0.8}>
          <Text style={styles.advanceText}>{advanceLabel || 'Advance Status'}</Text>
          <ChevronRight size={14} color={colors.white} strokeWidth={2} />
        </TouchableOpacity>
      )}

      {/* Customer Reorder Button */}
      {!showActions && onReorder && status === 'delivered' && (
        <TouchableOpacity style={styles.reorderButton} onPress={onReorder} activeOpacity={0.8}>
          <RotateCcw size={14} color={colors.primary} strokeWidth={2} />
          <Text style={styles.reorderText}>Reorder</Text>
        </TouchableOpacity>
      )}

      {/* Navigation Arrow */}
      {onPress && !showActions && (
        <View style={styles.arrowContainer}>
          <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.5} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default memo(OrderCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  idContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  orderId: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  date: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  customerName: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.medium,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  amount: {
    fontSize: typography.fontSizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  itemsSummary: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: typography.fontSizes.caption * typography.lineHeights.relaxed,
  },

  // Retailer Actions
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: colors.errorLight,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  rejectText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.error,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  acceptText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  advanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  advanceText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },

  // Customer Reorder
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFaded,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  reorderText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },

  arrowContainer: {
    position: 'absolute',
    right: spacing.base,
    top: '50%',
  },
});
