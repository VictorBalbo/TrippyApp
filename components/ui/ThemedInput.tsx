import { useThemeColor, useThemeProperty } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, TextInputProps, TextInput, Platform } from 'react-native';

export const ThemedInput = (props: TextInputProps) => {
  const backgroundColor = useThemeColor('backgroundAccent');
  const color = useThemeColor('text');
  const placeholderTextColor = useThemeColor('inactiveTint');
  const cursorColor = useThemeColor('link');
  return (
    <TextInput
      placeholderTextColor={placeholderTextColor}
      cursorColor={cursorColor}
      {...props}
      style={[styles.input, { backgroundColor, color }, props.style]}
    />
  );
};

const fontSize = useThemeProperty('textSize');
const borderRadius = useThemeProperty('borderRadius');
const smallSpacing = useThemeProperty('smallSpacing');

const styles = StyleSheet.create({
  input: {
    fontSize,
    lineHeight: fontSize * 1.25,
    textAlign: 'center',
    borderRadius: borderRadius,
    padding: smallSpacing,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
});
