import { ActivityIndicator, StyleSheet } from 'react-native';
import { ItineraryView } from '@/components/ItineraryView';
import { MapsService } from '@/services';
import { getThemeProperty } from '@/hooks/useTheme';
import { useTripContext } from '@/hooks/useTrip';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { TextType, ThemedText } from '@/components/ui/ThemedText';
import { isSameDay, utcDate } from '@/utils/dateUtils';
import { CardView } from '@/components/ui/CardView';
import { IconSymbol } from '@/components/ui/Icon/IconSymbol';
import { ExternalLink } from '@/components/ExternalLink';
import { sanitizeUrl } from '@/utils/urlSanitize';
import { useEffect, useState } from 'react';
import {
  Destination,
  DistanceBetweenPlaces,
  Transportation,
  Weather,
} from '@/models';
import { getDisplayDurationFromSeconds } from '@/utils/numberFormat';
import { getMapsDirectionLink } from '@/utils/mapsUtils';
import { TripService } from '@/services/TripService';
import { useMapContext } from '@/hooks/useMapContext';
import { BottomSheetView } from '@/components/BottomSheetView';
import { SFSymbol } from 'expo-symbols';
import { TransportTypes } from '@/models/Transportation';

const DestinationDetails = () => {
  const { destinations, transportations } = useTripContext();
  const { destinationId } = useLocalSearchParams();
  const { fitDestination } = useMapContext();
  const router = useRouter();

  const [destination, setDestination] = useState<Destination>();
  const [arrival, setArrival] = useState<Transportation>();
  const [departure, setDeparture] = useState<Transportation>();
  const [arrivalDistanceToHome, setArrivalDistanceToHome] =
    useState<DistanceBetweenPlaces>();
  const [departureDistanceFromHome, setDepartureDistanceFromHome] =
    useState<DistanceBetweenPlaces>();
  const [weather, setWeather] = useState<Weather>();

  useEffect(() => {
    const currentDestination = destinations?.find(
      (d) => d.id === destinationId
    );
    setDestination(currentDestination);

    if (!currentDestination) {
      return;
    }

    const arrivalTransport = transportations?.find(
      (t) =>
        currentDestination?.placeId === t.destinationId &&
        isSameDay(currentDestination.startDate, t.endDate)
    );
    setArrival(arrivalTransport);
    const departureTransport = transportations?.find(
      (t) =>
        currentDestination?.placeId === t.originId &&
        isSameDay(currentDestination.endDate, t.startDate)
    );
    setDeparture(departureTransport);

    fitDestination(currentDestination);
    fetchArrivalDestinationDistances(arrivalTransport, departureTransport);
    fetchWeatherAverages(currentDestination.id);
  }, [destinationId, destinations, transportations]);

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

  const getHousingType = () => {
    const website = sanitizeUrl(destination?.housing?.website ?? '');
    if (website) {
      if (website.includes('airbnb')) {
        return 'Airbnb';
      }
      if (website.includes('booking')) {
        return 'Booking';
      }
      return 'Hotel';
    }
    return undefined;
  };

  const getTransportIcon = (
    type: TransportTypes,
    status: 'arrival' | 'departure'
  ): SFSymbol => {
    if (status === 'arrival') {
      if (type === TransportTypes.Train) {
        return 'train.side.front.car';
      }
      if (type === TransportTypes.Bus) {
        return 'bus.fill';
      }
      return 'airplane.arrival';
    } else {
      if (type === TransportTypes.Train) {
        return 'train.side.rear.car';
      }
      if (type === TransportTypes.Bus) {
        return 'bus.fill';
      }
      return 'airplane.departure';
    }
  };

  const closeButtonCallback = () => {
    fitDestination(undefined);
    router.back();
  };

  if (!destination) {
    return <ActivityIndicator />;
  }

  return (
    <BottomSheetView
      headerImageUrl={MapsService.getPhotoForPlace(
        destination.place.images ?? []
      )}
      closeButtonCallback={closeButtonCallback}
      headerComponent={
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
      }
    >
      <ThemedView background style={styles.body}>
        {destination.housing && (
          <CardView style={styles.card}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="bed.double.fill" />
              <ThemedText type={TextType.Bold} style={{ alignItems: 'center' }}>
                Sleep in {destination.place.name}
              </ThemedText>
            </ThemedView>
            <ThemedText type={TextType.Small}>{getHousingType()}</ThemedText>
            <ThemedText>{destination.housing.name}</ThemedText>
            {destination.housing.checkin && destination.housing.checkout && (
              <ThemedText>
                {utcDate(destination.housing.checkin).format('DD/MM HH:mm ')}
                <IconSymbol name="arrow.right" size={12} />
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
                {destination.housing.place.vicinity}
              </ExternalLink>
            )}
          </CardView>
        )}
        {arrival && (
          <CardView style={styles.card}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name={getTransportIcon(arrival.type, 'arrival')} />
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
              <IconSymbol
                name={getTransportIcon(departure.type, 'departure')}
              />
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
              <IconSymbol name="sun.and.horizon.fill" />
              <ThemedText type={TextType.Bold}>Average Weather</ThemedText>
            </ThemedView>
            <ThemedText type={TextType.Small}>
              Average for the past 3 years
            </ThemedText>
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

        {destination.activities?.length && (
          <ItineraryView
            activities={destination.activities}
            startDate={destination.startDate}
            endDate={destination.endDate}
          />
        )}
      </ThemedView>
    </BottomSheetView>
  );
};

const smallSpacing = getThemeProperty('smallSpacing');
const largeSpacing = getThemeProperty('largeSpacing');

const styles = StyleSheet.create({
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
