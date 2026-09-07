import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
<<<<<<< HEAD
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { mockProducts, mockStores, mockOffers } from '../../services/mockData';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';
import PicklistModal, { PicklistItem } from '../../components/PicklistModal';
import AddToCartBottomSheet from '../../components/AddToCartBottomSheet';
=======
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  X,
  Zap,
  Package,
  Award,
  Filter,
} from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows } from '../../theme/colors';
import { mockProducts, mockStores, mockOffers } from '../../services/mockData';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';
import AddToCartBottomSheet from '../../components/AddToCartBottomSheet';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/ui/EmptyState';
>>>>>>> c2d4ce9 (api intigrated)

const BRAND_LIST = [
  { id: 'all', name: 'All Brands', logo: '🏛️' },
  { id: 'UltraTech', name: 'UltraTech', logo: '🏗️' },
  { id: 'Tata Tiscon', name: 'Tata Tiscon', logo: '🔩' },
  { id: 'JSW Steel', name: 'JSW Steel', logo: '⚙️' },
  { id: 'ACC', name: 'ACC Cement', logo: '🧱' },
  { id: 'Ramco', name: 'Ramco', logo: '🏢' },
  { id: 'Ambuja', name: 'Ambuja', logo: '🛡️' },
  { id: 'Asian Paints', name: 'Asian Paints', logo: '🎨' },
  { id: 'Bosch', name: 'Bosch', logo: '🔧' },
  { id: 'Finolex', name: 'Finolex', logo: '🚿' },
  { id: 'Havells', name: 'Havells', logo: '⚡' },
];

const GRADE_FILTERS = [
  { id: 'all', label: 'All Grades' },
  { id: '53 Grade', label: 'OPC 53 Grade' },
  { id: '550D', label: '550D Super Ductile' },
  { id: 'Waterproof', label: 'Water Repellent' },
  { id: 'Heavy Duty', label: 'Heavy Duty' },
];

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance (Best Match)', shortLabel: 'Relevance' },
  { id: 'price_asc', label: 'Price: Low to High', shortLabel: 'Price: Low ↑' },
  { id: 'price_desc', label: 'Price: High to Low', shortLabel: 'Price: High ↓' },
  { id: 'rating', label: 'Highest Rated (4.5+)', shortLabel: 'Top Rated' },
  { id: 'fastest', label: '⚡ Fastest Delivery (Under 30m)', shortLabel: 'Fast Delivery' },
];

const PRICE_MAP: Record<string, { price: number; mrp: number; image: string }> = {
  p_cement_1: {
    price: 380,
    mrp: 420,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
  },
  p_cement_2: {
    price: 360,
    mrp: 395,
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80',
  },
  p_cement_3: {
    price: 390,
    mrp: 430,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
  },
  p_cement_4: {
    price: 375,
    mrp: 410,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
  },
  p_cement_5: {
    price: 385,
    mrp: 425,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
  },
  p_steel_1: {
    price: 680,
    mrp: 750,
    image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&auto=format&fit=crop&q=80',
  },
  p_steel_2: {
    price: 540,
    mrp: 600,
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
  },
  p_sand_1: {
    price: 1650,
    mrp: 1800,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  },
  p_bricks_1: {
    price: 4500,
    mrp: 5000,
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80',
  },
  p_paint_1: {
    price: 5450,
    mrp: 6200,
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
  },
  p_plumbing_1: {
    price: 340,
    mrp: 380,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
  },
  p_electrical_1: {
    price: 2350,
    mrp: 2600,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
  },
  p_hardware_1: {
    price: 3499,
    mrp: 4299,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
  },
};

export default function CategoryProducts({ route, navigation }: any) {
  const categoryName = route?.params?.category || 'Structural Materials';
<<<<<<< HEAD
  const subCategoryName = route?.params?.sub || 'Cement';
  const { cart, addToCart, updateCartQuantity, removeFromCart } = useAppStore();
=======
  const subCategoryName = route?.params?.sub || 'Cement & Concrete';
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
    offers,
    retailers,
    fetchProducts,
  } = useAppStore();

  useEffect(() => {
    fetchProducts().catch(() => {});
  }, []);

  const [selectedBrand, setSelectedBrand] = useState('all');
