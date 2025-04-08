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
import { useThemeColor } from '@/hooks/useTheme';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerComponent?: ReactNode;
  headerImageGradient?: Partial<LinearGradientProps>;
  headerImageUrl: string;
}>;

export const BottomSheetView = ({
  children,
  headerImageUrl,
  headerComponent,
  headerImageGradient,
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
