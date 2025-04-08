import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { useTripContext } from '@/hooks/useTrip';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Place } from '@/models';
import { useMapContext } from '@/hooks/useMapContext';

const Map = () => {
  const { activities, destinations, housings } = useTripContext();
  const { markers } = useMapContext();
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<
    ('destinations' | 'activities' | 'housings')[]
  >(['destinations', 'activities', 'housings']);

  useEffect(() => {
    if (destinations) {
      fitMapToMarkers(destinations.map((d) => d.place));
    }
  }, [destinations]);

  useEffect(() => {
    if (markers.length) {
      fitMapToMarkers(markers);
    }
  }, [markers]);

  const onSelectActivity = (placeId: string) => {
    router.push({
      pathname: '/views/PlaceDetails',
      params: { placeId },
    });
  };
  const onSelectDestination = (destinationId: string) => {
    router.push({
      pathname: '/views/DestinationDetails',
      params: { destinationId },
    });
  };
  const fitMapToMarkers = (markers: Place[]) => {
    if (mapRef.current && markers.length) {
      if (markers.length === 1) {
        mapRef.current.animateToRegion({
          latitude: markers[0].coordinates.lat,
          longitude: markers[0].coordinates.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      } else {
        mapRef.current.fitToCoordinates(
          markers.map((m) => ({
            latitude: m.coordinates.lat,
            longitude: m.coordinates.lng,
          })),
          {
            edgePadding: { top: 50, right: 50, bottom: 200, left: 50 },
            animated: true,
          }
        );
      }
    }
  };

  return (
    <MapView
      ref={mapRef}
      key={activities?.length}
      collapsableChildren={false}
      style={styles.map}
    >
      {visibleMarkers.includes('activities') &&
        activities?.map((a) => (
          <Marker
            key={'1' + a.id}
            onSelect={(e) => onSelectActivity(a.place.id)}
            coordinate={{
              latitude: a.place.coordinates.lat,
              longitude: a.place.coordinates.lng,
            }}
            pinColor="red"
            zIndex={0}
          />
        ))}
      {visibleMarkers.includes('destinations') &&
        destinations?.map((d) => (
          <Marker
            key={'2' + d.id}
            coordinate={{
              latitude: d.place.coordinates.lat,
              longitude: d.place.coordinates.lng,
            }}
            pinColor="blue"
            zIndex={5}
            onSelect={() => onSelectDestination(d.id)}
          ></Marker>
        ))}
      {visibleMarkers.includes('housings') &&
        housings?.map((h) => (
          <Marker
            key={h.id}
            title={h.place.name}
            coordinate={{
              latitude: h.place.coordinates.lat,
              longitude: h.place.coordinates.lng,
            }}
            pinColor="green"
            zIndex={4}
          />
        ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default Map;
