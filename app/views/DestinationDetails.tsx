import { ActivityIndicator, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ParallaxScrollView } from '@/components/ParallaxScrollView';
import { MapsService } from '@/services';
import { useThemeProperty } from '@/hooks/useTheme';
import { useTripContext } from '@/hooks/useTrip';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { TextType, ThemedText } from '@/components/ui/ThemedText';
import { isSameDay, utcDate } from '@/utils/dateUtils';
import { CardView } from '@/components/ui/CardView';
import { IconSymbol } from '@/components/ui/Icon/IconSymbol';
import { ExternalLink } from '@/components/ExternalLink';
import { sanitizeUrl } from '@/utils/urlSanitize';
import { useEffect, useState } from 'react';
import { DistanceBetweenPlaces, Transportation, Weather } from '@/models';
import { getDisplayDurationFromSeconds } from '@/utils/numberFormat';
import { getMapsDirectionLink } from '@/utils/mapsUtils';
import { TripService } from '@/services/TripService';
import { useMapContext } from '@/hooks/useMapContext';

const DestinationDetails = () => {
  const { destinations, transportations } = useTripContext();
  const { destinationId } = useLocalSearchParams();
  const { fitDestination } = useMapContext();

  const destination = destinations?.find((d) => d.id === destinationId);
  const [arrival, setArrival] = useState<Transportation>();
  const [departure, setDeparture] = useState<Transportation>();
  const [arrivalDistanceToHome, setArrivalDistanceToHome] =
    useState<DistanceBetweenPlaces>();
  const [departureDistanceFromHome, setDepartureDistanceFromHome] =
    useState<DistanceBetweenPlaces>();
  const [weather, setWeather] = useState<Weather>();

  let loadingArrivalDestinationDistances = false;
  const fetchArrivalDestinationDistances = async (
    arrival?: Transportation,
    departure?: Transportation
  ) => {
    if (loadingArrivalDestinationDistances) {
      return;
    }
    loadingArrivalDestinationDistances = true;
    if (arrival && destination?.housing && !arrivalDistanceToHome) {
      const arrivalDistance = await MapsService.getDistaceBetweenPlaces(
        arrival.destinationTerminalId,
        destination.housing.place.id
      );
      setArrivalDistanceToHome(arrivalDistance);
    }
    if (departure && destination?.housing && !departureDistanceFromHome) {
      const departureDistance = await MapsService.getDistaceBetweenPlaces(
        destination.housing.place.id,
        departure.originTerminalId
      );
      setDepartureDistanceFromHome(departureDistance);
    }
    loadingArrivalDestinationDistances = false;
  };

  let loadingWeather = false;
  const fetchWeatherAverages = async (destinationId: string) => {
    if (!weather && !loadingWeather) {
      loadingWeather = true;
      const weatherResponse = await TripService.getDestinationWeather(
        destinationId
      );
      setWeather(weatherResponse);
      loadingWeather = false;
    }
  };

  useEffect(() => {
    if (!destination) {
      return;
    }

    const arrivalTransport = transportations?.find(
      (t) =>
        destination?.placeId === t.destinationId &&
        isSameDay(destination.startDate, t.endDate)
    );
    setArrival(arrivalTransport);
    const departureTransport = transportations?.find(
      (t) =>
        destination?.placeId === t.originId &&
        isSameDay(destination.endDate, t.startDate)
    );
    setDeparture(departureTransport);

    fitDestination(destination);
    fetchArrivalDestinationDistances(arrivalTransport, departureTransport);
    fetchWeatherAverages(destination.id);
  }, [destinationId]);

  if (!destination) {
    return <ActivityIndicator />;
  }

  return (
    <ParallaxScrollView
      headerComponent={
        <ThemedView style={styles.header}>
          <Image
            style={{ flex: 1, height: 200 }}
            source={{
              uri: MapsService.getPhotoForPlace(destination.place.images ?? []),
            }}
          />
          <LinearGradient
            colors={['black', 'transparent']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0.5 }}
            style={styles.headerGradient}
          />
          <ThemedView style={styles.headerTitle}>
            <ThemedText type={TextType.Bold}>
              {utcDate(destination?.endDate).diff(
                utcDate(destination?.startDate),
                'days'
              )}
              {utcDate(destination?.endDate).diff(
                utcDate(destination?.startDate),
                'days'
              ) > 1
                ? ' nights'
                : ' night'}
            </ThemedText>
            <ThemedText type={TextType.Title}>
              {destination.place.name}
            </ThemedText>
            <ThemedText type={TextType.Bold}>
              {utcDate(destination?.startDate).format('DD MMM')} -
              {utcDate(destination?.endDate).format('DD MMM')}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      }
    >
      <ThemedView background style={styles.body}>
        {destination.housing && (
          <CardView style={styles.card}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="bed.double.fill" color="white" />
              <ThemedText type={TextType.Bold} style={{ alignItems: 'center' }}>
                Sleep in {destination.place.name}
              </ThemedText>
            </ThemedView>
            <ThemedText>{destination.housing.name}</ThemedText>
            {destination.housing.checkin && destination.housing.checkout && (
              <ThemedText>
                {utcDate(destination.housing.checkin).format('DD/MM HH:mm ')}
                <IconSymbol name="arrow.right" color="white" size={12} />
                {utcDate(destination.housing.checkout).format(' DD/MM HH:mm')}
              </ThemedText>
            )}
            {destination.housing.website && (
              <ExternalLink href={destination.housing.website}>
                {sanitizeUrl(destination.housing.website)}
              </ExternalLink>
            )}
            {destination.housing.place.mapsUrl && (
              <ExternalLink href={destination.housing.place.mapsUrl}>
                {destination.housing.place.address}
              </ExternalLink>
            )}
          </CardView>
        )}
        {arrival && (
          <CardView style={styles.card}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="airplane.arrival" color="white" />
              <ThemedText type={TextType.Bold}>Arrival</ThemedText>
            </ThemedView>
            <ThemedText type={TextType.Small}>{arrival.type}</ThemedText>
            <ThemedText>
              {arrival.company} {arrival.number}
            </ThemedText>
            {arrival.endDate && (
              <ThemedText>
                {utcDate(arrival.endDate).format('ddd, DD/MM HH:mm')}
              </ThemedText>
            )}
            {arrivalDistanceToHome && (
              <ThemedText>
                Time to Home:{' '}
                <ExternalLink
                  href={getMapsDirectionLink(
                    arrival.destinationTerminal,
                    destination.housing!.place
                  )}
                >
                  {getDisplayDurationFromSeconds(
                    arrivalDistanceToHome.transit.duration
                  )}
                </ExternalLink>
              </ThemedText>
            )}
            <ExternalLink href={arrival.destinationTerminal.mapsUrl!}>
              {arrival.destinationTerminal.name}
            </ExternalLink>
          </CardView>
        )}
        {departure && (
          <CardView style={styles.card}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="airplane.departure" color="white" />
              <ThemedText type={TextType.Bold}>Departure</ThemedText>
            </ThemedView>
            <ThemedText type={TextType.Small}>{departure.type}</ThemedText>
            <ThemedText>
              {departure.company} {departure.number}
            </ThemedText>
            {departure.startDate && (
              <ThemedText>
                {utcDate(departure.startDate).format('ddd, DD/MM HH:mm')}
              </ThemedText>
            )}
            {departureDistanceFromHome && (
              <ThemedText>
                Time From Home:{' '}
                <ExternalLink
                  href={getMapsDirectionLink(
                    destination.housing!.place,
                    departure.originTerminal
                  )}
                >
                  {getDisplayDurationFromSeconds(
                    departureDistanceFromHome.transit.duration
                  )}
                </ExternalLink>
              </ThemedText>
            )}
            <ExternalLink href={departure.originTerminal.mapsUrl!}>
              {departure.originTerminal.name}
            </ExternalLink>
          </CardView>
        )}

        {weather && (
          <CardView style={styles.card}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="sun.and.horizon.fill" color="white" />
              <ThemedText type={TextType.Bold}>Average Weather</ThemedText>
            </ThemedView>
            <ThemedText>Sunrise: {weather.sunrise}</ThemedText>
            <ThemedText>Sunset: {weather.sunset}</ThemedText>
            <ThemedView style={styles.weatherTemp}>
              <ThemedText>
                Temperature: {weather.avg.maxTemp.toFixed(1)}
              </ThemedText>
              <ThemedText type={TextType.Small}>ºC</ThemedText>
              <ThemedText>/</ThemedText>
              <ThemedText>{weather.avg.minTemp.toFixed(1)}</ThemedText>
              <ThemedText type={TextType.Small}>ºC</ThemedText>
            </ThemedView>
            <ThemedView style={styles.weatherTemp}>
              <ThemedText>
                Precipitation: {weather.avg.rain.toFixed(2)}
              </ThemedText>
              <ThemedText type={TextType.Small}>mm per day</ThemedText>
            </ThemedView>
            <ThemedView style={styles.weatherTemp}>
              <ThemedText>Wind: {weather.avg.wind.toFixed(1)}</ThemedText>
              <ThemedText type={TextType.Small}>km/h</ThemedText>
            </ThemedView>
          </CardView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
};

const smallSpacing = useThemeProperty('smallSpacing');
const largeSpacing = useThemeProperty('largeSpacing');

const styles = StyleSheet.create({
  header: {
    flex: 1,
    position: 'relative',
  },
  headerGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: smallSpacing,
  },
  body: {
    flex: 1,
    padding: largeSpacing,
    gap: largeSpacing,
  },
  card: {
    gap: smallSpacing / 2,
  },
  iconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: smallSpacing,
  },
  weatherTemp: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'flex-end',
  },
});

export default DestinationDetails;
