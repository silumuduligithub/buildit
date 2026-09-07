import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import {
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../theme/colors';

export type FlashMessageType = 'error' | 'warning' | 'success' | 'info';

export interface FlashMessageOptions {
  type?: FlashMessageType;
  message: string;
  description?: string;
  duration?: number;
}

type FlashMessageListener = (options: FlashMessageOptions | null) => void;
const listeners: Set<FlashMessageListener> = new Set();

export const subscribeToFlashMessage = (listener: FlashMessageListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const showFlashMessage = (options: FlashMessageOptions) => {
  listeners.forEach((fn) => fn(options));
};

export const hideFlashMessage = () => {
  listeners.forEach((fn) => fn(null));
};

const TOP_SAFE_INSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 50;

export default function FlashMessage() {
  const [current, setCurrent] = useState<FlashMessageOptions | null>(null);
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = subscribeToFlashMessage((options) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (!options) {
        dismiss();
        return;
      }

      setCurrent(options);

      // Slide In
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
          speed: 14,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      const autoDuration = options.duration || (options.type === 'error' ? 4000 : 3200);
      timerRef.current = setTimeout(() => {
        dismiss();
      }, autoDuration);
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrent(null);
    });
  };

  if (!current) return null;

  const type = current.type || 'error';

  const typeConfig = {
    error: {
      bg: '#DC2626',
      borderColor: '#B91C1C',
      Icon: current.message.toLowerCase().includes('network') || current.message.toLowerCase().includes('offline')
        ? WifiOff
        : AlertTriangle,
      iconColor: '#FFFFFF',
    },
    warning: {
      bg: '#D97706',
      borderColor: '#B45309',
      Icon: AlertCircle,
      iconColor: '#FFFFFF',
    },
    success: {
      bg: '#059669',
      borderColor: '#047857',
      Icon: CheckCircle2,
      iconColor: '#FFFFFF',
    },
    info: {
      bg: '#2563EB',
      borderColor: '#1D4ED8',
      Icon: Info,
      iconColor: '#FFFFFF',
    },
  }[type];

  const { bg, borderColor, Icon, iconColor } = typeConfig;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: bg,
          borderColor,
        },
      ]}
    >
      <View style={styles.iconCircle}>
        <Icon size={20} color={iconColor} strokeWidth={2.2} />
      </View>

      <View style={styles.content}>
        <Text style={styles.messageText} numberOfLines={2}>
          {current.message}
        </Text>
        {current.description ? (
          <Text style={styles.descriptionText} numberOfLines={2}>
            {current.description}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={dismiss}
        style={styles.closeBtn}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={16} color="rgba(255,255,255,0.85)" strokeWidth={2} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...shadows.lg,
    position: 'absolute',
    top: TOP_SAFE_INSET,
    left: spacing.base,
    right: spacing.base,
    zIndex: 99999,
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    lineHeight: 18,
  },
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.medium,
    marginTop: 2,
    lineHeight: 15,
  },
  closeBtn: {
    padding: 4,
    borderRadius: radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
});
