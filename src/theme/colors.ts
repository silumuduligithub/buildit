// BuildKart Design System — Black / Gray / White / Red Theme
export const colors = {
  // Brand — Red
  primary: '#E02020',
  primaryLight: '#FF3B3B',
  primaryDark: '#B01010',
  primaryFaded: '#FFF0F0',

  // Accent — stays red-toned
  accent: '#FF4444',
  accentLight: '#FFE5E5',

  // Role Colors — all mapped to the monochrome + red palette
  customer: '#E02020',       // Red
  retailer: '#1A1A1A',       // Near-black
  retailerLight: '#F2F2F2',
  delivery: '#444444',       // Dark gray
  deliveryLight: '#F5F5F5',
  admin: '#E02020',          // Red (same as primary)
  adminLight: '#FFF0F0',

  // Backgrounds
  background: '#F4F4F4',     // Light gray
  surface: '#FFFFFF',        // Pure white
  surfaceElevated: '#FFFFFF',
  border: '#E0E0E0',
  borderLight: '#EFEFEF',

  // Text
  text: '#111111',           // Near-black
  textSecondary: '#555555',  // Medium gray
  textMuted: '#999999',      // Light gray
  textInverse: '#FFFFFF',    // White

  // Semantic — re-mapped to palette
  success: '#2A2A2A',        // Dark gray for "positive"
  successLight: '#F0F0F0',
  warning: '#E02020',        // Red for urgency
  warningLight: '#FFF0F0',
  error: '#CC0000',          // Deeper red
  errorLight: '#FFE8E8',
  info: '#444444',           // Dark gray for info
  infoLight: '#F2F2F2',

  // Extra utility
  black: '#000000',
  white: '#FFFFFF',
  red: '#E02020',
  darkGray: '#1A1A1A',
  midGray: '#555555',
  lightGray: '#F4F4F4',
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const typography = {
  fontSizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    xxxl: 34,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
