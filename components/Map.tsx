import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { useTripContext } from '@/hooks/useTrip';
import { useEffect, useRef, useState } from 'react';
import { usePlaceContext } from '@/hooks/usePlaceContext';
import { useRouter } from 'expo-router';

const Map = () => {
  const { activities, destinations, housings } = useTripContext();
  const { setPlaceId } = usePlaceContext();
  const router = useRouter
  ()
  const mapRef = useRef<MapView | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<
    ['destinations' | 'activities' | 'housings']
  >(['activities']);

  useEffect(() => {
    if (mapRef.current && destinations?.length) {
      mapRef.current.fitToCoordinates(
        destinations.map((d) => ({
          latitude: d.place.coordinates.lat,
          longitude: d.place.coordinates.lng,
        })),
        {
          edgePadding: { top: 25, right: 25, bottom: 25, left: 25 },
          animated: true,
        }
      );
    }
  }, [destinations]);

  const onSelectActivity = (id: string) => {
    setPlaceId(id)
    router.push('/views/PlaceDetails')
  }

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
            key={a.id}
            onSelect={(e) => onSelectActivity(a.place.id)}
            id={a.id+ '-1'}
            identifier={a.id+ '-2'}
            coordinate={{
              latitude: a.place.coordinates.lat,
              longitude: a.place.coordinates.lng,
            }}
            pinColor="red"
            zIndex={2}
          />
        ))}
      {visibleMarkers.includes('destinations') &&
        destinations?.map((d) => (
          <Marker
            key={d.id}
            title={d.place.name}
            tracksViewChanges={true}
            coordinate={{
              latitude: d.place.coordinates.lat,
              longitude: d.place.coordinates.lng,
            }}
            pinColor="blue"
            zIndex={5}
            onSelect={() => onSelectActivity(d.id)}
          >
            
          </Marker>
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
    </MapView >
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
