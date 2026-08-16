export const colors = {
  light: {
    // Primary palette
    paper: '#F4F1E8', // Warm off-white background
    bone: '#E7E2D6',  // Secondary warm surface
    softMoss: '#DCE4D7', // Soft moss tint for layering
    ink: '#101310',   // Almost-black green-tinted ink
    inkMuted: '#5C645B', // Secondary text
    inkSubtle: '#8C948B', // Tertiary / metadata text
    ledgerLine: '#D8D3C5', // Subtle divider lines
    border: '#DDD8CB',

    // Semantic brand accents
    moss: '#526B4F',      // Primary brand
    chartreuse: '#C8F169', // Signature accent (active indicators, primary CTA)
    chartreuseText: '#101310',
    terracotta: '#C96F52', // Expense / warning
    plum: '#59445E',       // Transfer / secondary analytical
    brass: '#B89A58',      // Investment / net worth
    slate: '#687276',      // Neutral information

    // Surface layering
    surfacePrimary: '#F4F1E8',
    surfaceElevated: '#E7E2D6',
    surfaceCard: '#EFECE2',
    surfaceInput: '#EAE5D9',
  },
  dark: {
    // Dark palette
    paper: '#101310',
    bone: '#171B17',
    softMoss: '#202720',
    ink: '#F4F1E8',
    inkMuted: '#A7ADA5',
    inkSubtle: '#6A7268',
    ledgerLine: '#252D25',
    border: '#2E382E',

    // Semantic brand accents
    moss: '#6A8A66',
    chartreuse: '#C8F169',
    chartreuseText: '#101310',
    terracotta: '#D68165',
    plum: '#7A5E81',
    brass: '#CDB16F',
    slate: '#849095',

    // Surface layering
    surfacePrimary: '#101310',
    surfaceElevated: '#171B17',
    surfaceCard: '#1E241E',
    surfaceInput: '#1A201A',
  },
  oled: {
    paper: '#000000',
    bone: '#111411',
    softMoss: '#181D18',
    ink: '#F4F1E8',
    inkMuted: '#A7ADA5',
    inkSubtle: '#6A7268',
    ledgerLine: '#1B211B',
    border: '#222B22',

    moss: '#6A8A66',
    chartreuse: '#C8F169',
    chartreuseText: '#101310',
    terracotta: '#D68165',
    plum: '#7A5E81',
    brass: '#CDB16F',
    slate: '#849095',

    surfacePrimary: '#000000',
    surfaceElevated: '#111411',
    surfaceCard: '#161A16',
    surfaceInput: '#121612',
  },
};

export const typography = {
  fonts: {
    display: 'DMSerifDisplay_400Regular', // Serif for balance, major headlines
    sans: 'Inter_400Regular',             // Inter UI
    sansMedium: 'Inter_500Medium',
    sansSemiBold: 'Inter_600SemiBold',
    sansBold: 'Inter_700Bold',
  },
  sizes: {
    heroBalance: 42,
    h1: 30,
    h2: 24,
    h3: 18,
    body: 15,
    caption: 12,
    badge: 10,
  },
  tracking: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.8,
    widest: 1.6,
  },
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  none: 0,
  sm: 6,    // Small controls
  button: 8, // Buttons
  card: 12,  // Modest cards
  surface: 16, // Primary containers
  sheet: 24,   // Bottom sheet top corners
  full: 9999,
};

export type ThemeType = 'light' | 'dark' | 'oled';
export type ThemeColors = typeof colors.light;
