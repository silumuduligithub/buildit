import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';

export default function RetailerStoreProfile({ navigation }: any) {
  const {
    retailerProfile,
    updateRetailerProfile,
    isStoreOpen,
    toggleStoreStatus,
  } = useAppStore();

  const [name, setName] = useState(retailerProfile.name || 'Sri Sai Hardware & Builders');
  const [address, setAddress] = useState(retailerProfile.address || 'Plot No. 12, Main Road, Kondapur, Hyderabad, TS');
  const [hours, setHours] = useState(retailerProfile.operatingHours || '08:00 AM – 09:00 PM');
  const [radius, setRadius] = useState((retailerProfile.deliveryRadiusKm || 15).toString());
  const [phone, setPhone] = useState(retailerProfile.phone || '+91 98480 12345');
  const [gstin, setGstin] = useState(retailerProfile.gstin || '36AABCU9603R1ZM');

  const handleSave = () => {
    updateRetailerProfile({
      name,
      address,
      operatingHours: hours,
      deliveryRadiusKm: parseInt(radius, 10) || 15,
      phone,
      gstin,
    });
    Alert.alert('Profile Saved', 'Store information updated successfully!');
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Store Profile & Settings"
        subtitle="Manage business info, operating hours & radius"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Store Logo Card */}
        <View style={styles.logoCard}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🏪</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.logoCardTitle}>{name}</Text>
            <Text style={styles.gstinText}>GSTIN: {gstin}</Text>
          </View>
          <TouchableOpacity
            style={styles.changeLogoBtn}
            onPress={() => Alert.alert('Update Logo', 'Select store logo image')}
          >
            <Text style={styles.changeLogoText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Store Open / Closed Toggle Card */}
        <View style={styles.toggleCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Store Availability</Text>
            <Text style={styles.toggleSub}>
              {isStoreOpen
                ? 'Store is OPEN. Customers can place orders.'
                : 'Store is CLOSED. New orders paused.'}
            </Text>
          </View>
          <Switch
            value={isStoreOpen}
            onValueChange={toggleStoreStatus}
            trackColor={{ false: '#9CA3AF', true: '#059669' }}
            thumbColor={colors.white}
          />
        </View>

        {/* Store Information Form */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>STORE DETAILS</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Store Trade Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Store Address / Depot Location</Text>
            <TextInput
              style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Store Contact Phone</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
        </View>

        {/* Delivery & Operations */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>DELIVERY & TIMINGS</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Daily Operating Hours</Text>
            <TextInput style={styles.input} value={hours} onChangeText={setHours} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Serviceable Delivery Radius (km)</Text>
            <TextInput
              style={styles.input}
              value={radius}
              onChangeText={setRadius}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>GSTIN (For 18% ITC Billing)</Text>
            <TextInput style={styles.input} value={gstin} onChangeText={setGstin} autoCapitalize="characters" />
          </View>
        </View>

        {/* Save CTA */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.88}>
          <Text style={styles.saveBtnText}>Save Store Settings</Text>
        </TouchableOpacity>

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
  logoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm + 2,
    ...shadows.sm,
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: radii.xl,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 26,
  },
  logoCardTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  gstinText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  changeLogoBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.md,
  },
  changeLogoText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  toggleTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  toggleSub: {
    fontSize: typography.fontSizes.xs,
    color: '#6B7280',
    marginTop: 2,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  formGroup: {
    gap: 4,
  },
  label: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: typography.fontSizes.xs + 1,
    color: '#111827',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    ...shadows.md,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
});
