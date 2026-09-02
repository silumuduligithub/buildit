import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import GradientAppHeader from '../../components/GradientAppHeader';

const MENU_ITEMS = [
  { id: 'm_profile', title: 'My Profile', icon: '👤', screen: 'Profile' },
  { id: 'm_addresses', title: 'Saved Addresses', icon: '📍', screen: 'LocationSelect' },
  { id: 'm_orders', title: 'My Orders', icon: '📦', screen: 'Orders' },
  { id: 'm_cart', title: 'My Cart', icon: '🛒', screen: 'Cart' },
  { id: 'm_payments', title: 'Payments', icon: '💳', screen: 'Payment' },
  { id: 'm_help', title: 'Help & Support', icon: '💬', screen: 'Help' },
  { id: 'm_settings', title: 'Settings', icon: '⚙️', screen: 'Settings' },
];

export default function AccountScreen({ navigation }: any) {
  const handleMenuPress = (item: typeof MENU_ITEMS[0]) => {
    if (item.screen === 'LocationSelect') {
      navigation.navigate('LocationSelect');
    } else if (item.screen === 'Orders') {
      navigation.navigate('Orders');
    } else if (item.screen === 'Cart') {
      navigation.navigate('Cart');
    } else {
      Alert.alert(item.title, `Manage your ${item.title.toLowerCase()} settings.`);
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Account) ── */}
      <GradientAppHeader
        title="My Account"
        subtitle="Ravi Kumar • 9876543210"
        showBack={false}
        rightIcon="⚙️"
        onRightPress={() => Alert.alert('Settings', 'App preferences & notifications')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileSummaryCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>RK</Text>
          </View>

          <View style={styles.profileTextBox}>
            <Text style={styles.profileName}>Ravi Kumar</Text>
            <Text style={styles.profilePhone}>+91 98765 43210</Text>
            <Text style={styles.profileEmail}>ravi.kumar@buildkart.in</Text>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => Alert.alert('Edit Profile', 'Update your personal info and GST details.')}
          >
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Cards */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuRow}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.75}
            >
              <View style={styles.menuIconCircle}>
                <Text style={styles.menuIconEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* GST / Business Billing Card */}
        <View style={styles.businessCard}>
          <View style={styles.businessTop}>
            <Text style={styles.businessIcon}>💼</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.businessTitle}>BuildKart for Business / Contractors</Text>
              <Text style={styles.businessSub}>Add GSTIN for tax input credit & bulk wholesale rates</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addGstBtn}
            onPress={() => Alert.alert('GST Invoicing', 'Enter your 15-digit GSTIN to claim 18% ITC on materials.')}
          >
            <Text style={styles.addGstText}>+ Add GSTIN</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>BuildKart App v1.0.0 (Release)</Text>

        <View style={{ height: 100 }} />
      </ScrollView>
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
    gap: spacing.md,
  },
  profileSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    ...shadows.sm,
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
  },
  profileTextBox: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  profilePhone: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: typography.weights.semibold,
  },
  profileEmail: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 16,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuIconEmoji: {
    fontSize: 18,
  },
  menuTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
    flex: 1,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
    fontWeight: typography.weights.bold,
  },
  businessCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.sm,
  },
  businessTop: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  businessIcon: {
    fontSize: 24,
  },
  businessTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  businessSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  addGstBtn: {
    backgroundColor: colors.primaryFaded,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addGstText: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
