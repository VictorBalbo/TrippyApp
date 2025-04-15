// This file is a fallback for using MaterialIcons on Android and web.

import { useThemeColor } from '@/hooks/useTheme';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Add your SFSymbol to MaterialCommunityIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'chevron.right': 'chevron-right',
  'chevron.down': 'chevron-down',
  'chevron.up': 'chevron-up',
  'star.fill': 'star',
  plus: 'plus',
  trash: 'trash-can-outline',
  globe: 'link',
  calendar: 'calendar-month',
  dollarsign: 'currency-usd',
  'info.circle.fill': 'information',
  'phone.fill': 'phone',
  'map.fill': 'map',
  'clock.fill': 'clock',
  'ticket.fill': 'ticket-confirmation',
  'arrow.right': 'arrow-right',
  'bed.double.fill': 'bed-king',
  'airplane.arrival': 'airplane-landing',
  'airplane.departure': 'airplane-takeoff',
  'sun.and.horizon.fill': 'weather-sunset',
  'train.side.front.car': 'train',
  'train.side.rear.car': 'train',
  'bus.fill': 'bus',
  'mappin.and.ellipse': 'map-marker',
  'fork.knife': 'silverware-fork-knife',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const defaultColor = useThemeColor('activeTint');
  if (!color) {
    color = defaultColor;
  }
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
