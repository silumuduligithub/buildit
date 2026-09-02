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
import GradientAppHeader from '../../components/GradientAppHeader';

export default function RetailerPricing({ navigation }: any) {
  const { products, offers, updateOfferPrice } = useAppStore();
  const [editedPrices, setEditedPrices] = useState<Record<string, string>>({});

  const handlePriceChange = (offerId: string, text: string) => {
    setEditedPrices({ ...editedPrices, [offerId]: text });
  };

  const handleSavePrice = (offerId: string, currentPrice: number) => {
    const rawVal = editedPrices[offerId];
    if (!rawVal) return;
    const num = parseInt(rawVal, 10);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid amount.');
      return;
    }
    updateOfferPrice(offerId, num);
    Alert.alert('Price Updated', `New price: ₹${num}`);
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Pricing Management"
        subtitle="Update unit rates for construction materials"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hintBanner}>
          <Text style={styles.hintEmoji}>💡</Text>
          <Text style={styles.hintText}>
            Updated prices take effect immediately for customer searches and store comparisons.
          </Text>
        </View>

        {products.map((product) => {
          const offer = offers.find((o) => o.productId === product.id) || {
            id: `offer_${product.id}`,
            productId: product.id,
            retailerId: 'r1',
            price: 410,
            stock: 100,
            isAvailable: true,
            estimatedDeliveryMins: 30,
          };

          const currentVal = editedPrices[offer.id] !== undefined
            ? editedPrices[offer.id]
            : offer.price.toString();

          const isModified =
            editedPrices[offer.id] !== undefined &&
            editedPrices[offer.id] !== offer.price.toString();

          return (
            <View key={product.id} style={styles.priceCard}>
              <View style={styles.thumbBox}>
                <Text style={styles.thumbEmoji}>
                  {product.name.includes('Cement') ? '🏗️'
                    : product.name.includes('Steel') ? '🔩'
                    : product.name.includes('Brick') ? '🧱'
                    : product.name.includes('Paint') ? '🎨'
                    : '📦'}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.productMeta}>Brand: {product.brand} • {product.unit}</Text>
                <Text style={styles.stockText}>Stock: {offer.stock} available</Text>
              </View>

              <View style={styles.actionBox}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={currentVal}
                    onChangeText={(t) => handlePriceChange(offer.id, t)}
                    keyboardType="numeric"
                  />
                </View>

                {isModified ? (
                  <TouchableOpacity
                    style={styles.saveBtnActive}
                    onPress={() => handleSavePrice(offer.id, offer.price)}
                  >
                    <Text style={styles.saveBtnTextActive}>Save</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.savedBadge}>
                    <Text style={styles.savedBadgeText}>Live</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

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
    gap: spacing.sm + 2,
  },
  hintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  hintEmoji: {
    fontSize: 18,
  },
  hintText: {
    fontSize: typography.fontSizes.xs,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 16,
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  thumbBox: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  thumbEmoji: {
    fontSize: 22,
  },
  infoBox: {
    flex: 1,
  },
  productName: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  productMeta: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  stockText: {
    fontSize: 9,
    color: '#059669',
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  actionBox: {
    alignItems: 'flex-end',
    gap: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 6,
    width: 80,
  },
  rupeeSymbol: {
    fontSize: 12,
    fontWeight: typography.weights.extrabold,
    color: '#64748B',
  },
  priceInput: {
    flex: 1,
    paddingVertical: 4,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#0F172A',
    textAlign: 'right',
  },
  saveBtnActive: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 4,
    borderRadius: radii.xs,
  },
  saveBtnTextActive: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  savedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  savedBadgeText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: typography.weights.bold,
  },
});
