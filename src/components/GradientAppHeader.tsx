import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Bell,
  Search,
  Camera,
  SlidersHorizontal,
  Truck,
  User,
} from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows } from '../theme/colors';
import { useAppStore } from '../store';

export interface GradientAppHeaderProps {
  variant?: 'home' | 'orders' | 'standard';
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  // Home / Orders fulfillment controls
  fulfillmentMode?: 'self_collect' | 'delivery';
  onFulfillmentChange?: (mode: 'self_collect' | 'delivery') => void;
  fulfillmentSubtext?: string;
  onNotificationPress?: () => void;
  hasUnreadNotification?: boolean;
  // Search & Filter controls
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchPress?: () => void;
  onCameraPress?: () => void;
  onFilterPress?: () => void;
  // Standard right action
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  // Gradient override
  gradientColors?: readonly [string, string, ...string[]];
}

export default function GradientAppHeader({
  variant = 'standard',
  title = 'BuildKart',
  subtitle,
  showBack = true,
  onBackPress,
  fulfillmentMode: propFulfillmentMode,
  onFulfillmentChange: propOnFulfillmentChange,
  fulfillmentSubtext,
  onNotificationPress,
  hasUnreadNotification = true,
  showSearch = true,
  searchPlaceholder = 'Search Product',
  onSearchPress,
  onCameraPress,
  onFilterPress,
  rightIcon,
  onRightPress,
  gradientColors,
}: GradientAppHeaderProps) {
  const storeFulfillment = useAppStore((s) => s.fulfillmentMode);
  const storeSetFulfillment = useAppStore((s) => s.setFulfillmentMode);

  const activeFulfillment = propFulfillmentMode ?? storeFulfillment;
  const setFulfillment = propOnFulfillmentChange ?? storeSetFulfillment;

  const isHomeOrOrders = variant === 'home' || variant === 'orders';
  const gradient = gradientColors || colors.gradientBrand;

  const defaultSubtext =
    activeFulfillment === 'self_collect'
      ? 'Feel free to pick up your goods at our distribution centres/factories.'
      : 'Fast and reliable delivery right to your construction site.';

  return (
    <LinearGradient
<<<<<<< HEAD
      colors={['#1B1717', '#D96F48', '#E89A69', '#F2D7C0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
=======
      colors={gradient as any}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
>>>>>>> c2d4ce9 (api intigrated)
      style={[
        styles.container,
        isHomeOrOrders ? styles.homeContainer : styles.standardContainer,
      ]}
    >
      {isHomeOrOrders ? (
        <>
          {/* ── TOP ROW: Fulfillment Switcher & Notification Bell ── */}
          <View style={styles.topActionRow}>
            {/* Pill Switcher */}
            <View style={styles.fulfillmentPillContainer}>
              <TouchableOpacity
                style={[
                  styles.pillSegment,
                  activeFulfillment === 'self_collect' && styles.pillSegmentActive,
                ]}
                onPress={() => setFulfillment('self_collect')}
                activeOpacity={0.85}
              >
                <User
                  size={15}
                  color={
                    activeFulfillment === 'self_collect'
                      ? colors.text
                      : 'rgba(255,255,255,0.85)'
                  }
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.pillSegmentText,
                    activeFulfillment === 'self_collect' &&
                      styles.pillSegmentTextActive,
                  ]}
                >
                  Self Collect
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pillSegment,
                  activeFulfillment === 'delivery' && styles.pillSegmentActive,
                ]}
                onPress={() => setFulfillment('delivery')}
                activeOpacity={0.85}
              >
                <Truck
                  size={15}
                  color={
                    activeFulfillment === 'delivery'
                      ? colors.text
                      : 'rgba(255,255,255,0.85)'
                  }
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.pillSegmentText,
                    activeFulfillment === 'delivery' &&
                      styles.pillSegmentTextActive,
                  ]}
                >
                  Delivery
                </Text>
              </TouchableOpacity>
            </View>

            {/* Notification Bell */}
            <TouchableOpacity
              style={styles.bellButton}
              onPress={onNotificationPress}
              activeOpacity={0.8}
              accessibilityLabel="Notifications"
            >
              <Bell size={18} color={colors.white} strokeWidth={1.8} />
              {hasUnreadNotification && <View style={styles.bellDot} />}
            </TouchableOpacity>
          </View>

          {/* ── Subtitle Description ── */}
          <Text style={styles.fulfillmentSubtext} numberOfLines={2}>
            {fulfillmentSubtext || defaultSubtext}
          </Text>

          {/* ── Search & Filter Floating Row ── */}
          {showSearch && (
            <View style={styles.searchFilterRow}>
              <TouchableOpacity
                style={styles.searchBar}
                onPress={onSearchPress}
                activeOpacity={0.92}
                accessibilityLabel="Search Product"
              >
                <Search size={18} color="#94A3B8" strokeWidth={2} />
                <Text style={styles.searchPlaceholder} numberOfLines={1}>
                  {searchPlaceholder}
                </Text>
                <TouchableOpacity
                  style={styles.cameraIconBtn}
                  onPress={onCameraPress || onSearchPress}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Camera size={18} color="#64748B" strokeWidth={1.8} />
                </TouchableOpacity>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterButton}
                onPress={onFilterPress || onSearchPress}
                activeOpacity={0.85}
                accessibilityLabel="Filter"
              >
                <SlidersHorizontal size={18} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <>
          {/* ── STANDARD HEADER ── */}
          <View style={styles.standardRow}>
            {showBack ? (
              <TouchableOpacity
                style={styles.standardBackBtn}
                onPress={onBackPress}
                activeOpacity={0.8}
                accessibilityLabel="Go back"
              >
                <ArrowLeft size={20} color={colors.white} strokeWidth={2} />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} />
            )}

            <View style={styles.titleBox}>
              <Text style={styles.titleText} numberOfLines={1}>
                {title}
              </Text>
              {subtitle ? (
                <Text style={styles.subtitleText} numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : null}
            </View>

            {rightIcon && onRightPress ? (
              <TouchableOpacity
                style={styles.standardBackBtn}
                onPress={onRightPress}
                activeOpacity={0.8}
              >
                {typeof rightIcon === 'string' ? (
                  <Text style={{ fontSize: 16 }}>{rightIcon}</Text>
                ) : (
                  rightIcon
                )}
              </TouchableOpacity>
            ) : (
              <View style={{ width: 36 }} />
            )}
          </View>

          {showSearch && (
            <View style={[styles.searchFilterRow, { marginTop: spacing.md }]}>
              <TouchableOpacity
                style={styles.searchBar}
                onPress={onSearchPress}
                activeOpacity={0.92}
              >
                <Search size={18} color="#94A3B8" strokeWidth={2} />
                <Text style={styles.searchPlaceholder}>{searchPlaceholder}</Text>
                <Camera size={18} color="#64748B" strokeWidth={1.8} />
              </TouchableOpacity>
              {onFilterPress && (
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={onFilterPress}
                  activeOpacity={0.85}
                >
                  <SlidersHorizontal size={18} color={colors.text} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </>
      )}
    </LinearGradient>
  );
}

const TOP_INSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 2 : 44;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
  },
  homeContainer: {
    paddingTop: TOP_INSET,
    paddingBottom: spacing.base,
  },
  standardContainer: {
    paddingTop: TOP_INSET,
    paddingBottom: spacing.sm,
  },

  // ── Top Action Row (Mockup Style) ──
  topActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  fulfillmentPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 30,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  pillSegment: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 24,
    gap: 6,
  },
  pillSegmentActive: {
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  pillSegmentText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  pillSegmentTextActive: {
    color: colors.text,
    fontWeight: typography.weights.bold,
  },

  // Notification Bell
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.white,
  },

  // Subtitle
  fulfillmentSubtext: {
    fontSize: typography.fontSizes.bodySmall,
    color: 'rgba(255, 255, 255, 0.82)',
    lineHeight: 18,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    maxWidth: '88%',
  },

  // Search & Filter Row
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 26,
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    ...shadows.md,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: typography.fontSizes.body,
    color: '#94A3B8',
    fontWeight: typography.weights.regular,
  },
  cameraIconBtn: {
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },

  // Standard Header Rows
  standardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  standardBackBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  titleBox: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  titleText: {
    fontSize: typography.fontSizes.h3,
    fontWeight: typography.weights.semibold,
    color: colors.white,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: typography.fontSizes.caption,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
    textAlign: 'center',
  },
});
