import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  User,
  MapPin,
  Package,
  ShoppingCart,
  CreditCard,
  MessageCircle,
  Settings,
  ChevronRight,
  Pencil,
  Briefcase,
  Plus,
} from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows, iconSizes } from '../../theme/colors';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';

type LucideIcon = React.FC<{ size: number; color: string; strokeWidth: number }>;

const MENU_ITEMS: { id: string; title: string; Icon: LucideIcon; screen: string }[] = [
  { id: 'm_profile', title: 'My Profile', Icon: User, screen: 'Profile' },
  { id: 'm_addresses', title: 'Saved Addresses', Icon: MapPin, screen: 'LocationSelect' },
  { id: 'm_orders', title: 'My Orders', Icon: Package, screen: 'Orders' },
  { id: 'm_cart', title: 'My Cart', Icon: ShoppingCart, screen: 'Cart' },
  { id: 'm_payments', title: 'Payments', Icon: CreditCard, screen: 'Payment' },
  { id: 'm_help', title: 'Help & Support', Icon: MessageCircle, screen: 'Help' },
  { id: 'm_settings', title: 'Settings', Icon: Settings, screen: 'Settings' },
];

export default function AccountScreen({ navigation }: any) {
  const { currentUser, refreshProfile, logoutUser } = useAppStore();

  useEffect(() => {
    refreshProfile().catch(() => {});
  }, []);

  const userName = currentUser?.name || 'Ravi Kumar';
  const userPhone = currentUser?.phone || '9876543210';
  const userEmail = currentUser?.email || 'ravi.kumar@buildkart.in';
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'RK';

  const handleMenuPress = (item: (typeof MENU_ITEMS)[0]) => {
    if (item.screen === 'LocationSelect') {
      navigation.navigate('LocationSelect');
    } else if (item.screen === 'Orders') {
      navigation.navigate('Orders');
    } else if (item.screen === 'Cart') {
      navigation.navigate('Cart');
    } else if (item.screen === 'Settings') {
      Alert.alert('Settings', 'Account & App Preferences', [
        { text: 'Logout', style: 'destructive', onPress: () => logoutUser() },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      Alert.alert(item.title, `Manage your ${item.title.toLowerCase()} settings.`);
    }
  };

  return (
    <View style={styles.root}>
      <GradientAppHeader
        title="My Account"
        subtitle={`${userName} · ${userPhone}`}
        showBack={false}
        rightIcon={<Settings size={18} color={colors.white} strokeWidth={1.5} />}
        onRightPress={() => Alert.alert('Settings', 'App preferences & notifications')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profilePhone}>{userPhone.startsWith('+91') ? userPhone : `+91 ${userPhone}`}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => Alert.alert('Edit Profile', 'Update your personal info and GST details.')}
            accessibilityLabel="Edit profile"
          >
            <Pencil size={16} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuRow,
                index < MENU_ITEMS.length - 1 && styles.menuRowBorder,
              ]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.75}
            >
              <View style={styles.menuIconBox}>
                <item.Icon size={18} color={colors.textSecondary} strokeWidth={1.5} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.5} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Business Card */}
        <View style={styles.businessCard}>
          <View style={styles.businessHeader}>
            <View style={styles.businessIconBox}>
              <Briefcase size={20} color={colors.primary} strokeWidth={1.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.businessTitle}>BuildKart for Business</Text>
              <Text style={styles.businessSub}>
                Add GSTIN for tax input credit & bulk wholesale rates
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addGstButton}
            onPress={() =>
              Alert.alert('GST Invoicing', 'Enter your 15-digit GSTIN to claim 18% ITC on materials.')
            }
            activeOpacity={0.8}
          >
            <Plus size={14} color={colors.primary} strokeWidth={2} />
            <Text style={styles.addGstText}>Add GSTIN</Text>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.authActionsRow}>
          <TouchableOpacity
            style={styles.loginSwitchBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginSwitchText}>🔑 Sign In / Switch Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to sign out?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: async () => {
                    await logoutUser();
                    navigation.navigate('Login');
                  },
                },
              ]);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
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
    padding: spacing.base,
    gap: spacing.md,
  },

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarInitials: {
    color: colors.white,
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.bold,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSizes.title,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  profilePhone: {
    fontSize: typography.fontSizes.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileEmail: {
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
    marginTop: 1,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Menu
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },

  // Business Card
  businessCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
    ...shadows.sm,
  },
  businessHeader: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  businessIconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessTitle: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  businessSub: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  addGstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFaded,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing.xs,
  },
  addGstText: {
    color: colors.primary,
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.semibold,
  },
  authActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  loginSwitchBtn: {
    flex: 2,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  loginSwitchText: {
    color: colors.text,
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
  },
  logoutBtn: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    color: '#DC2626',
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
  },
  versionText: {
    textAlign: 'center',
    fontSize: typography.fontSizes.caption,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
});
