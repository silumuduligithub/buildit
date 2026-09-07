import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Platform,
} from 'react-native';
import {
  Camera,
  Image as ImageIcon,
  ImagePlus,
  Check,
  X,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import { Product, RetailerProductOffer } from '../../types';
import GradientAppHeader from '../../components/GradientAppHeader';
import { showFlashMessage } from '../../components/ui/FlashMessage';
import { capturePhotoFromCamera, pickPhotoFromGallery } from '../../utils/imagePickerHelper';

const CATEGORIES = [
  'Structural Materials',
  'Finishing',
  'Electrical',
  'Plumbing',
  'Hardware',
  'Paints',
  'Aggregates',
];

const UNITS = [
  '50 Kg Bag',
  'Tonne',
  'Piece (Pcs)',
  'Bucket (20L)',
  'Box (100 Pcs)',
  'Bundle',
  'Meter',
  'Sq. Ft',
];

const IMAGE_TEMPLATES = [
  {
    name: 'Cement Bag',
    category: 'Structural Materials',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Steel Rebar',
    category: 'Structural Materials',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'River Sand',
    category: 'Aggregates',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Red Clay Bricks',
    category: 'Structural Materials',
    url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Marine Plywood',
    category: 'Finishing',
    url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Wall Paint',
    category: 'Paints',
    url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Power Tools',
    category: 'Hardware',
    url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'PVC Plumbing',
    category: 'Plumbing',
    url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Electrical Cable',
    category: 'Electrical',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
  },
];

export default function RetailerAddProduct({ navigation }: any) {
  const { addProduct, syncCreateOffer, activeRetailerId, retailerProfile } = useAppStore();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [unit, setUnit] = useState(UNITS[0]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(IMAGE_TEMPLATES[0].url);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showPickerModal, setShowPickerModal] = useState(false);

  // 1. Capture Photo using Device Camera (Android & iOS)
  const handleCaptureImage = async () => {
    setShowPickerModal(false);
    const result = await capturePhotoFromCamera();
    if (!result.canceled && result.uri) {
      setImageUrl(result.uri);
      setCustomUrlInput('');
      showFlashMessage({
        type: 'success',
        message: 'Product photo captured from camera!',
      });
    }
  };

  // 2. Select Photo from Device Gallery / Photos (Android & iOS)
  const handlePickFromGallery = async () => {
    setShowPickerModal(false);
    const result = await pickPhotoFromGallery();
    if (!result.canceled && result.uri) {
      setImageUrl(result.uri);
      setCustomUrlInput('');
      showFlashMessage({
        type: 'success',
        message: 'Product photo selected from gallery!',
      });
    }
  };

  const handleSelectTemplate = (templateUrl: string) => {
    setImageUrl(templateUrl);
    setCustomUrlInput('');
  };

  const handleCustomUrlChange = (text: string) => {
    setCustomUrlInput(text);
    if (text.trim().startsWith('http') || text.trim().startsWith('file://')) {
      setImageUrl(text.trim());
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter product name.');
      return;
    }
    if (!brand.trim()) {
      Alert.alert('Missing Brand', 'Please specify product brand.');
      return;
    }
    const numPrice = parseInt(price || '0', 10);
    const numStock = parseInt(stock || '0', 10);
    if (numPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid selling price.');
      return;
    }

    const finalImage =
      imageUrl ||
      customUrlInput ||
      IMAGE_TEMPLATES.find((t) => t.category === category)?.url ||
      IMAGE_TEMPLATES[0].url;

    const activeStoreId = activeRetailerId || retailerProfile?.id || 's_sri_sai';
    const storeName = retailerProfile?.name || 'Verified Partner Store';

    const newProdId = `prod_${Date.now()}`;
    const newProduct: Product = {
      id: newProdId,
      name,
      brand,
      category,
      unit,
      sku,
      imageUrl: finalImage,
      description:
        description ||
        `${name} supplied by ${storeName}. Guaranteed manufacturer quality.`,
      isActive: true,
    };

    const newOffer: RetailerProductOffer = {
      id: `offer_${newProdId}`,
      productId: newProdId,
      retailerId: activeStoreId,
      price: numPrice,
      stock: numStock || 100,
      isAvailable: true,
      estimatedDeliveryMins: 30,
    };

    addProduct(newProduct, newOffer);
    syncCreateOffer({
      product_id: newProdId,
      selling_price: numPrice,
      available_quantity: numStock || 100,
      is_active: true,
    }).catch(() => {});

    showFlashMessage({
      type: 'success',
      message: `${name} has been published with product photo!`,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Add New Product"
        subtitle="Publish construction item to BuildKart"
        showBack={true}
        showSearch={false}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Product Photo & Media Section ── */}
        <View style={styles.imageCard}>
          <View style={styles.imageHeaderRow}>
            <View>
              <Text style={styles.label}>Product Photo *</Text>
              <Text style={styles.subLabel}>
                Capture from camera, choose from gallery, or use template
              </Text>
            </View>
            <TouchableOpacity
              style={styles.choosePhotoBtn}
              onPress={() => setShowPickerModal(true)}
              activeOpacity={0.8}
            >
              <ImagePlus size={14} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.choosePhotoBtnText}>
                {imageUrl ? 'Change Photo' : 'Upload Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Photo Preview Box */}
          <View style={styles.previewContainer}>
            {imageUrl ? (
              <TouchableOpacity
                style={styles.previewBox}
                onPress={() => setShowPickerModal(true)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.previewImg}
                  resizeMode="cover"
                />
                <View style={styles.previewBadge}>
                  <Check size={12} color={colors.white} strokeWidth={2.5} />
                  <Text style={styles.previewBadgeText}>Photo Ready</Text>
                </View>
                <TouchableOpacity
                  style={styles.clearImgBtn}
                  onPress={() => setImageUrl('')}
                  activeOpacity={0.8}
                >
                  <X size={14} color={colors.white} strokeWidth={2.2} />
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.emptyPreviewBox}
                onPress={() => setShowPickerModal(true)}
                activeOpacity={0.85}
              >
                <View style={styles.cameraIconCircle}>
                  <Camera size={26} color={colors.primary} strokeWidth={2} />
                </View>
                <Text style={styles.emptyPreviewTitle}>Tap to Upload Product Photo</Text>
                <Text style={styles.emptyPreviewSub}>
                  Take photo with camera or choose from gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Preset Templates Carousel */}
          <Text style={styles.templateHeader}>Quick Material Photo Presets</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templatesScroll}
          >
            {IMAGE_TEMPLATES.map((item) => {
              const isSelected = imageUrl === item.url;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.templateCard,
                    isSelected && styles.templateCardSelected,
                  ]}
                  onPress={() => handleSelectTemplate(item.url)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.url }} style={styles.templateThumb} />
                  <Text
                    style={[
                      styles.templateName,
                      isSelected && styles.templateNameSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.templateCheckmark}>
                      <Check size={10} color={colors.white} strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Custom Image URL Field */}
          <View style={styles.urlInputRow}>
            <TextInput
              style={styles.urlInput}
              placeholder="Or paste direct image URL (https://...)"
              placeholderTextColor="#9CA3AF"
              value={customUrlInput}
              onChangeText={handleCustomUrlChange}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Product Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. UltraTech Super Cement PPC (50 Kg)"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Brand */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Brand / Manufacturer *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. UltraTech, Tata Tiscon, Asian Paints"
            placeholderTextColor="#9CA3AF"
            value={brand}
            onChangeText={setBrand}
          />
        </View>

        {/* Category Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, category === cat && styles.chipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[styles.chipText, category === cat && styles.chipTextActive]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SKU & Unit Row */}
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>SKU / Code</Text>
            <TextInput style={styles.input} value={sku} onChangeText={setSku} />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Pack Size / Unit</Text>
            <TextInput style={styles.input} value={unit} onChangeText={setUnit} />
          </View>
        </View>

        {/* Price & Quantity Row */}
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Selling Price (₹) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 420"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Initial Stock Quantity *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 350"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={stock}
              onChangeText={setStock}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Product Description / Specifications</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Grade, strength, technical specifications, warranty..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Submit Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.88}
          >
            <Text style={styles.saveBtnText}>Publish Product to Store</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* ── Photo Source Selection Modal (Camera vs Gallery) ── */}
      <Modal
        visible={showPickerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPickerModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowPickerModal(false)}
        >
          <View style={styles.actionSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Product Photo</Text>
              <TouchableOpacity
                onPress={() => setShowPickerModal(false)}
                style={styles.sheetCloseBtn}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Option 1: Camera */}
            <TouchableOpacity
              style={styles.actionOption}
              onPress={handleCaptureImage}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Camera size={22} color="#2563EB" strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionOptionTitle}>Take Photo (Camera)</Text>
                <Text style={styles.actionOptionSub}>
                  Capture fresh photo of physical material or bag
                </Text>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Option 2: Gallery */}
            <TouchableOpacity
              style={styles.actionOption}
              onPress={handlePickFromGallery}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#F0FDF4' }]}>
                <ImageIcon size={22} color="#16A34A" strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.actionOptionSub}>
                  Select high-res image from device photo library
                </Text>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Option 3: Presets */}
            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => setShowPickerModal(false)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#FFF7ED' }]}>
                <Sparkles size={22} color={colors.primary} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionOptionTitle}>Use Catalog Template</Text>
                <Text style={styles.actionOptionSub}>
                  Pick from standard pre-approved building material photos
                </Text>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelSheetBtn}
              onPress={() => setShowPickerModal(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelSheetBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  imageCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  imageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  choosePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  choosePhotoBtnText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#374151',
  },
  subLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
    marginBottom: spacing.xs,
  },
  previewContainer: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  previewBox: {
    width: '100%',
    height: 170,
    borderRadius: radii.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  previewImg: {
    width: '100%',
    height: '100%',
  },
  previewBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(14, 165, 104, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    gap: 4,
  },
  previewBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  clearImgBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPreviewBox: {
    width: '100%',
    height: 130,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: spacing.md,
  },
  cameraIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...shadows.sm,
  },
  emptyPreviewTitle: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  emptyPreviewSub: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  templateHeader: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
    marginTop: 4,
    marginBottom: 6,
  },
  templatesScroll: {
    gap: 8,
    paddingBottom: spacing.xs,
  },
  templateCard: {
    width: 80,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: radii.md,
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  templateCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  templateThumb: {
    width: 68,
    height: 52,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  templateName: {
    fontSize: 9,
    fontWeight: typography.weights.semibold,
    color: '#374151',
    marginTop: 3,
    textAlign: 'center',
  },
  templateNameSelected: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  templateCheckmark: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: colors.primary,
    borderRadius: 7,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urlInputRow: {
    marginTop: spacing.sm,
  },
  urlInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    fontSize: 11,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: typography.fontSizes.sm,
    color: '#111827',
    ...shadows.sm,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  chipsScroll: {
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: spacing.xs + 2,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
  },
  chipTextActive: {
    color: colors.white,
  },
  buttonsContainer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  cancelBtn: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelBtnText: {
    color: '#6B7280',
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
  },

  // ── Action Sheet Modal ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 36 : spacing.lg,
    gap: spacing.md,
    ...shadows.lg,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
  },
  sheetTitle: {
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  sheetCloseBtn: {
    padding: 4,
  },
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionOptionTitle: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  actionOptionSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  cancelSheetBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  cancelSheetBtnText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: '#4B5563',
  },
});
