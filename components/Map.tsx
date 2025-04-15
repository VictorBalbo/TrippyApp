import MapView, { Marker, MapMarker, Polyline } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { useTripContext } from '@/hooks/useTrip';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useGlobalSearchParams } from 'expo-router';
import { Place } from '@/models';
import { useMapContext } from '@/hooks/useMapContext';

const Map = () => {
  const { activities, destinations, housings, transportations } =
    useTripContext();
  const { centeredMarkers, selectedMarker } = useMapContext();
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const markerRefs = useRef<Record<string, MapMarker | null>>({});
  const [visibleMarkers, setVisibleMarkers] = useState<
    ('destinations' | 'activities' | 'housings' | 'transportations')[]
  >(['destinations', 'activities', 'housings', 'transportations']);
  const pathName = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    if (destinations) {
      fitMapToMarkers(destinations.map((d) => d.place));
    }
  }, [destinations]);

  useEffect(() => {
    if (centeredMarkers.length) {
      fitMapToMarkers(centeredMarkers);
    }
  }, [centeredMarkers]);

  useEffect(() => {
    console.log('centeredMarkers selectedMarker', selectedMarker);

    if (selectedMarker) {
      const ref = markerRefs.current[selectedMarker.id];
      console.log('centeredMarkers', ref);
      if (ref) {
        ref.showCallout(); // iOS selection behavior
      }
    } else {
      Object.values(markerRefs.current).forEach((ref) => {
        if (ref) {
          ref.hideCallout(); // iOS selection behavior
        }
      });
    }
  }, [selectedMarker]);

  const onSelectActivity = (placeId: string) => {
    if (params?.placeId !== placeId) {
      console.log('selected activity', pathName, params);
      router.push({
        pathname: '/views/PlaceDetails',
        params: { placeId },
      });
    }
  };
  const onSelectStation = (placeId: string) => {
    if (params?.placeId !== placeId) {
      console.log('selected station', pathName, params);
      router.push({
        pathname: '/views/StationDetails',
        params: { placeId },
      });
    }
  };
  const onSelectDestination = (destinationId: string) => {
    console.log('selected destination', destinationId);
    if (params?.destinationId !== destinationId) {
      router.push({
        pathname: '/views/DestinationDetails',
        params: { destinationId },
      });
    }
  };
  const fitMapToMarkers = (markers: Place[]) => {
    if (mapRef.current && markers.length) {
      if (markers.length === 1) {
        mapRef.current.animateToRegion({
          latitude: markers[0].coordinates.lat - 0.0075,
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
            key={a.placeId}
            ref={(ref) => {
              markerRefs.current[a.placeId] = ref;
            }}
            onSelect={() => onSelectActivity(a.place.id)}
            coordinate={{
              latitude: a.place.coordinates.lat,
              longitude: a.place.coordinates.lng,
            }}
            pinColor={
              a.place.categories?.some((c) => c.includes('Restaurant'))
                ? 'orange'
                : 'red'
            }
            zIndex={0}
          />
        ))}
      {visibleMarkers.includes('destinations') &&
        destinations?.map((d) => (
          <Marker
            key={d.placeId}
            ref={(ref) => {
              markerRefs.current[d.placeId] = ref;
            }}
            coordinate={{
              latitude: d.place.coordinates.lat,
              longitude: d.place.coordinates.lng,
            }}
            pinColor="blue"
            zIndex={15}
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
      {visibleMarkers.includes('transportations') &&
        transportations?.map((t) => (
          <Marker
            key={t.originTerminalId}
            ref={(ref) => {
              markerRefs.current[t.originTerminalId] = ref;
            }}
            onSelect={() => onSelectStation(t.originTerminalId)}
            coordinate={{
              latitude: t.originTerminal.coordinates.lat,
              longitude: t.originTerminal.coordinates.lng,
            }}
            pinColor="purple"
            zIndex={3}
          />
        ))}
      {visibleMarkers.includes('transportations') &&
        transportations?.map((t) => (
          <Marker
            key={t.destinationTerminalId}
            ref={(ref) => {
              markerRefs.current[t.destinationTerminalId] = ref;
            }}
            onSelect={() => onSelectStation(t.destinationTerminalId)}
            coordinate={{
              latitude: t.destinationTerminal.coordinates.lat,
              longitude: t.destinationTerminal.coordinates.lng,
            }}
            pinColor="purple"
            zIndex={3}
          />
        ))}
      {visibleMarkers.includes('transportations') &&
        transportations?.map((t) => (
          <Polyline
            key={t.originTerminalId + t.destinationTerminalId}
            coordinates={t.path.map((c) => ({
              latitude: c.lat,
              longitude: c.lng,
            }))}
            fillColor="blue"
            strokeColor="blue"
            strokeWidth={2}
            geodesic={true}
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
