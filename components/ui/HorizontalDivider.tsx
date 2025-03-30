import { useThemeColor } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';

interface HorizontalDividerProps {
  thickness?: number;
  marginVertical?: number;
}

export const HorizontalDivider = ({
  thickness = 1,
  marginVertical,
}: HorizontalDividerProps) => {
  const color = useThemeColor('border');
  return (
    <ThemedView
      style={[
        styles.divider,
        { backgroundColor: color, height: thickness, marginVertical },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

export default HorizontalDivider;
