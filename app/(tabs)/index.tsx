import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { TextType, ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type={TextType.Title}>Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type={TextType.Subtitle}>Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{' '}
          <ThemedText type={TextType.Bold}>app/(tabs)/index.tsx</ThemedText> to
          see changes. Press{' '}
          <ThemedText type={TextType.Bold}>
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type={TextType.Subtitle}>Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type={TextType.Subtitle}>
          Step 3: Get a fresh start
        </ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type={TextType.Bold}>npm run reset-project</ThemedText> to
          get a fresh <ThemedText type={TextType.Bold}>app</ThemedText>{' '}
          directory. This will move the current{' '}
          <ThemedText type={TextType.Bold}>app</ThemedText> to{' '}
          <ThemedText type={TextType.Bold}>app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
