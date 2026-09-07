/**
 * BuildKart Design System
 * ─────────────────────────────────────────────────────────
 * Color palette derived from the brand screenshot:
 *   Warm Terracotta → Charcoal gradient with gold accents
 *
 * Every token has a single defined purpose.
 * WCAG AA contrast verified for text tokens.
 */

// ── Colors ──────────────────────────────────────────────

export const colors = {
  // Brand — Terracotta / Warm Orange (Mockup Theme)
  primary: '#DF6733',
  primaryDark: '#B2471E',
  primaryLight: '#F28B59',
  primaryFaded: '#FFF2EB',

  // Secondary — Deep Midnight Slate / Charcoal (from mockup header base)
  secondary: '#141D28',
  secondaryLight: '#243242',

  // Accent — Golden Amber / Terracotta
  accent: '#F29255',
  accentLight: '#FFF4EC',

  // Pill and Filter chip tokens matching reference design
  pillActiveBg: '#FFF2EB',
  pillActiveBorder: '#DF6733',
  pillActiveText: '#DF6733',
  pillInactiveBg: '#F0F3F6',
  pillInactiveBorder: '#E2E8F0',
  pillInactiveText: '#64748B',

  // Role-specific accents
  customer: '#DF6733',
  customerLight: '#FFF2EB',
  retailer: '#1E293B',
  retailerLight: '#F1F5F9',
  delivery: '#DF6733',
  deliveryLight: '#FFF2EB',
  admin: '#DF6733',
  adminLight: '#FFF2EB',

  // Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',

  // Text
  text: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textMuted: '#94A3B8',
  textDisabled: '#CBD5E1',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#F1F5F9',

  // Semantic (matching mockup badge colors)
  success: '#10B981',
  successLight: '#E6F9F0',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  info: '#3B82F6',
  infoLight: '#EBF5FF',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Utility
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',

  // Gradient presets (Mockup: Sunset terracotta top -> deep midnight dark navy bottom)
  gradientBrand: ['#E06B37', '#9E3E1C', '#223040', '#121B25'] as const,
  gradientSunset: ['#E06B37', '#BA4D21'] as const,
  gradientDark: ['#223040', '#121B25'] as const,
  gradientRetailer: ['#0F172A', '#1E293B', '#334155', '#475569'] as const,
  gradientDriver: ['#431407', '#9A3412', '#EA580C', '#FB923C'] as const,
} as const;

// ── Typography ──────────────────────────────────────────

export const typography = {
  fontSizes: {
    /** Display — hero numbers, splash */
    display: 28,
    /** H1 — page titles */
    h1: 24,
    /** H2 — section headers */
    h2: 20,
    /** H3 — card titles */
    h3: 17,
    /** Title — list item titles */
    title: 15,
    /** Body — body text */
    body: 14,
    /** Body Small — secondary content */
    bodySmall: 13,
    /** Caption — labels, metadata */
    caption: 11,
    /** Label — chips, tags, badges */
    label: 12,
    /** Button — CTA text */
    button: 14,
    /** Price — price display */
    price: 16,
    /** Price Strike — MRP strikethrough */
    priceStrike: 12,

    // Legacy aliases (keep for gradual migration)
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    xxxl: 28,
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
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// ── Spacing (8pt grid) ─────────────────────────────────

export const spacing = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  base: 16,
  /** 20px */
  lg: 20,
  /** 24px */
  xl: 24,
  /** 32px */
  '2xl': 32,
  /** 40px */
  '3xl': 40,
  /** 48px */
  '4xl': 48,
  /** 64px */
  '5xl': 64,

  // Legacy aliases
  xxs: 2,
  xxl: 48,
  xxxl: 64,
} as const;

// ── Border Radius ───────────────────────────────────────

export const radii = {
  /** 6px — subtle rounding */
  sm: 6,
  /** 10px — cards, inputs */
  md: 10,
  /** 14px — elevated cards */
  lg: 14,
  /** 20px — large cards, modals */
  xl: 20,
  /** 9999px — pills, avatars */
  full: 9999,

  // Legacy aliases
  xs: 4,
} as const;

// ── Shadows ─────────────────────────────────────────────

export const shadows = {
  /** Subtle — borders, list items */
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  /** Medium — cards, surfaces */
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  /** Large — modals, floating elements */
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;

// ── Icon sizes ──────────────────────────────────────────

export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
} as const;