<<<<<<< HEAD
  const [selectedPackSize, setSelectedPackSize] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
=======
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [expressOnly, setExpressOnly] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
>>>>>>> c2d4ce9 (api intigrated)
  const [selectedProductName, setSelectedProductName] = useState('');
  const [showAddSheet, setShowAddSheet] = useState(false);

  // Helper to get actual resolved price
  const getProductResolvedPrice = useCallback(
    (p: any): number => {
      const matchedOffer = offers.find((o) => o.productId === p.id);
      if (matchedOffer && typeof matchedOffer.price === 'number' && matchedOffer.price > 0) {
        return matchedOffer.price;
      }
      if ((p as any).price && typeof (p as any).price === 'number' && (p as any).price > 0) {
        return (p as any).price;
      }
      if (PRICE_MAP[p.id]?.price) {
        return PRICE_MAP[p.id].price;
      }
      return 380;
    },
    [offers]
  );

  // Filter products
  const filteredProducts = useMemo(() => {
    const sourceList = products.length > 0 ? products : mockProducts;
    const catLower = (categoryName || '').toLowerCase();
    const subLower = (subCategoryName || '').toLowerCase();

    let list = sourceList.filter((p) => {
      // 1. Category & Subcategory Match
      const pCat = (p.category || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      const pDesc = (p.description || '').toLowerCase();

      let matchesCat = true;
      if (catLower && catLower !== 'all') {
        if (catLower === 'cement' || subLower.includes('cement')) {
          matchesCat =
            pCat.includes('cement') ||
            pName.includes('cement') ||
            pCat.includes('structural');
        } else if (catLower === 'structural materials') {
          matchesCat =
            pCat.includes('structural') ||
            pCat.includes('heavy') ||
            pName.includes('cement') ||
            pName.includes('steel') ||
            pName.includes('sand') ||
            pName.includes('brick');
        } else if (catLower === 'finishing' || catLower === 'paints') {
          matchesCat =
            pCat.includes('finishing') ||
            pCat.includes('paint') ||
            pName.includes('paint') ||
            pName.includes('putty') ||
            pName.includes('tile');
        } else if (catLower === 'electrical') {
          matchesCat =
            pCat.includes('electrical') ||
            pName.includes('wire') ||
            pName.includes('switch') ||
            pName.includes('cable');
        } else if (catLower === 'plumbing') {
          matchesCat =
            pCat.includes('plumbing') ||
            pName.includes('pipe') ||
            pName.includes('tank') ||
            pName.includes('valve');
        } else if (catLower === 'hardware') {
          matchesCat =
            pCat.includes('hardware') ||
            pName.includes('drill') ||
            pName.includes('tool') ||
            pName.includes('anchor');
        } else {
          matchesCat = pCat.includes(catLower) || pName.includes(catLower);
        }
      }

      // 2. Brand Filter
      const pBrand = (p.brand || '').toLowerCase();
      const bFilter = selectedBrand.toLowerCase();
      const matchesBrand =
        bFilter === 'all' ||
        pBrand.includes(bFilter) ||
        bFilter.includes(pBrand) ||
        pName.includes(bFilter);

      // 3. Grade Filter
      const matchesGrade =
        selectedGrade === 'all' ||
        pName.toLowerCase().includes(selectedGrade.toLowerCase()) ||
        pDesc.toLowerCase().includes(selectedGrade.toLowerCase());

      return matchesCat && matchesBrand && matchesGrade;
    });

    // 4. Accurate Sorting
    if (selectedSort === 'price_asc') {
      list = [...list].sort(
        (a, b) => getProductResolvedPrice(a) - getProductResolvedPrice(b)
      );
    } else if (selectedSort === 'price_desc') {
      list = [...list].sort(
        (a, b) => getProductResolvedPrice(b) - getProductResolvedPrice(a)
      );
    } else if (selectedSort === 'rating') {
      list = [...list].sort(
        (a, b) => ((b as any).rating || 4.5) - ((a as any).rating || 4.5)
      );
    } else if (selectedSort === 'fastest') {
      list = [...list].sort((a, b) => {
        const offerA = offers.find((o) => o.productId === a.id);
        const offerB = offers.find((o) => o.productId === b.id);
        return (offerA?.estimatedDeliveryMins || 30) - (offerB?.estimatedDeliveryMins || 30);
      });
    }

    return list;
  }, [products, categoryName, subCategoryName, selectedBrand, selectedGrade, selectedSort, getProductResolvedPrice, offers]);

  const getProductQuantity = useCallback(
    (productId: string) =>
      cart
        .filter((item) => item.product.id === productId)
        .reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleAddProduct = useCallback(
    (product: (typeof mockProducts)[number]) => {
      const resolvedPrice = getProductResolvedPrice(product);
      const store = retailers[0] || mockStores[0];
      const offer =
        offers.find(
          (o) => o.productId === product.id && o.retailerId === store.id
        ) || {
          id: `offer-${product.id}-${store.id}`,
          productId: product.id,
          retailerId: store.id,
          price: resolvedPrice,
          stock: 500,
          isAvailable: true,
          estimatedDeliveryMins: 30,
        };

      syncAddToCart(product.id, offer.id, 1);
      setSelectedProductName(product.name);
      setShowAddSheet(true);
    },
    [syncAddToCart, retailers, offers, getProductResolvedPrice]
  );

  const handleDecreaseProduct = useCallback(
    (product: (typeof mockProducts)[number]) => {
      const matching = cart.filter((item) => item.product.id === product.id);
      if (!matching.length) return;
      const item = matching[0];
      if (item.quantity <= 1) {
        syncRemoveCartItem(item.id);
      } else {
        syncUpdateCartQuantity(item.id, item.quantity - 1);
      }
    },
    [cart, syncRemoveCartItem, syncUpdateCartQuantity]
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderProduct = useCallback(
    ({ item: product }: { item: (typeof mockProducts)[number] }) => {
      const matchedOffer = offers.find((o) => o.productId === product.id);
      const priceInfo = PRICE_MAP[product.id] || {
        price: 380,
        mrp: 420,
        image: '',
      };
      const resolvedPrice = getProductResolvedPrice(product);
      const resolvedMrp = (product as any).mrp || (matchedOffer ? Math.round(resolvedPrice * 1.15) : priceInfo.mrp);
      const resolvedImage = product.imageUrl || (product as any).image || priceInfo.image;
      const quantity = getProductQuantity(product.id);

      return (
        <ProductCard
          id={product.id}
          name={product.name}
          brand={product.brand}
          unit={product.unit}
          price={resolvedPrice}
          mrp={resolvedMrp}
          quantity={quantity}
          imageUrl={resolvedImage}
          onPress={() =>
            navigation.navigate('ProductDetail', { productId: product.id })
          }
          onAdd={() => handleAddProduct(product)}
          onRemove={() => handleDecreaseProduct(product)}
          onCompare={() =>
            navigation.navigate('StoreCompare', {
              productId: product.id,
              productName: product.name,
            })
          }
        />
      );
    },
    [
      getProductQuantity,
      handleAddProduct,
      handleDecreaseProduct,
      getProductResolvedPrice,
      navigation,
      offers,
    ]
  );

  const getProductQuantity = (productId: string) =>
    cart
      .filter((item) => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);

  const handleAddProduct = (product: (typeof mockProducts)[number], price: number) => {
    const store = mockStores[0];
    const offer =
      mockOffers.find((o) => o.productId === product.id && o.retailerId === store.id) || {
        id: `offer-${product.id}-${store.id}`,
        productId: product.id,
        retailerId: store.id,
        price,
        stock: 500,
        isAvailable: true,
        estimatedDeliveryMins: 30,
      };

    addToCart({
      id: `cart-${offer.id}-${Date.now()}`,
      offer,
      product,
      retailer: store,
      quantity: 1,
    });
    setSelectedProductName(product.name);
    setShowAddSheet(true);
  };

  const handleDecreaseProduct = (product: (typeof mockProducts)[number]) => {
    const matching = cart.filter((item) => item.product.id === product.id);
    if (!matching.length) return;

    const item = matching[0];
    if (item.quantity <= 1) removeFromCart(item.id);
    else updateCartQuantity(item.id, item.quantity - 1);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title={subCategoryName || categoryName}
        subtitle={`${filteredProducts.length} materials available in Kondapur`}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showSearch={false}
      />

      {/* ── 1. Horizontal Brand Scroll Bar (Ecommerce Feature) ── */}
      <View style={styles.brandBarSection}>
        <Text style={styles.brandBarTitle}>Filter by Manufacturer / Brand</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandsScroll}
        >
<<<<<<< HEAD
          <Text style={[styles.filterChipText, selectedSort !== 'relevance' && styles.filterChipTextActive]}>
            {getSortLabel()}
          </Text>
        </TouchableOpacity>

        {/* 2. Brand Picklist Button */}
        <TouchableOpacity
          style={[styles.filterChip, selectedBrand !== 'all' && styles.filterChipActive]}
          onPress={() => setActivePicklist('brand')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterChipText, selectedBrand !== 'all' && styles.filterChipTextActive]}>
            {getBrandLabel()}
          </Text>
        </TouchableOpacity>

        {/* 3. Pack Size Picklist Button */}
        <TouchableOpacity
          style={[styles.filterChip, selectedPackSize !== 'all' && styles.filterChipActive]}
          onPress={() => setActivePicklist('pack_size')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterChipText, selectedPackSize !== 'all' && styles.filterChipTextActive]}>
            {getPackSizeLabel()}
          </Text>
        </TouchableOpacity>

        {/* 4. Filter Picklist Button */}
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter !== 'all' && styles.filterChipActive]}
          onPress={() => setActivePicklist('filter')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterChipText, selectedFilter !== 'all' && styles.filterChipTextActive]}>
            {getFilterLabel()}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Products List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.productGrid}>
          {filteredProducts.map((product) => {
            const price = product.name.includes('UltraTech')
              ? 410
              : product.name.includes('Ramco')
              ? 395
              : product.name.includes('ACC')
              ? 405
              : product.name.includes('Ambuja')
              ? 400
              : product.name.includes('Steel')
              ? 680
              : 340;
            const quantity = getProductQuantity(product.id);
=======
          {BRAND_LIST.map((b) => {
            const isSelected = selectedBrand === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                style={[
                  styles.brandChip,
                  isSelected ? styles.brandChipActive : styles.brandChipInactive,
                ]}
                onPress={() => setSelectedBrand(b.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.brandLogo}>{b.logo}</Text>
                <Text
                  style={[
                    styles.brandName,
                    isSelected ? styles.brandNameActive : styles.brandNameInactive,
                  ]}
                >
                  {b.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── 2. Filter & Sort Action Strip ── */}
      <View style={styles.filterStrip}>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            selectedSort !== 'relevance' && styles.filterBtnHighlight,
          ]}
          onPress={() => setShowSortModal(true)}
          activeOpacity={0.8}
        >
          <ArrowUpDown
            size={14}
            color={selectedSort !== 'relevance' ? colors.primary : colors.text}
            strokeWidth={2}
          />
          <Text
            style={[
              styles.filterBtnText,
              selectedSort !== 'relevance' && { color: colors.primary, fontWeight: 'bold' },
            ]}
          >
            {SORT_OPTIONS.find((s) => s.id === selectedSort)?.shortLabel || 'Sort'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            selectedGrade !== 'all' && styles.filterBtnHighlight,
          ]}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.8}
        >
          <SlidersHorizontal
            size={14}
            color={selectedGrade !== 'all' ? colors.primary : colors.text}
            strokeWidth={2}
          />
          <Text
            style={[
              styles.filterBtnText,
              selectedGrade !== 'all' && { color: colors.primary, fontWeight: 'bold' },
            ]}
          >
            {selectedGrade === 'all' ? 'All Grades' : selectedGrade}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleChip,
            expressOnly && styles.toggleChipActive,
          ]}
          onPress={() => setExpressOnly(!expressOnly)}
          activeOpacity={0.8}
        >
          <Zap
            size={12}
            color={expressOnly ? colors.white : colors.textSecondary}
            strokeWidth={2.5}
          />
          <Text
            style={[
              styles.toggleChipText,
              expressOnly && styles.toggleChipTextActive,
            ]}
          >
            30m Express
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainFilterIconBtn}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.8}
        >
          <Filter size={15} color={colors.white} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* ── 3. Product Grid List ── */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Package size={28} color={colors.primary} strokeWidth={1.5} />}
          title="No materials match filters"
          description={`No products found for "${selectedBrand !== 'all' ? selectedBrand : categoryName}".`}
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedBrand('all');
            setSelectedGrade('all');
            setSelectedSort('relevance');
          }}
        />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      {/* ── Sort Modal BottomSheet ── */}
      <Modal visible={showSortModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort Materials By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {SORT_OPTIONS.map((opt) => {
              const isSelected = selectedSort === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.modalOptionRow,
                    isSelected && styles.modalOptionRowSelected,
                  ]}
                  onPress={() => {
                    setSelectedSort(opt.id);
                    setShowSortModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Check size={18} color={colors.primary} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Construction Filter Sheet ── */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Specifications</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSectionTitle}>Standard / Grade</Text>
            <View style={styles.gradeGrid}>
              {GRADE_FILTERS.map((g) => {
                const isSelected = selectedGrade === g.id;
                return (
                  <TouchableOpacity
                    key={g.id}
                    style={[
                      styles.gradeOptionChip,
                      isSelected && styles.gradeOptionChipActive,
                    ]}
                    onPress={() => setSelectedGrade(g.id)}
                  >
                    <Text
                      style={[
                        styles.gradeOptionText,
                        isSelected && styles.gradeOptionTextActive,
                      ]}
                    >
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalFooterBtns}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSelectedGrade('all');
                  setSelectedBrand('all');
                }}
              >
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
>>>>>>> c2d4ce9 (api intigrated)

            return (
              <TouchableOpacity
<<<<<<< HEAD
                key={product.id}
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                activeOpacity={0.88}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.productImageBox}>
                    <Text style={styles.productEmoji}>
                      {product.name.includes('Cement') ? '🏗️'
                        : product.name.includes('Steel') ? '🔩'
                        : product.name.includes('Sand') ? '⏳'
                        : product.name.includes('Brick') ? '🧱'
                        : product.name.includes('Paint') ? '🎨'
                        : '📦'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('StoreCompare', { productId: product.id, productName: product.name })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.iconButtonText}>▣</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.productTitle} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.productMeta}>{product.unit}</Text>
                <Text style={styles.productPrice}>₹{price}</Text>

                <View style={styles.cardBottomRow}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    activeOpacity={0.8}
                    onPress={() => handleDecreaseProduct(product)}
                  >
                    <Text style={styles.stepBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepQty}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    activeOpacity={0.8}
                    onPress={() => handleAddProduct(product, price)}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

=======
                style={styles.applyBtn}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyBtnText}>
                  Apply ({filteredProducts.length} items)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

>>>>>>> c2d4ce9 (api intigrated)
      <AddToCartBottomSheet
        visible={showAddSheet}
        itemName={selectedProductName}
        itemCount={cart.length}
        totalQuantity={totalItems}
        onClose={() => setShowAddSheet(false)}
<<<<<<< HEAD
        onContinue={() => {
          setShowAddSheet(false);
          navigation.navigate('Cart');
        }}
=======
        onContinue={() => setShowAddSheet(false)}
>>>>>>> c2d4ce9 (api intigrated)
        onViewCart={() => {
          setShowAddSheet(false);
          navigation.navigate('Cart');
        }}
<<<<<<< HEAD
      />

      {/* ── 1. Sort Picklist Modal ── */}
      <PicklistModal
        visible={activePicklist === 'sort'}
        title="Sort Materials By"
        subtitle="Select sorting preference for prices & delivery"
        options={SORT_OPTIONS}
        selectedValue={selectedSort}
        onSelect={(val) => setSelectedSort(val)}
        onClose={() => setActivePicklist(null)}
      />

      {/* ── 2. Brand Picklist Modal ── */}
      <PicklistModal
        visible={activePicklist === 'brand'}
        title="Filter by Manufacturer Brand"
        subtitle="Select certified construction material brand"
        options={BRAND_OPTIONS}
        selectedValue={selectedBrand}
        onSelect={(val) => setSelectedBrand(val)}
        onClose={() => setActivePicklist(null)}
      />

      {/* ── 3. Pack Size Picklist Modal ── */}
      <PicklistModal
        visible={activePicklist === 'pack_size'}
        title="Select Packaging & Pack Size"
        subtitle="Filter by standard bag, bundle or metric quantity"
        options={PACK_SIZE_OPTIONS}
        selectedValue={selectedPackSize}
        onSelect={(val) => setSelectedPackSize(val)}
        onClose={() => setActivePicklist(null)}
      />

      {/* ── 4. General Filter Picklist Modal ── */}
      <PicklistModal
        visible={activePicklist === 'filter'}
        title="Filter Materials"
        subtitle="Stock availability, express transit & special offers"
        options={FILTER_OPTIONS}
        selectedValue={selectedFilter}
        onSelect={(val) => setSelectedFilter(val)}
        onClose={() => setActivePicklist(null)}
=======
>>>>>>> c2d4ce9 (api intigrated)
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Brand Scroll Bar (Mockup Style) ──
  brandBarSection: {
    backgroundColor: colors.surface,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  brandBarTitle: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  brandsScroll: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  brandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.full,
    borderWidth: 1,
    gap: 6,
  },
  brandChipActive: {
    backgroundColor: colors.pillActiveBg,
    borderColor: colors.pillActiveBorder,
  },
  brandChipInactive: {
    backgroundColor: colors.pillInactiveBg,
    borderColor: colors.pillInactiveBorder,
  },
  brandLogo: {
    fontSize: 13,
  },
  brandName: {
    fontSize: typography.fontSizes.caption,
  },
  brandNameActive: {
    color: colors.pillActiveText,
    fontWeight: typography.weights.bold,
  },
  brandNameInactive: {
    color: colors.pillInactiveText,
    fontWeight: typography.weights.medium,
  },

  // ── Filter Strip ──
  filterStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 5,
  },
  filterBtnHighlight: {
    backgroundColor: colors.pillActiveBg,
    borderColor: colors.primary,
  },
  filterBtnText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  toggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  toggleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleChipText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold,
  },
  toggleChipTextActive: {
    color: colors.white,
  },
