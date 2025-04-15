import { ActivityIndicator, StyleSheet } from 'react-native';
import { BottomSheetView } from '@/components/BottomSheetView';
import { TextType, ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { MapsService } from '@/services';
import { IconSymbol } from '@/components/ui/Icon/IconSymbol';
import { Colors } from '@/constants/Theme';
import { getThemeProperty, useThemeColor } from '@/hooks/useTheme';
import { CardView } from '@/components/ui/CardView';
import { useEffect, useState } from 'react';
import { ExternalLink } from '@/components/ExternalLink';
import HorizontalDivider from '@/components/ui/HorizontalDivider';
import { sanitizeUrl } from '@/utils/urlSanitize';
import { Collapsible } from '@/components/ui/Collapsible';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Place, Transportation } from '@/models';
import { useMapContext } from '@/hooks/useMapContext';
import { useTripContext } from '@/hooks/useTrip';
import { utcDate } from '@/utils/dateUtils';

const StationDetails = () => {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const { fitPlace } = useMapContext();
  const { transportations } = useTripContext();
  const router = useRouter();
  const background = useThemeColor('backgroundSoft');

  const [place, setplace] = useState<Place>();
  const [loading, setLoading] = useState<boolean>(false);
  const [arrivals, setArrivals] = useState<Transportation[]>([]);
  const [departures, setDepartures] = useState<Transportation[]>([]);

  const fetchPlace = async () => {
    if (placeId && place?.id !== placeId && !loading) {
      setLoading(true);
      try {
        const responsePlace = await MapsService.getDetaisForPlaceId(placeId);
        setplace(responsePlace);

        const stationArrivals = transportations?.filter(
          (t) => t.originTerminalId === placeId
        );
        setArrivals(stationArrivals ?? []);

        const stationDepartures = transportations?.filter(
          (t) => t.destinationTerminalId === placeId
        );
        setDepartures(stationDepartures ?? []);

        if (responsePlace) {
          fitPlace(responsePlace);
        }
      } catch (err) {
        console.log('Error', err);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchPlace();
  }, [placeId]);

  if (!place || loading) {
    return <ActivityIndicator />;
  }

  const closeButtonCallback = () => {
    fitPlace(undefined);
    router.back();
  };

  return (
    <BottomSheetView
      headerImageUrl={MapsService.getPhotoForPlace(place.images ?? [])}
      closeButtonCallback={closeButtonCallback}
      headerImageGradient={{
        colors: ['transparent', background],
        start: { x: 0, y: 0.8 },
      }}
    >
      <ThemedView softBackground style={styles.header}>
        <ThemedText type={TextType.Title}>{place.name}</ThemedText>
        {place.categories?.[0] && (
          <ThemedText type={TextType.Small}>{place.categories[0]}</ThemedText>
        )}
        {place?.rating && (
          <ThemedView style={styles.ratingView}>
            <IconSymbol size={20} color={Colors.yellow} name="star.fill" />
            <ThemedText type={TextType.Bold}>{place.rating} / 5</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
      <ThemedView background style={styles.body}>
        {arrivals.length > 0 && (
          <CardView style={styles.infoCard}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="airplane.arrival" color={Colors.blue} />
              <ThemedText type={TextType.Bold}>Arrivals</ThemedText>
            </ThemedView>
            {arrivals.map((a, i) => (
              <ThemedView key={a.id}>
                {i !== 0 && <HorizontalDivider />}
                <ThemedText>
                  {a.company} {a.number}
                </ThemedText>
                <ThemedText>
                  {utcDate(a.startDate).format('ddd, DD/MM HH:mm')}
                </ThemedText>
              </ThemedView>
            ))}
          </CardView>
        )}

        {departures.length > 0 && (
          <CardView style={styles.infoCard}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="airplane.departure" color={Colors.blue} />
              <ThemedText type={TextType.Bold}>Departures</ThemedText>
            </ThemedView>
            {departures.map((a, i) => (
              <ThemedView key={a.id}>
                {i !== 0 && <HorizontalDivider />}
                <ThemedText>
                  {a.company} {a.number}
                </ThemedText>
                <ThemedText>
                  {utcDate(a.startDate).format('ddd, DD/MM HH:mm')}
                </ThemedText>
              </ThemedView>
            ))}
          </CardView>
        )}

        {place.description && (
          <CardView style={styles.infoCard}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="info.circle.fill" color={Colors.blue} />
              <ThemedText type={TextType.Bold}>Description</ThemedText>
            </ThemedView>
            <ThemedText>{place.description}</ThemedText>
          </CardView>
        )}
        {(place.phoneNumber || place.website || place.address) && (
          <CardView style={styles.infoCard}>
            {place.phoneNumber && (
              <ThemedView style={styles.infoCard}>
                <ThemedView style={styles.iconTitle}>
                  <IconSymbol name="phone.fill" color={Colors.blue} />
                  <ThemedText type={TextType.Bold}>Phone</ThemedText>
                </ThemedView>
                <ExternalLink href={`tel:${place.phoneNumber}`}>
                  {place.phoneNumber}
                </ExternalLink>
                {(place.website || place.address) && <HorizontalDivider />}
              </ThemedView>
            )}
            {place.website && (
              <ThemedView style={styles.infoCard}>
                <ThemedView style={styles.iconTitle}>
                  <IconSymbol name="globe" color={Colors.blue} />
                  <ThemedText type={TextType.Bold}>Website</ThemedText>
                </ThemedView>
                <ExternalLink href={place.website}>
                  {sanitizeUrl(place.website)}
                </ExternalLink>
                {place.address && <HorizontalDivider />}
              </ThemedView>
            )}
            {place.address && (
              <ThemedView style={styles.infoCard}>
                <ThemedView style={styles.iconTitle}>
                  <IconSymbol name="map.fill" color={Colors.blue} />
                  <ThemedText type={TextType.Bold}>Address</ThemedText>
                </ThemedView>

                <ExternalLink href={place.mapsUrl!}>
                  {place.address}
                </ExternalLink>
              </ThemedView>
            )}
          </CardView>
        )}
        {place.openingHours && (
          <CardView style={styles.infoCard}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="clock.fill" color={Colors.blue} />
              <ThemedText type={TextType.Bold}>Opening Hours</ThemedText>
            </ThemedView>
            <Collapsible
              title={
                place.openingHours.weekday_text.find((o) =>
                  o.startsWith(
                    new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                    })
                  )
                )!
              }
            >
              {place.openingHours.weekday_text.map((d) => (
                <ThemedText key={d}>{d}</ThemedText>
              ))}
            </Collapsible>
          </CardView>
        )}
      </ThemedView>
    </BottomSheetView>
  );
};

const smallSpacing = getThemeProperty('smallSpacing');
const largeSpacing = getThemeProperty('largeSpacing');

const styles = StyleSheet.create({
  header: {
    padding: largeSpacing,
  },
  ratingView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: smallSpacing,
    paddingVertical: smallSpacing,
  },
  body: {
    padding: largeSpacing,
    gap: largeSpacing,
  },
  iconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: smallSpacing,
  },
  infoCard: {
    flexDirection: 'column',
    gap: smallSpacing,
  },
});

export default StationDetails;
