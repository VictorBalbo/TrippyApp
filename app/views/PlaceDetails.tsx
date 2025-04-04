import { ActivityIndicator, Image, StyleSheet } from 'react-native';
import { ParallaxScrollView } from '@/components/ParallaxScrollView';
import { TextType, ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { MapsService } from '@/services';
import { IconSymbol } from '@/components/ui/Icon/IconSymbol';
import { Colors } from '@/constants/Theme';
import { useThemeProperty } from '@/hooks/useTheme';
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
import { useLocalSearchParams } from 'expo-router';
import { Place } from '@/models';
import { useMapContext } from '@/hooks/useMapContext';

const PlaceDetails = () => {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const { fitPlace } = useMapContext();

  const [place, setplace] = useState<Place>();
  const [loading, setLoading] = useState<boolean>(false);

  const [price, setPrice] = useState<{ value?: number; currency?: string }>({});
  const [needBooking, setNeedBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const fetchPlace = async () => {
    if (placeId && place?.id !== placeId && !loading) {
      setLoading(true);
      try {
        const responsePlace = await MapsService.getDetaisForPlaceId(placeId);
        setplace(responsePlace);
        if (responsePlace) {
          fitPlace(responsePlace);
        }
      } catch (err) {
        console.log('Error');
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

  return (
    <ParallaxScrollView
      headerComponent={
        <Image
          style={{ flex: 1 }}
          source={{
            uri: MapsService.getPhotoForPlace(place.images ?? []),
          }}
        />
      }
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
          <ThemedButton
            title="Add"
            icon="plus"
            onPress={() => console.log('add')}
            style={styles.actionButton}
          />
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
        <CardView style={styles.inlineTitleInput}>
          <ThemedView style={styles.iconTitle}>
            <IconSymbol name="calendar" color={Colors.blue} />
            <ThemedText type={TextType.Bold}>Date</ThemedText>
          </ThemedView>
          <DatePicker value={new Date()} />
        </CardView>

        <CardView style={styles.inlineTitleInput}>
          <ThemedView style={styles.iconTitle}>
            <IconSymbol name="dollarsign" color={Colors.blue} />
            <ThemedText type={TextType.Bold}>Price</ThemedText>
          </ThemedView>
          <InputMoney
            model={price}
            onValueChange={setPrice}
            style={{ maxWidth: 200, flex: 1 }}
          />
        </CardView>

        <CardView style={styles.inlineTitleInput}>
          <ThemedView style={styles.iconTitle}>
            <IconSymbol name="ticket" color={Colors.blue} />
            <ThemedText type={TextType.Bold}>Needs Booking</ThemedText>
          </ThemedView>
          <ThemedSwitch
            value={needBooking}
            onValueChange={(val) => setNeedBooking(val)}
          />
        </CardView>

        {needBooking && (
          <CardView style={styles.inlineTitleInput}>
            <ThemedView style={styles.iconTitle}>
              <IconSymbol name="ticket" color={Colors.blue} />
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
              <IconSymbol name="info.circle" color={Colors.blue} />
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
                  <IconSymbol name="phone" color={Colors.blue} />
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
                  <IconSymbol name="map" color={Colors.blue} />
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
              <IconSymbol name="clock" color={Colors.blue} />
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
    </ParallaxScrollView>
  );
};

const smallSpacing = useThemeProperty('smallSpacing');
const largeSpacing = useThemeProperty('largeSpacing');

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
