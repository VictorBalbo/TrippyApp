import { ActivityIndicator, StyleSheet } from 'react-native';
import { BottomSheetView } from '@/components/BottomSheetView';
import { TextType, ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { MapsService } from '@/services';
import { IconSymbol } from '@/components/ui/Icon/IconSymbol';
import { Colors } from '@/constants/Theme';
import { getThemeProperty } from '@/hooks/useTheme';
import { ButtonType, ThemedButton } from '@/components/ui/ThemedButton';
import { CardView } from '@/components/ui/CardView';
import DatePicker from '@/components/ui/DatePicker/DatePicker';
import { InputMoney } from '@/components/ui/InputMoney';
import { useEffect, useState } from 'react';
import { ExternalLink } from '@/components/ExternalLink';
import HorizontalDivider from '@/components/ui/HorizontalDivider';
import { sanitizeUrl } from '@/utils/urlSanitize';
import { Collapsible } from '@/components/ui/Collapsible';
import { ThemedSwitch } from '@/components/ui/ThemedSwitch';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, Destination, Place } from '@/models';
import { useMapContext } from '@/hooks/useMapContext';
import { useTripContext } from '@/hooks/useTrip';

const PlaceDetails = () => {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const { fitPlace } = useMapContext();
  const { activities, destinations } = useTripContext();
  const router = useRouter();

  const [place, setplace] = useState<Place>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentActivity, setCurrentActivity] = useState<Activity>();
  const [currentDestination, setCurrentDestination] = useState<Destination>();

  const [needBooking, setNeedBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [date, setDate] = useState<Date>();

  const fetchPlace = async () => {
    if (placeId && place?.id !== placeId && !loading) {
      setLoading(true);
      try {
        const responsePlace = await MapsService.getDetaisForPlaceId(placeId);
        setplace(responsePlace);
        setCurrentActivity(activities?.find((a) => a.placeId === placeId));
        setDate(currentActivity?.dateTime);
        setCurrentDestination(
          destinations?.find((d) =>
            d.activities?.find((a) => a.placeId === placeId)
          )
        );
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
    return <ActivityIndicator />
  }

  const closeButtonCallback = () => {
    router.back();
  }

  return (
    <BottomSheetView
      headerImageUrl={MapsService.getPhotoForPlace(place.images ?? [])}
      closeButtonCallback={closeButtonCallback}
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
        <ThemedView style={styles.headerActions}>
          {currentActivity && (
            <ThemedButton
              title="Remove"
              icon="trash"
              type={ButtonType.Delete}
              onPress={() => console.log('add')}
              style={styles.actionButton}
            />
          )}
          {!currentActivity && (
            <ThemedButton
              title="Add"
              icon="plus"
              onPress={() => console.log('add')}
              style={styles.actionButton}
            />
          )}
          <ThemedButton
            title="Go To Website"
            icon="globe"
            type={ButtonType.Secondary}
            onPress={() => console.log('web')}
            style={styles.actionButton}
          />
        </ThemedView>
      </ThemedView>
      <ThemedView background style={styles.body}>
        {currentActivity && (
          <CardView style={styles.inlineTitleInput}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="calendar" color={Colors.blue} />
              <ThemedText type={TextType.Bold}>Date</ThemedText>
            </ThemedView>
            <DatePicker
              value={date ?? currentDestination!.startDate}
              onChange={(_, date) => setDate(date)}
              minimumDate={currentDestination!.startDate}
              maximumDate={currentDestination!.endDate}
            />
          </CardView>
        )}
        {currentActivity && (
          <CardView style={styles.inlineTitleInput}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="dollarsign" color={Colors.blue} />
              <ThemedText type={TextType.Bold}>Price</ThemedText>
            </ThemedView>
            <InputMoney
              model={currentActivity.price}
              onValueChange={(price) => (currentActivity.price = price)}
              style={{ maxWidth: 200, flex: 1 }}
            />
          </CardView>
        )}
        {currentActivity && (
          <CardView style={styles.inlineTitleInput}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="ticket.fill" color={Colors.blue} />
              <ThemedText type={TextType.Bold}>Needs Booking</ThemedText>
            </ThemedView>
            <ThemedSwitch
              value={needBooking}
              onValueChange={(val) => setNeedBooking(val)}
            />
          </CardView>
        )}

        {(currentActivity && needBooking) && (
          <CardView style={styles.inlineTitleInput}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="ticket.fill" color={Colors.blue} />
              <ThemedText type={TextType.Bold}>Booked</ThemedText>
            </ThemedView>
            <ThemedSwitch
              value={booked}
              onValueChange={(val) => setBooked(val)}
            />
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
  headerActions: {
    flexDirection: 'row',
    width: '100%',
    gap: largeSpacing,
  },
  actionButton: {
    flex: 1,
  },
  body: {
    padding: largeSpacing,
    gap: largeSpacing,
  },
  inlineTitleInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default PlaceDetails;
