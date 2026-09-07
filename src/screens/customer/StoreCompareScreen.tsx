import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { mockStores, mockOffers, mockProducts } from '../../services/mockData';
import { catalogService, mapBackendOfferToOffer } from '../../services';
import { useAppStore } from '../../store';
import { CartItem } from '../../types';
import GradientAppHeader from '../../components/GradientAppHeader';
import AddToCartBottomSheet from '../../components/AddToCartBottomSheet';

const STORE_TABS = ['All Stores', 'Top Rated', 'Fast Delivery'];

export default function StoreCompareScreen({ route, navigation }: any) {
  const productId = route?.params?.productId || 'p_cement_1';
  const productName = route?.params?.productName || 'UltraTech Cement OPC 53 Grade (50 Kg)';
  const [activeTab, setActiveTab] = useState('All Stores');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [showAddSheet, setShowAddSheet] = useState(false);
<<<<<<< HEAD
=======
  const [liveComparisonOffers, setLiveComparisonOffers] = useState<any[]>([]);
>>>>>>> c2d4ce9 (api intigrated)

  const {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    syncAddToCart,
    syncUpdateCartQuantity,
    syncRemoveCartItem,
    products,
    retailers,
    offers,
  } = useAppStore();

  useEffect(() => {
    catalogService.getProductOffers(productId).then((res) => {
      if (res.data?.offers && Array.isArray(res.data.offers)) {
        setLiveComparisonOffers(res.data.offers.map((o: any) => mapBackendOfferToOffer(o)));
      }
    }).catch(() => {});
  }, [productId]);

  const product = products.find((p) => p.id === productId) || mockProducts.find((p) => p.id === productId) || mockProducts[0];
  const storesList = retailers.length > 0 ? retailers : mockStores;

  const storeOffers = storesList.map((store, index) => {
    const matchedLiveOffer = liveComparisonOffers.find((o) => o.retailerId === store.id);
    const basePrice = matchedLiveOffer
      ? matchedLiveOffer.price
      : product.name.includes('UltraTech')
      ? 410 + index * 3
      : product.name.includes('Ramco')
      ? 395 + index * 2
      : product.name.includes('ACC')
      ? 405 + index * 3
      : 400 + index * 4;

    const offer = matchedLiveOffer || offers.find((o) => o.retailerId === store.id && o.productId === product.id) || {
      id: `offer_${store.id}_${product.id}`,
      productId: product.id,
      retailerId: store.id,
      price: basePrice,
      stock: 300,
      isAvailable: true,
      estimatedDeliveryMins: 25 + index * 5,
    };

    return {
      store,
      offer,
      price: basePrice,
      deliveryTime: `${25 + index * 5}-${30 + index * 5} min`,
    };
  });

  const sortedOffers = storeOffers.filter((item) => {
    if (activeTab === 'Top Rated') return item.store.rating >= 4.4;
    if (activeTab === 'Fast Delivery') return item.store.distance <= 2.0;
    return true;
  });

  const getCartQuantity = (offerId: string) => {
    const item = cart.find((i) => i.offer.id === offerId || i.product.id === offerId);
    return item ? item.quantity : 0;
  };

  const handleAdd = (item: typeof storeOffers[0]) => {
<<<<<<< HEAD
    const cartItem: CartItem = {
      id: `cart-${item.offer.id}-${Date.now()}`,
      offer: item.offer,
      product,
      retailer: item.store,
      quantity: 1,
    };
    addToCart(cartItem);
=======
    syncAddToCart(product.id, item.offer.id, 1);
>>>>>>> c2d4ce9 (api intigrated)
    setSelectedProductName(product.name);
    setShowAddSheet(true);
  };

  const handleIncrease = (offerId: string) => {
    const item = cart.find((i) => i.offer.id === offerId || i.product.id === offerId);
    if (item) {
      syncUpdateCartQuantity(item.id, item.quantity + 1);
    } else {
      syncAddToCart(productId, offerId, 1);
    }
  };

  const handleDecrease = (offerId: string) => {
    const item = cart.find((i) => i.offer.id === offerId || i.product.id === offerId);
    if (!item) return;
    if (item.quantity <= 1) {
      syncRemoveCartItem(item.id);
    } else {
      syncUpdateCartQuantity(item.id, item.quantity - 1);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Store Compare) ── */}
      <GradientAppHeader
        title="Compare Local Stores"
        subtitle={product.name}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        rightIcon="⚡"
      />

      {/* Tabs */}
      <View style={styles.tabsBar}>
        {STORE_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Stores List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {sortedOffers.map((item) => {
          const qty = getCartQuantity(item.offer.id);
          return (
            <View key={item.store.id} style={styles.storeCard}>
              <View style={styles.storeIconBox}>
                <Text style={styles.storeEmoji}>🏪</Text>
              </View>

              <View style={styles.storeInfo}>
                <Text style={styles.storeName} numberOfLines={1}>{item.store.name}</Text>
                <Text style={styles.storeMeta}>
                  ★ {item.store.rating} • {item.deliveryTime} • {item.store.distance} km
                </Text>
              </View>

              <View style={styles.priceActionBox}>
                <Text style={styles.priceText}>₹{item.price}</Text>

                {qty === 0 ? (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAdd(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addButtonText}>+ ADD</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => handleDecrease(item.offer.id)}
                    >
                      <Text style={styles.stepBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepQty}>{qty}</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => handleIncrease(item.offer.id)}
                    >
                      <Text style={styles.stepBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        <Text style={styles.footerNote}>Showing top local hardware & material depots</Text>
        <View style={{ height: 110 }} />
      </ScrollView>

      <AddToCartBottomSheet
        visible={showAddSheet}
        itemName={selectedProductName}
        itemCount={cart.length}
        totalQuantity={totalItems}
        onClose={() => setShowAddSheet(false)}
        onContinue={() => setShowAddSheet(false)}
        onViewCart={() => {
          setShowAddSheet(false);
          navigation.navigate('Cart');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.sm,
  },
  tabItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.sm + 2,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  storeIconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
  },
  storeEmoji: {
    fontSize: 22,
  },
  storeInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  storeName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  storeMeta: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  priceActionBox: {
    alignItems: 'flex-end',
    gap: 4,
  },
  priceText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.md,
    ...shadows.sm,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: typography.weights.extrabold,
  },
  stepQty: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    minWidth: 20,
    textAlign: 'center',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  floatingCartBar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    ...shadows.lg,
  },
  cartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cartCount: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  cartPrice: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
  },
  cartButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
});
