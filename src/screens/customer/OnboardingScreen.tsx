import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.root}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🏗️</Text>
          </View>
          <View>
            <Text style={styles.logoTitle}>Build<Text style={{ color: colors.primary }}>Kart</Text></Text>
            <Text style={styles.logoSub}>Building Better Together</Text>
          </View>
        </View>
      </View>

      {/* Hero Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationCircle}>
          <Text style={styles.illustrationEmoji}>🏗️👷‍♂️🏢</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.heroTitle}>Build<Text style={{ color: colors.primary }}>Kart</Text></Text>
        <Text style={styles.tagline}>Everything for your construction, one app.</Text>
        <Text style={styles.description}>
          Compare prices, order from trusted local stores and get fast delivery.
        </Text>

        {/* Carousel Dots */}
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('LocationSelect')}
          activeOpacity={0.88}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginRow}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Text style={styles.alreadyAccountText}>
            Already have an account? <Text style={styles.loginText}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'space-between',
  },
  brandHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 24,
  },
  logoTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  logoSub: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  illustrationCircle: {
    width: width * 0.72,
    height: width * 0.72,
    borderRadius: (width * 0.72) / 2,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  illustrationEmoji: {
    fontSize: 64,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  getStartedButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  getStartedText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
  },
  loginRow: {
    marginTop: spacing.md,
  },
  alreadyAccountText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  loginText: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
});
