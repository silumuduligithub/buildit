import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../theme/colors';

interface SwiggyHeaderProps {
  onLocationPress?: () => void;
  onProfilePress?: () => void;
  title?: string;
  subtitle?: string;
}

export default function SwiggyHeader({
  onLocationPress,
  onProfilePress,
  title = 'Koramangala 5th Block',
  subtitle = '8th Main, No. 14, Bengaluru, Karnataka',
}: SwiggyHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.locationButton} onPress={onLocationPress} activeOpacity={0.8}>
          <View style={styles.locationIconBox}>
            <Text style={styles.locationIcon}>📍</Text>
          </View>
          <View style={styles.locationTextBox}>
            <View style={styles.titleRow}>
              <Text style={styles.locationTitle}>{title}</Text>
              <Text style={styles.chevronIcon}>▼</Text>
            </View>
            <Text style={styles.locationSubtitle} numberOfLines={1}>{subtitle}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.expressBadge}>
          <Text style={styles.boltIcon}>⚡</Text>
          <Text style={styles.expressText}>30 MINS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatarButton} onPress={onProfilePress}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>BK</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    ...shadows.sm,
  },
  leftSection: {
    flex: 1,
    marginRight: spacing.sm,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  locationIconBox: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    fontSize: 16,
  },
  locationTextBox: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    letterSpacing: -0.2,
  },
  chevronIcon: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  locationSubtitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  expressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.full,
    gap: 3,
  },
  boltIcon: {
    fontSize: 11,
  },
  expressText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  avatarButton: {
    padding: 2,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarText: {
    color: colors.white,
    fontWeight: typography.weights.extrabold,
    fontSize: 12,
  },
});
