import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';

export default function CustomerCart({ navigation }: any) {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useAppStore();

  const itemTotal = cart.reduce((sum, item) => sum + item.offer.price * item.quantity, 0);
  const deliveryFee = itemTotal > 2000 ? 0 : 49;
  const handlingFee = 10;
  const totalAmount = itemTotal + deliveryFee + handlingFee;

  if (cart.length === 0) {
    return (
      <View style={styles.root}>
        <GradientAppHeader
          title="My Cart"
          subtitle="0 items in cart"
          showBack={false}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add construction materials from categories or top stores.</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Categories')}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyButtonText}>Browse Materials</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Cart) ── */}
      <GradientAppHeader
        title="My Cart"
        subtitle={`${cart.length} item${cart.length > 1 ? 's' : ''} added • Kondapur`}
        showBack={false}
        rightIcon="🗑️"
        onRightPress={() =>
          Alert.alert('Clear Cart?', 'Remove all items?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: clearCart },
          ])
        }
      />

      {/* Deliver To Strip */}
      <View style={styles.deliverToStrip}>
        <View style={styles.deliverToLeft}>
          <Text style={styles.deliverToIcon}>📍</Text>
          <View>
            <Text style={styles.deliverToLabel}>Deliver to</Text>
            <Text style={styles.deliverToAddress}>Kondapur, Hyderabad</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('LocationSelect')}>
          <Text style={styles.changeAddressText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items List */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {/* Bill Details */}
            <View style={styles.billCard}>
              <Text style={styles.billHeaderTitle}>Bill Details</Text>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Item Total</Text>
                <Text style={styles.billValue}>₹{itemTotal.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                <Text style={[styles.billValue, deliveryFee === 0 && styles.freeText]}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Handling Fee</Text>
                <Text style={styles.billValue}>₹{handlingFee}</Text>
              </View>

              <View style={styles.billDivider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            <View style={{ height: 120 }} />
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.cartCard}>
            <View style={styles.itemImageBox}>
              <Text style={styles.itemImageEmoji}>
                {item.product.name.includes('Cement') ? '🏗️'
                  : item.product.name.includes('Steel') ? '🔩'
                  : item.product.name.includes('Sand') ? '⏳'
                  : item.product.name.includes('Brick') ? '🧱'
                  : item.product.name.includes('Paint') ? '🎨'
                  : '📦'}
              </Text>
            </View>

            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
              <Text style={styles.itemUnit}>{item.product.unit}</Text>
              <Text style={styles.itemStoreName}>Store: {item.retailer.name}</Text>

              <View style={styles.cardBottomRow}>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => {
                      if (item.quantity <= 1) removeFromCart(item.id);
                      else updateCartQuantity(item.id, item.quantity - 1);
                    }}
                  >
                    <Text style={styles.stepBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepQty}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => updateCartQuantity(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.itemPrice}>
                  ₹{(item.offer.price * item.quantity).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Bottom Checkout CTA */}
      <View style={styles.bottomCheckoutBar}>
        <View style={styles.checkoutLeftInfo}>
          <Text style={styles.checkoutTotalLabel}>Total Amount</Text>
          <Text style={styles.checkoutTotalValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
        </View>

        <TouchableOpacity
          style={styles.proceedButton}
          onPress={() => navigation.navigate('AddressDelivery', { totalAmount })}
          activeOpacity={0.88}
        >
          <Text style={styles.proceedButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  deliverToStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  deliverToLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  deliverToIcon: {
    fontSize: 16,
  },
  deliverToLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  deliverToAddress: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  changeAddressText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm + 2,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  itemImageBox: {
    width: 68,
    height: 68,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  itemImageEmoji: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    lineHeight: 18,
  },
  itemUnit: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemStoreName: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  stepBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: typography.weights.extrabold,
  },
  stepQty: {
    color: colors.text,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    minWidth: 26,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  billCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
    gap: spacing.xs + 2,
    ...shadows.sm,
  },
  billHeaderTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  billValue: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  freeText: {
    color: colors.success,
    fontWeight: typography.weights.extrabold,
  },
  billDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  totalLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  totalValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  bottomCheckoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  checkoutLeftInfo: {},
  checkoutTotalLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  checkoutTotalValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  proceedButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    ...shadows.md,
  },
  proceedButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  emptySub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    marginTop: spacing.lg,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
  },
});
