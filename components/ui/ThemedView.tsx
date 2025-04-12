import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useTheme';

export type ThemedViewProps = ViewProps & {
  softBackground?: boolean;
  background?: boolean;
};

export function ThemedView({
  style,
  softBackground,
  background,
  ...otherProps
}: ThemedViewProps) {
  let backgroundColor;
  const defaultBackgroundColor = useThemeColor('background');
  const defaultSoftBackgroundColor = useThemeColor('backgroundSoft');
  if (background) {
    backgroundColor = defaultBackgroundColor;
  } else if (softBackground) {
    backgroundColor = defaultSoftBackgroundColor;
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
