import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
<<<<<<< HEAD
=======
  Image,
  Share,
  Platform,
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
>>>>>>> c2d4ce9 (api intigrated)
} from 'react-native';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Store,
  Layers,
  MessageCircle,
  Plus,
  Minus,
  Sparkles,
  ThumbsUp,
  Edit3,
  X,
} from 'lucide-react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { mockProducts, mockStores, mockOffers } from '../../services/mockData';
import { catalogService, mapBackendProductToProduct, mapBackendOfferToOffer } from '../../services';
import { useAppStore } from '../../store';
import { CartItem } from '../../types';
import AddToCartBottomSheet from '../../components/AddToCartBottomSheet';
<<<<<<< HEAD

export default function ProductDetailScreen({ route, navigation }: any) {
  const productId = route?.params?.productId || 'p_cement_1';
  const { cart, addToCart, updateCartQuantity, removeFromCart } = useAppStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
=======
import PriceDisplay from '../../components/ui/PriceDisplay';
import GradientAppHeader from '../../components/GradientAppHeader';
import { showFlashMessage } from '../../components/ui/FlashMessage';

const PRODUCT_IMAGES: Record<string, string> = {
  p_cement_1:
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80',
  p_cement_2:
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80',
  p_cement_3:
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
  p_cement_4:
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
  p_steel_1:
    'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&auto=format&fit=crop&q=80',
  p_steel_2:
    'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
  p_sand_1:
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
  p_bricks_1:
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
  p_paint_1:
    'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=80',
  p_plumbing_1:
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80',
  p_electrical_1:
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
  p_hardware_1:
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
};

export default function ProductDetailScreen({ route, navigation }: any) {
  const productId = route?.params?.productId || 'p_cement_1';
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
  } = useAppStore();

  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [liveProduct, setLiveProduct] = useState<any>(null);
  const [liveOffers, setLiveOffers] = useState<any[]>([]);
>>>>>>> c2d4ce9 (api intigrated)

  // ── Reviews & Ratings State ──
  const [reviewsData, setReviewsData] = useState<{
    averageRating: number;
    totalReviews: number;
    percentages: Record<string, number>;
    reviews: any[];
  }>({
    averageRating: 4.8,
    totalReviews: 4,
    percentages: { 5: 75, 4: 25, 3: 0, 2: 0, 1: 0 },
    reviews: [],
  });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    catalogService.getProductById(productId).then((res) => {
      if (res.data?.product) {
        setLiveProduct(mapBackendProductToProduct(res.data.product));
      }
    }).catch(() => {});

    catalogService.getProductOffers(productId).then((res) => {
      if (res.data?.offers && Array.isArray(res.data.offers)) {
        setLiveOffers(res.data.offers.map((o: any) => mapBackendOfferToOffer(o)));
      }
    }).catch(() => {});

    catalogService.getProductReviews(productId).then((res) => {
      if (res.data) {
        setReviewsData({
          averageRating: res.data.averageRating ?? 4.8,
          totalReviews: res.data.totalReviews ?? res.data.reviews?.length ?? 0,
          percentages: res.data.percentages ?? { 5: 75, 4: 25, 3: 0, 2: 0, 1: 0 },
          reviews: res.data.reviews || [],
        });
      }
    }).catch(() => {});
  }, [productId]);

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      showFlashMessage({
        type: 'warning',
        message: 'Please write your review comment before submitting.',
      });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await catalogService.submitProductReview(productId, {
        rating: userRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        userName: reviewerName.trim() || 'Verified Buyer',
      });

      if (res.success || res.data) {
        showFlashMessage({
          type: 'success',
          message: 'Thank you! Your review was submitted successfully.',
        });

        const createdReview = res.data || {
          _id: String(Date.now()),
          rating: userRating,
          title: reviewTitle.trim(),
          comment: reviewComment.trim(),
          user_name: reviewerName.trim() || 'Verified Buyer',
          user_role: 'CUSTOMER',
          verified_purchase: true,
          helpful_count: 0,
          created_at: new Date().toISOString(),
        };

        setReviewsData((prev) => {
          const updatedList = [createdReview, ...prev.reviews];
          const newTotal = updatedList.length;
          const sum = updatedList.reduce((acc, r) => acc + (r.rating || 5), 0);
          return {
            ...prev,
            averageRating: Number((sum / newTotal).toFixed(1)),
            totalReviews: newTotal,
            reviews: updatedList,
          };
        });

        setReviewTitle('');
        setReviewComment('');
        setShowReviewModal(false);
      }
    } catch (err: any) {
      showFlashMessage({
        type: 'error',
        message: err.message || 'Failed to submit review. Please try again.',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const defaultProduct = products.find((p) => p.id === productId) || mockProducts.find((p) => p.id === productId) || mockProducts[0];
  const product = liveProduct || defaultProduct;
  const store = retailers[0] || mockStores[0];
  const defaultOffer = offers.find((o) => o.productId === product.id) || mockOffers.find((o) => o.productId === product.id) || {
    id: `offer_${product.id}`,
    productId: product.id,
    retailerId: store.id,
    price: 410,
    stock: 450,
    isAvailable: true,
    estimatedDeliveryMins: 25,
  };
<<<<<<< HEAD
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartItem = cart.find((item) => item.offer.id === offer.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    const item: CartItem = {
      id: `cart-${offer.id}-${Date.now()}`,
      offer,
      product,
      retailer: store,
      quantity: 1,
    };
    addToCart(item);
=======
  const offer = liveOffers[0] || defaultOffer;

  const mrp = Math.round(offer.price * 1.12);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartItem = cart.find((item) => item.offer.id === offer.id || item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const fallbackImg = product.name?.toLowerCase().includes('cement')
    ? 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80'
    : product.name?.toLowerCase().includes('steel') || product.name?.toLowerCase().includes('tmt') || product.name?.toLowerCase().includes('rebar')
    ? 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&auto=format&fit=crop&q=80'
    : product.name?.toLowerCase().includes('sand')
    ? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'
    : product.name?.toLowerCase().includes('brick')
    ? 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80'
    : product.name?.toLowerCase().includes('paint')
    ? 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=80'
    : product.name?.toLowerCase().includes('plywood')
    ? 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80';

  const imageUrl =
    product.imageUrl ||
    PRODUCT_IMAGES[product.id] ||
    fallbackImg;

  // ── Flipkart-Style: Similar & Bundle Calculations ──
  const allProductsList = products.length > 0 ? products : mockProducts;
  const similarProducts = allProductsList
    .filter((p) => p.id !== product.id)
    .slice(0, 6);

  const bundleItems = allProductsList.filter((p) => p.id !== product.id).slice(0, 2);
  const bundleOffers = bundleItems.map((bi) => {
    return (
      offers.find((o) => o.productId === bi.id) ||
      mockOffers.find((o) => o.productId === bi.id) || {
        id: `offer_${bi.id}`,
        price: 350,
      }
    );
  });
  const bundleTotalPrice =
    offer.price + bundleOffers.reduce((sum, bo) => sum + (bo.price || 0), 0);
  const bundleSavedAmount = Math.round(bundleTotalPrice * 0.12);

  const handleAddBundleToCart = () => {
    syncAddToCart(product.id, offer.id, 1);
    bundleItems.forEach((bi, idx) => {
      const bo = bundleOffers[idx];
      syncAddToCart(bi.id, bo.id, 1);
    });
    showFlashMessage({
      type: 'success',
      message: `Combo pack added to cart! Saved ₹${bundleSavedAmount}`,
    });
>>>>>>> c2d4ce9 (api intigrated)
    setShowAddSheet(true);
  };

  const handleAddToCart = () => {
    syncAddToCart(product.id, offer.id, 1);
    setShowAddSheet(true);
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      syncUpdateCartQuantity(cartItem.id, cartItem.quantity + 1);
    } else {
      handleAddToCart();
    }
  };

  const handleDecreaseQuantity = () => {
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      syncRemoveCartItem(cartItem.id);
    } else {
      syncUpdateCartQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on BuildKart for ₹${offer.price}!`,
      });
    } catch {
      // Ignored
    }
  };

  const decreaseQuantity = () => {
    if (!cartItem) return;
    if (quantity <= 1) removeFromCart(cartItem.id);
    else updateCartQuantity(cartItem.id, quantity - 1);
  };

  return (
    <View style={styles.root}>
<<<<<<< HEAD
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topIcon} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.topIcon} onPress={() => setIsFavorite(!isFavorite)}>
            <Text style={styles.actionIcon}>{isFavorite ? '♥' : '♡'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topIcon}>
            <Text style={styles.actionIcon}>♧</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.productHero}>
          <View style={styles.imageBox}>
            {product.name.includes('Cement') ? (
              <>
                <View style={styles.cementBag}>
                  <Text style={styles.bagBrand}>UltraTech</Text>
                  <Text style={styles.bagLabel}>CEMENT</Text>
                  <Text style={styles.bagGrade}>53</Text>
                  <Text style={styles.bagGradeLabel}>GRADE</Text>
                  <Text style={styles.bagWeight}>50 kg</Text>
                </View>
                <View style={styles.cementPile} />
              </>
            ) : (
              <Text style={styles.productLargeEmoji}>
                {product.name.includes('Steel') ? '🔩'
                  : product.name.includes('Sand') ? '⏳'
                  : product.name.includes('Brick') ? '🧱'
                  : product.name.includes('Paint') ? '🎨'
                  : '📦'}
              </Text>
            )}
          </View>
          <View style={styles.heroInfo}>
            <View style={styles.bestSeller}><Text style={styles.bestSellerText}>Best Seller</Text></View>
            <Text style={styles.productTitle}>{product.name}</Text>
            <Text style={styles.productUnitSubtitle}>{product.unit}</Text>
            <View style={styles.ratingRow}>
              <View style={styles.ratingStarBox}><Text style={styles.ratingStarText}>★ 4.6</Text></View>
              <Text style={styles.ratingCountText}>(1,364+ reviews)</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>₹{offer.price}</Text>
              <Text style={styles.priceUnitText}>/ {product.unit.split(' ')[1] || 'bag'}</Text>
            </View>
            <View style={styles.taxPill}><Text style={styles.taxText}>Inclusive of all taxes</Text></View>
            <Text style={styles.stockText}>In Stock</Text>
          </View>
        </View>

        <View style={styles.specGrid}>
          <View style={styles.specCell}><Text style={styles.specLabel}>Brand</Text><Text style={styles.specValue}>{product.brand}</Text></View>
          <View style={styles.specCell}><Text style={styles.specLabel}>Grade</Text><Text style={styles.specValue}>OPC 53</Text></View>
          <View style={styles.specCell}><Text style={styles.specLabel}>Pack Size</Text><Text style={styles.specValue}>{product.unit}</Text></View>
          <View style={styles.specCell}><Text style={styles.specLabel}>Type</Text><Text style={styles.specValue}>Cement</Text></View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>About this product</Text>
          <Text style={styles.descriptionText} numberOfLines={showFullDesc ? undefined : 4}>
            {product.description} A high strength cement suitable for all types of construction. It provides superior workability, faster setting time and high early strength.
          </Text>
          <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}><Text style={styles.viewMoreText}>{showFullDesc ? 'Read less' : 'Read more'} ▾</Text></TouchableOpacity>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresGrid}>
            {['High early strength', 'Minimum shrinkage', 'Better workability', 'Corrosion resistance', 'Low heat of hydration', 'Long lasting durability'].map((feature) => (
              <View style={styles.featureItem} key={feature}><Text style={styles.featureIcon}>♧</Text><Text style={styles.featureText}>{feature}</Text></View>
            ))}
          </View>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.reviewHeader}><Text style={styles.sectionTitle}>Customer Reviews (1,364+)</Text><Text style={styles.viewAll}>View all ›</Text></View>
          <View style={styles.reviewSummary}>
            <Text style={styles.reviewScore}>4.6</Text>
            <Text style={styles.stars}>★★★★★</Text>
            <View style={styles.ratingBars}>
              {['5  ███████████ 78%', '4  ██ 15%', '3  █ 4%', '2  █ 2%', '1  █ 1%'].map((bar) => <Text style={styles.ratingBar} key={bar}>{bar}</Text>)}
            </View>
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.expertButton}
          onPress={() => {}}
          activeOpacity={0.85}
        >
          <Text style={styles.expertText}>♧ Chat with Expert</Text>
        </TouchableOpacity>
        <View style={styles.quantityControl}>
          <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}><Text style={styles.quantityText}>−</Text></TouchableOpacity>
          <Text style={styles.quantityValue}>{quantity || 1}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={handleAddToCart}><Text style={styles.quantityText}>+</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleAddToCart} activeOpacity={0.88}>
          <Text style={styles.buyNowText}>🛒 Add to Cart</Text>
=======
      {/* ── Signature Gradient Header ── */}
      <GradientAppHeader
        title={product.name}
        subtitle={`${product.brand || 'Verified Brand'} · ${product.unit || 'Piece'}`}
        showBack={true}
        showSearch={false}
        onBackPress={() => navigation.goBack()}
        rightIcon={
          <Heart
            size={18}
            color={isFavorite ? '#EF4444' : colors.white}
            fill={isFavorite ? '#EF4444' : 'transparent'}
            strokeWidth={2}
          />
        }
        onRightPress={() => setIsFavorite(!isFavorite)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Product Media Hero ── */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>{product.brand}</Text>
          </View>
        </View>

        {/* ── Product Info Card ── */}
        <View style={styles.card}>
          <View style={styles.ratingRow}>
            <View style={styles.ratingBox}>
              <Star size={13} color="#FFFFFF" strokeWidth={2} fill="#FFFFFF" />
              <Text style={styles.ratingText}>{reviewsData.averageRating.toFixed(1)}</Text>
            </View>
            <Text style={styles.reviewCount}>· {reviewsData.totalReviews} Ratings & Reviews</Text>
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>In Stock</Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.productUnit}>{product.unit}</Text>

          <View style={styles.priceRow}>
            <PriceDisplay sellingPrice={offer.price} mrp={mrp} size="lg" />
            <Text style={styles.taxInclusive}>Inclusive of all taxes</Text>
          </View>

          {/* Bulk Tier Highlights */}
          <View style={styles.bulkOfferContainer}>
            <Sparkles size={16} color={colors.primary} strokeWidth={2} />
            <Text style={styles.bulkOfferText}>
              Buy 20+ bags to save ₹15/bag with bulk pricing
            </Text>
          </View>
        </View>

        {/* ── Delivery ETA & Store Info ── */}
        <View style={styles.card}>
          <View style={styles.deliveryRow}>
            <View style={styles.deliveryIconBox}>
              <Truck size={18} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.deliveryHeading}>Express Delivery Available</Text>
              <Text style={styles.deliverySub}>
                Guaranteed site delivery within 30-45 mins
              </Text>
            </View>
          </View>

          <View style={styles.storeCard}>
            <View style={styles.storeLeft}>
              <Store size={18} color={colors.textSecondary} strokeWidth={1.8} />
              <View>
                <Text style={styles.storeName}>{store.name}</Text>
                <Text style={styles.storeDistance}>
                  {store.distance} km away · Authorized Supplier
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('StoreCompare', {
                  productId: product.id,
                  productName: product.name,
                })
              }
              activeOpacity={0.75}
            >
              <Text style={styles.compareLink}>Compare Stores</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Specifications ── */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Product Specifications</Text>
          <View style={styles.specTable}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Brand</Text>
              <Text style={styles.specValue}>{product.brand}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Category</Text>
              <Text style={styles.specValue}>{product.category}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Packaging Unit</Text>
              <Text style={styles.specValue}>{product.unit}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Standard Quality</Text>
              <Text style={styles.specValue}>IS: 269 / 12269 Certified</Text>
            </View>
          </View>
        </View>

        {/* ── About / Description ── */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>About this item</Text>
          <Text
            style={styles.descriptionText}
            numberOfLines={showFullDesc ? undefined : 3}
          >
            {product.description} Manufactured using superior clinker and gypsum for
            maximum structural strength, fast hydration setting, and long-lasting
            durability in demanding concrete works.
          </Text>
          <TouchableOpacity
            onPress={() => setShowFullDesc(!showFullDesc)}
            style={styles.readMoreBtn}
          >
            <Text style={styles.readMoreText}>
              {showFullDesc ? 'Show less' : 'Read more'}
            </Text>
            <ChevronRight
              size={14}
              color={colors.primary}
              style={{
                transform: [{ rotate: showFullDesc ? '-90deg' : '90deg' }],
              }}
            />
          </TouchableOpacity>
        </View>

        {/* ── Trust & Quality Badges ── */}
        <View style={styles.trustGrid}>
          <View style={styles.trustItem}>
            <ShieldCheck size={20} color={colors.success} strokeWidth={2} />
            <Text style={styles.trustTitle}>100% Genuine</Text>
            <Text style={styles.trustSub}>Direct from certified plant</Text>
          </View>
          <View style={styles.trustItem}>
            <RotateCcw size={20} color={colors.primary} strokeWidth={2} />
            <Text style={styles.trustTitle}>Easy Replacement</Text>
            <Text style={styles.trustSub}>If damaged during transit</Text>
          </View>
        </View>

        {/* ── Customer Ratings & Reviews Section ── */}
        <View style={styles.card}>
          <View style={styles.reviewHeaderRow}>
            <View>
              <Text style={styles.sectionHeading}>Ratings & Reviews</Text>
              <Text style={styles.reviewSubHeading}>
                Verified feedback from builders & contractors
              </Text>
            </View>
            <TouchableOpacity
              style={styles.writeReviewBtn}
              onPress={() => setShowReviewModal(true)}
              activeOpacity={0.8}
            >
              <Edit3 size={13} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.writeReviewBtnText}>Write Review</Text>
            </TouchableOpacity>
          </View>

          {/* Rating Summary Card */}
          <View style={styles.ratingSummaryCard}>
            <View style={styles.ratingLeftBox}>
              <Text style={styles.bigScoreText}>{reviewsData.averageRating.toFixed(1)}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={13}
                    color="#F59E0B"
                    fill={s <= Math.round(reviewsData.averageRating) ? '#F59E0B' : 'transparent'}
                    strokeWidth={2}
                  />
                ))}
              </View>
              <Text style={styles.totalRatingsCount}>
                {reviewsData.totalReviews} Ratings
              </Text>
            </View>

            {/* Distribution Bars */}
            <View style={styles.ratingBarsCol}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const pct = reviewsData.percentages?.[stars] || 0;
                return (
                  <View key={stars} style={styles.barRow}>
                    <Text style={styles.starLabel}>{stars}★</Text>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${pct}%`,
                            backgroundColor:
                              stars >= 4
                                ? '#0EA568'
                                : stars === 3
                                ? '#F59E0B'
                                : '#EF4444',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barPct}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Reviews List */}
          <View style={styles.reviewsListContainer}>
            {reviewsData.reviews && reviewsData.reviews.length > 0 ? (
              reviewsData.reviews.map((rev: any, idx: number) => {
                const initial = (rev.user_name || 'U').charAt(0).toUpperCase();
                return (
                  <View key={rev._id || idx} style={styles.reviewCard}>
                    <View style={styles.reviewTopRow}>
                      <View style={styles.userAvatar}>
                        <Text style={styles.avatarInitial}>{initial}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.userNameRow}>
                          <Text style={styles.reviewerName}>{rev.user_name}</Text>
                          {rev.verified_purchase && (
                            <View style={styles.verifiedBadge}>
                              <CheckCircle2 size={11} color="#0EA568" strokeWidth={2.5} />
                              <Text style={styles.verifiedText}>Verified</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.userRoleText}>{rev.user_role || 'CUSTOMER'}</Text>
                      </View>
                      <View style={styles.reviewScorePill}>
                        <Star size={10} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2} />
                        <Text style={styles.reviewScorePillText}>{rev.rating}</Text>
                      </View>
                    </View>

                    {rev.title ? (
                      <Text style={styles.reviewTitleText}>{rev.title}</Text>
                    ) : null}

                    <Text style={styles.reviewCommentText}>{rev.comment}</Text>

                    <View style={styles.reviewFooterRow}>
                      <Text style={styles.reviewDateText}>
                        {new Date(rev.created_at || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Text>
                      <TouchableOpacity
                        style={styles.helpfulBtn}
                        onPress={() => {
                          showFlashMessage({
                            type: 'success',
                            message: 'Thank you for marking this review as helpful!',
                          });
                        }}
                        activeOpacity={0.7}
                      >
                        <ThumbsUp size={11} color={colors.textSecondary} />
                        <Text style={styles.helpfulText}>
                          Helpful ({rev.helpful_count || 0})
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyReviewBox}>
                <Text style={styles.emptyReviewText}>
                  No reviews yet. Be the first to review this product!
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Flipkart-Style: Frequently Bought Together Bundle ── */}
        {bundleItems.length > 0 && (
          <View style={styles.card}>
            <View style={styles.bundleHeaderRow}>
              <View style={styles.bundleHeaderBadge}>
                <Sparkles size={14} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.bundleHeaderText}>Frequently Bought Together</Text>
              </View>
              <Text style={styles.bundleSavePill}>Save ₹{bundleSavedAmount}</Text>
            </View>

            <View style={styles.bundleThumbnailsRow}>
              {/* Main Item */}
              <View style={styles.bundleItemCard}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.bundleImg}
                  resizeMode="cover"
                />
                <Text style={styles.bundleItemTitle} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.bundleItemPrice}>₹{offer.price}</Text>
              </View>

              <Text style={styles.bundlePlusSign}>+</Text>

              {/* Bundle Item 1 */}
              {bundleItems[0] && (
                <View style={styles.bundleItemCard}>
                  <Image
                    source={{
                      uri:
                        bundleItems[0].imageUrl ||
                        PRODUCT_IMAGES[bundleItems[0].id] ||
                        fallbackImg,
                    }}
                    style={styles.bundleImg}
                    resizeMode="cover"
                  />
                  <Text style={styles.bundleItemTitle} numberOfLines={1}>
                    {bundleItems[0].name}
                  </Text>
                  <Text style={styles.bundleItemPrice}>
                    ₹{bundleOffers[0]?.price || 350}
                  </Text>
                </View>
              )}

              {bundleItems[1] && (
                <>
                  <Text style={styles.bundlePlusSign}>+</Text>
                  <View style={styles.bundleItemCard}>
                    <Image
                      source={{
                        uri:
                          bundleItems[1].imageUrl ||
                          PRODUCT_IMAGES[bundleItems[1].id] ||
                          fallbackImg,
                      }}
                      style={styles.bundleImg}
                      resizeMode="cover"
                    />
                    <Text style={styles.bundleItemTitle} numberOfLines={1}>
                      {bundleItems[1].name}
                    </Text>
                    <Text style={styles.bundleItemPrice}>
                      ₹{bundleOffers[1]?.price || 350}
                    </Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.bundlePriceSummary}>
              <View>
                <Text style={styles.bundleTotalLabel}>Combo for 3 items:</Text>
                <View style={styles.bundlePriceRow}>
                  <Text style={styles.bundleTotalVal}>
                    ₹{bundleTotalPrice.toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.bundleMrpVal}>
                    ₹{(bundleTotalPrice + bundleSavedAmount).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.addBundleBtn}
                onPress={handleAddBundleToCart}
                activeOpacity={0.88}
              >
                <Text style={styles.addBundleBtnText}>Add Combo to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Flipkart-Style: Similar Products / You May Also Like ── */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionHeading}>Similar Products</Text>
              <Text style={styles.sectionSubHeading}>
                Customers who viewed this also considered
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Categories')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllLink}>View All ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.similarScrollContainer}
          >
            {similarProducts.map((sp) => {
              const spOffer =
                offers.find((o) => o.productId === sp.id) ||
                mockOffers.find((o) => o.productId === sp.id) || {
                  id: `offer_${sp.id}`,
                  price: 380,
                };
              const spImg =
                sp.imageUrl ||
                PRODUCT_IMAGES[sp.id] ||
                fallbackImg;
              const spMrp = Math.round(spOffer.price * 1.15);

              return (
                <TouchableOpacity
                  key={sp.id}
                  style={styles.similarProductCard}
                  onPress={() => {
                    navigation.push('ProductDetail', { productId: sp.id });
                  }}
                  activeOpacity={0.88}
                >
                  <View style={styles.similarImgBox}>
                    <Image
                      source={{ uri: spImg }}
                      style={styles.similarImg}
                      resizeMode="cover"
                    />
                    <View style={styles.similarRatingBadge}>
                      <Star size={9} color="#FFFFFF" fill="#FFFFFF" />
                      <Text style={styles.similarRatingText}>4.8</Text>
                    </View>
                  </View>

                  <Text style={styles.similarBrand}>{sp.brand}</Text>
                  <Text style={styles.similarTitle} numberOfLines={2}>
                    {sp.name}
                  </Text>
                  <Text style={styles.similarUnit}>{sp.unit}</Text>

                  <View style={styles.similarPriceRow}>
                    <Text style={styles.similarPrice}>₹{spOffer.price}</Text>
                    <Text style={styles.similarMrp}>₹{spMrp}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.similarAddBtn}
                    onPress={() => {
                      syncAddToCart(sp.id, spOffer.id, 1);
                      showFlashMessage({
                        type: 'success',
                        message: `Added ${sp.name} to cart!`,
                      });
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.similarAddBtnText}>+ Add</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      {/* ── Bottom Sticky Action Bar ── */}
      <View style={styles.bottomBar}>
        {quantity > 0 ? (
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleDecreaseQuantity}
              activeOpacity={0.8}
            >
              <Minus size={16} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleIncreaseQuantity}
              activeOpacity={0.8}
            >
              <Plus size={16} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addCartBtn}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Text style={styles.addCartText}>Add to Cart</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.buyNowBtn}
          onPress={() => {
            if (quantity === 0) handleAddToCart();
            navigation.navigate('Cart');
          }}
          activeOpacity={0.88}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
          <ChevronRight size={16} color={colors.white} strokeWidth={2.2} />
>>>>>>> c2d4ce9 (api intigrated)
        </TouchableOpacity>
      </View>

      <AddToCartBottomSheet
        visible={showAddSheet}
        itemName={product.name}
        itemCount={cart.length}
        totalQuantity={totalItems}
        onClose={() => setShowAddSheet(false)}
        onContinue={() => setShowAddSheet(false)}
        onViewCart={() => {
          setShowAddSheet(false);
          navigation.navigate('Cart');
        }}
      />
<<<<<<< HEAD
=======

      {/* ── Write Review Modal ── */}
      <Modal
        visible={showReviewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate & Review Product</Text>
              <TouchableOpacity
                onPress={() => setShowReviewModal(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Product Info Snip */}
              <Text style={styles.modalProductName}>{product.name}</Text>
              <Text style={styles.modalProductBrand}>{product.brand} · {product.unit}</Text>

              {/* Star Rating Picker */}
              <Text style={styles.inputLabel}>Overall Rating *</Text>
              <View style={styles.starPickerRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setUserRating(star)}
                    activeOpacity={0.7}
                    style={styles.starTouch}
                  >
                    <Star
                      size={28}
                      color="#F59E0B"
                      fill={star <= userRating ? '#F59E0B' : 'transparent'}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                ))}
                <Text style={styles.starRatingDesc}>
                  {userRating === 5
                    ? 'Excellent (5★)'
                    : userRating === 4
                    ? 'Very Good (4★)'
                    : userRating === 3
                    ? 'Good (3★)'
                    : userRating === 2
                    ? 'Fair (2★)'
                    : 'Poor (1★)'}
                </Text>
              </View>

              {/* Name Input */}
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Ramesh Kumar"
                placeholderTextColor={colors.textTertiary}
                value={reviewerName}
                onChangeText={setReviewerName}
              />

              {/* Headline / Title */}
              <Text style={styles.inputLabel}>Review Title (Headline)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Excellent strength & fast delivery"
                placeholderTextColor={colors.textTertiary}
                value={reviewTitle}
                onChangeText={setReviewTitle}
              />

              {/* Comment / Detailed Review */}
              <Text style={styles.inputLabel}>Detailed Feedback *</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Share details regarding quality, packaging, delivery, setting time..."
                placeholderTextColor={colors.textTertiary}
                value={reviewComment}
                onChangeText={setReviewComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Submit CTA */}
              <TouchableOpacity
                style={[
                  styles.submitReviewBtn,
                  (!reviewComment.trim() || isSubmittingReview) && styles.submitReviewBtnDisabled,
                ]}
                onPress={handleSubmitReview}
                disabled={!reviewComment.trim() || isSubmittingReview}
                activeOpacity={0.88}
              >
                {isSubmittingReview ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.submitReviewBtnText}>Submit Review</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
>>>>>>> c2d4ce9 (api intigrated)
    </View>
  );
}

const TOP_INSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 6 : 48;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
<<<<<<< HEAD
    height: 58,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
  },
  topActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  topIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: colors.text,
    fontSize: 36,
    lineHeight: 34,
    fontWeight: typography.weights.regular,
  },
  actionIcon: {
    color: colors.text,
    fontSize: 27,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  productHero: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  heroInfo: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  bestSeller: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD800',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestSellerText: {
    color: colors.text,
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
  },
  stockText: {
    color: '#2A9D55',
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
  },
  imageContainer: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xl,
=======
    paddingTop: TOP_INSET,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
>>>>>>> c2d4ce9 (api intigrated)
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
<<<<<<< HEAD
  imageBox: {
    width: 160,
    height: 188,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cementBag: {
    width: 82,
    height: 142,
    backgroundColor: '#F5C400',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9A900',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    shadowColor: '#8B6A00',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  bagBrand: {
    color: '#173B2C',
    fontSize: 13,
    fontWeight: typography.weights.extrabold,
    fontStyle: 'italic',
  },
  bagLabel: {
    color: '#173B2C',
    fontSize: 8,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 1,
  },
  bagGrade: {
    color: '#173B2C',
    fontSize: 25,
    lineHeight: 27,
    fontWeight: typography.weights.extrabold,
  },
  bagGradeLabel: {
    color: '#173B2C',
    fontSize: 7,
    fontWeight: typography.weights.extrabold,
  },
  bagWeight: {
    color: '#5A4300',
    fontSize: 7,
    marginTop: spacing.md,
  },
  cementPile: {
    position: 'absolute',
    bottom: 16,
    left: 12,
    width: 70,
    height: 22,
    backgroundColor: '#777777',
    borderRadius: 35,
    transform: [{ rotate: '-8deg' }],
    opacity: 0.88,
  },
  productLargeEmoji: {
    fontSize: 72,
=======
  topActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 148 : 134,
  },

  // ── Hero ──
  heroContainer: {
    width: '100%',
    height: 220,
    backgroundColor: colors.surfaceSecondary,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
>>>>>>> c2d4ce9 (api intigrated)
  },
  brandBadge: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.base,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  brandBadgeText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },

  // ── Card ──
  card: {
    backgroundColor: colors.surface,
    padding: spacing.base,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EA568',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  reviewCount: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  stockBadge: {
    backgroundColor: '#E5F9EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  stockBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#0EA568',
  },
  productTitle: {
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: 24,
    marginTop: 2,
  },
  productUnit: {
    fontSize: typography.fontSizes.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  priceRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  taxInclusive: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
  },
  bulkOfferContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pillActiveBg,
    padding: spacing.sm,
    borderRadius: radii.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  bulkOfferText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    flex: 1,
  },

  // ── Delivery & Store ──
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  deliveryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryHeading: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  deliverySub: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  storeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  storeName: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
<<<<<<< HEAD
  specGrid: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  specCell: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
=======
  storeDistance: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
  },
  compareLink: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },

  // ── Specs ──
  sectionHeading: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  specTable: {
    gap: spacing.sm,
>>>>>>> c2d4ce9 (api intigrated)
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  specLabel: {
    fontSize: typography.fontSizes.bodySmall,
    color: colors.textSecondary,
  },
  specValue: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  contentSection: {
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.sm,
  },
  featureItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureIcon: {
    color: colors.primary,
    fontSize: 15,
  },
  featureText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  reviewSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  reviewScore: {
    fontSize: 30,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  stars: {
    color: '#FFC400',
    fontSize: 15,
  },
  ratingBars: {
    flex: 1,
    gap: 1,
  },
  ratingBar: {
    color: colors.textSecondary,
    fontSize: 9,
    letterSpacing: 0,
  },

  // ── Description ──
  descriptionText: {
    fontSize: typography.fontSizes.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 2,
  },
  readMoreText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },

  // ── Trust ──
  trustGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    marginTop: spacing.md,
  },
  trustItem: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 3,
  },
  trustTitle: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: 4,
  },
  trustSub: {
    fontSize: 10,
    color: colors.textTertiary,
  },

  // ── Ratings & Reviews ──
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  reviewSubHeading: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  writeReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  writeReviewBtnText: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  ratingSummaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  ratingLeftBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  bigScoreText: {
    fontSize: 34,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    lineHeight: 40,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  totalRatingsCount: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: typography.weights.medium,
  },
  ratingBarsCol: {
    flex: 1,
    gap: 5,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    width: 20,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  barPct: {
    fontSize: 10,
    color: colors.textTertiary,
    width: 28,
    textAlign: 'right',
  },

  // ── Review Cards ──
  reviewsListContainer: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  avatarInitial: {
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewerName: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E5F9EE',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.sm,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: '#0EA568',
  },
  userRoleText: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 1,
  },
  reviewScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EA568',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.sm,
    gap: 3,
  },
  reviewScorePillText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  reviewTitleText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: 4,
  },
  reviewCommentText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 3,
  },
  reviewFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  reviewDateText: {
    fontSize: 10,
    color: colors.textTertiary,
  },
  helpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
  },
  helpfulText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  emptyReviewBox: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyReviewText: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },

  // ── Write Review Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalProductName: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  modalProductBrand: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  starPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  starTouch: {
    padding: 4,
  },
  starRatingDesc: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginLeft: 6,
  },
  modalInput: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.fontSizes.bodySmall,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTextArea: {
    minHeight: 90,
  },
  submitReviewBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  submitReviewBtnDisabled: {
    opacity: 0.5,
  },
  submitReviewBtnText: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },

  // ── Flipkart-Style: Frequently Bought Together Bundle ──
  bundleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  bundleHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bundleHeaderText: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  bundleSavePill: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  bundleThumbnailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.lg,
    padding: spacing.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bundleItemCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 6,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bundleImg: {
    width: 60,
    height: 60,
    borderRadius: radii.sm,
    marginBottom: 4,
  },
  bundleItemTitle: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  bundleItemPrice: {
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    marginTop: 2,
  },
  bundlePlusSign: {
    fontSize: 16,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    paddingHorizontal: 2,
  },
  bundlePriceSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.xs,
  },
  bundleTotalLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  bundlePriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  bundleTotalVal: {
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  bundleMrpVal: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  addBundleBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.full,
    ...shadows.sm,
  },
  addBundleBtnText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },

  // ── Flipkart-Style: Similar Products Carousel ──
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionSubHeading: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  viewAllLink: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  similarScrollContainer: {
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  similarProductCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  similarImgBox: {
    width: '100%',
    height: 110,
    borderRadius: radii.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surfaceSecondary,
  },
  similarImg: {
    width: '100%',
    height: '100%',
  },
  similarRatingBadge: {
    position: 'absolute',
<<<<<<< HEAD
    bottom: 78,
=======
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EA568',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: radii.sm,
    gap: 2,
  },
  similarRatingText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  similarBrand: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 6,
  },
  similarTitle: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: 16,
    marginTop: 2,
    minHeight: 32,
  },
  similarUnit: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 1,
  },
  similarPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 4,
  },
  similarPrice: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  similarMrp: {
    fontSize: 10,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  similarAddBtn: {
    backgroundColor: colors.primaryFaded,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 5,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  similarAddBtnText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },

  // ── Bottom Bar ──
  bottomBar: {
    ...shadows.lg,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 88 : 72,
>>>>>>> c2d4ce9 (api intigrated)
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
<<<<<<< HEAD
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.sm,
    ...shadows.lg,
=======
    paddingHorizontal: spacing.base,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.md,
    zIndex: 999,
>>>>>>> c2d4ce9 (api intigrated)
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.full,
    padding: 3,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  qtyText: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  addCartBtn: {
    flex: 1,
    height: 48,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCartText: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
<<<<<<< HEAD
  expertButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: '#FFB18D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expertText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  quantityButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: colors.text,
    fontSize: 23,
    lineHeight: 24,
  },
  quantityValue: {
    color: colors.text,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    minWidth: 16,
    textAlign: 'center',
  },
  buyNowButton: {
    flex: 1.15,
=======
  buyNowBtn: {
    flex: 1.2,
    height: 48,
    borderRadius: radii.full,
>>>>>>> c2d4ce9 (api intigrated)
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...shadows.md,
  },
  buyNowText: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
});
