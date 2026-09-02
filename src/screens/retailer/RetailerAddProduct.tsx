import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import { Product, RetailerProductOffer } from '../../types';
import GradientAppHeader from '../../components/GradientAppHeader';

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

export default function RetailerAddProduct({ navigation }: any) {
  const { addProduct } = useAppStore();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [unit, setUnit] = useState(UNITS[0]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');

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

    const newProdId = `prod_${Date.now()}`;
    const newProduct: Product = {
      id: newProdId,
      name,
      brand,
      category,
      unit,
      sku,
      description: description || `${name} supplied by Sri Sai Hardware. Guaranteed manufacturer quality.`,
      isActive: true,
    };

    const newOffer: RetailerProductOffer = {
      id: `offer_${newProdId}`,
      productId: newProdId,
      retailerId: 'r1',
      price: numPrice,
      stock: numStock || 100,
      isAvailable: true,
      estimatedDeliveryMins: 30,
    };

    addProduct(newProduct, newOffer);
    Alert.alert('Product Added', `${name} has been published to your store catalog!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Add New Product"
        subtitle="Publish construction item to BuildKart"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, category === cat && styles.chipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
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
            <TextInput
              style={styles.input}
              value={sku}
              onChangeText={setSku}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Pack Size / Unit</Text>
            <TextInput
              style={styles.input}
              value={unit}
              onChangeText={setUnit}
            />
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
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.88}>
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
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#374151',
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
});
