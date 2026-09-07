import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Search as SearchIcon, Mic } from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows } from '../../theme/colors';

interface SearchBarProps {
  placeholder?: string;
  onPress?: () => void;
  showMic?: boolean;
  style?: ViewStyle;
  variant?: 'default' | 'filled';
}

export default function SearchBar({
  placeholder = 'Search products, brands, stores...',
  onPress,
  showMic = false,
  style,
  variant = 'default',
}: SearchBarProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        variant === 'filled' && styles.containerFilled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityLabel="Search"
      accessibilityRole="search"
    >
      <SearchIcon size={18} color={colors.textTertiary} strokeWidth={2} />
      <Text style={styles.placeholder}>{placeholder}</Text>
      {showMic && (
        <View style={styles.micButton}>
          <Mic size={16} color={colors.textSecondary} strokeWidth={1.5} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.sm,
  },
  containerFilled: {
    backgroundColor: colors.surfaceSecondary,
    borderColor: colors.borderLight,
  },
  placeholder: {
    flex: 1,
    fontSize: typography.fontSizes.body,
    color: colors.textTertiary,
    fontWeight: typography.weights.regular,
  },
  micButton: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
