import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { mockSavedAddresses } from '../../services/mockData';
import GradientAppHeader from '../../components/GradientAppHeader';

export default function LocationSelection({ navigation }: any) {
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr_1');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Location Selection) ── */}
      <GradientAppHeader
        title="Select Delivery Location"
        subtitle="Choose your construction site or home"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search on map input */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search area or select on map"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Map Placeholder Card */}
        <View style={styles.mapCard}>
          <View style={styles.mapPattern}>
            <View style={styles.mapGridLine1} />
            <View style={styles.mapGridLine2} />
            <View style={styles.mapRoad1} />
            <View style={styles.mapRoad2} />
            {/* Center Map Pin */}
            <View style={styles.mapPinPulse}>
              <View style={styles.mapPinBubble}>
                <Text style={styles.mapPinIcon}>📍</Text>
              </View>
            </View>
          </View>
          <Text style={styles.mapHintText}>Kondapur Main Road, Hyderabad, TS</Text>
        </View>

        {/* Use current location button */}
        <TouchableOpacity style={styles.currentLocationBtn} activeOpacity={0.8}>
          <Text style={styles.currentLocationIcon}>🎯</Text>
          <Text style={styles.currentLocationText}>Use my current location</Text>
        </TouchableOpacity>

        {/* Saved Addresses */}
        <View style={styles.savedAddressesSection}>
          <Text style={styles.savedAddressesHeader}>Saved Addresses</Text>

          {mockSavedAddresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;
            return (
              <TouchableOpacity
                key={addr.id}
                style={[styles.addressItem, isSelected && styles.addressItemActive]}
                onPress={() => setSelectedAddressId(addr.id)}
                activeOpacity={0.85}
              >
                <View style={styles.addressLeft}>
                  <View style={styles.addressIconCircle}>
                    <Text style={styles.addressIconEmoji}>{addr.tag === 'Home' ? '🏠' : '🏗️'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.addressLabel}>{addr.label}</Text>
                    <Text style={styles.addressSub}>{addr.address}</Text>
                    <Text style={styles.addressDetails} numberOfLines={1}>{addr.details}</Text>
                  </View>
                </View>

                {/* Radio Circle */}
                <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('HomeScreen')}
          activeOpacity={0.88}
        >
          <Text style={styles.continueText}>Continue</Text>
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
    paddingBottom: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSizes.sm,
    color: colors.text,
  },
  mapCard: {
    height: 180,
    backgroundColor: '#E5EFEA',
    borderRadius: radii.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  mapPattern: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapGridLine1: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#D1E3D9',
  },
  mapGridLine2: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#D1E3D9',
  },
  mapRoad1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '35%',
    width: 24,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  mapRoad2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '25%',
    width: 16,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
  },
  mapPinPulse: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinBubble: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  mapPinIcon: {
    fontSize: 22,
  },
  mapHintText: {
    position: 'absolute',
    bottom: spacing.sm,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  currentLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  currentLocationIcon: {
    fontSize: 16,
  },
  currentLocationText: {
    color: colors.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  savedAddressesSection: {
    gap: spacing.sm,
  },
  savedAddressesHeader: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  addressItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    paddingRight: spacing.sm,
  },
  addressIconCircle: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressIconEmoji: {
    fontSize: 18,
  },
  addressLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  addressSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  addressDetails: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
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
  bottomBar: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  continueText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
  },
});
