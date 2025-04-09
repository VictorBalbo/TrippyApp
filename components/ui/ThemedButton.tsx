import { useThemeColor, useThemeProperty } from '@/hooks/useTheme';
import React, { useRef } from 'react';
import {
  Pressable,
  Animated,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { IconSymbol } from './Icon/IconSymbol';
import { Colors } from '@/constants/Theme';
import { TextType, ThemedText } from './ThemedText';
import { SFSymbol } from 'expo-symbols';

export enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary',
  Delete = 'delete',
}

interface ButtonProps {
  onPress: () => void;
  title: string;
  icon?: SFSymbol;
  type?: ButtonType;
  style?: StyleProp<ViewStyle>;
}

export const ThemedButton = ({
  onPress,
  title,
  icon,
  type = ButtonType.Primary,
  style,
}: ButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const pressableColor = useThemeColor('backgroundSoft');

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95, // Scale down
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7, // Reduce opacity
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1, // Return to normal size
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1, // Restore opacity
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  let backgroundColor;
  let textColor;
  switch (type) {
    case ButtonType.Secondary:
      backgroundColor = Colors.blackLight;
      textColor = Colors.white;
      break;
    case ButtonType.Delete:
      backgroundColor = Colors.red;
      textColor = Colors.white;
      break;
    case ButtonType.Primary:
    default:
      backgroundColor = Colors.blue;
      textColor = Colors.white;
      break;
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.pressable, style, { backgroundColor }]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {icon && <IconSymbol size={20} color={textColor} name={icon} />}
        <ThemedText type={TextType.Bold}>{title}</ThemedText>
      </Animated.View>
    </Pressable>
  );
};
const smallSpacing = useThemeProperty('smallSpacing');
const borderRadius = useThemeProperty('borderRadius');
const styles = StyleSheet.create({
  pressable: {
    borderRadius: borderRadius,
    padding: smallSpacing,
  },
  button: {
    gap: smallSpacing,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
