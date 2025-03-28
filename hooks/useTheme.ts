/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { BaseScheme, ColorScheme, Theme } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(propertyName: keyof ColorScheme) {
  const currentTheme = useColorScheme() ?? 'dark';
  return Theme[currentTheme][propertyName];
}
export function useThemeProperty(propertyName: keyof BaseScheme) {
  return Theme.base[propertyName];
}
