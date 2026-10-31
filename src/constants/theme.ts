export const KaizenTheme = {
  bg: '#131314',
  surface: '#131314',
  surfaceContainerLowest: '#0E0E0F',
  surfaceContainerLow: '#18181A',
  surfaceContainer: '#201F22',
  surfaceContainerHigh: '#28282B',
  surfaceContainerHighest: '#333336',
  surfaceBright: '#3A393E',
  border: '#26262A',
  borderSubtle: '#1C1C20',
  outline: '#A98985',
  outlineVariant: '#5A413D',
  text: '#F5F2EB',
  textMuted: '#96928B',
  textDisabled: '#575550',
  redDeep: '#7A1F24',
  redPrimary: '#C8372D',
  redBright: '#E5584B',
  redSoft: '#F08A80',
  redTint: '#281113',
  success: '#6FBF8F',
  successTint: '#0E1F14',
  tertiary: '#87D7A6',
} as const;

export const Colors = {
  light: {
    text: '#F5F2EB',
    background: '#131314',
    backgroundElement: '#18181A',
    backgroundSelected: '#28282B',
    textSecondary: '#96928B',
  },
  dark: {
    text: '#F5F2EB',
    background: '#131314',
    backgroundElement: '#18181A',
    backgroundSelected: '#28282B',
    textSecondary: '#96928B',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const HitSlop = {
  small: { top: 8, bottom: 8, left: 8, right: 8 },
  standard: { top: 12, bottom: 12, left: 12, right: 12 },
  large: { top: 16, bottom: 16, left: 16, right: 16 },
} as const;
