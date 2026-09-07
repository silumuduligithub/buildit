import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import {
  MapPin,
  Trash2,
  ShoppingCart,
  Clock,
  Tag,
  ChevronRight,
  Store,
  Star,
  Package,
  Check,
} from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';
import QuantitySelector from '../../components/ui/QuantitySelector';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

export default function CustomerCart({ navigation }: any) {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    syncUpdateCartQuantity,
    syncRemoveCartItem,
    syncClearCart,
    fetchCart,
    savedAddresses,
  } = useAppStore();

<<<<<<< HEAD
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
=======
  const [selectedIds, setSelectedIds] = useState<string[]>(() => cart.map((i) => i.id));

  useEffect(() => {
    fetchCart().catch(() => {});
  }, []);

  // Keep selected IDs in sync when cart changes (e.g. newly added items are selected by default)
  useEffect(() => {
    setSelectedIds((prev) => {
      const currentIds = cart.map((i) => i.id);
      if (prev.length === 0 && currentIds.length > 0) return currentIds;
      const valid = prev.filter((id) => currentIds.includes(id));
      const newlyAdded = currentIds.filter((id) => !prev.includes(id));
      return [...valid, ...newlyAdded];
    });
  }, [cart]);

  const defaultAddress = savedAddresses[0] || {
    line1: 'Kondapur, Hyderabad - 500084',
  };

  const selectedCartItems = cart.filter((item) => selectedIds.includes(item.id));
  const selectedItemTotal = selectedCartItems.reduce(
    (sum, item) => sum + item.offer.price * item.quantity,
    0
  );
  const deliveryFee = selectedItemTotal === 0 ? 0 : selectedItemTotal > 2000 ? 0 : 49;
  const handlingFee = selectedItemTotal === 0 ? 0 : 10;
  const totalAmount = selectedItemTotal > 0 ? selectedItemTotal + deliveryFee + handlingFee : 0;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedTotalItems = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);

  const allSelected = cart.length > 0 && selectedIds.length === cart.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map((i) => i.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const storeGroups = Object.values(
    cart.reduce<Record<string, { retailer: (typeof cart)[number]['retailer']; items: typeof cart }>>(
      (groups, item) => {
        const key = item.retailer.id;
        if (!groups[key]) groups[key] = { retailer: item.retailer, items: [] };
        groups[key].items.push(item);
        return groups;
      },
      {}
    )
>>>>>>> c2d4ce9 (api intigrated)
  );

  if (cart.length === 0) {
    return (
      <View style={styles.root}>
        <GradientAppHeader title="My Cart" subtitle="0 items" showBack={false} showSearch={false} />
        <EmptyState
          icon={<ShoppingCart size={28} color={colors.primary} strokeWidth={1.5} />}
          title="Your cart is empty"
          description="Add construction materials from categories or top stores."
          actionLabel="Browse Materials"
          onAction={() => navigation.navigate('Categories')}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <GradientAppHeader
        title="My Cart"
<<<<<<< HEAD
        subtitle={`${totalItems} item${totalItems > 1 ? 's' : ''} • ${storeGroups.length} store${storeGroups.length > 1 ? 's' : ''}`}
=======
        subtitle={`${totalItems} item${totalItems > 1 ? 's' : ''} · ${storeGroups.length} store${storeGroups.length > 1 ? 's' : ''}`}
>>>>>>> c2d4ce9 (api intigrated)
        showBack={false}
        showSearch={false}
        rightIcon={<Trash2 size={18} color={colors.white} strokeWidth={1.5} />}
        onRightPress={() =>
          Alert.alert('Clear Cart?', 'Remove all items from your cart?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: syncClearCart },
          ])
        }
      />

<<<<<<< HEAD
      <View style={styles.deliverCard}>
        <View style={styles.deliverToLeft}>
          <Text style={styles.deliverToIcon}>📍</Text>
          <View style={styles.deliverTextWrap}>
            <Text style={styles.deliverToLabel}>Deliver to</Text>
            <Text style={styles.deliverToAddress}>Kondapur, Hyderabad - 500084</Text>
            <Text style={styles.deliveryWindow}>Delivery by Tomorrow, 10 AM - 2 PM</Text>
=======
      {/* Delivery Address Strip */}
      <View style={styles.addressCard}>
        <View style={styles.addressLeft}>
          <View style={styles.addressIconCircle}>
            <MapPin size={16} color={colors.primary} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addressLabel}>Deliver to</Text>
            <Text style={styles.addressText}>Kondapur, Hyderabad - 500084</Text>
            <View style={styles.deliveryTimeRow}>
              <Clock size={11} color={colors.primary} strokeWidth={2} />
              <Text style={styles.deliveryTime}>Tomorrow, 10 AM – 2 PM</Text>
            </View>
>>>>>>> c2d4ce9 (api intigrated)
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('LocationSelect')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

<<<<<<< HEAD
=======
      {/* Select All & Selection Status Bar */}
      <View style={styles.selectionBar}>
        <TouchableOpacity
          style={styles.selectAllBtn}
          onPress={toggleSelectAll}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, allSelected && styles.checkboxActive]}>
            {allSelected && <Check size={13} color={colors.white} strokeWidth={3} />}
          </View>
          <Text style={styles.selectAllText}>
            {allSelected ? 'Deselect All' : 'Select All'} ({selectedCartItems.length}/{cart.length} items)
          </Text>
        </TouchableOpacity>

        {selectedCartItems.length > 0 && (
          <Text style={styles.selectedCountBadge}>
            ₹{selectedItemTotal.toLocaleString('en-IN')} selected
          </Text>
        )}
      </View>

      {/* Cart Items by Store */}
