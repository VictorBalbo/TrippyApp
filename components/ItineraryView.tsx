import { Activity, Coordinates, DistanceBetweenPlaces } from '@/models';
import { ThemedView } from './ui/ThemedView';
import { Image, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { isSameDay, utcDate } from '@/utils/dateUtils';
import { MapsService } from '@/services';
import { decode as decodePolyline } from '@googlemaps/polyline-codec';
import { TextType, ThemedText } from './ui/ThemedText';
import { CardView } from './ui/CardView';
import {
  getDisplayDistanceFromMeters,
  getDisplayDurationFromSeconds,
} from '@/utils/numberFormat';
import { useThemeColor, getThemeProperty } from '@/hooks/useTheme';
import { ExternalLink } from './ExternalLink';
import { sanitizeUrl } from '@/utils/urlSanitize';
import { IconSymbol } from './ui/Icon/IconSymbol';
import { getMapsDirectionLink } from '@/utils/mapsUtils';

type DateItinerary = {
  activities: Activity[];
  distance: number;
};

type ItineraryViewProps = {
  activities: Activity[];
  startDate: Date;
  endDate: Date;
};
export const ItineraryView = ({
  activities,
  startDate,
  endDate,
}: ItineraryViewProps) => {
  const [dateItinerary, setDateItinerary] =
    useState<Record<string, DateItinerary>>();
  const [distancesBetweenPlaces, setDistancesBetweenPlaces] = useState<
    Record<string, DistanceBetweenPlaces>
  >({});
  let mapWalkingPaths: DistanceBetweenPlaces[];

  useEffect(() => {
    fetchActivitiesDistances();
  }, [activities, startDate, endDate]);

  const fetchActivitiesDistances = async () => {
    mapWalkingPaths = [];
    const daysDiff = utcDate(endDate).diff(utcDate(startDate), 'day');
    const itinerary: Record<string, DateItinerary> = {};
    const placesDistances: Record<string, DistanceBetweenPlaces> =
      distancesBetweenPlaces;

    const noDateActivities = activities.filter((a) => !a.dateTime);
    if (noDateActivities.length || itinerary['No Date']) {
      itinerary['No Date'] = {
        activities: noDateActivities,
        distance: 0,
      };
    }

    for (let i = 0; i <= daysDiff; i++) {
      const day = utcDate(startDate).add(i, 'day');
      const dayStr = day.format('ddd, DD/MM');
      const dayActivities = activities
        .filter((a) => isSameDay(a.dateTime, day.toDate()))
        .sort(
          (a, b) => (a.dateTime?.getTime() ?? 0) - (b.dateTime?.getTime() ?? 0)
        );
      itinerary[dayStr] = {
        distance: 0,
        activities: dayActivities,
      };

      for (let i = 1; i < dayActivities.length; i++) {
        const previousActivity = dayActivities[i - 1];
        const currentActivity = dayActivities[i];
        const distance =
          placesDistances[
            `${previousActivity.place.id}:${currentActivity.place.id}`
          ];
        if (distance) {
          mapWalkingPaths.push(distance);
          itinerary[dayStr].distance += distance.walking.distance;
        } else {
          const distance = await MapsService.getDistaceBetweenPlaces(
            previousActivity.place.id,
            currentActivity.place.id
          );
          if (distance) {
            distance.walking.decodedPolyline = decodePolyline(
              distance.walking.polyline
            ).map((c) => {
              const coordinates: Coordinates = {
                lat: c[0],
                lng: c[1],
              };
              return coordinates;
            });
            placesDistances[
              `${previousActivity.place.id}:${currentActivity.place.id}`
            ] = distance;
            mapWalkingPaths.push(distance);
            itinerary[dayStr].distance += distance.walking.distance;
          }
        }
      }
    }
    setDateItinerary(itinerary);
    setDistancesBetweenPlaces(placesDistances);
  };

  const getDistanceBetween = (activity1?: Activity, activity2?: Activity) =>
    distancesBetweenPlaces[`${activity1?.place.id}:${activity2?.place.id}`];

  const backgroundColor = useThemeColor('backgroundAccent');
  const borderColor = useThemeColor('border');
  const linkColor = useThemeColor('link');
  if (dateItinerary) {
    return (
      <CardView style={styles.card}>
        {Object.entries(dateItinerary).map(([date, itinerary], i) => (
          <ThemedView
            key={date}
            style={[i !== 0 ? styles.itineraryDate : '', { borderColor }]}
          >
            <ThemedText type={TextType.Subtitle}>{date}</ThemedText>
            <ThemedText type={TextType.Small}>
              Total waliking distance:{' '}
              {getDisplayDistanceFromMeters(itinerary.distance)}
            </ThemedText>
            {itinerary.activities.map((a, i) => (
              <ThemedView key={a.id}>
                <ThemedView style={[styles.activity, { backgroundColor }]}>
                  <ThemedView style={styles.activityInfo}>
                    <ThemedView>
                      <ThemedText
                        type={TextType.Bold}
                        ellipsizeMode="tail"
                        numberOfLines={2}
                      >
                        {a.place.name}
                      </ThemedText>
                      {a.place.categories?.length && (
                        <ThemedText type={TextType.Small}>
                          {a.place.categories[0]}
                        </ThemedText>
                      )}
                    </ThemedView>
                    {a.dateTime && (
                      <ThemedText type={TextType.Default}>
                        {utcDate(a.dateTime).format('ddd, DD/MM - HH:mm')}
                      </ThemedText>
                    )}
                    {(a.website || a.place.website) && (
                      <ExternalLink
                        href={(a.website || a.place.website)!}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      >
                        {sanitizeUrl((a.website || a.place.website)!)}
                      </ExternalLink>
                    )}
                  </ThemedView>
                  <Image
                    source={{
                      uri: MapsService.getPhotoForPlace(a.place.images ?? []),
                    }}
                    style={styles.activityImage}
                  />
                </ThemedView>
                {getDistanceBetween(a, itinerary.activities[i + 1]) && (
                  <ThemedView style={styles.activityDistanceToNext}>
                    <IconSymbol name="figure.walk" color={linkColor} />
                    <ExternalLink
                      href={getMapsDirectionLink(
                        a.place,
                        itinerary.activities[i + 1].place,
                        'walking'
                      )}
                    >
                      {getDisplayDistanceFromMeters(
                        getDistanceBetween(a, itinerary.activities[i + 1])
                          .walking.distance
                      )}
                      {' · '}
                      {getDisplayDurationFromSeconds(
                        getDistanceBetween(a, itinerary.activities[i + 1])
                          .walking.duration
                      )}
                    </ExternalLink>
                  </ThemedView>
                )}
              </ThemedView>
            ))}
          </ThemedView>
        ))}
      </CardView>
    );
  } else {
    return <ThemedView></ThemedView>;
  }
};
const smallSpacing = getThemeProperty('smallSpacing');
const borderRadius = getThemeProperty('borderRadius');
const styles = StyleSheet.create({
  card: {
    gap: smallSpacing,
  },
  itineraryDate: {
    borderTopWidth: 1,
    paddingTop: smallSpacing,
  },
  activity: {
    marginTop: smallSpacing,
    borderWidth: 1,
    borderRadius: borderRadius,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  activityInfo: {
    padding: smallSpacing,
    gap: smallSpacing / 2,
    flex: 1,
  },
  activityImage: {
    width: '30%',
  },
  activityDistanceToNext: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: smallSpacing,
  },
});
