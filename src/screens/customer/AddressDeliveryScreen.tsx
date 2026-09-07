import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';

export default function AddressDeliveryScreen({ route, navigation }: any) {
  const totalAmount = route?.params?.totalAmount || 6750;
  const { savedAddresses, fetchAddresses, syncAddAddress } = useAppStore();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Gate open. Call before delivery.');

  useEffect(() => {
    fetchAddresses().catch(() => {});
  }, []);

  const addressList = savedAddresses;
  const selectedAddress =
    addressList.find((a: any) => (a.id || a.label) === selectedAddressId) || addressList[0];

  useEffect(() => {
    if (addressList.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addressList[0].id || addressList[0].label || 'addr_0');
    }
  }, [addressList]);

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Delivery Address) ── */}
      <GradientAppHeader
        title="Delivery Address"
        subtitle="Step 2 of 3: Checkout"
        showBack={true}
        showSearch={false}
        onBackPress={() => navigation.goBack()}
        rightIcon="➕"
        onRightPress={() => navigation.navigate('LocationSelect')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageSectionTitle}>Saved Addresses</Text>
<<<<<<< HEAD
        {mockSavedAddresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;
          return (
=======

        {addressList.length === 0 ? (
          <View style={styles.emptyAddressCard}>
            <Text style={styles.emptyAddressTitle}>No Saved Addresses Found</Text>
            <Text style={styles.emptyAddressSub}>
              Please add a delivery address to proceed with your order.
            </Text>
>>>>>>> c2d4ce9 (api intigrated)
            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={() => navigation.navigate('LocationSelect')}
              activeOpacity={0.85}
            >
              <Text style={styles.addAddressBtnText}>+ Add New Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          addressList.map((addr: any, idx: number) => {
            const addrId = addr.id || `addr_${idx}`;
            const isSelected = selectedAddressId === addrId || (idx === 0 && !selectedAddressId);
            return (
              <TouchableOpacity
                key={addrId}
                style={[styles.addressCard, isSelected && styles.addressCardActive]}
                onPress={() => setSelectedAddressId(addrId)}
                activeOpacity={0.88}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.labelBadge}>
                    <Text style={styles.labelText}>{addr.label || 'Site'}</Text>
                  </View>
                  <Text style={styles.addressArea}>{addr.city || addr.address || 'Hyderabad'}</Text>

                  <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </View>

                <Text style={styles.addressDetails}>{addr.line1 || addr.details || 'Hyderabad'}</Text>
                <Text style={styles.contactName}>{addr.name || 'Customer'} - {addr.phone || ''}</Text>

                <View style={styles.deliveryBadgeRow}>
                  <Text style={styles.deliveryTimeText}>⚡ Delivery in {addr.deliveryTime || '25-30 min'}</Text>
                  <Text style={styles.freeBadgeText}>FREE</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* Delivery Instructions Box */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsHeader}>Delivery Instructions</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Gate open. Call before delivery."
              placeholderTextColor={colors.textMuted}
              value={deliveryInstructions}
              onChangeText={setDeliveryInstructions}
              multiline
            />
          </View>
        </View>

        <View style={{ height: 96 }} />
      </ScrollView>

      {/* Bottom Continue Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedAddress && styles.continueButtonDisabled]}
          disabled={!selectedAddress}
          onPress={() =>
            navigation.navigate('Payment', {
              totalAmount,
              address: selectedAddress,
              instructions: deliveryInstructions,
            })
          }
          activeOpacity={0.88}
        >
          <Text style={[styles.continueText, !selectedAddress && styles.continueTextDisabled]}>
            {selectedAddress ? 'Continue to Payment' : 'Add Address to Continue'}
          </Text>
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
  scrollContent: {
    padding: spacing.md,
    gap: spacing.sm + 2,
  },
  pageSectionTitle: {
    color: colors.text,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    marginBottom: spacing.xs,
  },
  addressCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  addressCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF8F4',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
    marginRight: spacing.sm,
  },
  labelText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
  addressArea: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
    flex: 1,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  addressDetails: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  contactName: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginTop: 4,
  },
  deliveryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.sm,
    marginTop: spacing.sm,
    borderWidth: 0,
  },
  deliveryTimeText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#267E3E',
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  instructionsSection: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  instructionsHeader: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputBox: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52,
  },
  textInput: {
    fontSize: typography.fontSizes.xs,
    color: colors.text,
    textAlignVertical: 'top',
  },
  bottomBar: {
    ...shadows.lg,
    position: 'absolute',
<<<<<<< HEAD
    bottom: 78,
=======
    bottom: Platform.OS === 'ios' ? 78 : 62,
>>>>>>> c2d4ce9 (api intigrated)
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    zIndex: 999,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  continueButtonDisabled: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  continueText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  continueTextDisabled: {
    color: colors.textTertiary,
  },
  emptyAddressCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.sm,
  },
  emptyAddressTitle: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  emptyAddressSub: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  addAddressBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primaryFaded,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radii.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  addAddressBtnText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
});
