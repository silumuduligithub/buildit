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
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const storeGroups = Object.values(
    cart.reduce<Record<string, { retailer: (typeof cart)[number]['retailer']; items: typeof cart }>>((groups, item) => {
      const key = item.retailer.id;
      if (!groups[key]) groups[key] = { retailer: item.retailer, items: [] };
      groups[key].items.push(item);
      return groups;
    }, {})
  );

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
        subtitle={`${totalItems} item${totalItems > 1 ? 's' : ''} • ${storeGroups.length} store${storeGroups.length > 1 ? 's' : ''}`}
        showBack={false}
        rightIcon="🗑️"
        onRightPress={() =>
          Alert.alert('Clear Cart?', 'Remove all items?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: clearCart },
          ])
        }
      />

      <View style={styles.deliverCard}>
        <View style={styles.deliverToLeft}>
          <Text style={styles.deliverToIcon}>📍</Text>
          <View style={styles.deliverTextWrap}>
            <Text style={styles.deliverToLabel}>Deliver to</Text>
            <Text style={styles.deliverToAddress}>Kondapur, Hyderabad - 500084</Text>
            <Text style={styles.deliveryWindow}>Delivery by Tomorrow, 10 AM - 2 PM</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('LocationSelect')}>
          <Text style={styles.changeAddressText}>Change</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={storeGroups}
        keyExtractor={(group) => group.retailer.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {/* Bill Details */}
            <View style={styles.billCard}>
              <View style={styles.billTitleRow}>
                <Text style={styles.billHeaderTitle}>Bill Summary</Text>
                <Text style={styles.couponText}>Apply Coupon</Text>
              </View>

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
              <Text style={styles.savedText}>♧ You saved ₹120 on this order</Text>
            </View>

            <View style={{ height: 156 }} />
          </>
        }
        renderItem={({ item: group }) => (
          <View style={styles.storeSection}>
            <View style={styles.storeHeader}>
              <View>
                <Text style={styles.storeName}>{group.retailer.name}</Text>
                <Text style={styles.storeMeta}>📍 {group.retailer.distance} km away  •  ⭐ {group.retailer.rating}  •  <Text style={styles.openText}>Open till 9:00 PM</Text></Text>
              </View>
              <Text style={styles.itemCountPill}>{group.items.length} item{group.items.length > 1 ? 's' : ''}</Text>
            </View>
            {group.items.map((item) => (
              <View style={styles.cartCard} key={item.id}>
                <View style={styles.itemImageBox}>
                  <Text style={styles.itemImageEmoji}>
                    {item.product.name.includes('Cement') ? '🏗️' : item.product.name.includes('Steel') ? '🔩' : item.product.name.includes('Sand') ? '⏳' : item.product.name.includes('Brick') ? '🧱' : item.product.name.includes('Paint') ? '🎨' : '📦'}
                  </Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={3}>{item.product.name}</Text>
                  <Text style={styles.itemUnit}>{item.product.unit}</Text>
                  <Text style={styles.itemPrice}>₹{(item.offer.price * item.quantity).toLocaleString('en-IN')}</Text>
                  <Text style={styles.unitPrice}>₹{item.offer.price.toLocaleString('en-IN')} / unit</Text>
                  <View style={styles.cardBottomRow}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => removeFromCart(item.id)}><Text>♧</Text></TouchableOpacity>
                    <View style={styles.stepper}>
                      <TouchableOpacity style={styles.stepBtn} onPress={() => item.quantity <= 1 ? removeFromCart(item.id) : updateCartQuantity(item.id, item.quantity - 1)}><Text style={styles.stepBtnText}>−</Text></TouchableOpacity>
                      <Text style={styles.stepQty}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.stepBtn} onPress={() => updateCartQuantity(item.id, item.quantity + 1)}><Text style={styles.stepBtnText}>+</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.storeBenefit}><Text style={styles.benefitIcon}>▣</Text><View><Text style={styles.benefitTitle}>{deliveryFee === 0 ? 'FREE delivery' : '₹50 delivery fee'} <Text style={styles.benefitNormal}>on this store</Text></Text><Text style={styles.benefitSub}>{deliveryFee === 0 ? 'You saved ₹120' : 'Delivery in 24 hrs'}</Text></View></View>
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
  deliverCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  deliverToLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  deliverTextWrap: {
    flex: 1,
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
  deliveryWindow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    marginTop: 4,
  },
  changeAddressText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm + 2,
  },
  storeSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  storeName: {
    color: colors.text,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  storeMeta: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  openText: {
    color: '#2A9D55',
    fontWeight: typography.weights.bold,
  },
  itemCountPill: {
    color: colors.textSecondary,
    backgroundColor: colors.background,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    fontSize: 10,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  itemImageBox: {
    width: 112,
    height: 128,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  itemImageEmoji: {
    fontSize: 46,
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
  unitPrice: {
    fontSize: 10,
    color: colors.textMuted,
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
  deleteButton: {
    padding: spacing.xs,
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
  billTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  couponText: {
    color: colors.primary,
    backgroundColor: colors.primaryFaded,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  savedText: {
    color: '#2A9D55',
    fontSize: 10,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
  },
  storeBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8EC',
    borderRadius: radii.sm,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  benefitIcon: {
    color: '#3C8B4A',
    fontSize: 18,
  },
  benefitTitle: {
    color: '#34763E',
    fontSize: 11,
    fontWeight: typography.weights.bold,
  },
  benefitNormal: {
    fontWeight: typography.weights.regular,
  },
  benefitSub: {
    color: '#4F8A56',
    fontSize: 10,
    marginTop: 2,
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
    bottom: 78,
    left: 0,
    right: 0,
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
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
