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
  if (background) {
    backgroundColor = useThemeColor("background");
  } else if (softBackground) {
    backgroundColor = useThemeColor("backgroundSoft");
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
