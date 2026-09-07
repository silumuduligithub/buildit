import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  ClipboardList,
  User,
  Package,
  BarChart3,
  MoreHorizontal,
  Truck,
  Wallet,
} from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows } from '../theme/colors';
import { useAppStore } from '../store';

type IconComponent = React.FC<{ size: number; color: string; strokeWidth: number }>;

const TAB_CONFIG: Record<string, { label: string; Icon: IconComponent }> = {
  Home: { label: 'Home', Icon: Home },
  Categories: { label: 'Categories', Icon: LayoutGrid },
  Cart: { label: 'Cart', Icon: ShoppingCart },
  Orders: { label: 'Orders', Icon: ClipboardList },
  Account: { label: 'Account', Icon: User },
  // Retailer
  Inventory: { label: 'Inventory', Icon: Package },
  Analytics: { label: 'Analytics', Icon: BarChart3 },
  More: { label: 'More', Icon: MoreHorizontal },
  // Driver
  Deliveries: { label: 'Deliveries', Icon: Truck },
  Earnings: { label: 'Earnings', Icon: Wallet },
  Profile: { label: 'Profile', Icon: User },
};

export default function InteractiveBottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { cart, currentRole } = useAppStore();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Role-based accent color
  const accentColor =
    currentRole === 'retailer'
      ? colors.retailer
      : currentRole === 'delivery'
        ? colors.delivery
        : colors.primary;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || {
            label: route.name,
            Icon: Home,
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          const isCartTab = route.name === 'Cart';
          const iconColor = isFocused ? accentColor : colors.textTertiary;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={config.label}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <config.Icon
                  size={22}
                  color={iconColor}
                  strokeWidth={isFocused ? 2 : 1.5}
                />

                {/* Cart Badge */}
                {isCartTab && totalCartCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: accentColor }]}>
                    <Text style={styles.badgeText}>
                      {totalCartCount > 99 ? '99+' : totalCartCount}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.label,
                  isFocused
                    ? [styles.labelActive, { color: accentColor }]
                    : styles.labelInactive,
                ]}
                numberOfLines={1}
              >
                {config.label}
              </Text>

              {/* Active indicator line */}
              {isFocused && (
                <View style={[styles.activeIndicator, { backgroundColor: accentColor }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.md,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    position: 'relative',
    minHeight: 48,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: typography.weights.bold,
    lineHeight: 12,
  },
  label: {
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },
  labelActive: {
    fontWeight: typography.weights.semibold,
  },
  labelInactive: {
    color: colors.textTertiary,
    fontWeight: typography.weights.regular,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 2,
    borderRadius: 1,
  },
});