>>>>>>> c2d4ce9 (api intigrated)
      <FlatList
        data={storeGroups}
        keyExtractor={(group) => group.retailer.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {/* Coupon Section */}
            <TouchableOpacity style={styles.couponCard} activeOpacity={0.85}>
              <Tag size={18} color={colors.primary} strokeWidth={1.5} />
              <Text style={styles.couponText}>Apply Coupon</Text>
              <ChevronRight size={16} color={colors.primary} strokeWidth={1.5} />
            </TouchableOpacity>

            {/* Bill Summary */}
            <View style={styles.billCard}>
<<<<<<< HEAD
              <View style={styles.billTitleRow}>
                <Text style={styles.billHeaderTitle}>Bill Summary</Text>
                <Text style={styles.couponText}>Apply Coupon</Text>
              </View>
=======
              <Text style={styles.billTitle}>Bill Summary</Text>
>>>>>>> c2d4ce9 (api intigrated)

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>
                  Item Total ({selectedTotalItems} item{selectedTotalItems > 1 ? 's' : ''})
                </Text>
                <Text style={styles.billValue}>₹{selectedItemTotal.toLocaleString('en-IN')}</Text>
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

              <View style={styles.billRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
              </View>
<<<<<<< HEAD
              <Text style={styles.savedText}>♧ You saved ₹120 on this order</Text>
            </View>

            <View style={{ height: 156 }} />
=======

              {deliveryFee === 0 && selectedItemTotal > 0 && (
                <View style={styles.savingsRow}>
                  <Text style={styles.savingsText}>You're saving ₹49 on delivery!</Text>
                </View>
              )}
            </View>

            <View style={{ height: 160 }} />
>>>>>>> c2d4ce9 (api intigrated)
          </>
        }
        renderItem={({ item: group }) => (
          <View style={styles.storeSection}>
<<<<<<< HEAD
            <View style={styles.storeHeader}>
              <View>
                <Text style={styles.storeName}>{group.retailer.name}</Text>
                <Text style={styles.storeMeta}>📍 {group.retailer.distance} km away  •  ⭐ {group.retailer.rating}  •  <Text style={styles.openText}>Open till 9:00 PM</Text></Text>
              </View>
              <Text style={styles.itemCountPill}>{group.items.length} item{group.items.length > 1 ? 's' : ''}</Text>
=======
            {/* Store Header */}
            <View style={styles.storeHeader}>
              <View style={styles.storeInfoLeft}>
                <Store size={16} color={colors.textSecondary} strokeWidth={1.5} />
                <Text style={styles.storeName} numberOfLines={1}>{group.retailer.name}</Text>
              </View>
              <View style={styles.storeMetaRow}>
                <Star size={11} color={colors.accent} strokeWidth={2} fill={colors.accent} />
                <Text style={styles.storeMeta}>{group.retailer.rating}</Text>
                <Text style={styles.storeMetaDot}>·</Text>
                <Text style={styles.storeMeta}>{group.retailer.distance} km</Text>
              </View>
            </View>

            {/* Cart Items */}
            {group.items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <View
                  style={[styles.cartItem, !isSelected && styles.cartItemUnselected]}
                  key={item.id}
                >
                  <TouchableOpacity
                    style={styles.itemCheckboxTouch}
                    onPress={() => toggleSelectItem(item.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                      {isSelected && <Check size={13} color={colors.white} strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>

                  <View style={styles.itemImageBox}>
                    {item.product?.imageUrl ? (
                      <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} resizeMode="cover" />
                    ) : (
                      <Package size={20} color={colors.textTertiary} strokeWidth={1.2} />
                    )}
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                    <Text style={styles.itemUnit}>{item.product.unit}</Text>
                    <View style={styles.itemPriceRow}>
                      <Text style={styles.itemPrice}>
                        ₹{(item.offer.price * item.quantity).toLocaleString('en-IN')}
                      </Text>
                      {item.quantity > 1 && (
                        <Text style={styles.unitPrice}>
                          ₹{item.offer.price.toLocaleString('en-IN')}/unit
                        </Text>
                      )}
                    </View>
                  </View>
                  <QuantitySelector
                    quantity={item.quantity}
                    onAdd={() => syncUpdateCartQuantity(item.id, item.quantity + 1)}
                    onRemove={() =>
                      item.quantity <= 1
                        ? syncRemoveCartItem(item.id)
                        : syncUpdateCartQuantity(item.id, item.quantity - 1)
                    }
                    size="sm"
                  />
                </View>
              );
            })}

            {/* Store benefit */}
            <View style={styles.storeBenefit}>
              <Text style={styles.benefitText}>
                {deliveryFee === 0 ? '✓ Free delivery from this store' : 'Add ₹' + Math.max(0, 2000 - selectedItemTotal) + ' more for free delivery'}
              </Text>
>>>>>>> c2d4ce9 (api intigrated)
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

      {/* Bottom Checkout Bar */}
      <View style={styles.checkoutBar}>
        <View style={styles.checkoutInfo}>
          <Text style={styles.checkoutLabel}>
            {selectedTotalItems > 0
              ? `Total (${selectedTotalItems} selected)`
              : '0 items selected'}
          </Text>
          <Text style={styles.checkoutAmount}>₹{totalAmount.toLocaleString('en-IN')}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            selectedCartItems.length === 0 && styles.checkoutButtonDisabled,
          ]}
          disabled={selectedCartItems.length === 0}
          onPress={() =>
            navigation.navigate('AddressDelivery', {
              totalAmount,
              selectedItems: selectedCartItems,
            })
          }
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.checkoutButtonText,
              selectedCartItems.length === 0 && styles.checkoutButtonTextDisabled,
            ]}
          >
            {selectedCartItems.length === 0 ? 'Select Items' : `Checkout (${selectedTotalItems})`}
          </Text>
          {selectedCartItems.length > 0 && (
            <ChevronRight size={16} color={colors.white} strokeWidth={2.2} />
          )}
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
<<<<<<< HEAD
  deliverCard: {
=======

  // Address
  addressCard: {
>>>>>>> c2d4ce9 (api intigrated)
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
<<<<<<< HEAD
    margin: spacing.md,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
=======
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
>>>>>>> c2d4ce9 (api intigrated)
    ...shadows.sm,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: spacing.sm,
  },
  addressIconCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
  },
  addressText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginTop: 1,
  },
  deliveryTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
