import { useThemeProperty } from '@/hooks/useTheme';
import { PropsWithChildren, useRef } from 'react';
import {
  Pressable,
  Animated,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

type PressableViewProps = PropsWithChildren<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}>;

export const PressableView = ({
  onPress,
  style,
  children,
}: PressableViewProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

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

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.pressable, style]}
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
        {children}
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
