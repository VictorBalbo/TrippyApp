import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { TextType, ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView softBackground style={styles.container}>
        <ThemedText type={TextType.Title}>This screen doesn't exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type={TextType.Link}>Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
