import { CardView } from '@/components/ui/CardView';
import { PressableView } from '@/components/ui/PressableView';
import { TextType, ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useThemeColor, useThemeProperty } from '@/hooks/useTheme';
import { useTripContext } from '@/hooks/useTrip';
import { Destination } from '@/models';
import { utcDate } from '@/utils/dateUtils';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function index() {
  const router = useRouter();
  const { trip, destinations } = useTripContext();
  const borderColor = useThemeColor('border');

  function onPress(destination: Destination) {
    router.push({
      pathname: '/views/DestinationDetails',
      params: { destinationId: destination.id },
    });
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type={TextType.Title}>{trip?.name}</ThemedText>
      {trip?.startDate && trip?.endDate && (
        <ThemedText type={TextType.Bold}>
          {utcDate(trip.startDate).format('DD MMM')} -
          {utcDate(trip.endDate).format('DD MMM')}
        </ThemedText>
      )}
      <CardView style={styles.destinationsCard}>
        {destinations?.map((d, i) => (
          <PressableView
            key={d.id}
            onPress={() => onPress(d)}
            style={[
              styles.destination,
              i !== destinations.length - 1 ? styles.destinationBorder : '',
              { borderColor },
            ]}
          >
            <ThemedView style={styles.destinationName}>
              <ThemedText type={TextType.Bold}>{d.place.name}</ThemedText>
              <ThemedText type={TextType.Small}>
                {utcDate(d.startDate).format('DD MMM')} -
                {utcDate(d.endDate).format('DD MMM')}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.destinationActivities}>
              <ThemedText type={TextType.Bold}>
                {d.activities?.length ?? 0}
              </ThemedText>
              <ThemedText type={TextType.Small}>
                {(d.activities?.length ?? 0) === 1 ? 'Activity' : 'Activities'}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.destinationNights}>
              <ThemedText type={TextType.Bold}>
                {utcDate(d.endDate).diff(d.startDate, 'days')}
              </ThemedText>
              <ThemedText type={TextType.Small}>
                {utcDate(d.endDate).diff(d.startDate, 'days') === 1
                  ? 'Night'
                  : 'Nights'}
              </ThemedText>
            </ThemedView>
          </PressableView>
        ))}
      </CardView>
    </ThemedView>
  );
}

const smallSpacing = useThemeProperty('smallSpacing');
const largeSpacing = useThemeProperty('largeSpacing');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: largeSpacing,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  destinationsCard: {
    gap: smallSpacing,
    marginVertical: smallSpacing,
  },
  destination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  destinationBorder: {
    borderBottomWidth: 1,
    paddingBottom: smallSpacing,
  },
  destinationName: {
    width: '50%',
  },
  destinationActivities: {
    width: '25%',
    alignItems: 'center',
  },
  destinationNights: {
    width: '25%',
    alignItems: 'center',
  },
});
