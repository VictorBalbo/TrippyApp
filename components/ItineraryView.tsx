import { Activity, Coordinates, DistanceBetweenPlaces } from '@/models';
import { ThemedView } from './ui/ThemedView';
import { Pressable, StyleSheet } from 'react-native';
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
import { IconSymbol } from './ui/Icon/IconSymbol';
import { getMapsDirectionLink } from '@/utils/mapsUtils';
import { Colors } from '@/constants/Theme';
import { useRouter } from 'expo-router';

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
  const router = useRouter();
  const [activitiesByDate, seActivitiesByDate] = useState<
    Record<string, Activity[]>
  >({});
  const [distanceByDate, setDistanceByDate] = useState<Record<string, number>>(
    {}
  );
  const [distancesBetweenPlaces, setDistancesBetweenPlaces] = useState<
    Record<string, DistanceBetweenPlaces>
  >({});
  let mapWalkingPaths: DistanceBetweenPlaces[];

  useEffect(() => {
    groupActivitiesByDate();
  }, [activities, startDate, endDate]);

  const groupActivitiesByDate = async () => {
    mapWalkingPaths = [];
    const daysDiff = utcDate(endDate).diff(utcDate(startDate), 'day');
    const noDateActivities = activities.filter((a) => !a.dateTime);
    if (noDateActivities.length) {
      seActivitiesByDate((i) => ({ ...i, ['No Date']: noDateActivities }));
    }

    for (let i = 0; i <= daysDiff; i++) {
      const day = utcDate(startDate).add(i, 'day');
      const dayStr = day.format('ddd, DD/MM');
      const dayActivities = activities
        .filter((a) => isSameDay(a.dateTime, day.toDate()))
        .sort(
          (a, b) => (a.dateTime?.getTime() ?? 0) - (b.dateTime?.getTime() ?? 0)
        );
      seActivitiesByDate((i) => ({ ...i, [dayStr]: dayActivities }));

      for (let i = 1; i < dayActivities.length; i++) {
        const previousActivity = dayActivities[i - 1];
        const currentActivity = dayActivities[i];
        fetchActivitiesDistances(previousActivity, currentActivity, dayStr);
      }
    }
  };

  const fetchActivitiesDistances = async (
    activity1: Activity,
    activity2: Activity,
    dateStr: string
  ) => {
    const distance = getDistanceBetween(activity1, activity2);
    if (distance) {
      mapWalkingPaths.push(distance);
      setDistanceByDate((distances) => {
        const dateDistance =
          (distances[dateStr] ?? 0) + distance.walking.distance;
        return {
          ...distances,
          [dateStr]: dateDistance,
        };
      });
    }
    if (!distance) {
      const distance = await MapsService.getDistaceBetweenPlaces(
        activity1.place.id,
        activity2.place.id
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
        mapWalkingPaths.push(distance);
        setDistancesBetweenPlaces((placesDistances) => {
          const distaceKey = `${activity1.place.id}:${activity2.place.id}`;
          return { ...placesDistances, [distaceKey]: distance };
        });
        setDistanceByDate((distances) => {
          const dateDistance =
            (distances[dateStr] ?? 0) + distance.walking.distance;
          return {
            ...distances,
            [dateStr]: dateDistance,
          };
        });
      }
    }
  };

  const getDistanceBetween = (activity1?: Activity, activity2?: Activity) =>
    distancesBetweenPlaces[`${activity1?.place.id}:${activity2?.place.id}`];

  const backgroundColor = useThemeColor('backgroundAccent');
  const borderColor = useThemeColor('border');
  const linkColor = useThemeColor('link');
  if (Object.keys(activitiesByDate).length === 0) {
    return <ThemedView></ThemedView>;
  }

  return (
    <CardView style={styles.card}>
      {Object.entries(activitiesByDate).map(([date, activities], i) => (
        <ThemedView
          key={date}
          style={[i !== 0 ? styles.itineraryDate : '', { borderColor }]}
        >
          <ThemedText type={TextType.Subtitle}>{date}</ThemedText>
          <ThemedText type={TextType.Small}>
            Total waliking distance:{' '}
            {getDisplayDistanceFromMeters(distanceByDate[date] ?? 0)}
          </ThemedText>
          {activities.map((a, i) => (
            <ThemedView key={a.id}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/views/PlaceDetails',
                    params: { placeId: a.place.id },
                  })
                }
                style={[styles.activity, { backgroundColor }]}
              >
                <IconSymbol
                  name="mappin"
                  style={styles.activityImage}
                  size={40}
                  color={Colors.red}
                />
                <ThemedView style={styles.activityInfo}>
                  <ThemedView>
                    <ThemedText
                      type={TextType.Bold}
                      ellipsizeMode="tail"
                      numberOfLines={1}
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
                </ThemedView>
              </Pressable>
              {getDistanceBetween(a, activities[i + 1]) && (
                <ThemedView style={styles.activityDistanceToNext}>
                  <IconSymbol name="figure.walk" color={linkColor} />
                  <ExternalLink
                    href={getMapsDirectionLink(
                      a.place,
                      activities[i + 1].place,
                      'walking'
                    )}
                  >
                    {getDisplayDistanceFromMeters(
                      getDistanceBetween(a, activities[i + 1]).walking.distance
                    )}
                    {' · '}
                    {getDisplayDurationFromSeconds(
                      getDistanceBetween(a, activities[i + 1]).walking.duration
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
    width: '20%',
    alignSelf: 'center',
  },
  activityDistanceToNext: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: smallSpacing,
  },
});
