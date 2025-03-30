import { StyleSheet, type ViewProps } from 'react-native';

import { ThemedView } from './ThemedView';
import { useThemeProperty } from '@/hooks/useTheme';

export function CardView({ style, ...otherProps }: ViewProps) {
  return (
    <ThemedView
      softBackground
      style={[cardStyle.card, style]}
      {...otherProps}
    />
  );
}
const smallSpacing = useThemeProperty('smallSpacing');
const borderRadius = useThemeProperty('borderRadius');

const cardStyle = StyleSheet.create({
  card: {
    padding: smallSpacing,
    borderRadius: borderRadius,
  },
});
