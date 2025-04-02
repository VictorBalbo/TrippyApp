import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function index() {
  const router = useRouter();

  return (
    <ThemedView softBackground style={styles.container}>
      <ThemedText style={styles.text}>
        Welcome! Select an option. App
      </ThemedText>
      <ThemedButton
        title="PlaceDetails"
        onPress={() => router.push('/views/PlaceDetails')}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});
