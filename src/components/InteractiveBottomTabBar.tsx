import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, spacing, typography, radii, shadows } from '../theme/colors';
import { useAppStore } from '../store';

const TAB_CONFIG: Record<
  string,
  { label: string; activeIcon: string; inactiveIcon: string; highlightColor: string }
> = {
  Home: {
    label: 'Home',
    activeIcon: '🏠',
    inactiveIcon: '🏚️',
    highlightColor: colors.primary,
  },
  Categories: {
    label: 'Categories',
    activeIcon: '🗂️',
    inactiveIcon: '📁',
    highlightColor: colors.primary,
  },
  Cart: {
    label: 'Cart',
    activeIcon: '🛒',
    inactiveIcon: '🛍️',
    highlightColor: colors.primary,
  },
  Orders: {
    label: 'Orders',
    activeIcon: '📋',
    inactiveIcon: '📫',
    highlightColor: colors.primary,
  },
  Inventory: {
    label: 'Inventory',
    activeIcon: '📦',
    inactiveIcon: '📦',
    highlightColor: colors.primary,
  },
  Analytics: {
    label: 'Analytics',
    activeIcon: '📊',
    inactiveIcon: '📈',
    highlightColor: colors.primary,
  },
  More: {
    label: 'More',
    activeIcon: '⋯',
    inactiveIcon: '⋯',
    highlightColor: colors.primary,
  },
  Account: {
    label: 'Account',
    activeIcon: '👤',
    inactiveIcon: '👤',
    highlightColor: colors.primary,
  },
  Deliveries: {
    label: 'Deliveries',
    activeIcon: '📋',
    inactiveIcon: '📦',
    highlightColor: '#FF6B00',
  },
  Earnings: {
    label: 'Earnings',
    activeIcon: '💲',
    inactiveIcon: '👛',
    highlightColor: '#FF6B00',
  },
  Profile: {
    label: 'Profile',
    activeIcon: '👤',
    inactiveIcon: '👤',
    highlightColor: '#FF6B00',
  },
};

export default function InteractiveBottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { cart } = useAppStore();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.dockWrapper}>
      <View style={styles.tabDockContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || {
            label: route.name,
            activeIcon: '✨',
            inactiveIcon: '✨',
            highlightColor: colors.primary,
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
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const isCartTab = route.name === 'Cart';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tabButton, isFocused && styles.tabButtonActive]}
              activeOpacity={0.72}
            >
              {/* Active Background Glow Capsule */}
              {isFocused && <View style={styles.activeCapsule} />}

              {/* Icon Container with Badge */}
              <View style={styles.iconWrapper}>
                <Text style={[styles.tabEmoji, isFocused ? styles.tabEmojiActive : styles.tabEmojiInactive]}>
                  {isFocused ? config.activeIcon : config.inactiveIcon}
                </Text>

                {/* Cart Badge */}
                {isCartTab && totalCartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {totalCartCount > 99 ? '99+' : totalCartCount}
                    </Text>
                  </View>
                )}
              </View>

              {/* Tab Title Label */}
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
                numberOfLines={1}
              >
                {config.label}
              </Text>

              {/* Active Indicator Dot */}
              {isFocused && <View style={styles.activeIndicatorDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockWrapper: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabDockContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...shadows.lg,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
    borderRadius: radii.lg,
  },
  tabButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  activeCapsule: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 4,
    right: 4,
    backgroundColor: '#FFF0F0',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#FFDCDC',
  },
  iconWrapper: {
    width: 32,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabEmoji: {
    fontSize: 20,
  },
  tabEmojiActive: {
    fontSize: 22,
  },
  tabEmojiInactive: {
    opacity: 0.45,
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -8,
    backgroundColor: colors.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.white,
    ...shadows.sm,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: typography.weights.extrabold,
    letterSpacing: -0.1,
  },
  tabLabelInactive: {
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  activeIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
});
