import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { subscribeToApiLoading } from '../../services/api/apiClient';
import { useAppSelector } from '../../redux/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function GlobalLoadingIndicator() {
  const reduxIsLoading = useAppSelector((state) => state.ui?.isGlobalLoading ?? false);
  const reduxMessage = useAppSelector((state) => state.ui?.loadingMessage ?? null);

  const [apiIsLoading, setApiIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToApiLoading((isLoading, count, msg) => {
      setApiIsLoading(isLoading);
      if (msg) setApiMessage(msg);
      else if (!isLoading) setApiMessage(null);
    });
    return unsubscribe;
  }, []);

  const isLoading = reduxIsLoading || apiIsLoading;
  const message = reduxMessage || apiMessage;

  // Top Progress Bar Animation
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const loopAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      progressAnim.setValue(0);
      loopAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: false,
          }),
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ])
      );
      loopAnimationRef.current.start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
      if (loopAnimationRef.current) {
        loopAnimationRef.current.stop();
      }
    }

    return () => {
      if (loopAnimationRef.current) loopAnimationRef.current.stop();
    };
  }, [isLoading, fadeAnim, progressAnim]);

  if (!isLoading) {
    return null;
  }

  const barTranslateX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH * 0.4, SCREEN_WIDTH],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]} pointerEvents="none">
      {/* Sleek Top Edge Glowing Progress Bar */}
      <View style={styles.topBarTrack}>
        <Animated.View
          style={[
            styles.topBarFill,
            {
              transform: [{ translateX: barTranslateX }],
            },
          ]}
        />
      </View>

      {/* Floating Status Pill if a descriptive message is present */}
      {message ? (
        <View style={styles.pillOverlay}>
          <View style={styles.pill}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.pillText}>{message}</Text>
          </View>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
    elevation: 99999,
  },
  topBarTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
    overflow: 'hidden',
    position: 'relative',
    top: Platform.OS === 'ios' ? 44 : 0,
  },
  topBarFill: {
    width: SCREEN_WIDTH * 0.4,
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 4,
  },
  pillOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1E28',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.base,
    borderRadius: radii.full,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: typography.fontSizes.caption,
    fontWeight: '600',
  },
});