<<<<<<< HEAD
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
=======
  deliveryTime: {
    fontSize: typography.fontSizes.caption,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  changeText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },

  // Selection Bar
  selectionBar: {
    flexDirection: 'row',
>>>>>>> c2d4ce9 (api intigrated)
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
<<<<<<< HEAD
  itemImageEmoji: {
    fontSize: 46,
=======
  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectAllText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  selectedCountBadge: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },

  // Checkbox
  itemCheckboxTouch: {
    paddingRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: colors.textDisabled,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cartItemUnselected: {
    opacity: 0.55,
  },

  // List Content
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    gap: spacing.base,
  },

  // Store Section
  storeSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  storeInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  storeName: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    flex: 1,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeMeta: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  storeMetaDot: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
  },

  // Cart Item
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: spacing.sm + 4,
  },
  itemImageBox: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
>>>>>>> c2d4ce9 (api intigrated)
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: typography.fontSizes.bodySmall * typography.lineHeights.normal,
  },
  itemUnit: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
<<<<<<< HEAD
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
=======
  itemPriceRow: {
>>>>>>> c2d4ce9 (api intigrated)
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  itemPrice: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  unitPrice: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
  },

  // Store Benefit
  storeBenefit: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  benefitText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.success,
  },

  // Coupon
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    gap: spacing.md,
    ...shadows.sm,
  },
<<<<<<< HEAD
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
=======
  couponText: {
    flex: 1,
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },

  // Bill Summary
  billCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  billTitle: {
    fontSize: typography.fontSizes.title,
    fontWeight: typography.weights.semibold,
>>>>>>> c2d4ce9 (api intigrated)
    color: colors.text,
    marginBottom: spacing.md,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  billLabel: {
    fontSize: typography.fontSizes.body,
    color: colors.textSecondary,
  },
  billValue: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  freeText: {
    color: colors.success,
    fontWeight: typography.weights.semibold,
  },
  billDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  totalLabel: {
    fontSize: typography.fontSizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  totalValue: {
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  savingsRow: {
    backgroundColor: colors.successLight,
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: radii.sm,
  },
  savingsText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.success,
    textAlign: 'center',
  },

  // Checkout Bar
  checkoutBar: {
    ...shadows.lg,
    position: 'absolute',
<<<<<<< HEAD
    bottom: 78,
=======
    bottom: Platform.OS === 'ios' ? 78 : 62,
>>>>>>> c2d4ce9 (api intigrated)
    left: 0,
    right: 0,
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
<<<<<<< HEAD
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
=======
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
>>>>>>> c2d4ce9 (api intigrated)
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    zIndex: 999,
  },
  checkoutInfo: {},
  checkoutLabel: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
  },
  checkoutAmount: {
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    gap: spacing.xs,
    minHeight: 48,
  },
  checkoutButtonDisabled: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkoutButtonText: {
    fontSize: typography.fontSizes.button,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  checkoutButtonTextDisabled: {
    color: colors.textTertiary,
  },
});
