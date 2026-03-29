export const COLORS = {
  // Primary
  primary: '#0284c7',
  primaryLight: '#f0f9ff',
  primaryBorder: '#bae6fd',
  primaryDark: '#0c4a6e',

  // Success
  success: '#16a34a',
  successLight: '#f0fdf4',

  // Danger
  danger: '#dc2626',
  dangerLight: '#fee2e2',

  // Neutral
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceAlt: '#f1f5f9',
  border: '#e2e8f0',
  borderLight: '#cbd5e1',

  // Text
  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textTertiary: '#94a3b8',
  textMuted: '#64748b',
  textInverse: '#ffffff',

  // Semantic
  gps: '#16a34a',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const TYPOGRAPHY = {
  h1: { fontSize: 24, fontWeight: '900' as const },
  h2: { fontSize: 20, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  bodyBold: { fontSize: 14, fontWeight: '600' as const },
  small: { fontSize: 12, fontWeight: '500' as const },
  caption: { fontSize: 10, fontWeight: '600' as const },
} as const;

export const SHADOWS = {
  small: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
  },
  medium: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  large: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
} as const;
