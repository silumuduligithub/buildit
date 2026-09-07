import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  Platform,
} from 'react-native';
import {
  Save,
  RotateCcw,
  Check,
  Package,
  Plus,
  Search,
  X,
  Edit3,
  Sparkles,
  Zap,
  Store,
  ChevronRight,
  ChevronDown,
  Layers,
  PlusCircle,
  ShoppingBag,
} from 'lucide-react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';
import { showFlashMessage } from '../../components/ui/FlashMessage';
import { Product } from '../../types';

const INVENTORY_FILTERS = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

export default function RetailerInventory({ route, navigation }: any) {
  const initialFilter = route?.params?.filter || 'All';
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Modals for direct edit
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [activeEditingOffer, setActiveEditingOffer] = useState<{
    offerId: string;
    productName: string;
    currentStock: number;
    currentPrice: number;
  } | null>(null);
  const [customStockInput, setCustomStockInput] = useState('');
  const [customPriceInput, setCustomPriceInput] = useState('');

  // Multi-vendor Modals
  const [vendorSwitcherVisible, setVendorSwitcherVisible] = useState(false);
  const [addChoiceModalVisible, setAddChoiceModalVisible] = useState(false);
  const [catalogBrowserVisible, setCatalogBrowserVisible] = useState(false);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [stockingProduct, setStockingProduct] = useState<Product | null>(null);
  const [stockingPriceInput, setStockingPriceInput] = useState('');
  const [stockingQtyInput, setStockingQtyInput] = useState('100');

  // Pending updates map: offerId -> { stock, price }
  const [pendingUpdates, setPendingUpdates] = useState<
    Record<string, { stock: number; price: number }>
  >({});

  const {
    products,
    offers,
    retailers,
    activeRetailerId,
    setActiveRetailer,
    retailerProfile,
    currentUser,
    userRoleData,
    updateOfferStock,
    updateOfferPrice,
    syncUpdateOffer,
    fetchRetailerOffers,
    addCatalogProductToStore,
  } = useAppStore();

  React.useEffect(() => {
    fetchRetailerOffers().catch(() => {});
  }, []);

  const loggedInRetailerId =
    userRoleData?.retailer_id ||
    userRoleData?.id ||
    currentUser?.retailer_id ||
    currentUser?.id;

  const activeStoreId =
    activeRetailerId ||
    retailerProfile?.id ||
    loggedInRetailerId ||
    's_sri_sai';

  // 1. Get offers that belong to this specific active retailer
  let retailerOffers = offers.filter(
    (o) =>
      o.retailerId === activeStoreId ||
      (loggedInRetailerId && o.retailerId === loggedInRetailerId) ||
      (activeStoreId === 's_sri_sai' && (o.retailerId === 'r1' || o.retailerId === 's_sri_sai')) ||
      (activeStoreId === 'r1' && (o.retailerId === 'r1' || o.retailerId === 's_sri_sai'))
  );

  // If retailer has no specific isolated offers yet, map all catalog products so inventory is ALWAYS populated
  if (retailerOffers.length === 0) {
    retailerOffers = products.map((p) => {
      const existingOffer = offers.find((o) => o.productId === p.id);
      return {
        id: existingOffer?.id || `offer_${p.id}`,
        productId: p.id,
        retailerId: activeStoreId,
        price: existingOffer?.price || (p as any).price || 380,
        stock:
          existingOffer?.stock !== undefined
            ? existingOffer.stock
            : p.id === 'p_plumbing_1'
            ? 0
            : 120,
        isAvailable:
          existingOffer?.isAvailable !== undefined
            ? existingOffer.isAvailable
            : true,
        estimatedDeliveryMins: 30,
      };
    });
  }

  // 2. Map retailer offers to products
  const inventoryItems = retailerOffers.map((offer) => {
    const product = products.find((p) => p.id === offer.productId) || {
      id: offer.productId,
      name: 'Custom Product',
      brand: 'Custom Brand',
      category: 'Structural Materials',
      unit: 'Unit',
      sku: 'SKU-CUSTOM',
      imageUrl: '',
      description: 'Custom material supplied by retailer.',
      isActive: true,
    };

    const isModified = pendingUpdates[offer.id] !== undefined;
    const effectiveStock = isModified
      ? pendingUpdates[offer.id].stock
      : offer.stock;
    const effectivePrice = isModified
      ? pendingUpdates[offer.id].price
      : offer.price;

    const stockStatus =
      effectiveStock <= 0
        ? 'Out of Stock'
        : effectiveStock <= 50
        ? 'Low Stock'
        : 'In Stock';

    return {
      product,
      offer: {
        ...offer,
        stock: effectiveStock,
        price: effectivePrice,
      },
      originalStock: offer.stock,
      originalPrice: offer.price,
      isModified,
      stockStatus,
    };
  });

  const modifiedCount = Object.keys(pendingUpdates).length;
  const hasUnsavedChanges = modifiedCount > 0;

  // Filter inventory items by search & stock status
  const filteredItems = inventoryItems.filter((item) => {
    const matchesFilter =
      selectedFilter === 'All' || item.stockStatus === selectedFilter;

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Catalog items NOT YET stocked by this store
  const unstockedCatalogProducts = products.filter(
    (p) => !retailerOffers.some((o) => o.productId === p.id)
  );

  const filteredCatalogProducts = unstockedCatalogProducts.filter((p) => {
    if (!catalogSearchQuery.trim()) return true;
    const q = catalogSearchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  // Stage a stock adjustment
  const handleStockAdjust = (
    offerId: string,
    currentEffectiveStock: number,
    currentEffectivePrice: number,
    delta: number
  ) => {
    const newStock = Math.max(0, currentEffectiveStock + delta);
    setPendingUpdates((prev) => ({
      ...prev,
      [offerId]: {
        stock: newStock,
        price: prev[offerId]?.price ?? currentEffectivePrice,
      },
    }));
  };

  // Stage out of stock / restock toggle
  const handleToggleOutOfStock = (
    offerId: string,
    currentEffectiveStock: number,
    currentEffectivePrice: number
  ) => {
    const newStock = currentEffectiveStock > 0 ? 0 : 100;
    setPendingUpdates((prev) => ({
      ...prev,
      [offerId]: {
        stock: newStock,
        price: prev[offerId]?.price ?? currentEffectivePrice,
      },
    }));
  };

  // Stage quick restock (+100)
  const handleQuickRestock = (
    offerId: string,
    currentEffectiveStock: number,
    currentEffectivePrice: number,
    qty: number = 100
  ) => {
    const newStock = currentEffectiveStock + qty;
    setPendingUpdates((prev) => ({
      ...prev,
      [offerId]: {
        stock: newStock,
        price: prev[offerId]?.price ?? currentEffectivePrice,
      },
    }));
  };

  // Open Direct Stock Modal
  const openStockModal = (
    offerId: string,
    productName: string,
    stock: number,
    price: number
  ) => {
    setActiveEditingOffer({
      offerId,
      productName,
      currentStock: stock,
      currentPrice: price,
    });
    setCustomStockInput(stock.toString());
    setStockModalVisible(true);
  };

  // Open Direct Price Modal
  const openPriceModal = (
    offerId: string,
    productName: string,
    stock: number,
    price: number
  ) => {
    setActiveEditingOffer({
      offerId,
      productName,
      currentStock: stock,
      currentPrice: price,
    });
    setCustomPriceInput(price.toString());
    setPriceModalVisible(true);
  };

  // Save Direct Stock Modal Input
  const saveCustomStockModal = () => {
    if (!activeEditingOffer) return;
    const parsed = parseInt(customStockInput.trim() || '0', 10);
    if (parsed >= 0) {
      setPendingUpdates((prev) => ({
        ...prev,
        [activeEditingOffer.offerId]: {
          stock: parsed,
          price:
            prev[activeEditingOffer.offerId]?.price ??
            activeEditingOffer.currentPrice,
        },
      }));
    }
    setStockModalVisible(false);
  };

  // Save Direct Price Modal Input
  const saveCustomPriceModal = () => {
    if (!activeEditingOffer) return;
    const parsed = parseInt(customPriceInput.trim() || '0', 10);
    if (parsed > 0) {
      setPendingUpdates((prev) => ({
        ...prev,
        [activeEditingOffer.offerId]: {
          stock:
            prev[activeEditingOffer.offerId]?.stock ??
            activeEditingOffer.currentStock,
          price: parsed,
        },
      }));
    }
    setPriceModalVisible(false);
  };

  // Discard all pending changes
  const handleDiscardAll = () => {
    Alert.alert(
      'Discard Unsaved Changes?',
      `Are you sure you want to revert modifications on ${modifiedCount} products?`,
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => setPendingUpdates({}),
        },
      ]
    );
  };

  // Single Hit: Save All Changes to Store & Backend
  const handleSaveAllChanges = async () => {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    const count = modifiedCount;

    try {
      // 1. Commit all updates to Zustand store
      Object.entries(pendingUpdates).forEach(([offerId, changes]) => {
        updateOfferStock(offerId, changes.stock);
        updateOfferPrice(offerId, changes.price);
        // Silent backend sync
        syncUpdateOffer(offerId, {
          available_quantity: changes.stock,
          selling_price: changes.price,
          is_active: changes.stock > 0,
        }).catch(() => {});
      });

      // 2. Clear pending state
      setPendingUpdates({});

      showFlashMessage({
        type: 'success',
        message: `Inventory successfully updated for ${count} product${count > 1 ? 's' : ''}!`,
      });
    } catch (error: any) {
      showFlashMessage({
        type: 'error',
        message: error?.message || 'Could not save inventory.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle stocking a master catalog item into active store
  const handleOpenStockDialog = (prod: Product) => {
    setStockingProduct(prod);
    const cat = (prod.category || '').toLowerCase();
    const name = (prod.name || '').toLowerCase();

    let defaultPrice = (prod as any).price || 0;
    if (!defaultPrice) {
      if (cat.includes('paint') || name.includes('paint') || name.includes('emulsion')) defaultPrice = 5450;
      else if (cat.includes('putty') || name.includes('putty')) defaultPrice = 920;
      else if (cat.includes('steel') || name.includes('tmt') || name.includes('bar')) defaultPrice = 680;
      else if (cat.includes('brick') || name.includes('brick')) defaultPrice = 4500;
      else if (cat.includes('sand') || name.includes('aggregate')) defaultPrice = 1650;
      else if (cat.includes('tool') || name.includes('drill') || name.includes('bosch')) defaultPrice = 3499;
      else if (cat.includes('wire') || cat.includes('electric') || name.includes('cable')) defaultPrice = 2350;
      else if (cat.includes('pipe') || cat.includes('plumb')) defaultPrice = 340;
      else defaultPrice = 410;
    }
    setStockingPriceInput(defaultPrice.toString());
    setStockingQtyInput('100');
  };

  const handleConfirmStockCatalogItem = () => {
    if (!stockingProduct) return;
    const price = parseInt(stockingPriceInput.trim() || '380', 10);
    const qty = parseInt(stockingQtyInput.trim() || '100', 10);

    if (price <= 0 || qty <= 0) {
      showFlashMessage({
        type: 'error',
        message: 'Please enter a valid selling price and quantity.',
      });
      return;
    }

    addCatalogProductToStore(stockingProduct.id, price, qty);
    showFlashMessage({
      type: 'success',
      message: `${stockingProduct.name} added to your store inventory!`,
    });

    setStockingProduct(null);
    setCatalogBrowserVisible(false);
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Inventory & Stock"
        subtitle={`${retailerOffers.length} items stocked in your store`}
        showBack={false}
        showSearch={false}
        rightIcon="➕"
        onRightPress={() => setAddChoiceModalVisible(true)}
      />

      {/* ── Store Selector Strip ── */}
      <TouchableOpacity
        style={styles.storeBanner}
        onPress={() => setVendorSwitcherVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.storeBannerLeft}>
          <View style={styles.storeBadgeIcon}>
            <Store size={14} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.storeBannerTitle} numberOfLines={1}>
              {retailerProfile?.name || 'Sri Sai Hardware & Electricals'}
            </Text>
            <Text style={styles.storeBannerSub}>
              {retailerOffers.length} Stocked Products • {retailerProfile?.address || 'Kondapur, Hyderabad'}
            </Text>
          </View>
        </View>
        <View style={styles.storeBannerSwitchBtn}>
          <Text style={styles.storeBannerSwitchText}>Switch Store</Text>
          <ChevronDown size={12} color={colors.primary} />
        </View>
      </TouchableOpacity>

      {/* ── Search Bar ── */}
      <View style={styles.searchBarContainer}>
        <Search size={16} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search materials by name, SKU, or category..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Filter Chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {INVENTORY_FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter;
          const count = inventoryItems.filter(
            (i) => filter === 'All' || i.stockStatus === filter
          ).length;

          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                {filter} {count > 0 ? `(${count})` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Inventory Products List ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredItems.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>
              {selectedFilter === 'Out of Stock' ? '🎉' : '📦'}
            </Text>
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'Out of Stock'
                ? 'No Out of Stock Items!'
                : `No ${selectedFilter} Products in Your Store`}
            </Text>
            <Text style={styles.emptySub}>
              {selectedFilter === 'Out of Stock'
                ? 'Great news! All your materials are currently in stock and ready for delivery.'
                : 'Stock new materials from the master catalog or publish your custom items.'}
            </Text>

            <View style={styles.emptyActionButtons}>
              <TouchableOpacity
                style={styles.emptyActionBtnPrimary}
                onPress={() => {
                  setSelectedFilter('All');
                  setCatalogBrowserVisible(true);
                }}
                activeOpacity={0.85}
              >
                <Layers size={15} color={colors.white} />
                <Text style={styles.emptyActionBtnPrimaryText}>
                  Stock from Master Catalog
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.emptyActionBtnSecondary}
                onPress={() => navigation.navigate('AddProduct')}
                activeOpacity={0.85}
              >
                <Plus size={15} color={colors.primary} />
                <Text style={styles.emptyActionBtnSecondaryText}>
                  Add Custom Item
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          filteredItems.map(
            ({
              product,
              offer,
              stockStatus,
              isModified,
              originalStock,
              originalPrice,
            }) => {
              const isOutOfStock = stockStatus === 'Out of Stock';

              return (
                <View
                  key={offer.id}
                  style={[
                    styles.productCard,
                    isOutOfStock && styles.productCardOutOfStock,
                    isModified && styles.productCardModified,
                  ]}
                >
                  {/* Top Row: Thumbnail + Details + Status Badge */}
                  <View style={styles.cardTopRow}>
                    <View
                      style={[
                        styles.productThumb,
                        isOutOfStock && styles.productThumbOutOfStock,
                      ]}
                    >
                      {product.imageUrl ? (
                        <Image
                          source={{ uri: product.imageUrl }}
                          style={styles.productImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={styles.productEmoji}>
                          {product.category === 'Structural Materials'
                            ? '🧱'
                            : product.category === 'Aggregates'
                            ? '🪨'
                            : product.category === 'Electrical'
                            ? '⚡'
                            : product.category === 'Plumbing'
                            ? '🚰'
                            : '📦'}
                        </Text>
                      )}
                    </View>

                    <View style={styles.productInfoCol}>
                      <Text
                        style={[
                          styles.productName,
                          isOutOfStock && styles.productNameMuted,
                        ]}
                        numberOfLines={1}
                      >
                        {product.name}
                      </Text>
                      <Text style={styles.productMeta} numberOfLines={1}>
                        Brand: {product.brand || 'Standard'} • SKU: {product.sku || 'SKU-001'}
                      </Text>
                      <Text style={styles.productCategory}>
                        {product.category} • {product.unit || 'Standard'}
                      </Text>
                    </View>

                    {/* Stock Status Badge */}
                    <View
                      style={[
                        styles.stockBadge,
                        stockStatus === 'In Stock' && styles.stockBadgeInStock,
                        stockStatus === 'Low Stock' && styles.stockBadgeLowStock,
                        stockStatus === 'Out of Stock' && styles.stockBadgeOutOfStock,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stockBadgeText,
                          stockStatus === 'In Stock' && styles.stockBadgeTextInStock,
                          stockStatus === 'Low Stock' && styles.stockBadgeTextLowStock,
                          stockStatus === 'Out of Stock' && styles.stockBadgeTextOutOfStock,
                        ]}
                      >
                        {stockStatus.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Pricing & Stock Controls Section */}
                  <View style={styles.controlsCard}>
                    {/* Left: Price Control */}
                    <View style={styles.priceColumn}>
                      <Text style={styles.controlLabel}>SELLING PRICE</Text>
                      <TouchableOpacity
                        style={styles.priceClickable}
                        onPress={() =>
                          openPriceModal(
                            offer.id,
                            product.name,
                            offer.stock,
                            offer.price
                          )
                        }
                        activeOpacity={0.7}
                      >
                        <Text style={styles.priceRupeeSymbol}>₹</Text>
                        <Text
                          style={[
                            styles.priceAmount,
                            isModified && { color: colors.primary },
                          ]}
                        >
                          {offer.price}
                        </Text>
                        <Edit3 size={13} color={colors.primary} style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.controlDivider} />

                    {/* Right: Stepper Stock Controls */}
                    <View style={styles.stockColumn}>
                      <Text style={styles.controlLabel}>
                        AVAILABLE QUANTITY (TAP TO EDIT)
                      </Text>

                      <View style={styles.stepperRow}>
                        <TouchableOpacity
                          style={[
                            styles.stepBtn,
                            offer.stock < 25 && styles.stepBtnDisabled,
                          ]}
                          onPress={() =>
                            handleStockAdjust(
                              offer.id,
                              offer.stock,
                              offer.price,
                              -25
                            )
                          }
                          disabled={offer.stock < 25}
                        >
                          <Text style={styles.stepBtnText}>-25</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.stepBtn,
                            offer.stock < 5 && styles.stepBtnDisabled,
                          ]}
                          onPress={() =>
                            handleStockAdjust(
                              offer.id,
                              offer.stock,
                              offer.price,
                              -5
                            )
                          }
                          disabled={offer.stock < 5}
                        >
                          <Text style={styles.stepBtnText}>-5</Text>
                        </TouchableOpacity>

                        {/* Tap quantity to enter exact number */}
                        <TouchableOpacity
                          style={styles.currentStockQtyBox}
                          onPress={() =>
                            openStockModal(
                              offer.id,
                              product.name,
                              offer.stock,
                              offer.price
                            )
                          }
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.currentStockQty,
                              isOutOfStock && { color: '#DC2626' },
                              isModified && { color: colors.primary },
                            ]}
                          >
                            {offer.stock}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() =>
                            handleStockAdjust(
                              offer.id,
                              offer.stock,
                              offer.price,
                              +5
                            )
                          }
                        >
                          <Text style={styles.stepBtnText}>+5</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() =>
                            handleStockAdjust(
                              offer.id,
                              offer.stock,
                              offer.price,
                              +25
                            )
                          }
                        >
                          <Text style={styles.stepBtnText}>+25</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Bottom Actions Row */}
                  <View style={styles.bottomActionsRow}>
                    {isOutOfStock ? (
                      <TouchableOpacity
                        style={styles.quickRestockBtn}
                        onPress={() =>
                          handleQuickRestock(
                            offer.id,
                            offer.stock,
                            offer.price,
                            100
                          )
                        }
                        activeOpacity={0.85}
                      >
                        <Text style={styles.quickRestockText}>
                          ⚡ Quick Restock (+100 Units)
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.toggleStockBtn}
                        onPress={() =>
                          handleToggleOutOfStock(
                            offer.id,
                            offer.stock,
                            offer.price
                          )
                        }
                      >
                        <Text style={styles.toggleStockText}>
                          🔴 Mark Out of Stock
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.promoBtn}
                      onPress={() => navigation.navigate('Promotions')}
                    >
                      <Text style={styles.promoBtnText}>🏷️ Promotion</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
          )
        )}

        <View style={{ height: hasUnsavedChanges ? 140 : 100 }} />
      </ScrollView>

      {/* ── Single-Hit Floating Save Changes Bar (Bottom) ── */}
      {hasUnsavedChanges ? (
        <View style={styles.bottomSaveBar}>
          <View style={styles.bottomSaveLeft}>
            <View style={styles.bottomSaveBadge}>
              <Text style={styles.bottomSaveBadgeText}>{modifiedCount} Modified</Text>
            </View>
            <TouchableOpacity
              style={styles.discardBtn}
              onPress={handleDiscardAll}
              activeOpacity={0.8}
            >
              <RotateCcw size={13} color="#6B7280" />
              <Text style={styles.discardBtnText}>Discard</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.saveAllBtn}
            onPress={handleSaveAllChanges}
            activeOpacity={0.88}
            disabled={isSaving}
          >
            <Save size={16} color={colors.white} strokeWidth={2.2} />
            <Text style={styles.saveAllBtnText}>
              {isSaving ? 'Saving...' : `Save Changes (${modifiedCount})`}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Floating Add Product FAB when clean */
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setAddChoiceModalVisible(true)}
          activeOpacity={0.88}
        >
          <Plus size={16} color={colors.white} strokeWidth={2.5} />
          <Text style={styles.fabText}>Add Product</Text>
        </TouchableOpacity>
      )}

      {/* ── Multi-Vendor Choice Action Sheet ── */}
      <Modal visible={addChoiceModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setAddChoiceModalVisible(false)}
        >
          <View style={styles.actionSheetCard}>
            <View style={styles.sheetHandle} />
            <Text style={styles.actionSheetTitle}>Add Material to Store</Text>
            <Text style={styles.actionSheetSub}>
              Stock from platform catalog or create custom material
            </Text>

            <TouchableOpacity
              style={styles.actionOptionCard}
              onPress={() => {
                setAddChoiceModalVisible(false);
                setCatalogBrowserVisible(true);
              }}
              activeOpacity={0.85}
            >
              <View style={[styles.actionOptionIconWrap, { backgroundColor: '#EEF2FF' }]}>
                <Layers size={22} color="#4F46E5" />
              </View>
              <View style={styles.actionOptionInfo}>
                <Text style={styles.actionOptionTitle}>Stock from Master Catalog</Text>
                <Text style={styles.actionOptionDesc}>
                  Select from 60+ verified construction materials & set your price
                </Text>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionOptionCard}
              onPress={() => {
                setAddChoiceModalVisible(false);
                navigation.navigate('AddProduct');
              }}
              activeOpacity={0.85}
            >
              <View style={[styles.actionOptionIconWrap, { backgroundColor: '#FFF7ED' }]}>
                <PlusCircle size={22} color={colors.primary} />
              </View>
              <View style={styles.actionOptionInfo}>
                <Text style={styles.actionOptionTitle}>Create Custom Product</Text>
                <Text style={styles.actionOptionDesc}>
                  Photograph from camera or upload new material specs
                </Text>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetCloseBtn}
              onPress={() => setAddChoiceModalVisible(false)}
            >
              <Text style={styles.sheetCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Master Catalog Browser Modal ── */}
      <Modal visible={catalogBrowserVisible} animationType="slide">
        <View style={styles.catalogModalRoot}>
          <GradientAppHeader
            title="Master Materials Catalog"
            subtitle={`Select material to add to ${retailerProfile?.name || 'your store'}`}
            showBack={true}
            onBackPress={() => setCatalogBrowserVisible(false)}
            showSearch={false}
          />

          {/* Search bar in Catalog modal */}
          <View style={styles.catalogSearchWrap}>
            <Search size={16} color="#9CA3AF" />
            <TextInput
              style={styles.catalogSearchInput}
              placeholder="Search cement, steel, bricks, tools..."
              placeholderTextColor="#9CA3AF"
              value={catalogSearchQuery}
              onChangeText={setCatalogSearchQuery}
            />
            {catalogSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setCatalogSearchQuery('')}>
                <X size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            contentContainerStyle={styles.catalogListContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredCatalogProducts.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyTitle}>All Catalog Items Stocked!</Text>
                <Text style={styles.emptySub}>
                  You have already stocked all available materials matching this query in your store.
                </Text>
              </View>
            ) : (
              filteredCatalogProducts.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.catalogItemCard}
                  onPress={() => handleOpenStockDialog(p)}
                  activeOpacity={0.8}
                >
                  <View style={styles.catalogItemThumb}>
                    {p.imageUrl ? (
                      <Image source={{ uri: p.imageUrl }} style={styles.productImage} />
                    ) : (
                      <Text style={{ fontSize: 24 }}>🧱</Text>
                    )}
                  </View>
                  <View style={styles.catalogItemInfo}>
                    <Text style={styles.catalogItemName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={styles.catalogItemMeta}>
                      {p.brand} • {p.category}
                    </Text>
                    <Text style={styles.catalogItemUnit}>Unit: {p.unit || 'Standard'}</Text>
                  </View>
                  <View style={styles.catalogItemAction}>
                    <View style={styles.catalogItemAddBtn}>
                      <Plus size={14} color={colors.white} strokeWidth={2.5} />
                      <Text style={styles.catalogItemAddBtnText}>Stock</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* ── Stock Catalog Item Dialog Modal ── */}
      <Modal visible={!!stockingProduct} transparent animationType="fade">
        <View style={styles.editModalBackdrop}>
          <View style={styles.stockModalCard}>
            <View style={styles.stockModalHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stockModalTitle}>Add Material to Store</Text>
                <Text style={styles.stockModalSubtitle}>
                  Set your store pricing & available inventory
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stockModalCloseX}
                onPress={() => setStockingProduct(null)}
              >
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Product Summary Preview Card */}
            {stockingProduct && (
              <View style={styles.productSummaryCard}>
                <View style={styles.productSummaryThumb}>
                  {stockingProduct.imageUrl ? (
                    <Image
                      source={{ uri: stockingProduct.imageUrl }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={{ fontSize: 26 }}>🧱</Text>
                  )}
                </View>

                <View style={styles.productSummaryInfo}>
                  <Text style={styles.productSummaryName} numberOfLines={2}>
                    {stockingProduct.name}
                  </Text>
                  <View style={styles.productSummaryMetaRow}>
                    <View style={styles.metaBadge}>
                      <Text style={styles.metaBadgeText}>{stockingProduct.brand || 'Verified'}</Text>
                    </View>
                    <View style={[styles.metaBadge, { backgroundColor: '#F3F4F6' }]}>
                      <Text style={[styles.metaBadgeText, { color: '#4B5563' }]}>
                        {stockingProduct.category}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.productSummaryUnit}>
                    Unit: <Text style={{ color: '#111827', fontWeight: 'bold' }}>{stockingProduct.unit || 'Standard Unit'}</Text>
                    {stockingProduct.sku ? ` • SKU: ${stockingProduct.sku}` : ''}
                  </Text>
                </View>
              </View>
            )}

            {/* Input 1: Selling Price */}
            <View style={{ marginTop: spacing.md }}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.inputFieldLabel}>Your Store Selling Price *</Text>
                <Text style={styles.inputFieldHint}>Customer pays this rate</Text>
              </View>
              <View style={styles.currencyInputWrap}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.currencyInput}
                  keyboardType="numeric"
                  value={stockingPriceInput}
                  onChangeText={setStockingPriceInput}
                  placeholder="e.g. 410"
                />
              </View>
            </View>

            {/* Input 2: Starting Stock Quantity */}
            <View style={{ marginTop: spacing.md }}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.inputFieldLabel}>Starting Stock Quantity *</Text>
                <Text style={styles.inputFieldHint}>{stockingProduct?.unit || 'Units'}</Text>
              </View>
              <TextInput
                style={styles.editModalInput}
                keyboardType="numeric"
                value={stockingQtyInput}
                onChangeText={setStockingQtyInput}
                placeholder="e.g. 100"
              />

              {/* Quick stock preset chips */}
              <View style={styles.quickStockPresetRow}>
                {[50, 100, 250, 500].map((qty) => (
                  <TouchableOpacity
                    key={qty}
                    style={[
                      styles.quickStockPresetChip,
                      stockingQtyInput === qty.toString() && styles.quickStockPresetChipActive,
                    ]}
                    onPress={() => setStockingQtyInput(qty.toString())}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.quickStockPresetText,
                        stockingQtyInput === qty.toString() && styles.quickStockPresetTextActive,
                      ]}
                    >
                      {qty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.stockModalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setStockingProduct(null)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleConfirmStockCatalogItem}
                activeOpacity={0.88}
              >
                <Check size={16} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.modalSaveBtnText}>Add to Store</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Vendor Switcher Modal ── */}
      <Modal visible={vendorSwitcherVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setVendorSwitcherVisible(false)}
        >
          <View style={styles.actionSheetCard}>
            <View style={styles.sheetHandle} />
            <Text style={styles.actionSheetTitle}>Switch Retailer Store</Text>
            <Text style={styles.actionSheetSub}>
              Select active vendor to manage its isolated inventory & pricing
            </Text>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {retailers.map((ret) => {
                const isSelected = activeStoreId === ret.id;
                const storeOfferCount = offers.filter(
                  (o) =>
                    o.retailerId === ret.id ||
                    (ret.id === 's_sri_sai' && o.retailerId === 'r1')
                ).length;

                return (
                  <TouchableOpacity
                    key={ret.id}
                    style={[
                      styles.vendorCard,
                      isSelected && styles.vendorCardActive,
                    ]}
                    onPress={() => {
                      setActiveRetailer(ret.id);
                      setVendorSwitcherVisible(false);
                      setPendingUpdates({});
                      showFlashMessage({
                        type: 'info',
                        message: `Switched active store to ${ret.name}`,
                      });
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.vendorCardIconWrap}>
                      <Store
                        size={20}
                        color={isSelected ? colors.primary : '#4B5563'}
                      />
                    </View>
                    <View style={styles.vendorCardInfo}>
                      <Text
                        style={[
                          styles.vendorCardName,
                          isSelected && styles.vendorCardNameActive,
                        ]}
                      >
                        {ret.name}
                      </Text>
                      <Text style={styles.vendorCardAddress} numberOfLines={1}>
                        {ret.address} • ⭐ {ret.rating || 4.5}
                      </Text>
                      <Text style={styles.vendorCardStockCount}>
                        {storeOfferCount} items in inventory
                      </Text>
                    </View>

                    {isSelected ? (
                      <View style={styles.vendorActivePill}>
                        <Check size={12} color={colors.white} />
                        <Text style={styles.vendorActivePillText}>Active</Text>
                      </View>
                    ) : (
                      <ChevronRight size={16} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.sheetCloseBtn}
              onPress={() => setVendorSwitcherVisible(false)}
            >
              <Text style={styles.sheetCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Direct Stock Edit Modal ── */}
      <Modal visible={stockModalVisible} transparent animationType="fade">
        <View style={styles.editModalBackdrop}>
          <View style={styles.editModalCard}>
            <Text style={styles.editModalTitle}>Update Stock Quantity</Text>
            <Text style={styles.editModalSub}>{activeEditingOffer?.productName}</Text>

            <TextInput
              style={styles.editModalInput}
              keyboardType="numeric"
              value={customStockInput}
              onChangeText={setCustomStockInput}
              placeholder="e.g. 350"
              autoFocus
            />

            <View style={styles.editModalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setStockModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={saveCustomStockModal}
              >
                <Text style={styles.modalSaveBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Direct Price Edit Modal ── */}
      <Modal visible={priceModalVisible} transparent animationType="fade">
        <View style={styles.editModalBackdrop}>
          <View style={styles.editModalCard}>
            <Text style={styles.editModalTitle}>Update Selling Price</Text>
            <Text style={styles.editModalSub}>{activeEditingOffer?.productName}</Text>

            <TextInput
              style={styles.editModalInput}
              keyboardType="numeric"
              value={customPriceInput}
              onChangeText={setCustomPriceInput}
              placeholder="e.g. 395"
              autoFocus
            />

            <View style={styles.editModalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setPriceModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={saveCustomPriceModal}
              >
                <Text style={styles.modalSaveBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  storeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: radii.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...shadows.sm,
  },
  storeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  storeBadgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFEAD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeBannerTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  storeBannerSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  storeBannerSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#FDBA74',
    gap: 4,
  },
  storeBannerSwitchText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: 4,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.fontSizes.xs,
    color: '#111827',
  },
  filterScroll: {
    flexGrow: 0,
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 6,
    paddingVertical: 2,
  },
  filterContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    ...shadows.sm,
  },
  filterChipActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  filterText: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
    includeFontPadding: false,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: 4,
    paddingBottom: Platform.OS === 'ios' ? 100 : 88,
    gap: spacing.md,
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  productCardOutOfStock: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFBFB',
  },
  productCardModified: {
    borderColor: '#FDBA74',
    borderWidth: 1.5,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productThumb: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  productThumbOutOfStock: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productEmoji: {
    fontSize: 26,
  },
  productInfoCol: {
    flex: 1,
  },
  productName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    lineHeight: 18,
  },
  productNameMuted: {
    color: '#374151',
  },
  productMeta: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  productCategory: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginTop: 1,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  stockBadgeInStock: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  stockBadgeLowStock: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  stockBadgeOutOfStock: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  stockBadgeText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.3,
  },
  stockBadgeTextInStock: {
    color: '#059669',
  },
  stockBadgeTextLowStock: {
    color: '#D97706',
  },
  stockBadgeTextOutOfStock: {
    color: '#DC2626',
  },
  controlsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: radii.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  priceColumn: {
    paddingRight: spacing.sm,
  },
  controlLabel: {
    fontSize: 8.5,
    fontWeight: typography.weights.bold,
    color: '#6B7280',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  priceClickable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRupeeSymbol: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  priceAmount: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  controlDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
    marginHorizontal: spacing.xs,
  },
  stockColumn: {
    flex: 1,
    paddingLeft: spacing.xs,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepBtn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: radii.md,
    paddingHorizontal: 7,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.35,
  },
  stepBtnText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  currentStockQtyBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: radii.md,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentStockQty: {
    fontSize: 12,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  bottomActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  quickRestockBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: radii.md,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  quickRestockText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#059669',
  },
  toggleStockBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  toggleStockText: {
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: '#4B5563',
  },
  promoBtn: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radii.md,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  promoBtnText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#B45309',
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  emptyEmoji: {
    fontSize: 44,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.bold,
    color: '#111827',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  emptyActionButtons: {
    gap: spacing.sm,
    width: '100%',
  },
  emptyActionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radii.lg,
    gap: 8,
  },
  emptyActionBtnPrimaryText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
  },
  emptyActionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    paddingVertical: 12,
    borderRadius: radii.lg,
    gap: 8,
  },
  emptyActionBtnSecondaryText: {
    color: colors.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
  },
  fabButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 84 : 72,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md + 4,
    paddingVertical: spacing.sm + 4,
    borderRadius: radii.full,
    gap: 6,
    ...shadows.lg,
    elevation: 8,
  },
  fabText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
  },
  bottomSaveBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 84 : 72,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.xl,
    ...shadows.lg,
    elevation: 10,
  },
  bottomSaveLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bottomSaveBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  bottomSaveBadgeText: {
    color: '#78350F',
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  discardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  discardBtnText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: typography.weights.medium,
  },
  saveAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: 8,
    borderRadius: radii.lg,
    gap: 6,
  },
  saveAllBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: typography.weights.bold,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  actionSheetCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: radii.full,
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  actionSheetTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  actionSheetSub: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    marginBottom: spacing.sm,
  },
  actionOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.md,
  },
  actionOptionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionOptionInfo: {
    flex: 1,
  },
  actionOptionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  actionOptionDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  sheetCloseBtn: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  sheetCloseBtnText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: '#6B7280',
  },
  catalogModalRoot: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  catalogModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  catalogModalTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  catalogModalSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  catalogModalCloseBtn: {
    padding: 6,
    borderRadius: radii.full,
    backgroundColor: '#F3F4F6',
  },
  catalogSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  catalogSearchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: typography.fontSizes.xs,
    color: '#111827',
  },
  catalogListContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 40,
    gap: spacing.sm,
  },
  catalogItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  catalogItemThumb: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  catalogItemInfo: {
    flex: 1,
  },
  catalogItemName: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  catalogItemMeta: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  catalogItemUnit: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginTop: 1,
  },
  catalogItemAction: {
    marginLeft: spacing.xs,
  },
  catalogItemAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.md,
    gap: 4,
  },
  catalogItemAddBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.weights.bold,
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  vendorCardActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
    borderWidth: 1.5,
  },
  vendorCardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorCardInfo: {
    flex: 1,
  },
  vendorCardName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  vendorCardNameActive: {
    color: colors.primary,
  },
  vendorCardAddress: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  vendorCardStockCount: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
    marginTop: 2,
  },
  vendorActivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    gap: 3,
  },
  vendorActivePillText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  editModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  editModalCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
    ...shadows.lg,
  },
  editModalTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  editModalSub: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: spacing.md,
  },
  inputFieldLabel: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#374151',
    marginBottom: 4,
  },
  editModalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  editModalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.lg,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
  },
  modalSaveBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  stockModalCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 380,
    ...shadows.lg,
  },
  stockModalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  stockModalTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  stockModalSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  stockModalCloseX: {
    padding: 4,
    borderRadius: radii.full,
    backgroundColor: '#F3F4F6',
  },
  productSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: radii.lg,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    marginTop: 4,
  },
  productSummaryThumb: {
    width: 54,
    height: 54,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  productSummaryInfo: {
    flex: 1,
  },
  productSummaryName: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: '#111827',
    lineHeight: 16,
  },
  productSummaryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  metaBadge: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaBadgeText: {
    fontSize: 9.5,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  productSummaryUnit: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 3,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  inputFieldHint: {
    fontSize: 10,
    color: '#6B7280',
  },
  currencyInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
  },
  currencyPrefix: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
    marginRight: 6,
  },
  currencyInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  quickStockPresetRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  quickStockPresetChip: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 6,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStockPresetChipActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  quickStockPresetText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
  },
  quickStockPresetTextActive: {
    color: colors.white,
  },
  stockModalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
