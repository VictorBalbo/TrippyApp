import Map, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { useTripContext } from '@/hooks/useTrip';
import { useEffect, useRef, useState } from 'react';

const MapView = () => {
  const { activities, destinations, housings } = useTripContext();
  const mapRef = useRef<Map | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<
    ['destinations' | 'activities' | 'housings']
  >(['destinations']);

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

  return (
    <Map 
      ref={mapRef}
      key={activities?.length}
      collapsableChildren={false}
      style={styles.map}
    >
      {visibleMarkers.includes('activities') &&
        activities?.map((a) => (
          <Marker
            key={a.id}
            title={a.place.name}
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
    </Map >
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    width: 20,
    height: 20,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 20, // To make it a circle
    backgroundColor: 'red',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 20,
    borderTopColor: 'red',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});

export default MapView;