<<<<<<< HEAD
  scrollContent: {
    padding: spacing.md,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  productImageBox: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    backgroundColor: '#F3F3F3',
=======
  mainFilterIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
>>>>>>> c2d4ce9 (api intigrated)
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
<<<<<<< HEAD
  productEmoji: {
    fontSize: 30,
  },
  iconButton: {
    width: 24,
    height: 24,
    borderRadius: radii.sm,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: typography.weights.bold,
  },
  productTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    lineHeight: 18,
    minHeight: 36,
  },
  productMeta: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  productPrice: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginTop: spacing.sm,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: radii.md,
    marginTop: spacing.sm,
    paddingVertical: 4,
    gap: 8,
  },
  stepBtn: {
    width: 24,
    height: 24,
    borderRadius: radii.sm,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: typography.weights.bold,
    lineHeight: 18,
  },
  stepQty: {
    color: colors.text,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    minWidth: 18,
    textAlign: 'center',
=======

  // ── List ──
  listContent: {
    padding: spacing.base,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  // ── Modals ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.base,
    gap: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  modalOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalOptionRowSelected: {
    backgroundColor: colors.primaryFaded,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
  },
  modalOptionText: {
    fontSize: typography.fontSizes.bodySmall,
    color: colors.text,
  },
  modalOptionTextSelected: {
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  filterSectionTitle: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gradeOptionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gradeOptionChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  gradeOptionText: {
    fontSize: typography.fontSizes.caption,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  gradeOptionTextActive: {
    color: colors.white,
    fontWeight: typography.weights.bold,
  },
  modalFooterBtns: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  resetBtn: {
    flex: 1,
    height: 46,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  applyBtn: {
    flex: 2,
    height: 46,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.white,
>>>>>>> c2d4ce9 (api intigrated)
  },
});
