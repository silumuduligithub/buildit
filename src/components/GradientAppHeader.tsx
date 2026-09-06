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
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii, shadows } from '../theme/colors';

export interface GradientAppHeaderProps {
  // Mode: 'home' for dashboard, 'standard' for other screens
  variant?: 'home' | 'standard';
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  // Home mode props
  locationName?: string;
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
  hasUnreadNotification?: boolean;
  // Standard mode right action
  rightIcon?: string;
  onRightPress?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export default function GradientAppHeader({
  variant = 'standard',
  title = 'BuildKart',
  subtitle,
  showBack = true,
  onBackPress,
  locationName = 'Kondapur, Hyderabad',
  onLocationPress,
  onNotificationPress,
  onSearchPress,
  hasUnreadNotification = true,
  rightIcon,
  onRightPress,
  showSearch = false,
  searchPlaceholder = 'Search materials, tools, stores...',
}: GradientAppHeaderProps) {
  const isHome = variant === 'home';

  return (
    <LinearGradient
      colors={['#1B1717', '#D96F48', '#E89A69', '#F2D7C0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.gradientContainer,
        isHome ? styles.homePadding : styles.standardPadding,
      ]}
    >
      {/* Decorative ambient glowing overlay circles */}
      <View style={styles.ambientGlow1} />
      <View style={styles.ambientGlow2} />

      {isHome ? (
        /* ── HOME DASHBOARD HEADER ── */
        <>
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.locationGlassButton}
              onPress={onLocationPress}
              activeOpacity={0.82}
            >
              <View style={styles.pinCircle}>
                <Text style={styles.pinEmoji}>📍</Text>
              </View>

              <View style={styles.locationTextBox}>
                <View style={styles.deliverToRow}>
                  <Text style={styles.deliverToText}>DELIVER TO</Text>
                  <View style={styles.expressPill}>
                    <Text style={styles.boltIcon}>⚡</Text>
                    <Text style={styles.expressText}>30 MIN</Text>
                  </View>
                </View>

                <View style={styles.locationTitleRow}>
                  <Text style={styles.locationTitleText} numberOfLines={1}>
                    {locationName}
                  </Text>
                  <Text style={styles.chevronIcon}>▾</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.rightActionsRow}>
              <TouchableOpacity
                style={styles.glassIconButton}
                onPress={onNotificationPress}
                activeOpacity={0.8}
              >
                <Text style={styles.bellIcon}>🔔</Text>
                {hasUnreadNotification && <View style={styles.unreadPulseDot} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Embedded Search Bar */}
          <TouchableOpacity
            style={styles.searchBarContainer}
            onPress={onSearchPress}
            activeOpacity={0.92}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholderText}>
              Search cement, sand, steel, bricks...
            </Text>
            <View style={styles.micGlassBtn}>
              <Text style={styles.micEmoji}>🎙️</Text>
            </View>
          </TouchableOpacity>
        </>
      ) : (
        /* ── STANDARD SCREEN HEADER (Title, Back, Actions) ── */
        <View style={styles.standardContainer}>
          <View style={styles.standardTopRow}>
            {showBack ? (
              <TouchableOpacity
                style={styles.glassBackButton}
                onPress={onBackPress}
                activeOpacity={0.8}
              >
                <MaterialIcons name="arrow-back" size={22} color={colors.white} />
              </TouchableOpacity>
            ) : (
              <View style={styles.brandIconBox}>
                <Text style={styles.brandIconEmoji}>🏗️</Text>
              </View>
            )}

            <View style={styles.titleCenterBox}>
              <Text style={styles.screenTitleText} numberOfLines={1}>
                {title}
              </Text>
              {subtitle ? (
                <Text style={styles.screenSubtitleText} numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : null}
            </View>

            {rightIcon ? (
              <TouchableOpacity
                style={styles.glassIconButton}
                onPress={onRightPress}
                activeOpacity={0.8}
              >
                <Text style={styles.rightIconEmoji}>{rightIcon}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} />
            )}
          </View>

          {showSearch && (
            <TouchableOpacity
              style={[styles.searchBarContainer, { marginTop: spacing.sm }]}
              onPress={onSearchPress}
              activeOpacity={0.92}
            >
              <Text style={styles.searchIcon}>🔍</Text>
              <Text style={styles.searchPlaceholderText}>{searchPlaceholder}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </LinearGradient>
  );
}

const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 44;

const styles = StyleSheet.create({
  gradientContainer: {
    paddingHorizontal: spacing.md,
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    ...shadows.md,
  },
  homePadding: {
    paddingTop: topInset + 6,
    paddingBottom: spacing.md + 4,
  },
  standardPadding: {
    paddingTop: topInset + 6,
    paddingBottom: spacing.md + 2,
  },
  ambientGlow1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  ambientGlow2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  // Home styles
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  locationGlassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    flex: 1,
    marginRight: spacing.md,
    gap: spacing.sm,
  },
  pinCircle: {
    width: 34,
    height: 34,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pinEmoji: {
    fontSize: 16,
  },
  locationTextBox: {
    flex: 1,
  },
  deliverToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliverToText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.8,
  },
  expressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFCC00',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radii.xs,
    gap: 2,
  },
  boltIcon: {
    fontSize: 8,
  },
  expressText: {
    fontSize: 8,
    fontWeight: typography.weights.extrabold,
    color: '#111',
    letterSpacing: 0.3,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  locationTitleText: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    letterSpacing: -0.2,
  },
  chevronIcon: {
    fontSize: 12,
    color: '#FFCC00',
    fontWeight: typography.weights.extrabold,
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  glassIconButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    position: 'relative',
    ...shadows.sm,
  },
  bellIcon: {
    fontSize: 18,
  },
  rightIconEmoji: {
    fontSize: 18,
  },
  unreadPulseDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FFCC00',
    borderWidth: 1.5,
    borderColor: '#111',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    gap: spacing.sm,
    ...shadows.md,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchPlaceholderText: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  micGlassBtn: {
    paddingLeft: spacing.xs,
  },
  micEmoji: {
    fontSize: 15,
  },

  // Standard Header styles
  standardContainer: {
    width: '100%',
  },
  standardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  glassBackButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  backIconText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: typography.weights.bold,
  },
  brandIconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconEmoji: {
    fontSize: 20,
  },
  titleCenterBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
  },
  screenTitleText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  screenSubtitleText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },
});
