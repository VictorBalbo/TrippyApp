import type { PropsWithChildren, ReactNode } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ui/ThemedView';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { useThemeColor, getThemeProperty } from '@/hooks/useTheme';
import { IconSymbol } from './ui/Icon/IconSymbol';
import { Colors } from '@/constants/Theme';
import { PressableView } from './ui/PressableView';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImageUrl: string;
  headerComponent?: ReactNode;
  headerImageGradient?: Partial<LinearGradientProps>;
  closeButtonCallback?: () => void;
}>;

export const BottomSheetView = ({
  children,
  headerImageUrl,
  headerComponent,
  headerImageGradient,
  closeButtonCallback,
}: Props) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });
  const background = useThemeColor('background');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, position: 'relative' }}
    >
      <ThemedView background style={styles.container}>
        <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <PressableView
              style={styles.closeButton}
              onPress={closeButtonCallback!}
            >
              <IconSymbol name="plus" />
            </PressableView>
            
            <Image
              source={{ uri: headerImageUrl }}
              style={styles.headerImage}
            />
            {(headerComponent || headerImageGradient) && (
              <LinearGradient
                colors={['transparent', background]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0, y: 1 }}
                style={styles.headerGradient}
                {...headerImageGradient}
              />
            )}

            {headerComponent && headerComponent}
          </Animated.View>
          <ThemedView style={styles.content}>{children}</ThemedView>
        </Animated.ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const borderRadius = getThemeProperty('borderRadius');
const smallSpacing = getThemeProperty('smallSpacing');
const largeSpacing = getThemeProperty('largeSpacing');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    zIndex: 1,
    top: largeSpacing,
    right: largeSpacing,
    backgroundColor: Colors.black + 'B2',
    borderRadius: borderRadius * borderRadius,
    padding: smallSpacing,
    transform: [{ rotateZ: '45deg' }],
  },
  headerImage: {
    height: HEADER_HEIGHT,
    width: '100%',
  },
  headerGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
});
