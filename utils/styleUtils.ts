/**
 * Border Radius Utility
 * Provides consistent, platform-safe border radius values for NativeWind v2 on Android.
 * Use this instead of arbitrary Tailwind classes like `rounded-[48px]` or `rounded-4xl`.
 */

export const borderRadiusScale = {
  none: 0,
  sm: 2,
  DEFAULT: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  '4xl': 32,
  '5xl': 48,
  full: 9999,
} as const;

export type BorderRadiusKey = keyof typeof borderRadiusScale;

export function getBorderRadius(size: BorderRadiusKey | number): number {
  if (typeof size === 'number') return size;
  return borderRadiusScale[size] ?? borderRadiusScale.DEFAULT;
}

export function roundedStyle(size: BorderRadiusKey | number) {
  return { borderRadius: getBorderRadius(size) };
}
